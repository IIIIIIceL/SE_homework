import { Link, matchPath, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const breadcrumbMap = [
  { pattern: ROUTES.dashboard, label: '首页' },
  { pattern: ROUTES.books, label: '图书管理' },
  { pattern: ROUTES.createBook, label: '新增图书' },
  { pattern: '/books/:id', label: '图书详情' },
  { pattern: '/books/:id/edit', label: '编辑图书' },
  { pattern: ROUTES.readers, label: '读者管理' },
  { pattern: ROUTES.createReader, label: '新增读者' },
  { pattern: '/readers/:id', label: '读者详情' },
  { pattern: '/readers/:id/edit', label: '编辑读者' },
  { pattern: ROUTES.borrows, label: '借阅管理' },
  { pattern: ROUTES.borrowBook, label: '办理借书' },
  { pattern: ROUTES.overdueBorrows, label: '超期记录' },
  { pattern: '/borrows/:id', label: '借阅详情' },
  { pattern: ROUTES.systemDashboard, label: '系统管理' },
  { pattern: ROUTES.systemRoles, label: '角色管理' },
  { pattern: ROUTES.systemUsers, label: '用户管理' },
  { pattern: ROUTES.systemLogs, label: '操作日志' }
];

function buildBreadcrumbs(pathname) {
  const items = [{ label: '首页', path: ROUTES.dashboard }];

  for (const item of breadcrumbMap) {
    if (matchPath({ path: item.pattern, end: true }, pathname)) {
      if (item.pattern === ROUTES.dashboard) return items;

      const section = item.pattern.startsWith('/books') ? { label: '图书管理', path: ROUTES.books } : null;
      const readerSection = item.pattern.startsWith('/readers') ? { label: '读者管理', path: ROUTES.readers } : null;
      const borrowSection = item.pattern.startsWith('/borrows') ? { label: '借阅管理', path: ROUTES.borrows } : null;
      const systemSection = item.pattern.startsWith('/system') ? { label: '系统管理', path: ROUTES.systemDashboard } : null;

      for (const sectionItem of [section, readerSection, borrowSection, systemSection]) {
        if (sectionItem && !items.some((entry) => entry.path === sectionItem.path)) items.push(sectionItem);
      }

      if (item.pattern !== ROUTES.books && item.pattern !== ROUTES.borrows && item.pattern !== ROUTES.systemDashboard) {
        items.push({ label: item.label, path: pathname });
      }

      return items;
    }
  }

  return items;
}

export default function Breadcrumb() {
  const location = useLocation();
  const items = buildBreadcrumbs(location.pathname);

  return (
    <nav aria-label="面包屑" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.path}-${item.label}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {isLast ? (
              <span style={{ color: 'var(--color-text)', fontWeight: 700 }}>{item.label}</span>
            ) : (
              <Link to={item.path} style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
                {item.label}
              </Link>
            )}
            {!isLast && <span style={{ color: 'var(--color-text-muted)' }}>/</span>}
          </span>
        );
      })}
    </nav>
  );
}
