'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Email {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  labels?: Array<{
    name: string;
    color: string;
    priority: number;
  }>;
  archived?: boolean;
  draftReply?: string;
  read?: boolean;
  summary?: string;
}

interface PreviewContent {
  html?: string | null;
  text?: string | null;
}

const DEFAULT_PROMPT = `You are an email labeling assistant. Analyze the following emails and take the appropriate actions.

The emails are...

...from substack, or a substack newsletter: label: "substack", blue, 3
...from a newsletter: label: "newsletter", blue, 3
...from github: label: "github", green, 1
...tech-related, e.g. a forum digest: label: "Tech", gray, 4
...from tj raklovits: label: "tj", red, 1,im out this week, so let him know ill get back monday with the draft
...important: Label: "important", gold, 1.
...trying to sell me something: archive

you can add more than one label (and should when necessary)
Be sure to write replies when necessary.
Contact for draft replies:
You're Josh, a 19 year old programmer.

You're very busy, and so is everyone you correspond with, so do your best to keep your emails as short as possible and to the point. Avoid what isn't necessary and do your best to put punctuation or leave misspellings unaddressed because it's not a big deal and you'd rather save the time. You never use emoji in biz emails. Do your best to be kind, and don't be so informal that it comes across as cliche.

Emojis and soft language are OK in personal emails, but not for anything else.`;

function getInitials(from: string) {
  const match = from.match(/^(.*?)</);
  const name = match ? match[1].trim() : from.split('@')[0];
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || '?';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function decodeEntities(str: string) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

export default function Dashboard() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [selected, setSelected] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [appliedActions, setAppliedActions] = useState<Record<string, any>>({});
  const [previewEmailId, setPreviewEmailId] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<PreviewContent | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'archived'>('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [emailsError, setEmailsError] = useState<string | null>(null);
  const [promptSaved, setPromptSaved] = useState(false);
  const router = useRouter();

  // Fetch emails from API when authenticated
  useEffect(() => {
    if (accessToken) {
      setLoadingEmails(true);
      setEmailsError(null);
      fetch(`/api/emails?access_token=${accessToken}`)
        .then(res => res.json())
        .then(data => {
          if (data.emails) {
            setEmails(data.emails);
          } else {
            setEmailsError(data.error || 'Failed to load emails');
          }
        })
        .catch(err => setEmailsError(err.message))
        .finally(() => setLoadingEmails(false));
    }
  }, [accessToken]);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = selected.length > 0 && selected.length < emails.length;
    }
  }, [selected, emails]);

  // Ensure we only check localStorage after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const token = localStorage.getItem('access_token');
      const refresh = localStorage.getItem('refresh_token');
      setAccessToken(token);
      setRefreshToken(refresh);
      if (!token) {
        router.replace('/login');
        setShouldRender(false);
      } else {
        setShouldRender(true);
      }
    }
  }, [mounted, router]);

  // Dark mode toggle effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

  // Load prompt from localStorage on mount
  useEffect(() => {
    const savedPrompt = localStorage.getItem('ai_email_prompt');
    if (savedPrompt) setPrompt(savedPrompt);
  }, []);

  const handleLogout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
    setEmails([]);
  };

  const handleSelect = (id: string) => {
    setSelected(sel => sel.includes(id) ? sel.filter(eid => eid !== id) : [...sel, id]);
  };

  const handleProcessEmails = async () => {
    setProcessing(true);
    setAiResult(null);
    try {
      const res = await fetch('/api/process-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          emails: emails.filter(e => selected.includes(e.id)),
          access_token: accessToken
        })
      });
      const data = await res.json();
      setAiResult(data);
    } catch (err: any) {
      setAiResult({ error: err.message });
    }
    setProcessing(false);
  };

  const applyAction = async (action: any) => {
    try {
      const res = await fetch('/api/apply-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actions: [action], access_token: accessToken })
      });
      const result = await res.json();
      if (result.results && result.results[0] && result.results[0].success) {
        setAppliedActions(prev => ({ ...prev, [action.emailId]: action }));
        setEmails(prevEmails => prevEmails.map(email => {
          if (email.id !== action.emailId) return email;
          let updated = { ...email };
          if (action.labels) updated.labels = action.labels;
          if (action.shouldArchive === true) updated.archived = true;
          if (action.draftReply) updated.draftReply = action.draftReply;
          return updated;
        }));
      } else {
        alert(`Failed to apply action: ${result.results?.[0]?.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      alert('Error applying action. Please try again.');
    }
  };

  const handlePreview = async (emailId: string) => {
    setPreviewEmailId(emailId);
    setPreviewContent(null);
    setPreviewError(null);
    setPreviewLoading(true);
    try {
      const res = await fetch(`/api/email/${emailId}?access_token=${accessToken}`);
      const data = await res.json();
      setPreviewContent(data);
    } catch (err: any) {
      setPreviewError('Failed to load email content');
    }
    setPreviewLoading(false);
  };

  const closePreview = () => {
    setPreviewEmailId(null);
    setPreviewContent(null);
    setPreviewError(null);
  };

  const handleAutoApply = async () => {
    if (!aiResult || !aiResult.actions) {
      alert('No AI suggestions to apply. Please process emails first.');
      return;
    }
    
    aiResult.actions.forEach((action: any) => {
      setAppliedActions(prev => ({ ...prev, [action.emailId]: action }));
      setEmails(prevEmails => prevEmails.map(email => {
        if (email.id !== action.emailId) return email;
        let updated = { ...email };
        
        if (action.labels) {
          updated.labels = action.labels;
        }
        
        if (action.shouldArchive === true) {
          updated.archived = true;
        }
        
        if (action.draftReply) {
          updated.draftReply = action.draftReply;
        }
        
        return updated;
      }));
    });
    
    alert(`Successfully applied all ${aiResult.actions.length} AI suggestions to UI!`);
  };

  const handleSaveToGmail = async () => {
    const appliedActionsList = Object.values(appliedActions);
    if (appliedActionsList.length === 0) {
      alert('No changes to save. Please apply some AI suggestions first.');
      return;
    }
    try {
      const res = await fetch('/api/apply-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actions: appliedActionsList, access_token: accessToken })
      });
      const result = await res.json();
      if (result.results && result.results.every((r: any) => r.success)) {
        alert(`Successfully saved all ${appliedActionsList.length} changes to Gmail!`);
        setAppliedActions({});
      } else {
        const failed = result.results?.filter((r: any) => !r.success) || [];
        alert(`Successfully saved some (${appliedActionsList.length - failed.length}) of ${appliedActionsList.length} changes to Gmail!`);

        console.log(`Some actions failed to save: ${failed.map((f: any) => f.emailId + ': ' + (f.error || 'Unknown error')).join(', ')}`);
      }
    } catch (err: any) {
      alert('Error saving to Gmail: ' + (err.message || err));
    }
  };

  const handleSavePrompt = () => {
    localStorage.setItem('ai_email_prompt', prompt);
    setPromptSaved(true);
    setTimeout(() => setPromptSaved(false), 1500);
  };

  const sortedEmails = [...emails].sort((a, b) => {
    const priorityA = a.labels && a.labels.length > 0 ? Math.min(...a.labels.map(l => l.priority)) : 999;
    const priorityB = b.labels && b.labels.length > 0 ? Math.min(...b.labels.map(l => l.priority)) : 999;
    
    if (a.archived && !b.archived) return 1;
    if (!a.archived && b.archived) return -1;
    
    if (a.archived && b.archived) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  if (!shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <span className="text-lg text-gray-500 dark:text-gray-300">Redirecting to login...</span>
      </div>
    );
  }

  // Show loading or error state for emails
  if (loadingEmails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <span className="text-lg text-gray-500 dark:text-gray-300">Loading emails...</span>
      </div>
    );
  }
  if (emailsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <span className="text-lg text-red-500">{emailsError}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Top Bar */}
      <div className="bg-white/80 dark:bg-gray-950/90 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Email Assistant
            </h1>
            <div className="flex items-center gap-4">

              <button 
                onClick={handleLogout}
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-300">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Email Reading Agent System Prompt</h2>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                className="w-full h-48 p-4 border border-gray-300 dark:border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 dark:bg-gray-900 transition-colors duration-300"
                placeholder="Enter your AI prompt..."
              />
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={handleSavePrompt}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg text-sm font-medium transition-colors border border-gray-300"
                  type="button"
                >
                  Save
                </button>
                {promptSaved && <span className="text-green-600 text-sm">Saved!</span>}
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Available Tools</h3>
                <div className="space-y-2">
                  <button disabled className="w-full text-left p-3 bg-gray-50 dark:bg-gray-900 text-blue-600 dark:text-blue-400 font-semibold rounded-lg border border-gray-200 dark:border-gray-700">
                    labelEmail(label, color, priority)
                  </button>
                  <button disabled className="w-full text-left p-3 bg-gray-50 dark:bg-gray-900 text-blue-600 dark:text-blue-400 font-semibold rounded-lg border border-gray-200 dark:border-gray-700">
                    archiveEmail()
                  </button>
                  <button disabled className="w-full text-left p-3 bg-gray-50 dark:bg-gray-900 text-blue-600 dark:text-blue-400 font-semibold rounded-lg border border-gray-200 dark:border-gray-700">
                    draftReply(body)
                  </button>
                </div>
              </div>

              <button 
                onClick={handleProcessEmails} 
                disabled={processing || selected.length === 0}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {processing ? 'Processing...' : 'Process Emails'}
              </button>

              {aiResult && aiResult.actions && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">AI Suggestions</h3>
                  <div className="space-y-4">
                    {aiResult.actions.map((action: any, idx: number) => {
                      const emailMeta = emails.find(e => e.id === action.emailId);
                      return (
                        <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900 transition-colors">
                          <div className="mb-2"><span className="font-semibold">Subject:</span> {emailMeta?.subject || '(No Subject)'}</div>
                          <div className="mb-2"><span className="font-semibold">From:</span> {emailMeta?.from || ''}</div>
                          {action.labels && action.labels.map((label: any, index: number) => (
                            <div key={index} className="mb-2">
                              <span className="font-semibold">Label {index + 1}:</span>
                              <span className="inline-block ml-2 px-3 py-1 rounded-full text-white text-sm font-semibold" style={{ backgroundColor: label.color }}>
                                {label.name}
                              </span>
                              <span className="text-gray-500 text-sm ml-2">Priority: {label.priority}</span>
                            </div>
                          ))}
                          {action.draftReply && (
                            <div className="mb-2">
                              <span className="font-semibold">Draft Reply:</span>
                              <pre className="mt-2 bg-gray-50 dark:bg-gray-900 p-3 rounded text-sm">{action.draftReply}</pre>
                            </div>
                          )}
                          {action.summary && (
                            <div className="text-gray-600 dark:text-gray-300 text-sm italic bg-gray-50 dark:bg-gray-900 p-3 rounded mb-2">
                              <span className="font-semibold">Summary:</span> {action.summary}
                            </div>
                          )}
                          <button 
                            onClick={() => applyAction(action)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Email Inbox ({emails.length})
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-3">
                    <span className="inline-block w-3 h-3 bg-blue-600 rounded-full mr-1"></span>Unread
                    <span className="inline-block w-3 h-3 bg-gray-400 rounded-full mx-1"></span>Read
                  </span>
                </h2>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center text-sm cursor-pointer text-gray-700 dark:text-gray-200">
                  <input
                    type="checkbox"
                    ref={selectAllRef}
                    checked={selected.length === emails.length && emails.length > 0}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelected(emails.map(e => e.id));
                      } else {
                        setSelected([]);
                      }
                    }}
                    className="mr-2"
                  />
                  Select All
                </label>
                
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as 'date' | 'priority' | 'archived')}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="priority">Sort by Priority</option>
                    <option value="archived">Sort by Archived</option>
                  </select>
                  
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded text-sm bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                  
                  <button
                    onClick={handleAutoApply}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                  >
                    Auto Apply All
                  </button>
                  
                  <button
                    onClick={handleSaveToGmail}
                    disabled={Object.keys(appliedActions).length === 0}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      Object.keys(appliedActions).length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    Save to Gmail ({Object.keys(appliedActions).length})
                  </button>
                </div>
              </div>

              {/* Email List */}
              <div className="space-y-3">
                {sortedEmails.map(email => (
                  <div
                    key={email.id}
                    className={`border rounded-lg p-4 transition-all ${
                      selected.includes(email.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-500'
                    } ${email.archived ? 'opacity-50 bg-gray-50 dark:bg-gray-800' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(email.id)}
                        onChange={e => { e.stopPropagation(); handleSelect(email.id); }}
                        className="mt-1"
                      />
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => handlePreview(email.id)}
                        tabIndex={0}
                        role="button"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handlePreview(email.id); }}
                      >
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-200 flex-shrink-0">
                          {getInitials(email.from)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`inline-block w-3 h-3 rounded-full ${email.read ? 'bg-gray-400' : 'bg-blue-600'}`}></span>
                            {email.labels && email.labels.length > 0 && (
                              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                                P{Math.min(...email.labels.map(l => l.priority))}
                              </span>
                            )}
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                              {decodeEntities(email.subject) || '(No Subject)'}
                            </h3>
                            <button
                              onClick={e => { e.stopPropagation(); handlePreview(email.id); }}
                              className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white"
                              title="Preview"
                            >
                              👁️
                            </button>
                          </div>
                          <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">{email.from}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{new Date(email.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-200">{decodeEntities(email.snippet)}</p>
                          {email.summary && (
                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-900 p-2 rounded">
                              <span className="font-semibold">Summary:</span> {email.summary}
                            </div>
                          )}
                          {email.labels && email.labels.map((label, index) => (
                            <span 
                              key={index} 
                              className="inline-block mt-2 mr-2 px-2 py-1 rounded-full text-white text-xs font-semibold"
                              style={{ backgroundColor: label.color }}
                            >
                              {label.name}
                            </span>
                          ))}
                          {email.draftReply && (
                            <div className="mt-2 text-sm bg-blue-50 dark:bg-blue-950 p-2 rounded">
                              <span className="font-semibold">Draft Reply:</span> {email.draftReply}
                            </div>
                          )}
                          {email.archived && (
                            <div className="mt-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Archived</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewEmailId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            ref={previewRef}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col transition-colors"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-900 truncate">
                {emails.find(e => e.id === previewEmailId)?.subject || '(No Subject)'}
              </h3>
              <button
                onClick={closePreview}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6 flex-1 flex flex-col gap-4">
              <div className="mb-2 text-sm text-gray-900">
                <span className="font-semibold">From:</span> {emails.find(e => e.id === previewEmailId)?.from}
              </div>
              <div className="mb-2 text-sm text-gray-900">
                <span className="font-semibold">Date:</span> {emails.find(e => e.id === previewEmailId)?.date}
              </div>
              <div className="bg-white rounded-lg p-4 flex-1 overflow-y-auto max-h-[60vh] transition-colors">
                {previewLoading && <div>Loading...</div>}
                {previewError && <div className="text-red-600">{previewError}</div>}
                {previewContent && previewContent.html ? (
                  <div
                    className="prose prose-sm max-w-none text-gray-900"
                    style={{ wordBreak: 'break-word' }}
                    dangerouslySetInnerHTML={{ __html: previewContent.html }}
                  />
                ) : previewContent && previewContent.text ? (
                  <pre
                    className="whitespace-pre-wrap text-sm text-gray-900 font-mono"
                    style={{ wordBreak: 'break-word' }}
                  >
                    {previewContent.text}
                  </pre>
                ) : (
                  !previewLoading && !previewError && (
                    <div className="text-gray-500">No content available for this email.</div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
