import { CssBaseline } from "@geist-ui/core";
import { json, LoaderFunction, redirect } from "@remix-run/cloudflare";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";
import { Provider } from 'react-redux';
import { getUserSession } from "./auth.server";
import { AuthProvider } from "./components/AuthProvider";
import store from './store';
import "./tailwind.css";

export const loader: LoaderFunction = async ({ request, context }: { request: Request, context: any }) => {
  const user = await getUserSession(context, request);
  const url = new URL(request.url);

  // Handle initial request
  if (url.pathname === "/") {
    if (user) {
      return redirect("/app/accounts");
    } else {
      return redirect("/login");
    }
  }

  return json({ user });
};

export default function App() {
  const { user } = useLoaderData<any>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Provider store={store}>
          <AuthProvider uid={user?.uid}>
            <CssBaseline />
            <Outlet />
            <ScrollRestoration />
            <Scripts />
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
