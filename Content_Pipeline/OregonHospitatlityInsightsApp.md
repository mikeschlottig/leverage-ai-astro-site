OregonHospitatlityInsightsApp

import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  Bot, 
  Zap, 
  Map, 
  X, 
  MessageSquare, 
  Send, 
  ChevronRight,
  Loader2
} from 'lucide-react';

// --- KNOWLEDGE BASE ---
const REPORT_CONTENT = `
State of the Oregon Hospitality Industry 2026: The I-5 Corridor Analysis

## Executive Overview
The Oregon hospitality sector in 2026 is navigating a profound transitional epoch, defined by macroeconomic stagnation, unprecedented operational cost escalation, and a paradigm-shifting technological evolution in consumer search behavior. The I-5 corridor serves as the definitive micro-laboratory for these transformations. National hotel occupancy dropped 1.2% to 62.3%, and RevPAR dropped 0.3%. ADR grew by a marginal 0.8%, failing to keep pace with systemic inflation. This dynamic has created a severe compression of Gross Operating Profit Per Available Room (GOPPAR). AI models (Google's AI Overviews, Bing Copilot, ChatGPT) have fundamentally altered the top of the marketing funnel, shifting the imperative from traditional SEO to Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO).

## Market trends as of 2026 (Urban Hubs)
Portland, Salem, and Eugene face complex challenges. 
- Portland: Struggles with delayed recovery of corporate travel and high supply. ADR $168, Occupancy 52.3%. 
- Salem: Tethered to legislative cycles. ADR $185, Occupancy 46.9%. 
- Eugene: Driven heavily by University of Oregon events. High seasonality, exceptional localized pricing power. Peak ADR $318, Average ADR $245, Occupancy 38.9%.

## Market trends as of 2026 (Secondary Markets)
- Albany: Highly seasonal, competitive transient traffic. ADR $129-$142, Occupancy 39.4-41.3%.
- Roseburg: Gateway to Umpqua Valley and Crater Lake. ADR $184, Occupancy 41.1%.
- Grants Pass: Robust tourism driven by Rogue River. Generates $155.7M in trip impact.
- Medford: Commercial success story. Record TLT collections, 75.8% occupancy, ADR $197.37. Benefitting from Rogue Valley Wine destination marketing.
- Ashland: Accelerating premiumization. Transitioning toward luxury wellness, culinary tourism, and boutique experiences.

## Independent Owner Realities vs Chains
Independents face escalating operational complexity and technological deficits (fragmented PMS, CRM, RMS), leading to heavy reliance on OTAs (63.4% of bookings) and commission extortion. Chains benefit from unified data and direct bookings but suffer from inflexible brand standards and existential threats from mandatory Property Improvement Plans (PIPs). Regional operators (like COHO Services) offer a hybrid solution, pooling resources for economies of scale.

## The Digital Battleground: AI, AEO, GEO
Search has transitioned from traditional SEO to AEO and GEO. AI models use "Query Fanout" to synthesize direct answers. If a hotel lacks machine-readable JSON-LD Schema markup (Hotel, HotelRoom, Offer, FAQ), it becomes invisible. AI summaries cut traditional organic clicks by 20-50%. Agencies like Mad Fish Digital and SEO Growth Partners charge $2K-$8K/month for AEO/GEO retainers. Increasing website conversion from 1.5% to 3% routes massive saved OTA commissions directly to NOI.

## Roadmap for Optimization
1. Consolidate the Commercial Tech Stack (PMS, CRM, RMS).
2. Transition Digital Spend from SEO to GEO/AEO (30-40% of budget).
3. Deploy Live Signals and Zero-Latency Response Protocols (under 1 hour for reviews).
4. Implement AI-Driven Dynamic Revenue Management.
5. Weaponize First-Party Data for Direct Bookings (Email automation).
6. Audit and Overhaul Website UX for Conversion Optimization.
7. Strategic Alignment with Regional DMOs and TLT Grants.
`;

const SYSTEM_PROMPT = `You are an elite AI Intelligence Agent integrated into a high-end digital agency dashboard powered by the bknd.io architecture. 
Your primary knowledge base is the "State of the Oregon Hospitality Industry 2026: The I-5 Corridor Analysis" report. 
Answer user questions based strictly on the data provided in this report. 
If the user asks about bknd.io, explain that it is the robust, scalable backend architecture powering this dynamic React application and AI integration, providing seamless data retrieval and edge-computed AI interactions.
Maintain a highly professional, analytical, and concise agency tone. Use formatting (bullet points, bold text) to make your answers easily readable.`;

// --- DATA STRUCTURE FOR UI CARDS ---
const CARDS_DATA = [
  {
    id: 'exec',
    title: 'Executive Overview',
    icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
    summary: 'Macroeconomic stagnation, cost escalation, and the shift to AI-driven search are compressing margins across the I-5 corridor.',
    fullText: `The Oregon hospitality sector in 2026 is navigating a profound transitional epoch. Full-year 2025 data established a sobering baseline: national hotel occupancy dropped 1.2% to 62.3%, and RevPAR dropped 0.3%. Concurrently, Average Daily Rate (ADR) grew by a marginal 0.8%, failing to keep pace with systemic inflation. This dynamic has created a severe compression of Gross Operating Profit Per Available Room (GOPPAR). For operators along the I-5 corridor, the economic reality dictates that top-line revenue acquisition can no longer mask back-of-house operational inefficiencies.\n\nSimultaneously, the digital infrastructure governing guest acquisition has undergone a seismic disruption, shifting from traditional SEO to Generative Engine Optimization (GEO).`
  },
  {
    id: 'urban',
    title: 'Urban Hubs (PDX, SLE, EUG)',
    icon: <Building2 className="w-6 h-6 text-blue-400" />,
    summary: 'Contrasting the corporate slump in Portland against Eugene\'s event-driven, high-yield seasonality.',
    fullText: `**Portland:** The market is highly sensitive to corporate budget tightening. STR data reflects a 52.3% occupancy rate with an ADR of $168.\n\n**Salem:** Tethered to the legislative cycle, maintaining a more stable baseline. ADR of $185 and occupancy of 46.9%.\n\n**Eugene:** Driven heavily by the University of Oregon and athletics, demonstrating extreme seasonality and exceptional localized pricing power. Average ADR of $245 (peaking at $318), despite a lower baseline occupancy of 38.9%. Requires sophisticated dynamic pricing.`
  },
  {
    id: 'secondary',
    title: 'Secondary Markets',
    icon: <MapPin className="w-6 h-6 text-orange-400" />,
    summary: 'How Medford and Ashland are leveraging destination marketing and premiumization to outpace national trends.',
    fullText: `**Medford:** The commercial success story of the southern I-5 corridor. Record-breaking TLT collections, driven by a 75.8% occupancy rate and ADRs pushing to an impressive $197.37. Highly successful destination marketing (Rogue Valley Wine Passport).\n\n**Ashland:** Undergoing accelerated premiumization, diversifying from the Shakespeare Festival toward luxury wellness and culinary tourism.\n\n**Grants Pass:** Leverages the Rogue River, generating over $155.7 million in total individual trip impact.\n\n**Albany & Roseburg:** Fiercely competitive on price; operational cost control is the primary mechanism for survival.`
  },
  {
    id: 'indie',
    title: 'Independents vs. Chains',
    icon: <Map className="w-6 h-6 text-purple-400" />,
    summary: 'The technological deficit of independent operators vs. the rigid, margin-crushing PIP mandates of corporate flags.',
    fullText: `**Independent Hotels:** Face escalating operational complexity and an acute technological deficit (siloed PMS, CRM, RMS). They have a dangerous reliance on OTAs (63.4% of bookings), with commissions destroying net yield.\n\n**Large Chains:** Possess capital bandwidth and direct booking ecosystems but are heavily encumbered by inflexible brand standards. Impending Property Improvement Plans (PIPs) represent an existential threat to mid-market franchisees.\n\n**Regional Operators:** Groups like COHO Services offer a hybrid solution, allowing properties to retain localized branding while utilizing institutional-grade technology.`
  },
  {
    id: 'digital',
    title: 'The Digital Battleground',
    icon: <Bot className="w-6 h-6 text-cyan-400" />,
    summary: 'The critical shift from SEO to AEO/GEO, and the mathematical impact of UX on operating margins.',
    fullText: `Search engines have transitioned to Answer Engines (AI Overviews, ChatGPT). Traditional SEO is mathematically insufficient. AI models utilize "Query Fanout" to synthesize answers. If a hotel lacks machine-readable JSON-LD Schema markup, it becomes invisible.\n\nEarly adopters of GEO see up to a 50% increase in inbound conversion from AI search. Driving traffic is futile if the website fails to convert. The average hotel website conversion rate is 1.5-2.5%. A 1% increase in conversion bypasses the OTA ecosystem entirely, allowing the saved 15-25% commission to flow directly to the bottom line.`
  },
  {
    id: 'roadmap',
    title: 'Roadmap for Optimization',
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    summary: 'Top 7 strategic decisions hoteliers must execute within 6-18 months to protect ROI and capture market share.',
    fullText: `1. **Consolidate Tech Stack:** Unify PMS, CRM, and RMS.\n2. **Transition Spend:** Shift 30-40% of search budget to GEO/AEO and Schema markup.\n3. **Live Signals:** Achieve zero-latency response protocols (under 1hr) for reviews.\n4. **AI Revenue Management:** Deploy dynamic pricing copilots based on live market elasticity.\n5. **First-Party Data:** Launch automated email sequences for direct bookings.\n6. **Overhaul UX:** Eliminate friction to push website conversion rates to 3-4%.\n7. **Strategic Alignment:** Partner with regional DMOs to access TLT grants and cooperative marketing funds.`
  }
];

// --- AI SERVICE ---
const apiKey = ""; // Injected by environment

const generateAIResponse = async (userMessage, chatHistory) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  // Format history for Gemini API
  const formattedHistory = chatHistory.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  const payload = {
    contents: [...formattedHistory, { role: 'user', parts: [{ text: userMessage }] }],
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT + "\n\nREPORT CONTEXT:\n" + REPORT_CONTENT }] }
  };

  const attemptFetch = async (retries = 5, delay = 1000) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "I was unable to generate a response. Please try again.";
    } catch (error) {
      if (retries > 0) {
        await new Promise(res => setTimeout(res, delay));
        return attemptFetch(retries - 1, delay * 2);
      }
      throw error;
    }
  };

  return attemptFetch();
};

export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello. I am the intelligence agent for this bknd.io instance. I have processed the 2026 Oregon Hospitality Industry report. How can I assist you with strategic analysis today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleCardClick = (card) => {
    setActiveModal(card);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    setInputValue('');
    
    const newUserMsg = { id: Date.now(), sender: 'user', text: userText };
    setChatMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      const responseText = await generateAIResponse(userText, chatMessages);
      setChatMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: responseText }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        id: Date.now(), 
        sender: 'bot', 
        text: 'System Error: Unable to connect to the bknd.io intelligence node. Please try again later.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Utility to render markdown-ish text (bolding and line breaks)
  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.trim() === '') return <br key={i} />;
      
      // Basic bold parsing: **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="mb-2">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="text-white">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30">
      
      {/* HEADER / HERO */}
      <header className="relative overflow-hidden border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 py-20 lg:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Powered by bknd.io infrastructure
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Oregon Hospitality <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Intelligence</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl">
            Interactive analysis of the 2026 I-5 Corridor lodging sector. Explore macroeconomic trends, digital strategies, and actionable optimization roadmaps.
          </p>
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="max-w-7xl mx-auto px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CARDS_DATA.map((card) => (
            <div 
              key={card.id}
              onClick={() => handleCardClick(card)}
              className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)] flex flex-col h-full"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{card.title}</h3>
              <p className="text-slate-400 flex-grow leading-relaxed">
                {card.summary}
              </p>
              <div className="mt-6 flex items-center text-sm font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Findings <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/60 py-8 text-center text-slate-500 text-sm">
        <p>Built for demonstration. Grounded in the 2026 Oregon Hospitality Industry Analysis.</p>
      </footer>

      {/* MODAL */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={handleCloseModal}
          ></div>
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  {activeModal.icon}
                </div>
                <h2 className="text-xl font-bold text-white">{activeModal.title}</h2>
              </div>
              <button 
                onClick={handleCloseModal}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar text-slate-300 leading-relaxed">
              {formatText(activeModal.fullText)}
            </div>
          </div>
        </div>
      )}

      {/* AI CHAT WIDGET */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {/* Chat Window */}
        <div 
          className={`mb-4 w-[350px] sm:w-[400px] h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right ${
            isChatOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
          }`}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">bknd.io Intelligence</h3>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {chatMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
                  }`}
                >
                  {msg.sender === 'bot' ? formatText(msg.text) : msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span className="text-xs text-slate-400">Querying report data...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900/50 rounded-b-2xl">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about margins, SEO vs GEO, markets..."
                className="w-full bg-slate-950 border border-slate-700 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-1.5 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Chat Toggle Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 ${
            isChatOpen ? 'bg-slate-800 text-white border border-slate-700' : 'bg-blue-600 text-white hover:bg-blue-500'
          }`}
        >
          {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #475569;
        }
      `}} />
    </div>
  );
}