import styles from "./Course.module.scss";
import { Course as CourseType } from "@/types";
import { StarRating } from "@/components/StarRating/StarRating";

type CourseProps = Omit<CourseType, "slug">;

export const Course = ({
  id,
  name,
  description,
  thumbnail,
  average_rating,
  total_ratings
}: CourseProps) => {
  return (
    <article className={styles.courseCard}>
      <div className={styles.thumbnailContainer}>
        <img src={thumbnail} alt={name} className={styles.thumbnail} />
        <div className={styles.thumbnailOverlay} />
        <div className={styles.playOverlay}>
          <div className={styles.playIcon}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className={styles.courseInfo}>
        <h2 className={styles.courseTitle}>{name}</h2>
        <p className={styles.description}>{description}</p>

        {typeof average_rating === 'number' && (
          <div className={styles.ratingContainer}>
            <StarRating
              rating={average_rating}
              totalRatings={total_ratings}
              showCount={true}
              size="small"
              readonly={true}
            />
          </div>
        )}
      </div>
    </article>
  );
};
