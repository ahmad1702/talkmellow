import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as DarkModeProvider } from "next-themes";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <DarkModeProvider attribute="class" defaultTheme="dark">
        <NextUIProvider>
          <Component {...pageProps} />
        </NextUIProvider>
      </DarkModeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
