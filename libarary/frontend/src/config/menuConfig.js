import { ROUTES } from '../constants/routes';

export const adminMenuConfig = [
  {
    key: 'dashboard',
    label: '首页',
    path: ROUTES.dashboard,
    description: '系统总览与快捷入口'
  },
  {
    key: 'books',
    label: '图书管理',
    path: ROUTES.books,
    description: '书目、库存与上下架管理'
  },
  {
    key: 'readers',
    label: '读者管理',
    path: ROUTES.readers,
    description: '读者档案与借阅额度管理'
  },
  {
    key: 'borrows',
    label: '借阅管理',
    path: ROUTES.borrows,
    description: '借书、还书、续借与超期处理'
  },
  {
    key: 'system',
    label: '系统管理',
    path: ROUTES.systemDashboard,
    description: '角色、用户与操作日志'
  }
];

export const readerMenuConfig = [
  {
    key: 'reader-home',
    label: '我的首页',
    path: ROUTES.readerHome,
    description: '查看借阅状态与到期提醒'
  },
  {
    key: 'reader-books',
    label: '图书检索',
    path: ROUTES.readerBooks,
    description: '查询馆藏图书与可借数量'
  },
  {
    key: 'reader-borrows',
    label: '我的借阅',
    path: ROUTES.readerBorrows,
    description: '查看个人借阅历史与续借'
  },
  {
    key: 'reader-profile',
    label: '个人资料',
    path: ROUTES.readerProfile,
    description: '查看读者档案与联系方式'
  }
];

export const menuConfig = adminMenuConfig;
