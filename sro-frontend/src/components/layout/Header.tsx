'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { navigationConfig, mobileMenuItems } from '@/constants/navigation';
import { useActivePath } from '@/hooks/useActivePath';
import { NavigationItem } from '@/types';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [additionalMenuOpen, setAdditionalMenuOpen] = useState(false);
  const { isActivePath } = useActivePath();

  const renderNavigationItem = (item: NavigationItem) => {
    const isActive = isActivePath(item.href);
    
    return (
      <Link
        key={item.name}
        href={item.href}
        className={clsx(
          "px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md",
          isActive 
            ? "text-beige-600 bg-beige-50" 
            : "text-neutral-700 hover:text-beige-600 hover:bg-beige-50"
        )}
      >
        {item.name}
      </Link>
    );
  };

  const renderMobileMenuItem = (item: NavigationItem) => {
    const isActive = isActivePath(item.href);
    
    return (
      <Link
        key={item.name}
        href={item.href}
        className={clsx(
          "block px-4 py-3 text-sm transition-colors duration-200 border-b border-neutral-100 last:border-b-0",
          isActive 
            ? "text-beige-600 bg-beige-50" 
            : "text-neutral-700 hover:text-beige-600 hover:bg-beige-50"
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        {item.name}
      </Link>
    );
  };

  return (
    <header className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Additional Menu Button (Left) */}
          <div className="flex-shrink-0 mr-4">
            <button
              onClick={() => setAdditionalMenuOpen(!additionalMenuOpen)}
              className="p-2 rounded-md text-neutral-700 hover:text-beige-600 hover:bg-beige-50 transition-colors duration-200"
              aria-label="Дополнительное меню"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-sm border border-neutral-200">
                <img 
                  src="/images/logo.jpg" 
                  alt="Герб СРО АУ Альфа" 
                  className="h-12 w-12 rounded-lg object-cover"
                />
              </div>
              <div className="ml-3">
                <div className="text-lg font-bold text-neutral-900">
                  Ассоциация АУ "Альфа"
                </div>
                <div className="text-xs text-neutral-500">
                  Саморегулируемая организация
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 ml-8">
            {navigationConfig.map((item) => renderNavigationItem(item))}
          </nav>

          {/* Mobile menu button (Right) */}
          <div className="lg:hidden ml-auto">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-neutral-700 hover:text-beige-600 hover:bg-beige-50 transition-colors duration-200"
              aria-label="Открыть меню"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Additional Menu (Left Side) */}
        {additionalMenuOpen && (
          <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">Дополнительное меню</h2>
              <button
                onClick={() => setAdditionalMenuOpen(false)}
                className="p-2 rounded-md text-neutral-700 hover:text-beige-600 hover:bg-beige-50 transition-colors duration-200"
                aria-label="Закрыть меню"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="space-y-1">
                {mobileMenuItems.map((item) => {
                  const isActive = isActivePath(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={clsx(
                        "block px-4 py-3 text-sm transition-colors duration-200 rounded-md",
                        isActive 
                          ? "text-beige-600 bg-beige-50" 
                          : "text-neutral-700 hover:text-beige-600 hover:bg-beige-50"
                      )}
                      onClick={() => setAdditionalMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Overlay */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu */}
            <div className="absolute top-16 left-0 right-0 bg-white border-b border-neutral-200 shadow-lg z-50 lg:hidden">
              <div className="px-4 py-2">
                {/* Main navigation items */}
                <div className="space-y-1">
                  {navigationConfig.map((item) => renderMobileMenuItem(item))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
