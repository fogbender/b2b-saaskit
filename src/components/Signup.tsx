import { AuthProvider, Signup as SignupManager } from './propelauth';

import { env } from '../config';
import { PropelAuthCSS } from './PropelAuthCSS';

export function Signup() {
	const redirectToYourProduct = () => {
		window.location.href = '/app';
	};
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
