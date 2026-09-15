import React from 'react';
import Logo from '../components/Logo/Logo';
import { Outlet } from 'react-router';
import bgimg from '../assets/sasun-bughdaryan-Dy2Q0kR07dA-unsplash.jpg';

const AuthLayout = () => {
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgimg})` }}
    >
      {/* Overlay - image dark/dim করার জন্য */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <Logo></Logo>
        <div>
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
