import { LoaderFunction } from '@remix-run/cloudflare';
import { useNavigate } from '@remix-run/react';
import { useEffect } from 'react';
import { signOutUser } from '~/auth.client';
import { logout } from '~/auth.server';

export const loader: LoaderFunction = async ({ request, context }: { request: Request, context: any }) => {
  return logout(context, request);
};

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOutUser();
        localStorage.removeItem('uid');
        navigate('/login', { replace: true });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    performLogout();
  }, [navigate]);

  return null;
}