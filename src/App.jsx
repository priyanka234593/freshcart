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
import Cart from './pages/Cart/Cart';
import CartContextProvider from './context/Cart/Cart';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import VerifyCode from './pages/VerifyCode/VerifyCode';
import Checkout from './pages/Checkout/Checkout';

function App() {
  const queryClient = new QueryClient();

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
        {
          path: 'forgotPassword',
          element: <ForgotPassword />,
        },
        { path: 'forgotPassword/verifyCode', element: <VerifyCode /> },
        {
          path: 'forgotPassword/verifyCode/resetPassword',
          element: <ResetPassword />,
        },
        {
          path: 'product/:id',
          element: (
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: '/checkout/:id',
          element: (
            <ProtectedRoute>
              <Checkout />
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
        { path: '*', element: <NotFound /> },
      ],
    },
  ]);
  return (
    <AuthContextProvider>
      <CartContextProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          <RouterProvider router={router} />
        </QueryClientProvider>
      </CartContextProvider>
    </AuthContextProvider>
  );
}

export default App;
