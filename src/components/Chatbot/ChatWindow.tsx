import { useState, useEffect, useRef, useMemo } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import {
  FaUser,
  FaRobot,
  FaPaperPlane,
  FaTimes,
  FaCheck,
  FaRedo,
  FaMoon,
  FaSun,
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
    const timeout = setTimeout(
      () => {
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
      },
      1000 + Math.random() * 1000
    );

    // Listen for abort
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timeout);
        reject(new DOMException("Aborted", "AbortError"));
      });
    }
  });
};

// ------------------ Message Bubble ------------------ //
function Message({ role, content, darkMode }) {
  const isUser = role === "user";
  return (
    <div
      className={`d-flex ${isUser ? "justify-content-end" : "justify-content-start"} mb-3`}
    >
      <div className="d-flex align-items-end" style={{ maxWidth: "75%" }}>
        {!isUser && (
          <div
            className={`me-2 flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center ${darkMode ? "bg-secondary" : "bg-primary"}`}
            style={{ width: "32px", height: "32px" }}
          >
            <FaRobot className="text-white" size={16} />
          </div>
        )}
        <div
          className={`px-3 py-2 rounded-3 shadow-sm ${
            isUser
              ? "bg-primary text-white"
              : darkMode
                ? "bg-dark text-white border border-secondary"
                : "bg-white border"
          }`}
          style={{
            borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          }}
        >
          {content}
        </div>
        {isUser && (
          <div
            className={`ms-2 flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center bg-secondary`}
            style={{ width: "32px", height: "32px" }}
          >
            <FaUser className="text-white" size={16} />
          </div>
        )}
      </div>
    </div>
  );
}

function TypingDots({ darkMode }) {
  return (
    <div className="d-flex align-items-end mb-3">
      <div
        className={`me-2 flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center ${darkMode ? "bg-secondary" : "bg-primary"}`}
        style={{ width: "32px", height: "32px" }}
      >
        <FaRobot className="text-white" size={16} />
      </div>
      <div
        className={`px-3 py-2 rounded-3 shadow-sm ${darkMode ? "bg-dark text-white border border-secondary" : "bg-white border"}`}
      >
        <div className="d-flex gap-1">
          <span className="spinner-grow spinner-grow-sm text-secondary"></span>
          <span className="spinner-grow spinner-grow-sm text-secondary"></span>
          <span className="spinner-grow spinner-grow-sm text-secondary"></span>
        </div>
      </div>
    </div>
  );
}

// ------------------ Main Chat Window ------------------ //
export default function ChatWindow({
  title = "Corporate Assistant",
  subtitle = "",
}) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi 👋 I'm your corporate assistant. Ask me your query.",
    },
  ]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState(PHASE.ASKING);
  const [loading, setLoading] = useState(false);
  const [awaitingFeedback, setAwaitingFeedback] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const scrollRef = useRef(null);
  const [controller, setController] = useState<AbortController | null>(null);

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

  // ✅ Fixed handleSend
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
      const { reply } = await callBackend(
        userMsg.content,
        history,
        ctrl.signal
      );
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setPhase(PHASE.GOT_ANSWER);
      setAwaitingFeedback(true);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            e.name === "AbortError"
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

  function onSatisfied(yes: boolean) {
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
    <Container
      fluid
      className={`chat-window d-flex flex-column h-100 p-0 ${darkMode ? "bg-dark text-light" : "bg-light"}`}
    >
      <Card
        className={`flex-grow-1 shadow-lg border-0 rounded-0 d-flex flex-column ${darkMode ? "bg-secondary text-white" : ""}`}
      >
        {/* Header */}
        {/* <Card.Header className={`d-flex justify-content-between align-items-center ${darkMode ? "bg-dark text-light border-secondary" : "bg-white border-bottom"}`}>
              <div className="text-center flex-grow-1">
                <h6 className="mb-0 fw-semibold">{title}</h6>
                {subtitle && <small className="text-muted">{subtitle}</small>}
              </div>
              <Button
                variant={darkMode ? "outline-light" : "outline-dark"}
                size="sm"
                className="ms-2 rounded-circle"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </Button>
            </Card.Header> */}

        {/* Chat Body with Fixed Input */}
        <Card.Body
          className={`d-flex flex-column flex-grow-1 p-0 ${darkMode ? "bg-secondary" : "bg-light"}`}
        >
          {/* Messages area (scrollable) */}
          <div
            className="flex-grow-1 overflow-auto p-3"
            style={{ maxHeight: "calc(100vh - 200px)", minHeight: "80vh" }}
          >
            {messages.map((m, i) => (
              <Message
                key={i}
                role={m.role}
                content={m.content}
                darkMode={darkMode}
              />
            ))}
            {loading && <TypingDots darkMode={darkMode} />}
            <div ref={scrollRef} />
          </div>

          {/* Feedback */}
          {phase === PHASE.GOT_ANSWER && (
            <div
              className={`border-top p-2 text-center small ${darkMode ? "border-secondary text-light" : "text-muted"}`}
            >
              <span className="me-2">Was this helpful?</span>
              <Button
                size="sm"
                variant="success"
                className="rounded-circle me-2"
                onClick={() => onSatisfied(true)}
              >
                <FaCheck size={12} />
              </Button>
              <Button
                size="sm"
                variant="danger"
                className="rounded-circle"
                onClick={() => onSatisfied(false)}
              >
                <FaTimes size={12} />
              </Button>
            </div>
          )}

          {/* Input (always fixed at bottom) */}
          <div
            className={`border-top p-3 ${darkMode ? "bg-dark" : "bg-white"}`}
          >
            <Form className="d-flex align-items-center gap-2">
              <Form.Control
                type="text"
                placeholder={placeholder}
                value={input}
                disabled={
                  phase === PHASE.RESOLVED || loading || awaitingFeedback
                }
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !awaitingFeedback) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className={`rounded-pill shadow-sm px-3 py-2 ${darkMode ? "bg-dark text-light border-secondary" : ""}`}
              />
              {loading && controller ? (
                <Button
                  variant="outline-danger"
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  onClick={() => controller.abort()}
                  style={{ width: "42px", height: "42px" }}
                >
                  <FaTimes size={14} />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  disabled={
                    !canSend || phase === PHASE.RESOLVED || awaitingFeedback
                  }
                  onClick={handleSend}
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "42px", height: "42px" }}
                >
                  <FaPaperPlane size={14} />
                </Button>
              )}
            </Form>
          </div>

          {/* Resolved State */}
          {phase === PHASE.RESOLVED && (
            <div
              className={`border-top text-center p-3 ${darkMode ? "bg-dark" : "bg-light"}`}
            >
              <Button
                variant={darkMode ? "outline-light" : "outline-primary"}
                onClick={resetForNewQuestion}
                className="rounded-pill px-4"
              >
                <FaRedo className="me-2" /> Start New Question
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
