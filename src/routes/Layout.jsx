import { Outlet, Link } from "react-router-dom";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePollHorizontal } from "@fortawesome/free-solid-svg-icons";

const Layout = () => {
  return (
    <div className="w-full">
      <nav>
        <ul className="flex justify-between mb-11 text-white">
          <li className="text-xl font-extrabold">
            <Link to="/">
              <div className="flex gap-2 items-center">
                <FontAwesomeIcon icon={faSquarePollHorizontal} style={{color: "#ffffff",}} />
                <p>NoDilemma</p>
              </div>
              </Link>
          </li>
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
