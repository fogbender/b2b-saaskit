import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { BetaComponentLibraryProvider } from './propelauth';
import { BaseElements } from '@propelauth/base-elements';

export function PropelAuthCSS({ children }: { children: React.ReactNode }) {
	return (
		<BetaComponentLibraryProvider elements={BaseElements}>
			<IsolateCSS>
				<link
					rel="stylesheet"
					href="https://unpkg.com/@propelauth/base-elements@0.0.16/dist/default.css"
				/>
				{children}
			</IsolateCSS>
		</BetaComponentLibraryProvider>
	);
}

export function IsolateCSS(props: { children: React.ReactNode }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const onceRef = useRef(false);
	const [popupContainer, setPopupContainer] = useState<ShadowRoot>();

	useEffect(() => {
		const container = containerRef.current;
		if (container && onceRef.current === false) {
			onceRef.current = true;
			setPopupContainer(container.attachShadow({ mode: 'open' }));
		}
	}, []);

	return (
		<div ref={containerRef}>{popupContainer && createPortal(props.children, popupContainer)}</div>
	);
}
