import { env } from '../config';
import { usePersistReturnUrl, useRedirectToYourProduct } from './app/utils';
import { AuthProvider, Signup as SignupManager } from './propelauth';
import { PropelAuthCSS } from './PropelAuthCSS';

export function Signup() {
	usePersistReturnUrl();
	const { redirectToYourProduct } = useRedirectToYourProduct();

	return (
		<AuthProvider authUrl={env.PUBLIC_AUTH_URL}>
			<PropelAuthCSS>
				<SignupManager
					onSignupCompleted={redirectToYourProduct}
					onRedirectToPasswordlessLogin={() => {
						window.location.href = '/login-passwordless';
					}}
					onRedirectToLogin={() => {
						window.location.href = '/login';
					}}
				/>
			</PropelAuthCSS>
		</AuthProvider>
	);
}
