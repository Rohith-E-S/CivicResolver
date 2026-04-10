import { useEffect, useRef, useState } from "react";

const ChatBox = ({ messages, onSendMessage, currentUserId, chattingWith }) => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="ui-card flex h-full flex-col p-0">
      <div className="border-b border-[color:var(--ui-border)] p-4">
        <p className="text-sm font-semibold">Chat with {chattingWith || "Resolution team"}</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="ui-empty">No messages yet.</p>
        ) : (
          messages.map((msg, index) => {
            const isOwnMessage = msg.fromUser._id === currentUserId;
            const senderName = isOwnMessage ? "You" : msg.fromUser.isAdmin ? "Admin" : msg.fromUser.fullName;

            return (
              <div key={msg._id || index} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    isOwnMessage
                      ? "bg-[color:var(--ui-primary)] text-[color:var(--ui-surface)]"
                      : "bg-[color:var(--ui-surface-muted)] text-[color:var(--ui-text)]"
                  }`}
                >
                  <p>{msg.message}</p>
                  <p
                    className={`mt-1 text-xs ${
                      isOwnMessage ? "text-slate-200" : "text-[color:var(--ui-text-muted)]"
                    }`}
                  >
                    {senderName} • {formatTime(msg.createdAt)}
                    {isOwnMessage && (msg.hasSeen ? " • Seen" : " • Sent")}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-[color:var(--ui-border)] p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message"
            className="ui-input"
          />
          <button type="submit" disabled={!inputMessage.trim()} className="ui-btn ui-btn-primary">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
