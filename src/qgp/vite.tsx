import '../styles/tailwind.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { Root } from '../components/app/Root';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
	<React.StrictMode>
		<Root />
	</React.StrictMode>
);
