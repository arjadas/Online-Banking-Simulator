import { CssBaseline } from "@geist-ui/core";
import { json, LoaderFunction, redirect } from "@remix-run/cloudflare";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
  useRouteError
} from "@remix-run/react";
import { Provider } from 'react-redux';
import { getUserSession } from "./auth.server";
import { AuthProvider } from "./components/AuthProvider";
import store from './store';
import "./globalStyles.css";

export const loader: LoaderFunction = async ({ request, context }: { request: Request, context: any }) => {
  try {
    const user = await getUserSession(context, request);
    const url = new URL(request.url);
    const isLoginPage = url.pathname === "/login";

    // If no user session or session expired, redirect to login 
    // (unless already on login page to prevent redirect loops)
    if (!user && !isLoginPage) {
      return redirect("/login");  // Direct redirect instead of throwing
    }

    // Handle initial request
    if (url.pathname === "/") {
      if (user) {
        return redirect("/app/accounts");
      } else {
        return redirect("/login");
      }
    }

    return json({ user });
    
  } catch (error) {
    // Catch any errors and redirect to login
    return redirect("/login");
  }
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