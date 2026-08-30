import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ProtectedRoute = ({ children, requireOwner = false }) => {
  const { user , isOwner } = useAppContext();


  if (!user) {
    return <Navigate to="/" replace />;
}

  if (requireOwner && !isOwner) {
    return <Navigate to="/" replace />;
}

  return children;
};

export default ProtectedRoute;