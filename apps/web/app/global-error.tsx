"use client";

import { Button } from "@repo/design/ui/button";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
// import { captureException } from '@sentry/nextjs';
import type NextError from "next/error";
import { useEffect } from "react";

type GlobalErrorProperties = {
  readonly error: NextError & { digest?: string };
  readonly reset: () => void;
};

const GlobalError = ({ error, reset }: GlobalErrorProperties) => {
  useEffect(() => {
    // captureException(error);
  }, [error]);

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <h1>Oops, something went wrong</h1>
        <Button onPress={() => reset()}>Try again</Button>
      </body>
    </html>
  );
};

export default GlobalError;
