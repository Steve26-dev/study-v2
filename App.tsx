import React, { useState } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Library, Settings, BookOpen, Menu, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import LibraryView from './components/Library';
import TopicStudy from './components/TopicStudy';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // If we are in the Topic view, hide the sidebar to maximize space for study
  const isTopicView = location.pathname.includes('/topic/');
  if (isTopicView) return <>{children}</>;

  const navItems = [
    { icon: LayoutDashboard, label: '홈', path: '/' },
    { icon: Library, label: '라이브러리', path: '/library' },
    { icon: BookOpen, label: '약점 분석', path: '/weakness' },
    { icon: Settings, label: '설정', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 shadow-sm transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center mr-3">
             <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-slate-800">StudyOS</span>
          <button className="ml-auto md:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-brand-50 text-brand-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-brand-600' : 'text-slate-400'} />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2">
             <div className="w-8 h-8 rounded-full bg-slate-200"></div>
             <div>
               <p className="text-sm font-semibold text-slate-800">의과대학 학생</p>
               <p className="text-xs text-slate-500">무료 플랜</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between">
           <button onClick={() => setSidebarOpen(true)} className="text-slate-600">
             <Menu size={24} />
           </button>
           <span className="font-bold text-slate-800">StudyOS</span>
           <div className="w-6" /> 
        </div>

        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardWrapper />} />
          <Route path="/library" element={<LibraryWrapper />} />
          <Route path="/topic/:id" element={<TopicStudyWrapper />} />
          <Route path="*" element={<DashboardWrapper />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

// Wrappers to handle navigation logic
const DashboardWrapper = () => {
  const navigate = useNavigate();
  return <Dashboard onNavigate={navigate} />;
};

const LibraryWrapper = () => {
  const navigate = useNavigate();
  return <LibraryView onSelectTopic={(id) => navigate(`/topic/${id}`)} />;
};

const TopicStudyWrapper = () => {
  const navigate = useNavigate();
  // In a real app, use useParams to get ID
  return <TopicStudy topicId="demo" onBack={() => navigate('/library')} />;
};

export default App;