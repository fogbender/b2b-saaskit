/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import ReactDom from 'react-dom';

const useFormStatus = (
	ReactDom as any as {
		experimental_useFormStatus: () => {
			pending: boolean;
			data: FormData | null;
			method: 'get' | 'post' | null;
			action: ((formData: FormData) => Promise<void>) | null;
		};
	}
).experimental_useFormStatus;

export const Test = () => {
	const { status, Listener } = useChildFormStatus();
	const { pending } = status;
	return (
		<form
			// @ts-ignore
			action={async (formData: FormData) => {
				await new Promise((resolve) => setTimeout(resolve, 300));
				for (const [key, value] of formData) {
					console.log(key, value);
				}
			}}
		>
			<input type="text" name="name" />
			<Submit />
			<Submit2 />
		</form>
	);
};

const Submit = () => {
	const { pending } = useFormStatus();
	return <input name="submit" type="submit" value="Submit" disabled={pending} />;
};

const Submit2 = () => {
	const { pending } = useFormStatus();
	return <input name="submit2" type="submit" value="Submit2" disabled={pending} />;
};

const useChildFormStatus = () => {
	const [status, setStatus] = React.useState<ReturnType<typeof useFormStatus>>({
		pending: false,
		data: null,
		method: null,
		action: null,
	});
	const Listener = React.useCallback(() => {
		const currentStatus = useFormStatus();
		React.useEffect(() => {
			setStatus(currentStatus);
		}, [currentStatus]);
		return null;
	}, [setStatus]);
	return { status, Listener };
};

// unfortunately this doesn't work
declare module 'react' {
	interface AllHTMLAttributes<T> {
		// @ts-ignore
		action?: string | ((form: FormData) => Promise<void>);
	}
}
