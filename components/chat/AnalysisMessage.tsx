"use client";

import React from 'react';
import { motion } from 'motion/react';
import { 
  Lightbulb,
  TrendingUp,
  Users,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface AnalysisMessageProps {
  analysis: {
    themes?: string[];
    insights?: string[];
    userSegments?: Array<{name: string; description: string}>;
    suggestedArtifacts?: Array<{
      type: string;
      label: string;
      description?: string;
      confidence?: number;
    }>;
  };
  onSuggestionClick: (artifactType: string) => void;
}

const getConfidenceColor = (confidence?: number): string => {
  if (!confidence) return 'bg-zinc-100 border-zinc-300 text-zinc-700';
  if (confidence >= 0.8) return 'bg-green-50 border-green-300 text-green-700';
  if (confidence >= 0.6) return 'bg-yellow-50 border-yellow-300 text-yellow-700';
  return 'bg-orange-50 border-orange-300 text-orange-700';
};

const getArtifactTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    'persona': 'bg-blue-500 hover:bg-blue-600',
    'user-persona': 'bg-blue-500 hover:bg-blue-600',
    'journey-map': 'bg-purple-500 hover:bg-purple-600',
    'empathy-map': 'bg-green-500 hover:bg-green-600',
    'pain-point-dashboard': 'bg-orange-500 hover:bg-orange-600',
    'feature-matrix': 'bg-pink-500 hover:bg-pink-600',
  };
  
  const normalizedType = type.toLowerCase().replace(/\s+/g, '-');
  return colorMap[normalizedType] || 'bg-indigo-500 hover:bg-indigo-600';
};

export function AnalysisMessage({ analysis, onSuggestionClick }: AnalysisMessageProps) {
  const hasThemes = analysis.themes && analysis.themes.length > 0;
  const hasInsights = analysis.insights && analysis.insights.length > 0;
  const hasSegments = analysis.userSegments && analysis.userSegments.length > 0;
  const hasSuggestions = analysis.suggestedArtifacts && analysis.suggestedArtifacts.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl p-5 border border-indigo-100/50 shadow-sm"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground">
            Analysis Complete
          </h3>
          <p className="text-sm text-foreground-dimmer mt-0.5">
            Here's what I found in your research data
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {hasThemes && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-semibold text-foreground">
                Key Themes
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.themes!.map((theme, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-3 py-1.5 bg-white border border-zinc-200 rounded-full text-sm text-zinc-700"
                >
                  {theme}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {hasInsights && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-semibold text-foreground">
                Key Insights
              </h4>
            </div>
            <ul className="space-y-1.5">
              {analysis.insights!.map((insight, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-2 text-sm text-foreground-dimmer"
                >
                  <ChevronRight className="w-4 h-4 mt-0.5 text-indigo-400 flex-shrink-0" />
                  <span>{insight}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {hasSegments && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-semibold text-foreground">
                User Segments
              </h4>
            </div>
            <div className="space-y-2">
              {analysis.userSegments!.map((segment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="p-3 bg-white border border-zinc-200 rounded-lg"
                >
                  <h5 className="text-sm font-semibold text-foreground">
                    {segment.name}
                  </h5>
                  <p className="text-xs text-foreground-dimmer mt-1">
                    {segment.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {hasSuggestions && (
          <div className="space-y-3 pt-2 border-t border-indigo-100/50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-semibold text-foreground">
                Suggested Artifacts
              </h4>
            </div>
            <p className="text-xs text-foreground-dimmer">
              Click to create an artifact based on your data
            </p>
            <div className="flex flex-wrap gap-2">
              {analysis.suggestedArtifacts!.map((artifact, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.08 }}
                  onClick={() => onSuggestionClick(artifact.type)}
                  className={cn(
                    "group relative px-4 py-2.5 rounded-xl text-white font-medium text-sm",
                    "transition-all duration-200 transform hover:scale-105 hover:shadow-md",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                    getArtifactTypeColor(artifact.type)
                  )}
                  title={artifact.description}
                >
                  <div className="flex items-center gap-2">
                    <span>{artifact.label}</span>
                    {artifact.confidence !== undefined && (
                      <span className="text-xs opacity-90">
                        {Math.round(artifact.confidence * 100)}%
                      </span>
                    )}
                  </div>
                  {artifact.description && (
                    <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900 text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-lg">
                      {artifact.description}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                        <div className="border-4 border-transparent border-t-zinc-900" />
                      </div>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
