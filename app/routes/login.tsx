import { ActionFunction, json, redirect } from "@remix-run/cloudflare";
import { Page, Card, Button, Input, Textarea, Text } from '@geist-ui/react';
import { Select, Tabs } from '@geist-ui/core';
import { Form, Link, useActionData, useSubmit, useNavigation } from "@remix-run/react";
import { commitSession, getSession } from "~/auth.server";
import { login } from "~/auth.client";
import { useState, useEffect } from "react";
import "../styles/login.css";

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
     
     <h1 style={{
        fontWeight: 'bold',
        fontSize: '25px',
        position:'relative',
        right:'120px',
        top:'40px'
      }}>Login</h1>
    <Card 
    style={{ width: '800px', height: '700px',display: 'flex',
      alignItems: 'center', 
    flexDirection: 'column', 
    justifyContent: 'center',
    marginTop: '70px' 
     }} >
      <Form  style={{display: 'flex',
      alignItems: 'center', 
    flexDirection: 'column', 
    justifyContent: 'flex-start'}}method="post" onSubmit={handleSubmit}>
        <div className="email-container">
          <input className= "login-page-input" type="email" name="email" placeholder="Enter Email" required />
        </div>
        <div className="password-container">
          <input className= "login-page-input" type="password" name="password" placeholder="Enter Password"required />
        </div>
        <div className = "forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>        
        <button type="submit" className = "submit-button" disabled={navigation.state === "submitting"}>
          {navigation.state === "submitting" ? "Submitting..." : "Submit"}
        </button>
        <div className = "sign-up">
      Don't have an account? &nbsp;
      <Link to="/signup" className="sign-link">Sign up</Link>
      </div>
      </Form>
      {clientError && <p>Error: {clientError}</p>}
      {actionData?.error && <p>Error: {actionData.error}</p>}
      </Card>
      </div>
   
  );
}