import classNames from 'clsx';
import { useState, useEffect, useRef } from 'react';
import {
	requireActiveOrg,
	saveOrgSelectionToLocalStorage,
	useLogoutFunction,
	useRedirectFunctions,
} from '../propelauth';
import { env } from '../../config';
import { SupportWidget } from '../fogbender/Support';

export function AppNav() {
	const menuRef = useRef<HTMLDivElement>(null);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { auth, activeOrg } = requireActiveOrg();
	const { redirectToOrgPage, redirectToAccountPage } = useRedirectFunctions();
	const user = auth.loading === false ? auth.user : undefined;
	const defaultUrl = 'https://img.propelauth.com/2a27d237-db8c-4f82-84fb-5824dfaedc87.png';
	const pictureUrl = user?.pictureUrl || defaultUrl;
	const logout = useLogoutFunction();

	const [path, setPath] = useState(undefined as undefined | string);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setPath(window.location.pathname);
		}
	}, []);

	useEffect(() => {
		const closeMenu = (e: { target: EventTarget | null }) => {
			if (e.target instanceof Node && menuRef.current?.contains(e.target) === false) {
				setIsMenuOpen(false);
			}
		};
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setIsMenuOpen(false);
			}
		};
		if (isMenuOpen) {
			document.addEventListener('click', closeMenu);
			document.addEventListener('keydown', handleEscape);
		}
		return () => {
			document.removeEventListener('click', closeMenu);
			document.removeEventListener('keydown', handleEscape);
		};
	}, [isMenuOpen]);

	const activeCls = 'border border-gray-800 rounded-full';

	return (
		<header className="bg-white shadow-sm py-4 px-5">
			<div className="container mx-auto flex justify-between items-center">
				<nav className="flex flex-wrap space-x-4">
					<a
						href="/app"
						className={classNames(
							'text-gray-600 hover:text-gray-900',
							'px-2 py-1',
							'/app' === path ? activeCls : 'border border-transparent'
						)}
					>
						Overview
					</a>
					<a
						href="/app/prompts"
						className={classNames(
							'text-gray-600 hover:text-gray-900',
							'px-2 py-1',
							'/app/prompts' === path ? activeCls : 'border border-transparent'
						)}
					>
						Prompts
					</a>
					<a
						href="/app/settings"
						className={classNames(
							'text-gray-600 hover:text-gray-900',
							'px-2 py-1',
							'/app/settings' === path ? activeCls : 'border border-transparent'
						)}
					>
						Settings
					</a>
					<a
						href="/app/support"
						className={classNames(
							'text-gray-600 hover:text-gray-900 flex gap-px px-2 py-1',
							'/app/support' === path ? activeCls : 'border border-transparent'
						)}
					>
						Support
						{path !== '/app/support' && <SupportWidget kind="badge" />}
					</a>
				</nav>
				<div className="relative inline-block text-left" ref={menuRef}>
					<button
						className="rounded-full flex items-center"
						type="button"
						aria-expanded={isMenuOpen}
						aria-haspopup="true"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						<img
							src={pictureUrl}
							alt="User Image"
							className="object-contain h-8 w-8 rounded-full"
							id="userMenuButton"
						/>
					</button>

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
								onClick={(e) => {
									e.preventDefault();
									redirectToAccountPage();
								}}
								className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								role="menuitem"
							>
								Account
							</a>
							{activeOrg && (
								<a
									href={env.PUBLIC_AUTH_URL + '/org'}
									onClick={(e) => {
										e.preventDefault();
										redirectToOrgPage();
									}}
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
									role="menuitem"
								>
									Your Team ({activeOrg.orgName})
								</a>
							)}
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
