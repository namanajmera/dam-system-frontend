import React, { useState, useEffect } from 'react';
import { getAssets } from '../api';
import AssetCard from './AssetCard';
import SearchFilterBar from './SearchFilterBar';

const AssetGallery = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    uploadDate: null,
    tags: '',
  });

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        ...(filters.type && { type: filters.type }),
        ...(filters.uploadDate && {
          uploadDate: formatDateForAPI(filters.uploadDate),
        }),
        ...(filters.tags && { tags: filters.tags }),
      };

      const response = await getAssets(params);
      setAssets(response.data);
    } catch (err) {
      setError('Failed to load assets. Please try again.');
      console.error('Error fetching assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateForAPI = (date) => {
    // Create a new date object in the local timezone
    const localDate = new Date(date);
    
    // Get the local date components
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    
    // Return the date in YYYY-MM-DD format
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchAssets();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    if (newFilters.uploadDate) {
      // Create a new date object at the start of the selected day in local time
      const selectedDate = new Date(newFilters.uploadDate);
      selectedDate.setHours(0, 0, 0, 0);
      newFilters.uploadDate = selectedDate;
    }
    setFilters(newFilters);
  };

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
        <button
          onClick={fetchAssets}
          className="mt-2 btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          <p>No assets found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {assets.map((asset) => (
            <AssetCard key={asset._id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetGallery; 