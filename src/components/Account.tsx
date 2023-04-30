import {
	AuthProvider,
	useAuthInfo,
	useLogoutFunction,
	useRedirectFunctions,
} from '@propelauth/react';

import '@propelauth/base-elements/dist/default.css';

export function Account() {
	return (
		<AuthProvider authUrl={import.meta.env.PUBLIC_AUTH_URL}>
			<AccountInteral />
		</AuthProvider>
	);
}

function AccountInteral() {
	const auth = useAuthInfo();
	const logoutFn = useLogoutFunction();
	const { redirectToCreateOrgPage, redirectToOrgPage } = useRedirectFunctions();

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
					Signup
				</a>
			</>
		);
	}
	return (
		<>
			<p>The User is logged in</p>
			<button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => logoutFn(true)}>
				Click here to log out
			</button>
			<button
				className="px-4 py-2 bg-blue-500 text-white rounded ml-2"
				onClick={() => redirectToOrgPage()}
			>
				Manage orgs
			</button>
			<button
				className="px-4 py-2 bg-blue-500 text-white rounded ml-2"
				onClick={() => redirectToCreateOrgPage()}
			>
				Create org
			</button>
			<div>
				My orgs:
				{auth.orgHelper.getOrgs().map((org) => {
					console.log(org);
					return (
						<div key={org.orgId} className="ml-2">
							<button>
								<b>{org.orgName}</b>
							</button>
							<br />
						</div>
					);
				})}
			</div>
			<details>
				<summary className="cursor-pointer">Debug</summary>
				{JSON.stringify(auth)}
			</details>
		</>
	);
}
