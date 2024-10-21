import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { RemixServer, useLoaderData, Meta, Links, Outlet, ScrollRestoration, Scripts, useActionData, Form, useSearchParams, useSubmit, useNavigate, useFetcher, Link, useMatches } from '@remix-run/react';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import { CssBaseline, useToasts, Page, Card, Text, Spacer, Grid, Select, Button, Table, Modal, Input, Checkbox, Themes, GeistProvider, Image as Image$1, Tabs } from '@geist-ui/core';
import { createCookieSessionStorage, createWorkersKVSessionStorage, redirect, json } from '@remix-run/cloudflare';
import { Provider, useSelector } from 'react-redux';
import process from 'vite-plugin-node-polyfills/shims/process';
import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient, Prisma } from '@prisma/client';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from '@geist-ui/icons';
import { Image, Card as Card$1, Text as Text$1, Input as Input$1, Button as Button$1 } from '@geist-ui/react';
import { Database, LogOut } from '@geist-ui/react-icons';

async function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  const body = await renderToReadableStream(
    /* @__PURE__ */ jsx(RemixServer, { context: remixContext, url: request.url }),
    {
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      }
    }
  );
  if (isbot(request.headers.get("user-agent") || "")) {
    await body.allReady;
  }
  responseHeaders.set("Content-Type", "text/html");
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode
  });
}

const entryServer = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: 'Module' }));

let prisma = null;
function getPrismaClient(context) {
  if (!prisma) {
    const adapter = new PrismaD1(context.cloudflare.env.DB);
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}

function generateRandomAcc() {
  return Math.floor(1e8 + Math.random() * 9e8);
}
async function openAccount(context, data) {
  let acc = 0;
  new PrismaD1(context.cloudflare.env.DB);
  const db = getPrismaClient(context);
  let isUnique = false;
  while (!isUnique) {
    acc = generateRandomAcc();
    const existingAccount = await db.account.findUnique({
      where: { acc }
    });
    if (!existingAccount) {
      isUnique = true;
    }
  }
  return await db.account.create({
    data: {
      ...data,
      acc
    }
  });
}

async function createUser(context, uid, email, first_name, last_name) {
  try {
    const date = /* @__PURE__ */ new Date();
    const adapter = new PrismaD1(context.cloudflare.env.DB);
    const db = getPrismaClient(context);
    const user = await db.user.create({
      data: {
        uid,
        email,
        first_name,
        last_name,
        role: "student",
        font_preference: null,
        creation_timestamp: date,
        last_login: date
      }
    });
    await openAccount(context, {
      acc_name: `${first_name} ${last_name}`,
      uid,
      pay_id: email,
      short_description: "Simple Saver",
      long_description: "A simulated savings account.",
      balance: 1e5,
      opened_timestamp: date
    });
    await openAccount(context, {
      acc_name: `${first_name} ${last_name}`,
      uid,
      short_description: "Delightful Debit",
      long_description: "Associated with your emulated debit card.",
      balance: 1e5,
      opened_timestamp: date
    });
    await openAccount(context, {
      acc_name: `${first_name} ${last_name}`,
      uid,
      short_description: "Clever Credit",
      long_description: "Associated with your emulated credit card.",
      balance: 1e5,
      opened_timestamp: date
    });
    return user;
  } catch (error) {
    throw new Error(`Failed to create user ${error.message}`);
  }
}

function createSessionStorage(firebaseStorage) {
  const cookie = {
    name: "session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    // 1 week
    path: "/",
    sameSite: "lax",
    secrets: ["Y8o_wB4_3t3YLmqwjK8MEAIzaSyArgMsHrQipci"],
    secure: true
  };
  process.env.NODE_ENV === "development" ? createCookieSessionStorage({ cookie }) : createWorkersKVSessionStorage({
    kv: firebaseStorage,
    cookie
  });
  return createCookieSessionStorage({ cookie });
}
let sessionStorage;
function getSessionStorage(context) {
  if (!sessionStorage) {
    sessionStorage = createSessionStorage(context.cloudflare.env.firebase_storage);
  }
  return sessionStorage;
}
async function createUserSession(context, uid, email, bypassAdmin, redirectTo) {
  const db = getPrismaClient(context);
  let user = await db.user.findUnique({ where: { uid } });
  if (!user) {
    user = await createUser(context, uid, email, "Plan", "B");
  }
  if (user.role !== "administrator" && !bypassAdmin) {
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
      Location: redirectTo
    }
  });
}
async function getUserSession(context, request) {
  const { getSession } = getSessionStorage(context);
  const session = await getSession(request.headers.get("Cookie"));
  if (!session) {
    throw new Error("Cookie session not found.");
  }
  const uid = session.get("uid");
  const email = session.get("email");
  const role = session.get("role");
  const bypassAdmin = session.get("bypassAdmin");
  if (!uid || !email || !role || role !== "administrator" && !bypassAdmin) return null;
  return { uid, email, role, bypassAdmin };
}
async function logout(context, request) {
  const { getSession, destroySession } = getSessionStorage(context);
  const session = await getSession(request.headers.get("Cookie"));
  return new Response(null, {
    headers: {
      "Set-Cookie": await destroySession(session)
    }
  });
}

const initialState = {
  enabled: true,
  isDarkTheme: true,
  textScale: 100
};
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTextScale(state, action) {
      state.textScale = action.payload;
    },
    setEnabled(state, action) {
      state.enabled = action.payload;
    }
  }
});
appSlice.actions;
const appReducer = appSlice.reducer;

const store = configureStore({
  reducer: {
    app: appReducer
  }
});

const AuthContext = createContext(null);
function AuthProvider({ children, uid: initialuid }) {
  const [uid, setuid] = useState(initialuid);
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value: { uid, setuid }, children });
}
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

const loader$4 = async ({ request, context }) => {
  const user = await getUserSession(context, request);
  const url = new URL(request.url);
  if (url.pathname === "/") {
    if (user) {
      return redirect("/app/dashboard");
    } else {
      return redirect("/login");
    }
  }
  return json({ user });
};
function App() {
  const { user } = useLoaderData();
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsx("body", { children: /* @__PURE__ */ jsx(Provider, { store, children: /* @__PURE__ */ jsxs(AuthProvider, { uid: user?.uid, children: [
      /* @__PURE__ */ jsx(CssBaseline, {}),
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] }) }) })
  ] });
}

const route0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: App,
  loader: loader$4
}, Symbol.toStringTag, { value: 'Module' }));

async function adminMiddleware(request, context) {
  const userSession = await getUserSession(context, request);
  if (!userSession || userSession.role !== "administrator" && !userSession.bypassAdmin) {
    return new Response("Unauthorized. Administrator access required.", { status: 403 });
  }
  return new Response("Authorized", { status: 200 });
}

const loader$3 = async ({ request, context }) => {
  const adminCheck = await adminMiddleware(request, context);
  if (adminCheck.status !== 200) return adminCheck;
  const url = new URL(request.url);
  const tableName = url.searchParams.get("table");
  if (!tableName) {
    return json({ error: "Table name is required" }, { status: 400 });
  }
  const db = getPrismaClient(context);
  try {
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
    const tableSchema = tableInfo.map((column) => ({
      name: column.column_name,
      type: mapSqliteTypeToJsType(column.data_type),
      isRequired: column.is_nullable === 0,
      isId: column.is_primary_key === 1
    }));
    return json({ tableSchema });
  } catch (error) {
    console.error("Error fetching table schema:", error);
    return json({ error: "Failed to fetch table schema" }, { status: 500 });
  }
};
function mapSqliteTypeToJsType(sqliteType) {
  const lowercaseType = sqliteType.toLowerCase();
  if (lowercaseType.includes("int")) return "Int";
  if (lowercaseType.includes("float") || lowercaseType.includes("double") || lowercaseType.includes("real")) return "Float";
  if (lowercaseType.includes("bool")) return "Boolean";
  if (lowercaseType.includes("date") || lowercaseType.includes("time")) return "DateTime";
  return "String";
}

const route1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  loader: loader$3
}, Symbol.toStringTag, { value: 'Module' }));

const loader$2 = async ({ context, request }) => {
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
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching table data:", error);
    return new Response("Error fetching table data", { status: 500 });
  }
};
const action$4 = async ({ request, context }) => {
  const adminCheck = await adminMiddleware(request, context);
  if (adminCheck.status !== 200) return adminCheck;
  const db = getPrismaClient(context);
  const url = new URL(request.url);
  const table = url.searchParams.get("table");
  if (!table) {
    return json({ error: "Missing table" }, { status: 400 });
  }
  if (request.method === "POST") {
    const tableData = await request.json();
    if (!tableData) {
      return json({ success: false, error: "Missing table data" }, { status: 400 });
    }
    try {
      const columns = Object.keys(tableData).join(", ");
      const values = Object.values(tableData).map(
        (value) => typeof value === "string" ? `'${value}'` : value
      ).join(", ");
      const query = `INSERT INTO \`${table}\` (${columns}) VALUES (${values})`;
      await db.$executeRaw`${Prisma.raw(query)}`;
      return json({ success: true, message: "Record created successfully" });
    } catch (error) {
      console.error("Error creating record:", error);
      return json({ success: false, error: error.message }, { status: 500 });
    }
  }
  if (request.method === "PUT") {
    const tableData = await request.json();
    if (!tableData || Object.keys(tableData).length === 0) {
      return json({ success: false, error: "Missing or empty table data" }, { status: 400 });
    }
    try {
      const firstEntry = Object.entries(tableData)[0];
      const id = firstEntry[0];
      const primaryKey = firstEntry[1];
      const { [id]: _, ...dataToUpdate } = tableData;
      const setClause = Object.entries(dataToUpdate).map(([key, value]) => `\`${key}\` = ${typeof value === "string" ? `'${value}'` : value}`).join(", ");
      const query = `UPDATE \`${table}\` SET ${setClause} WHERE \`${id}\` = '${primaryKey}'`;
      await db.$executeRaw`${Prisma.raw(query)}`;
      return json({ success: true, message: "Record updated successfully" });
    } catch (error) {
      console.error("Error updating record:", error);
      return json({ success: false, error: error.message }, { status: 500 });
    }
  }
  if (request.method === "DELETE") {
    const url2 = new URL(request.url);
    const table2 = url2.searchParams.get("table");
    const { id, primaryKey } = await request.json();
    if (!table2 || !id) {
      return json({ error: "Missing table or id" }, { status: 400 });
    }
    try {
      const query = `DELETE FROM \`${table2}\` WHERE \`${id}\` = ${primaryKey}`;
      const result = await db.$queryRaw`${Prisma.raw(query)}`;
      if (Array.isArray(result) && result.length > 0) {
        return json({ success: true, deletedRecord: result[0] });
      } else {
        return json({ success: false, message: "No record found to delete" });
      }
    } catch (error) {
      console.error("Error executing delete query:", error);
      return json({ success: false, error: error.message });
    }
  }
  return json({ error: "Method not allowed" }, { status: 405 });
};

const route2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  action: action$4,
  loader: loader$2
}, Symbol.toStringTag, { value: 'Module' }));

const login = undefined;
const signup = undefined;
const sendResetPasswordEmail = undefined;
const resetPassword = undefined;
const signOutUser = undefined;

const action$3 = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  try {
    await sendResetPasswordEmail(email);
    return json({ success: "Password reset email sent!" });
  } catch (error) {
    return json({ error: error.message });
  }
};
function ForgotPassword() {
  const actionData = useActionData();
  const { isDarkTheme, textScale } = useSelector((state) => state.app);
  return /* @__PURE__ */ jsxs("div", { style: { backgroundColor: isDarkTheme ? "#111111" : "#EEEEEE" }, children: [
    /* @__PURE__ */ jsx("h1", { children: "Forgot Password" }),
    /* @__PURE__ */ jsxs(Form, { method: "post", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsx("input", { type: "email", name: "email", required: true })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "submit", children: "Send Password Reset Email" })
    ] }),
    actionData?.error && /* @__PURE__ */ jsx("p", { children: actionData.error }),
    actionData?.success && /* @__PURE__ */ jsx("p", { children: actionData.success })
  ] });
}

const route3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  action: action$3,
  default: ForgotPassword
}, Symbol.toStringTag, { value: 'Module' }));

const loader$1 = async ({ context, request }) => {
  const user = await getUserSession(context, request);
  const db = getPrismaClient(context);
  const tables1 = await db.$queryRaw`
		SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'
	`;
  const tables = tables1.map((table) => table.name);
  return { tables, user };
};
function Dashboard() {
  const { tables, user } = useLoaderData();
  const [selectedTable, setSelectedTable] = useState("Account");
  const [tableSchema, setTableSchema] = useState([]);
  const [tableData, setTableData] = useState(void 0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [formData, setFormData] = useState({});
  const [dataVisible, setDataVisible] = useState(true);
  useSelector((state) => state.app);
  const [sortConfig, setSortConfig] = useState({});
  const { setToast, removeAll } = useToasts();
  const fetchTableData = async (tableName) => {
    try {
      const tableSchemaResponse = await fetch(`/api/table-schema?table=${tableName}`);
      const tableDataResponse = await fetch(`/api/table-data?table=${tableName}`);
      const { tableSchema: tableSchema2 } = await tableSchemaResponse.json();
      const newData = await tableDataResponse.json();
      const sortConfig2 = {};
      for (const field of tableSchema2) {
        sortConfig2[field.name] = "desc";
      }
      setSortConfig(sortConfig2);
      setTableData(newData ?? []);
      setTableSchema(tableSchema2);
    } catch (error) {
      console.error("Error fetching table data:", error);
      setToast({ text: "Error fetching table data", type: "error" });
    }
  };
  const handleTableSelect = (table) => {
    setDataVisible(false);
    setSelectedTable(table);
    setTableData(void 0);
  };
  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable).then(() => {
        setTimeout(() => {
          setDataVisible(true);
        }, 50);
      });
    }
  }, [selectedTable]);
  const tableStyle = {
    opacity: dataVisible ? 1 : 0,
    transition: "opacity 0.3s ease-in-out",
    transform: dataVisible ? "scale(1)" : "scale(0.92)",
    transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)"
  };
  const handleCreateClick = () => {
    setModalMode("create");
    setFormData({});
    setModalVisible(true);
  };
  const handleEditClick = (row) => {
    setFormData(row);
    setModalMode("edit");
    setModalVisible(true);
  };
  const handleDeleteClick = async (row) => {
    if (!window.confirm(`Are you sure you want to delete this record?`)) {
      return;
    }
    try {
      const primary = Object.entries(row)[0];
      const response = await (await fetch(`/api/table-data?table=${selectedTable}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: primary[0], primaryKey: primary[1] })
      })).json();
      if (!response.success) {
        removeAll();
        setToast({ text: "Please delete all dependent rows first.", type: "error" });
        return;
      }
      await fetchTableData(selectedTable);
      setToast({ text: "Record deleted successfully", type: "success" });
    } catch (error) {
      setToast({ text: "Error deleting row!", type: "error" });
    }
  };
  const handleModalClose = () => {
    setModalVisible(false);
  };
  const handleFormSubmit = async () => {
    try {
      const method = modalMode === "create" ? "POST" : "PUT";
      const response = await fetch(`/api/table-data?table=${selectedTable}`, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const { success, error } = await response.json();
      if (success) {
        setToast({ text: `Record ${modalMode === "create" ? "created" : "updated"} successfully`, type: "success" });
        await fetchTableData(selectedTable);
      } else {
        setToast({ text: error || "An error occurred", type: "error" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setToast({ text: "An error occurred while submitting the form", type: "error" });
    }
    setModalVisible(false);
    setFormData({});
  };
  const renderForm = () => {
    if (!formData || !selectedTable || !tableSchema) return null;
    return tableSchema.map((field) => {
      let inputType = "text";
      let inputValue = formData[field.name] || "";
      switch (field.type) {
        case "Int":
        case "Float":
          inputType = "number";
          break;
        case "Boolean":
          inputType = "checkbox";
          break;
        case "DateTime":
          inputType = "datetime-local";
          if (inputValue) {
            const date = new Date(inputValue);
            inputValue = date.toISOString().slice(0, 16);
          }
          break;
      }
      return /* @__PURE__ */ jsx(
        Input,
        {
          label: field.name,
          htmlType: inputType,
          value: inputValue,
          onChange: (e) => {
            let newValue = e.target.value;
            if (inputType === "datetime-local") {
              newValue = new Date(newValue).toISOString();
            }
            setFormData({ ...formData, [field.name]: newValue });
          },
          disabled: modalMode === "edit" && field.isId,
          required: field.isRequired,
          crossOrigin: void 0,
          onPointerEnterCapture: void 0,
          onPointerLeaveCapture: void 0
        },
        field.name
      );
    });
  };
  const handleSort = (key) => {
    if (tableData) {
      let direction = sortConfig[key];
      if (direction == "asc") {
        direction = "desc";
      } else {
        direction = "asc";
      }
      sortConfig[key] = direction;
      const sortedData = [...tableData].sort((a, b) => {
        if (a[key] < b[key]) return direction === "asc" ? 1 : -1;
        if (a[key] > b[key]) return direction === "asc" ? -1 : 1;
        return 0;
      });
      setTableData(sortedData);
      setSortConfig(sortConfig);
    }
  };
  return /* @__PURE__ */ jsx(Page.Header, { center: true, style: { margin: 0, padding: 30, width: "100vw" }, children: /* @__PURE__ */ jsxs(Card, { width: "100%", padding: 2, style: {
    maxWidth: "95%",
    display: "flex",
    flexDirection: "column"
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: { flex: "0 0 auto" }, children: [
      /* @__PURE__ */ jsx(Text, { h2: true, children: "Admin Console" }),
      /* @__PURE__ */ jsx(Spacer, { h: 1 }),
      /* @__PURE__ */ jsxs(Grid.Container, { gap: 2, justify: "space-between", alignItems: "center", children: [
        /* @__PURE__ */ jsx(Grid, { xs: 18, sm: 20, children: /* @__PURE__ */ jsx(
          Select,
          {
            placeholder: "Select a table",
            value: selectedTable,
            onChange: (value) => handleTableSelect(value),
            width: "25%",
            onPointerEnterCapture: void 0,
            onPointerLeaveCapture: void 0,
            children: tables.map((table) => table != "_cf_KV" && /* @__PURE__ */ jsx(Select.Option, { value: table, children: table }, table))
          }
        ) }),
        /* @__PURE__ */ jsx(Grid, { xs: 6, sm: 4, justify: "flex-end", children: /* @__PURE__ */ jsx(
          Button,
          {
            auto: true,
            scale: 1,
            icon: /* @__PURE__ */ jsx(Plus, {}),
            onClick: handleCreateClick,
            disabled: !selectedTable,
            placeholder: void 0,
            onPointerEnterCapture: void 0,
            onPointerLeaveCapture: void 0,
            children: "Create"
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: {
      flex: "1 1 auto",
      overflowY: "auto",
      marginTop: 20,
      paddingBottom: 100
    }, children: /* @__PURE__ */ jsx(Grid, { xs: 24, children: selectedTable && tableData ? /* @__PURE__ */ jsxs(Table, { data: tableData, style: tableStyle, children: [
      /* @__PURE__ */ jsx(
        Table.Column,
        {
          prop: "actions",
          label: "Actions",
          width: 150,
          render: (value, rowData, rowIndex) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "5px" }, children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                auto: true,
                scale: 4 / 5,
                icon: /* @__PURE__ */ jsx(Edit, {}),
                onClick: () => handleEditClick(rowData),
                placeholder: void 0,
                onPointerEnterCapture: void 0,
                onPointerLeaveCapture: void 0
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                auto: true,
                scale: 4 / 5,
                icon: /* @__PURE__ */ jsx(Trash2, {}),
                type: "error",
                onClick: () => handleDeleteClick(rowData),
                placeholder: void 0,
                onPointerEnterCapture: void 0,
                onPointerLeaveCapture: void 0
              }
            )
          ] })
        }
      ),
      tableSchema.map((field) => {
        return /* @__PURE__ */ jsx(Table.Column, { prop: field.name, label: field.name.replace("_", " "), children: /* @__PURE__ */ jsxs(Grid.Container, { direction: "row", justify: "space-between", alignItems: "center", style: { paddingRight: 20 }, children: [
          /* @__PURE__ */ jsx(Grid, { xs: 1, children: /* @__PURE__ */ jsx(Text, { style: { whiteSpace: "nowrap", paddingRight: 20 }, children: field.name.replace("_", " ") }) }),
          /* @__PURE__ */ jsx(Grid, { xs: 2, children: /* @__PURE__ */ jsx(
            Button,
            {
              auto: true,
              scale: 1,
              icon: sortConfig[field.name] == "asc" ? /* @__PURE__ */ jsx(ArrowUp, {}) : /* @__PURE__ */ jsx(ArrowDown, {}),
              onClick: () => handleSort(field.name),
              style: { border: "none", padding: 2, margin: 5 },
              placeholder: void 0,
              onPointerEnterCapture: void 0,
              onPointerLeaveCapture: void 0
            }
          ) })
        ] }) }, field.name);
      })
    ] }, selectedTable) : /* @__PURE__ */ jsx(Fragment, {}) }) }),
    /* @__PURE__ */ jsxs(Modal, { visible: modalVisible, onClose: handleModalClose, children: [
      /* @__PURE__ */ jsxs(Modal.Title, { children: [
        modalMode === "create" ? "Create" : "Edit",
        " Record"
      ] }),
      /* @__PURE__ */ jsx(Modal.Content, { children: renderForm() }),
      /* @__PURE__ */ jsx(Modal.Action, { passive: true, onClick: handleModalClose, placeholder: void 0, onPointerEnterCapture: void 0, onPointerLeaveCapture: void 0, children: "Cancel" }),
      /* @__PURE__ */ jsx(Modal.Action, { onClick: handleFormSubmit, placeholder: void 0, onPointerEnterCapture: void 0, onPointerLeaveCapture: void 0, children: "Submit" })
    ] })
  ] }) });
}

const route4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: Dashboard,
  loader: loader$1
}, Symbol.toStringTag, { value: 'Module' }));

const action$2 = async ({ request }) => {
  return redirect("/login");
};
function ResetPassword() {
  const actionData = useActionData();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const { isDarkTheme, textScale } = useSelector((state) => state.app);
  const [clientError, setClientError] = useState(null);
  const submit = useSubmit();
  if (!oobCode) {
    return /* @__PURE__ */ jsx("p", { children: "Invalid reset password link." });
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newPassword = formData.get("password");
    try {
      await resetPassword(oobCode, newPassword);
      submit(formData, { method: "post", action: form.action });
    } catch (error) {
      setClientError(error.message);
    }
  };
  return /* @__PURE__ */ jsxs("div", { style: {
    backgroundColor: isDarkTheme ? "#111111" : "#EEEEEE"
  }, children: [
    /* @__PURE__ */ jsx("h1", { children: "Reset Password" }),
    /* @__PURE__ */ jsxs(Form, { method: "post", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsx("input", { type: "hidden", name: "oobCode", value: oobCode }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "password", children: "New Password" }),
        /* @__PURE__ */ jsx("input", { type: "password", name: "password", required: true })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "submit", children: "Reset Password" })
    ] }),
    clientError && /* @__PURE__ */ jsx("p", { children: clientError }),
    actionData?.error && /* @__PURE__ */ jsx("p", { children: actionData.error })
  ] });
}

const route5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  action: action$2,
  default: ResetPassword
}, Symbol.toStringTag, { value: 'Module' }));

const loader = async ({ request, context }) => {
  return logout(context, request);
};
function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOutUser();
        localStorage.removeItem("uid");
        navigate("/login", { replace: true });
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };
    performLogout();
  }, [navigate]);
  return null;
}

const route6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: Logout,
  loader
}, Symbol.toStringTag, { value: 'Module' }));

function AuthenticatedLink(props) {
  useAuth();
  useFetcher();
  return /* @__PURE__ */ jsx(Link, { ...props });
}

const action$1 = async ({ context, request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const first_name = formData.get("first_name");
  const last_name = formData.get("last_name");
  const uid = formData.get("uid");
  try {
    await createUser(context, uid, email, first_name, last_name);
    return await createUserSession(context, uid, email, "/app/dashboard");
  } catch (error) {
    return json({ error: error.message, context: context.cloudflare.env.firebase_storage });
  }
};
function Signup() {
  const actionData = useActionData();
  const submit = useSubmit();
  const [clientError, setClientError] = useState(null);
  const { isDarkTheme, textScale } = useSelector((state) => state.app);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (actionData?.error) {
      setClientError(JSON.stringify(actionData));
    }
  }, [actionData]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setLoading(true);
    try {
      const user = await signup(
        formData.get("email"),
        formData.get("password")
      );
      formData.append("uid", user.uid);
      submit(formData, { method: "post", action: "/signup" });
    } catch (error) {
      setClientError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: isDarkTheme ? "#111111" : "#EEEEEE"
  }, children: [
    /* @__PURE__ */ jsx(Image, { width: "400px", style: { textAlign: "center", paddingBottom: 30 }, src: "logo.png" }),
    /* @__PURE__ */ jsxs(Card$1, { width: "400px", children: [
      /* @__PURE__ */ jsx(Text$1, { h3: true, style: { textAlign: "center" }, children: "Sign Up" }),
      /* @__PURE__ */ jsxs(Form, { method: "post", onSubmit: handleSubmit, style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
        /* @__PURE__ */ jsx(Input$1, { name: "first_name", placeholder: "First Name", required: true, width: "100%", crossOrigin: void 0, onPointerEnterCapture: void 0, onPointerLeaveCapture: void 0 }),
        /* @__PURE__ */ jsx(Input$1, { name: "last_name", placeholder: "Last Name", required: true, width: "100%", crossOrigin: void 0, onPointerEnterCapture: void 0, onPointerLeaveCapture: void 0 }),
        /* @__PURE__ */ jsx(Input$1, { name: "email", htmlType: "email", clearable: true, placeholder: "Email", required: true, width: "100%", crossOrigin: void 0, onPointerEnterCapture: void 0, onPointerLeaveCapture: void 0 }),
        /* @__PURE__ */ jsx(Input$1.Password, { name: "password", clearable: true, placeholder: "Password", required: true, width: "100%" }),
        /* @__PURE__ */ jsx(
          Button$1,
          {
            htmlType: "submit",
            type: "secondary",
            loading,
            disabled: loading,
            placeholder: void 0,
            onPointerEnterCapture: void 0,
            onPointerLeaveCapture: void 0,
            children: "Sign up"
          }
        )
      ] }),
      clientError && /* @__PURE__ */ jsx(Text$1, { type: "error", style: { marginTop: 10 }, children: clientError }),
      /* @__PURE__ */ jsx(AuthenticatedLink, { to: "/login", prefetch: "render", children: /* @__PURE__ */ jsx(Text$1, { p: true, children: "Go back" }) })
    ] })
  ] });
}

const route7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: Signup
}, Symbol.toStringTag, { value: 'Module' }));

const action = async ({ request, context }) => {
  const formData = await request.formData();
  const uid = formData.get("uid");
  const email = formData.get("email");
  const bypassAdmin = Boolean(formData.get("bypassAdmin"));
  try {
    const userSession = await createUserSession(context, uid, email, bypassAdmin, "/");
    return userSession;
  } catch (error) {
    return json({ error: error.message });
  }
};
function Login() {
  const actionData = useActionData();
  const submit = useSubmit();
  const [clientError, setClientError] = useState(null);
  const { isDarkTheme, textScale } = useSelector((state) => state.app);
  const [loading, setLoading] = useState(false);
  const [bypassAdmin, setBypassAdmin] = useState(false);
  const handleCheckboxChange = (e) => {
    setBypassAdmin(e.target.checked);
  };
  useEffect(() => {
    if (actionData?.error) {
      setClientError(actionData.error);
    }
  }, [actionData]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    let uid;
    setLoading(true);
    try {
      const user = await login(
        formData.get("email"),
        formData.get("password")
      );
      formData.append("uid", user.uid);
      uid = user.uid;
      submit(formData, { method: "post", action: "/login" });
    } catch (error) {
      setClientError(error.message);
    } finally {
      if (uid) {
        localStorage.setItem("uid", uid);
      }
    }
    setLoading(false);
  };
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: isDarkTheme ? "#111111" : "#EEEEEE"
  }, children: [
    /* @__PURE__ */ jsx(Image, { width: "400px", style: { textAlign: "center", paddingBottom: 30 }, src: "logo.png" }),
    /* @__PURE__ */ jsxs(Card$1, { width: "400px", style: { padding: 10 }, children: [
      /* @__PURE__ */ jsxs(Form, { method: "post", onSubmit: handleSubmit, style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
        /* @__PURE__ */ jsx(Input$1, { name: "email", htmlType: "email", clearable: true, placeholder: "Email", required: true, width: "100%", crossOrigin: void 0, onPointerEnterCapture: void 0, onPointerLeaveCapture: void 0 }),
        /* @__PURE__ */ jsx(Input$1.Password, { name: "password", clearable: true, placeholder: "Password", required: true, width: "100%" }),
        /* @__PURE__ */ jsx(
          Button$1,
          {
            htmlType: "submit",
            type: "secondary",
            loading,
            disabled: loading,
            placeholder: void 0,
            onPointerEnterCapture: void 0,
            onPointerLeaveCapture: void 0,
            children: "Log in"
          }
        ),
        /* @__PURE__ */ jsx(Checkbox, { checked: bypassAdmin, onChange: handleCheckboxChange, children: "Bypass Admin check" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "hidden",
            name: "bypassAdmin",
            value: Number(bypassAdmin)
          }
        )
      ] }),
      clientError && /* @__PURE__ */ jsx(Text$1, { style: { marginTop: 10 }, type: "error", children: clientError })
    ] })
  ] });
}

const route8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  action,
  default: Login
}, Symbol.toStringTag, { value: 'Module' }));

const meta = () => {
  return [
    { title: "Learn to Bank" },
    { name: "description", content: "Get a grasp on Australia's current online banking systems." }
  ];
};
const navItems = [
  { icon: /* @__PURE__ */ jsx(Database, {}), label: "Database", to: "/app/dashboard" },
  { icon: /* @__PURE__ */ jsx(LogOut, {}), label: "Logout", to: "/logout" }
];
function AppLayout() {
  const { isDarkTheme, textScale } = useSelector((state) => state.app);
  const lightTheme = Themes.createFromLight({ type: "light1", palette: { success: "#009dff" } });
  const darkTheme = Themes.createFromDark({ type: "dark1", palette: { background: "#111111", success: "#009dff" } });
  const matches = useMatches();
  const navigate = useNavigate();
  const currentPath = matches[matches.length - 1]?.pathname || "/";
  const initialValue = navItems.findIndex((item) => item.to === currentPath);
  const handleTabChange = (value) => {
    const newPath = navItems[parseInt(value)].to;
    navigate(newPath);
  };
  return /* @__PURE__ */ jsx(GeistProvider, { themes: [lightTheme, darkTheme], themeType: isDarkTheme ? "dark1" : "light1", children: /* @__PURE__ */ jsx("div", { style: { backgroundColor: isDarkTheme ? "#111111" : "#EEEEEE" }, children: /* @__PURE__ */ jsxs(Page, { style: {
    margin: 0,
    padding: 0
  }, children: [
    /* @__PURE__ */ jsx(Page.Header, { style: { padding: 20, marginLeft: 50 }, children: /* @__PURE__ */ jsxs(Grid.Container, { gap: 0, justify: "space-between", alignItems: "center", children: [
      /* @__PURE__ */ jsx(Grid, { children: /* @__PURE__ */ jsx(Image$1, { height: "150px", src: "/logo.png" }) }),
      /* @__PURE__ */ jsx(Grid, { children: /* @__PURE__ */ jsx(Card, { padding: 0.5, style: { transform: `scale(${textScale / 100})`, transformOrigin: "top right" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
        /* @__PURE__ */ jsx(
          Tabs,
          {
            initialValue: initialValue.toString(),
            align: "left",
            onChange: handleTabChange,
            style: { margin: 10 },
            children: navItems.map((item, index) => /* @__PURE__ */ jsx(
              Tabs.Item,
              {
                label: /* @__PURE__ */ jsxs(Link, { to: item.to, prefetch: "intent", style: {
                  display: "flex",
                  alignItems: "center",
                  color: "inherit",
                  textDecoration: "none",
                  flexDirection: "row",
                  justifyContent: "center"
                }, children: [
                  React.cloneElement(item.icon, { size: 24, color: "white" }),
                  /* @__PURE__ */ jsx("span", { style: { color: "white" }, children: item.label })
                ] }),
                value: index.toString()
              },
              index
            ))
          }
        ),
        /* @__PURE__ */ jsx(Spacer, { h: 1 })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ jsx(Outlet, {})
  ] }) }) });
}

const route9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: AppLayout,
  meta
}, Symbol.toStringTag, { value: 'Module' }));

const serverManifest = {'entry':{'module':'/assets/entry.client-_ZWWQcHd.js','imports':['/assets/components-DFwy_9i9.js','/assets/index-0S-qV3JN.js'],'css':[]},'routes':{'root':{'id':'root','parentId':undefined,'path':'','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/root-BxuGXJtt.js','imports':['/assets/components-DFwy_9i9.js','/assets/index-0S-qV3JN.js','/assets/react-redux-DXguuJTG.js','/assets/index-BAMY2Nnw.js','/assets/AuthProvider-Dw_L9iKa.js','/assets/theme-context-CcoKXvH-.js','/assets/typeof-B60zgk5r.js'],'css':['/assets/root-BM1Dbbue.css']},'routes/api.table-schema':{'id':'routes/api.table-schema','parentId':'root','path':'api/table-schema','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/api.table-schema-l0sNRNKZ.js','imports':[],'css':[]},'routes/api.table-data':{'id':'routes/api.table-data','parentId':'root','path':'api/table-data','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/api.table-data-l0sNRNKZ.js','imports':[],'css':[]},'routes/forgotPassword':{'id':'routes/forgotPassword','parentId':'root','path':'forgotPassword','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/forgotPassword-Dz3_bHEL.js','imports':['/assets/components-DFwy_9i9.js','/assets/react-redux-DXguuJTG.js','/assets/index-0S-qV3JN.js'],'css':[]},'routes/app.dashboard':{'id':'routes/app.dashboard','parentId':'routes/app','path':'dashboard','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/app.dashboard-Dt92tnAF.js','imports':['/assets/components-DFwy_9i9.js','/assets/objectWithoutProperties-CV2JPPVT.js','/assets/index-0S-qV3JN.js','/assets/react-redux-DXguuJTG.js','/assets/toConsumableArray-DJs6E_7V.js','/assets/typeof-B60zgk5r.js','/assets/with-scale-g-RujToA.js','/assets/theme-context-CcoKXvH-.js','/assets/use-warning-CmidpVcS.js','/assets/index-BAMY2Nnw.js'],'css':[]},'routes/resetPassword':{'id':'routes/resetPassword','parentId':'root','path':'resetPassword','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/resetPassword-ClDTwzGt.js','imports':['/assets/components-DFwy_9i9.js','/assets/auth.client-BVBRz5GD.js','/assets/index-0S-qV3JN.js','/assets/react-redux-DXguuJTG.js','/assets/index-BAMY2Nnw.js'],'css':[]},'routes/logout':{'id':'routes/logout','parentId':'root','path':'logout','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/logout-BFyCyn6y.js','imports':['/assets/index-0S-qV3JN.js','/assets/auth.client-BVBRz5GD.js','/assets/index-BAMY2Nnw.js'],'css':[]},'routes/signup':{'id':'routes/signup','parentId':'root','path':'signup','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/signup-CNOenEPT.js','imports':['/assets/components-DFwy_9i9.js','/assets/css-baseline-DmMfzFRa.js','/assets/index-0S-qV3JN.js','/assets/react-redux-DXguuJTG.js','/assets/auth.client-BVBRz5GD.js','/assets/AuthProvider-Dw_L9iKa.js','/assets/typeof-B60zgk5r.js','/assets/toConsumableArray-DJs6E_7V.js','/assets/index-BAMY2Nnw.js'],'css':[]},'routes/login':{'id':'routes/login','parentId':'root','path':'login','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/login-wbI1szWp.js','imports':['/assets/components-DFwy_9i9.js','/assets/css-baseline-DmMfzFRa.js','/assets/index-0S-qV3JN.js','/assets/react-redux-DXguuJTG.js','/assets/auth.client-BVBRz5GD.js','/assets/typeof-B60zgk5r.js','/assets/toConsumableArray-DJs6E_7V.js','/assets/theme-context-CcoKXvH-.js','/assets/use-warning-CmidpVcS.js','/assets/with-scale-g-RujToA.js','/assets/index-BAMY2Nnw.js'],'css':[]},'routes/app':{'id':'routes/app','parentId':'root','path':'app','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/app-CDk2Q2N9.js','imports':['/assets/components-DFwy_9i9.js','/assets/objectWithoutProperties-CV2JPPVT.js','/assets/index-0S-qV3JN.js','/assets/react-redux-DXguuJTG.js','/assets/theme-context-CcoKXvH-.js','/assets/toConsumableArray-DJs6E_7V.js','/assets/typeof-B60zgk5r.js','/assets/with-scale-g-RujToA.js','/assets/index-BAMY2Nnw.js'],'css':[]}},'url':'/assets/manifest-c82dbf54.js','version':'c82dbf54'};

/**
       * `mode` is only relevant for the old Remix compiler but
       * is included here to satisfy the `ServerBuild` typings.
       */
      const mode = "production";
      const assetsBuildDirectory = "build\\client";
      const basename = "/";
      const future = {"v3_fetcherPersist":true,"v3_relativeSplatPath":true,"v3_throwAbortReason":true,"unstable_singleFetch":false,"unstable_lazyRouteDiscovery":false,"unstable_optimizeDeps":false};
      const isSpaMode = false;
      const publicPath = "/";
      const entry = { module: entryServer };
      const routes = {
        "root": {
          id: "root",
          parentId: undefined,
          path: "",
          index: undefined,
          caseSensitive: undefined,
          module: route0
        },
  "routes/api.table-schema": {
          id: "routes/api.table-schema",
          parentId: "root",
          path: "api/table-schema",
          index: undefined,
          caseSensitive: undefined,
          module: route1
        },
  "routes/api.table-data": {
          id: "routes/api.table-data",
          parentId: "root",
          path: "api/table-data",
          index: undefined,
          caseSensitive: undefined,
          module: route2
        },
  "routes/forgotPassword": {
          id: "routes/forgotPassword",
          parentId: "root",
          path: "forgotPassword",
          index: undefined,
          caseSensitive: undefined,
          module: route3
        },
  "routes/app.dashboard": {
          id: "routes/app.dashboard",
          parentId: "routes/app",
          path: "dashboard",
          index: undefined,
          caseSensitive: undefined,
          module: route4
        },
  "routes/resetPassword": {
          id: "routes/resetPassword",
          parentId: "root",
          path: "resetPassword",
          index: undefined,
          caseSensitive: undefined,
          module: route5
        },
  "routes/logout": {
          id: "routes/logout",
          parentId: "root",
          path: "logout",
          index: undefined,
          caseSensitive: undefined,
          module: route6
        },
  "routes/signup": {
          id: "routes/signup",
          parentId: "root",
          path: "signup",
          index: undefined,
          caseSensitive: undefined,
          module: route7
        },
  "routes/login": {
          id: "routes/login",
          parentId: "root",
          path: "login",
          index: undefined,
          caseSensitive: undefined,
          module: route8
        },
  "routes/app": {
          id: "routes/app",
          parentId: "root",
          path: "app",
          index: undefined,
          caseSensitive: undefined,
          module: route9
        }
      };

export { serverManifest as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, mode, publicPath, routes };
