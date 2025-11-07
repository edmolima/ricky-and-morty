'use client';

import { getClient } from '@/lib/apollo';
import { ApolloProvider } from '@apollo/client/react';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <ApolloProvider client={getClient()}>{children}</ApolloProvider>;
}