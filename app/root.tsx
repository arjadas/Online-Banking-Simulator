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
import { useEffect } from "react";

// Add an error boundary component
export function ErrorBoundary() {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      console.error('Error details:', error);
      const timeoutId = setTimeout(() => {
        navigate("/login");
      }, 3000); // Stay on the screen for 3 seconds

      return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount
    }
  }, [error, navigate]);

  const getErrorMessage = () => {

    // check status codes
    switch (error?.status) {
      case 440:
        return "Your session has expired. Please login again.";
      case 401:
        return "Unauthenticated. Please login to continue.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1>{getErrorMessage()}</h1>
      <p>Redirecting to login page...</p>
    </div>
  );
}

export const loader: LoaderFunction = async ({ request, context }: { request: Request, context: any }) => {
  
  const url = new URL(request.url);
  const isLoginPage = url.pathname === "/login";

  try {
    const user = await getUserSession(context, request);

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
    if ((error as any).name === "SessionExpiredError") {
      throw json(
        { message: "Your session has expired. Please login again." },
        { status: 440 }
      );
    }
    // Handle other errors
    throw json(
      { message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
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