// src/pages/Home.tsx
import React from "react";
import { Container } from "react-bootstrap";

export default function Home() {
  return (
    <Container className="py-5">
      <h1 className="mb-4">Welcome to Service Desk AI</h1>
      <p className="lead">
        Start a new conversation from the sidebar, or select an existing one to continue.
      </p>
    </Container>
  );
}
