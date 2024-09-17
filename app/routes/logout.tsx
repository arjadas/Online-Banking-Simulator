import { LoaderFunction } from '@remix-run/cloudflare';
import { handleSignOut } from '~/auth.server';
import { signOutUser } from '~/auth.client';
import { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';

export const loader: LoaderFunction = async ({ request }: { request: Request }) => {
  return handleSignOut(request);
};

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOutUser();
        navigate('/login', { replace: true });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    performLogout();
  }, [navigate]);

  return null;
}