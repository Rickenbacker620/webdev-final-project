import createFetchClient, { type Middleware } from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./schema";

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    // fetch token, if it doesn’t exist
    const accessToken = localStorage.getItem("jwt");

    // (optional) add logic here to refresh token when it expires

    // add Authorization header to every request
    request.headers.set("Authorization", `Bearer ${accessToken}`);
    return request;
  },
};

export const fetchClient = createFetchClient<paths>({
  baseUrl: "http://localhost:8000",
});
fetchClient.use(authMiddleware);
export const $api = createClient(fetchClient);
