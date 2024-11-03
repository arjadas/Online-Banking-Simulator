import { LoaderFunction, json } from "@remix-run/cloudflare";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { getPrismaClient } from "../service/db.server";

export const loader: LoaderFunction = async ({ request, context }) => {
  const adminCheck = await adminMiddleware(request, context);
  if (adminCheck.status !== 200) return adminCheck;
  
  const url = new URL(request.url);
  const tableName = url.searchParams.get("table");

  if (!tableName) {
    return json({ error: "Table name is required" }, { status: 400 });
  }

  const db = getPrismaClient(context);

  try {
    // Use a dynamic query to get table information
    const tableInfo = await db.$queryRaw`
      SELECT 
        name AS column_name,
        type AS data_type,
        "notnull" AS is_nullable,
        pk AS is_primary_key
      FROM pragma_table_info(${tableName})
    `;

    if (!Array.isArray(tableInfo) || tableInfo.length === 0) {
      return json({ error: "Table not found or empty" }, { status: 404 });
    }

    const tableSchema = tableInfo.map((column: any) => ({
      name: column.column_name,
      type: mapSqliteTypeToJsType(column.data_type),
      isRequired: column.is_nullable === 0,
      isId: column.is_primary_key === 1,
    }));

    return json({ tableSchema });
  } catch (error) {
    console.error("Error fetching table schema:", error);
    return json({ error: "Failed to fetch table schema" }, { status: 500 });
  }
};

function mapSqliteTypeToJsType(sqliteType: string): string {
  const lowercaseType = sqliteType.toLowerCase();
  if (lowercaseType.includes('int')) return 'Int';
  if (lowercaseType.includes('float') || lowercaseType.includes('double') || lowercaseType.includes('real')) return 'Float';
  if (lowercaseType.includes('bool')) return 'Boolean';
  if (lowercaseType.includes('date') || lowercaseType.includes('time')) return 'DateTime';
  return 'String'; // default to string for text, varchar, etc.
}