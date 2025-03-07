import { describe, it, expect, beforeEach, vi } from "vitest";
import { Terms } from "./Terms";
import { Term } from "./Term";
import { TermSource } from "../enums/TermSource";

describe("Terms class", () => {
  let term1: Term;
  let term2: Term;
  //let term3: Term;
  let termsInstance: Terms;

  beforeEach(() => {
    term1 = new Term("Example-Term", TermSource.LABEL);
    term2 = new Term("Another_Term", TermSource.ALIAS);
    //term3 = new Term("example term", TermSource.USER); // Same string as term1 after normalization

    termsInstance = new Terms([term1, term2]);
  });

  it("should throw an error if input is not an array", () => {
    expect(() => new Terms("invalid" as any)).toThrow(TypeError);
  });

  it("should throw an error if array contains non-Term objects", () => {
    expect(() => new Terms([term1, {} as Term])).toThrow(TypeError);
  });

  it("should initialize with unique terms", () => {
    expect(termsInstance.numberOfTerms).toBe(2);
  });

  it("should add a new term if not present", () => {
    termsInstance.addTerm(new Term("UniqueTerm", TermSource.USER));
    expect(termsInstance.numberOfTerms).toBe(3);
  });

  it("should not add duplicate terms", () => {
    termsInstance.addTerm(new Term("Example-Term", TermSource.LABEL)); // Same as term1 after normalization
    expect(termsInstance.numberOfTerms).toBe(2);
  });

  it("should check if a term exists", () => {
    expect(termsInstance.hasTerm("Example-Term")).toBe(true);
    expect(termsInstance.hasTerm("example term")).toBe(true); // Should match normalized format
    expect(termsInstance.hasTerm("Nonexistent")).toBe(false);
  });

  it("should return all terms", () => {
    const terms = termsInstance.getTerms();
    expect(terms).toHaveLength(2);
    expect(terms[0]).toBeInstanceOf(Term);
  });

  it("should add multiple terms at once", () => {
    termsInstance.addTerms([new Term("NewTerm", TermSource.USER), new Term("Extra", TermSource.ALIAS)]);
    expect(termsInstance.numberOfTerms).toBe(4);
  });

  it("should throw an error when adding non-array terms", () => {
    expect(() => termsInstance.addTerms("invalid" as any)).toThrow(TypeError);
  });

  it("should handle normalization of input terms correctly", () => {
    termsInstance.addTerm(new Term("Example-Term", TermSource.LABEL)); // Already normalized
    termsInstance.addTerm(new Term("example term", TermSource.USER)); // Same string, different source
    termsInstance.addTerm(new Term("EXAMPLE_TERM", TermSource.USER)); // Should be normalized

    expect(termsInstance.numberOfTerms).toBe(2); // Should not count as a new term
  });

  it("should prepare terms correctly (no change expected)", () => {
    vi.spyOn(console, "debug").mockImplementation(() => {}); // Suppress debug logs

    termsInstance.prepare();
    const terms = termsInstance.getTerms();

    expect(terms.some(term => term.string.includes("-"))).toBe(false);
    expect(terms.some(term => term.string.includes("'"))).toBe(false);
    expect(terms.some(term => /[A-Z]/.test(term.string))).toBe(false);
    expect(termsInstance.numberOfTerms).toBe(2); // Should remain the same
  });
});
