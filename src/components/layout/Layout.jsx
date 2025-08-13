import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, title, isAdmin = false }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={title} isAdmin={isAdmin} />
      <Sidebar isAdmin={isAdmin} />
      <main className="p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
