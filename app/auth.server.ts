import { confirmPasswordReset, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "~/firebase";
import { createCookieSessionStorage, redirect } from "@remix-run/node";

// Cookie session management
const sessionSecret = process.env.SESSION_SECRET;
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
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
}

export async function signup(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

export async function sendResetPasswordEmail(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  
export async function resetPassword(oobCode: string, newPassword: string) {
    try {
        await confirmPasswordReset(auth, oobCode, newPassword);
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export async function signOutUser() {
  try {
      await signOut(auth);
  } catch (error: any) {
      throw new Error(error.message);
  }
}

export async function handleSignOut(request: Request) {
  const session = await getSession(request);
  return redirect("/login", {
      headers: {
          "Set-Cookie": await destroySession(session)
      },
  });
}