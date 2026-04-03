import { useState, useEffect, useRef } from "react";

const ChatBox = ({ messages, onSendMessage, currentUserId, chattingWith }) => {
    const [inputMessage, setInputMessage] = useState("");
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom on new messages
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
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/15 flex flex-col h-full overflow-hidden">
            {/* Chat Header */}
            <div className="p-6 bg-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-tint/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-surface-tint">support_agent</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-on-surface">{chattingWith || "Resolution Team"}</p>
                        <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Active Chat</p>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col bg-background">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-on-surface-variant text-sm">
                        No messages yet. Start a conversation!
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isOwnMessage = msg.fromUser._id === currentUserId;
                        const senderName = isOwnMessage ? "Me" : (msg.fromUser.isAdmin ? "Admin" : msg.fromUser.fullName);

                        return (
                            <div
                                key={msg._id || index}
                                className={`max-w-[85%] flex flex-col ${isOwnMessage ? "self-end items-end" : "self-start items-start"}`}
                            >
                                <div
                                    className={`p-4 text-sm leading-relaxed ${isOwnMessage
                                        ? "bg-on-primary-fixed-variant text-white rounded-tl-xl rounded-br-xl rounded-bl-xl"
                                        : "bg-surface-container-high text-on-surface rounded-tr-xl rounded-br-xl rounded-bl-xl"
                                        }`}
                                >
                                    {msg.message}
                                </div>
                                <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? "mr-1" : "ml-1"}`}>
                                    <p className="text-[10px] text-on-surface-variant uppercase font-medium tracking-widest">
                                        {senderName} • {formatTime(msg.createdAt)}
                                    </p>
                                    {isOwnMessage && (
                                        <span className={`material-symbols-outlined text-[14px] ${msg.hasSeen ? "text-surface-tint" : "text-outline-variant"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                                            {msg.hasSeen ? "done_all" : "check"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-outline-variant/10 bg-surface-container-lowest">
                <div className="flex items-center gap-2 bg-surface-container-high rounded-lg p-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent border-none text-sm focus:ring-0 text-on-surface outline-none px-2"
                    />
                    <button
                        type="submit"
                        disabled={!inputMessage.trim()}
                        className="bg-primary hover:bg-primary-container disabled:opacity-50 text-white px-4 py-2 rounded-md transition-all flex items-center justify-center"
                    >
                        <span className="material-symbols-outlined text-sm">send</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatBox;
