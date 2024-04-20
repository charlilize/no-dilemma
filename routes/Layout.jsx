import { Outlet, Link } from "react-router-dom"
import React from "react"

// Contains the navigation bar of the site

const Layout = () => {
  <div>
    <nav>
      <ul>
        <li>NoDilemma</li>
        <div>
          <li>
            <Link>Home</Link>
          </li>
          <li>
            <Link>Forum</Link>
          </li>
        </div>
      </ul>
    </nav>
  </div>
};

export default Layout;
