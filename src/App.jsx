import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import MainLayout from './pages/MainLayout/MainLayout';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import NotFound from './pages/NotFound/NotFound';
import AuthContextProvider from './context/Auth/Auth';

function App() {
  const router = createBrowserRouter([
    {
      path: '',
      element: <MainLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '*', element: <NotFound /> },
      ],
    },
  ]);
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
