import { Navigate } from 'react-router-dom';

export default function ProtectedRoute(props) {
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
}
