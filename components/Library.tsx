import React, { useState, useRef } from 'react';
import { Search, Filter, BookOpen, Clock, ChevronRight, Upload, FileText } from 'lucide-react';
import { Topic } from '../types';

interface LibraryProps {
  topics: Topic[];
  onSelectTopic: (id: string) => void;
  onAddTopic: (topic: Topic) => void;
}

const Library: React.FC<LibraryProps> = ({ topics, onSelectTopic, onAddTopic }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('전체');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subjects = ['전체', ...Array.from(new Set(topics.map(t => t.subject)))];

  const filteredTopics = topics.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === '전체' || t.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a local URL for the file to display in iframe
    const fileUrl = URL.createObjectURL(file);
    
    // Create a new topic based on the file
    const newTopic: Topic = {
      id: Date.now().toString(),
      title: file.name.replace('.pdf', ''), // Use filename as title
      subject: '개인 학습', // Default subject
      professor: '업로드 자료',
      lastStudied: '방금 전',
      masteryLevel: 0,
      tags: ['PDF', '개인자료'],
      fileUrl: fileUrl
    };

    onAddTopic(newTopic);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Optional: Auto navigate to the new topic? 
    // For now, just showing it in the list is enough.
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">라이브러리</h1>
          <p className="text-slate-500 mt-1">학습 자료와 주제 카드를 관리하세요.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto items-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="application/pdf" 
            className="hidden" 
          />
          <button 
            onClick={handleUploadClick}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 font-medium transition-colors whitespace-nowrap"
          >
            <Upload size={18} />
            PDF 자료 업로드
          </button>

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
                <span className={`text-xs font-bold tracking-wider uppercase px-2 py-1 rounded-md ${topic.fileUrl ? 'bg-indigo-50 text-indigo-600' : 'bg-brand-50 text-brand-600'}`}>
                  {topic.subject}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  topic.masteryLevel > 70 ? 'bg-emerald-100 text-emerald-700' :
                  topic.masteryLevel > 40 ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  성취도 {topic.masteryLevel}%
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
                {topic.fileUrl && <FileText className="inline-block mr-1 text-slate-400" size={16} />}
                {topic.title}
              </h3>
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