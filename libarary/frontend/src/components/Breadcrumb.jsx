import { Link, matchPath, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const breadcrumbMap = [
  { pattern: ROUTES.dashboard, label: 'Dashboard' },
  { pattern: ROUTES.books, label: 'Books' },
  { pattern: ROUTES.createBook, label: 'Create Book' },
  { pattern: '/books/:id', label: 'Book Detail' },
  { pattern: '/books/:id/edit', label: 'Edit Book' },
  { pattern: ROUTES.readers, label: 'Readers' },
  { pattern: ROUTES.createReader, label: 'Create Reader' },
  { pattern: '/readers/:id', label: 'Reader Detail' },
  { pattern: '/readers/:id/edit', label: 'Edit Reader' },
  { pattern: ROUTES.borrows, label: 'Borrows' },
  { pattern: ROUTES.borrowBook, label: 'Borrow Book' },
  { pattern: ROUTES.overdueBorrows, label: 'Overdue Records' },
  { pattern: '/borrows/:id', label: 'Borrow Detail' },
  { pattern: ROUTES.systemDashboard, label: 'System' },
  { pattern: ROUTES.systemRoles, label: 'Roles' },
  { pattern: ROUTES.systemUsers, label: 'Users' },
  { pattern: ROUTES.systemLogs, label: 'Logs' }
];

function buildBreadcrumbs(pathname) {
  const items = [{ label: 'Home', path: ROUTES.dashboard }];

  for (const item of breadcrumbMap) {
    if (matchPath({ path: item.pattern, end: true }, pathname)) {
      if (item.pattern === ROUTES.dashboard) {
        return items;
      }

      const section = item.pattern.startsWith('/books') ? { label: 'Books', path: ROUTES.books } : null;
      const readerSection = item.pattern.startsWith('/readers') ? { label: 'Readers', path: ROUTES.readers } : null;
      const borrowSection = item.pattern.startsWith('/borrows') ? { label: 'Borrows', path: ROUTES.borrows } : null;
      const systemSection = item.pattern.startsWith('/system') ? { label: 'System', path: ROUTES.systemDashboard } : null;

      if (section && !items.some((entry) => entry.path === section.path)) {
        items.push(section);
      }

      if (readerSection && !items.some((entry) => entry.path === readerSection.path)) {
        items.push(readerSection);
      }

      if (borrowSection && !items.some((entry) => entry.path === borrowSection.path)) {
        items.push(borrowSection);
      }

      if (systemSection && !items.some((entry) => entry.path === systemSection.path)) {
        items.push(systemSection);
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
    <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
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
