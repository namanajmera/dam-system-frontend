import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import AssetGallery from './components/AssetGallery';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Digital Asset Management
          </h1>
          <p className="mt-2 text-gray-600">
            Upload, manage, and download your digital assets
          </p>
        </header>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload New Asset
            </h2>
            <FileUploader onUploadSuccess={handleUploadSuccess} />
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Asset Gallery
            </h2>
            <AssetGallery key={refreshKey} />
          </section>
        </div>
      </div>
    </div>
  );
}

export default App; 