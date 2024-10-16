import { Prisma } from "@prisma/client";
import { ActionFunction, json, LoaderFunction } from "@remix-run/cloudflare";
import { adminMiddleware } from "~/middleware/adminMiddleware";
import { getPrismaClient } from "~/service/db.server";

export const loader: LoaderFunction = async ({ context, request }) => {
  const adminCheck = await adminMiddleware(request, context);
  if (adminCheck.status !== 200) return adminCheck;

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
  const adminCheck = await adminMiddleware(request, context);
  if (adminCheck.status !== 200) return adminCheck;

  const db = getPrismaClient(context);
  const url = new URL(request.url);
  const table = url.searchParams.get("table");

  if (!table) {
    return json({ error: "Missing table" }, { status: 400 });
  }

  if (request.method === "POST") {
    const tableData = await request.json() as any;

    if (!tableData) {
      return json({ success: false, error: "Missing table data" }, { status: 400 });
    }
    
    try {
      const columns = Object.keys(tableData).join(", ");
      const values = Object.values(tableData).map(value => 
        typeof value === 'string' ? `'${value}'` : value
      ).join(", ");
      
      const query = `INSERT INTO \`${table}\` (${columns}) VALUES (${values})`;
      await db.$executeRaw`${Prisma.raw(query)}`;
      
      return json({ success: true, message: "Record created successfully" });
    } catch (error: any) {
      console.error("Error creating record:", error);
      return json({ success: false, error: error.message }, { status: 500 });
    }
  }

  if (request.method === "PUT") {
    const tableData = await request.json() as any;

    if (!tableData || Object.keys(tableData).length === 0) {
      return json({ success: false, error: "Missing or empty table data" }, { status: 400 });
    }
    
    try {
      const firstEntry = Object.entries(tableData)[0];
      const id = firstEntry[0];  // The key of the first entry
      const primaryKey = firstEntry[1];  // The value of the first entry

      // Remove the id/primaryKey from tableData to avoid updating it
      const { [id]: _, ...dataToUpdate } = tableData;

      const setClause = Object.entries(dataToUpdate)
        .map(([key, value]) => `\`${key}\` = ${typeof value === 'string' ? `'${value}'` : value}`)
        .join(", ");
      
      const query = `UPDATE \`${table}\` SET ${setClause} WHERE \`${id}\` = '${primaryKey}'`;
      await db.$executeRaw`${Prisma.raw(query)}`;
      
      return json({ success: true, message: "Record updated successfully" });
    } catch (error: any) {
      console.error("Error updating record:", error);
      return json({ success: false, error: error.message }, { status: 500 });
    }
  }

  if (request.method === "DELETE") {
    const url = new URL(request.url);
    const table = url.searchParams.get("table");
    const { id, primaryKey } = await request.json() as any;

    if (!table || !id) {
      return json({ error: "Missing table or id" }, { status: 400 });
    }

    try {
      const query = `DELETE FROM \`${table}\` WHERE \`${id}\` = ${primaryKey}`;
      const result = await db.$queryRaw`${Prisma.raw(query)}`;

      if (Array.isArray(result) && result.length > 0) {
        return json({ success: true, deletedRecord: result[0] });
      } else {
        return json({ success: false, message: "No record found to delete" });
      }
    } catch (error: any) {
      console.error("Error executing delete query:", error);
      return json({ success: false, error: error.message });
    }
  }

  return json({ error: "Method not allowed" }, { status: 405 });
};