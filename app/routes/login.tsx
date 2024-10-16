import { Button, Card, Image, Input, Text } from '@geist-ui/react';
import { ActionFunction, json } from "@remix-run/cloudflare";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { login } from "~/auth.client";
import { createUserSession } from "~/auth.server";
import { AuthenticatedLink } from '~/components/AuthenticatedLink';
import ResizableText from '~/components/ResizableText';

type ActionData = {
  error?: string;
};
export const action: ActionFunction = async ({ request, context }: { request: Request, context: any }) => {

  const formData = await request.formData();
  const uid = formData.get("uid") as string;
  const email = formData.get("email") as string;

  try {
    return await createUserSession(context, uid, email, "/app/accounts");
  } catch (error: any) {
    return json<ActionData>({ error: error.toString() });
  }
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [clientError, setClientError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const submit = useSubmit();

  useEffect(() => {
    if (actionData?.error) {
      setClientError(actionData.error);
    }
  }, [actionData]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    let uid;

    setLoading(true);

    try {
      const user = await login(
        formData.get("email") as string,
        formData.get("password") as string
      );

      formData.append("uid", user.uid);
      uid = user.uid;
      submit(formData, { method: "post", action: "/login" });
    } catch (error: any) {
      setClientError(error.message);
    } finally {
      if (uid) {
        localStorage.setItem('uid', uid);
      }
    }
    setLoading(false);
  }

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
        <Form method="post" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input name="email" htmlType="email" clearable placeholder="Email" required width="100%" crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          <Input.Password name="password" clearable placeholder="Password" required width="100%" />
          <Button
            htmlType="submit"
            type="secondary"
            loading={loading}
            disabled={loading}
            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          >
            Log in
          </Button>
        </Form>
        {clientError && <ResizableText style={{ marginTop: 10 }} type="error">{clientError}</ResizableText>}
        <ResizableText p>Don&apos;t have an account? <AuthenticatedLink to="/signup">Sign up</AuthenticatedLink></ResizableText>
        <AuthenticatedLink to="/forgot-password" prefetch='render'><ResizableText p>Forgot your password?</ResizableText></AuthenticatedLink>
      </Card>
    </div>
  );
}