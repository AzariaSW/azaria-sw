import { Outlet } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Footer from "./components/Footer";
import AdminChallengeListener from "../../features/admin/challenge/components/AdminChallengeListener";
import "./RootLayout.css";

function RootLayout() {
  const [isChallengeActive, setIsChallengeActive] = useState(false);
  return (
    <div className="root-layout">
      <Navbar onAdminTrigger={(bool) => setIsChallengeActive(bool)} />
      <AdminChallengeListener isActive={isChallengeActive} />

      <Main>
        <Outlet />
      </Main>

      <Footer />
    </div>
  );
}

export default RootLayout;
