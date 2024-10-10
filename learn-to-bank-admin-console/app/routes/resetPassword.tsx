import { ActionFunction, json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useSearchParams, useSubmit } from "@remix-run/react";
import { resetPassword } from "~/auth.client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "~/store";
import { GeistProvider, Themes } from "@geist-ui/core";

type ActionData = {
  error?: string;
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  // This action is now only used to redirect after successful password reset
  return redirect("/login");
};

export default function ResetPassword() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const { isDarkTheme, textScale } = useSelector((state: RootState) => state.app);
  const [clientError, setClientError] = useState<string | null>(null);
  const submit = useSubmit();

  if (!oobCode) {
    return <p>Invalid reset password link.</p>;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newPassword = formData.get("password") as string;

    try {
      await resetPassword(oobCode, newPassword);
      submit(formData, { method: "post", action: form.action });
    } catch (error: any) {
      setClientError(error.message);
    }
  };

  return (
    <div style={{
      backgroundColor: isDarkTheme ? '#111111' : '#EEEEEE'
    }}>
      <h1>Reset Password</h1>
      <Form method="post" onSubmit={handleSubmit}>
        <input type="hidden" name="oobCode" value={oobCode} />
        <div>
          <label htmlFor="password">New Password</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Reset Password</button>
      </Form>
      {clientError && <p>{clientError}</p>}
      {actionData?.error && <p>{actionData.error}</p>}
    </div>
  );
}