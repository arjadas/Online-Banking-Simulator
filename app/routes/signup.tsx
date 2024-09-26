import { FontPreference, UserRole } from "@prisma/client";
import { ActionFunction, json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useSubmit, useNavigation } from "@remix-run/react";
import { commitSession, getSession } from "~/auth.server";
import { getPrismaClient } from "~/util/db.server";
import { openAccount } from "~/util/accountUtil";
import { Page, Card, Button, Input, Image, Text } from '@geist-ui/react';
import { Select, Tabs } from '@geist-ui/core';
import { signup } from "~/auth.client";
import { useEffect, useState } from "react";
import { createUser } from "~/util/userUtil";
import { Link } from 'react-router-dom';

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
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "100vh"
        }}>
            <Image width="400px" style={{ textAlign: "center", paddingBottom: 30 }} src="logo.png" />
            <Card width="400px">
                <Text h3 style={{ textAlign: "center" }}>Sign Up</Text>
                <Form method="post" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <Input name="first_name" placeholder="First Name" required width="100%" crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    <Input name="last_name" placeholder="Last Name" required width="100%" crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    <Input name="email" htmlType="email" clearable placeholder="Email" required width="100%" crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    <Input.Password name="password" clearable placeholder="Password" required width="100%" />
                    <Button htmlType="submit" type="secondary" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Sign up</Button>
                </Form>
                {clientError && <Text type="error" marginTop="20px">{clientError}</Text>}
                <Link to="/login"><Text p>Go back</Text></Link>
            </Card>
        </div>
    );
}