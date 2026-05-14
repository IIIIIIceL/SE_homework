import { ROUTES } from '../constants/routes';

export const menuConfig = [
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
