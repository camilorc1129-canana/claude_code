import { render, screen } from "@testing-library/react";
import ClassPage from "./page";
import { Class } from "@/types";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/components/VideoPlayer/VideoPlayer", () => ({
  VideoPlayer: ({ src, title }: { src: string; title: string }) => (
    <div data-testid="mock-video-player">
      {title} - {src}
    </div>
  ),
}));

global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () =>
    Promise.resolve({
      id: 19,
      title: "Clase de Test",
      description: "Descripción de la clase de test",
      video: "https://test.com/video.mp4",
      duration: 1200,
      slug: "clase-test",
    } as Class),
});

describe("ClassPage", () => {
  it("renders class info and video", async () => {
    // Call async server component directly, then render the resulting JSX
    const jsx = await ClassPage({ params: Promise.resolve({ class_id: "19" }) });
    render(jsx);

    expect(screen.getByText("Clase de Test")).toBeInTheDocument();
    expect(screen.getByText("Descripción de la clase de test")).toBeInTheDocument();
    expect(screen.getByTestId("mock-video-player")).toBeInTheDocument();
    expect(screen.getByText(/Regresar al curso/)).toBeInTheDocument();
  });
});
