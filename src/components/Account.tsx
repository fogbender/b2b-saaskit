import {
	AuthProvider,
	useAuthInfo,
	useLogoutFunction,
	useRedirectFunctions,
} from '@propelauth/react';

import '@propelauth/base-elements/dist/default.css';
import { useEffect, useState } from 'react';

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

	const [selectedOrgId, setSelectedOrgId] = useState('');

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
							<button
								onClick={() => {
									setSelectedOrgId(org.orgId);
								}}
							>
								Select <b>{org.orgName}</b>
							</button>
							<br />
						</div>
					);
				})}
				{selectedOrgId && <Organizations token={auth.accessToken} orgId={selectedOrgId} />}
			</div>
			<details>
				<summary className="cursor-pointer">Debug</summary>
				{JSON.stringify(auth)}
			</details>
		</>
	);
}

type User = {
	userId: string;
	email: string;
};

const Organizations = (props: { token: string; orgId: string }) => {
	const [users, setUsers] = useState<User[]>([]);
	const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
	useEffect(() => {
		setStatus('loading');
		setUsers([]);
		fetch('/api/orgs/' + props.orgId, {
			headers: {
				Authorization: 'Bearer ' + props.token,
			},
		})
			.then(
				(res) =>
					res.json() as Promise<{
						users: User[];
					}>
			)
			.then((res) => res.users)
			.then(setUsers)
			.then(() => setStatus('success'));
	}, [props.orgId]);
	return (
		<div>
			Users: {status === 'loading' && 'Loading...'}
			{status === 'error' && 'Error'}
			{status === 'success' &&
				users.map((user) => {
					return <div key={user.userId}>{user.email}</div>;
				})}
		</div>
	);
};
