export const Layout = (props: {
	//
	title?: string;
	children: React.ReactNode;
}) => {
	return (
		<div className="container mt-8 px-4">
			{props.title && <h3 className="text-2xl font-bold">{props.title}</h3>}
			{props.children}
		</div>
	);
};
