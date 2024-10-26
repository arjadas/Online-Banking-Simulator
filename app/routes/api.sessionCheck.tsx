import { json, LoaderFunction } from "@remix-run/cloudflare";
import { getUserSession } from "~/auth.server";

export const loader: LoaderFunction = async ({ context, request }) => {
  const user = await getUserSession(context, request);
  
  if (!user) {
    return json({ error: "Session expired" }, { status: 401 });
  }
  
  return json({ status: "valid" });
};