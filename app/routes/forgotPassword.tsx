import { ActionFunction, json } from "@remix-run/cloudflare";
import { Form, useActionData } from "@remix-run/react";
import { sendResetPasswordEmail } from "~/auth.client";

type ActionData = {
  error?: string;
  success?: string;
};

export const action: ActionFunction = async ({ request } : { request: Request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  try {
    await sendResetPasswordEmail(email);
    return json<ActionData>({ success: "Password reset email sent!" });
  } catch (error: any) {
    return json<ActionData>({ error: error.message });
  }
};

export default function ForgotPassword() {
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <h1>Forgot Password</h1>
      <Form method="post">
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" required />
        </div>
        <button type="submit">Send Password Reset Email</button>
      </Form>
      {actionData?.error && <p>{actionData.error}</p>}
      {actionData?.success && <p>{actionData.success}</p>}
    </div>
  );
}