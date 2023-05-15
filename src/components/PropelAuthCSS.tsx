import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import src from '@propelauth/base-elements/dist/default.css';
import { BetaComponentLibraryProvider } from './propelauth';
import { BaseElements } from '@propelauth/base-elements';

export function PropelAuthCSS({ children }: { children: React.ReactNode }) {
	return (
		<BetaComponentLibraryProvider elements={BaseElements}>
			<IsolateCSS>
				<style>{src}</style>
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
