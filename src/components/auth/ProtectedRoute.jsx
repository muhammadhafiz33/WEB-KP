import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (token && userString) {
      try {
        setUser(JSON.parse(userString));
      } catch (err) {
        console.error('Invalid user data in localStorage:', err);
        localStorage.clear();
      }
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const redirectTo =
      user.role === 'ADMIN'
        ? '/admin/dashboard'
        : user.role === 'PEMBIMBING'
        ? '/pembimbing/dashboard'
        : '/student/dashboard';

    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
