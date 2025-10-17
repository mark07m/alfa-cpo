"use client";
import React from 'react';

type SanitizedHtmlProps = {
  html: string;
  className?: string;
};

// Track hook installation once per module load
let hooksInstalled = false;

export default function SanitizedHtml({ html, className }: SanitizedHtmlProps) {
  const [clean, setClean] = React.useState<string>("");

  React.useEffect(() => {
    setClean(html || '');
  }, [html]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}


