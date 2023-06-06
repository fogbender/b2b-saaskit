// MIT License
// Copyright (c) 2022 Shoubhit Dash
// https://github.com/t3-oss/create-t3-app/blob/next/LICENSE

type OpenGraphPromptProps = {
	title: string;
	description: string;
	originUrl: string;
};

export default function OpenGraphPrompt({ title, description, originUrl }: OpenGraphPromptProps) {
	return (
		<div
			style={{
				display: 'flex',
				width: '1200px',
				height: '630px',
			}}
		>
			<img
				src={originUrl + '/og/background.png'}
				style={{
					position: 'absolute',
				}}
				width="1200"
				height="630"
			/>
			<div
				style={{
					position: 'absolute',
					display: 'flex',
					top: 0,
					width: '1200px',
					height: '300px',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: '0.7rem',
						padding: '1rem',
						maxWidth: '1200px',
					}}
				>
					<h1
						style={{
							textAlign: 'center',
							fontSize: title.length > 15 ? '70px' : '90px',
							fontFamily: 'Montserrat',
							lineHeight: '4rem',
							fontWeight: 600,
							color: '#37007D',
							wordBreak: 'break-word',
						}}
					>
						{title}
					</h1>
					<h2
						style={{
							fontFamily: 'Montserrat',
							color: '#37007D',
							fontSize: '40px',
							fontWeight: 600,
							textAlign: 'center',
							wordBreak: 'break-word',
						}}
					>
						{description}
					</h2>
				</div>
			</div>
		</div>
	);
}
