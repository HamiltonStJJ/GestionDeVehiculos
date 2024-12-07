// src/components/VehicleSkeleton.tsx
import React from 'react';

const VehicleSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 8].map((index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-md text-center relative">
          {/* Title skeleton */}
          <div className="skeleton h-6 w-3/4 mx-auto mb-2"></div>
          {/* Subtitle skeleton */}
          <div className="skeleton h-4 w-1/2 mx-auto mb-4"></div>
          {/* Image skeleton */}
          <div className="skeleton h-40 w-full rounded-lg mb-4"></div>
          {/* Price skeleton */}
          <div className="skeleton h-6 w-1/3 mx-auto mb-4"></div>
          {/* Button skeleton */}
          <div className="skeleton h-10 w-full rounded-lg"></div>
        </div>
      ))}
    </div>
  );
};

export default VehicleSkeleton;