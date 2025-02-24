import axios from "axios";
import USER_AGENT from "../../public/config/userAgent";
import WIKIDATA_REST_API from "../../public/config/wikidataRestApi";

const apiClient = axios.create({
  baseURL: WIKIDATA_REST_API,
  headers: {
    "User-Agent": USER_AGENT,
  },
});

export default apiClient;
