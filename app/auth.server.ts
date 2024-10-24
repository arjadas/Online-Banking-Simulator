import { createWorkersKVSessionStorage, createCookieSessionStorage } from "@remix-run/cloudflare";

import { redirect } from '@remix-run/node';

declare global {
  // @ts-ignore
  const firebase_storage: KVNamespace;
}

function createSessionStorage(firebaseStorage: KVNamespace) {
  const cookie = {
    name: "session",
    httpOnly: true,
    maxAge: 10, //60 * 60 * 24 * 7, // 1 week
    path: "/",
    sameSite: "lax",
    secrets: [import.meta.env.VITE_SESSION_SECRET],
    secure: true,
  } as any;

  const sessionStorage = process.env.NODE_ENV === "development"
    ? createCookieSessionStorage({ cookie })
    : createWorkersKVSessionStorage({
      kv: firebaseStorage,
      cookie,
    });

    return sessionStorage
}

let sessionStorage: ReturnType<typeof createSessionStorage>;

function getSessionStorage(context: any) {
  if (!sessionStorage) {
    sessionStorage = createSessionStorage(context.cloudflare.env.firebase_storage);
  }
  return sessionStorage;
}

async function createUserSession(context: any, uid: string, email: string, redirectTo: string) {
  const { getSession, commitSession } = getSessionStorage(context);
  const session = await getSession();
  session.set("uid", uid);
  session.set("email", email);

  return new Response(null, {
    status: 302,
    headers: {
      "Set-Cookie": await commitSession(session),
      Location: redirectTo,
    },
  });
}

async function requireUserSession(context: any, request: Request) {
  const session = await getUserSession(context, request);
  
  if (!session) {
    // Store the original URL they were trying to visit
    const url = new URL(request.url);
    const loginRedirect = url.pathname;
    
    // Clean up any existing invalid session
    const { destroySession } = getSessionStorage(context);
    const currentSession = await getSessionStorage(context).getSession(
      request.headers.get("Cookie")
    );
    
    throw redirect(`/login?redirectTo=${encodeURIComponent(loginRedirect)}`, {
      headers: {
        "Set-Cookie": await destroySession(currentSession),
      },
    });
  }
  
  return session;
}

async function getUserSession(context: any, request: Request) {
  const { getSession } = getSessionStorage(context);
  try {
    const session = await getSession(request.headers.get("Cookie"));
    const uid = session.get("uid");
    const email = session.get("email");

    if (!uid || !email) return null;

    return { uid, email };
  } catch (error) {
    // Session is invalid or expired
    return null;
  }
}

async function logout(context: any, request: Request) {
  const { getSession, destroySession } = getSessionStorage(context);
  const session = await getSession(request.headers.get("Cookie"));

  return new Response(null, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export { createUserSession, getUserSession, requireUserSession, logout };