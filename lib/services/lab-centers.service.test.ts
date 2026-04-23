import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api-client", () => ({
  publicFetch: vi.fn(),
  clientFetch: vi.fn(),
  getApiUrl: (path: string) => path,
}));

import { LabCenterService } from "./lab-centers.service";
import { publicFetch } from "@/lib/api-client";

describe("lab center service", () => {
  it("adds provider filters to local lab searches", async () => {
    vi.mocked(publicFetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    } as Response);

    await LabCenterService.getLabCenters({
      lat: 40,
      lng: -73,
      radius: 25,
      providerCode: "QUEST",
    });

    expect(vi.mocked(publicFetch)).toHaveBeenCalledWith(
      expect.stringContaining("providerCode=QUEST"),
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("loads nationwide provider availability", async () => {
    vi.mocked(publicFetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          groups: [
            {
              stateCode: "CA",
              stateName: "California",
              providerCode: "QUEST",
              providerLabel: "Quest Diagnostics",
              sampleLabs: [],
              source: "places",
              matchType: "reference",
            },
          ],
          meta: {
            page: 1,
            pageSize: 12,
            totalGroups: 1,
            excludedStates: ["MA", "MD", "NJ", "NY", "RI"],
          },
        },
      }),
    } as Response);

    await expect(
      LabCenterService.getNationwideLabCenters({
        country: "US",
        providers: ["QUEST"],
        page: 1,
        pageSize: 12,
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        groups: [
          expect.objectContaining({
            stateCode: "CA",
            providerCode: "QUEST",
            matchType: "reference",
          }),
        ],
        meta: expect.objectContaining({
          excludedStates: ["MA", "MD", "NJ", "NY", "RI"],
        }),
      }),
    );

    expect(vi.mocked(publicFetch)).toHaveBeenCalledWith(
      expect.stringContaining("/lab-centers/nationwide?country=US&providers=QUEST&page=1&pageSize=12"),
      expect.objectContaining({ method: "GET" }),
    );
  });
});
