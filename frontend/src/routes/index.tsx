import { Navigate, createBrowserRouter } from 'react-router-dom';
import { Home } from '../components/Home';
// const Home = lazy(async () => await import('../components/Home'));
import { Layout } from '../components/Layout';
import { Thread } from '../components/Thread';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, path: '/', element: <Home /> },
      { path: '/threads/:threadId', element: <Thread /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
