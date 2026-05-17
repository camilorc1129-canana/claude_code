"""add partial unique index for active ratings

Revision ID: 3f7a1c9e2d84
Revises: 0e3a8766f785
Create Date: 2026-05-17 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '3f7a1c9e2d84'
down_revision: Union[str, None] = '0e3a8766f785'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add partial unique index to prevent duplicate active ratings per user+course.

    The existing UNIQUE(course_id, user_id, deleted_at) constraint does not prevent
    duplicates when deleted_at IS NULL because NULL != NULL in PostgreSQL.
    A partial index scoped to WHERE deleted_at IS NULL enforces uniqueness only
    for active (non-deleted) ratings, which is the intended business rule.
    """
    op.execute(
        """
        CREATE UNIQUE INDEX uix_course_ratings_active_user_course
        ON course_ratings (course_id, user_id)
        WHERE deleted_at IS NULL
        """
    )


def downgrade() -> None:
    """Remove partial unique index for active ratings."""
    op.execute(
        "DROP INDEX IF EXISTS uix_course_ratings_active_user_course"
    )
