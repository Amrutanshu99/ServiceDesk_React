import React from "react";
import { Button } from "react-bootstrap";
import { FaPlus, FaCog, FaUserCircle, FaUser, FaAdn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleNewChat = () => {
    navigate("/chat/new");
  };

  return (
    <div className="d-flex flex-column h-100">
      {/* New Chat Button */}
       <Link
        to="/chat/new"
        className="mb-3 w-100 text-start fw-semibold rounded-pill btn btn-primary"
        style={{ backgroundColor: "#4f46e5", borderColor: "#4f46e5" }}
      >
        <FaUser className="me-2" /> Customer Bot
      </Link>


      {/* Scrollable Conversation List */}
      <div
        className="flex-grow-1 overflow-auto"
        style={{ minHeight: 0 }}
      >
        {/* Sticky Header */}
        <p
          className="text-muted small fw-bold bg-white pt-2 pb-2 mb-2 border-bottom"
          style={{ position: "sticky", top: 0, zIndex: 1 }}
        >
          Your conversations
        </p>

        {/* <ul className="list-unstyled">
          {Array.from({ length: 20 }).map((_, i) => (
            <li key={i} className="mb-2">
              <Button variant="light" className="w-100 text-start rounded-3">
                Conversation {i + 1}
              </Button>
            </li>
          ))}
        </ul> */}
      </div>

      {/* Footer Section (always pinned) */}
      {/* <div className="border-top pt-3">
        <Button
          variant="light"
          className="w-100 text-start rounded-3 mb-2 d-flex align-items-center"
        >
          <FaCog className="me-2" /> Settings
        </Button>
        <Button
          variant="light"
          className="w-100 text-start rounded-3 d-flex align-items-center"
        >
          <FaUserCircle className="me-2" /> Amrutanshu
        </Button>
      </div> */}
    </div>
  );
}
