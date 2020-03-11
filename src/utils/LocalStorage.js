import { LOCAL_STORAGE } from '@/utils/constant/localStorage';

export default class LocalStorage {

  static setToken(token) {
    if (!token) {
      return;
    }
    localStorage.setItem(LOCAL_STORAGE.TOKEN, token);
  }

  static getToken() {
    return localStorage.getItem(LOCAL_STORAGE.TOKEN);
  }
}