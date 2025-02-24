import { WIKIDATA_SPARQL_ENDPOINT } from "../../public/config/sparql";
import USER_AGENT from "../../public/config/userAgent";
import apiClient from "../components/apiClient";
import { SparqlResponse } from "../types/sparql";
import { CirrusSearch } from "./Cirrussearch";
import { GoogleScholarSearch } from "./GoogleScholarSearch";
import SparqlItem from "./SparqlItem";
import { Term } from "./Term";
import { TopicParameters } from "./TopicParameters";
import { flatten } from "flat";

export class Query {
    lang: string;
    term: Term;
    parameters: TopicParameters;
    items: SparqlItem[] = [];
    itemCount: number = 0;
    hasBeenRun: boolean = false;

    constructor(lang: string, term: Term, parameters: TopicParameters) {
        this.lang = lang;
        this.term = term;
        this.parameters = parameters;
    }

    get cirrussearch(): CirrusSearch {
        return this.parameters.getCirrusSearch(this.term);
    }

    get calculatedLimit(): number {
        return this.parameters.limit - this.itemCount;
    }

    private async execute(): Promise<SparqlResponse> {
        if (!this.wdqsQueryString) {
            throw new Error("no query string");
        }

        try {
            const response = await apiClient.get(WIKIDATA_SPARQL_ENDPOINT, {
                params: { query: this.wdqsQueryString, format: "json" },
            });

            return response.data;
        } catch (error) {
            console.error("SPARQL query failed:", error);
            throw new Error("SPARQL execution failed");
        }
    }

    private async runAndParseResults(): Promise<SparqlItem[]> {
        const items: SparqlItem[] = [];
        const results = await this.execute();

        for (const itemJson of results["results"]["bindings"]) {
            const flattenedItem = flatten(itemJson) as {
                item_value?: string;
                itemLabel_value?: string;
                instance_ofLabel_value?: string;
                publicationLabel_value?: string;
                doi_id_value?: string;
                full_resources_value?: string;
            };
            const item = new SparqlItem({
                qid: flattenedItem["item_value"] || "",
                itemLabel: flattenedItem["itemLabel_value"] || "No label found",
                instanceOfLabel: flattenedItem["instance_ofLabel_value"] || "No label found",
                publicationLabel: flattenedItem["publicationLabel_value"] || "No label found",
                doi: flattenedItem["doi_id_value"] || "",
                rawFullResources: flattenedItem["full_resources_value"] || "",
                term: this.term,
            });
            items.push(item);
        }
        return items;
    }

    async runAndGetItems(): Promise<SparqlItem[]> {
        this.hasBeenRun = true;
        return await this.runAndParseResults();
    }

    get generate279MinusLines(): string {
        const lines: string[] = [];
        for (let levels = 2; levels < 15; levels++) {
            const subpath = "wdt:P921";
            let path = subpath;
            for (let i = 1; i < levels; i++) {
                path += `/${subpath}`;
            }
            lines.push(`\t\tMINUS {?item ${path} wd:${this.parameters.topic.qid}. }`);
        }
        return lines.join("\n");
    }

    get wdqsQueryString(): string {
        console.debug(`using cirrussearch_string: '${this.cirrussearch.escapedCirrussearchString}'`);
        // we include the user agent to help the sysops know where the queries come from
        return `
            #${USER_AGENT}
            SELECT DISTINCT ?item ?itemLabel ?instance_ofLabel
            ?publicationLabel ?doi_id
            (GROUP_CONCAT(DISTINCT ?full_resource; separator=",") as ?full_resources)
            WHERE {
              hint:Query hint:optimizer "None".
              BIND(STR('${this.cirrussearch.escapedCirrussearchString}') as ?search_string)
              SERVICE wikibase:mwapi {
                bd:serviceParam wikibase:api "Search";
                                wikibase:endpoint "www.wikidata.org";
                                mwapi:srsearch ?search_string.
                ?title wikibase:apiOutput mwapi:title.
              }
              BIND(IRI(CONCAT(STR(wd:), ?title)) AS ?item)
              ?item wdt:P31 ?instance_of.
              OPTIONAL { ?item wdt:P1433 ?publication. }
              OPTIONAL { ?item wdt:P356 ?doi_id. }
              OPTIONAL { ?item wdt:P953 ?full_resource. }
              ${this.generate279MinusLines}
              SERVICE wikibase:label { bd:serviceParam wikibase:language "${this.lang}". }
            }
            GROUP BY ?item ?itemLabel ?instance_ofLabel ?publicationLabel ?doi_id
            LIMIT ${this.calculatedLimit}
        `;
    }

    get getInTitleGoogleUrl(): string {
        const gs = new GoogleScholarSearch(this.term);
        return gs.inTitleUrl();
    }

    get getEverywhereGoogleUrl(): string {
        const gs = new GoogleScholarSearch(this.term);
        return gs.everywhereUrl();
    }
}
