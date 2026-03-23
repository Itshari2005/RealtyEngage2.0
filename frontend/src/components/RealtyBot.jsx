import { useState, useRef, useEffect} from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import API from "../api/api";

export default function RealtyBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm RealtyBot 🏠 How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const history = updatedMessages.slice(0, -1).map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      }));

      const response = await API.post("/bot/chat", {
        message: userMessage.content,
        history,
      });

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: response.data.reply },
      ]);
    } catch (error) {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: { error: error.message || "Sorry, I'm having trouble responding. Please try again!" },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
        title="Chat with RealtyBot"
      >
        {isOpen ? (
          <FaTimes className="text-2xl" />
        ) : (
          <FaRobot className="text-2xl" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-36 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden"
          style={{ height: "480px" }}>

          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center gap-3">
            <div className="bg-white rounded-full p-1.5">
              <FaRobot className="text-blue-600 text-lg" />
            </div>
            <div>
              <p className="font-semibold text-sm">RealtyBot</p>
              <p className="text-xs text-blue-100">AI Assistant • Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="px-3 py-3 bg-white border-t border-gray-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 text-sm border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2.5 rounded-full transition-colors duration-200"
            >
              <FaPaperPlane className="text-sm" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}