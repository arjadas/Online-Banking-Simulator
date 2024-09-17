import { ActionFunction, json, redirect } from "@remix-run/cloudflare";
import { Form, Link, useActionData, useSubmit, useNavigation } from "@remix-run/react";
import { commitSession, getSession } from "~/auth.server";
import { login } from "~/auth.client";
import { useState, useEffect } from "react";

type ActionData = {
  error?: string;
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const uid = formData.get("uid") as string;
  const email = formData.get("email") as string;

  try {
    const session = await getSession(request);
    session.set("user", { uid, email });
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error: any) {
    return json<ActionData>({ error: error.toString() });
  }
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [clientError, setClientError] = useState<string | null>(null);
  const submit = useSubmit();
  const navigation = useNavigation();

  useEffect(() => {
    if (actionData?.error) {
      setClientError(actionData.error);
    }
  }, [actionData]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const user = await login(
        formData.get("email") as string,
        formData.get("password") as string
      );
      formData.append("uid", user.uid);
      submit(formData, { method: "post", action: "/login" });
    } catch (error: any) {
      setClientError(error.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <Form method="post" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit" disabled={navigation.state === "submitting"}>
          {navigation.state === "submitting" ? "Logging in..." : "Log in"}
        </button>
      </Form>
      {clientError && <p>Error: {clientError}</p>}
      {actionData?.error && <p>Error: {actionData.error}</p>}
      <div>
        <Link to="/signup">Don&apos;t have an account? Sign up</Link>
        <Link to="/forgot-password">Forgot your password?</Link>
      </div>
    </div>
  );
}