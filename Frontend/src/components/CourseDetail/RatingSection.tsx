'use client';

import { useState, useEffect } from 'react';
import { StarRating } from '@/components/StarRating/StarRating';
import { ratingsApi, ApiError } from '@/services/ratingsApi';
import type { CourseRating } from '@/types/rating';
import styles from './RatingSection.module.scss';

interface RatingSectionProps {
  courseId: number;
  initialAverageRating?: number;
  initialTotalRatings?: number;
  initialDistribution?: Record<string, number>;
  userId?: number;
}

function calculateNewAverage(
  currentAverage: number,
  currentTotal: number,
  oldRating: number,
  newRating: number,
  isNew: boolean
): number {
  if (isNew) {
    if (currentTotal === 0) return newRating;
    return (currentAverage * currentTotal + newRating) / (currentTotal + 1);
  }
  if (currentTotal === 0) return newRating;
  return (currentAverage * currentTotal - oldRating + newRating) / currentTotal;
}

function DistributionBar({
  star,
  count,
  total,
}: {
  star: number;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className={styles.distRow}>
      <span className={styles.distLabel}>{star}★</span>
      <div className={styles.distBarTrack}>
        <div className={styles.distBarFill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.distCount}>{count}</span>
    </div>
  );
}

export const RatingSection = ({
  courseId,
  initialAverageRating = 0,
  initialTotalRatings = 0,
  initialDistribution,
  userId = 1,
}: RatingSectionProps) => {
  const [existingRating, setExistingRating] = useState<CourseRating | null>(null);
  const [userRatingValue, setUserRatingValue] = useState<number>(0);
  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [totalRatings, setTotalRatings] = useState(initialTotalRatings);
  const [distribution, setDistribution] = useState(() =>
    initialDistribution
      ? Object.entries(initialDistribution)
          .map(([star, count]) => ({ star: Number(star), count }))
          .sort((a, b) => b.star - a.star)
      : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadUserRating = async () => {
      try {
        const rating = await ratingsApi.getUserRating(courseId, userId);
        if (rating) {
          setExistingRating(rating);
          setUserRatingValue(rating.rating);
        }
      } catch {
        // Not critical — user starts with no rating pre-filled
      }
    };

    loadUserRating();
  }, [courseId, userId]);

  const handleRatingChange = async (newRating: number) => {
    const previousRatingObj = existingRating;
    const previousValue = userRatingValue;
    const previousAverage = averageRating;
    const previousTotal = totalRatings;

    const isNew = existingRating === null;
    const rawAverage = calculateNewAverage(
      averageRating,
      totalRatings,
      previousValue,
      newRating,
      isNew
    );
    const newAverage = Math.round(rawAverage * 10) / 10;
    const newTotal = isNew ? totalRatings + 1 : totalRatings;

    // Optimistic update
    setUserRatingValue(newRating);
    setAverageRating(newAverage);
    setTotalRatings(newTotal);
    setIsLoading(true);
    setError(null);

    try {
      let result: CourseRating;
      if (isNew) {
        result = await ratingsApi.createRating(courseId, { user_id: userId, rating: newRating });
      } else {
        result = await ratingsApi.updateRating(courseId, userId, { user_id: userId, rating: newRating });
      }
      setExistingRating(result);
      setSuccessMessage('Rating guardado');
      setTimeout(() => setSuccessMessage(null), 3000);

      // Refresh stats from API to get accurate average, total and distribution
      try {
        const freshStats = await ratingsApi.getRatingStats(courseId);
        setAverageRating(freshStats.average_rating);
        setTotalRatings(freshStats.total_ratings);
        if (freshStats.rating_distribution) {
          setDistribution(
            Object.entries(freshStats.rating_distribution)
              .map(([star, count]) => ({ star: Number(star), count }))
              .sort((a, b) => b.star - a.star)
          );
        }
      } catch {
        // Stats refresh failed silently — optimistic values remain displayed
      }
    } catch (err) {
      // Rollback on failure
      setExistingRating(previousRatingObj);
      setUserRatingValue(previousValue);
      setAverageRating(previousAverage);
      setTotalRatings(previousTotal);

      const message =
        err instanceof ApiError
          ? err.message
          : 'Error al guardar el rating. Intenta de nuevo.';
      setError(message);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.ratingSection}>
      {/* Izquierda: calificar */}
      <div className={styles.userRating}>
        <h3 className={styles.title}>Califica este curso</h3>
        <StarRating
          rating={userRatingValue}
          onRatingChange={handleRatingChange}
          size="large"
          disabled={isLoading}
        />
        {userRatingValue > 0 && !isLoading && !error && !successMessage && (
          <p className={styles.currentRatingHint}>Tu calificación: {userRatingValue} / 5</p>
        )}
        {isLoading && <p className={styles.loadingText}>Guardando…</p>}
        {error && (
          <p className={styles.errorText} role="alert">
            {error}
          </p>
        )}
        {successMessage && (
          <p className={styles.successText} role="status">
            {successMessage}
          </p>
        )}
      </div>

      {/* Derecha: stats globales */}
      <div className={styles.statsSection}>
        <h4 className={styles.statsTitle}>Rating del curso</h4>

        <div className={styles.statsOverview}>
          <span className={styles.bigScore}>{averageRating.toFixed(1)}</span>
          <div className={styles.statsOverviewRight}>
            <StarRating
              rating={averageRating}
              readonly={true}
              size="medium"
              showCount={false}
            />
            <p className={styles.statsDescription}>
              {totalRatings} {totalRatings === 1 ? 'valoración' : 'valoraciones'}
            </p>
          </div>
        </div>

        {distribution.length > 0 && (
          <div className={styles.distribution}>
            {distribution.map(({ star, count }) => (
              <DistributionBar
                key={star}
                star={star}
                count={count}
                total={totalRatings}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
