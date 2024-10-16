import { retry } from "@reduxjs/toolkit/query";
import { createWorkersKVSessionStorage, createCookieSessionStorage } from "@remix-run/cloudflare";
import { c } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
import { getPrismaClient } from "~/service/db.server";

declare global {
  const firebase_storage: KVNamespace;
}

function createSessionStorage(firebaseStorage: KVNamespace) {
  const cookie = {
    name: "session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
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

    return sessionStorage;
}

let sessionStorage: ReturnType<typeof createSessionStorage>;

function getSessionStorage(context: any) {
  if (!sessionStorage) {
    sessionStorage = createSessionStorage(context.cloudflare.env.firebase_storage);
  }
  return sessionStorage;
}

async function createUserSession(context: any, uid: string, email: string, redirectTo: string) {
  const db = getPrismaClient(context);
  const user = await db.user.findUnique({ where: { uid } });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.role !== 'administrator') {
    throw new Error("Unauthorized access. Administrator role required.");
  }

  const { getSession, commitSession } = getSessionStorage(context);
  const session = await getSession();

  session.set("uid", uid);
  session.set("email", email);
  session.set("role", user.role);

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

  if (!session) {
    throw new Error("Cookie session not found.");
  }

  const uid = session.get("uid");
  const email = session.get("email");
  const role = session.get("role");

  if (!uid || !email || !role || role !== 'administrator') return null;

  return { uid, email, role };
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