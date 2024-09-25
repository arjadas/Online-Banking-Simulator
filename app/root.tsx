import { LoaderFunction, json, redirect } from "@remix-run/cloudflare";
import { Provider } from 'react-redux';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { CssBaseline } from "@geist-ui/core";
import { getSession } from "./auth.server";
import "./tailwind.css";
import store from './store';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

export const loader: LoaderFunction = async ({ request }: { request: Request }) => {
  const session = await getSession(request);
  const user = session.get("user");
  const url = new URL(request.url);

  // Handle initial request
  if (url.pathname === "/") {
    if (user) {
      return redirect("/app/accounts");
    } else {
      return redirect("/login");
    }
  }

  return null;
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Provider store={store}>
         {/*  <CssBaseline /> */}
          <Outlet />
          <ScrollRestoration />
          <Scripts />
        </Provider>
      </body>
    </html>
  );
}
