import { ActionFunction, json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { resetPassword } from "~/auth.server";

type ActionData = {
  error?: string;
};

export const action: ActionFunction = async ({ request } : { request: Request }) => {
  const formData = await request.formData();
  const newPassword = formData.get("password") as string;
  const oobCode = formData.get("oobCode") as string; // OOB Code from the reset link

  try {
    await resetPassword(oobCode, newPassword);
    return redirect("/login");
  } catch (error: any) {
    return json<ActionData>({ error: error.message });
  }
};

export default function ResetPassword() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  if (!oobCode) {
    return <p>Invalid reset password link.</p>;
  }

  return (
    <div>
      <h1>Reset Password</h1>
      <Form method="post">
        <input type="hidden" name="oobCode" value={oobCode} />
        <div>
          <label htmlFor="password">New Password</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Reset Password</button>
      </Form>
      {actionData?.error && <p>{actionData.error}</p>}
    </div>
  );
}