/** @jsxImportSource solid-js */

import { createSignal } from 'solid-js';

import { DetailsBody2 } from './DetailsBod2';

export function DetailsBody() {
	const [count, setCount] = createSignal(0);

	setInterval(() => {
		setCount(count() + 1);
	}, 1000);

	// console.log('DetailsBody');
	return (
		<div>
			hello {count()} <DetailsBody2></DetailsBody2>
		</div>
	);
	// return <div>123 </div>;
}
