import React, { useState } from 'react';
import { Search, Filter, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { Topic } from '../types';

interface LibraryProps {
  onSelectTopic: (id: string) => void;
}

const mockTopics: Topic[] = [
  { id: 't1', title: '심박출량(Cardiac Output)의 기전', subject: '생리학', professor: '김철수 교수', lastStudied: '2일 전', masteryLevel: 75, tags: ['심장', '순환기'] },
  { id: 't2', title: '뇌신경(Cranial Nerves) V-VII', subject: '해부학', professor: '이영희 교수', lastStudied: '5일 전', masteryLevel: 40, tags: ['신경', '두경부'] },
  { id: 't3', title: '항생제 분류 및 작용기전', subject: '약리학', professor: '박준호 교수', lastStudied: '1주 전', masteryLevel: 90, tags: ['약물', '감염'] },
  { id: 't4', title: '신장 사구체 여과율(GFR)', subject: '생리학', professor: '김철수 교수', lastStudied: '학습 안 함', masteryLevel: 0, tags: ['신장'] },
  { id: 't5', title: '폐암의 종류와 병리', subject: '병리학', professor: '최민수 교수', lastStudied: '3일 전', masteryLevel: 60, tags: ['종양', '호흡기'] },
];

const Library: React.FC<LibraryProps> = ({ onSelectTopic }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('전체');

  const subjects = ['전체', ...Array.from(new Set(mockTopics.map(t => t.subject)))];

  const filteredTopics = mockTopics.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === '전체' || t.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">라이브러리</h1>
          <p className="text-slate-500 mt-1">학습 자료와 주제 카드를 관리하세요.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="주제 검색..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {subjects.map(subject => (
          <button
            key={subject}
            onClick={() => setSelectedSubject(subject)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedSubject === subject 
                ? 'bg-slate-900 text-white' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {subject}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map(topic => (
          <div 
            key={topic.id}
            onClick={() => onSelectTopic(topic.id)}
            className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-brand-200 transition-all cursor-pointer flex flex-col justify-between h-48"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold tracking-wider text-brand-600 uppercase bg-brand-50 px-2 py-1 rounded-md">{topic.subject}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  topic.masteryLevel > 70 ? 'bg-emerald-100 text-emerald-700' :
                  topic.masteryLevel > 40 ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  성취도 {topic.masteryLevel}%
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 group-hover:text-brand-600 transition-colors">{topic.title}</h3>
              <p className="text-sm text-slate-500">{topic.professor}</p>
            </div>

            <div className="flex items-center justify-between mt-4 border-t border-slate-50 pt-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock size={14} />
                <span>{topic.lastStudied}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;