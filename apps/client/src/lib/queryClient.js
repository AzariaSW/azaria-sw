import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => {
        const delays = [2000, 5000, 10000];
        return delays[attemptIndex] ?? 10000;
      },
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },

    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
