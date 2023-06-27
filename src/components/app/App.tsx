import type { OrgMemberInfo } from '@propelauth/javascript';
import type { UseAuthInfoLoggedInProps } from '@propelauth/react/types/useAuthInfo';
import { Link } from 'react-router-dom';

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
					<h1 className="mb-4 text-center text-2xl font-bold">Please sign in to continue</h1>
					<LoginInternal />
				</div>
			</>
		);
	}

	if (!activeOrg) {
		const orgs = auth.orgHelper.getOrgs();
		if (orgs.length === 0) {
			return (
				<div className="mt-20 flex flex-col gap-10">
					<h1 className="text-center text-2xl font-bold">First, create an organization:</h1>
					<div className="text-center">
						<button
							className="ml-2 rounded bg-blue-500 px-4 py-2 text-white"
							onClick={() => redirectToCreateOrgPage()}
						>
							Create an organization
						</button>
					</div>
				</div>
			);
		}

		return (
			<div className="mt-20 flex flex-col gap-10">
				<h1 className="text-center text-2xl font-bold">Please select an organization:</h1>
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
			</div>
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
		<Layout title="">
			<div className="flex flex-col flex-col-reverse gap-8 md:flex-row">
				<div className="flex w-full flex-col gap-4 p-4 md:w-2/3 md:p-12">
					<p>
						While <i>Prompts with Friends</i> is a mere showcase of the{' '}
						<a
							className="text-blue-700 underline visited:text-purple-600 hover:text-rose-600"
							href="https://b2bsaaskit.com"
						>
							B2B SaaS Kit
						</a>
						, our goal was to make it genuinely useful.
					</p>
					<p>
						As it happens, this project started off as the obligatory collaborative note-taking app,
						but in the process our attention quickly turned to GPT prompt-building.
					</p>
					<div>
						What if we came up with a sensible way for teams to work on complex prompts? For
						example, what if it was easy to do things like
						<ul className="ml-4 mt-4">
							<li>- Set system messages</li>
							<li>- Generate and regenerate AI responses at any point</li>
							<li>- Share prompts with friends or the world</li>
							<li>- Fork prompts</li>
							<li>- Like prompts</li>
						</ul>
					</div>
					<p>
						Roughly, that's what we've got for you here. To give it a go, start by{' '}
						<Link
							to="/app/prompts/create"
							type="button"
							className="text-blue-700 underline visited:text-purple-600 hover:text-rose-600"
						>
							creating a prompt
						</Link>
						. If you run into any issues,{' '}
						<Link
							to="/app/support"
							type="button"
							className="text-blue-700 underline visited:text-purple-600 hover:text-rose-600"
						>
							ping us in support
						</Link>
						.
					</p>
					<p>Enjoy!</p>
				</div>
				<div className="flex w-full items-center justify-center md:w-1/3">
					<div className="flex flex-col">
						<div className="mt-4">
							Hello, {auth.user.email} ({activeOrg.orgName})
						</div>
						<div className="mt-4 text-center">
							<a href="/app/prompts" className="rounded bg-indigo-500 px-4 py-2 text-white">
								View prompts
							</a>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};
