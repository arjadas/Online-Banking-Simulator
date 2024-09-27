import { Button, Card, Image, Input, Text } from '@geist-ui/react';
import { ActionFunction, json, redirect } from "@remix-run/cloudflare";
import { Form, Link, useActionData, useNavigation, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { login } from "~/auth.client";
import { commitSession, getSession } from "~/auth.server";
import ResizableText from '~/components/ResizableText';
//import "../styles/login.css";

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

    //return json<ActionData>({ error: `${import.meta.env.VITE_SESSION_SECRET} ${await commitSession(session)} sd ${await session.get("user")?.uid} sd ${await session.data?.user?.uid} ${await (await getSession(request))?.data.user?.uid} ${await (await getSession(request))?.get("user")?.uid}` });
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
          <Button htmlType="submit" type="secondary" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Log in</Button>
        </Form>
        {clientError && <ResizableText style={{ marginTop: 10 }} type="error">{clientError}</ResizableText>}
        <ResizableText p>Don&apos;t have an account? <Link to="/signup">Sign up</Link></ResizableText>
        <Link to="/forgot-password"><ResizableText p>Forgot your password?</ResizableText></Link>
      </Card>
    </div>

  );
}