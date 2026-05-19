import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Course } from "../Course";

// StarRating is a client component that uses useState; mock it so the unit
// tests for Course stay isolated and do not depend on StarRating internals.
vi.mock("@/components/StarRating/StarRating", () => ({
  StarRating: ({ rating, totalRatings, showCount, size, readonly }: {
    rating: number;
    totalRatings?: number;
    showCount?: boolean;
    size?: string;
    readonly?: boolean;
  }) => (
    <div
      data-testid="star-rating"
      data-rating={rating}
      data-total-ratings={totalRatings}
      data-show-count={showCount}
      data-size={size}
      data-readonly={readonly}
    />
  ),
}));

describe("Course Component", () => {
  const baseCourse = {
    id: 1,
    name: "React Fundamentals",
    description: "Learn React from scratch",
    thumbnail: "https://example.com/thumbnail.jpg",
  };

  // ------------------------------------------------------------------ //
  // Basic rendering
  // ------------------------------------------------------------------ //

  it("renders course name", () => {
    render(<Course {...baseCourse} />);
    expect(screen.getByText(baseCourse.name)).toBeDefined();
  });

  it("renders course description", () => {
    render(<Course {...baseCourse} />);
    expect(screen.getByText(baseCourse.description)).toBeDefined();
  });

  it("renders thumbnail with correct src and alt text", () => {
    render(<Course {...baseCourse} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", baseCourse.thumbnail);
    expect(img).toHaveAttribute("alt", baseCourse.name);
  });

  it("renders the article element as the root element", () => {
    const { container } = render(<Course {...baseCourse} />);
    expect(container.querySelector("article")).toBeDefined();
  });

  it("renders an h2 for the course title", () => {
    render(<Course {...baseCourse} />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeDefined();
    expect(heading.textContent).toBe(baseCourse.name);
  });

  // ------------------------------------------------------------------ //
  // Rating section — conditional rendering
  // ------------------------------------------------------------------ //

  it("does not render StarRating when average_rating is undefined", () => {
    render(<Course {...baseCourse} />);
    expect(screen.queryByTestId("star-rating")).toBeNull();
  });

  it("renders StarRating when average_rating is a positive number", () => {
    render(<Course {...baseCourse} average_rating={4.5} total_ratings={23} />);
    expect(screen.getByTestId("star-rating")).toBeDefined();
  });

  it("renders StarRating when average_rating is 0 (typeof 0 === 'number')", () => {
    render(<Course {...baseCourse} average_rating={0} total_ratings={0} />);
    expect(screen.getByTestId("star-rating")).toBeDefined();
  });

  it("passes correct props to StarRating", () => {
    render(<Course {...baseCourse} average_rating={3.7} total_ratings={10} />);
    const starRating = screen.getByTestId("star-rating");
    expect(starRating).toHaveAttribute("data-rating", "3.7");
    expect(starRating).toHaveAttribute("data-total-ratings", "10");
    expect(starRating).toHaveAttribute("data-show-count", "true");
    expect(starRating).toHaveAttribute("data-size", "small");
    expect(starRating).toHaveAttribute("data-readonly", "true");
  });

  it("renders StarRating when average_rating is provided but total_ratings is undefined", () => {
    render(<Course {...baseCourse} average_rating={2.5} />);
    expect(screen.getByTestId("star-rating")).toBeDefined();
  });
});
