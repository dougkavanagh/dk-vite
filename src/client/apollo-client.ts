import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  // uri: "https://countries.trevorblades.com",
  uri: "api/gql",
  cache: new InMemoryCache(),
});

export default client;
