import {
	AuthProvider,
	BetaComponentLibraryProvider,
	Signup as SignupManager,
} from '@propelauth/react';

import { BaseElements } from '@propelauth/base-elements';
import '@propelauth/base-elements/dist/default.css';
import { env } from '../config';

export function Signup() {
	const redirectToYourProduct = () => {
		window.location.href = '/';
	};
	return (
		<AuthProvider authUrl={env.PUBLIC_AUTH_URL}>
			<BetaComponentLibraryProvider elements={BaseElements}>
				<SignupManager
					onSignupCompleted={redirectToYourProduct}
					onRedirectToPasswordlessLogin={() => {
						window.location.href = '/login-passwordless';
					}}
				/>
			</BetaComponentLibraryProvider>
		</AuthProvider>
	);
}
