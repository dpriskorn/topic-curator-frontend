import { cloneDeep } from 'lodash';
import { Term } from "./Term";
import { TermSource } from "../enums/TermSource";

export class Terms {
  private terms: Set<Term>;

  constructor(label: string) {
    // Initialize with label, ensuring it is properly formatted
    this.terms = new Set([new Term(label, TermSource.LABEL).preparedTerm()]);
  }

  prepare(): void {
    console.debug(`Preparing ${this.numberOfTerms} terms`);
    
    // Deep copy to avoid side effects
    const copiedTerms = cloneDeep([...this.terms]);
    const preparedTerms = copiedTerms.map(term => term.preparedTerm());
    
    // Remove duplicates while maintaining order
    this.terms = new Set(preparedTerms);
    
    console.debug(
      `Number of terms after preparation and duplicate removal: ${this.numberOfTerms}`
    );
  }

  get numberOfTerms(): number {
    return this.terms.size;
  }

  addTerm(newTerm: Term): void {
    if (!this.hasTerm(newTerm.string)) {
      this.terms.add(newTerm.preparedTerm());
    }
  }

  hasTerm(termString: string): boolean {
    return [...this.terms].some(term => term.string === termString);
  }

  getTerms(): Term[] {
    return [...this.terms];
  }

  addTerms(newTerms: Term[]): void {
    newTerms.forEach(term => this.addTerm(term));
  }
}
