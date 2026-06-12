import { SiteMetrics } from "@/components/shared/SiteMetrics";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import React from "react";

describe("SiteMetrics", () => {
  it("renders fallback metrics before the client summary loads", () => {
    const markup = renderToStaticMarkup(React.createElement(SiteMetrics));

    expect(markup).toContain("tests processed");
    expect(markup).toContain("4.9/5 average");
  });

  it("does not publish sparse local review data as social proof", () => {
    const markup = renderToStaticMarkup(
      React.createElement(SiteMetrics, {
        initialSummary: {
          testsProcessed: 1,
          averageRating: 5,
          reviewCount: 1,
        },
      }),
    );

    expect(markup).toContain("ZIP-checked availability");
    expect(markup).not.toContain("1+ tests processed");
  });
});
