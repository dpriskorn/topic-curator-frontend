import axios from "axios";
import USER_AGENT from "../../public/config/userAgent";
import { WIKIBASE_REST_API } from "../../public/config/backends";

const apiClient = axios.create({
  baseURL: WIKIBASE_REST_API,
  headers: {
    "User-Agent": USER_AGENT,
  },
});

export default apiClient;
