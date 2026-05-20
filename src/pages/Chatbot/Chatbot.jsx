import React, { useState, useRef, useEffect } from "react";
import chatbotData from "../../data/chatbotData.json";

export default function Chatbot({ lang, setActiveTab }) {
  const data = chatbotData;
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: data.initialMessage.text[lang],
      chips: data.initialMessage.chips.map(c => ({
        label: c.label[lang],
        query: c.query
      }))
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: "user", text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let replyText = "";
      let detailedAction = null;

      const lowerText = textToSend.toLowerCase();
      if (lowerText.includes("coffee") || lowerText.includes("rust") || lowerText.includes("ዝገት")) {
        replyText = data.responses.coffee.text[lang];
        detailedAction = {
          immediate: data.responses.coffee.action.immediate[lang],
          treatment: data.responses.coffee.action.treatment[lang],
          ancestral: data.responses.coffee.action.ancestral[lang]
        };
      } else if (lowerText.includes("maize") || lowerText.includes("በቆሎ") || lowerText.includes("oromia")) {
        replyText = data.responses.maize.text[lang];
      } else if (lowerText.includes("teff") || lowerText.includes("ጤፍ") || lowerText.includes("ph")) {
        replyText = data.responses.teff.text[lang];
      } else if (lowerText.includes("yield") || lowerText.includes("prediction") || lowerText.includes("ምርት")) {
        replyText = data.responses.yield.text[lang];
      } else {
        replyText = data.responses.default.text[lang];
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: replyText,
          action: detailedAction
        }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleChipClick = (query) => {
    handleSend(query);
  };

  return (
    <div className="flex flex-grow h-[calc(100vh-80px)] overflow-hidden w-full relative">
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div 
          className="absolute inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar: Past Consultations */}
      <aside className={`absolute md:relative z-50 md:z-auto bg-surface-container-low border-r border-outline-variant/30 px-4 md:px-6 py-6 h-full flex flex-col w-[85vw] sm:w-80 transition-transform duration-300 ease-in-out ${
        showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="flex items-center justify-between gap-3 mb-8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg text-white">
              <span className="material-symbols-outlined text-xl">history</span>
            </div>
            <h2 className="font-display-lg text-[22px] text-primary">
              {data.sidebar.title[lang]}
            </h2>
          </div>
          <button 
            onClick={() => setShowSidebar(false)}
            className="md:hidden p-2 text-on-surface-variant hover:bg-surface-variant rounded-full"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="space-y-3 flex-grow overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {data.sidebar.history.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.title)}
              className="w-full text-left p-3.5 rounded-xl glass-panel hover:bg-primary/5 transition-all group border border-outline-variant/20"
            >
              <div className="flex flex-col">
                <span className="font-label-md text-on-surface group-hover:text-primary transition-colors text-sm mb-1">
                  {item.title}
                </span>
                <span className="font-label-sm text-on-surface-variant/70 text-xs">
                  {item.desc}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Pinned Pro card promotion */}
        <div 
          onClick={() => setActiveTab("pricing")}
          className="mt-6 shrink-0 p-5 rounded-2xl bg-gradient-to-br from-[#02402a] to-[#012d1d] border border-[#4ade80]/20 text-white relative overflow-hidden cursor-pointer shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] group"
        >
          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-[#4ade80] text-3xl mb-2">eco</span>
            <h3 className="font-display-lg text-white text-lg font-bold mb-1 group-hover:underline">
              {data.sidebar.pro.title[lang]}
            </h3>
            <p className="font-label-sm text-white/80 text-[11px] mb-4 leading-normal">
              {data.sidebar.pro.desc[lang]}
            </p>
            <div className="inline-block bg-gradient-to-r from-[#9D5215] to-[#854511] text-white px-5 py-2 rounded-lg font-label-md text-xs font-bold shadow-md">
              {data.sidebar.pro.button[lang]}
            </div>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#4ade80]/10 via-transparent to-transparent pointer-events-none" />
        </div>
      </aside>

      {/* Main Chat Area */}
      <section className="flex-grow flex flex-col bg-surface relative h-full">
        {/* Ambient Farm Watermark Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsL7gjHlGx-40Joc7LTIGPJ8KeDdrSSIPX4XaMKQIovZ4WispzrBF6sOdVGNGouLwWqwKxEetIUbArJ_kxEmyWVUKGQidSh1jwo80STXCIJNbnnj8NmTNAxPapfQqUs_JTFl_y9Q7ZPP8tqcOwygsQ0uicSUvq0_mIoA1CDTmLlJZB4AkVKlkPvjgvdeD73i6kqnC5i1TZEskhnZoPmu7tHMx-p5L56br-C9jFVuMRnKssp26exfb5g7QvWhU86SaSci2U-DfyWK54"
            className="w-full h-full object-cover opacity-5 pointer-events-none"
            alt="farm overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface opacity-90 pointer-events-none" />
        </div>

        {/* Chat Header */}
        <div className="relative z-10 px-3 sm:px-4 md:px-6 py-3 md:py-4 border-b border-outline-variant/20 flex justify-between items-center backdrop-blur-md bg-white/45">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button 
              className="md:hidden p-2 -ml-2 rounded-full hover:bg-primary/5 text-primary transition-all"
              onClick={() => setShowSidebar(true)}
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-md shrink-0">
              <span className="material-symbols-outlined text-xl">neurology</span>
            </div>
            <div>
              <h1 className="font-display-lg text-lg text-primary">{data.chatArea.title}</h1>
              <p className="font-label-sm text-xs text-on-surface-variant flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>{data.chatArea.status}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <button className="p-2 rounded-full hover:bg-primary/5 text-primary transition-all">
              <span className="material-symbols-outlined text-lg">share</span>
            </button>
            <button className="p-2 rounded-full hover:bg-primary/5 text-primary transition-all">
              <span className="material-symbols-outlined text-lg">settings</span>
            </button>
          </div>
        </div>

        {/* Message Log */}
        <div className="relative z-10 flex-grow overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 sm:gap-3.5 w-full max-w-[95%] sm:max-w-2xl lg:max-w-3xl ${
                msg.sender === "user" ? "self-end flex-row-reverse ml-auto" : "mr-auto"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.sender === "user"
                    ? "bg-secondary-container text-white"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {msg.sender === "user" ? "person" : "auto_awesome"}
                </span>
              </div>
              <div
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden ${
                  msg.sender === "user"
                    ? "bg-primary text-white rounded-tr-none"
                    : "glass-panel text-on-surface rounded-tl-none"
                }`}
              >
                <p className="font-body-md text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {msg.text}
                </p>

                {/* Sub-action detailed layout if present */}
                {msg.action && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                      <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
                        <h4 className="font-label-md text-primary text-xs mb-1.5 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base">sanitizer</span>
                          <span>{data.chatArea.actionLabels.immediate}</span>
                        </h4>
                        <p className="font-label-sm text-on-surface-variant text-[11px] leading-normal">
                          {msg.action.immediate}
                        </p>
                      </div>
                      <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
                        <h4 className="font-label-md text-primary text-xs mb-1.5 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base">science</span>
                          <span>{data.chatArea.actionLabels.treatment}</span>
                        </h4>
                        <p className="font-label-sm text-on-surface-variant text-[11px] leading-normal">
                          {msg.action.treatment}
                        </p>
                      </div>
                    </div>
                    <div className="p-3 bg-primary/5 border-l-4 border-primary rounded-r-xl">
                      <p className="font-body-md text-xs italic text-primary">
                        "{msg.action.ancestral}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Initial suggestion chips */}
                {msg.chips && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {msg.chips.map((chip, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => handleChipClick(chip.query)}
                        className="px-3.5 py-1.5 rounded-full border border-primary/20 text-primary font-label-sm text-xs hover:bg-primary hover:text-white transition-all bg-white/50 active:scale-95"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3 max-w-md mr-auto">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-lg animate-spin">sync</span>
              </div>
              <div className="glass-panel px-4 py-3 rounded-2xl rounded-tl-none">
                <p className="font-label-sm text-xs text-on-surface-variant">
                  {data.chatArea.typing[lang]}
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="relative z-10 p-3 sm:p-4 bg-white/70 backdrop-blur-md border-t border-outline-variant/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="max-w-4xl mx-auto flex items-end gap-1.5 sm:gap-2 md:gap-3 bg-white rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-lg border border-outline-variant/30 w-full"
          >
            <button
              type="button"
              className="hidden md:flex p-2.5 text-outline hover:text-primary transition-colors items-center justify-center rounded-lg hover:bg-surface"
            >
              <span className="material-symbols-outlined text-xl">attach_file</span>
            </button>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={data.chatArea.inputPlaceholder[lang]}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(inputValue);
                }
              }}
              className="flex-grow bg-transparent border-0 focus:ring-0 text-sm py-2 resize-none max-h-24 outline-none text-on-surface"
            />
            <button
              type="button"
              className="hidden sm:flex p-2.5 text-outline hover:text-primary transition-colors items-center justify-center rounded-lg hover:bg-surface"
            >
              <span className="material-symbols-outlined text-xl">mic</span>
            </button>
            <button
              type="submit"
              className="bg-primary text-white p-2.5 sm:p-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center shrink-0"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-xl">send</span>
            </button>
          </form>
          <p className="text-center font-label-sm text-[10px] text-on-surface-variant/60 mt-2">
            {data.chatArea.disclaimer}
          </p>
        </div>
      </section>
    </div>
  );
}
