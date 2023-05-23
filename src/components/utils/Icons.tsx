type Icon = React.FC<{
	className?: string;
	solidColor?: string;
	strokeWidth?: string;
	disabled?: boolean;
}>;

export const ClipboardIcon: Icon = ({ className = 'w-4' }) => {
	return (
		<svg className={className} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M5 13H3C2.46957 13 1.96086 12.7893 1.58579 12.4142C1.21071 12.0391 1 11.5304 1 11V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H11C11.5304 1 12.0391 1.21071 12.4142 1.58579C12.7893 1.96086 13 2.46957 13 3V5M7 17H15C15.5304 17 16.0391 16.7893 16.4142 16.4142C16.7893 16.0391 17 15.5304 17 15V7C17 6.46957 16.7893 5.96086 16.4142 5.58579C16.0391 5.21071 15.5304 5 15 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V15C5 15.5304 5.21071 16.0391 5.58579 16.4142C5.96086 16.7893 6.46957 17 7 17Z"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};
