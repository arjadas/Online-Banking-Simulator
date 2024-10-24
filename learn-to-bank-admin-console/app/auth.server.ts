import { retry } from "@reduxjs/toolkit/query";
import { createWorkersKVSessionStorage, createCookieSessionStorage } from "@remix-run/cloudflare";
import { c } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
import { getPrismaClient } from "~/service/db.server";
import { createUser } from "./service/userService";

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

  return createCookieSessionStorage({ cookie });
}

let sessionStorage: ReturnType<typeof createSessionStorage>;

function getSessionStorage(context: any) {
  if (!sessionStorage) {
    sessionStorage = createSessionStorage(context.cloudflare.env.firebase_storage);
  }
  return sessionStorage;
}

async function createUserSession(context: any, uid: string, email: string, bypassAdmin: boolean, redirectTo: string) {
  const db = getPrismaClient(context);
  let user = await db.user.findUnique({ where: { uid } });

  if (!user) {
    user = await createUser(context, uid, email, "Plan", "B");
  }

  if (user.role !== 'administrator' && !bypassAdmin) {
    throw new Error("Unauthorized access. Administrator role required.");
  }

  const { getSession, commitSession } = getSessionStorage(context);
  const session = await getSession();

  session.set("uid", uid);
  session.set("email", email);
  session.set("role", user.role);
  session.set("bypassAdmin", bypassAdmin);

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
  const bypassAdmin = session.get("bypassAdmin");

  if (!uid || !email || !role || (role !== 'administrator' && !bypassAdmin)) return null;

  return { uid, email, role, bypassAdmin };
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