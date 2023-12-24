import { Navigate, createBrowserRouter } from 'react-router-dom';
// const Home = lazy(async () => await import('../components/Home'));
import { Home } from '../components/Home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
