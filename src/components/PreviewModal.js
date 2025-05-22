import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const PreviewModal = ({ isOpen, onClose, asset }) => {
  if (!isOpen) return null;

  const renderPreview = () => {
    if (asset.mimetype.startsWith('video/')) {
      return (
        <video
          className="max-w-full max-h-[80vh]"
          controls
          autoPlay={false}
        >
          <source src={`http://localhost:8080/api/assets/${asset._id}/download`} type={asset.mimetype} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (asset.mimetype === 'application/pdf') {
      return (
        <iframe
          src={`http://localhost:8080/api/assets/${asset._id}/download`}
          className="w-full h-[80vh]"
          title={asset.originalname}
        />
      );
    } else if (asset.mimetype.startsWith('image/')) {
      return (
        <img
          src={`http://localhost:8080/api/assets/${asset._id}/download`}
          alt={asset.originalname}
          className="max-w-full max-h-[80vh] object-contain"
        />
      );
    }
    return <div>Preview not available for this file type.</div>;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="relative inline-block w-full max-w-6xl overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {asset.originalname}
            </h3>
            <div className="flex justify-center">
              {renderPreview()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal; 