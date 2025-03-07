import { describe, it, expect } from "vitest";
import { Term } from "./Term";
import { TermSource } from "../enums/TermSource";

describe("Term Class", () => {
  it("should create a Term instance with normalized values", () => {
    const term = new Term("Example-Term's", TermSource.LABEL);
    expect(term.string).toBe("example term\\'s"); // Normalized (lowercase, dashes replaced, escaped single quotes)
    expect(term.source).toBe(TermSource.LABEL);
  });

  it("should throw an error if term is not a string", () => {
    expect(() => new Term(123 as any, TermSource.LABEL)).toThrow(TypeError);
  });

  it("should return correct hash value", () => {
    const term = new Term("example", TermSource.LABEL);
    expect(typeof term.hash()).toBe("number");
  });

  it("should compare equality correctly", () => {
    const term1 = new Term("example-term", TermSource.LABEL);
    const term2 = new Term("example term", TermSource.ALIAS); // Should be equal due to normalization
    const term3 = new Term("different", TermSource.LABEL);
    expect(term1.equals(term2)).toBe(true); // Normalization makes them equal
    expect(term1.equals(term3)).toBe(false);
  });

  it("should normalize input on creation", () => {
    const term = new Term("Hello-World's", TermSource.LABEL);
    expect(term.string).toBe("hello world\\'s");
  });

  it("should replace spaces with plus signs in plusFormatted getter", () => {
    const term = new Term("hello world", TermSource.LABEL);
    expect(term.plusFormatted).toBe("hello+world");
  });

  it("should handle multiple normalization transformations correctly", () => {
    const term = new Term("MIXED-Case'S-Test", TermSource.USER);
    expect(term.string).toBe("mixed case\\'s test"); // Lowercase, removed dashes, escaped single quotes
  });

  it("should correctly escape single quotes", () => {
    const term = new Term("it's a test", TermSource.USER);
    expect(term.string).toBe("it\\'s a test");
  });

  it("should correctly remove dashes", () => {
    const term = new Term("dash-test-example", TermSource.USER);
    expect(term.string).toBe("dash test example");
  });

  it("should lowercase input correctly", () => {
    const term = new Term("UPPERCASE", TermSource.USER);
    expect(term.string).toBe("uppercase");
  });
});
