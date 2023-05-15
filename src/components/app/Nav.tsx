import { useState } from 'react';
import { saveOrgSelectionToLocalStorage, useAuthInfo, useLogoutFunction } from '../propelauth';
import { env } from '../../config';

export function AppNav() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const auth = useAuthInfo();
	const user = auth.loading === false ? auth.user : undefined;
	const defaultUrl = 'https://img.propelauth.com/2a27d237-db8c-4f82-84fb-5824dfaedc87.png';
	const pictureUrl = user?.pictureUrl || defaultUrl;
	const logout = useLogoutFunction();

	return (
		<header className="bg-white shadow-sm py-4 px-5">
			<div className="container mx-auto flex justify-between items-center">
				<nav className="flex space-x-4">
					<a href="/app" className="text-gray-600 hover:text-gray-900">
						Overview
					</a>
					<a href="/app/prompts" className="text-gray-600 hover:text-gray-900">
						Prompts
					</a>
					<a href="/app/settings" className="text-gray-600 hover:text-gray-900">
						Settings
					</a>
				</nav>
				<div className="relative inline-block text-left">
					<img
						src={pictureUrl}
						alt="User Image"
						className="h-8 w-8 rounded-full cursor-pointer"
						id="userMenuButton"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					/>

					<div
						className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
						id="userMenu"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="userMenuButton"
						hidden={isMenuOpen === false}
					>
						<div className="py-1" role="none">
							<a
								href={env.PUBLIC_AUTH_URL + '/account'}
								className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								role="menuitem"
							>
								Account
							</a>
							<button
								onClick={() => {
									saveOrgSelectionToLocalStorage('');
									window.location.reload();
								}}
								className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
								role="menuitem"
							>
								Switch Organization
							</button>
							<button
								onClick={() => logout(true)}
								className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
								role="menuitem"
							>
								Sign out
							</button>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
