<template>
  <div class="home w-100 h-100 flex-col">
    <div class="home-top flex-between">
      <div class="top-nav flex">
        <div class="item high-item" :class="{ 'active': router.currentRoute.value.meta.title === 'SVG' }" @click="tabChange('SVG')">SVG</div>
        <div class="item high-item" :class="{ 'active': router.currentRoute.value.meta.title === 'CANVAS' }" @click="tabChange('CANVAS')">CANVAS</div>
        <div class="item high-item" :class="{ 'active': router.currentRoute.value.meta.title === 'D3' }" @click="tabChange('D3')">D3</div>
        <div class="item high-item" :class="{ 'active': router.currentRoute.value.meta.title === 'ECHARTS' }" @click="tabChange('ECHARTS')">ECHARTS</div>
        <div class="item high-item" :class="{ 'active': router.currentRoute.value.meta.title === 'MAP' }" @click="tabChange('MAP')">MAP</div>
      </div>
      <div class="logout" @click="logBack">Logout</div>
    </div>
    <div class="home-main">
      <router-view />
    </div>
  </div>
</template>

<script>
import { logout } from '@/api/user'
import store from '@/store'
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter();
    const currentTab = ref('SVG');

    const tabChange = (val) => {
      currentTab.value = val;
      router.push({ name: val })
    }

    const logBack = () => {
      logout().then(() => {
        store.dispatch('UserLogout');
        router.push({ name: 'login' });
      })
    }
    return {
      logBack,
      currentTab,
      tabChange,
      router,
    }
  } 
})
</script>