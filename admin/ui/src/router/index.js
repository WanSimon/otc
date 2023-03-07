import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: {title: '首页', icon: 'el-icon-s-home', affix: true}
      }
    ]
  },

];

export const asyncRoutes = [
  {
    path: '/device',
    component: Layout,
    name: '设备管理',
    redirect: '/device/group',
    meta: {
      title: '设备管理',
      icon: 'el-icon-s-platform'
    },
    children: [
      {
        path: 'group',
        name: '设备组',
        menu_key: 'menu_device_group',
        component: () => import('@/views/deviceGroup/index'),
        meta: {title: '设备组列表'}
      },
      {
        path: 'groupEdit/:id',
        name: '编辑设备组',
        component: () => import('@/views/deviceGroup/edit'),
        meta: {title: '编辑设备组', icon: 'form', activeMenu: '/device/group'},
        hidden: true
      },
      {
        path: 'groupAdd',
        name: '创建设备组',
        component: () => import('@/views/deviceGroup/edit'),
        meta: {title: '创建设备组', icon: 'form', activeMenu: '/device/group'},
        hidden: true
      },
      {
        path: 'device',
        name: '设备',
        menu_key: 'menu_device',
        component: () => import('@/views/device/index'),
        meta: {title: '设备列表'},
      },
      {
        path: 'deviceEdit/:id',
        name: '编辑设备',
        component: () => import('@/views/device/edit'),
        meta: {title: '编辑设备', icon: 'form', activeMenu: '/device/device'},
        hidden: true
      },
      {
        path: 'deviceAdd',
        name: '创建设备',
        component: () => import('@/views/device/edit'),
        meta: {title: '创建设备', icon: 'form', activeMenu: '/device/device'},
        hidden: true
      },
      {
        path: 'channel/:id',
        name: '药道详情',
        component: () => import('@/views/device/channel'),
        meta: {title: '药道详情', activeMenu: '/device/device',},
        hidden: true
      },
      {
        path: 'stock',
        name: '设备库存',
        component: () => import('@/views/stock/index'),
        meta: {title: '设备列表', icon: 'list'},
        redirect: '/device/device',
        hidden: true,
        children: [
          {
            path: 'stock/:id',
            name: '库存',
            component: () => import('@/views/stock/list'),
            meta: {title: '库存', activeMenu: '/device/device'},
          },
          {
            path: 'stockEdit',
            name: '编辑库存',
            component: () => import('@/views/stock/edit'),
            meta: {title: '编辑库存', activeMenu: '/device/device'},
          },
          {
            path: 'stockDetail/:id/:pid',
            name: '库存详情',
            component: () => import('@/views/stock/detail'),
            meta: {title: '库存详情', activeMenu: '/device/device'},
          }
        ]
      },
      {
        path: 'order/:eid',
        name: '设备订单',
        component: () => import('@/views/deviceOrder/index'),
        meta: {title: '设备订单', activeMenu: '/device/device'},
        hidden: true
      },
      {
        path: 'model',
        name: '设备型号',
        menu_key: 'menu_device_type',
        component: () => import('@/views/deviceModel/index'),
        meta: {title: '设备型号列表'}
      },
      {
        path: 'modelChannel/:id',
        name: '药道详情',
        component: () => import('@/views/deviceModel/channel'),
        meta: {title: '药道详情', activeMenu: '/device/model',},
        hidden: true
      },
      {
        path: 'modelEdit/:id',
        name: '编辑设备型号',
        component: () => import('@/views/deviceModel/edit'),
        meta: {title: '编辑设备型号', activeMenu: '/device/model'},
        hidden: true
      },
      {
        path: 'modelAdd',
        name: '创建设备型号',
        component: () => import('@/views/deviceModel/edit'),
        meta: {title: '创建设备型号', activeMenu: '/device/model'},
        hidden: true
      },
    ],
  },
  {
    path: '/product',
    component: Layout,
    name: '药品管理',
    redirect: '/product/product',
    meta: {
      title: '药品管理',
      icon: 'el-icon-first-aid-kit'
    },
    children: [
      {
        path: 'product',
        name: '药品列表',
        menu_key: 'menu_product',
        component: () => import('@/views/product/index'),
        meta: {title: '药品列表'}
      },
      {
        path: 'editProduct/:id',
        name: '编辑药品',
        component: () => import('@/views/product/edit'),
        meta: {title: '编辑药品', activeMenu: '/product/product'},
        hidden: true
      },
      {
        path: 'addProduct',
        name: '新增药品',
        component: () => import('@/views/product/edit'),
        meta: {title: '新增药品', activeMenu: '/product/product'},
        hidden: true
      },
      {
        path: 'goods',
        name: '商品列表',
        menu_key: 'menu_merchant_product',
        component: () => import('@/views/merchantProduct/index'),
        meta: {title: '商品列表'}
      },
      {
        path: 'editGoods/:id',
        name: '编辑商品',
        component: () => import('@/views/merchantProduct/edit'),
        meta: {title: '编辑商户药品', activeMenu: '/product/goods'},
        hidden: true
      },
      {
        path: 'addGoods',
        name: '新增商品',
        component: () => import('@/views/merchantProduct/edit'),
        meta: {title: '新增商户药品', activeMenu: '/product/goods'},
        hidden: true
      },
      {
        path: 'symptom',
        name: '症状列表',
        menu_key: 'menu_symptom',
        component: () => import('@/views/symptom/index'),
        meta: {title: '症状列表'}
      },
      {
        path: 'editSymptom/:id',
        name: '编辑症状',
        component: () => import('@/views/symptom/edit'),
        meta: {title: '编辑症状', activeMenu: '/product/symptom'},
        hidden: true
      },
      {
        path: 'addSymptom',
        name: '添加症状',
        component: () => import('@/views/symptom/edit'),
        meta: {title: '添加症状', activeMenu: '/product/symptom'},
        hidden: true
      },
      {
        path: 'category',
        name: '药品分类',
        menu_key: 'menu_category',
        component: () => import('@/views/productCategory/index'),
        meta: {title: '药品分类', affix: true}
      },
      {
        path: 'categoryEdit/:id',
        name: '编辑药品分类',
        component: () => import('@/views/productCategory/edit'),
        meta: {title: '编辑药品分类', activeMenu: '/product/category'},
        hidden: true
      },
      {
        path: 'categoryAdd',
        name: '创建药品分类',
        component: () => import('@/views/productCategory/edit'),
        meta: {title: '创建药品分类', activeMenu: '/product/category'},
        hidden: true
      }
    ]
  },
  {
    path: '/merchant',
    component: Layout,
    name: '商户管理',
    redirect: '/merchant/merchant',
    meta: {
      title: '商户管理',
      icon: 'el-icon-s-shop'
    },
    children: [
      {
        path: 'merchant',
        name: '商户',
        menu_key: 'menu_merchant',
        component: () => import('@/views/merchant/index'),
        meta: {title: '商户', icon: 'el-icon-s-shop'}
      },
    ]
  },
  {
    path: '/account',
    component: Layout,
    name: '账户管理',
    redirect: '/account/account',
    meta: {
      title: '账户管理',
      icon: 'el-icon-user'
    },
    children: [
      {
        path: 'account',
        name: '账户',
        menu_key: 'menu_account',
        component: () => import('@/views/account/list'),
        meta: {title: '账户', icon: 'el-icon-user'}
      },
      {
        path: 'editAccount/:id',
        name: '编辑账户',
        component: () => import('@/views/account/edit'),
        meta: {title: '编辑账户', activeMenu: '/account/account'},
        hidden: true
      },
      {
        path: 'addAccount',
        name: '新增账户',
        component: () => import('@/views/account/edit'),
        meta: {title: '新增账户', activeMenu: '/account/account'},
        hidden: true
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    name: '会员管理',
    redirect: '/member/member',
    meta: {
      title: '会员管理',
      icon: 'vip'
    },
    children: [
      {
        path: 'member',
        name: '会员',
        menu_key: 'menu_member',
        component: () => import('@/views/member/list'),
        meta: {title: '会员', icon: 'vip'}
      },
    ]
  },
  {
    path: '/role',
    component: Layout,
    name: '权限管理',
    redirect: '/role/role',
    meta: {
      title: '权限管理',
      icon: 'peoples'
    },
    children: [
      {
        path: 'role',
        name: '角色',
        menu_key: 'menu_role',
        component: () => import('@/views/role/index'),
        meta: {title: '角色', icon: 'peoples'}
      },
      {
        path: 'roleEdit/:id',
        name: '编辑角色',
        component: () => import('@/views/role/edit'),
        meta: {title: '编辑角色', activeMenu: '/role/role'},
        hidden: true
      },
      {
        path: 'roleAdd',
        name: '创建角色',
        component: () => import('@/views/role/edit'),
        meta: {title: '创建角色', activeMenu: '/role/role'},
        hidden: true
      }
    ]
  },
  {
    path: '/warning',
    component: Layout,
    name: '预警管理',
    redirect: '/warning/rules',
    meta: {
      title: '预警管理',
      icon: 'el-icon-warning'
    },
    children: [
      {
        path: 'rules',
        name: '预警规则',
        menu_key: 'menu_warning_rule',
        component: () => import('@/views/warningRules/index'),
        meta: {title: '预警规则'}
      },
      {
        path: 'rulesEdit/:id',
        name: '编辑预警规则',
        component: () => import('@/views/warningRules/edit'),
        meta: {title: '编辑预警规则', activeMenu: '/warning/rules'},
        hidden: true
      },
      {
        path: 'rulesAdd',
        name: '新增预警规则',
        component: () => import('@/views/warningRules/edit'),
        meta: {title: '新增预警规则', activeMenu: '/warning/rules'},
        hidden: true
      },
      {
        path: 'logs',
        name: '预警记录',
        menu_key: 'menu_warning_log',
        component: () => import('@/views/warningLogs/list'),
        meta: {title: '预警记录'}
      },
    ]
  },
  {
    path: '/event',
    component: Layout,
    name: '事件',
    redirect: '/event',
    meta: {
      title: '事件',
      icon: 'el-icon-s-management'
    },
    children: [
      {
        path: 'logs',
        name: '错误事件',
        menu_key: 'menu_event_log',
        component: () => import('@/views/event/log'),
        meta: {title: '错误事件'}
      },
      {
        path: 'handleLogs/:id',
        name: '处理错误事件',
        component: () => import('@/views/event/handle_log'),
        meta: {title: '处理错误事件', icon: 'form', activeMenu: '/event/logs'},
        hidden: true
      },
      {
        path: 'stock',
        name: '库存事件',
        menu_key: 'menu_stock_log',
        component: () => import('@/views/event/stock'),
        meta: {title: '库存事件'}
      },
      {
        path: 'userLogin',
        name: '设备登录记录',
        menu_key: 'menu_user_login',
        component: () => import('@/views/userLogin/index'),
        meta: {title: '设备登录记录'}
      },
    ]
  },
  {
    path: '/report',
    component: Layout,
    name: '报表',
    redirect: '/report/order',
    meta: {
      title: '报表',
      icon: 'el-icon-s-order'
    },
    children: [
      {
        path: 'order',
        name: '商家订单',
        menu_key: 'menu_order',
        component: () => import('@/views/order/index'),
        meta: {title: '商家订单', activeMenu: '/report/order'}
      },
      {
        path: 'report',
        name: '销售报表',
        menu_key: 'menu_merchant_order',
        component: () => import('@/views/report/index'),
        meta: {title: '销售报表', activeMenu: '/report/report'}
      },
      {
        path: 'refund/apply',
        name: '退款申请',
        menu_key: 'menu_refund_apply',
        component: () => import('@/views/refundApply/index'),
        meta: {title: '退款申请', activeMenu: '/report/refund/apply'}
      },
      {
        path: 'refund/apply/handle/:id',
        name: '处理退款申请',
        component: () => import('@/views/refundApply/edit'),
        meta: {title: '处理退款申请', activeMenu: '/report/refund/apply'},
        hidden: true
      },
      {
        path: 'replenish',
        name: '补货单',
        menu_key: 'menu_replenish',
        component: () => import('@/views/replenish/index'),
        meta: {title: '补货单', activeMenu: '/report/replenish'}
      },
    ]
  },
  {
    path: '/notice',
    component: Layout,
    name: '公告',
    redirect: '/notice/notice',
    meta: {
      title: '公告',
      icon: 'nested'
    },
    children: [
      {
        path: 'notice',
        name: '公告列表',
        menu_key: 'menu_notice',
        component: () => import('@/views/notice/list'),
        meta: {title: '公告列表', icon: 'el-icon-chat-square'}
      },
      {
        path: 'noticeEdit/:id',
        name: '编辑公告',
        component: () => import('@/views/notice/edit'),
        meta: {title: '编辑公告', activeMenu: '/notice/notice'},
        hidden: true
      },
      {
        path: 'noticeAdd',
        name: '新增公告',
        component: () => import('@/views/notice/edit'),
        meta: {title: '新增公告', activeMenu: '/notice/notice'},
        hidden: true
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: '系统管理',
    redirect: '/system/version',
    meta: {
      title: '系统管理',
      icon: 'el-icon-setting'
    },
    children: [
      {
        path: 'version',
        name: '版本管理',
        menu_key: 'menu_version',
        component: () => import('@/views/version/index'),
        meta: {title: '版本管理', icon: 'el-icon-setting'}
      },
      {
        path: 'versionEdit/:id',
        name: '编辑版本',
        component: () => import('@/views/version/edit'),
        meta: {title: '编辑版本', activeMenu: '/system/version'},
        hidden: true
      },
      {
        path: 'versionAdd',
        name: '新增版本',
        component: () => import('@/views/version/edit'),
        meta: {title: '新增版本', activeMenu: '/system/version'},
        hidden: true
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true}
];
//用于角色配置菜单
export const asyncRoutesCopy = JSON.parse(JSON.stringify(asyncRoutes));

export const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher // reset router
}

export function reloadMenu(accessAoutes) {
  router.options.routes = [...constantRoutes, ...accessAoutes];
  router.addRoutes(accessAoutes);
}

export default router
