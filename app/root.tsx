import { CssBaseline } from "@geist-ui/core";
import { json, LinksFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate
} from "@remix-run/react";
import { Provider } from 'react-redux';
import { getUserSession } from "./auth.server";
import { AuthProvider } from "./components/AuthProvider";
import store from './store';
import "./globalStyles.css";
import { useEffect } from "react";

export function ErrorBoundary({ error }: { error: Error }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the error is a redirect response
    if (error instanceof Response && error.status === 302) {
      const location = error.headers.get("Location");
      if (location) {
        navigate(location, { replace: true });
      }
    } else {
      // For actual errors, redirect to login without session expired message
      navigate("/login", { replace: true });
    }
  }, [error, navigate]);

  // Return null or a loading state while redirecting
  return null;
}

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
