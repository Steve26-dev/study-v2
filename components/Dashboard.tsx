import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Play, TrendingUp, AlertCircle, Calendar, ArrowRight } from 'lucide-react';
import { SRItem } from '../types';

const data = [
  { name: '생리학', score: 45 },
  { name: '해부학', score: 72 },
  { name: '병리학', score: 38 },
  { name: '약리학', score: 65 },
  { name: '미생물학', score: 55 },
];

const mockQueue: SRItem[] = [
  { id: '1', topicId: 't1', title: '심박출량(Cardiac Output)의 기전', dueDate: '오늘', status: 'due', priority: 'high' },
  { id: '2', topicId: 't2', title: '뇌신경(Cranial Nerves) V-VII', dueDate: '오늘', status: 'due', priority: 'medium' },
  { id: '3', topicId: 't3', title: '항생제 분류 및 작용기전', dueDate: '어제', status: 'due', priority: 'high' },
];

interface DashboardProps {
  onNavigate: (path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">좋은 아침입니다, 의대생님</h1>
          <p className="text-slate-500">오늘 복습해야 할 카드가 <span className="text-brand-600 font-bold">{mockQueue.length}개</span> 있습니다.</p>
        </div>
        <button 
          onClick={() => onNavigate('/library')}
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-brand-200 transition-all flex items-center gap-2 font-medium"
        >
          <Play size={20} />
          학습 시작
        </button>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group">
          <div className="bg-indigo-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <TrendingUp className="text-indigo-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">약점 집중 공략</h3>
          <p className="text-sm text-slate-500 mt-1">정답률 낮은 주제 복습 (병리학)</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group">
           <div className="bg-rose-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <AlertCircle className="text-rose-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">오답 노트</h3>
          <p className="text-sm text-slate-500 mt-1">어제 틀린 15문제 다시 풀기</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group">
           <div className="bg-emerald-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Calendar className="text-emerald-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">실전 모의고사</h3>
          <p className="text-sm text-slate-500 mt-1">전범위 무작위 20문항 생성</p>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: SR Queue */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span>오늘의 복습 큐(SR)</span>
            <span className="bg-brand-100 text-brand-700 text-xs px-2 py-1 rounded-full">{mockQueue.length}</span>
          </h2>
          <div className="space-y-4">
            {mockQueue.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-12 rounded-full ${item.priority === 'high' ? 'bg-rose-500' : 'bg-amber-400'}`}></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{item.title}</h4>
                    <p className="text-sm text-slate-500">기한: {item.dueDate}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate(`/topic/${item.topicId}`)}
                  className="text-brand-600 bg-brand-50 hover:bg-brand-100 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">과목별 성취도</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 12 }} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score < 50 ? '#f43f5e' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-slate-50 rounded-xl text-sm text-slate-600">
            <p className="font-semibold mb-1 text-slate-800">AI 분석:</p>
            이번 주 병리학 점수가 5% 하락했습니다. "염증 반응의 역학" 단원을 중점적으로 복습하는 것을 추천합니다.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;