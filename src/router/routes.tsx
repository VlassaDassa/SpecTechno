import type { RouteObject } from 'react-router-dom';

import Index from '../pages/Index';
import Admin from '../pages/Admin';

export const createRoutes = (): RouteObject[] => [
  {
    path: '/',
    element: <Index /> 
  },
  {
    path: '/admin',
    element: <Admin />
  },
];
