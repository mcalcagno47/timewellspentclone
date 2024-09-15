import React from 'react';

function SearchBar({ searchInput, setSearchInput }) {
  // Our state variable for the search event. Defaults to "Fundraising".

  return (
    <>
      <div className="form-group">
        <form className="form">
          <div className="field">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Fundraiser"
            />
            <button className="h-10 px-4 py-2 m-1 text-white transition-colors duration-200 transform bg-indigo-500 rounded-md hover:bg-indigo-400 focus:outline-none focus:bg-blue-400">
              Search
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default SearchBar;