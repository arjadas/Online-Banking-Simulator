import { Button, Card, Image, Input, Text } from '@geist-ui/react';
import { ActionFunction, json } from "@remix-run/cloudflare";
import { Form, useActionData } from "@remix-run/react";
import { sendResetPasswordEmail } from "~/auth.client";
import AuthenticatedLink from '~/components/AuthenticatedLink';

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
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      height: "100vh"
    }} >
      <Image width="400px" style={{ textAlign: "center", paddingBottom: 30 }} src="logo.png" />
      <Card width="400px" style={{ padding: 10 }}>
        <Text h3>Forgot Password</Text>
        <Text h6>Email</Text>
        <Form method="post" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input name="email" htmlType="email" clearable placeholder="Enter your Email" required width="100%" crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          <Button 
            htmlType="submit" 
            type="secondary"
            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Reset Password
          </Button>
        </Form>
        {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
        {actionData?.success && <p style={{ color: "green" }}>{actionData.success}</p>}
        <AuthenticatedLink to="/login" prefetch='render'>
          <Text p>Back to Sign in</Text>
        </AuthenticatedLink>
      </Card>
    </div>
  );
}