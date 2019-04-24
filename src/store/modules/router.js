/**
 * Created by wangkai on 2019-04-20
 * 路由列表全局控制
 */
import { menus } from 'router';
import { fetchRouter } from 'api/user';

import { getAuthMenus } from 'utils/user';

/**
 * 将所有侧边栏对象处理成一维数组
 * @param menus
 * @param result
 */
const router = {
  namespaced: true,
  state: {
    authInfo: {},
    menus: [],
    hasGetRouter: false
  },
  getters: {
    page (state) {
      return state.authInfo.page || {};
    },
    component (state) {
      return state.authInfo.component || {};
    }
  },
  mutations: {
    SET_MENUS (state, { authInfo, menus, hasGetRouter }) {
      localStorage.setItem('authInfo', JSON.stringify(authInfo));
      state.menus = menus;
      state.authInfo = authInfo;
      state.hasGetRouter = hasGetRouter;
    },
    SET_ROUTER_STATUS (state, status) {
      state.hasGetRouter = status;
    }
  },
  actions: {
    GET_MENUS ({ commit }) {
      // 调用实机：1. 用户登录之后， 2. 权限发生变化之后
      return fetchRouter().then(
        res => {
          // 当访问不存在路由的时候由后端提示
          const copyMenus = JSON.parse(JSON.stringify(menus));
          const authMenus = getAuthMenus(copyMenus, res.data);
          commit('SET_MENUS', { authInfo: res.data, menus: authMenus, hasGetRouter: true });
          return Promise.resolve({ authInfo: res.data, menus: authMenus, hasGetRouter: true });
        }
      );
    }
  }
};
export default router;
/*
* 权限问题梳理：
*   1. 在用户登录以后获取权限信息
*   2. 用户如果刷新页面，要重新获取权限信息（传参：用户信息，要在beforeRouter之前调用）
* */
