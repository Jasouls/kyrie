<template>
  <div id="gant" class="echarts w-100 h-100"></div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import * as echarts from 'echarts';

export default defineComponent({
  setup() {
    const baseDate = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;
    const roomData = ['k1', 'k2', 'k3', 'k4'];
    const colorList = ['red', 'blue', 'green', 'black'];
    const gantData = [
      {
        value: [
          {
            index: 0,
            roomName: 'k1',
            roomId: '1',
            id: '111',
            startTime: `${baseDate} 2:00`,
            endTime: `${baseDate} 4:00`,
            status: 1,
            content: 'haxilama'
          },
        ],
      },
      {
        value: [
          {
            index: 0,
            roomName: 'k1',
            roomId: '1',
            id: '111',
            startTime: `${baseDate} 12:00`,
            endTime: `${baseDate} 14:00`,
            status: 1,
            content: 'naruto'
          },
        ],
      },
      {
        value: [
          {
            index: 0,
            roomName: 'k1',
            roomId: '1',
            id: '111',
            startTime: `${baseDate} 18:00`,
            endTime: `${baseDate} 22:00`,
            status: 1,
            content: 'kobe'
          },
        ],
      },
      {
        value: [
          {
            index: 1,
            roomName: 'k2',
            roomId: '2',
            id: '112',
            startTime: `${baseDate} 6:00`,
            endTime: `${baseDate} 10:00`,
            status: 2,
            content: 'silutici',
          },
        ],
      },
      {
        value: [
          {
            index: 1,
            roomName: 'k2',
            roomId: '2',
            id: '112',
            startTime: `${baseDate} 13:00`,
            endTime: `${baseDate} 20:00`,
            status: 2,
            content: 'nash',
          },
        ],
      },
      {
        value: [
          {
            index: 2,
            roomName: 'k3',
            roomId: '3',
            id: '1122',
            startTime: `${baseDate} 12:00`,
            endTime: `${baseDate} 16:00`,
            status: 3,
            content: 'omito',
          },
        ],
      },
      {
        value: [
          {
            index: 3,
            roomName: 'k4',
            roomId: '3',
            id: '1122',
            startTime: `${baseDate} 00:00`,
            endTime: `${baseDate} 03:00`,
            status: 4,
            content: 'dsm',
          },
        ],
      },
      {
        value: [
          {
            index: 3,
            roomName: 'k4',
            roomId: '3',
            id: '1122',
            startTime: `${baseDate} 7:00`,
            endTime: `${baseDate} 11:00`,
            status: 4,
            content: 'pdd',
          },
        ],
      },
      {
        value: [
          {
            index: 3,
            roomName: 'k4',
            roomId: '3',
            id: '1122',
            startTime: `${baseDate} 15:00`,
            endTime: `${baseDate} 19:00`,
            status: 4,
            content: 'white',
          },
        ],
      },
    ]
    const gantInit = () => {
      const container = document.getElementById('gant');
      echarts.init(container).dispose();
      const myChart = echarts.init(container);
      const option = {
        color: '#000',
        backgroundColor: '#fff',
        title: {},
        tooltip: {
          trigger: 'item',
          show: true,
          formatter: function(params) {
            return params.value[0].content;
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          top: '10%',
          bottom: '10%',
          containLabel: true,
        },
        xAxis: {
          type: 'time',
          position: 'bottom',
          interval: 3600 * 1000,
          max: `${baseDate} 24:00`,
          min: `${baseDate} 00:00`,
          axislabel: {
            formatter: function(val,index) {
              return new Date(val).getHours() + ':00';
            },
            textStyle: {
              color: '#000',
              fontSize: 14,
            }
          },
          axisLine: {
            lineStyle: {
              color: '#000',
            },
            onZero: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
            },
          },
        },
        yAxis: {
          inverse: true,
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#000',
            },
          },
          data: roomData,
          axisLabel: {
            textStyle: {
              color: '#000',
              fontSize: 14,
            },
          },
        },
        series: [
          {
            type: 'custom',
            clickable: false,
            renderItem: function(params, api) {
              const categoryIndex = api.value(0).index;
              const start = api.coord([api.value(0).startTime,categoryIndex]);
              const end = api.coord([api.value(0).endTime, categoryIndex]);
              const height = 40;
              return {
                type: 'rect',
                shape: echarts.graphic.clipRectByRect(
                  {
                    x: start[0],
                    y: start[1] - height / 2,
                    width: end[0] - start[0],
                    height: 40,
                  },
                  {
                    x: params.coordSys.x,
                    y: params.coordSys.y,
                    width: params.coordSys.width,
                    height: params.coordSys.height,
                  }
                ),
                style: api.style(),
              };
            },
            label: {
              normal: {
                show: true,
                position: 'insideBottom',
                formatter: function (params) {
                  return params.value[0].content;
                },
                textStyle: {
                  align: 'center',
                  fontSize: 14,
                  fontWeight: '400',
                  lineHeight: '30',
                },
              },
            },
            encode: {
              x: 1,
              y: 0,
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.value[0].status - 1];
                },
              }
            },
            data: gantData, 
          },
        ],
      };
      myChart.setOption(option);
      window.onresize = function () {
        myChart.resize();
      }
    }
    onMounted(() => {
      gantInit();
    })
  }
})
</script>