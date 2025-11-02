import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-brand-surface dark:bg-brand-surface-dark mt-auto py-6 border-t border-gray-200 dark:border-gray-700 print:hidden">
      <div className="container mx-auto px-4 sm:px-6 text-center text-gray-500 dark:text-gray-400">
        <p className="text-sm">
          {t('footer.copyright')}
        </p>
        <div className="flex justify-center items-center space-x-4 mt-2 text-xs">
          <a href="tel:+8801871520684" className="hover:text-brand-primary dark:hover:text-brand-secondary transition-colors">
            +8801871520684 
          </a>
          <span>&middot;</span>
          <a href="mailto:arafatulislamtc@gmail.com" className="hover:text-brand-primary dark:hover:text-brand-secondary transition-colors">
            arafatulislamtc@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
