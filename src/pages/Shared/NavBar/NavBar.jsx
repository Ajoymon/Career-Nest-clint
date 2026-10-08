import React from 'react';
import Logo from '../../../components/Logo/Logo';
import { Link, NavLink } from 'react-router';
import useAuth from '../../../hooks/useAuth';

const NavBar = () => {
  const { user, logOut } = useAuth(); // ⚠️ আপনার AuthProvider এ যে নাম আছে সেটা বসান

  const handleLogout = () => {
    logOut()
      .then(() => {
        console.log('Logged out');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const links = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/findJobs">Find Jobs</NavLink>
      </li>
      <li>
        <NavLink to="/companies">Companies</NavLink>
      </li>
      <li>
        <NavLink to="/about">About</NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm mt-5 rounded-2xl">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {' '}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{' '}
            </svg>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <Logo></Logo>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{links}</ul>
      </div>
      <div className="navbar-end gap-3">
        {user ? (
          // ✅ Login করা থাকলে এইটা দেখাবে
          <>
            <button className="text-xl hover:text-purple-400">🔔</button>

            <div className="flex items-center gap-2">
              <img
                src={user.photoURL || '/default-avatar.png'}
                alt={user.displayName || 'User'}
                className="w-10 h-10 rounded-full object-cover"
              />

              <span className="font-medium">{user.displayName || 'User'}</span>
            </div>

            <button
              className="text-red-400 hover:text-red-500"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          // ✅ Login করা না থাকলে এইটা দেখাবে
          <>
            <Link
              to="/login"
              className="text-blue-400 hover:text-purple-400 font-semibold mr-5 transition-colors duration-300"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-5 py-2.5 rounded-lg text-white font-semibold
             bg-gradient-to-r from-purple-600 to-blue-600
             hover:from-purple-700 hover:to-blue-700
             shadow-lg shadow-purple-500/20
             transition-all duration-300"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
