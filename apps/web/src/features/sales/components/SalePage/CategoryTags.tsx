import React from 'react';

interface CategoryTagsProps {
  categories?: string[];
}

const CategoryTags: React.FC<CategoryTagsProps> = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {categories.map((category) => (
        <div
          key={category}
          className="border border-gray-300 rounded-full px-5 py-2"
        >
          <span className="text-sm">{category}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoryTags;
