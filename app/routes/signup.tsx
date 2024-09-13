import { FontPreference, UserRole } from "@prisma/client";
import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { signup, commitSession, getSession } from "~/auth.server";
import { db } from "~/util/db.server";
import { openAccount } from "~/util/accountUtil";
import { createUser } from "~/util/userUtil";

interface ActionData {
    error?: string;
}

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;

    try {
        // Create a user in firebase auth and set current session
        const user = await signup(email, password);
        const session = await getSession(request);
        session.set("user", user);

        // Prisma database mutations
        await createUser(user.uid, email, first_name, last_name);

        return redirect("/", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    } catch (error: any) {
        return json<ActionData>({ error: error.message });
    }
};

export default function Signup() {
    const actionData = useActionData<ActionData>();

    return (
        <div>
            <h1>Sign Up</h1>
            <Form method="post">
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
                <button type="submit">Sign up</button>
            </Form>
            {actionData?.error && <p>{actionData.error}</p>}
        </div>
    );
}

