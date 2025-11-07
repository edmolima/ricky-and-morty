import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';

type CustomRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  mocks?: MockedResponse[];
};

export function renderWithProviders(
  ui: ReactElement,
  { mocks = [], ...options }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <MockedProvider mocks={mocks} addTypename={false}>{children}</MockedProvider>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';