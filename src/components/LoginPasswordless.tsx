import { AuthProvider, LoginPasswordless } from './propelauth';

import { env } from '../config';
import { PropelAuthCSS } from './PropelAuthCSS';

export function Login() {
	return (
		<AuthProvider authUrl={env.PUBLIC_AUTH_URL}>
			<PropelAuthCSS>
				<LoginPasswordless />
			</PropelAuthCSS>
		</AuthProvider>
	);
}
