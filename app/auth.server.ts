import { confirmPasswordReset, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "~/firebase";
import { Session, SessionData, createWorkersKVSessionStorage, createCookieSessionStorage, redirect } from "@remix-run/cloudflare";
import { SessionStorage } from "@remix-run/cloudflare";

const sessionSecret = import.meta.env.VITE_SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("VITE_SESSION_SECRET must be set in your environment variables.");
}
declare global {
  const MY_KV_NAMESPACE: KVNamespace | undefined;
}

let sessionStorage: SessionStorage<SessionData, SessionData>;
//TODO secret
if (false) {
  sessionStorage = createWorkersKVSessionStorage({
    kv: MY_KV_NAMESPACE!,
    cookie: {
      name: "firebase_session",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  });
} else {

  // use an in-memory or cookie-based storage in development
  sessionStorage = createCookieSessionStorage({
    cookie: {
      name: "firebase_session",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  });
}

export async function getSession(request: Request) {
  return await sessionStorage.getSession(request.headers.get("Cookie"));
}

export async function commitSession(session: Session<SessionData, SessionData>) {
  return await sessionStorage.commitSession(session);
}

export async function destroySession(session: Session<SessionData, SessionData>) {
  return await sessionStorage.destroySession(session);
}

export default { getSession, commitSession, destroySession };

export async function requireUserSession(request: Request) {
  const session = await getSession(request);
  return session.get("user");
}

export async function handleSignOut(request: Request) {
  const session = await getSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session)
    },
  });
}