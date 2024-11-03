import { Link, LinkProps, useFetcher } from "@remix-run/react";
import { useAuth } from "./AuthProvider";

export function AuthenticatedLink(props: LinkProps) {
    const { uid } = useAuth();
    const fetcher = useFetcher();
    const age =  60 * 60 * 24 * 7; // 1 week

    const handlePrefetch = () => {
        fetcher.submit(
            {
                method: 'get',
                action: `${props.to}?_data=routes/${props.to}`,
                headers: {
                    'Cookie': `uid=${uid}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`
                }
            }
        );
    };

    return <Link {...props} />;
}