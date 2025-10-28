'use client';

import React, { useState } from 'react';
import { DataUploadZone } from '@/components/artifact/DataUploadZone';
import { AnalysisResults } from '@/components/artifact/AnalysisResults';
import { TemplateLibrary } from '@/components/artifact/TemplateLibrary';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';

type Step = 'upload' | 'analysis' | 'create-template' | 'generate';

interface AnalysisData {
  dataType: 'interviews' | 'surveys' | 'observations' | 'mixed' | 'unknown';
  itemCount: number;
  themes: string[];
  suggestedArtifacts: Array<{
    type: string;
    name: string;
    description: string;
    confidence: number;
    reasoning: string;
  }>;
  dataSegments?: Array<{
    name: string;
    description: string;
    itemCount: number;
  }>;
}

interface UploadResult {
  workspaceId: string;
  files: Array<{
    id: string;
    filename: string;
  }>;
  analysis: AnalysisData;
}

export default function ArtifactsPage() {
  const [step, setStep] = useState<Step>('upload');
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [selectedArtifactType, setSelectedArtifactType] = useState<string | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);

  const handleUploadComplete = (result: UploadResult) => {
    setUploadResult(result);
    setStep('analysis');
  };

  const handleArtifactSelect = (artifact: { type: string }) => {
    setSelectedArtifactType(artifact.type);
    setStep('create-template');
  };

  const handleStartOver = () => {
    setStep('upload');
    setUploadResult(null);
    setSelectedArtifactType(null);
  };

  const handleCreateNewTemplate = () => {
    setIsCreatingTemplate(true);
    // This will open the chat interface for template creation
    // For now, redirect to generation page with artifact type context
    if (selectedArtifactType) {
      window.location.href = `/generation?artifactType=${selectedArtifactType}&workspaceId=${uploadResult?.workspaceId}`;
    }
  };

  const handleUseTemplate = (template: { id: string }) => {
    // Navigate to generation page with template selected
    window.location.href = `/generation?templateId=${template.id}&artifactType=${selectedArtifactType}&workspaceId=${uploadResult?.workspaceId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Artifact Creator
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Transform research data into beautiful design artifacts
                </p>
              </div>
            </div>
            
            {step !== 'upload' && (
              <Button
                variant="outline"
                onClick={handleStartOver}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Start Over
              </Button>
            )}
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-6">
            {[
              { key: 'upload', label: 'Upload Data' },
              { key: 'analysis', label: 'Analyze' },
              { key: 'create-template', label: 'Create Template' },
              { key: 'generate', label: 'Generate' }
            ].map((s, index) => (
              <React.Fragment key={s.key}>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  step === s.key 
                    ? 'bg-blue-500 text-white' 
                    : index < ['upload', 'analysis', 'create-template', 'generate'].indexOf(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === s.key || index < ['upload', 'analysis', 'create-template', 'generate'].indexOf(step)
                      ? 'bg-white/20'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{s.label}</span>
                </div>
                {index < 3 && (
                  <div className={`h-0.5 flex-1 ${
                    index < ['upload', 'analysis', 'create-template', 'generate'].indexOf(step)
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {step === 'upload' && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Upload Your Research Data
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Upload interview transcripts, survey results, or observation notes. 
                We'll analyze your data and suggest the best artifacts to create.
              </p>
              <DataUploadZone onUploadComplete={handleUploadComplete} />
            </div>
          )}

          {step === 'analysis' && uploadResult && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Analysis Results
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We analyzed your {uploadResult.files.length} file(s). 
                Here's what we found and what you can create:
              </p>
              <AnalysisResults 
                analysis={uploadResult.analysis}
                onSelectArtifact={handleArtifactSelect}
              />
            </div>
          )}

          {step === 'create-template' && selectedArtifactType && uploadResult && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Choose or Create a Template
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Use an existing template or let AI create a custom one for you.
              </p>
              
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                      AI Template Creation
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Don't see the template you want? Click "Create New Template" and 
                      describe what you'd like in the chat. AI will code it for you with live preview!
                    </p>
                  </div>
                </div>
              </div>

              <TemplateLibrary
                workspaceId={uploadResult.workspaceId}
                onSelectTemplate={handleUseTemplate}
                onCreateNew={handleCreateNewTemplate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
