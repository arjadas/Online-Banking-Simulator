import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { login, commitSession, getSession } from "~/auth.server";

type ActionData = {
  error?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const user = await login(email, password);
    const session = await getSession(request);
    session.set("user", user);

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error: any) {
    return json<ActionData>({ error: error.message });
  }
};

export default function Login() {
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <div>
        <h1>Login</h1>
        <Form method="post">
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" required />
          </div>
          <button type="submit">Log in</button>
        </Form>
        {actionData?.error && <p>{actionData.error}</p>}

        <div>
          <Link to="/signup">Don&apos;t have an account? Sign up</Link>
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>
      </div>
    </div>
  );
}