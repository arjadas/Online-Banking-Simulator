import { ActionFunction, json } from "@remix-run/cloudflare";
import { getUserSession } from "../auth.server";
import { getPrismaClient } from "../service/db.server";
export const action: ActionFunction = async ({ context, request }) => {
    const user = await getUserSession(context, request);
    const db = getPrismaClient(context);

    if (!user) return json({ error: 'Unauthenticated' }, { status: 401 });

    const formData = await request.formData();
    const action = formData.get("action");

    if (action === "markAsRead") {
        await db.notification.updateMany({
            where: { uid: user.uid, read: false },
            data: { read: true },
        });

        return json({ success: true });
    }

    return json({ error: 'Invalid action' }, { status: 400 });
};