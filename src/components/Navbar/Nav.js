import { Link, useLocation } from "react-router-dom";

// icons
import {
  HomeIcon as HomeIconSolid,
  VideoCameraIcon as VideoCameraIconSolid,
  ShoppingCartIcon as ShoppingCartIconSolid,
  UserGroupIcon as UserGroupIconSolid,
} from "@heroicons/react/solid";
import {
  HomeIcon as HomeIconOutline,
  VideoCameraIcon as VideoCameraIconOutline,
  ShoppingCartIcon as ShoppingCartIconOutline,
  UserGroupIcon as UserGroupIconOutline,
} from "@heroicons/react/outline";

const Nav = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="h-14 max-w-screen-sm hidden sm:flex items-center">
      <ul className="h-full flex items-center">
        <li className="h-full">
          <Link
            to="/"
            className={`w-20 h-full flex justify-center items-center ${
              path === "/" && "border-b-4 border-primary "
            }`}
          >
            {path === "/" ? (
              <HomeIconSolid className="h-6 text-primary" />
            ) : (
              <HomeIconOutline className="h-6" />
            )}
          </Link>
        </li>
        <li className="h-full">
          <Link
            to="/videos"
            className={`w-20 h-full flex justify-center items-center ${
              path === "/videos" && "border-b-4 border-primary "
            }`}
          >
            {path === "/videos" ? (
              <VideoCameraIconSolid className="h-6 text-primary" />
            ) : (
              <VideoCameraIconOutline className="h-6" />
            )}
          </Link>
        </li>
        <li className="h-full">
          <Link
            to="/commerce"
            className={`w-20 h-full flex justify-center items-center ${
              path === "/commerce" && "border-b-4 border-primary "
            }`}
          >
            {path === "/commerce" ? (
              <ShoppingCartIconSolid className="h-6 text-primary" />
            ) : (
              <ShoppingCartIconOutline className="h-6" />
            )}
          </Link>
        </li>
        <li className="h-full">
          <Link
            to="/group"
            className={`w-20 h-full flex justify-center items-center ${
              path === "/group" && "border-b-4 border-primary "
            }`}
          >
            {path === "/group" ? (
              <UserGroupIconSolid className="h-6 text-primary" />
            ) : (
              <UserGroupIconOutline className="h-6" />
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
