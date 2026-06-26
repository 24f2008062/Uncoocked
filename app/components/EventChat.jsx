"use client";

import { useState, useEffect, useRef } from "react";
import Pusher from "pusher-js";

export default function EventChat({ eventId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // 1. Fetch Chat History & Connect to Live Pusher Channel
  useEffect(() => {
    if (!eventId) return;

    async function fetchChatHistory() {
      try {
        const res = await fetch(`/api/chat?eventId=${eventId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchChatHistory();

    const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusherClient.subscribe(`event-chat-${eventId}`);

    // Cleaned up incoming broadcast logic to filter duplicates strictly
    channel.bind("new-message", (incomingMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === incomingMessage.id)) return prev;
        return [...prev, incomingMessage];
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusherClient.disconnect();
    };
  }, [eventId]);

  // 2. Auto-scroll strictly inside the chat component, without moving the main page window
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // 3. Send Message Handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      eventId,
      userName: currentUser?.name || "Student",
      userEmail: currentUser?.email || "anonymous@student.com",
      message: newMessage,
    };

    // Use a unique prefix for the optimistic ID so it can never match a DB uuid
    const temporaryId = `optimistic-${Date.now()}`;
    const optimisticMsg = { id: temporaryId, ...messageData, createdAt: new Date() };
    setMessages((prev) => [...prev, optimisticMsg]);
    setNewMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      if (!res.ok) throw new Error("Network response error");
      
      const savedMessage = await res.json();
      
      setMessages((prev) => {
        // If Pusher already caught and added the real DB message, just remove our temporary fake one
        if (prev.some((m) => m.id === savedMessage.id)) {
          return prev.filter((m) => m.id !== temporaryId);
        }
        // Otherwise, gracefully replace the optimistic entry with the verified DB item
        return prev.map((m) => (m.id === temporaryId ? savedMessage : m));
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      // Clean up the optimistic message if it completely failed to send
      setMessages((prev) => prev.filter((m) => m.id !== temporaryId));
      alert("Message failed to send. Please check connection.");
    }
  };

  if (loading) return <div className="text-zinc-400 text-sm p-4">Loading chat room...</div>;

  return (
    <div className="flex flex-col h-[480px] w-full max-w-md border border-zinc-800 rounded-xl bg-zinc-900 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Header section */}
      <div className="bg-zinc-950/80 border-b border-zinc-800 p-4 font-semibold text-sm flex items-center justify-between text-zinc-100">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
          <span>Event Discussion Room</span>
        </div>
        <span className="text-xs text-zinc-500 font-normal">{messages.length} messages</span>
      </div>

      {/* Messages Feed Container - Ref assigned for custom scrolling */}
      <div 
        ref={chatContainerRef} 
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-900/40"
      >
        {messages.length === 0 ? (
          <div className="text-zinc-500 text-xs text-center mt-20 px-4">
            No messages yet. Be the first to ask a question, clear doubts, or find potential teammates!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.userEmail === currentUser?.email;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <span className="text-[10px] font-medium text-zinc-500 mb-0.5 px-1">{msg.userName}</span>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-md break-all ${
                    isMe 
                      ? "bg-purple-600 text-white rounded-tr-none" 
                      : "bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700/50"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-800 bg-zinc-950/90 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask something about this event..."
          className="flex-1 text-sm px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
        <button 
          type="submit" 
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm font-medium rounded-lg transition-all active:scale-95 shadow-lg shadow-purple-600/20"
        >
          Send
        </button>
      </form>
    </div>
  );
}