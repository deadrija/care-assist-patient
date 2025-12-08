import { useState } from "react";
import "../styles/ChatAssistant.css";

export default function ChatAssistant() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [mode, setMode] = useState("general");

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");

        const API_URL = "https://careassist-adr.vercel.app/api/chat";

        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [...messages, userMessage], mode }),
        });


        const data = await res.json();

        const aiMessage = {
            role: "assistant",
            content:
                data?.choices?.[0]?.message?.content ||
                "⚠️ Could not generate a response. Check server logs."
        };

        setMessages(prev => [...prev, aiMessage]);
    };

    return (
        <>
            {/* Floating Button */}
            <button className="chat-float-btn" onClick={() => setOpen(true)}>
                🤖
            </button>

            {/* Chat Window */}
            {open && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>CARE-ASSIST AI</h3>
                        <button onClick={() => setOpen(false)}>✖</button>
                    </div>

                    {/* Mode Selector */}
                    <div className="chat-modes">
                        <button onClick={() => setMode("general")}>General</button>
                        <button onClick={() => setMode("pd")}>PD Help</button>
                        <button onClick={() => setMode("diet")}>Diet</button>
                        <button onClick={() => setMode("doctor")}>Doctor Summary</button>
                        <button onClick={() => setMode("support")}>Support</button>
                    </div>

                    <div className="chat-body">
                        {messages.map((msg, i) => (
                            <div key={i} className={`msg ${msg.role}`}>
                                {msg.content}
                            </div>
                        ))}
                    </div>

                    <div className="chat-input">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask something..."
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}
        </>
    );
}
