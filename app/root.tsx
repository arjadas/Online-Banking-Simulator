import { LoaderFunction, redirect } from "@remix-run/node";
import { Provider } from 'react-redux';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { CssBaseline } from "@geist-ui/core";
import { getSession } from "./auth.server";
import "./tailwind.css";
import store from './store';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const user = session.get("user");
  const url = new URL(request.url);

  if (!user) {
    if (url.pathname !== '/login') {
      return redirect('/login');
    }
  } else {
    if (url.pathname === '/') {
      return redirect('/app/accounts');
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
          <CssBaseline />
          <Outlet />
          <ScrollRestoration />
          <Scripts />
        </Provider>
      </body>
    </html>
  );
}
