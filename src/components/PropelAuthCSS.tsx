import { createPortal } from 'react-dom';
import { useCallback, useRef, useState } from 'react';
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
	const onceRef = useRef(false);
	const [shadowRoot, setShadowRoot] = useState<ShadowRoot>();
	const ref = useCallback((ref: HTMLDivElement | null) => {
		if (ref && onceRef.current === false) {
			onceRef.current = true;
			setShadowRoot(ref.attachShadow({ mode: 'open' }));
		}
	}, []);

	return <div ref={ref}>{shadowRoot && createPortal(props.children, shadowRoot)}</div>;
}
