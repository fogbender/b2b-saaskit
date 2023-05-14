import { StrictMode, useState } from 'react';
import { Link, createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';

export const routes = () => [
	{
		path: '/survey',
		element: <StartSurvey />,
	},
	{
		path: '/survey/rate-experience',
		element: <RateExperience />,
	},
	{
		path: '/survey/optional-comments',
		element: <OptionalComments />,
	},
	{
		path: '/survey/thank-you',
		element: <ThankYou />,
	},
	{
		path: '/survey/published',
		element: <Published />,
	},
];

const router = createBrowserRouter(routes());

export function Survey() {
	return (
		<StrictMode>
			<RouterProvider router={router} />
		</StrictMode>
	);
}

function StartSurvey() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<div className="flex mb-4 gap-4">
				<Link
					to="/survey/rate-experience"
					className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
				>
					Start survey
				</Link>
				<Link
					to="/survey/published"
					className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
				>
					Public surveys
				</Link>
			</div>
			<a href="/" className="text-blue-500 hover:underline">
				Return to home page
			</a>
		</div>
	);
}

function RateExperience() {
	const [rating, setRating] = useState('');
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h2 className="text-2xl mb-4 px-8">Please rate your experience from 1 to 5</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					console.log(`Rating: ${rating}`);
					navigate('/survey/optional-comments');
				}}
				className="w-full px-8 sm:w-96"
			>
				<input
					type="number"
					min="1"
					max="5"
					value={rating}
					onChange={(e) => setRating(e.target.value)}
					className="w-full px-3 py-2 mb-4 border border-gray-200 rounded-md"
					required
				/>
				<button
					type="submit"
					className="w-full px-3 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
				>
					Next
				</button>
			</form>
			<Link to="/survey" className="mt-4 text-blue-500 hover:underline">
				Back
			</Link>
		</div>
	);
}

function OptionalComments() {
	const [comment, setComment] = useState('');
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h2 className="text-2xl mb-4">Any comments or suggestions?</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					console.log(`Comment: ${comment}`);
					navigate('/survey/thank-you');
				}}
				className="w-full px-8 sm:w-96"
			>
				<textarea
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					className="w-full px-3 py-2 mb-2 border border-gray-200 rounded-md"
				/>
				<fieldset className="mb-2">
					<label>
						<input type="checkbox" className="mr-2" />
						Makes it public{' '}
						<span className="text-sm">(your comment will be visible to everyone)</span>
					</label>
				</fieldset>
				<button
					type="submit"
					className="w-full px-3 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
				>
					Submit
				</button>
			</form>
			<Link to="/survey/rate-experience" className="mt-4 text-blue-500 hover:underline">
				Back
			</Link>
		</div>
	);
}

function ThankYou() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h2 className="text-2xl mb-4">Thank you for participating in our survey!</h2>
			<Link to="/survey" className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
				Return back to survey home page
			</Link>
		</div>
	);
}

function Published() {
	return (
		<div className="flex flex-col items-center justify-center py-20">
			<h2 className="text-2xl mb-4">Thank you to everyone who participated in the survey</h2>
			<Link to="/survey" className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
				Return back to survey home page
			</Link>
			<div className="my-4 w-full sm:w-[500px] lg:w-[800px]">
				<h3 className="text-xl mb-2">Comments</h3>
				<ul className="list-disc list-inside">
					<li>
						1 out of 5 on Tuesday, 12:00
						<br />
						<span className="text-sm">This is a comment</span>
					</li>
					<li>
						1 out of 5 on Tuesday, 12:00
						<br />
						<span className="text-sm">This is a comment</span>
					</li>
					<li>
						1 out of 5 on Tuesday, 12:00
						<br />
						<span className="text-sm">This is a comment</span>
					</li>
					<li>
						1 out of 5 on Tuesday, 12:00
						<br />
						<span className="text-sm">This is a comment</span>
					</li>
					<li>
						1 out of 5 on Tuesday, 12:00
						<br />
						<span className="text-sm">This is a comment</span>
					</li>
				</ul>
			</div>
			<Link to="/survey" className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
				Return back to survey home page
			</Link>
		</div>
	);
}
