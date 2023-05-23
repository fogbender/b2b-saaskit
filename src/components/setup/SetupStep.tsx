import classNames from 'clsx';
import { useState } from 'react';

export function SetupStep({
	children,
	title,
	stepDone,
}: {
	children: React.ReactNode;
	title: string;
	stepDone?: boolean;
}) {
	const [expanded, setExpanded] = useState(false);

	return (
		<div className="w-full">
			<div
				className={classNames('ml-5 md:ml-0 w-full flex cursor-pointer', 'items-start', 'relative')}
				onClick={() => setExpanded((x) => !x)}
			>
				<div className="absolute top-5">{expanded ? <Chevron /> : <ChevronRight />}</div>
				<div
					className={classNames(
						'flex-1 ml-10 p-3 bg-white',
						'rounded-xl shadow-[0_3px_10px_rgba(19,29,118,0.1)]',
						'flex flex-col gap-6'
					)}
				>
					<div className="flex items-center justify-between">
						<div className="text-lg font-semibold">{title}</div>
						{stepDone && <span>✅</span>}
					</div>
					{expanded && (
						<div
							className="ml-2 cursor-auto prose prose-a:text-blue-600 hover:prose-a:text-rose-500 visited:prose-a:text-fuchsia-600"
							onClick={(e) => e.stopPropagation()}
						>
							{children}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function ChevronRight({ className = 'w-4 h-4' }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M1 1L8 8L1 15"
				stroke="black"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function Chevron({ className = 'w-4 h-4' }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M15 1L8 8L1 1"
				stroke="black"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
