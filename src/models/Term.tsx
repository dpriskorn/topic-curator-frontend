// src/models/Term.ts
import { TermSource } from "../enums/TermSource";

class Term {
  private _string: string;
  private _source: TermSource;

  constructor(term: string, source: TermSource) {
    if (typeof term !== "string") {
      throw new TypeError(`Expected string for term, but got ${typeof term}, ${term}`);
    }
    this._string = term;
    this._source = source;

    this.prepare(); // Automatically normalize term
  }

  get string(): string {
    return this._string;
  }

  get source(): TermSource {
    return this._source;
  }

  hash(): number {
    return this.hashString(this._string);
  }

  equals(other: Term): boolean {
    return this._string === other.string;
  }

  private prepare(): void {
    if (typeof this._string !== "string") {
      throw new Error(`Invalid _string type: ${typeof this._string}`);
    }
    console.debug(`Preparing: ${this._string}`);

    this.lower();
    this.removeDashes();
    this.escapeSingleQuotes();

    console.debug(`Result: ${this._string}`);
  }

  private escapeSingleQuotes(): void {
    this._string = this._string.replace(/'/g, "\\'");
  }

  private removeDashes(): void {
    this._string = this._string.replace(/-/g, " ");
  }

  private lower(): void {
    if (typeof this._string !== "string") {
      throw new Error(`Invalid _string type in lower(): ${typeof this._string})`);
    }
    console.debug(`Lowercasing: ${this._string} (Type: ${typeof this._string})`);
    this._string = this._string.toLowerCase();
  }

  get plusFormatted(): string {
    return this._string.replace(/\s+/g, "+");
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
}

export { Term };
