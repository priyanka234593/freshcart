import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import MainLayout from './pages/MainLayout/MainLayout';

function App() {
  const router = createBrowserRouter([
    {
      path: '',
      element: <MainLayout />,
      children: [],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
