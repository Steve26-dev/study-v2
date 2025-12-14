import React, { useState, useEffect, useRef } from 'react';
import { TabType, ChatMessage } from '../types';
import { FileText, Monitor, Book, HelpCircle, Send, Maximize2, CheckCircle, XCircle, Search, Bot } from 'lucide-react';
import { generateStudyAid } from '../services/geminiService';

interface TopicStudyProps {
  topicId: string;
  onBack: () => void;
}

const TopicStudy: React.FC<TopicStudyProps> = ({ topicId, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.SUMMARY);
  const [showRightPanel, setShowRightPanel] = useState(true);
  
  // AI Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: '안녕하세요! 이 주제에 대해 도와드릴 준비가 되었습니다. 요약이나 퀴즈를 요청해 보세요.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate getting context based on active tab
    const contextMap = {
      [TabType.SUMMARY]: "심박출량(Cardiac Output) 요약 내용: CO = SV x HR...",
      [TabType.DETAIL]: "Guyton & Hall 생리학 교과서 상세 내용 발췌: 심장 조절 기전, Frank-Starling 법칙...",
      [TabType.SLIDES]: "강의 슬라이드 내용: Wiggers Diagram 및 심주기 설명...",
      [TabType.QUESTIONS]: "기출 문제 문맥: 전부하(Preload)와 후부하(Afterload) 관련 문제...",
    };

    const responseText = await generateStudyAid(contextMap[activeTab], userMsg.text);
    
    const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case TabType.SUMMARY:
        return (
          <div className="prose max-w-none p-8">
            <h2 className="text-2xl font-bold mb-4">핵심 요약 (급분바)</h2>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
              <p className="font-bold text-amber-800">Key Concept</p>
              <p className="text-amber-700">심박출량(CO) = 1회 박출량(SV) × 심박수(HR). 이는 조직으로의 산소 전달을 결정하는 가장 중요한 지표이다.</p>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              <li><strong>전부하(Preload):</strong> 확장기 말 용적(EDV), 심실 근육을 늘리는 힘.</li>
              <li><strong>후부하(Afterload):</strong> 심실이 수축할 때 이겨내야 하는 저항 (전신혈관저항 SVR).</li>
              <li><strong>수축력(Contractility):</strong> 심근 자체의 수축 능력 (근육 길이와 무관).</li>
            </ul>
          </div>
        );
      case TabType.DETAIL:
        return (
          <div className="h-full flex flex-col bg-slate-100">
             <div className="bg-white p-4 border-b border-slate-200 flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-600">참고 문헌: Guyton & Hall 생리학, p. 245</span>
                <button className="text-brand-600 text-sm font-medium hover:underline flex items-center gap-1">
                   <Maximize2 size={14} /> 원문 PDF 보기
                </button>
             </div>
             <div className="flex-1 p-8 overflow-y-auto bg-white shadow-inner m-4 rounded-lg">
                <h3 className="text-xl font-bold mb-4">심박출량의 결정 요인</h3>
                <p className="leading-loose text-slate-700 mb-4">
                  심박출량의 조절은 복잡하며, 심장 자체의 조절 기전(Frank-Starling 법칙)과 자율신경계의 조절이 상호작용합니다.
                  <span className="bg-yellow-100 px-1">교감신경 자극은 심박수와 수축력을 모두 증가시켜</span>, Frank-Starling 곡선을 상좌측으로 이동시킵니다.
                </p>
                <div className="w-full h-48 bg-slate-100 rounded flex items-center justify-center text-slate-400 mb-4 border border-dashed border-slate-300">
                  [그림 위치: Frank-Starling 곡선]
                </div>
                <p className="leading-loose text-slate-700">
                   미주신경(Vagus nerve)을 통한 부교감신경 자극은 주로 심박수를 감소시키며, 심방의 수축력에 약간의 음성 변력 효과를 미칩니다.
                </p>
             </div>
          </div>
        );
      case TabType.SLIDES:
         return (
          <div className="h-full bg-slate-900 flex flex-col items-center justify-center relative">
            <div className="w-3/4 aspect-video bg-white rounded shadow-2xl flex items-center justify-center overflow-hidden">
               <img src="https://picsum.photos/800/600" alt="Lecture Slide" className="object-cover w-full h-full opacity-90" />
            </div>
            <div className="absolute bottom-8 flex gap-4">
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-sm">이전</button>
              <span className="text-white/50 py-2">Slide 4 / 24</span>
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-sm">다음</button>
            </div>
          </div>
         );
      case TabType.QUESTIONS:
        return (
          <div className="h-full flex flex-col">
            {/* Top Bar for Mode Switching (Page Mode / Clip Mode) */}
            <div className="bg-slate-50 border-b border-slate-200 p-2 flex justify-center gap-2">
               <button className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-700 shadow-sm">페이지 모드</button>
               <button className="px-3 py-1 text-slate-500 text-xs hover:bg-slate-100 rounded">클립 모드</button>
            </div>
            
            <div className="flex-1 relative bg-slate-200 overflow-y-auto p-4 flex justify-center">
              {/* Simulated PDF Page for Questions */}
              <div className="bg-white w-[600px] min-h-[800px] shadow-lg relative p-10">
                <div className="absolute top-0 right-0 bg-red-50 text-red-600 text-xs px-2 py-1 font-bold">2023 중간고사</div>
                
                <div className="mb-8">
                   <p className="font-serif text-lg mb-4"><span className="font-bold mr-2">Q1.</span> 다음 중 심장의 후부하(Afterload)를 증가시키는 요인은?</p>
                   <div className="space-y-2 font-serif pl-6">
                      <div className="flex gap-2"><span className="font-bold">(A)</span> 전신혈관저항(SVR)의 감소</div>
                      <div className="flex gap-2"><span className="font-bold">(B)</span> 대동맥 판막 협착증 (Aortic stenosis)</div>
                      <div className="flex gap-2"><span className="font-bold">(C)</span> 승모판 역류증 (Mitral regurgitation)</div>
                      <div className="flex gap-2"><span className="font-bold">(D)</span> 저혈량증 (Hypovolemia)</div>
                   </div>
                   
                   {/* Interactive Overlay for grading */}
                   <div className="mt-4 flex gap-2 justify-end">
                      <button className="flex items-center gap-1 px-3 py-1 rounded-full border border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-sm">
                        <CheckCircle size={14} /> 정답
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm">
                        <XCircle size={14} /> 오답
                      </button>
                   </div>
                </div>

                <div className="mb-8 opacity-50">
                   <p className="font-serif text-lg mb-4"><span className="font-bold mr-2">Q2.</span> 대동맥압 파형에서 중복맥박패임(dicrotic notch)이 의미하는 것은?</p>
                   <div className="space-y-2 font-serif pl-6">
                      <div className="flex gap-2"><span className="font-bold">(A)</span> 대동맥 판막 폐쇄</div>
                      <div className="flex gap-2"><span className="font-bold">(B)</span> 승모판 개방</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left: Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${showRightPanel ? 'mr-0' : ''}`}>
        {/* Topic Header */}
        <header className="h-14 border-b border-slate-200 flex items-center justify-between px-4 bg-white z-10">
           <div className="flex items-center gap-4">
              <button onClick={onBack} className="text-slate-400 hover:text-slate-600">뒤로</button>
              <h1 className="font-bold text-slate-800">심박출량(Cardiac Output)의 기전</h1>
           </div>
           
           {/* Tabs */}
           <div className="flex bg-slate-100 p-1 rounded-lg">
              {[
                { id: TabType.SUMMARY, label: '요약', icon: FileText },
                { id: TabType.DETAIL, label: '상세', icon: Book },
                { id: TabType.SLIDES, label: '슬라이드', icon: Monitor },
                { id: TabType.QUESTIONS, label: '문족(기출)', icon: HelpCircle },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white text-brand-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
           </div>

           <button 
             onClick={() => setShowRightPanel(!showRightPanel)}
             className={`p-2 rounded-md ${showRightPanel ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:bg-slate-50'}`}
           >
             <Bot size={20} />
           </button>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden relative">
          {renderContent()}
        </div>
      </div>

      {/* Right: AI Assistant (Collapsible) */}
      {showRightPanel && (
        <div className="w-96 border-l border-slate-200 bg-white flex flex-col shadow-xl z-20">
          <div className="h-14 border-b border-slate-200 flex items-center px-4 justify-between bg-slate-50">
             <div className="flex items-center gap-2 text-brand-700 font-semibold">
               <Bot size={18} />
               학습 조교
             </div>
             <div className="text-xs text-slate-400">Gemini 2.5 Flash</div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
             {messages.map((msg) => (
               <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                   msg.role === 'user' 
                    ? 'bg-brand-600 text-white rounded-br-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                 }`}>
                   {msg.text}
                 </div>
               </div>
             ))}
             {isTyping && (
               <div className="flex justify-start">
                 <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none text-xs text-slate-400 italic">
                   생각 중...
                 </div>
               </div>
             )}
             <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="이 주제에 대해 질문하세요..."
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-sm"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicStudy;