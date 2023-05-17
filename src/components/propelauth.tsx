import propel from '@propelauth/react';
import * as propel2 from '@propelauth/react';
import { useEffect } from 'react';

const {
	AuthProvider,
	useActiveOrg,
	useAuthInfo,
	saveOrgSelectionToLocalStorage,
	useRedirectFunctions,
	BetaComponentLibraryProvider,
	Signup,
	LoginPasswordless,
	useLogoutFunction,
	LoginManager,
} = propel || propel2;

export function requireActiveOrg() {
	const auth = useAuthInfo();
	const activeOrg = useActiveOrg();
	useEffect(() => {
		if (auth.loading === false) {
			if (!auth.user || !activeOrg) {
				if (window.location.pathname !== '/app') {
					window.location.pathname = '/app';
				}
			}
		}
	}, [auth, activeOrg]);
	return { auth, activeOrg };
}

export {
	AuthProvider,
	useActiveOrg,
	useAuthInfo,
	saveOrgSelectionToLocalStorage,
	useRedirectFunctions,
	BetaComponentLibraryProvider,
	Signup,
	LoginPasswordless,
	useLogoutFunction,
	LoginManager,
};
