import Vue from 'vue'
import router from './router'
import {constantRoutes,asyncRoutes,reloadMenu} from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import de from 'element-ui/src/locale/lang/de'
import Layout from '@/layout/index'



NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login']; // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' });
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name;
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          Vue.prototype.$ELEMENT.size = 'small';
          // get user info
          let info = await store.dispatch('user/getInfo');

          let menuKeyArr = info.menuKeyStr.split(',');
          let accessAoutes = [];
          let routes = asyncRoutes;
          for(let i=0;i<routes.length;i++){
            let router = routes[i];
            if(router.children){
              let children = [];
              let hasMenu = false;
              for(let j=0;j<router.children.length;j++){
                let r = router.children[j];
                if(r.hidden) children.push(r);
                else if(menuKeyArr.includes(r.menu_key))
                {
                  hasMenu = true;
                  children.push(r);
                }
              }
              if(hasMenu){
                router.children = children;
                accessAoutes.push(router);
              }
            }
            else {
              accessAoutes.push(router);
            }
          }
          reloadMenu(accessAoutes);
          next({ ...to, replace: true });
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken');
          Message.error(error || 'Has Error');
          next(`/login?redirect=${to.path}`);
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done()
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
});
