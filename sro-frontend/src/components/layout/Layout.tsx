import React from 'react';
import { Metadata } from 'next';
import Header from './Header';
import Footer from './Footer';
import ErrorBoundary from '../ui/ErrorBoundary';
import Breadcrumbs from '../common/Breadcrumbs';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  noIndex?: boolean;
  showBreadcrumbs?: boolean;
  breadcrumbItems?: Array<{ name: string; href: string }>;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'СРО Арбитражных Управляющих',
  description = 'Официальный сайт саморегулируемой организации арбитражных управляющих. Реестр членов, нормативные документы, компенсационный фонд.',
  keywords = 'СРО, арбитражные управляющие, банкротство, реестр, компенсационный фонд',
  noIndex = false,
  showBreadcrumbs = true,
  breadcrumbItems,
}) => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        
        <main className="flex-1">
          {showBreadcrumbs && (
            <div className="bg-white border-b border-neutral-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <Breadcrumbs items={breadcrumbItems} />
              </div>
            </div>
          )}
          
          {children}
        </main>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Layout;
