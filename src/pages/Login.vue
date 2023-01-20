<template>
  <div class="login w-100 h-100">
    <canvas id="login" width="1920" height="936"></canvas>
    <div class="login-form flex-col">
      <div id="tiger">
        <div class="e75" id="e75">谢谢参与</div>
        <canvas id="maus" width="200" height="50"></canvas>
      </div>
      <a-form
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="Username"
          name="username"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item class="text-right">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import md5 from 'md5';
import store from '@/store'
import { defineComponent, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const formState = reactive({
      username: '',
      password: '',
    });

    const router = useRouter();

    const onFinish = values => {
      console.log('Success:', values);
      store.dispatch('UserLogin', {
        username: values.username,
        password: md5(md5(values.password)),
      }).then((res) => {
        router.push({ name: 'CSS3' });
      })
    };

    const onFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo);
    };
    const initView = () => {
      let ballArr = [];
      const myCanvas = document.getElementById('login');
      const ctx = myCanvas.getContext('2d');
      class Ball {
        x = Math.floor(Math.random() * myCanvas.width);
        y = Math.floor(Math.random() * myCanvas.height);
        r = 10;
        color = 'gray';
        dx = Math.floor(Math.random() * 10) - 5;
        dy = Math.floor(Math.random() * 10) - 5;
        constructor() {
          ballArr.push(this);
        }
        render() {
          if (ctx !== null) {
            ctx.beginPath();
            ctx.globalAlpha = 1;
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
          }
        }
        update() {
          this.x += this.dx;
          if (this.x <= this.r) {
            this.x = this.r;
          } else if (this.x >= myCanvas.width - this.r) {
            this.x = myCanvas.width - this.r;
          }
          this.y += this.dy;
          if (this.y <= this.r) {
            this.y = this.r;
          } else if (this.y >= myCanvas.height - this.r) {
            this.y = myCanvas.height - this.r;
          }
          if (this.x + this.r >= myCanvas.width || this.x - this.r <= 0) {
            this.dx *= -1;
          }
          if (this.y + this.r >= myCanvas.height || this.y - this.r <= 0) {
            this.dy *= -1;
          }
        }
      }
      for(let i = 0;i < 20;i++) {
        new Ball();
      }
      setInterval(() => {
        if (ctx !== null) {
          ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
        }
        for(let i = 0;i < ballArr.length;i++) {
          ballArr[i].render();
          ballArr[i].update();
        }
        if (ctx !== null) {
          for(let i = 0;i < ballArr.length;i++) {
            for(let j = i + 1;j < ballArr.length;j++) {
              let distance = Math.sqrt(Math.pow((ballArr[i].x - ballArr[j].x), 2) + Math.pow((ballArr[i].y - ballArr[j].y), 2));
              if (distance <= 150) {
                ctx.strokeStyle = '#000';
                ctx.beginPath();
                ctx.globalAlpha = 1 - distance / 150;
                ctx.moveTo(ballArr[i].x, ballArr[i].y);
                ctx.lineTo(ballArr[j].x, ballArr[j].y);
                ctx.closePath();
                ctx.stroke();
              }
            }
          }
        }
      }, 20)
    }
    const initPaint = () => {
      const canvas = document.getElementById('maus');
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 200, 50);
      let isDraw = false;
      canvas.onmousedown = function() {
        isDraw = true;
      }
      document.onmouseup = function() {
        isDraw = false;
      }
      const Tiger = document.getElementById('tiger');
      const E75 = document.getElementById('e75');
      canvas.onmousemove = function(e) {
        if (isDraw) {
          const x = e.pageX - Tiger.offsetLeft;
          const y = e.pageY - Tiger.offsetTop;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.globalCompositeOperation = 'destination-out';
          ctx.fill();
          ctx.closePath();
        }
      }
      const arr = [
        {
          content: '大吉大利',
          p: 0.1,
        }
      ]
      const r = Math.random();
      if (r < arr[0].p) {
        E75.innerHTML = arr[0].content;
        E75.style.color = 'red';
        E75.style.fontWeight = 'bold';
      }
    }
    onMounted(() => {
      initView();
      initPaint();
    })

    return {
      formState,
      onFinish,
      onFinishFailed,
    };
  },
});
</script>