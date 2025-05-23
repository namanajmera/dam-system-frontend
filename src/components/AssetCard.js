import React, { useState } from 'react';
import { DocumentIcon, PhotoIcon, VideoCameraIcon, EyeIcon } from '@heroicons/react/24/outline';
import { downloadAsset } from '../api';
import PreviewModal from './PreviewModal';

const AssetCard = ({ asset }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getIcon = () => {
    if (asset.mimetype.startsWith('image/')) {
      return <PhotoIcon className="h-8 w-8" />;
    } else if (asset.mimetype.startsWith('video/')) {
      return <VideoCameraIcon className="h-8 w-8" />;
    } else {
      return <DocumentIcon className="h-8 w-8" />;
    }
  };

  const getThumbnail = () => {
    if (asset.mimetype.startsWith('image/')) {
      return (
        <img
          src={`${process.env.REACT_APP_API_URL}/assets/${asset._id}/download`}
          alt={asset.originalname}
          className="w-full h-32 object-cover rounded-t-lg cursor-pointer"
          onClick={() => setIsPreviewOpen(true)}
        />
      );
    } else {
      return (
        <div 
          className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-t-lg cursor-pointer"
          onClick={() => setIsPreviewOpen(true)}
        >
          {getIcon()}
        </div>
      );
    }
  };

  const handleDownload = () => {
    downloadAsset(asset._id, asset.originalname);
  };

  const canPreview = asset.mimetype.startsWith('image/') || 
                    asset.mimetype.startsWith('video/') || 
                    asset.mimetype === 'application/pdf';

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {getThumbnail()}
        
        <div className="p-4">
          <h3 className="font-medium text-gray-900 truncate" title={asset.originalname}>
            {asset.originalname}
          </h3>
          
          <div className="mt-2 text-sm text-gray-500">
            <p>{formatFileSize(asset.size)}</p>
            <p>{new Date(asset.uploadDate).toLocaleDateString()}</p>
          </div>

          {asset.tags && asset.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {asset.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 flex gap-2">
            {canPreview && (
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="flex-1 btn btn-secondary flex items-center justify-center gap-1"
              >
                <EyeIcon className="h-4 w-4" />
                Preview
              </button>
            )}
            <button
              onClick={handleDownload}
              className={`btn btn-primary ${canPreview ? 'flex-1' : 'w-full'}`}
            >
              Download
            </button>
          </div>
        </div>
      </div>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        asset={asset}
      />
    </>
  );
};

export default AssetCard; 