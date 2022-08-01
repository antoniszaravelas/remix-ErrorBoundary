import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  ErrorBoundaryComponent,
  LinksFunction,
  MetaFunction,
} from "@remix-run/node";
import { log } from "~/utils/log.server";
import { runningInBrowser } from "./routes/runningInBrowser";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  if (!runningInBrowser()) {
    log.error(error);
  }
  return (
    <html lang="de">
      <head>
        <title>Fehler</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 py-8 lg:py-16 lg:px-6">
            <div className="mx-auto text-center">
              <h1 className="text-primary-600 dark:text-primary-500 mb-4 text-6xl font-extrabold tracking-tight lg:text-8xl">
                500
              </h1>
              <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
                Internal Server Error.
              </p>
              <div className="mb-4 text-left text-lg font-light text-gray-500 dark:text-gray-400">
                {process.env.NODE_ENV !== "production" ? (
                  <div className="whitespace-pre-line">{error.stack}</div>
                ) : (
                  <p className="text-center">
                    Es tut uns leid, aber es gab einen Fehler. Bitte versuchen
                    Sie es später noch einmal.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};
