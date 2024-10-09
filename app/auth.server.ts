import { createWorkersKVSessionStorage } from "@remix-run/cloudflare";

declare global {
  const firebase_storage: KVNamespace;
}

function createSessionStorage(firebaseStorage: KVNamespace) {
  return createWorkersKVSessionStorage({
    kv: firebaseStorage,
    cookie: {
      name: "session",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "lax",
      secrets: [import.meta.env.VITE_SESSION_SECRET],
      secure: true,
    },
  });
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

async function getUserSession(context: any, request: Request) {
  const { getSession } = getSessionStorage(context);
  const session = await getSession(request.headers.get("Cookie"));
  const uid = session.get("uid");
  const email = session.get("email");

  if (!uid || !email) return null;

  return { uid, email };
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

export { createUserSession, getUserSession, logout };