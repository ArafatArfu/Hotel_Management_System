import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { logo } = useAppContext();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (!success) {
      setError(t('login.error'));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-bg dark:bg-brand-bg-dark">
      <div className="w-full max-w-md p-8 space-y-6 bg-brand-surface dark:bg-brand-surface-dark rounded-lg shadow-md">
        <div className="text-center">
            <img src={logo} alt="Al Madina Restaurant Logo" className="w-40 h-auto mx-auto mb-4 p-2 rounded-md" />
            <p className="text-gray-600 dark:text-gray-300">{t('login.title')}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-sm font-bold text-gray-700 dark:text-gray-300 tracking-wide">{t('login.username')}</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary"
              placeholder={t('login.placeholder')}
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password"  className="text-sm font-bold text-gray-700 dark:text-gray-300 tracking-wide">{t('login.password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary"
              placeholder={t('login.placeholder')}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <button type="submit" className="w-full flex justify-center bg-brand-primary text-white p-3 rounded-lg tracking-wide font-semibold cursor-pointer hover:bg-opacity-90">
              {t('login.button')}
            </button>
          </div>
        </form>
         <div className="text-center text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 pt-4">
            <p>{t('login.adminHint', { user: 'admin', pass: 'admin' })}</p>
            <p>{t('login.userHint', { user: 'user', pass: 'user' })}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;