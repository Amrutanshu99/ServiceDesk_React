import React from "react";
import { Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";

type HeaderProps = { onToggleSidebar: () => void };

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="bg-white border-bottom py-2 px-3 d-flex justify-content-between align-items-center shadow-sm sticky-top">
      {/* Toggle only visible on mobile */}
      <Button
        variant="light"
        className="d-md-none me-2"
        onClick={onToggleSidebar}
        aria-label="Open sidebar"
      >
        <FaBars />
      </Button>

      <h6 className="mb-0 fw-bold text-uppercase">Service Desk AI</h6>

      {/* Right-side placeholder */}
      {/* <div><span className="text-muted small">Welcome</span></div> */}
    </header>
  );
}
