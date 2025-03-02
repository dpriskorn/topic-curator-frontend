import { cloneDeep } from "lodash";
import { Term } from "./Term";

export class Terms {
  private terms: Set<Term>;

  constructor(terms: Term[]) {
    if (!Array.isArray(terms)) {
      throw new TypeError(`Expected an array of Term objects, but got ${typeof terms}`);
    }

    if (terms.some(term => !(term instanceof Term))) {
      throw new TypeError("All elements in the array must be instances of Term.");
    }

    // Terms are already prepared in the constructor
    this.terms = new Set(terms);
  }

  prepare(): void {
    console.debug(`Preparing ${this.numberOfTerms} terms`);

    // Deep copy to avoid side effects
    const copiedTerms = cloneDeep([...this.terms]);

    // No need to call `.preparedTerm()` since terms are pre-normalized
    this.terms = new Set(copiedTerms);

    console.debug(
      `Number of terms after preparation and duplicate removal: ${this.numberOfTerms}`
    );
  }

  get numberOfTerms(): number {
    return this.terms.size;
  }

  addTerm(newTerm: Term): void {
    if (!this.hasTerm(newTerm.string)) {
      this.terms.add(newTerm); // No need to call `preparedTerm()`
    }
  }

  hasTerm(termString: string): boolean {
    // Create a temporary Term instance to ensure proper normalization
    const normalizedTerm = new Term(termString, "user" as any); // Temporary TermSource
    return [...this.terms].some(term => term.string === normalizedTerm.string);
  }

  getTerms(): Term[] {
    return [...this.terms];
  }

  addTerms(newTerms: Term[]): void {
    if (!Array.isArray(newTerms)) {
      throw new TypeError("Expected an array of Term objects.");
    }

    newTerms.forEach(term => this.addTerm(term));
  }
}
