import { useRef } from "react";

import Navigation from "./Navigation";
import "./Navbar.css";

function Navbar({ onAdminTrigger }) {
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef(null);
  
  function handleAdminTrigger() {
    clickCountRef.current += 1;

    clearTimeout(clickTimeoutRef.current);

    if (clickCountRef.current === 7) {
      onAdminTrigger(true);
      return;
    }

    if(clickCountRef.current === 8 || clickCountRef.current === 1){
      onAdminTrigger(false);
      return;
    }

    clickTimeoutRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2000);
  }
  return (
    <header className="navbar">
      <div className="navbar__container">
        <button
          type="button"
          className="navbar__brand"
          onClick={handleAdminTrigger}
        >
          Azaria-SW
        </button>

        <Navigation />
      </div>
    </header>
  );
}

export default Navbar;
