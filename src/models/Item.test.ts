/* //import apiClient from "../components/apiClient";
import { Item } from "../models/Item";
//import { Term } from "../models/Term";
//import { TermSource } from "../enums/TermSource";
import { describe, beforeEach, afterEach, test, expect, vi } from "vitest";

vi.mock("../components/apiClient");

describe("Item Model", () => {
  const qid = "Q123";
  const lang = "en";
  let item: Item;

  beforeEach(() => {
    item = new Item(qid, lang);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // test("fetchAliasTerms should return an array of Term instances when API call is successful", async () => {
  //   const mockAliases = ["Alias1", "Alias2"];
  //   apiClient.get.mockResolvedValue({ status: 200, data: { [lang]: mockAliases } });

  //   const result = await item.fetchAliasTerms();

  //   expect(apiClient.get).toHaveBeenCalledWith(`/entities/items/${qid}/aliases`);
  //   expect(result).toHaveLength(2);
  //   expect(result[0]).toBeInstanceOf(Term);
  //   expect(result[0].string).toBe("Alias1");
  //   expect(result[0].source).toBe(TermSource.ALIAS);
  // });

  // test("fetchAliasTerms should return an empty array if no aliases exist for the given language", async () => {
  //   apiClient.get.mockResolvedValue({ status: 200, data: {} });

  //   const result = await item.fetchAliasTerms();

  //   expect(apiClient.get).toHaveBeenCalledWith(`/entities/items/${qid}/aliases`);
  //   expect(result).toEqual([]);
  // });

  // test("fetchAliasTerms should throw an error if API response status is not 200", async () => {
  //   apiClient.get.mockResolvedValue({ status: 404, data: {} });

  //   await expect(item.fetchAliasTerms()).rejects.toThrow("Aliases fetch error: 404");
  //   expect(apiClient.get).toHaveBeenCalledWith(`/entities/items/${qid}/aliases`);
  // });

  // test("fetchAliasTerms should throw an error if API call fails", async () => {
  //   apiClient.get.mockRejectedValue(new Error("Network Error"));

  //   await expect(item.fetchAliasTerms()).rejects.toThrow("Failed to fetch aliases: Error: Network Error");
  //   expect(apiClient.get).toHaveBeenCalledWith(`/entities/items/${qid}/aliases`);
  // });
});
 */