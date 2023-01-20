<template>
  <div class="map-home w-100 h-100">
    <!-- <div ref="box" class="box">我是div</div> -->
    <div id="map" class="map-home w-100 h-100"></div>
    <div id="mouse-position"></div>
    <div class="paint-list">
      <div class="paint-item" @click="paint('Point')">Point</div>
      <div class="paint-item" @click="paint('LineString')">Line</div>
      <div class="paint-item" @click="paint('Polygon')">Polygon</div>
      <div class="paint-item" @click="paint('Circle')">Circle</div>
      <div class="paint-item" @click="paint('Square')">Square</div>
      <div class="paint-item" @click="paint('Box')">Box</div>
      <div class="paint-item" @click="paint('Star')">Star</div>
      <div class="paint-item" @click="bezier">Bezier</div>
      <div class="paint-item" @click="bezier2">Bezier2</div>
    </div>
    <div class="clear-paint">
      <div class="clear-item" @click="clearPaint('Point')">P</div>
      <div class="clear-item" @click="clearPaint('LineString')">L</div>
      <div class="clear-item" @click="clearPaint('Polygon')">S</div>
      <div class="clear-item" @click="clearPaint('Circle')">C</div>
      <div class="clear-item" @click="clearPaint('All')">A</div>
      <div class="clear-item" @click="clearPaint('Bezier')">B</div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
// import Overlay from 'ol/Overlay';
import { Map, View, Feature } from "ol";
import * as olProj from "ol/proj";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as VectorSource } from "ol/source";
import { FullScreen, MousePosition, Zoom } from "ol/control";
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import {createStringXY} from 'ol/coordinate';
import { Style, Stroke, Circle as CircleStyle } from 'ol/style';
import {getVectorContext} from 'ol/render';
import { Select } from 'ol/interaction';
import Draw, {
  createBox,
  createRegularPolygon,
} from 'ol/interaction/Draw';

export default defineComponent({
  setup() {
    // const box = ref(null);
    // map对象
    const openMap = ref('');
    // 贝塞尔曲线绘制激活
    const isBezier = ref(false);
    // 二次贝塞尔曲线绘制激活
    const isBezier2 = ref(false);
    // 贝塞尔曲线坐标数组
    const bezierList = ref([]);
    // 二次贝塞尔曲线多维数组
    const bezier2List = ref([]);
    const selectSingleClick = new Select();
    const mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: 'EPSG:4326',
      // comment the following two lines to have the mouse position
      // be placed within the map.
      className: 'custom-mouse-position',
      target: document.getElementById('mouse-position'),
    });
    const source = new VectorSource({wrapX: false});
    const tileLayer = new TileLayer({
      source: new XYZ({
        url: "https://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
      }),
    })
    // let overlayForm = {};
    // 初始化地图
    const initMap = () => {
      openMap.value = new Map({
        target: "map",
        layers: [
          tileLayer,
          new VectorLayer({
            source: source,
          })
        ],
        view: new View({
          // 将西安作为地图中心 
          center: olProj.fromLonLat([108.945951, 34.465262]),
          zoom: 1,
          projection: 'EPSG:3857',
        }),
        controls: [new FullScreen(), mousePositionControl, new Zoom()],
      })
      // overlayForm = new Overlay({
      //   element: box.value,
      //   autoPan: true,
      //   autoPanAnimation: {
      //     duration: 250,
      //   }
      // })
      // overlayForm.setPosition(undefined);
      // openMap.value.addOverlay(overlayForm);
      openMap.value.on('click', mapClick);
      openMap.value.addInteraction(selectSingleClick);
      selectSingleClick.on('select', function(e) {
        e.stopPropagation();
        var features = e.target.getFeatures().getArray();
        if (features.length > 0 && features[0].getGeometry().getType() === 'Point') {
          console.log('被点击了');
        }
      })
      pointAnimation();
    }
    // 当前的绘制类型
    const currentVal = ref('None');
    const draw = ref(''); // global so we can remove it later
    const addInteraction = () => {
      let value = currentVal.value;
      if (value !== 'None') {
        let geometryFunction;
        if (value === 'Square') {
          value = 'Circle';
          geometryFunction = createRegularPolygon(4);
        } else if (value === 'Box') {
          value = 'Circle';
          geometryFunction = createBox();
        } else if (value === 'Star') {
          value = 'Circle';
          geometryFunction = function (coordinates, geometry) {
            const center = coordinates[0];
            const last = coordinates[coordinates.length - 1];
            const dx = center[0] - last[0];
            const dy = center[1] - last[1];
            const radius = Math.sqrt(dx * dx + dy * dy);
            const rotation = Math.atan2(dy, dx);
            const newCoordinates = [];
            const numPoints = 12;
            for (let i = 0; i < numPoints; ++i) {
              const angle = rotation + (i * 2 * Math.PI) / numPoints;
              const fraction = i % 2 === 0 ? 1 : 0.5;
              const offsetX = radius * fraction * Math.cos(angle);
              const offsetY = radius * fraction * Math.sin(angle);
              newCoordinates.push([center[0] + offsetX, center[1] + offsetY]);
            }
            newCoordinates.push(newCoordinates[0].slice());
            if (!geometry) {
              geometry = new Polygon([newCoordinates]);
            } else {
              geometry.setCoordinates([newCoordinates]);
            }
            return geometry;
          };
        }
        draw.value = new Draw({
          source: source,
          type: value,
          geometryFunction: geometryFunction,
        });
        openMap.value.addInteraction(draw.value);
      }
    }
    const paint = (val) => {
      openMap.value.removeInteraction(draw.value);
      if(currentVal.value === val) {
        currentVal.value = 'None';
        addInteraction();
      } else {
        currentVal.value = val;
        addInteraction();
      }
    }
    const clearPaint = (layer) => {
      console.log(draw.value, layer, source.getFeatures()[0].getGeometry().getType(), source);
      if (layer === 'All') {
        source.clear();
      } else if (layer === 'Bezier') {
        source.getFeatures().filter(i => i.getGeometry().getType() === 'LineString').forEach(p => {
          source.removeFeature(p);
        })
        bezierList.value.splice(0);
        bezier2List.value.splice(0);
        isBezier.value = false;
        isBezier2.value = false;
      } else {
        source.getFeatures().filter(i => i.getGeometry().getType() === layer).forEach(p => {
          source.removeFeature(p);
        })
      }
      // source.clear(layer);
    }
    const bezier = () => {
      isBezier2.value = false;
      isBezier.value = !isBezier.value;
    }
    const bezier2 = () => {
      isBezier.value = false;
      isBezier2.value = !isBezier2.value;
      if (!isBezier2.value) {
        bezier2List.value.pop();
      }
    }
    const mapClick = (evt) => {
      console.log(evt, evt.coordinate);
      // let pixel = evt.pixel;
      // let mouse = evt.coordinate;
      // let feature = openMap.value.forEachFeatureAtPixel(pixel, (feature) => {
      //   return feature;
      // })
      // if (feature) {
      //   overlayForm.setPosition(mouse);
      // } else {
      //   overlayForm.setPosition(undefined);
      // }
      if (isBezier.value) {
        bezierList.value.push(evt.coordinate);
        if (bezierList.value.length < 2) {
          return;
        }
        const result = createBezierCurvePoints(bezierList.value.length - 1, bezierList.value);
        source.getFeatures().filter(i => i.getGeometry().getType() === 'LineString').forEach(p => {
          source.removeFeature(p);
        })
        let o = 0;
        window.timer = setInterval(() => {
          createLine(result.filter((p, i) => i <= o));
          if (o < 99) {
            o += 1;
          } else {
            clearInterval(window.timer);
          }
        }, 20)
        // createLine(result);
      } else if (isBezier2.value) {
        if (!bezier2List.value.length) {
          bezier2List.value.push([]);
          bezier2List.value[0].push(evt.coordinate);
        } else {
          if (bezier2List.value[bezier2List.value.length - 1].length < 2) {
            bezier2List.value[bezier2List.value.length - 1].push(evt.coordinate);
            bezier2List.value[bezier2List.value.length - 1].splice(1, 0, [(bezier2List.value[bezier2List.value.length - 1][0][0] + (bezier2List.value[bezier2List.value.length - 1][1][0] - bezier2List.value[bezier2List.value.length - 1][0][0]) / 4), (bezier2List.value[bezier2List.value.length - 1][0][1] + Math.abs(bezier2List.value[bezier2List.value.length - 1][1][0] - bezier2List.value[bezier2List.value.length - 1][0][0]) / 2)]);
            const result = createBezierCurvePoints(2, bezier2List.value[bezier2List.value.length - 1]);
            // createLine(result);
            let o = 0;
            window.timer = setInterval(() => {
              createLine(result.filter((p, i) => i <= o));
              if (o < 99) {
                o += 1;
              } else {
                clearInterval(window.timer);
              }
            }, 20)
            bezier2List.value.push([]);
            bezier2List.value[bezier2List.value.length - 1].push(evt.coordinate);
          } else {
            bezier2List.value.push([]);
            bezier2List.value[bezier2List.value.length - 1].push(evt.coordinate);
          }
        }
      }
    }
    const factorial = (num) => {
      if (num <= 1) {
        return 1;
      } else {
        return num * factorial(num - 1);
      }
    }
    const createLine = (result) => {
      console.log(bezierList.value);
      const feature = new Feature({
        geometry: new LineString(result)
      });
      const style = new Style({
          stroke: new Stroke({ //边界样式
              color: 'black',
              width: 3,
              // lineDash: [1, 2, 3, 4, 5, 6],
          })
      })
      feature.setStyle(style);
      source.addFeature(feature);
    }
    const createBezierCurvePoints = (n, arrPoints) => {
      let Ptx = 0;
      let Pty = 0;
      const LineString = [];
      for (let t = 0; t < 1.00; t = t + 0.01) {
        Ptx = 0;
        Pty = 0;
        for (let i = 0; i <= n; i++) {
            Ptx += (factorial(n) / (factorial(i) * factorial(n - i))) * Math.pow(1 - t, n - i) * Math.pow(t,
                i) * arrPoints[i][0];
            Pty += (factorial(n) / (factorial(i) * factorial(n - i))) * Math.pow(1 - t, n - i) * Math.pow(t,
                i) * arrPoints[i][1];
        }
        LineString.push([Ptx, Pty]);
      }
      return LineString;
    }
    // 点扩散动画方法
    const pointAnimation = () => {
      function flash(feature) {
        if (feature.getGeometry().getType() === 'LineString') {
          return;
        }
        const flashGeom = feature.getGeometry().clone();
        const listenerKey = tileLayer.on('postrender', animate);
        let radius = 5;
        function animate(event) {
          if (radius > 30) {
            radius = 5;
          }
          const vectorContext = getVectorContext(event);
          const opacity = (30 - radius) / 25;
          const style = new Style({
            image: new CircleStyle({
              radius: radius,
              stroke: new Stroke({
                color: 'rgba(255, 0, 0, ' + opacity + ')',
                width: 0.25 + opacity,
              }),
            }),
          });
          radius = radius + 0.25;

          vectorContext.setStyle(style);
          vectorContext.drawGeometry(flashGeom);
          openMap.value.render();
        }
      }

      source.on('addfeature', function (e) {
        flash(e.feature);
        setTimeout(() => {
          flash(e.feature);
        }, 600)
      });
    }
    onMounted(() => {
      initMap();
    })
    return {
      // box,
      openMap,
      currentVal,
      draw,
      addInteraction,
      paint,
      clearPaint,
      bezier,
      bezier2,
    }
  }
})
</script>

<style>
/* .box {
  width: 100px;
  height: 100px;
  background-color: #bfa;
  position: absolute;
} */
</style>