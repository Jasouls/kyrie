<template>
  <div class="canvas-home w-100 h-100" id="box">
    <canvas id="mycanvas"></canvas>
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  setup() {
    const initView = () => {
      const flow = document.getElementById('mycanvas');
      const box = document.getElementById('box');
      flow.width = box.clientWidth;
      flow.height = box.clientHeight;
      const context = flow.getContext('2d');
      let ballArr = [];
      flow.addEventListener('mousemove', (event) => {
        ballArr.push(new Ball(event.offsetX, event.offsetY));
      })
      class Ball {
        color = '';
        r = 0;
        dx = 0;
        dy = 0;
        constructor(x,y) {
          this.x = x;
          this.y = y;
          this.color = this.getRandomColor();
          this.r = Math.floor(Math.random() * 100 + 1);
          this.dx = Math.floor(Math.random() * 10) - 5;
          this.dy = Math.floor(Math.random() * 10) - 5;
        }
        getRandomColor() {
          let allType = '0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f';
          let allTypeArr = allType.split(',');
          let color = '#';
          for (let i = 0; i < 6; i++) {
            let random = Math.floor(Math.random() * allTypeArr.length);
            color += allTypeArr[random];
          }
          return color;
        }
        update() {
          this.x += this.dx;
          this.y += this.dy;
          this.r -= 0.5;
          if (this.r <= 0) {
            this.remove();
          }
        }
        remove() {
          for (let i = 0; i < ballArr.length; i++) {
            if (ballArr[i] === this) {
              ballArr.splice(i, 1);
            }
          }
        }
        render() {
          if (context) {
            context.beginPath();
            context.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
            context.fillStyle = this.color;
            context.fill();
          }
        }
      }
      setInterval(() => {
        if (context) {
          context.clearRect(0, 0, flow.clientWidth, flow.height);
        }
        for (let i = 0;i < ballArr.length; i++) {
          ballArr[i].update();
          if (ballArr[i]) {
            ballArr[i].render();
          }
        }
      }, 20)
    }
    onMounted(() => {
      initView();
    })
  }
})

</script>