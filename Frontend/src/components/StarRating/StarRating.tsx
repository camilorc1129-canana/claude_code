'use client';

import { useState, useId } from 'react';
import styles from './StarRating.module.scss';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  totalRatings?: number;
  showCount?: boolean;
  size?: 'small' | 'medium' | 'large';
  readonly?: boolean;
  disabled?: boolean;
  className?: string;
}

const StarIcon = ({ fillState, gradientId }: { fillState: 'empty' | 'half' | 'full'; gradientId: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id={gradientId}>
        <stop offset="50%" stopColor="currentColor" />
        <stop offset="50%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill={
        fillState === 'full'
          ? 'currentColor'
          : fillState === 'half'
          ? `url(#${gradientId})`
          : 'none'
      }
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const StarRating = ({
  rating,
  onRatingChange,
  totalRatings = 0,
  showCount = false,
  size = 'medium',
  readonly = false,
  disabled = false,
  className = '',
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const uid = useId();
  const gradientId = `half-star-${uid.replace(/:/g, '')}`;

  const isInteractive = !readonly && !!onRatingChange;

  const getStarFillState = (starIndex: number): 'empty' | 'half' | 'full' => {
    if (isInteractive && hoverRating > 0) {
      return hoverRating >= starIndex ? 'full' : 'empty';
    }
    const currentRating = Math.max(0, Math.min(5, rating));
    if (currentRating >= starIndex) return 'full';
    if (currentRating >= starIndex - 0.5) return 'half';
    return 'empty';
  };

  const handleMouseEnter = (star: number) => {
    if (!isInteractive || disabled) return;
    setHoverRating(star);
  };

  const handleClick = (star: number) => {
    if (!isInteractive || disabled) return;
    setHoverRating(0);
    onRatingChange!(star);
  };

  const handleKeyDown = (event: React.KeyboardEvent, star: number) => {
    if (!isInteractive || disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRatingChange!(star);
    }
    if (event.key === 'Escape') {
      setHoverRating(0);
    }
  };

  const formattedRating = rating.toFixed(1);

  const countEl = showCount && totalRatings > 0 && (
    <span className={styles.count} aria-label={`${totalRatings} ratings`}>
      ({totalRatings})
    </span>
  );

  if (isInteractive) {
    return (
      <div
        className={`${styles.starRating} ${styles[size]} ${className}`}
        data-size={size}
        role="group"
        aria-label={`Rating: ${formattedRating} out of 5 stars${
          showCount && totalRatings > 0 ? `, ${totalRatings} ratings` : ''
        }`}
        onMouseLeave={() => !disabled && setHoverRating(0)}
      >
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              data-testid="star"
              className={`${styles.star} ${styles[getStarFillState(star)]}`}
              onClick={() => handleClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
              onKeyDown={(e) => handleKeyDown(e, star)}
              disabled={disabled}
              aria-label={`Rate ${star} stars`}
              aria-pressed={rating === star}
            >
              <StarIcon fillState={getStarFillState(star)} gradientId={gradientId} />
            </button>
          ))}
        </div>
        {countEl}
      </div>
    );
  }

  return (
    <div
      className={`${styles.starRating} ${styles[size]} ${className}`}
      data-size={size}
      role="img"
      aria-label={`Rating: ${formattedRating} out of 5 stars${
        showCount && totalRatings > 0 ? `, ${totalRatings} ratings` : ''
      }`}
    >
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            data-testid="star"
            className={`${styles.star} ${styles[getStarFillState(star)]}`}
            aria-hidden="true"
          >
            <StarIcon fillState={getStarFillState(star)} gradientId={gradientId} />
          </span>
        ))}
      </div>
      {countEl}
    </div>
  );
};
