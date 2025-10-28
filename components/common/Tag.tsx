
import React from 'react';

interface TagProps {
  label: string;
}

const Tag: React.FC<TagProps> = ({ label }) => {
  return (
    <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
      {label}
    </span>
  );
};

export default Tag;
