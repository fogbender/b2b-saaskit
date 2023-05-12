import {
	AuthProvider,
	useActiveOrg,
	useAuthInfo,
	saveOrgSelectionToLocalStorage,
	useRedirectFunctions,
} from './propelauth';
import type { OrgMemberInfo } from '@propelauth/javascript';
import type { UseAuthInfoLoggedInProps } from '@propelauth/react/types/useAuthInfo';
import { env } from '../config';
import { trpc, TRPCProvider } from './trpc';
import { AuthSync } from './AuthSync';
import { SupportWidget } from './fogbender/Support';

export function App() {
	return (
		<AuthProvider authUrl={env.PUBLIC_AUTH_URL}>
			<TRPCProvider>
				<AuthSync />
				<AccountInteral />
			</TRPCProvider>
		</AuthProvider>
	);
}

function AccountInteral() {
	const activeOrg = useActiveOrg();
	const auth = useAuthInfo();
	const { redirectToCreateOrgPage } = useRedirectFunctions();

	if (auth.loading === true) {
		return <>Loading...</>;
	}
	if (auth.user === null) {
		return (
			<>
				<h1 className="text-2xl font-bold text-center">Not logged in</h1>
				<a href="/login" className="px-4 py-2 bg-blue-500 text-white rounded">
					Login
				</a>
				<a href="/signup" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
					Sign up
				</a>
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
	const helloQuery = trpc.hello.hello.useQuery();
	return (
		<>
			<div>
				Hello, {auth.user.email} ({activeOrg.orgName})
				<button
					className="px-4 py-2 bg-blue-500 text-white rounded ml-2"
					onClick={() => {
						saveOrgSelectionToLocalStorage('');
						window.location.reload();
					}}
				>
					Switch org
				</button>
			</div>
			<br />
			<div>
				{helloQuery?.data}
				<SupportWidget />
			</div>
		</>
	);
};
