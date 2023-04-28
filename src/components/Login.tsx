import { AuthProvider, BetaComponentLibraryProvider, LoginManager } from '@propelauth/react';

import { BaseElements } from '@propelauth/base-elements';
import '@propelauth/base-elements/dist/default.css';

export function Login() {
	const redirectToYourProduct = () => {
		window.location.href = '/';
	};
	return (
		<AuthProvider authUrl={import.meta.env.PUBLIC_AUTH_URL}>
			<BetaComponentLibraryProvider elements={BaseElements}>
				<LoginManager
					onLoginCompleted={redirectToYourProduct}
					onRedirectToPasswordlessLogin={() => {
						window.location.href = '/login-passwordless';
					}}
				/>
			</BetaComponentLibraryProvider>
		</AuthProvider>
	);
}
