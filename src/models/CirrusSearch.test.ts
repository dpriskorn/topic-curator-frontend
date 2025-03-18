import { describe, it, expect, vi, beforeEach } from "vitest";
import { CirrusSearch } from "./CirrusSearch";
import { Item } from "./Item";
import { Term } from "./Term";
import { Subgraph } from "../enums/Subgraph";
import { prefixConfig } from "../../public/config/prefix";
//import axios from "axios";
import { TermSource } from "../enums/TermSource";

vi.mock("axios");

describe("CirrusSearch", () => {
    let item: Item;
    let term: Term;
    let subgraph: Subgraph;
    let cirrusSearch: CirrusSearch;

    beforeEach(() => {
        item = new Item("Q123", 'en');
        term = new Term("Example Term", TermSource.USER);
        subgraph = Subgraph.SCIENTIFIC_ARTICLES;
        cirrusSearch = new CirrusSearch(item, term, subgraph);
    });

    it("should construct correctly", () => {
        expect(cirrusSearch.item).toBe(item);
        expect(cirrusSearch.term).toBe(term);
        expect(cirrusSearch.subgraph).toBe(subgraph);
        expect(cirrusSearch.userPrefix).toBe("");
        expect(cirrusSearch.affix).toBe("");
    });

    it("should return correct buildPrefix", () => {
        prefixConfig[subgraph] = "Prefix-{0}";
        expect(cirrusSearch.buildPrefix).toBe("Prefix-Q123");
    });

    it("should return correct escapedCirrussearchString", () => {
        const expected = "Prefix-Q123 inlabel:\"Example Term\" ";
        expect(cirrusSearch.escapedCirrussearchString).toBe(expected);
    });

    it("should return correct cirrussearchString", () => {
        const expected = "Prefix-Q123 inlabel:\"Example Term\" ";
        expect(cirrusSearch.cirrussearchString).toBe(expected);
    });

    it("should escape quotes correctly", () => {
        expect(CirrusSearch.escapeQuotes("Hello 'world'"))
            .toBe("Hello \\\'world\\'");
        expect(CirrusSearch.escapeQuotes('Hello "world"'))
            .toBe("Hello \\\"world\\\"");
    });

    // it("should return correct cirrussearchTotal", async () => {
    //     axios.get.mockResolvedValue({
    //         data: { query: { searchinfo: { totalhits: 42 } } }
    //     });

    //     const total = await cirrusSearch.totalHits();
    //     expect(total).toBe(42);
    // });

    // it("should handle cirrussearchTotal with error", async () => {
    //     axios.get.mockRejectedValue(new Error("Network Error"));
    //     const total = await cirrusSearch.totalHits();
    //     expect(total).toBe(0);
    // });

    it("should return correct cirrussearchUrl", () => {
        const expectedUrl = "https://www.wikidata.org/w/index.php?search=Prefix-Q123%20inlabel%3A%22Example%20Term%22%20&title=Special%3ASearch&profile=advanced&fulltext=1&ns0=1";
        expect(cirrusSearch.url).toBe(expectedUrl);
    });
});
