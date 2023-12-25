import { Navigate, createBrowserRouter } from 'react-router-dom';
import { Home } from '../components/Home';
// const Home = lazy(async () => await import('../components/Home'));
import { Layout } from '../components/Layout';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [{ index: true, path: '/', element: <Home /> }],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
