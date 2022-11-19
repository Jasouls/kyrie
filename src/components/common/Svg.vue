<template>
  <div class="svg-home">
    <div class="title">
      <svg width="300" height="100">
        <text x="0" y="60%">KYRIE</text>
      </svg>
    </div>
    <div class="main">
      <svg-icon icon-class="wind" v-show="count === 0"></svg-icon>
      <svg-icon icon-class="rock" v-show="count === 1"></svg-icon>
      <svg-icon icon-class="thunder" v-show="count === 2"></svg-icon>
      <svg-icon icon-class="grass" v-show="count === 3"></svg-icon>
      <svg-icon icon-class="water" v-show="count === 4"></svg-icon>
      <svg-icon icon-class="fire" v-show="count === 5"></svg-icon>
      <svg-icon icon-class="ice" v-show="count === 6"></svg-icon>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  setup() {
    const router = useRouter();
    const count = ref(0);
    onMounted(() => {
      console.log(router);
      setInterval(() => {
        if (count.value === 6) {
          count.value = 0;
        } else {
          count.value += 1;
        }
      }, 3000)
    })

    return {
      count,
    }
  }
})
</script>