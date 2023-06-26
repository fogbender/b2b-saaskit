import { env } from '../config';
import { usePersistReturnUrl, useRedirectToYourProduct } from './app/utils';
import { AuthProvider, LoginManager } from './propelauth';
import { PropelAuthCSS } from './PropelAuthCSS';

export function Login() {
	usePersistReturnUrl();
	return (
		<AuthProvider authUrl={env.PUBLIC_AUTH_URL}>
			<LoginInternal />
		</AuthProvider>
	);
}

export function LoginInternal() {
	const { redirectToYourProduct } = useRedirectToYourProduct();

	return (
		<PropelAuthCSS>
			<LoginManager
				onLoginCompleted={redirectToYourProduct}
				onRedirectToSignup={() => {
					window.location.href = '/signup';
				}}
				onRedirectToForgotPassword={() => {
					window.location.href = env.PUBLIC_AUTH_URL + '/forgot_password';
				}}
			/>
		</PropelAuthCSS>
	);
}
