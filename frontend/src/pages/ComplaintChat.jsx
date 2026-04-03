import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import socket, { connectSocket, disconnectSocket } from "../utils/socket";
import ChatBox from "../components/ChatBox";

const ComplaintChat = () => {
  const { complaintId } = useParams();
  const [messages, setMessages] = useState([]);
  const [complaint, setComplaint] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch complaint and current user info
  useEffect(() => {
    const fetchData = async () => {
      try {
        const complaintRes = await API.get(
          `/complaint/get-complaint-data/${complaintId}`
        );
        setComplaint(complaintRes.data.complaint);

        const userRes = await API.get("/auth/check-auth");
        setCurrentUser(userRes.data.user);

        const messagesRes = await API.get(`/messages/${complaintId}`);
        setMessages(messagesRes.data.messages || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load chat data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [complaintId]);

  // Setup socket connection
  useEffect(() => {
    if (!currentUser || !complaintId) return;

    connectSocket();
    socket.emit("joinComplaint", complaintId);
    socket.emit("markSeen", { complaintId });

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
      socket.emit("markSeen", { complaintId });
    });

    socket.on("messagesSeen", ({ seenBy }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.fromUser._id === currentUser._id && msg.toUser?._id === seenBy
            ? { ...msg, hasSeen: true }
            : msg
        )
      );
    });

    return () => {
      socket.off("newMessage");
      socket.off("messagesSeen");
      disconnectSocket();
    };
  }, [currentUser, complaintId]);

  const handleSendMessage = (message) => {
    if (!complaint || !currentUser) return;

    const toUser = currentUser.isAdmin
      ? complaint.user._id
      : complaint.user._id;

    socket.emit("sendMessage", {
      complaintId,
      toUser,
      message,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-on-surface-variant">Loading chat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">{error}</p>
          <Link
            to="/dashboard"
            className="text-surface-tint hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none">
        <div className="flex justify-between items-center w-full px-6 py-3 max-w-full">
          <div className="flex items-center gap-8">
            <span className="text-lg font-bold tracking-tighter text-slate-900 dark:text-slate-50">Editorial Governance</span>
            <div className="hidden md:flex gap-6 items-center">
              <Link to={currentUser?.isAdmin ? "/admin-dashboard" : "/dashboard"} className="font-sans text-sm tracking-tight font-medium text-blue-700 dark:text-blue-400 font-semibold hover:underline">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-24 pb-12 px-6 max-w-5xl w-full mx-auto flex flex-col h-screen">
        {/* Header */}
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">
              Resolution Channel
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl font-light leading-relaxed">
              Ticket #{complaintId.slice(-8).toUpperCase()}
            </p>
          </div>
          <Link
            to={currentUser?.isAdmin ? `/admin/complaint-overview/${complaintId}` : `/complaint-overview/${complaintId}`}
            className="px-6 py-2 bg-surface-container-low hover:bg-surface-container-high rounded-full font-bold text-xs uppercase tracking-widest transition-colors shadow-sm text-on-surface"
          >
            View Issue Details
          </Link>
        </div>

        {/* Chat Box Container */}
        <div className="flex-1 min-h-0">
          <ChatBox
            messages={messages}
            onSendMessage={handleSendMessage}
            currentUserId={currentUser?._id}
            chattingWith={currentUser?.isAdmin ? complaint?.user?.fullName : "Admin"}
          />
        </div>
      </main>
    </div>
  );
};

export default ComplaintChat;
