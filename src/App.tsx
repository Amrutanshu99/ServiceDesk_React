import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import AppRoutes from "./routes/routes";
import { Container, Offcanvas } from "react-bootstrap";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(false); // auto-close on desktop
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      {/* Page wrapper */}
      <div className="d-flex flex-column min-vh-100">
        {/* Header */}
        <Header onToggleSidebar={() => setShowSidebar(true)} />

        {/* Main layout (sidebar + content) */}
        <div
          className="d-flex flex-grow-1"
          style={{ minHeight: 0, overflow: "hidden" }} // critical: prevents page-level scroll
        >
          {/* Sidebar (desktop) */}
          <aside
            className="d-none d-md-flex flex-column bg-white border-end p-3 h-100"
            style={{ width: "280px" }} // inherit height from row (not 100vh)
          >
            <Navbar />
          </aside>

          {/* Sidebar (mobile) */}
          <Offcanvas
            show={showSidebar}
            onHide={() => setShowSidebar(false)}
            placement="start"
            className="d-md-none"
            scroll={true}
            backdrop={true}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title className="fw-bold">Service Desk AI</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-3">
              <Navbar />
            </Offcanvas.Body>
          </Offcanvas>

          {/* Main content area */}
          <main
            className="flex-grow-1 d-flex flex-column bg-light h-100"
            style={{ minHeight: 0 }} // allow the inner scroller to size correctly
          >
            {/* Scrollable content (only scrolls if content overflows) */}
            <div
              className="flex-grow-1"
              style={{ overflowY: "auto", overflowX: "hidden", minHeight: 0 }}
            >
              <Container fluid className="p-2">
                <AppRoutes />
              </Container>
            </div>

            {/* Footer pinned at bottom of main panel */}
            {/* <Footer /> */}
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
