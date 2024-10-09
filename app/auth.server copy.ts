import { Session, SessionData, createCookieSessionStorage, redirect } from "@remix-run/cloudflare";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "firebase_session",
    secure: true,
    secrets: [import.meta.env.VITE_SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  },
});


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

export async function getUserSession(request: Request) {
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