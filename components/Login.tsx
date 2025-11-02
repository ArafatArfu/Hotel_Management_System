import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { logo } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (!success) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-bg">
      <div className="w-full max-w-md p-8 space-y-6 bg-brand-surface rounded-lg shadow-md">
        <div className="text-center">
            <img src={logo} alt="Al Madina Restaurant Logo" className="w-40 h-auto mx-auto mb-4" />
            <p className="text-gray-600">Admin & Staff Login</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-sm font-bold text-gray-700 tracking-wide">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary"
              placeholder="admin or user"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password"  className="text-sm font-bold text-gray-700 tracking-wide">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary"
              placeholder="admin or user"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <button type="submit" className="w-full flex justify-center bg-brand-primary text-white p-3 rounded-lg tracking-wide font-semibold cursor-pointer hover:bg-opacity-90">
              Log In
            </button>
          </div>
        </form>
         <div className="text-center text-sm text-gray-500 border-t pt-4">
            <p>Admin credentials: <strong>admin / admin</strong></p>
            <p>User credentials: <strong>user / user</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Login;