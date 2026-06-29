"use client";

import { useState, useEffect, useRef } from "react";
import Pusher from "pusher-js";
import EmojiPicker from "emoji-picker-react";

export default function EventChat({ eventId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const pickerRef = useRef(null);

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

    channel.bind("new-message", (incomingMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === incomingMessage.id)) return prev;
        return [...prev, incomingMessage];
      });
    });

    channel.bind("message-deleted", (deletedData) => {
      setMessages((prev) => prev.filter((m) => m.id !== deletedData.id));
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusherClient.disconnect();
    };
  }, [eventId]);

  // Close emoji picker if user clicks outside the chat area
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2. Auto-scroll strictly inside the chat component
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

    const temporaryId = `optimistic-${Date.now()}`;
    const optimisticMsg = { id: temporaryId, ...messageData, createdAt: new Date() };
    setMessages((prev) => [...prev, optimisticMsg]);
    setNewMessage("");
    setShowEmojiPicker(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      if (!res.ok) throw new Error("Network response error");
      
      const savedMessage = await res.json();
      
      setMessages((prev) => {
        if (prev.some((m) => m.id === savedMessage.id)) {
          return prev.filter((m) => m.id !== temporaryId);
        }
        return prev.map((m) => (m.id === temporaryId ? savedMessage : m));
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => prev.filter((m) => m.id !== temporaryId));
      alert("Message failed to send. Please check connection.");
    }
  };

  // 4. Unsend Message Handler
  const handleUnsendMessage = async (messageId) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));

    try {
      const res = await fetch(`/api/chat?messageId=${messageId}&userEmail=${currentUser?.email}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Could not delete message");
    } catch (err) {
      console.error("Failed to unsend message:", err);
      alert("Could not unsend message. Try again.");
      const reloadRes = await fetch(`/api/chat?eventId=${eventId}`);
      if (reloadRes.ok) setMessages(await reloadRes.json());
    }
  };

  // 5. Handle Clicked Emoji Selection
  const onEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  if (loading) return <div className="text-zinc-400 text-sm p-4">Loading chat room...</div>;

  return (
    <div className="flex flex-col h-full w-full border border-zinc-800 rounded-xl bg-zinc-900 shadow-xl overflow-hidden backdrop-blur-md relative">
      {/* Header section */}
      <div className="bg-zinc-950/80 border-b border-zinc-800 p-4 font-semibold text-sm flex items-center justify-between text-zinc-100">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
          <span>Event Discussion Room</span>
        </div>
        <span className="text-xs text-zinc-500 font-normal">{messages.length} messages</span>
      </div>

      {/* Messages Feed Container */}
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
              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"} group`}>
                <span className="text-[10px] font-medium text-zinc-400 mb-0.5 px-1">
                  {isMe ? "You" : msg.userName}
                </span>
                
                <div className="flex items-center gap-2 max-w-[85%]">
                  {isMe && !msg.id.startsWith("optimistic-") && (
                    <button
                      onClick={() => handleUnsendMessage(msg.id)}
                      title="Unsend message"
                      className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 p-1 rounded transition-all text-xs"
                    >
                      🗑️
                    </button>
                  )}
                  
                  <div
                    className={`rounded-2xl px-3 py-2 text-sm shadow-md break-all ${
                      isMe 
                        ? "bg-purple-600 text-white rounded-tr-none" 
                        : "bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700/50"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Embedded Emoji Picker Popup Pane */}
      {showEmojiPicker && (
        <div ref={pickerRef} className="absolute bottom-16 left-4 z-50 shadow-2xl rounded-xl border border-zinc-800">
          <EmojiPicker 
            onEmojiClick={onEmojiClick}
            theme="dark"
            width={320}
            height={350}
            skinTonesDisabled
            searchDisabled
          />
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-800 bg-zinc-950/90 flex gap-2 items-center">
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className={`shrink-0 p-1.5 border rounded-lg transition-colors text-sm ${
            showEmojiPicker 
              ? "bg-purple-600 border-purple-500 text-white" 
              : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-purple-400"
          }`}
        >
          😀
        </button>
        
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask something about this event..."
          className="flex-1 min-w-0 text-sm px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
        />
        <button 
          type="submit" 
          className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm font-medium rounded-lg transition-all active:scale-95"
        >
          Send
        </button>
      </form>
    </div>
  );
}