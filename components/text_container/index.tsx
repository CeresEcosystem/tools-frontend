import React from 'react';

export default function TextContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="max-w-5xl mx-auto px-5 mb-16">{children}</div>;
}
