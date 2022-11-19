import Cookies from 'js-cookie';

const loginStatus = 'loginStatus';

export function getLoginStatus() {
  return Cookies.get(loginStatus);
}

export function setLoginStatus(status) {
  return Cookies.set(loginStatus, status, { expires: 7 }); // 默认7天
}

export function removeLoginStatus() {
  return Cookies.remove(loginStatus);
}
