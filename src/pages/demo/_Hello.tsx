import React from 'react';

export function Hello({ prefix, children }: { prefix: string; children: React.ReactNode }) {
	const [name, _setName] = React.useState('llo');
	return (
		<>
			<div>
				{prefix}
				{name}
			</div>
			{children}
		</>
	);
}
