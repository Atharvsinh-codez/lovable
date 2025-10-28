import React from 'react';

interface PersonaData {
  name: string;
  tagline: string;
  demographics: {
    ageRange?: string;
    occupation?: string;
    techSavviness?: string;
  };
  goals: string[];
  painPoints: string[];
  behaviors: string[];
  quote?: string;
}

interface PersonaProps {
  data: PersonaData;
  showCitations?: boolean;
  compact?: boolean;
}

/**
 * Modern Persona Card component
 * Displays user persona with demographics, goals, pain points, and behaviors
 */
export default function PersonaTemplate({ 
  data, 
  showCitations = true,
  compact = false 
}: PersonaProps) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {data.name}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 italic">
              "{data.tagline}"
            </p>
          </div>
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {data.name.charAt(0)}
          </div>
        </div>
      </div>

      {/* Demographics */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Demographics
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {data.demographics.ageRange && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Age</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {data.demographics.ageRange}
              </div>
            </div>
          )}
          {data.demographics.occupation && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Role</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {data.demographics.occupation}
              </div>
            </div>
          )}
          {data.demographics.techSavviness && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tech Level</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {data.demographics.techSavviness}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Goals */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Goals
        </h3>
        <ul className="space-y-2">
          {data.goals.map((goal, index) => (
            <li key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
              <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">{goal}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pain Points */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Pain Points
        </h3>
        <ul className="space-y-2">
          {data.painPoints.map((painPoint, index) => (
            <li key={index} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <span className="text-red-600 dark:text-red-400 text-lg">✗</span>
              <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">{painPoint}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Behaviors */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Behaviors
        </h3>
        <ul className="space-y-2">
          {data.behaviors.map((behavior, index) => (
            <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <span className="text-blue-600 dark:text-blue-400 text-lg">→</span>
              <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">{behavior}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quote */}
      {data.quote && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 relative">
            <div className="text-6xl text-blue-200 dark:text-blue-800 absolute top-2 left-4">"</div>
            <p className="text-lg text-gray-700 dark:text-gray-300 italic pl-8 pr-4">
              {data.quote}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
