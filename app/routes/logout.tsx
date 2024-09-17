import { LoaderFunction } from '@remix-run/cloudflare';
import { handleSignOut, signOutUser } from '../auth.server';

export const loader: LoaderFunction = async ({ request } : { request: Request }) => {
    await signOutUser();
    return handleSignOut(request);
};

export default function Logout() {
    return null;
}