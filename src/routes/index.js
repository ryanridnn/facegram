import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useLocation } from "react-router";

import PrivateRoute from "../components/PrivateRoute";

// pages
import Login from "../containers/Login";
import Home from "../containers/Home";
import Videos from "../containers/Videos";
import Commerce from "../containers/Commerce";
import Group from "../containers/Group";
import Profile from "../containers/Profile";

const ScrollToTop = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <></>;
};

export default function Routers() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/commerce" element={<Commerce />} />
          <Route path="/group" element={<Group />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}
