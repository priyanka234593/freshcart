import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import MainLayout from './pages/MainLayout/MainLayout';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import NotFound from './pages/NotFound/NotFound';
import AuthContextProvider from './context/Auth/Auth';
import Home from './pages/Home/Home';
import ProtectedRoute from './pages/ProtectedRoute/ProtectedRoute';
<<<<<<< HEAD
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Cart from './pages/Cart/Cart';
import CartContextProvider from './context/Cart/Cart';
||||||| 41aa879
=======
import ProductDetails from './pages/ProductDetails/ProductDetails';
>>>>>>> dev

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
<<<<<<< HEAD
        { path: '*', element: <ProductDetails /> },
        {
          path: 'product/:id',
          element: (
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: 'cart',
          element: (
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          ),
        },
||||||| 41aa879
        { path: '*', element: <NotFound /> },
=======
        { path: '*', element: <ProductDetails /> },
        {
          path: 'product/:id',
          element: (
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          ),
        },
>>>>>>> dev
      ],
    },
  ]);
  return (
    <AuthContextProvider>
      <CartContextProvider>
        <RouterProvider router={router} />
      </CartContextProvider>
    </AuthContextProvider>
  );
}

export default App;
