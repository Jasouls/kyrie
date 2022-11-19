import router from '@/router';
import store from '@/store';
import { getLoginStatus } from '@/utils/auth';

router.beforeEach((to, from, next) => {
  console.log(to, from, next);
  if (getLoginStatus()) {
    if (to.path === '/') {
      next();
    } else {
      if (!store.state.user.userName) {
        store.dispatch('GetUserInfo').then(() => {
          next();
        }).catch(() => {
          store.dispatch('UserLogout').then(() => {
            next({ name: 'SVG' });
          });
        });
      } else {
        next();
      }
    }
  } else {
    if (to.path === '/') {
      next();
    } else {
      next({ name: 'login' });
    }
  }
});
