"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
// import { trpc } from "@/lib/trpc";
// import { httpBatchLink } from "@trpc/client";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  // TODO: Uncomment when tRPC is fully configured
  // const [trpcClient] = useState(() =>
  //   trpc.createClient({
  //     links: [
  //       httpBatchLink({
  //         url: "/api/trpc",
  //       }),
  //     ],
  //   })
  // );

  return (
    <QueryClientProvider client={queryClient}>
      {/* <trpc.Provider client={trpcClient} queryClient={queryClient}> */}
      {children}
      {/* </trpc.Provider> */}
    </QueryClientProvider>
  );
}
