'use client';

import React from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold text-red-500 mb-4">
        {error.message || 'Something went wrong!'}
      </h2>
      <button
        onClick={reset}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Try Again
      </button>
    </div>
  );
} 