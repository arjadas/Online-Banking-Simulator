import { FontPreference, UserRole } from "@prisma/client";
import { ActionFunction, json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useSubmit, useNavigation } from "@remix-run/react";
import { commitSession, getSession } from "~/auth.server";
import { getPrismaClient } from "~/util/db.server";
import { openAccount } from "~/util/accountUtil";
import { Page, Card, Button, Input, Textarea, Text } from '@geist-ui/react';
import { Select, Tabs } from '@geist-ui/core';
import { signup } from "~/auth.client";
import { useEffect, useState } from "react";
import { createUser } from "~/util/userUtil";
import { Link } from 'react-router-dom';
import "../styles/signup.css";

export const action: ActionFunction = async ({ context, request }: { context: any, request: Request }) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;
    const uid = formData.get("uid") as string;

    try {
        // Prisma database mutations
        await createUser(context, uid, email, first_name, last_name);

        const session = await getSession(request);
        session.set("user", { uid, email });

        return redirect("/", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    } catch (error: any) {
        console.error("Error details:", error);
        return json({ error: error.message, context: JSON.stringify(context.cloudflare.env, null, 2) });
    }
};

export default function Signup() {
    const actionData = useActionData<any>();
    const submit = useSubmit();
    const navigation = useNavigation();
    const [clientError, setClientError] = useState<string | null>(null);

    useEffect(() => {
        if (actionData?.error) {
            setClientError(JSON.stringify(actionData));
        }
    }, [actionData]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);

        try {
            const user = await signup(
                formData.get("email") as string,
                formData.get("password") as string
            );

            formData.append("uid", user.uid);
            submit(formData, { method: "post", action: "/signup" });
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
            }}className="sign">Sign Up</h1>
            <Card style={{ width: '800px', height: '700px',display: 'flex',
                alignItems: 'center', 
                flexDirection: 'column', 
                justifyContent: 'center',
                 marginTop: '70px' 
                }}>
            <Form style={{display: 'flex',
                 alignItems: 'center', 
                flexDirection: 'column', 
                justifyContent: 'flex-start'}}method="post" onSubmit={handleSubmit}>
                <div className="first-name-container">
                    <input type="text" name="first_name" placeholder="First Name" required />
                </div>
                <div className="last-name-container">
                    <input type="text" name="last_name" placeholder="Last Name"  required />
                </div>
                <div className="emailS-container">
                    <input type="email" name="email" placeholder="Enter Email" required />
                </div>
                <div className="passwordS-container">
                    <input type="password" name="password" placeholder="Enter Password" required />
                </div>
                <div>
                <button type="submit" className="sign-up-button" disabled={navigation.state === "submitting"}>
                    {navigation.state === "submitting" ? "Signing up..." : "Sign up"}
                </button>
                </div>
                <div className = "log-in">
                    Already have an account? &nbsp;
                    <Link to="/login" className="login-link">Login</Link>
                    </div>
            </Form>
            {clientError && (
                <div>
                    <p>Error: {clientError}</p>
                </div>
            )}
            </Card>
        </div>
    );
}