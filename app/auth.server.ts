import { confirmPasswordReset, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "~/firebase";
import { createCookieSessionStorage, redirect } from "@remix-run/cloudflare";

// Cookie session management
const sessionSecret = import.meta.env.VITE_SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set in your environment variables.");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "firebase_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return storage.getSession(cookie);
}

export async function commitSession(session: any) {
  return storage.commitSession(session);
}

export async function destroySession(session: any) {
  return storage.destroySession(session);
}

export async function requireUserSession(request: Request) {
  const session = await getSession(request);
  const user = session.get("user");

  if (!user) {
    throw redirect("/login");
  }

  return user;
}

export async function login(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function signup(email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function sendResetPasswordEmail(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function resetPassword(oobCode: string, newPassword: string) {
  await confirmPasswordReset(auth, oobCode, newPassword);
}

export async function signOutUser() {
  await signOut(auth);
}

export async function handleSignOut(request: Request) {
  const session = await getSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session)
    },
  });
}