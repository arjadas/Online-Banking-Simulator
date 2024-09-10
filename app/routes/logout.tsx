import { LoaderFunction } from '@remix-run/node';
import { handleSignOut, signOutUser } from '../auth.server';

export const loader: LoaderFunction = async ({ request }) => {
    await signOutUser();
    return handleSignOut(request);
};

export default function Logout() {
    return null;
}