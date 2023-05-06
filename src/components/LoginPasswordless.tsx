import { AuthProvider, BetaComponentLibraryProvider, LoginPasswordless } from './propelauth';

import { BaseElements } from '@propelauth/base-elements';
import '@propelauth/base-elements/dist/default.css';
import { env } from '../config';

export function Login() {
	return (
		<AuthProvider authUrl={env.PUBLIC_AUTH_URL}>
			<BetaComponentLibraryProvider elements={BaseElements}>
				<LoginPasswordless />
			</BetaComponentLibraryProvider>
		</AuthProvider>
	);
}
