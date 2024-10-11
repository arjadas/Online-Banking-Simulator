import { Prisma } from "@prisma/client";
import { LoaderFunction, ActionFunction, json } from "@remix-run/cloudflare";
import { getPrismaClient } from "~/util/db.server";

export const loader: LoaderFunction = async ({ context, request }) => {
  const url = new URL(request.url);
  const tableName = url.searchParams.get("table");

  if (!tableName) {
    return new Response("Table name is required", { status: 400 });
  }

  const db = getPrismaClient(context);

  try {
    const data = await db.$queryRawUnsafe(`SELECT * FROM \`${tableName}\``);
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error fetching table data:', error);
    return new Response("Error fetching table data", { status: 500 });
  }
};

export const action: ActionFunction = async ({ request, context }) => {
  const db = getPrismaClient(context);

  if (request.method === "DELETE") {
    const url = new URL(request.url);
    const table = url.searchParams.get("table");
    const { id, primaryKey } = await request.json() as any;


    if (!table || !id) {
      return json({ error: "Missing table or id" }, { status: 400 });
    }

    try {
      const query = `DELETE FROM \`${table}\` WHERE \`${id}\` = ${primaryKey}`;
      console.log(query)
      const result = await db.$queryRaw`${Prisma.raw(query)}`;

      if (Array.isArray(result) && result.length > 0) {
        return json({ success: true, deletedRecord: result[0] });
      } else {
        return json({ success: false, message: "No record found to delete" });
      }
    } catch (error: any) {
      console.error("Error executing dele3te query:", error);
      return json({ success: false, error: error.message });
    }
  }

  return json({ error: "Method not allowed" }, { status: 405 });
};