import { ROUTES } from '../constants/routes';

export const menuConfig = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: ROUTES.dashboard,
    description: 'Overview and quick access'
  },
  {
    key: 'books',
    label: 'Books',
    path: ROUTES.books,
    description: 'Catalog and inventory management'
  },
  {
    key: 'borrows',
    label: 'Borrows',
    path: ROUTES.borrows,
    description: 'Borrow, return and overdue flows'
  }
];
