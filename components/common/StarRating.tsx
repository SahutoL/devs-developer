
import React from 'react';
import StarIcon from '../icons/StarIcon';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5 }) => {
  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        return (
          <StarIcon
            key={index}
            className={`w-4 h-4 ${starValue <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
