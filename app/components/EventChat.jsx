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
    <div className="flex flex-col h-full w-full border border-white/8 rounded-xl bg-[#111111] shadow-sm overflow-hidden relative">
      {/* Header section */}
      <div className="bg-[#0A0A0A] border-b border-white/6 p-3 font-semibold text-[13px] flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7]"></span>
          <span>Event Discussion Room</span>
        </div>
        <span className="text-[11px] text-white/50 font-normal">{messages.length} messages</span>
      </div>

      {/* Messages Feed Container */}
      <div 
        ref={chatContainerRef} 
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#111111]"
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
                <span className="text-[10px] font-semibold text-white/40 mb-1 px-1">
                  {isMe ? "You" : msg.userName}
                </span>
                
                <div className="flex items-center gap-2 max-w-[85%]">
                  {isMe && !msg.id.startsWith("optimistic-") && (
                    <button
                      onClick={() => handleUnsendMessage(msg.id)}
                      title="Unsend message"
                      className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 p-1 rounded transition-all text-[11px]"
                    >
                      🗑️
                    </button>
                  )}
                  
                  <div
                    className={`rounded-xl px-3 py-2 text-[13px] break-all ${
                      isMe 
                        ? "bg-[#0A0A0A] text-white border border-white/8 rounded-tr-sm" 
                        : "bg-[#1a1a1a] text-white border border-white/6 rounded-tl-sm"
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
        <div ref={pickerRef} className="absolute bottom-16 left-4 z-50 shadow-lg rounded-xl border border-white/8">
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
      <form onSubmit={handleSendMessage} className="p-3 border-t border-white/6 bg-[#0A0A0A] flex gap-2 items-center">
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className={`shrink-0 p-1.5 rounded-lg transition-colors text-sm ${
            showEmojiPicker 
              ? "bg-white/10 text-white" 
              : "bg-transparent text-white/50 hover:text-white hover:bg-white/5"
          }`}
        >
          😀
        </button>
        
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask something about this event..."
          className="flex-1 min-w-0 text-[12px] px-3 py-2 bg-[#111111] border border-white/8 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/20"
        />
        <button 
          type="submit" 
          className="shrink-0 btn-primary text-[12px]"
        >
          Send
        </button>
      </form>
    </div>
  );
}