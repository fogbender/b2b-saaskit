import { env } from '../config';
import { AuthProvider, LoginManager } from './propelauth';
import { PropelAuthCSS } from './PropelAuthCSS';

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
		<PropelAuthCSS>
			<LoginManager
				onLoginCompleted={redirectToYourProduct}
				onRedirectToPasswordlessLogin={() => {
					window.location.href = '/login-passwordless';
				}}
				onRedirectToSignup={() => {
					window.location.href = '/signup';
				}}
			/>
		</PropelAuthCSS>
	);
}
