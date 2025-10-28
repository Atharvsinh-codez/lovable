"use client";

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Progress } from '@/components/ui/shadcn/progress';
import { cn } from '@/utils/cn';

interface FileItem {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  errorMessage?: string;
}

interface DataUploadZoneProps {
  workspaceId?: string;
  onUploadComplete?: (result: any) => void;
  onUploadError?: (error: Error) => void;
}

const ACCEPTED_FILE_TYPES = ['.txt', '.csv', '.json', '.md'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function DataUploadZone({ 
  workspaceId = 'default',
  onUploadComplete,
  onUploadError 
}: DataUploadZoneProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_FILE_TYPES.includes(ext)) {
      return `File type ${ext} not supported. Please upload ${ACCEPTED_FILE_TYPES.join(', ')} files.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit.`;
    }
    return null;
  };

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const filesArray = Array.from(newFiles);
    const fileItems: FileItem[] = filesArray.map(file => {
      const error = validateFile(file);
      return {
        id: Math.random().toString(36).substring(7),
        file,
        status: error ? 'error' : 'pending',
        progress: 0,
        errorMessage: error || undefined
      };
    });
    setFiles(prev => [...prev, ...fileItems]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  }, [addFiles]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const uploadFiles = async () => {
    const validFiles = files.filter(f => f.status === 'pending');
    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      validFiles.forEach(fileItem => {
        formData.append('files', fileItem.file);
      });
      formData.append('workspaceId', workspaceId);

      setFiles(prev => prev.map(f => 
        f.status === 'pending' ? { ...f, status: 'uploading', progress: 0 } : f
      ));

      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => 
          f.status === 'uploading' && f.progress < 90 
            ? { ...f, progress: f.progress + 10 } 
            : f
        ));
      }, 200);

      const response = await fetch('/api/upload-research-data', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();

      setFiles(prev => prev.map(f => 
        f.status === 'uploading' ? { ...f, status: 'success', progress: 100 } : f
      ));

      onUploadComplete?.(result);
    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map(f => 
        f.status === 'uploading' 
          ? { ...f, status: 'error', errorMessage: error instanceof Error ? error.message : 'Upload failed' } 
          : f
      ));
      onUploadError?.(error instanceof Error ? error : new Error('Upload failed'));
    } finally {
      setIsUploading(false);
    }
  };

  const hasValidFiles = files.some(f => f.status === 'pending');
  const allSuccess = files.length > 0 && files.every(f => f.status === 'success');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Research Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-12 p-8 transition-all cursor-pointer",
            isDragging 
              ? "border-zinc-900 bg-zinc-50" 
              : "border-border-faint hover:border-zinc-400 bg-background-base"
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_FILE_TYPES.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <motion.div
              animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="w-12 h-12 text-zinc-400" />
            </motion.div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-foreground-dimmer mt-1">
                Supported: {ACCEPTED_FILE_TYPES.join(', ')} (Max {formatFileSize(MAX_FILE_SIZE)})
              </p>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-foreground">
                Files ({files.length})
              </h4>
              {allSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-sm text-green-600"
                >
                  <CheckCircle className="w-4 h-4" />
                  All files uploaded
                </motion.div>
              )}
            </div>
            
            <AnimatePresence mode="popLayout">
              {files.map((fileItem) => (
                <motion.div
                  key={fileItem.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border border-border-faint rounded-8 p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <File className="w-4 h-4 mt-0.5 flex-shrink-0 text-zinc-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {fileItem.file.name}
                        </p>
                        <p className="text-xs text-foreground-dimmer">
                          {formatFileSize(fileItem.file.size)}
                        </p>
                        {fileItem.errorMessage && (
                          <p className="text-xs text-red-600 mt-1">
                            {fileItem.errorMessage}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {fileItem.status === 'success' && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      {fileItem.status === 'error' && (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      {fileItem.status === 'uploading' && (
                        <Loader2 className="w-4 h-4 text-zinc-600 animate-spin" />
                      )}
                      {fileItem.status === 'pending' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(fileItem.id);
                          }}
                          className="p-1 hover:bg-zinc-100 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-zinc-400" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {fileItem.status === 'uploading' && (
                    <Progress value={fileItem.progress} className="h-1" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {hasValidFiles && (
          <Button
            onClick={uploadFiles}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
