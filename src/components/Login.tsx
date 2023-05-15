import { AuthProvider, BetaComponentLibraryProvider, LoginManager } from './propelauth';

import { BaseElements } from '@propelauth/base-elements';
import '@propelauth/base-elements/dist/default.css';
import { env } from '../config';

export function Login() {
	return (
		<AuthProvider authUrl={env.PUBLIC_AUTH_URL}>
			<LoginInternal />
		</AuthProvider>
	);
}

export function LoginInternal() {
	const redirectToYourProduct = () => {
		window.location.href = '/app';
	};
	return (
		<BetaComponentLibraryProvider elements={BaseElements}>
			<LoginManager
				onLoginCompleted={redirectToYourProduct}
				onRedirectToPasswordlessLogin={() => {
					window.location.href = '/login-passwordless';
				}}
				onRedirectToSignup={() => {
					window.location.href = '/signup';
				}}
			/>
		</BetaComponentLibraryProvider>
	);
}
