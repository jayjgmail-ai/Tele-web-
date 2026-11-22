import { useState, useEffect } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw, Zap, Shield, Edit3 } from 'lucide-react';
import { Partner } from '../types';
import { SiteContent } from '../data/siteContent';
import RichTextRenderer from './RichTextRenderer';

interface AiCoachTabProps {
  siteContent: SiteContent;
  partners: Partner[];
  isAdmin: boolean;
  onOpenCms: () => void;
}

export default function AiCoachTab({
  siteContent,
  partners,
  isAdmin,
  onOpenCms,
}: AiCoachTabProps) {
  const ai = siteContent.aiCoach;
  const [prompt, setPrompt] = useState('');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('none');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<
    Array<{ role: 'user' | 'assistant'; text: string; timestamp: string }>
  >([
    {
      role: 'assistant',
      text: ai.welcomeMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    setConversation((prev) => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [{ ...prev[0], text: ai.welcomeMessage }];
      }
      return prev;
    });
  }, [ai.welcomeMessage]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || prompt;
    if (!textToSend.trim()) return;

    const userMessage = {
      role: 'user' as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversation((prev) => [...prev, userMessage]);
    if (!customText) setPrompt('');
    setLoading(true);

    try {
      const selectedPartner = partners.find((p) => p.id === selectedPartnerId);

      const res = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          partnerData: selectedPartner || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || `Request failed with status ${res.status}`);
      }
      const aiResponse = data.response || 'No response received.';

      setConversation((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: aiResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (error: any) {
      console.error(error);
      setConversation((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: error?.message || 'Error communicating with AI Coach service. Please check your API configuration.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-white text-slate-900">
      {isAdmin && (
        <div className="flex justify-end">
          <button
            onClick={onOpenCms}
            className="px-4 py-2 rounded-xl bg-yellow-400 text-slate-950 font-black text-xs shadow-sm hover:bg-yellow-300 transition-all flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Page
          </button>
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        {ai.badge?.trim() && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 border border-pink-300 text-pink-900 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            {ai.badge}
          </div>
        )}
        {ai.heading?.trim() && (
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight">
            <RichTextRenderer text={ai.heading} inline />
          </h1>
        )}
        {ai.subheading?.trim() && (
          <div className="text-slate-600 text-sm sm:text-base">
            <RichTextRenderer text={ai.subheading} />
          </div>
        )}
      </div>

      {/* Controls / Partner Context */}
      <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Shield className="w-5 h-5 text-pink-600 shrink-0" />
          <span className="text-sm font-bold text-slate-900 whitespace-nowrap">
            {ai.contextLabel || 'Context Partner:'}
          </span>
          <select
            value={selectedPartnerId}
            onChange={(e) => setSelectedPartnerId(e.target.value)}
            className="w-full sm:w-64 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
          >
            <option value="none">{ai.generalOptionLabel || '-- General Academy Inquiry --'}</option>
            {partners.map((pt) => (
              <option key={pt.id} value={pt.id}>
                {pt.name} ({pt.category})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() =>
            setConversation([
              {
                role: 'assistant',
                text: ai.welcomeMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          className="px-4 py-2 rounded-xl bg-white border border-pink-200 text-slate-800 hover:bg-pink-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-pink-600" />
          {ai.resetBtnText || 'Reset Chat'}
        </button>
      </div>

      {/* Preset Prompts */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {ai.presetsLabel || 'Quick Prompts & Presets:'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ai.presetPrompts.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(preset)}
              className="text-left p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-pink-500 text-xs font-medium text-slate-700 hover:text-slate-900 transition-all flex items-center justify-between gap-2 group shadow-xs"
            >
              <span>{preset}</span>
              <Zap className="w-3.5 h-3.5 text-pink-600 shrink-0 group-hover:scale-110 transition-transform" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="rounded-3xl bg-white border border-pink-200 overflow-hidden shadow-2xl flex flex-col h-[550px]">
        <div className="p-4 bg-gradient-to-r from-pink-600 to-purple-700 text-white flex items-center space-x-3">
          <Bot className="w-5 h-5 text-yellow-300" />
          <span className="text-xs font-extrabold uppercase tracking-wider">
            {ai.consoleTitle || 'Telesports AI Sports Intelligence Console'}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3.5 ${
                msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'bg-pink-50 text-pink-600 border border-pink-200'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <Bot className="w-4 h-4 stroke-[2.5]" />
                )}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-pink-600 to-purple-700 text-white font-medium rounded-tr-none shadow-md'
                    : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-wrap shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-75">
                  <span className="font-bold">{msg.role === 'user' ? 'You (Coach)' : 'AI Sports Director'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 border border-pink-200 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200 text-slate-500 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-bounce delay-200"></span>
                Analyzing biomechanical metrics &amp; drafting response...
              </div>
            </div>
          )}
        </div>

        {/* Prompt Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3"
        >
          <input
            type="text"
            placeholder={ai.inputPlaceholder || 'Ask AI Coach for training regimens, scouting analysis, nutrition...'}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-600 disabled:opacity-50 shadow-xs"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-extrabold text-sm shadow-lg shadow-pink-600/20 hover:from-pink-500 hover:to-purple-600 transition-all flex items-center gap-2 disabled:opacity-50 shrink-0"
          >
            <Send className="w-4 h-4 text-yellow-300" />
            {ai.sendBtnText || 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
