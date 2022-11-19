import request from '@/utils/request';

/* 用户登录 */
export function loginApi(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data,
  });
}

/* 获取登录用户信息 */
export function getUserInfo() {
  return request({
    url: '/sys/user/info',
    method: 'get',
  });
}

/* 退出登录 */
export function logout() {
  return request({
    url: '/logout',
    method: 'get',
  });
}