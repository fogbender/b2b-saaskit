// MIT License
// Copyright (c) 2022 Shoubhit Dash
// https://github.com/t3-oss/create-t3-app/blob/next/LICENSE

type OpenGraphPromptProps = {
	title: string;
	description: string;
	originUrl: string;
	chatTemplate: string | null;
};

export default function OpenGraphPrompt({
	title,
	description,
	originUrl,
	chatTemplate,
}: OpenGraphPromptProps) {
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
					backgroundColor: '#e9d8f7cc',
					position: 'absolute',
					display: 'flex',
					top: 0,
					width: '1200px',
					height: '630px',
					justifyContent: 'center',
					alignItems: 'flex-start',
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'flex-start',
						gap: '0.7rem',
						padding: '2rem',
						width: '1200px',
					}}
				>
					<h1
						style={{
							textAlign: 'left',
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
							wordBreak: 'break-word',
						}}
					>
						{description}
					</h2>
					<h3
						style={{
							fontFamily: 'Montserrat',
							color: '#270158',
							fontSize: '30px',
							fontWeight: 600,
							wordBreak: 'break-word',
							whiteSpace: 'pre-wrap',
						}}
					>
						{chatTemplate}
					</h3>
				</div>
			</div>
		</div>
	);
}
