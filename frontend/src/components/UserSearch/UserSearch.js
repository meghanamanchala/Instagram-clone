import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UserSearch() {
  const API_URL = window.location.origin.replace('3000', '5000');
  const [query, setQuery] = useState('');
  const [res, setRes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRes, setShowRes] = useState(false);

  const fetchUsers = async (search) => {
    if (!search.trim()) {
      setRes([]);
      setShowRes(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/users/search?query=${search}&limit=2`
      );
      if (!response.ok) {
        throw new Error('Network Response is not Ok');
      }
      const data = await response.json();
      console.log(data);

      if (data.users && data.users.length > 0) {
        setRes(data.users);
        setShowRes(true);
      } else {
        setShowRes(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchUsers(value);
  };

  return (
    <div className="relative max-w-md mx-auto search-container">
      <input
        type="text"
        placeholder="Search users by username"
        value={query}
        onChange={handleInputChange}
        className="w-full p-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none"
      />
      {loading && <div>Loading...</div>}
      {showRes && (
        <div className="absolute z-50 bg-white mt-1 shadow-lg rounded-lg max-h-60 overflow-y-auto w-full">
          {res.map((user) => (
            <Link
              key={user.id}
              to={`/profile/${user.id}`}
              className="block p-2 hover:bg-gray-200"
            >
              <div className="flex items-center">
                <img
                  src={user.profilePicture || '/default-avatar.png'}
                  alt={`${user.username}'s profile`}
                  className="w-10 h-10 rounded-full mr-2"
                />
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.fullName}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
