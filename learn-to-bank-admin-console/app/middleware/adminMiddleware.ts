import { getUserSession } from "../auth.server";

export async function adminMiddleware(request: Request, context: any): Promise<Response> {
  const userSession = await getUserSession(context, request);

  if (!userSession || (userSession.role !== 'administrator' && !userSession.bypassAdmin)) {
    return new Response("Unauthorized. Administrator access required.", { status: 403 });
  }

  return new Response("Authorized", { status: 200 });
}