import { FontPreference, UserRole } from "@prisma/client";
import { ActionFunction, json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useSubmit, useNavigation } from "@remix-run/react";
import { commitSession, getSession } from "~/auth.server";
import { getPrismaClient } from "~/util/db.server";
import { openAccount } from "~/util/accountUtil";
import { signup } from "~/auth.client";
import { useEffect, useState } from "react";
import { createUser } from "~/util/userUtil";

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
            <h1>Sign Up</h1>
            <Form method="post" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="first_name">First Name</label>
                    <input type="text" name="first_name" required />
                </div>
                <div>
                    <label htmlFor="last_name">Last Name</label>
                    <input type="text" name="last_name" required />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" required />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" required />
                </div>
                <button type="submit" disabled={navigation.state === "submitting"}>
                    {navigation.state === "submitting" ? "Signing up..." : "Sign up"}
                </button>
            </Form>
            {clientError && (
                <div>
                    <p>Error: {clientError}</p>
                </div>
            )}
        </div>
    );
}