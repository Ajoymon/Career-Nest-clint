import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router';
import Loading from '../Loading/Loading';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <Loading></Loading>;
  }
  if (!user) {
    return <Navigate to="/login"></Navigate>;
  }
  return children;
};

export default PrivateRoute;
