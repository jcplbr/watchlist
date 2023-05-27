"use client";

import { MessagesProvider } from "@/context/messages";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "next-themes";
import { FC, ReactNode } from "react";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <ThemeProvider>
      <div>
        <Toaster richColors />
        <QueryClientProvider client={queryClient}>
          <MessagesProvider>{children}</MessagesProvider>
        </QueryClientProvider>
      </div>
    </ThemeProvider>
  );
};

export default Providers;
