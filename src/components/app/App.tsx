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
		return <div className="container my-10 mx-4">Loading...</div>;
	}

	if (auth.user === null) {
		return (
			<>
				<div className="text-center my-10">
					<h1 className="text-2xl font-bold text-center mb-4">You need to login to continue</h1>
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
					<h1 className="text-2xl font-bold text-center">
						Please create or join organization first
					</h1>
					<div className="text-center">
						<button
							className="px-4 py-2 bg-blue-500 text-white rounded ml-2"
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
				<h1 className="text-2xl font-bold text-center">Please select an organization</h1>
				<div className="text-center">
					<select
						className="px-4 py-2  rounded"
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
				<a href="/app/prompts" className="px-4 py-2 bg-indigo-500 text-white rounded">
					Go to prompts
				</a>
			</div>
		</Layout>
	);
};
