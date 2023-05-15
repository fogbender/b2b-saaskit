import { AuthProvider, BetaComponentLibraryProvider, Signup as SignupManager } from './propelauth';

import { BaseElements } from '@propelauth/base-elements';
import '@propelauth/base-elements/dist/default.css';
import { env } from '../config';

export function Signup() {
	const redirectToYourProduct = () => {
		window.location.href = '/app';
	};
	return (
		<AuthProvider authUrl={env.PUBLIC_AUTH_URL}>
			<BetaComponentLibraryProvider elements={BaseElements}>
				<SignupManager
					onSignupCompleted={redirectToYourProduct}
					onRedirectToPasswordlessLogin={() => {
						window.location.href = '/login-passwordless';
					}}
					onRedirectToLogin={() => {
						window.location.href = '/login';
					}}
				/>
			</BetaComponentLibraryProvider>
		</AuthProvider>
	);
}
