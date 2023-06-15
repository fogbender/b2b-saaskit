import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { env } from '../../config';
import { SupportWidget } from '../fogbender/Support';
import {
	saveOrgSelectionToLocalStorage,
	useLogoutFunction,
	useRedirectFunctions,
	useRequireActiveOrg,
} from '../propelauth';

export function AppNav() {
	const menuRef = useRef<HTMLDivElement>(null);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { auth, activeOrg } = useRequireActiveOrg();
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

	return (
		<header className="bg-white px-5 py-4 shadow-sm">
			<div className="container mx-auto flex items-center justify-between text-sm">
				<nav className="flex flex-wrap space-x-4">
					<NavLink to="/app" end className={navLinkClass}>
						Overview
					</NavLink>
					<NavLink to="/app/prompts" className={navLinkClass}>
						Prompts
					</NavLink>
					<NavLink to="/app/settings" className={navLinkClass}>
						Settings
					</NavLink>
					<NavLink to="/app/support" className={navLinkClassSupport}>
						Support
						{path !== '/app/support' && <SupportWidget kind="badge" />}
					</NavLink>
				</nav>
				<div className="relative inline-block text-left" ref={menuRef}>
					<button
						className="flex items-center rounded-full"
						type="button"
						aria-expanded={isMenuOpen}
						aria-haspopup="true"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						<img
							src={pictureUrl}
							alt="current user"
							className="h-8 w-8 rounded-full object-contain"
							id="userMenuButton"
						/>
					</button>

					<div
						className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
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
									className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
									role="menuitem"
								>
									Your organization ({activeOrg.orgName})
								</a>
							)}
							<button
								onClick={() => {
									saveOrgSelectionToLocalStorage('');
									window.location.reload();
								}}
								className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
								role="menuitem"
							>
								Switch organization
							</button>
							<button
								onClick={() => logout(true)}
								className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
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

const getNavLinkClass =
	(className?: string) =>
	({ isActive, isPending }: { isActive: boolean; isPending: boolean }) =>
		clsx(
			'text-gray-600 hover:text-gray-900',
			'px-2 py-0.5',
			'border rounded-full',
			className,
			isPending ? 'animate-pulse' : '',
			isActive || isPending ? 'border-gray-800' : 'border-transparent'
		);

const navLinkClass = getNavLinkClass();
const navLinkClassSupport = getNavLinkClass('flex gap-px');
