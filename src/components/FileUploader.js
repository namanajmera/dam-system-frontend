import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { uploadAsset, getSupportedFileTypes, getMaxFileSize } from '../api';

const FileUploader = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [tags, setTags] = useState('');
  const fileInputRef = useRef(null);

  const allowedTypes = getSupportedFileTypes();
  const maxFileSize = getMaxFileSize();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileSelection(files);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    handleFileSelection(files);
  };

  const handleFileSelection = (files) => {
    if (files.length === 0) return;

    const file = files[0];
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed types: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`);
      setSelectedFile(null);
      return;
    }

    if (file.size > maxFileSize) {
      setError(`File size too large. Maximum size is ${formatFileSize(maxFileSize)}`);
      setSelectedFile(null);
      return;
    }

    setError('');
    setSelectedFile(file);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleTagsChange = (e) => {
    setTags(e.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setError('');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);
    if (tags.trim()) {
      formData.append('tags', tags.trim());
    }

    try {
      await uploadAsset(formData, (progress) => {
        setUploadProgress(progress);
      });
      onUploadSuccess?.();
      setUploadProgress(0);
      setSelectedFile(null);
      setTags('');
    } catch (error) {
      setError(error.response?.data?.error || 'Upload failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={allowedTypes.join(',')}
          onChange={handleFileInput}
        />

        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {selectedFile ? selectedFile.name : 'Drag and drop your file here'}
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          {selectedFile 
            ? `${formatFileSize(selectedFile.size)}`
            : `Or click to browse (max ${formatFileSize(maxFileSize)})`
          }
        </p>

        <button
          type="button"
          className="mt-4 btn btn-primary"
          onClick={() => fileInputRef.current?.click()}
        >
          {selectedFile ? 'Change File' : 'Select File'}
        </button>
      </div>

      {selectedFile && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags (optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tags}
              onChange={handleTagsChange}
              placeholder="Enter tags separated by commas (e.g., report, finance, 2024)"
              className="input flex-grow"
            />
            <button
              onClick={handleUpload}
              className="btn btn-primary whitespace-nowrap"
              disabled={uploadProgress > 0 && uploadProgress < 100}
            >
              Upload File
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Add descriptive tags to help organize and find your files later
          </p>
        </div>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">{uploadProgress}% uploaded</p>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FileUploader; 