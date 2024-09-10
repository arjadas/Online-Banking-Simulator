import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client/index.js";
import { setContext } from "@apollo/client/link/context/index.js";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

let client: ApolloClient<any> | null = null;

export function getClient() {
  if (!client || typeof window === 'undefined') {
    client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
      ssrMode: typeof window === 'undefined'
    });
  }
  return client;
}