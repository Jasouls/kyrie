<template>
  <div class="map-home w-100 h-100">
    <div id="map" class="map-home w-100 h-100"></div>
    <div class="paint-list">
      <div class="paint-item" @click="paint('Point')">Point</div>
      <div class="paint-item" @click="paint('LineString')">Line</div>
      <div class="paint-item" @click="paint('Polygon')">Polygon</div>
      <div class="paint-item" @click="paint('Circle')">Circle</div>
      <div class="paint-item" @click="paint('Square')">Square</div>
      <div class="paint-item" @click="paint('Box')">Box</div>
      <div class="paint-item" @click="paint('Star')">Star</div>
    </div>
    <div class="clear-paint">
      <div class="clear-item" @click="clearPaint('Point')">P</div>
      <div class="clear-item" @click="clearPaint('LineString')">L</div>
      <div class="clear-item" @click="clearPaint('Polygon')">S</div>
      <div class="clear-item" @click="clearPaint('Circle')">C</div>
      <div class="clear-item" @click="clearPaint('All')">A</div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import { Map, View } from "ol";
import * as olProj from "ol/proj";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as VectorSource } from "ol/source";
import { FullScreen, MousePosition, Zoom } from "ol/control";
import Polygon from 'ol/geom/Polygon';
import Draw, {
  createBox,
  createRegularPolygon,
} from 'ol/interaction/Draw';

export default defineComponent({
  setup() {
    const openMap = ref('');
    const source = new VectorSource({wrapX: false});
    const initMap = () => {
      openMap.value = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new XYZ({
              url: "https://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
            }),
          }),
          new VectorLayer({
            source: source,
          })
        ],
        view: new View({
          // 将西安作为地图中心 
          center: olProj.fromLonLat([108.945951, 34.465262]),
          zoom: 1,
        }),
        controls: [new FullScreen(), new MousePosition(), new Zoom()],
      })
    }
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
      } else {
        source.getFeatures().filter(i => i.getGeometry().getType() === layer).forEach(p => {
          source.removeFeature(p);
        })
      }
      // source.clear(layer);
    }
    onMounted(() => {
      initMap();
    })
    return {
      openMap,
      currentVal,
      draw,
      addInteraction,
      paint,
      clearPaint,
    }
  }
})
</script>