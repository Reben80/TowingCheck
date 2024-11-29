import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { SearchBarProps } from '../types';

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-full max-w-md"
    >
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search location..."
          className="w-full px-4 py-2 rounded-lg shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>
    </form>
  );
};

export default SearchBar;