"use client";

import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  MessageSquare, 
  Eye, 
  Layers, 
  TrendingUp,
  ArrowRight,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/button';
import Badge from '@/components/ui/shadcn/badge';
import { cn } from '@/utils/cn';

interface DataSegment {
  name: string;
  description: string;
  itemCount: number;
}

interface SuggestedArtifact {
  type: string;
  name: string;
  description: string;
  confidence: number;
  reasoning: string;
}

interface AnalysisResultsProps {
  analysis: {
    dataType: 'interviews' | 'surveys' | 'observations' | 'mixed' | 'unknown';
    itemCount: number;
    themes: string[];
    suggestedArtifacts: SuggestedArtifact[];
    dataSegments?: DataSegment[];
  };
  onSelectArtifact?: (artifact: SuggestedArtifact) => void;
}

const DATA_TYPE_ICONS = {
  interviews: MessageSquare,
  surveys: FileText,
  observations: Eye,
  mixed: Layers,
  unknown: FileText
};

const DATA_TYPE_LABELS = {
  interviews: 'Interviews',
  surveys: 'Surveys',
  observations: 'Observations',
  mixed: 'Mixed Data',
  unknown: 'Unknown'
};

const ARTIFACT_TYPE_COLORS = {
  persona: 'bg-blue-100 text-blue-700 border-blue-200',
  'journey-map': 'bg-purple-100 text-purple-700 border-purple-200',
  'empathy-map': 'bg-green-100 text-green-700 border-green-200',
  'pain-point-dashboard': 'bg-orange-100 text-orange-700 border-orange-200',
  'feature-matrix': 'bg-pink-100 text-pink-700 border-pink-200'
};

const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.8) return 'text-green-600';
  if (confidence >= 0.6) return 'text-yellow-600';
  return 'text-orange-600';
};

const getConfidenceLabel = (confidence: number): string => {
  if (confidence >= 0.8) return 'High';
  if (confidence >= 0.6) return 'Medium';
  return 'Low';
};

export function AnalysisResults({ analysis, onSelectArtifact }: AnalysisResultsProps) {
  const DataTypeIcon = DATA_TYPE_ICONS[analysis.dataType];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>
            AI-powered insights from your research data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-8 border border-border-faint">
              <DataTypeIcon className="w-5 h-5 mt-0.5 text-zinc-600" />
              <div>
                <p className="text-xs text-foreground-dimmer uppercase font-medium">
                  Data Type
                </p>
                <p className="text-base font-semibold text-foreground">
                  {DATA_TYPE_LABELS[analysis.dataType]}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-8 border border-border-faint">
              <FileText className="w-5 h-5 mt-0.5 text-zinc-600" />
              <div>
                <p className="text-xs text-foreground-dimmer uppercase font-medium">
                  Items Analyzed
                </p>
                <p className="text-base font-semibold text-foreground">
                  {analysis.itemCount}
                </p>
              </div>
            </div>
          </div>

          {analysis.themes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-zinc-600" />
                <h4 className="text-sm font-semibold text-foreground">
                  Key Themes
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.themes.map((theme, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Badge className="bg-zinc-100 text-zinc-700 border border-border-faint px-3 py-1.5">
                      {theme}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {analysis.dataSegments && analysis.dataSegments.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-zinc-600" />
              <CardTitle>User Segments</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.dataSegments.map((segment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-border-faint rounded-8 hover:border-zinc-400 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h5 className="text-sm font-semibold text-foreground">
                        {segment.name}
                      </h5>
                      <p className="text-sm text-foreground-dimmer mt-1">
                        {segment.description}
                      </p>
                    </div>
                    <Badge className="bg-zinc-100 text-zinc-700 text-xs">
                      {segment.itemCount} {segment.itemCount === 1 ? 'item' : 'items'}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Suggested Artifacts</CardTitle>
          <CardDescription>
            Recommended design artifacts based on your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.suggestedArtifacts.map((artifact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "group relative p-4 border rounded-12 transition-all cursor-pointer",
                  "hover:shadow-md hover:border-zinc-400",
                  artifact.confidence >= 0.8 
                    ? "border-zinc-300 bg-white" 
                    : "border-border-faint bg-background-base"
                )}
                onClick={() => onSelectArtifact?.(artifact)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h5 className="text-base font-semibold text-foreground">
                        {artifact.name}
                      </h5>
                      <Badge 
                        className={cn(
                          "text-xs px-2 py-0.5 uppercase font-medium",
                          ARTIFACT_TYPE_COLORS[artifact.type as keyof typeof ARTIFACT_TYPE_COLORS] || 
                          "bg-zinc-100 text-zinc-700"
                        )}
                      >
                        {artifact.type.replace('-', ' ')}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-foreground-dimmer">
                      {artifact.description}
                    </p>
                    
                    <p className="text-xs text-foreground-dimmer italic">
                      {artifact.reasoning}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-foreground-dimmer">
                        Confidence:
                      </span>
                      <span className={cn(
                        "text-xs font-semibold",
                        getConfidenceColor(artifact.confidence)
                      )}>
                        {getConfidenceLabel(artifact.confidence)} ({Math.round(artifact.confidence * 100)}%)
                      </span>
                      <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${artifact.confidence * 100}%` }}
                          transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                          className={cn(
                            "h-full rounded-full",
                            artifact.confidence >= 0.8 ? "bg-green-600" :
                            artifact.confidence >= 0.6 ? "bg-yellow-600" :
                            "bg-orange-600"
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectArtifact?.(artifact);
                    }}
                  >
                    Create
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
