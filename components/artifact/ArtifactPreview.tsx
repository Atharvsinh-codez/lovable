"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  X, 
  Download, 
  FileText,
  Quote,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Share2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/button';
import Badge from '@/components/ui/shadcn/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/shadcn/dropdown-menu';
import { cn } from '@/utils/cn';

interface Citation {
  sourceId: string;
  sourceName: string;
  location?: string;
  quote: string;
  context?: string;
}

interface EvidenceReference {
  insightPath: string;
  citations: Citation[];
  confidence?: number;
}

interface ArtifactPreviewProps {
  artifactUrl?: string;
  artifactHtml?: string;
  evidence?: EvidenceReference[];
  confidence?: number;
  onApprove?: () => void;
  onReject?: () => void;
  onExport?: (format: 'pdf' | 'html' | 'json') => void;
}

export function ArtifactPreview({
  artifactUrl,
  artifactHtml,
  evidence = [],
  confidence = 0.85,
  onApprove,
  onReject,
  onExport
}: ArtifactPreviewProps) {
  const [showEvidence, setShowEvidence] = useState(false);
  const [expandedEvidence, setExpandedEvidence] = useState<Set<number>>(new Set());

  const toggleEvidence = (index: number) => {
    const newExpanded = new Set(expandedEvidence);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedEvidence(newExpanded);
  };

  const getConfidenceColor = (conf: number): string => {
    if (conf >= 0.8) return 'text-green-600';
    if (conf >= 0.6) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getConfidenceLabel = (conf: number): string => {
    if (conf >= 0.8) return 'High Confidence';
    if (conf >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  const totalCitations = evidence.reduce((sum, ev) => sum + ev.citations.length, 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle>Artifact Preview</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className={cn("w-4 h-4", getConfidenceColor(confidence))} />
                  <span className={cn("text-sm font-medium", getConfidenceColor(confidence))}>
                    {getConfidenceLabel(confidence)} ({Math.round(confidence * 100)}%)
                  </span>
                </div>
                {totalCitations > 0 && (
                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                    {totalCitations} {totalCitations === 1 ? 'Citation' : 'Citations'}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEvidence(!showEvidence)}
              >
                <Quote className="w-4 h-4 mr-2" />
                Evidence
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onExport?.('pdf')}>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport?.('html')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Export as HTML
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport?.('json')}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Export as JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="relative w-full bg-white border border-border-faint rounded-12 overflow-hidden">
            {artifactUrl ? (
              <iframe
                src={artifactUrl}
                className="w-full h-[600px] border-0"
                title="Artifact Preview"
              />
            ) : artifactHtml ? (
              <div 
                className="w-full min-h-[600px] p-8"
                dangerouslySetInnerHTML={{ __html: artifactHtml }}
              />
            ) : (
              <div className="flex items-center justify-center h-[600px] text-foreground-dimmer">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-zinc-300" />
                  <p className="text-sm">No preview available</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full",
                  confidence >= 0.8 ? "bg-green-600" :
                  confidence >= 0.6 ? "bg-yellow-600" :
                  "bg-orange-600"
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onReject}
              className="min-w-[120px]"
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button
              variant="default"
              onClick={onApprove}
              className="min-w-[120px]"
            >
              <Check className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {showEvidence && evidence.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Quote className="w-5 h-5" />
                  Evidence & Citations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {evidence.map((evidenceItem, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border border-border-faint rounded-8 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleEvidence(index)}
                        className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold",
                            evidenceItem.confidence && evidenceItem.confidence >= 0.8 
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          )}>
                            {evidenceItem.citations.length}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-foreground">
                              {evidenceItem.insightPath.replace(/[\[\]]/g, ' › ').replace(/\./g, ' › ')}
                            </p>
                            {evidenceItem.confidence && (
                              <p className={cn(
                                "text-xs mt-0.5",
                                getConfidenceColor(evidenceItem.confidence)
                              )}>
                                Confidence: {Math.round(evidenceItem.confidence * 100)}%
                              </p>
                            )}
                          </div>
                        </div>
                        {expandedEvidence.has(index) ? (
                          <ChevronDown className="w-4 h-4 text-zinc-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-zinc-400" />
                        )}
                      </button>

                      <AnimatePresence>
                        {expandedEvidence.has(index) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-3 border-t border-border-faint pt-3">
                              {evidenceItem.citations.map((citation, citIndex) => (
                                <div 
                                  key={citIndex}
                                  className="pl-4 border-l-2 border-blue-200 space-y-1"
                                >
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-zinc-100 text-zinc-700 text-xs">
                                      {citation.sourceName}
                                    </Badge>
                                    {citation.location && (
                                      <span className="text-xs text-foreground-dimmer">
                                        {citation.location}
                                      </span>
                                    )}
                                  </div>
                                  <blockquote className="text-sm text-foreground italic">
                                    "{citation.quote}"
                                  </blockquote>
                                  {citation.context && (
                                    <p className="text-xs text-foreground-dimmer">
                                      {citation.context}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
