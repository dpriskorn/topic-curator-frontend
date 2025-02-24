// src/models/Term.ts
import { TermSource } from "../enums/TermSource";

class Term {
  private _string: string;
  private _source: TermSource;

  constructor(term: string, source: TermSource) {
    this._string = term;
    this._source = source;
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

  preparedTerm(): this {
    console.debug(`Preparing: ${this._string}`);
    this.lower();
    this.removeDashes();
    this.escapeSingleQuotes();
    console.debug(`Result: ${this._string}`);
    return this;
  }

  private escapeSingleQuotes(): void {
    this._string = this._string.replace(/'/g, "\\'");
  }

  private removeDashes(): void {
    this._string = this._string.replace(/-/g, " ");
  }

  private lower(): void {
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
