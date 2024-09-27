import { LoaderFunction, redirect } from "@remix-run/cloudflare";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import { Provider } from 'react-redux';
import { requireUserSession } from "./auth.server";
import store from './store';
import "./tailwind.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export const loader: LoaderFunction = async ({ request }: { request: Request }) => {
  const user = await requireUserSession(request);
  const url = new URL(request.url);

  // Handle initial request
  if (url.pathname === "/") {
    console.log("Root:", request.headers.get("Cookie"), user?.uid);
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
            <Outlet />
            <ScrollRestoration />
            <Scripts />
        </Provider>
      </body>
    </html>
  );
}
