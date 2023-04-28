import { AuthProvider, BetaComponentLibraryProvider, LoginPasswordless } from '@propelauth/react';

import { BaseElements } from '@propelauth/base-elements';
import '@propelauth/base-elements/dist/default.css';

export function Login() {
	return (
		<AuthProvider authUrl={import.meta.env.PUBLIC_AUTH_URL}>
			<BetaComponentLibraryProvider elements={BaseElements}>
				<LoginPasswordless />
			</BetaComponentLibraryProvider>
		</AuthProvider>
	);
}
