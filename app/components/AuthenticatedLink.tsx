import { Link, LinkProps, useFetcher } from "@remix-run/react";
import { useAuth } from "./AuthProvider";

// We are leaving this logic here in case we want to use it in the future, and fix its associated issues.
const AuthenticatedLink: React.FC<LinkProps> = (props: LinkProps) => {
    const { uid } = useAuth();
    const fetcher = useFetcher();
    const age = 60 * 60 * 24 * 7; // 1 week

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

export default AuthenticatedLink;