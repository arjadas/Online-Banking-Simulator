import { Button, Card, Image, Input } from '@geist-ui/react';
import { ActionFunction, json } from "@remix-run/cloudflare";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { signup } from "~/auth.client";
import { createUserSession } from "~/auth.server";
import AuthenticatedLink from '~/components/AuthenticatedLink';
import ResizableText from '~/components/ResizableText';
import { createUser } from "~/service/userService";

export const action: ActionFunction = async ({ context, request }: { context: any; request: Request }) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;
    const uid = formData.get("uid") as string;

    try {
        // Prisma database mutations
        await createUser(context, uid, email, first_name, last_name);

        // Store session data in KV
        return await createUserSession(context, uid, email, "/app/accounts");
    } catch (error: any) {
        return json({ error: error.message, context: context.cloudflare.env.firebase_storage });
    }
};

export default function Signup() {
    const actionData = useActionData<any>();
    const submit = useSubmit();
    const [clientError, setClientError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [shake, setShake] = useState(false);

    useEffect(() => {
        if (actionData?.error) {
            setClientError(JSON.stringify(actionData));
        }
    }, [actionData]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setClientError("Password Does Not Match - Please Try Again.");
            setShake(true);
            setTimeout(() => setShake(false), 500); // Remove shake effect after animation
            return;
        }

        const form = event.currentTarget;
        const formData = new FormData(form);

        setLoading(true);

        try {
            const user = await signup(
                formData.get("email") as string,
                formData.get("password") as string
            );

            formData.append("uid", user.uid);
            submit(formData, { method: "post", action: "/signup" });
        } catch (error: any) {
            setClientError(error.message);
        } finally {
            setLoading(false);
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
                <ResizableText h3 style={{ textAlign: "center" }}>Sign Up</ResizableText>
                <Form method="post" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <Input name="first_name" placeholder="First Name" required width="100%" crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}  />
                    <Input name="last_name" placeholder="Last Name" required width="100%" crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    <Input name="email" htmlType="email" clearable placeholder="Email" required width="100%" crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    <Input.Password
                        name="password"
                        clearable
                        placeholder="Password"
                        required
                        width="100%"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input.Password
                        name="confirm_password"
                        clearable
                        placeholder="Confirm Password"
                        required
                        width="100%"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <Button
                        htmlType="submit"
                        type="secondary"
                        loading={loading}
                        disabled={loading}
                        className={shake ? "shake" : ""}
                        placeholder=""
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    >

                        Sign up
                    </Button>
                </Form>
                {clientError && <ResizableText type="error" style={{ marginTop: 10 }}>{clientError}</ResizableText>}
                <AuthenticatedLink to="/login" prefetch='render'><ResizableText p>Go back</ResizableText></AuthenticatedLink>
            </Card>
            <style>{`
                .shake {
                    animation: shake 0.5s;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-10px); }
                    40%, 80% { transform: translateX(10px); }
                }
            `}</style>
        </div>
    );
}
