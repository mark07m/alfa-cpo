"use client";
import React from 'react';

type SanitizedHtmlProps = {
  html: string;
  className?: string;
};

export default function SanitizedHtml({ html, className }: SanitizedHtmlProps) {
  // Admin preview: render raw HTML so it matches the site rendering exactly
  return <div className={className} dangerouslySetInnerHTML={{ __html: html || '' }} />;
}


