import React, { useState, useEffect, useRef } from 'react';
import aiService from '../Service/AiService'; 
import { FaPaperPlane, FaTimes, FaRobot, FaUser } from 'react-icons/fa'; 

interface ProductAiChatProps {
    productDescription: string;
    productId?: number; 
}

export const ProductAiChat: React.FC<ProductAiChatProps> = ({ productDescription, productId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ sender: 'user' | 'bot', text: string }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [conversationContext, setConversationContext] = useState({});
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, loading, isOpen]);

    const cleanPriceAndText = (text: string) => {
        return text.replace(/\$/g, '₪');
    };

    const formatResponse = (text: string) => {
        if (!text) return null;

        const blocks = text.split(/\n(?=\*)/);
        let shoeCounter = 1;

        return blocks.map((block, index) => {
            const isProductBlock = block.trim().startsWith('*');

            if (isProductBlock) {
                const cleanBlock = block.replace(/^\*\s*/, '').trim();
                const separatorIndex = cleanBlock.indexOf(':');
                
                if (separatorIndex !== -1) {
                    const title = cleanBlock.substring(0, separatorIndex);
                    const description = cleanBlock.substring(separatorIndex + 1);

                    return (
                        <div key={index} className="luxury-description-card">
                            <div className="desc-card-header">
                                <div className="card-number">{shoeCounter++}</div>
                                <span className="desc-title" style={{ fontWeight: 900, fontSize: '18px' }}>
                                    {cleanPriceAndText(title.toUpperCase())}
                                </span>
                            </div>
                            <div className="desc-content">
                                {description.split(/(\*\*.*?\*\*)/g).map((part, i) => (
                                    part.startsWith('**') && part.endsWith('**') 
                                    ? <strong key={i} style={{ color: '#000', fontWeight: 800 }}>{cleanPriceAndText(part.replace(/\*\*/g, ''))}</strong>
                                    : cleanPriceAndText(part)
                                ))}
                            </div>
                        </div>
                    );
                }
            }
            return <p key={index} className="chat-simple-msg">{cleanPriceAndText(block)}</p>;
        });
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, { sender: 'user', text: input }]);
        setInput("");
        setLoading(true);

        try {
            const prompt = `
                User Question: ${input}
                INSTRUCTIONS:
                1. Provide a descriptive paragraph for each shoe.
                2. Use format: * **Shoe Name:** Description.
                3. Use **bold** for prices and colors.
            `;
            const fullResponse = await aiService.askQuestion(prompt, productId, conversationContext);
            setConversationContext(fullResponse.context);
            setMessages(prev => [...prev, { sender: 'bot', text: fullResponse.answer }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: "Service temporarily unavailable." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="nike-ai-widget">
            <style>{luxuryChatStyles}</style>
            
            <button onClick={() => setIsOpen(!isOpen)} className={`pulse-btn ${isOpen ? 'open' : ''}`}>
                {isOpen ? <FaTimes size={28}/> : <span className="ai-txt">AI</span>}
            </button>

            {isOpen && (
                <div className="chat-shell">
                    <div className="chat-header">
                        <div className="header-info">
                            <div className="active-dot"></div>
                            <h6>NIKE ASSISTANT</h6>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="close-btn"><FaTimes /></button>
                    </div>
                    
                    <div className="chat-body">
                        {messages.length === 0 && (
                            <div className="msg-box bot">
                                <div className="avatar"><FaRobot /></div>
                                <div className="bubble">
                                    <p>I'm your Nike Expert. Ask me for any shoe, size or color!</p>
                                </div>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div key={index} className={`msg-box ${msg.sender}`}>
                                <div className="avatar">
                                    {msg.sender === 'bot' ? <FaRobot /> : <FaUser />}
                                </div>
                                <div className="bubble">
                                    {msg.sender === 'bot' ? formatResponse(msg.text) : <p>{msg.text}</p>}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="msg-box bot">
                                <div className="avatar"><FaRobot /></div>
                                <div className="bubble loading">
                                    <div className="dots"><span></span><span></span><span></span></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    <div className="chat-input-area">
                        <input 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            placeholder="Find me shoes..." 
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
                        />
                        <button onClick={handleSend} disabled={loading || !input.trim()} className="send-btn">
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const luxuryChatStyles = `
    .nike-ai-widget { position: fixed; bottom: 40px; right: 40px; z-index: 10000; font-family: 'Inter', sans-serif; direction: ltr; }
    
    .pulse-btn { 
        width: 80px; height: 80px; border-radius: 50%; background: #000; color: #fff; border: none; 
        cursor: pointer; display: flex; align-items: center; justify-content: center; 
        box-shadow: 0 10px 30px rgba(0,0,0,0.3); transition: 0.3s;
        animation: black-shout-pulse 2s infinite;
        position: relative;
    }
    
    .pulse-btn.open { animation: none; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
    
    .ai-txt { font-size: 26px; font-weight: 950; color: #fff; letter-spacing: 1px; z-index: 2; }

    @keyframes black-shout-pulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.4); }
        50% { transform: scale(1.1); box-shadow: 0 0 0 20px rgba(0, 0, 0, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
    }

    /* 🛡️ השינוי כאן: גודל התיבה הוקטן */
    .chat-shell { 
        width: 400px; height: 650px; background: #fff; border-radius: 35px; position: absolute; 
        bottom: 100px; right: 0; display: flex; flex-direction: column; overflow: hidden;
        box-shadow: 0 40px 100px rgba(0,0,0,0.3); border: 1px solid #eee;
    }

    .chat-header { background: #000; color: #fff; padding: 20px; display: flex; justify-content: space-between; align-items: center; }
    .active-dot { width: 10px; height: 10px; background: #2ecc71; border-radius: 50%; margin-right: 12px; }
    .chat-header h6 { margin: 0; font-size: 14px; font-weight: 900; letter-spacing: 1px; }
    .header-info { display: flex; align-items: center; }
    .close-btn { background: none; border: none; color: #fff; cursor: pointer; }

    .chat-body { flex: 1; padding: 20px; overflow-y: auto; background: #fdfdfd; display: flex; flex-direction: column; gap: 15px; }
    .msg-box { display: flex; gap: 12px; max-width: 98%; }
    .msg-box.user { align-self: flex-end; flex-direction: row-reverse; }
    
    .bubble { padding: 12px; border-radius: 18px; font-size: 14px; line-height: 1.5; width: 100%; }
    .bot .bubble { background: transparent; color: #000; }
    .user .bubble { background: #000; color: #fff; max-width: fit-content; }

    .luxury-description-card { 
        background: #ffffff; border-left: 5px solid #000; padding: 15px; margin: 10px 0; 
        border-radius: 0 15px 15px 0; box-shadow: 0 6px 15px rgba(0,0,0,0.06);
        text-align: left;
    }

    .desc-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .card-number {
        background: #000; color: #fff; width: 22px; height: 22px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 12px;
    }
    .desc-title { font-weight: 900; font-size: 16px; text-transform: uppercase; color: #000; }
    .desc-content { font-size: 14px; color: #333; line-height: 1.6; }
    .chat-simple-msg { font-size: 14px; color: #000; margin-bottom: 8px; text-align: left; font-weight: 600; }

    .chat-input-area { padding: 20px; background: #fff; display: flex; gap: 10px; border-top: 1px solid #eee; }
    .chat-input-area input { flex: 1; padding: 12px 18px; border-radius: 12px; border: 2px solid #f0f0f0; outline: none; font-size: 14px; }
    .send-btn { width: 45px; height: 45px; border-radius: 12px; background: #000; color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    
    .avatar { flex-shrink: 0; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #f0f0f0; font-size: 14px; }

    .dots span { display: inline-block; width: 5px; height: 5px; background: #000; border-radius: 50%; margin-right: 3px; animation: bounce 1s infinite; }
    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
`;

export default ProductAiChat;