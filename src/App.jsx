import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import MainLayout from './pages/MainLayout/MainLayout';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import NotFound from './pages/NotFound/NotFound';
import AuthContextProvider from './context/Auth/Auth';
import Home from './pages/Home/Home';
import ProtectedRoute from './pages/ProtectedRoute/ProtectedRoute';
import ProductDetails from './pages/ProductDetails/ProductDetails';

function App() {
  const router = createBrowserRouter([
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '*', element: <ProductDetails /> },
        {
          path: 'product/:id',
          element: (
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          ),
        },
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
