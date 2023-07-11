import { env } from '../../config';
import { ClerkProvider, OrganizationSwitcher } from '../../vendor/clerk-react';
import { useOrganization } from '../../vendor/clerk-shared';

export function Clerk() {
	return (
		<ClerkProvider publishableKey={env.PUBLIC_CLERK_PUBLISHABLE_KEY}>
			<ClerkInternal />
		</ClerkProvider>
	);
}

function ClerkInternal() {
	const x = useOrganization();
	console.log(x);
	return <OrganizationSwitcher />;
}
