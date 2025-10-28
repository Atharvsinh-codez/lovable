"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Plus, 
  Calendar, 
  Tag,
  Grid,
  List,
  Search,
  Filter,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/button';
import Badge from '@/components/ui/shadcn/badge';
import { cn } from '@/utils/cn';

interface Template {
  id: string;
  name: string;
  description: string;
  artifactType: string;
  version: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

interface TemplateLibraryProps {
  workspaceId?: string;
  onSelectTemplate?: (template: Template) => void;
  onCreateNew?: () => void;
}

export function TemplateLibrary({ 
  workspaceId = 'default',
  onSelectTemplate,
  onCreateNew
}: TemplateLibraryProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, [workspaceId, selectedType]);

  const loadTemplates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        workspaceId,
        ...(selectedType && { artifactType: selectedType })
      });
      
      const response = await fetch(`/api/templates/list?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to load templates');
      }
      
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (err) {
      console.error('Error loading templates:', err);
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery.trim() === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const artifactTypes = Array.from(new Set(templates.map(t => t.artifactType)));

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Template Library</CardTitle>
              <CardDescription>
                Browse and select from saved templates
              </CardDescription>
            </div>
            <Button onClick={onCreateNew} variant="default">
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-border-faint rounded-8 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={selectedType || ''}
                  onChange={(e) => setSelectedType(e.target.value || null)}
                  className="appearance-none pl-3 pr-10 py-2 text-sm border border-border-faint rounded-8 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {artifactTypes.map(type => (
                    <option key={type} value={type}>
                      {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>

              <div className="flex border border-border-faint rounded-8 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === 'grid' 
                      ? "bg-zinc-900 text-white" 
                      : "bg-white text-zinc-600 hover:bg-zinc-50"
                  )}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 transition-colors border-l border-border-faint",
                    viewMode === 'list' 
                      ? "bg-zinc-900 text-white" 
                      : "bg-white text-zinc-600 hover:bg-zinc-50"
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
              <span className="ml-3 text-sm text-foreground-dimmer">
                Loading templates...
              </span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-red-600">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-foreground-dimmer">
              <FileText className="w-12 h-12 mb-3 text-zinc-300" />
              <p className="text-sm font-medium">No templates found</p>
              <p className="text-xs mt-1">
                {searchQuery || selectedType 
                  ? 'Try adjusting your filters' 
                  : 'Create your first template to get started'}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className={cn(
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
                  : "space-y-3"
              )}>
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "group relative border border-border-faint rounded-12 p-4 transition-all cursor-pointer",
                      "hover:border-zinc-400 hover:shadow-md bg-white"
                    )}
                    onClick={() => onSelectTemplate?.(template)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "flex-shrink-0 w-12 h-12 rounded-8 flex items-center justify-center",
                        "bg-gradient-to-br from-zinc-100 to-zinc-200"
                      )}>
                        <FileText className="w-6 h-6 text-zinc-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground truncate">
                            {template.name}
                          </h4>
                          <p className={cn(
                            "text-xs text-foreground-dimmer mt-1",
                            viewMode === 'grid' ? "line-clamp-2" : ""
                          )}>
                            {template.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5">
                            {template.artifactType.replace('-', ' ')}
                          </Badge>
                          {template.tags?.slice(0, 2).map((tag, i) => (
                            <Badge key={i} className="bg-zinc-100 text-zinc-600 text-xs px-2 py-0.5">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-foreground-dimmer">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(template.createdAt)}
                          </div>
                          {template.author && (
                            <span>by {template.author}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTemplate?.(template);
                        }}
                      >
                        Use Template
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
