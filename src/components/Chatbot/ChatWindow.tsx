// src/components/ChatWindow.tsx
import { useState, useEffect, useRef, useMemo } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { 
  FaUser, 
  FaRobot, 
  FaPaperPlane, 
  FaTimes, 
  FaCheck, 
  FaRedo,
} from "react-icons/fa";
const PHASE = {
  ASKING: "ASKING",
  GOT_ANSWER: "GOT_ANSWER",
  NEED_MORE_INFO: "NEED_MORE_INFO",
  RESOLVED: "RESOLVED",
};

// Fake API responses based on user input
const FAKE_RESPONSES = {
  greeting: [
    "Hello! I'm your corporate assistant. How can I help you today?",
    "Hi there! I'm here to assist with any corporate questions you might have.",
    "Greetings! What can I help you with today?",
  ],
  hr: [
    "For HR-related questions, please contact our HR department at hr@company.com or call extension 123.",
    "HR policies can be found in the employee handbook on our intranet portal.",
    "For leave requests, please submit through the HR portal at least two weeks in advance.",
  ],
  it: [
    "For IT support, please submit a ticket through the IT helpdesk system or call extension 456.",
    "Common IT issues and solutions are available in the knowledge base on our intranet.",
    "If you're experiencing network issues, try restarting your router first.",
  ],
  benefits: [
    "Our benefits package includes health insurance, retirement plans, and paid time off.",
    "You can review your benefits details in the employee self-service portal.",
    "Open enrollment for benefits happens every November.",
  ],
  default: [
    "I understand you're asking about {topic}. Let me check our resources for more information.",
    "That's an interesting question about {topic}. Based on our policies, I can tell you that...",
    "Regarding {topic}, our company standard practice is to...",
    "I need to consult our documentation about {topic}. From what I recall...",
    "For detailed information about {topic}, I recommend checking the company handbook or contacting the relevant department.",
  ],
};

// Extract topic from user message
const extractTopic = (message) => {
  const lowerMsg = message.toLowerCase();

  if (
    lowerMsg.includes("hello") ||
    lowerMsg.includes("hi") ||
    lowerMsg.includes("hey")
  ) {
    return "greeting";
  } else if (
    lowerMsg.includes("hr") ||
    lowerMsg.includes("human resources") ||
    lowerMsg.includes("leave") ||
    lowerMsg.includes("vacation")
  ) {
    return "hr";
  } else if (
    lowerMsg.includes("it") ||
    lowerMsg.includes("computer") ||
    lowerMsg.includes("tech") ||
    lowerMsg.includes("system")
  ) {
    return "it";
  } else if (
    lowerMsg.includes("benefit") ||
    lowerMsg.includes("insurance") ||
    lowerMsg.includes("health") ||
    lowerMsg.includes("retirement")
  ) {
    return "benefits";
  }

  // Extract keywords for default responses
  const keywords = message
    .split(" ")
    .filter((word) => word.length > 4)
    .slice(0, 3);
  return keywords.join(" ") || "that";
};

// Fake API call function with delay
const fakeApiCall = async (message, history, signal) => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (signal?.aborted) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }
      const topic = extractTopic(message);
      let response;
      if (FAKE_RESPONSES[topic]) {
        const responses = FAKE_RESPONSES[topic];
        response = responses[Math.floor(Math.random() * responses.length)];
      } else {
        const responses = FAKE_RESPONSES.default;
        response = responses[Math.floor(Math.random() * responses.length)];
        response = response.replace("{topic}", topic);
      }
      resolve({ reply: response });
    }, 1000 + Math.random() * 1000);

    // Listen for abort
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timeout);
        reject(new DOMException("Aborted", "AbortError"));
      });
    }
  });
};

function Message({ role, content }) {
  const isUser = role === "user";
  return (
    <div
      className={`d-flex ${isUser ? "justify-content-end" : "justify-content-start"} mb-3`}
    >
      <div className="d-flex align-items-start" style={{ maxWidth: "85%" }}>
        {!isUser && (
          <div className="me-2 mt-1 flex-shrink-0 bg-primary rounded-circle d-flex align-items-center justify-content-center" 
               style={{ width: "32px", height: "32px" }}>
            <FaRobot className="text-white" size={16} />
          </div>
        )}
        <Card
          className={`${isUser ? "bg-primary text-white" : "bg-light"} p-3`}
          style={{ 
            borderRadius: isUser ? "18px 18px 5px 18px" : "18px 18px 18px 5px",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
          }}
        >
          <Card.Text className="mb-0">{content}</Card.Text>
        </Card>
        {isUser && (
          <div className="ms-2 mt-1 flex-shrink-0 bg-secondary rounded-circle d-flex align-items-center justify-content-center" 
               style={{ width: "32px", height: "32px" }}>
            <FaUser className="text-white" size={16} />
          </div>
        )}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="d-flex align-items-start mb-3">
      <div className="me-2 mt-1 flex-shrink-0 bg-primary rounded-circle d-flex align-items-center justify-content-center" 
           style={{ width: "32px", height: "32px" }}>
        <FaRobot className="text-white" size={16} />
      </div>
      <Card className="bg-light p-3" style={{ borderRadius: "18px 18px 18px 5px" }}>
        <div className="d-flex gap-1">
          <span
            className="spinner-grow spinner-grow-sm text-secondary"
            role="status"
          ></span>
          <span
            className="spinner-grow spinner-grow-sm text-secondary"
            role="status"
          ></span>
          <span
            className="spinner-grow spinner-grow-sm text-secondary"
            role="status"
          ></span>
        </div>
      </Card>
    </div>
  );
}

export default function ChatWindow({
  title = "Corporate Assistant",
  subtitle = "",
}) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi 👋 I'm your corporate assistant.Ask me your query.",
    },
  ]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState(PHASE.ASKING);
  const [loading, setLoading] = useState(false);
  const [awaitingFeedback, setAwaitingFeedback] = useState(false);
  const scrollRef = useRef(null);
  const [controller, setController] = useState(null);
  
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, phase, loading]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading && !awaitingFeedback,
    [input, loading, awaitingFeedback]
  );

  async function callBackend(prompt, context, signal) {
    return await fakeApiCall(prompt, context, signal);
  }

  async function handleSend() {
    if (!canSend) return;
    const userMsg = { role: "user", content: input.trim() };
    const history = [...messages, userMsg].slice(-12);
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setAwaitingFeedback(false);
    const ctrl = new AbortController();
    setController(ctrl);
    try {
      const { reply } = await callBackend(userMsg.content, history, ctrl.signal);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setPhase(PHASE.GOT_ANSWER);
      setAwaitingFeedback(true);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: e.name === "AbortError"
            ? "Request was cancelled."
            : "Sorry, I encountered an error. Please try again.",
        },
      ]);
      setPhase(PHASE.ASKING);
      setAwaitingFeedback(false);
    } finally {
      setLoading(false);
      setController(null);
    }
  }

  function onSatisfied(yes) {
    setAwaitingFeedback(false);
    if (yes) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Great! I'm glad that helped. I'll close this chat now. You can start a new question anytime. ✅",
        },
      ]);
      setPhase(PHASE.RESOLVED);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "No worries. Could you provide more details about the issue?",
        },
      ]);
      setPhase(PHASE.NEED_MORE_INFO);
    }
  }

  function resetForNewQuestion() {
    setPhase(PHASE.ASKING);
    setMessages([
      {
        role: "assistant",
        content: "Hi again 👋 What can I help you with next?",
      },
    ]);
    setInput("");
    setAwaitingFeedback(false);
  }

  const placeholder = awaitingFeedback 
    ? "Please provide feedback first..." 
    : phase === PHASE.ASKING
      ? "Type your question…"
      : phase === PHASE.NEED_MORE_INFO
        ? "Add more information…"
        : "Chat is closed. Start a new question";

  return (
    <Container fluid className="chat-window-container min-vh-100 d-flex flex-column p-0">
      <Row className="chat-header bg-white border-bottom py-3 sticky-top">
        <Col className="text-center">
          <h5 className="mb-0">{title}</h5>
          <small className="text-muted">{subtitle}</small>
        </Col>
      </Row>

      <Container className="flex-grow-1 py-4 px-0">
        <Row className="justify-content-center mx-0">
          <Col md={10} lg={8} xl={6} className="px-0">
            <Card className="chat-card shadow-sm border-0 rounded-0 min-vh-100 d-flex flex-column">
              <Card.Body
                className="d-flex flex-column p-0"
                style={{ height: "calc(100vh - 160px)" }}
              >
                <div className="flex-grow-1 overflow-auto p-4">
                  {messages.map((m, i) => (
                    <Message key={i} role={m.role} content={m.content} />
                  ))}
                  {loading && <TypingDots />}
                  <div ref={scrollRef} />
                </div>

                {phase === PHASE.GOT_ANSWER && (
                  <div className="feedback-section border-top p-3 bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="small text-muted">
                        Was this response helpful?
                      </span>
                      <div className="d-flex gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          className="rounded-circle p-0 d-flex align-items-center justify-content-center feedback-btn"
                          style={{ width: "32px", height: "32px" }}
                          onClick={() => onSatisfied(true)}
                        >
                          <FaCheck size={12} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="rounded-circle p-0 d-flex align-items-center justify-content-center feedback-btn"
                          style={{ width: "32px", height: "32px" }}
                          onClick={() => onSatisfied(false)}
                        >
                          <FaTimes size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="input-section border-top p-3 bg-white">
                  <Form className="d-flex gap-2 align-items-center">
                    <Form.Control
                      type="text"
                      placeholder={placeholder}
                      value={input}
                      disabled={phase === PHASE.RESOLVED || loading || awaitingFeedback}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !awaitingFeedback) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      className="py-2 px-3 chat-input"
                      style={{ borderRadius: "24px" }}
                    />
                    {loading && controller ? (
                      <Button
                        variant="outline-danger"
                        className="rounded-circle p-2 d-flex align-items-center justify-content-center send-btn"
                        style={{ width: "40px", height: "40px" }}
                        onClick={() => controller.abort()}
                      >
                        <FaTimes size={14} />
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        disabled={!canSend || phase === PHASE.RESOLVED || awaitingFeedback}
                        onClick={handleSend}
                        className="rounded-circle p-2 d-flex align-items-center justify-content-center send-btn"
                        style={{ width: "40px", height: "40px" }}
                      >
                        <FaPaperPlane size={14} />
                      </Button>
                    )}
                  </Form>
                </div>

                {phase === PHASE.RESOLVED && (
                  <div className="text-center p-3 bg-light">
                    <Button
                      variant="outline-primary"
                      onClick={resetForNewQuestion}
                      className="px-4 new-question-btn"
                      style={{ borderRadius: "24px" }}
                    >
                      <FaRedo className="me-2" />
                      Start New Question
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}