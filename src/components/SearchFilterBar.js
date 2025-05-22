import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import useDebounce from '../hooks/useDebounce';
import 'react-datepicker/dist/react-datepicker.css';

const SearchFilterBar = ({ filters, onFilterChange }) => {
  const [localTags, setLocalTags] = useState(filters.tags);
  const debouncedTags = useDebounce(localTags, 500);

  const fileTypes = [
    { value: '', label: 'All Types' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' },
    { value: 'application/pdf', label: 'PDFs' },
  ];

  useEffect(() => {
    // Only update parent component with debounced value
    if (debouncedTags !== filters.tags) {
      onFilterChange({
        ...filters,
        tags: debouncedTags,
      });
    }
  }, [debouncedTags]);

  // Update local tags when filters.tags changes externally
  useEffect(() => {
    setLocalTags(filters.tags);
  }, [filters.tags]);

  const handleTagsChange = (e) => {
    setLocalTags(e.target.value);
  };

  const handleTypeChange = (e) => {
    onFilterChange({
      ...filters,
      type: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    if (!date || date instanceof Date) {
      const selectedDate = date ? new Date(date.setHours(0, 0, 0, 0)) : null;
      onFilterChange({
        ...filters,
        uploadDate: selectedDate,
      });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            File Type
          </label>
          <select
            value={filters.type}
            onChange={handleTypeChange}
            className="input"
          >
            {fileTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Date
          </label>
          <DatePicker
            selected={filters.uploadDate}
            onChange={handleDateChange}
            className="input"
            placeholderText="Select date"
            isClearable
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            timeIntervals={1}
            filterDate={date => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date.getTime() <= today.getTime();
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="relative">
            <input
              type="text"
              value={localTags}
              onChange={handleTagsChange}
              placeholder="Enter tags (comma-separated)"
              className="input pr-8"
            />
            {localTags !== filters.tags && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Search will start automatically after you stop typing
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar; 