import './BreadCrumbs.css';
import { Link, useLocation, useParams } from 'react-router-dom';
import type { FC } from 'react';
import { ROUTES, ROUTE_LABELS } from '../Routes';

export const BreadCrumbs: FC = () => {
  const location = useLocation();
  const { id, tripId } = useParams<{ id: string; tripId: string }>();
  
  const getCrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const crumbs: Array<{ label: string; path?: string }> = [];
    
    let currentPath = '';
    paths.forEach(path => {
      currentPath += `/${path}`;
      
      // Для страницы деталей сценария
      if (currentPath.includes('/scenarios/') && path !== 'scenarios') {
        crumbs.push({
          label: `Сценарий ${id}`,
          path: currentPath
        });
      } 
      // Для страницы деталей поездки
      else if (currentPath.includes('/trips/') && path !== 'trips') {
        crumbs.push({
          label: `Поездка ${tripId || path}`,
          path: currentPath
        });
      } else {
        const routeKey = Object.entries(ROUTES).find(([_, value]) => value === currentPath)?.[0] as keyof typeof ROUTES;
        if (routeKey) {
          crumbs.push({
            label: ROUTE_LABELS[routeKey],
            path: currentPath
          });
        }
      }
    });
    
    return crumbs;
  };

  const crumbs = getCrumbs();

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to={ROUTES.HOME}>Главная</Link>
        </li>
        {crumbs.map((crumb, index) => (
          <li 
            key={index} 
            className={`breadcrumb-item ${index === crumbs.length - 1 ? 'active' : ''}`}
            aria-current={index === crumbs.length - 1 ? 'page' : undefined}
          >
            {crumb.path && index < crumbs.length - 1 ? (
              <Link to={crumb.path}>{crumb.label}</Link>
            ) : (
              crumb.label
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};