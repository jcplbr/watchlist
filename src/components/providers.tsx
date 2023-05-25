"use client";

import { MessagesProvider } from "@/context/messages";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <div>
      <Toaster position="bottom-right" richColors />
      <QueryClientProvider client={queryClient}>
        <MessagesProvider>{children}</MessagesProvider>
      </QueryClientProvider>
    </div>
  );
};

export default Providers;
