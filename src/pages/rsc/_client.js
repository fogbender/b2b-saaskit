import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(document, getInitialClientJSX());
let currentPathname = window.location.pathname;

async function navigate(pathname) {
	currentPathname = pathname;
	const clientJSX = await fetchClientJSX(pathname);
	if (pathname === currentPathname) {
		root.render(clientJSX);
	}
}

function getInitialClientJSX() {
	const clientJSX = JSON.parse(window.__INITIAL_CLIENT_JSX_STRING__, parseJSX);
	return clientJSX;
}

async function fetchClientJSX(pathname) {
	const response = await fetch(pathname + '?jsx');
	const clientJSXString = await response.text();
	const clientJSX = JSON.parse(clientJSXString, parseJSX);
	return clientJSX;
}

function parseJSX(key, value) {
	if (value === '$RE') {
		return Symbol.for('react.element');
	} else if (typeof value === 'string' && value.startsWith('$$')) {
		return value.slice(1);
	} else {
		return value;
	}
}

window.addEventListener(
	'click',
	(e) => {
		if (e.target.tagName !== 'A') {
			return;
		}
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
			return;
		}
		const href = e.target.getAttribute('href');
		if (!href.startsWith('/')) {
			return;
		}
		e.preventDefault();
		window.history.pushState(null, null, href);
		navigate(href);
	},
	true
);

window.addEventListener('popstate', () => {
	navigate(window.location.pathname);
});
