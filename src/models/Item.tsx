import apiClient from "../components/apiClient";
import { Term } from "./Term";
import { TermSource } from "../enums/TermSource";

class Item {
  public qid: string;
  private lang: string;

  constructor(qid: string, lang: string = "en") {
    this.qid = qid;
    this.lang = lang;
  }

  /**
   * Fetches aliases for the given QID and returns them as Term instances.
   */
  async fetchAliasTerms(): Promise<Term[]> {
    try {
      const aliasesUrl = `/entities/items/${this.qid}/aliases`;
      const response = await apiClient.get(aliasesUrl);

      if (response.status === 200) {
        const aliasStrings: string[] = response.data[this.lang] || [];
        return aliasStrings.map(alias => new Term(alias, TermSource.ALIAS));
      } else {
        throw new Error(`Aliases fetch error: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Failed to fetch aliases: ${error}`);
    }
  }
}

export { Item };