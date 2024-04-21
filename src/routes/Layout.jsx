import { Outlet, Link } from "react-router-dom";
import React from "react";

// Contains the navigation bar of the site

const Layout = () => {
  return (
    <div className="w-full">
      <nav>
        <ul className="flex justify-between mb-11 text-white">
          <li className="text-xl">NoDilemma</li>
          <div className="flex gap-7 mr-2">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/forum">Forum</Link>
            </li>
          </div>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;
