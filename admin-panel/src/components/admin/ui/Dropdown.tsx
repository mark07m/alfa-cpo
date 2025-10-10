'use client';

import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  trigger?: React.ReactNode;
  triggerText?: string;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
  variant?: 'default' | 'minimal' | 'ghost';
}

export function Dropdown({ 
  trigger, 
  triggerText = 'Options',
  items, 
  align = 'right',
  className,
  variant = 'minimal'
}: DropdownProps) {
  const variantClasses = {
    default: 'inline-flex items-center gap-x-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50',
    minimal: 'inline-flex items-center gap-x-1.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors',
    ghost: 'inline-flex items-center gap-x-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors'
  };

  return (
    <Menu as="div" className={cn("relative inline-block text-left", className)}>
      <Menu.Button className={variantClasses[variant]}>
        {trigger || (
          <>
            {triggerText}
            <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </>
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            "absolute z-10 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <Fragment key={index}>
                {item.divider ? (
                  <div className="my-1 border-t border-gray-100" />
                ) : (
                  <Menu.Item disabled={item.disabled}>
                    {({ active }) => (
                      <button
                        onClick={item.onClick}
                        disabled={item.disabled}
                        className={cn(
                          'group flex w-full items-center px-3 py-2 text-sm transition-colors',
                          active && !item.disabled && 'bg-gray-50',
                          item.disabled && 'opacity-50 cursor-not-allowed',
                          item.danger 
                            ? 'text-red-600 hover:text-red-700' 
                            : 'text-gray-700 hover:text-gray-900'
                        )}
                      >
                        {item.icon && (
                          <span className="mr-3 h-4 w-4 flex-shrink-0">
                            {item.icon}
                          </span>
                        )}
                        {item.label}
                      </button>
                    )}
                  </Menu.Item>
                )}
              </Fragment>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

