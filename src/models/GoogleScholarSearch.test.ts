import { describe, it, expect } from "vitest";
import { GoogleScholarSearch } from "./GoogleScholarSearch";
import { Term } from "./Term";

describe("GoogleScholarSearch", () => {
  const mockTerm = {
    plusFormatted: "test+query"
  } as Term;

  it("should create an instance with a term", () => {
    const search = new GoogleScholarSearch(mockTerm);
    expect(search.term).toBe(mockTerm);
  });

  it("should generate the correct inTitleUrl", () => {
    const search = new GoogleScholarSearch(mockTerm);
    expect(search.inTitleUrl()).toBe(
      "https://scholar.google.com/scholar?as_q=&hl=en&as_epq=test+query&as_occt=title&as_sdt=0%2C5&as_vis=1"
    );
    expect(search.inTitleUrl("da")).toBe(
      "https://scholar.google.com/scholar?as_q=&hl=da&as_epq=test+query&as_occt=title&as_sdt=0%2C5&as_vis=1"
    );
  });

  it("should generate the correct everywhereUrl", () => {
    const search = new GoogleScholarSearch(mockTerm);
    expect(search.everywhereUrl()).toBe(
      'https://scholar.google.com/scholar?hl=en&q=%22test+query%22'
    );
    expect(search.everywhereUrl("fr")).toBe(
      'https://scholar.google.com/scholar?hl=fr&q=%22test+query%22'
    );
  });
});
