/** @jsxImportSource solid-js */

import { createSignal } from 'solid-js';

export function DetailsBody2() {
	const [count, setCount] = createSignal(0);

	setInterval(() => {
		setCount(count() + 1);
	}, 1000);

	// console.log('DetailsBody');
	return <div>second file {count()}</div>;
	// return <div>123 </div>;
}
