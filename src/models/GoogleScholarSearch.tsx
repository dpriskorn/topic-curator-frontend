import { Term } from "./Term";

class GoogleScholarSearch {
    term: Term;
  
    constructor(term: Term) {
      this.term = term;
    }
  
    inTitleUrl(lang: string = "en"): string {
      // Danish version is used for easier parsing
      return `https://scholar.google.com/scholar?as_q=&hl=${lang}&as_epq=${this.term.plusFormatted}&as_occt=title&as_sdt=0%2C5&as_vis=1`;
    }
  
    everywhereUrl(lang: string = "en"): string {
      return `https://scholar.google.com/scholar?hl=${lang}&q=%22${this.term.plusFormatted}%22`;
    }
  }
export { GoogleScholarSearch };