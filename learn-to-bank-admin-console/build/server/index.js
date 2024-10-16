import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { RemixServer, useLoaderData, Meta, Links, Outlet, ScrollRestoration, Scripts, useActionData, Form, useSearchParams, useSubmit, useNavigate, useFetcher, Link, useMatches } from '@remix-run/react';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import { CssBaseline, Themes, GeistProvider, useToasts, Page, Card, Text, Spacer, Grid, Select, Button, Table, Modal, Input, Image as Image$1, Tabs } from '@geist-ui/core';
import { createWorkersKVSessionStorage, redirect, json } from '@remix-run/cloudflare';
import { Provider, useSelector } from 'react-redux';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { Plus, Edit, Trash2 } from '@geist-ui/icons';
import { Image, Card as Card$1, Text as Text$1, Input as Input$1, Button as Button$1 } from '@geist-ui/react';
import { Database, LogOut } from '@geist-ui/react-icons';

async function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  console.log("Request URL:", request.url);
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

function createSessionStorage(firebaseStorage) {
  return createWorkersKVSessionStorage({
    kv: firebaseStorage,
    cookie: {
      name: "session",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      // 1 week
      path: "/",
      sameSite: "lax",
      secrets: ["Y8o_wB4_3t3YLmqwjK8MEAIzaSyArgMsHrQipci"],
      secure: true
    }
  });
}
let sessionStorage;
function getSessionStorage(context) {
  if (!sessionStorage) {
    sessionStorage = createSessionStorage(context.cloudflare.env.firebase_storage);
  }
  return sessionStorage;
}
async function createUserSession(context, uid, email, redirectTo) {
  const { getSession, commitSession } = getSessionStorage(context);
  const session = await getSession();
  session.set("uid", uid);
  session.set("email", email);
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
  if (!session) return null;
  const uid = session.get("uid");
  const email = session.get("email");
  if (!uid || !email) return null;
  return { uid, email };
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

const loader$3 = async ({ request, context }) => {
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
  loader: loader$3
}, Symbol.toStringTag, { value: 'Module' }));

let prisma = null;
function getPrismaClient(context) {
  if (!prisma) {
    const adapter = new PrismaD1(context.cloudflare.env.DB);
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}

const loader$2 = async ({ context, request }) => {
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
  const db = getPrismaClient(context);
  if (request.method === "DELETE") {
    const url = new URL(request.url);
    const table = url.searchParams.get("table");
    const { id, primaryKey } = await request.json();
    if (!table || !id) {
      return json({ error: "Missing table or id" }, { status: 400 });
    }
    try {
      const query = `DELETE FROM \`${table}\` WHERE \`${id}\` = ${primaryKey}`;
      console.log(query);
      const result = await db.$queryRaw`${Prisma.raw(query)}`;
      if (Array.isArray(result) && result.length > 0) {
        return json({ success: true, deletedRecord: result[0] });
      } else {
        return json({ success: false, message: "No record found to delete" });
      }
    } catch (error) {
      console.error("Error executing dele3te query:", error);
      return json({ success: false, error: error.message });
    }
  }
  return json({ error: "Method not allowed" }, { status: 405 });
};

const route1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
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
  const lightTheme = Themes.createFromLight({ type: "light1", palette: { success: "#009dff" } });
  const darkTheme = Themes.createFromDark({ type: "dark1", palette: { background: "#111111", success: "#009dff" } });
  return /* @__PURE__ */ jsxs(GeistProvider, { themes: [lightTheme, darkTheme], themeType: isDarkTheme ? "dark1" : "light1", children: [
    /* @__PURE__ */ jsx(CssBaseline, {}),
    /* @__PURE__ */ jsxs("div", { style: { backgroundColor: isDarkTheme ? "#111111" : "#EEEEEE" }, children: [
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
    ] })
  ] });
}

const route2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
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
  const [tableData, setTableData] = useState(void 0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [formData, setFormData] = useState({});
  const [dataVisible, setDataVisible] = useState(true);
  useSelector((state) => state.app);
  const { setToast, removeAll } = useToasts();
  const fetchTableData = async (tableName) => {
    try {
      const response = await fetch(`/api/table-data?table=${tableName}`);
      const newData = await response.json();
      setTableData(newData);
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
    if (modalMode === "create") {
      console.log("Create new record:", formData);
      ({ ...formData, id: Date.now() });
      fetchTableData(selectedTable);
      setToast({ text: "Record created successfully", type: "success" });
    } else {
      console.log("Update record:", formData);
      fetchTableData(selectedTable);
      setToast({ text: "Record updated successfully", type: "success" });
    }
    setModalVisible(false);
    setFormData({});
  };
  const renderForm = () => {
    if (!formData || !selectedTable || !tableData || tableData.length == 0) return null;
    return Object.keys(tableData[0]).map((key) => /* @__PURE__ */ jsx(
      Input,
      {
        label: key,
        value: formData?.[key] || "",
        onChange: (e) => setFormData({ ...formData, [key]: e.target.value }),
        onPointerEnterCapture: void 0,
        onPointerLeaveCapture: void 0,
        crossOrigin: void 0
      },
      key
    ));
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
            children: tables.map((table) => /* @__PURE__ */ jsx(Select.Option, { value: table, children: table }, table))
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
    }, children: /* @__PURE__ */ jsx(Grid, { xs: 24, children: selectedTable && tableData && tableData?.length > 0 ? /* @__PURE__ */ jsxs(Table, { data: tableData, style: tableStyle, children: [
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
      Object.keys(tableData[0]).map((key) => /* @__PURE__ */ jsx(Table.Column, { prop: key, label: key }, key))
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

const route3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
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
  const lightTheme = Themes.createFromLight({ type: "light1", palette: { success: "#009dff" } });
  const darkTheme = Themes.createFromDark({ type: "dark1", palette: { background: "#111111", success: "#009dff" } });
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
  return /* @__PURE__ */ jsx(GeistProvider, { themes: [lightTheme, darkTheme], themeType: isDarkTheme ? "dark1" : "light1", children: /* @__PURE__ */ jsxs("div", { style: {
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
  ] }) });
}

const route4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
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

const route5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: Logout,
  loader
}, Symbol.toStringTag, { value: 'Module' }));

function AuthenticatedLink(props) {
  useAuth();
  useFetcher();
  return /* @__PURE__ */ jsx(Link, { ...props, prefetch: "render" });
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
  const lightTheme = Themes.createFromLight({ type: "light1", palette: { success: "#009dff" } });
  const darkTheme = Themes.createFromDark({ type: "dark1", palette: { background: "#111111", success: "#009dff" } });
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
  return /* @__PURE__ */ jsx(GeistProvider, { themes: [lightTheme, darkTheme], themeType: isDarkTheme ? "dark1" : "light1", children: /* @__PURE__ */ jsxs("div", { style: {
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
  ] }) });
}

const route6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: Signup
}, Symbol.toStringTag, { value: 'Module' }));

const action = async ({ request, context }) => {
  const formData = await request.formData();
  const uid = formData.get("uid");
  const email = formData.get("email");
  try {
    return await createUserSession(context, uid, email, "/");
  } catch (error) {
    return json({ error: error.toString() + "adsasd" });
  }
};
function Login() {
  const actionData = useActionData();
  const [clientError, setClientError] = useState(null);
  const { isDarkTheme, textScale } = useSelector((state) => state.app);
  const lightTheme = Themes.createFromLight({ type: "light1", palette: { success: "#009dff" } });
  const darkTheme = Themes.createFromDark({ type: "dark1", palette: { background: "#111111", success: "#009dff" } });
  const [loading, setLoading] = useState(false);
  const submit = useSubmit();
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
  return /* @__PURE__ */ jsx(GeistProvider, { themes: [lightTheme, darkTheme], themeType: isDarkTheme ? "dark1" : "light1", children: /* @__PURE__ */ jsxs("div", { style: {
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
        )
      ] }),
      clientError && /* @__PURE__ */ jsx(Text$1, { style: { marginTop: 10 }, type: "error", children: clientError }),
      /* @__PURE__ */ jsxs(Text$1, { p: true, children: [
        "Don't have an account? ",
        /* @__PURE__ */ jsx(AuthenticatedLink, { to: "/signup", children: "Sign up" })
      ] }),
      /* @__PURE__ */ jsx(AuthenticatedLink, { to: "/forgotPassword", prefetch: "render", children: /* @__PURE__ */ jsx(Text$1, { p: true, children: "Forgot your password?" }) })
    ] })
  ] }) });
}

const route7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
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

const route8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: AppLayout,
  meta
}, Symbol.toStringTag, { value: 'Module' }));

const serverManifest = {'entry':{'module':'/assets/entry.client-MMCr7QJo.js','imports':['/assets/components-Bbc86ifj.js','/assets/index-D34nGoGN.js'],'css':[]},'routes':{'root':{'id':'root','parentId':undefined,'path':'','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/root-BHPGg5Uc.js','imports':['/assets/components-Bbc86ifj.js','/assets/index-D34nGoGN.js','/assets/react-redux-TNJK1e1K.js','/assets/index-BAMY2Nnw.js','/assets/AuthProvider-DC0ulOoC.js','/assets/css-baseline-C10yUr1Q.js'],'css':['/assets/root-D3BK_U7X.css']},'routes/api.table-data':{'id':'routes/api.table-data','parentId':'root','path':'api/table-data','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/api.table-data-l0sNRNKZ.js','imports':[],'css':[]},'routes/forgotPassword':{'id':'routes/forgotPassword','parentId':'root','path':'forgotPassword','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/forgotPassword-CR6aQVLe.js','imports':['/assets/components-Bbc86ifj.js','/assets/react-redux-TNJK1e1K.js','/assets/geist-provider-aLuppyM2.js','/assets/css-baseline-C10yUr1Q.js','/assets/index-D34nGoGN.js','/assets/index-BAMY2Nnw.js','/assets/use-geist-ui-context-DCQYMvz0.js'],'css':[]},'routes/app.dashboard':{'id':'routes/app.dashboard','parentId':'routes/app','path':'dashboard','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/app.dashboard-rTiTt0jK.js','imports':['/assets/components-Bbc86ifj.js','/assets/objectWithoutProperties-BR_ycoE6.js','/assets/index-D34nGoGN.js','/assets/react-redux-TNJK1e1K.js','/assets/toConsumableArray-tU9m1R9e.js','/assets/use-geist-ui-context-DCQYMvz0.js','/assets/index-BAMY2Nnw.js'],'css':[]},'routes/resetPassword':{'id':'routes/resetPassword','parentId':'root','path':'resetPassword','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/resetPassword-Dbu1OGCi.js','imports':['/assets/components-Bbc86ifj.js','/assets/auth.client-BVBRz5GD.js','/assets/index-D34nGoGN.js','/assets/react-redux-TNJK1e1K.js','/assets/geist-provider-aLuppyM2.js','/assets/index-BAMY2Nnw.js','/assets/use-geist-ui-context-DCQYMvz0.js'],'css':[]},'routes/logout':{'id':'routes/logout','parentId':'root','path':'logout','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/logout-sSPUzoJM.js','imports':['/assets/index-D34nGoGN.js','/assets/auth.client-BVBRz5GD.js','/assets/index-BAMY2Nnw.js'],'css':[]},'routes/signup':{'id':'routes/signup','parentId':'root','path':'signup','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/signup-D9e6f486.js','imports':['/assets/components-Bbc86ifj.js','/assets/AuthenticatedLink-CJAQ6_MP.js','/assets/index-D34nGoGN.js','/assets/react-redux-TNJK1e1K.js','/assets/auth.client-BVBRz5GD.js','/assets/geist-provider-aLuppyM2.js','/assets/use-geist-ui-context-DCQYMvz0.js','/assets/toConsumableArray-tU9m1R9e.js','/assets/index-BAMY2Nnw.js','/assets/AuthProvider-DC0ulOoC.js'],'css':[]},'routes/login':{'id':'routes/login','parentId':'root','path':'login','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/login-GlODf0FR.js','imports':['/assets/components-Bbc86ifj.js','/assets/AuthenticatedLink-CJAQ6_MP.js','/assets/index-D34nGoGN.js','/assets/react-redux-TNJK1e1K.js','/assets/auth.client-BVBRz5GD.js','/assets/geist-provider-aLuppyM2.js','/assets/use-geist-ui-context-DCQYMvz0.js','/assets/toConsumableArray-tU9m1R9e.js','/assets/index-BAMY2Nnw.js','/assets/AuthProvider-DC0ulOoC.js'],'css':[]},'routes/app':{'id':'routes/app','parentId':'root','path':'app','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/app-ETGGK5S9.js','imports':['/assets/components-Bbc86ifj.js','/assets/objectWithoutProperties-BR_ycoE6.js','/assets/index-D34nGoGN.js','/assets/react-redux-TNJK1e1K.js','/assets/geist-provider-aLuppyM2.js','/assets/toConsumableArray-tU9m1R9e.js','/assets/use-geist-ui-context-DCQYMvz0.js','/assets/index-BAMY2Nnw.js'],'css':[]}},'url':'/assets/manifest-1c65ebac.js','version':'1c65ebac'};

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
  "routes/api.table-data": {
          id: "routes/api.table-data",
          parentId: "root",
          path: "api/table-data",
          index: undefined,
          caseSensitive: undefined,
          module: route1
        },
  "routes/forgotPassword": {
          id: "routes/forgotPassword",
          parentId: "root",
          path: "forgotPassword",
          index: undefined,
          caseSensitive: undefined,
          module: route2
        },
  "routes/app.dashboard": {
          id: "routes/app.dashboard",
          parentId: "routes/app",
          path: "dashboard",
          index: undefined,
          caseSensitive: undefined,
          module: route3
        },
  "routes/resetPassword": {
          id: "routes/resetPassword",
          parentId: "root",
          path: "resetPassword",
          index: undefined,
          caseSensitive: undefined,
          module: route4
        },
  "routes/logout": {
          id: "routes/logout",
          parentId: "root",
          path: "logout",
          index: undefined,
          caseSensitive: undefined,
          module: route5
        },
  "routes/signup": {
          id: "routes/signup",
          parentId: "root",
          path: "signup",
          index: undefined,
          caseSensitive: undefined,
          module: route6
        },
  "routes/login": {
          id: "routes/login",
          parentId: "root",
          path: "login",
          index: undefined,
          caseSensitive: undefined,
          module: route7
        },
  "routes/app": {
          id: "routes/app",
          parentId: "root",
          path: "app",
          index: undefined,
          caseSensitive: undefined,
          module: route8
        }
      };

export { serverManifest as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, mode, publicPath, routes };
