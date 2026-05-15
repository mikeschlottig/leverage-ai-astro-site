import React, { useState, useEffect } from 'react';
import { Search, Plus, Upload, Download, X, Code, Tag, Globe, Box, Filter, Image, FileText, Trash2, Edit2, Save, Grid3x3, List } from 'lucide-react';

const DeploymentTracker = () => {
  const [deployments, setDeployments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTags, setFilterTags] = useState([]);
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [newDeployment, setNewDeployment] = useState({
    name: '',
    url: '',
    type: 'website',
    description: '',
    tags: ''
  });

  // Load deployments from storage on mount
  useEffect(() => {
    loadDeployments();
  }, []);

  const loadDeployments = async () => {
    try {
      const result = await window.storage.list('deploy:');
      if (result && result.keys) {
        const loaded = await Promise.all(
          result.keys.map(async key => {
            const data = await window.storage.get(key);
            return data ? JSON.parse(data.value) : null;
          })
        );
        setDeployments(loaded.filter(Boolean));
      }
    } catch (error) {
      console.log('No existing deployments found');
    } finally {
      setIsLoading(false);
    }
  };

  const saveDeployment = async (deployment) => {
    try {
      await window.storage.set(`deploy:${deployment.id}`, JSON.stringify(deployment));
      await loadDeployments();
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save deployment');
    }
  };

  const deleteDeployment = async (id) => {
    if (!confirm('Delete this deployment?')) return;
    try {
      await window.storage.delete(`deploy:${id}`);
      await loadDeployments();
      setSelectedDeployment(null);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleAddDeployment = () => {
    const deployment = {
      id: Date.now().toString(),
      name: newDeployment.name,
      url: newDeployment.url,
      type: newDeployment.type || 'website',
      tags: newDeployment.tags.split(',').map(t => t.trim()).filter(Boolean),
      codeSnippets: [],
      description: newDeployment.description || '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    saveDeployment(deployment);
    setShowAddModal(false);
    setNewDeployment({ name: '', url: '', type: 'website', description: '', tags: '' });
  };

  const handleBulkImport = async (file) => {
    const text = await file.text();
    const ext = file.name.split('.').pop().toLowerCase();
    
    let items = [];
    
    try {
      if (ext === 'json') {
        items = JSON.parse(text);
      } else if (ext === 'csv') {
        const lines = text.split('\n').filter(l => l.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        items = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj = {};
          headers.forEach((h, i) => obj[h] = values[i]);
          return obj;
        });
      } else if (ext === 'md' || ext === 'txt') {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = text.match(urlRegex) || [];
        items = urls.map(url => ({ url, name: url.split('/')[2] }));
      } else if (ext === 'pdf') {
        await extractFromPDF(file);
        return;
      }

      // Process and save items
      for (const item of items) {
        if (item.url) {
          const deployment = {
            id: Date.now().toString() + Math.random(),
            name: item.name || item.url.split('/')[2] || 'Unnamed',
            url: item.url,
            type: item.type || 'website',
            tags: Array.isArray(item.tags) ? item.tags : (item.tags ? item.tags.split(',') : []),
            codeSnippets: item.codeSnippets || [],
            description: item.description || '',
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
          await saveDeployment(deployment);
        }
      }
      
      alert(`Imported ${items.length} deployments`);
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import. Check file format.');
    }
  };

  const extractFromPDF = async (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result.split(',')[1];
      
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{
              role: 'user',
              content: [
                {
                  type: 'document',
                  source: { type: 'base64', media_type: 'application/pdf', data: base64 }
                },
                {
                  type: 'text',
                  text: 'Extract all URLs and app/website names from this document. Return ONLY a JSON array with objects containing "url" and "name" fields. No other text.'
                }
              ]
            }]
          })
        });

        const data = await response.json();
        const text = data.content.map(c => c.text || '').join('');
        const clean = text.replace(/```json|```/g, '').trim();
        const items = JSON.parse(clean);

        for (const item of items) {
          const deployment = {
            id: Date.now().toString() + Math.random(),
            name: item.name || item.url.split('/')[2] || 'Unnamed',
            url: item.url,
            type: 'website',
            tags: ['imported-from-pdf'],
            codeSnippets: [],
            description: '',
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
          await saveDeployment(deployment);
        }
        
        alert(`Extracted ${items.length} deployments from PDF`);
      } catch (error) {
        console.error('PDF extraction error:', error);
        alert('Failed to extract from PDF');
      }
    };
    reader.readAsDataURL(file);
  };

  const extractFromImage = async (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result.split(',')[1];
      
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: { type: 'base64', media_type: file.type, data: base64 }
                },
                {
                  type: 'text',
                  text: 'Extract all URLs and app/website names visible in this image. Return ONLY a JSON array with objects containing "url" and "name" fields. No other text.'
                }
              ]
            }]
          })
        });

        const data = await response.json();
        const text = data.content.map(c => c.text || '').join('');
        const clean = text.replace(/```json|```/g, '').trim();
        const items = JSON.parse(clean);

        for (const item of items) {
          const deployment = {
            id: Date.now().toString() + Math.random(),
            name: item.name || item.url.split('/')[2] || 'Unnamed',
            url: item.url,
            type: 'website',
            tags: ['imported-from-image'],
            codeSnippets: [],
            description: '',
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
          await saveDeployment(deployment);
        }
        
        alert(`Extracted ${items.length} deployments from image`);
      } catch (error) {
        console.error('Image extraction error:', error);
        alert('Failed to extract from image');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleExport = (format) => {
    let content = '';
    let mimeType = 'text/plain';
    let filename = `deployments.${format}`;

    if (format === 'json') {
      content = JSON.stringify(deployments, null, 2);
      mimeType = 'application/json';
    } else if (format === 'csv') {
      const headers = ['name', 'url', 'type', 'tags', 'description'];
      content = headers.join(',') + '\n';
      content += deployments.map(d => 
        `"${d.name}","${d.url}","${d.type}","${d.tags.join(';')}","${d.description}"`
      ).join('\n');
    } else if (format === 'md') {
      content = '# Deployments\n\n';
      deployments.forEach(d => {
        content += `## ${d.name}\n`;
        content += `- **URL**: ${d.url}\n`;
        content += `- **Type**: ${d.type}\n`;
        content += `- **Tags**: ${d.tags.join(', ')}\n`;
        if (d.description) content += `- **Description**: ${d.description}\n`;
        content += '\n';
      });
    } else {
      content = deployments.map(d => `${d.name}: ${d.url}`).join('\n');
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addCodeSnippet = () => {
    if (!selectedDeployment) return;
    
    const snippet = {
      id: Date.now().toString(),
      title: 'New Snippet',
      language: 'javascript',
      code: '// Your code here'
    };
    
    const updated = {
      ...selectedDeployment,
      codeSnippets: [...selectedDeployment.codeSnippets, snippet],
      updatedAt: Date.now()
    };
    
    saveDeployment(updated);
    setSelectedDeployment(updated);
  };

  const updateSnippet = (snippetId, field, value) => {
    const updated = {
      ...selectedDeployment,
      codeSnippets: selectedDeployment.codeSnippets.map(s =>
        s.id === snippetId ? { ...s, [field]: value } : s
      ),
      updatedAt: Date.now()
    };
    saveDeployment(updated);
    setSelectedDeployment(updated);
  };

  const deleteSnippet = (snippetId) => {
    const updated = {
      ...selectedDeployment,
      codeSnippets: selectedDeployment.codeSnippets.filter(s => s.id !== snippetId),
      updatedAt: Date.now()
    };
    saveDeployment(updated);
    setSelectedDeployment(updated);
  };

  const addTag = (tag) => {
    if (!selectedDeployment || !tag.trim()) return;
    
    const updated = {
      ...selectedDeployment,
      tags: [...new Set([...selectedDeployment.tags, tag.trim()])],
      updatedAt: Date.now()
    };
    
    saveDeployment(updated);
    setSelectedDeployment(updated);
  };

  const removeTag = (tag) => {
    const updated = {
      ...selectedDeployment,
      tags: selectedDeployment.tags.filter(t => t !== tag),
      updatedAt: Date.now()
    };
    saveDeployment(updated);
    setSelectedDeployment(updated);
  };

  const updateDeploymentField = (field, value) => {
    const updated = {
      ...selectedDeployment,
      [field]: value,
      updatedAt: Date.now()
    };
    saveDeployment(updated);
    setSelectedDeployment(updated);
  };

  const allTags = [...new Set(deployments.flatMap(d => d.tags))];
  
  const filteredDeployments = deployments.filter(d => {
    const matchesSearch = !searchTerm || 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTags = filterTags.length === 0 || 
      filterTags.every(ft => d.tags.includes(ft));
    
    return matchesSearch && matchesTags;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900 text-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold mb-2">Deployment Tracker</h1>
          <p className="text-sm text-gray-400">{deployments.length} total deployments</p>
        </div>

        <div className="p-4 border-b border-slate-700">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search deployments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Add Deployment
            </button>

            <div className="relative">
              <input
                type="file"
                accept=".json,.csv,.md,.txt,.pdf,.png,.jpg,.jpeg"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    if (file.type.includes('image')) {
                      extractFromImage(file);
                    } else {
                      handleBulkImport(file);
                    }
                  }
                }}
                className="hidden"
                id="import-file"
              />
              <label
                htmlFor="import-file"
                className="w-full flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Import
              </label>
            </div>

            <div className="relative group">
              <button className="w-full flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition">
                <Download className="w-4 h-4" />
                Export
              </button>
              <div className="hidden group-hover:block absolute left-0 right-0 top-full mt-1 bg-slate-700 border border-slate-600 rounded-lg overflow-hidden z-10">
                {['json', 'csv', 'md', 'txt'].map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => handleExport(fmt)}
                    className="w-full px-4 py-2 text-left hover:bg-slate-600 transition"
                  >
                    .{fmt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold">Filter by Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilterTags(prev => 
                    prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                  )}
                  className={`px-2 py-1 text-xs rounded ${
                    filterTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">
              {filteredDeployments.length} Deployment{filteredDeployments.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
              }`}
              title="Grid View"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded transition ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
              }`}
              title="Table View"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDeployments.map(deployment => (
              <div
                key={deployment.id}
                onClick={() => setSelectedDeployment(deployment)}
                className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {deployment.type === 'app' ? (
                      <Box className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Globe className="w-5 h-5 text-green-400" />
                    )}
                    <h3 className="font-semibold truncate">{deployment.name}</h3>
                  </div>
                </div>
                
                <p className="text-sm text-blue-400 mb-2 truncate">{deployment.url}</p>
                
                {deployment.description && (
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {deployment.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {deployment.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs bg-slate-700 rounded">
                      {tag}
                    </span>
                  ))}
                  {deployment.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-slate-700 rounded">
                      +{deployment.tags.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Code className="w-3 h-3" />
                    {deployment.codeSnippets.length}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {deployment.tags.length}
                  </span>
                </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">URL</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Tags</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Snippets</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {filteredDeployments.map(deployment => (
                      <tr
                        key={deployment.id}
                        onClick={() => setSelectedDeployment(deployment)}
                        className="hover:bg-slate-700/30 cursor-pointer transition"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {deployment.type === 'app' ? (
                              <Box className="w-4 h-4 text-blue-400" />
                            ) : (
                              <Globe className="w-4 h-4 text-green-400" />
                            )}
                            <span className="text-sm capitalize">{deployment.type}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{deployment.name}</div>
                          {deployment.description && (
                            <div className="text-xs text-gray-400 truncate max-w-xs">
                              {deployment.description}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={deployment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-400 hover:text-blue-300 text-sm truncate block max-w-xs"
                          >
                            {deployment.url}
                          </a>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {deployment.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="px-2 py-0.5 text-xs bg-slate-700 rounded">
                                {tag}
                              </span>
                            ))}
                            {deployment.tags.length > 2 && (
                              <span className="px-2 py-0.5 text-xs bg-slate-700 rounded">
                                +{deployment.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-400">
                            <Code className="w-3 h-3" />
                            {deployment.codeSnippets.length}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">
                          {new Date(deployment.updatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredDeployments.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  No deployments found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDeployment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Deployment Details</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => deleteDeployment(selectedDeployment.id)}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedDeployment(null)}
                  className="p-2 hover:bg-slate-700 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  value={selectedDeployment.name}
                  onChange={(e) => updateDeploymentField('name', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">URL</label>
                <input
                  type="text"
                  value={selectedDeployment.url}
                  onChange={(e) => updateDeploymentField('url', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Type</label>
                <select
                  value={selectedDeployment.type}
                  onChange={(e) => updateDeploymentField('type', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="website">Website</option>
                  <option value="app">App</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={selectedDeployment.description}
                  onChange={(e) => updateDeploymentField('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedDeployment.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-700 rounded-full flex items-center gap-2">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add tag..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTag(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold">Code Snippets</label>
                  <button
                    onClick={addCodeSnippet}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Snippet
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedDeployment.codeSnippets.map(snippet => (
                    <div key={snippet.id} className="bg-slate-700 rounded-lg p-4">
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={snippet.title}
                          onChange={(e) => updateSnippet(snippet.id, 'title', e.target.value)}
                          className="flex-1 px-3 py-1 bg-slate-600 border border-slate-500 rounded focus:outline-none focus:border-blue-500"
                        />
                        <select
                          value={snippet.language}
                          onChange={(e) => updateSnippet(snippet.id, 'language', e.target.value)}
                          className="px-3 py-1 bg-slate-600 border border-slate-500 rounded focus:outline-none focus:border-blue-500"
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="typescript">TypeScript</option>
                          <option value="python">Python</option>
                          <option value="html">HTML</option>
                          <option value="css">CSS</option>
                          <option value="json">JSON</option>
                        </select>
                        <button
                          onClick={() => deleteSnippet(snippet.id)}
                          className="px-2 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        value={snippet.code}
                        onChange={(e) => updateSnippet(snippet.id, 'code', e.target.value)}
                        rows={5}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded font-mono text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Deployment</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={newDeployment.name}
                  onChange={(e) => setNewDeployment({...newDeployment, name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">URL</label>
                <input
                  type="url"
                  required
                  value={newDeployment.url}
                  onChange={(e) => setNewDeployment({...newDeployment, url: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Type</label>
                <select
                  value={newDeployment.type}
                  onChange={(e) => setNewDeployment({...newDeployment, type: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="website">Website</option>
                  <option value="app">App</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  rows={3}
                  value={newDeployment.description}
                  onChange={(e) => setNewDeployment({...newDeployment, description: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="production, frontend, api"
                  value={newDeployment.tags}
                  onChange={(e) => setNewDeployment({...newDeployment, tags: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleAddDeployment}
                disabled={!newDeployment.name || !newDeployment.url}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg transition"
              >
                Add Deployment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeploymentTracker;