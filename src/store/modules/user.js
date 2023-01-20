import { loginApi, getUserInfo } from '@/api/user';
import { setLoginStatus, removeLoginStatus } from '@/utils/auth';

const user = {
  state: {
    userId: '',
    userName: '',
    roleId: '',
    loginStatus: false,
  },
  mutations: {
    SET_LOGINSTATUS: (state, loginStatus) => {
      state.loginStatus = loginStatus;
    },
    SET_USERINFO: (state, userInfo) => {
      state.userName = userInfo.username;
      state.userId = userInfo.userId;
      state.roleId = userInfo.roleId;
    },
  },
  actions: {
    UserLogin({ commit }, param) {
      console.log(param);
      return new Promise((resolve, reject) => {
        setLoginStatus(true);
        resolve();
        // loginApi(param).then((res) => {
        //   const data = res.data;
        //   if (data.status === 200) {
        //     commit('SET_LOGINSTATUS', true);
        //     setLoginStatus(true);
        //   }
        //   resolve(res);
        // }).catch((err) => {
        //   reject(err);
        // });
      });
    },
    // 获取用户信息
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_USERINFO', {});
        resolve();
        // getUserInfo().then((res) => {
        //   const data = res.data;
        //   if (data.status === 200) {
        //     commit('SET_USERINFO', data.result);
        //     resolve(res);
        //   } else {
        //     reject(data.message);
        //   }
        // });
      });
    },
    // 用户手动登出
    UserLogout({ commit }) {
      return new Promise((resolve) => {
        commit('SET_LOGINSTATUS', false);
        commit('SET_USERINFO', {});
        removeLoginStatus();
        resolve();
        // disconnect();
        // commit('SET_LOGINSTATUS', false);
        // commit('SET_USERINFO', {});
        // TODO 清除路由信息
        // removeLoginStatus();
        // resolve();
      });
    },
  }
}

export default user;