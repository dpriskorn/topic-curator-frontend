export interface SparqlResponse {
    head: { vars: string[] };
    results: { bindings: Record<string, { type: string; value: string }>[]} ;
}
