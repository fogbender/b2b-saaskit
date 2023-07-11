import { BaseElements } from '@propelauth/base-elements';
import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { BetaComponentLibraryProvider } from './propelauth';

export function PropelAuthCSS({ children }: { children: React.ReactNode }) {
	const css = 'https://unpkg.com/@propelauth/base-elements@0.0.16/dist/default.css';
	return (
		<BetaComponentLibraryProvider elements={BaseElements}>
			<link rel="preload" as="style" href={css} />
			<IsolateCSS>
				<link rel="stylesheet" href={css} />
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
