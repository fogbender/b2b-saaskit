import type { OrgMemberInfo } from '@propelauth/javascript';
import type { UseAuthInfoLoggedInProps } from '@propelauth/react/types/useAuthInfo';

import { LoginInternal } from '../Login';
import {
	saveOrgSelectionToLocalStorage,
	useActiveOrg,
	useAuthInfo,
	useRedirectFunctions,
} from '../propelauth';
import { Layout } from './Layout';
import { useNavigateToReturnUrl } from './utils';

export function App() {
	const activeOrg = useActiveOrg();
	const auth = useAuthInfo();
	const { redirectToCreateOrgPage } = useRedirectFunctions();
	useNavigateToReturnUrl();

	if (auth.loading === true) {
		return <div className="container mx-4 my-10">Loading...</div>;
	}

	if (auth.user === null) {
		return (
			<>
				<div className="my-10 text-center">
					<h1 className="mb-4 text-center text-2xl font-bold">You need to login to continue</h1>
					<LoginInternal />
				</div>
			</>
		);
	}

	if (!activeOrg) {
		const orgs = auth.orgHelper.getOrgs();
		if (orgs.length === 0) {
			return (
				<>
					<h1 className="text-center text-2xl font-bold">
						Please create or join organization first
					</h1>
					<div className="text-center">
						<button
							className="ml-2 rounded bg-blue-500 px-4 py-2 text-white"
							onClick={() => redirectToCreateOrgPage()}
						>
							Create org
						</button>
					</div>
				</>
			);
		}

		return (
			<>
				<h1 className="text-center text-2xl font-bold">Please select an organization</h1>
				<div className="text-center">
					<select
						className="rounded px-4  py-2"
						onChange={(e) => {
							saveOrgSelectionToLocalStorage(e.target.value);
							window.location.reload();
						}}
					>
						<option value="">&nbsp;&nbsp;Select an organization</option>
						{orgs.map((org) => {
							return (
								<option key={org.orgId} value={org.orgId}>
									{org.orgName}
								</option>
							);
						})}
					</select>
				</div>
			</>
		);
	}

	return <AppWithOrg auth={auth} activeOrg={activeOrg} />;
}

const AppWithOrg = ({
	auth,
	activeOrg,
}: {
	auth: UseAuthInfoLoggedInProps;
	activeOrg: OrgMemberInfo;
}) => {
	return (
		<Layout title="Your activity">
			<div className="mt-4">
				Hello, {auth.user.email} ({activeOrg.orgName})
			</div>
			<div className="mt-4">
				<a href="/app/prompts" className="rounded bg-indigo-500 px-4 py-2 text-white">
					Go to prompts
				</a>
			</div>
		</Layout>
	);
};
