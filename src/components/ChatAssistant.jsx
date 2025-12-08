import { useState } from "react";
import "../styles/ChatAssistant.css";

export default function ChatAssistant() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [mode, setMode] = useState("general");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const SYSTEM_PROMPTS = {
        general: "You are CARE-ASSIST, a helpful assistant.",
        pd: "You help with PD exchanges, UF interpretation, symptoms, and dialysis education.",
        diet: "You recommend CKD-friendly foods and warn about dangerous foods.",
        doctor: "You act like a nephrologist, summarize UF logs and clinical data clearly.",
        support: "You provide emotional support & reassurance for dialysis patients."
    };

    // Convert image to Base64
    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const sendMessage = async () => {
        if (!input.trim() && !imageFile) return;

        const userMsg = {
            role: "user",
            content: input || "[Image Uploaded]",
            image: imagePreview || null
        };
        setMessages((prev) => [...prev, userMsg]);

        let imagePart = null;

        if (imageFile) {
            const base64Image = await toBase64(imageFile);
            imagePart = {
                inlineData: {
                    data: base64Image,
                    mimeType: imageFile.type
                }
            };
        }

        setInput("");
        setImageFile(null);
        setImagePreview(null);

        try {
            const systemPrompt = SYSTEM_PROMPTS[mode];

            const body = {
                systemInstruction: { parts: [{ text: systemPrompt }] },
                contents: [
                    {
                        parts: [
                            ...(imagePart ? [imagePart] : []),
                            { text: input }
                        ]
                    }
                ]
            };

            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                }
            );

            const data = await res.json();
            const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response.";

            const aiMsg = { role: "assistant", content: aiText };
            setMessages((prev) => [...prev, aiMsg]);

        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "⚠️ Error. Try again." }
            ]);
        }
    };

    return (
        <>
            <button className="chat-float-btn" onClick={() => setOpen(true)}>🤖</button>

            {open && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>CARE-ASSIST AI</h3>
                        <button onClick={() => setOpen(false)}>✖</button>
                    </div>

                    {/* Modes */}
                    <div className="chat-modes">
                        {["general", "pd", "diet", "doctor", "support"].map((m) => (
                            <button
                                key={m}
                                className={mode === m ? "active" : ""}
                                onClick={() => setMode(m)}
                            >
                                {m.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Chat messages */}
                    <div className="chat-body">
                        {messages.map((msg, i) => (
                            <div key={i} className={`msg ${msg.role}`}>
                                {msg.image && <img src={msg.image} className="chat-img" />}
                                {msg.content}
                            </div>
                        ))}
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="chat-preview">
                            <img src={imagePreview} alt="preview" />
                            <button onClick={() => { setImagePreview(null); setImageFile(null); }}>
                                Remove
                            </button>
                        </div>
                    )}

                    {/* Input */}
                    <div className="chat-input">
                        <label className="img-upload-btn">
                            📷
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const f = e.target.files[0];
                                    if (f) {
                                        setImageFile(f);
                                        setImagePreview(URL.createObjectURL(f));
                                    }
                                }}
                                style={{ display: "none" }}
                            />
                        </label>

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
