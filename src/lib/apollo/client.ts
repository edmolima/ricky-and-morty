import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://rickandmortyapi.com/graphql';

let client: ReturnType<typeof createApolloClient> | null = null;

function createApolloClient(ssrMode = false) {
  const httpLink = new HttpLink({
    uri: API_URL,
  });

  return new ApolloClient({
    link: httpLink,
    ssrMode,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            characters: {
              keyArgs: ['filter'],
              merge(existing, incoming, { args }) {
                if (!existing) return incoming;
                if (args?.page === 1) return incoming;

                return {
                  ...incoming,
                  results: [...(existing.results || []), ...(incoming.results || [])],
                };
              },
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
    },
  });
}

export function getClient() {
  if (typeof window === 'undefined') {
    return createApolloClient(true);
  }

  if (!client) {
    client = createApolloClient(false);
  }

  return client;
}