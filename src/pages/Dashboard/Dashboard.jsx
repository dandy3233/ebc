import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import dashboardData from "../../data/dashboardData.json";

export default function Dashboard({ lang }) {
  const data = dashboardData;
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: data.widgets.assistant.messages.initial[lang],
      action: true
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue("");
    setMessages(prev => [...prev, { sender: "user", text: userText }]);

    setTimeout(() => {
      let aiText = "";
      if (userText.toLowerCase().includes("fertilizer") || userText.toLowerCase().includes("ማዳበሪያ")) {
        aiText = data.widgets.assistant.messages.fertilizerResponse[lang];
      } else {
        aiText = data.widgets.assistant.messages.defaultResponse[lang];
      }
      setMessages(prev => [...prev, { sender: "ai", text: aiText }]);
    }, 1000);
  };

  return (
    <div className="relative w-full">
      <main className="max-w-container-max mx-auto px-4 sm:px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-6 md:space-y-10">
        
        {/* Header section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-outline-variant/20 pb-4 md:pb-6">
          <div>
            <h1 className="font-display-lg text-3xl text-primary font-bold mb-1">
              {data.header.title[lang]}
            </h1>
            <p className="font-body-md text-on-surface-variant text-sm">
              {data.header.subtitle[lang]}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-label-sm text-outline text-xs">{data.header.lastUpdated[lang]}</span>
            <button 
              onClick={() => alert("Re-syncing with IoT sensors...")}
              className="p-2.5 rounded-full bg-surface-container hover:bg-surface-variant transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-primary text-base">refresh</span>
            </button>
          </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-gutter">
          
          {/* Weather Widget (Span 4) */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-4 sm:col-span-2 flex flex-col justify-between min-h-[220px]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-label-md text-on-surface-variant text-xs">
                  {data.widgets.weather.title[lang]}
                </h3>
                <p className="font-display-lg text-2xl text-primary font-bold mt-1">
                  {data.widgets.weather.condition[lang]}
                </p>
              </div>
              <div className="p-3 bg-secondary-fixed/50 rounded-xl text-secondary">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  rainy
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2 text-xs">
                <span className="font-body-md text-on-surface-variant">{data.widgets.weather.precipitationChanceLabel[lang]}</span>
                <span className="font-label-md text-primary font-semibold">{data.widgets.weather.precipitationChanceValue}</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2 text-xs">
                <span className="font-body-md text-on-surface-variant">{data.widgets.weather.temperatureLabel[lang]}</span>
                <span className="font-label-md text-primary font-semibold">{data.widgets.weather.temperatureValue}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-body-md text-on-surface-variant">{data.widgets.weather.humidityLabel[lang]}</span>
                <span className="font-label-md text-primary font-semibold">{data.widgets.weather.humidityValue}</span>
              </div>
            </div>
          </div>

          {/* Soil Health Widget (Span 4) */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-4 sm:col-span-2 flex flex-col justify-between min-h-[220px]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-label-md text-on-surface-variant text-xs">
                  {data.widgets.soilHealth.title[lang]}
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <p className="font-display-lg text-2xl text-primary font-bold">{data.widgets.soilHealth.status[lang]}</p>
                  <span className="bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    {data.widgets.soilHealth.badge[lang]}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-primary-fixed/50 rounded-xl text-primary">
                <span className="material-symbols-outlined text-3xl">compost</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/20 shadow-sm">
                <p className="font-label-sm text-outline text-[11px] mb-1">{data.widgets.soilHealth.nitrogen.label}</p>
                <p className="font-label-md text-primary text-xs font-bold">{data.widgets.soilHealth.nitrogen.value}</p>
                <div className="w-full bg-surface-variant h-1.5 rounded-full mt-2">
                  <div className="bg-secondary w-3/4 h-1.5 rounded-full"></div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/20 shadow-sm">
                <p className="font-label-sm text-outline text-[11px] mb-1">{data.widgets.soilHealth.ph.label}</p>
                <p className="font-label-md text-primary text-xs font-bold">{data.widgets.soilHealth.ph.value}</p>
                <div className="w-full bg-surface-variant h-1.5 rounded-full mt-2">
                  <div className="bg-primary w-5/6 h-1.5 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Crop Yield Prediction Widget (Span 4) */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-4 sm:col-span-2 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/20 to-transparent pointer-events-none" />
            <div className="relative z-10 flex justify-between items-start mb-6">
              <div>
                <h3 className="font-label-md text-on-surface-variant text-xs">
                  {data.widgets.yieldPrediction.title[lang]}
                </h3>
                <p className="font-display-lg text-2xl text-primary font-bold mt-1">{data.widgets.yieldPrediction.value}</p>
              </div>
              <div className="p-3 bg-tertiary-fixed/50 rounded-xl text-tertiary">
                <span className="material-symbols-outlined text-3xl">trending_up</span>
              </div>
            </div>
            <div className="relative z-10 space-y-3">
              <p className="font-body-md text-on-surface-variant text-xs leading-normal">
                {data.widgets.yieldPrediction.description[lang]}
              </p>
              <button 
                onClick={() => alert("Showing yield forecast details...")}
                className="w-full border border-primary text-primary font-label-md text-xs py-2 rounded-lg hover:bg-primary-fixed/10 transition-colors"
              >
                {data.widgets.yieldPrediction.button[lang]}
              </button>
            </div>
          </div>

          {/* AI Advice Assistant Section (Span 8) */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-8 sm:col-span-2 flex flex-col h-[400px]">
            <div className="flex items-center gap-3 mb-4 border-b border-outline-variant/30 pb-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-xl">smart_toy</span>
              </div>
              <div>
                <h3 className="font-display-lg text-lg text-primary">{data.widgets.assistant.title}</h3>
                <p className="font-label-sm text-xs text-on-surface-variant">{data.widgets.assistant.subtitle[lang]}</p>
              </div>
            </div>

            {/* Conversation Log inside Bento */}
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${
                    msg.sender === "user" ? "bg-surface-variant text-on-surface" : "bg-primary text-white"
                  }`}>
                    <span className="material-symbols-outlined text-base">
                      {msg.sender === "user" ? "person" : "smart_toy"}
                    </span>
                  </div>
                  <div className={`p-3.5 rounded-xl max-w-[85%] text-xs md:text-sm leading-relaxed border ${
                    msg.sender === "user"
                      ? "bg-primary text-white border-transparent rounded-tr-sm"
                      : "bg-surface-container-lowest border-outline-variant/30 text-on-surface rounded-tl-sm shadow-sm"
                  }`}>
                    <p>{msg.text}</p>
                    {msg.action && (
                      <div className="mt-3 flex gap-2">
                        <button 
                          onClick={() => alert("Irrigation Scheduled successfully.")}
                          className="px-3 py-1.5 bg-primary/10 text-primary rounded-md font-label-sm text-xs hover:bg-primary/20 transition-colors"
                        >
                          {data.widgets.assistant.buttons.schedule[lang]}
                        </button>
                        <button className="px-3 py-1.5 border border-outline-variant text-on-surface-variant rounded-md font-label-sm text-xs hover:bg-surface-variant transition-colors">
                          {data.widgets.assistant.buttons.dismiss[lang]}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input inside Bento widget */}
            <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-outline-variant/30 flex gap-2 relative">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow text-on-surface"
                placeholder={data.widgets.assistant.placeholder[lang]}
                type="text"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary-fixed/20 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-xl">send</span>
              </button>
            </form>
          </div>

          {/* Soil Moisture Recharts Chart (Span 4) */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-4 sm:col-span-2 h-[400px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-label-md text-on-surface-variant text-xs font-semibold">
                  {data.widgets.chart.title[lang]}
                </h3>
                <button className="text-outline hover:text-primary">
                  <span className="material-symbols-outlined text-lg">more_vert</span>
                </button>
              </div>
              <p className="text-[11px] text-outline mb-2">
                {data.widgets.chart.subtitle[lang]}
              </p>
            </div>

            {/* Area chart component */}
            <div className="flex-grow w-full h-48 bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-2 relative overflow-hidden flex flex-col justify-end">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#012d1d" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#012d1d" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 9 }} stroke="#717973" />
                  <YAxis tick={{ fontSize: 9 }} stroke="#717973" />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Area
                    type="monotone"
                    dataKey="moisture"
                    stroke="#012d1d"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorMoisture)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center text-[10px] text-outline mt-3">
              <span>{data.widgets.chart.footer.health[lang]}</span>
              <span className="text-primary font-bold">{data.widgets.chart.footer.today[lang]}</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
