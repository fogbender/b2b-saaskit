import {
	Outlet,
	RouterProvider,
	Link,
	Router,
	Route,
	RootRoute,
	useNavigate,
} from '@tanstack/router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { StrictMode, useState } from 'react';

export function Survey() {
	return (
		<StrictMode>
			<RouterProvider router={router} />
		</StrictMode>
	);
}

// Create a root route
const rootRoute = new RootRoute();

// Create an index route
const indexRoute = new Route({
	getParentRoute: () => rootRoute,
	path: 'survey',
	component: Index,
});

const surveyRoute = new Route({
	getParentRoute: () => indexRoute,
	path: '/',
	component: StartSurvey,
});

const rateExperienceRoute = new Route({
	getParentRoute: () => indexRoute,
	path: 'rate-experience',
	component: RateExperience,
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([
	indexRoute.addChildren([
		//
		surveyRoute,
		rateExperienceRoute,
	]),
]);

// Create the router using your route tree
const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module '@tanstack/router' {
	interface Register {
		router: typeof router;
	}
}

function Index() {
	return (
		<div>
			<h3>Welcome Home!</h3>
			<Outlet />
			{import.meta.env.DEV && <TanStackRouterDevtools initialIsOpen={false} />}
		</div>
	);
}

function StartSurvey() {
	return (
		<div className="flex items-center justify-center h-screen">
			<Link
				to="/survey/rate-experience"
				className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
			>
				Start Survey
			</Link>
		</div>
	);
}

function RateExperience() {
	const [rating, setRating] = useState('');
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h2 className="text-2xl mb-4">Please rate your experience from 1 to 5</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					console.log(`Rating: ${rating}`);
					navigate({ to: '/survey' });
				}}
				className="w-64"
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
