/* eslint-disable @typescript-eslint/ban-ts-comment */
import { readdir, readFile } from 'fs/promises';
import sanitizeFilename from 'sanitize-filename';

const postsDir = './src/pages/rsc/rsc-server/_posts';
const prefixUrl = '/rsc/ssr-server/';

export function Router({ url }: { url: URL }) {
	let page;
	if (url.pathname === '/') {
		// @ts-expect-error
		page = <BlogIndexPage />;
	} else {
		const postSlug = sanitizeFilename(url.pathname.slice(1));
		page = <BlogPostPage postSlug={postSlug} />;
	}
	return <BlogLayout>{page}</BlogLayout>;
}
function BlogLayout({ children }: { children: React.ReactNode }) {
	const author = 'Jae Doe';
	return (
		<html>
			<head>
				<title>My blog</title>
			</head>
			<body>
				<nav>
					<a href={prefixUrl}>Home</a>
					<hr />
					<input />
					<hr />
				</nav>
				<main>{children}</main>
				<Footer author={author} />
			</body>
		</html>
	);
}

function Footer({ author }: { author: string }) {
	return (
		<footer>
			<hr />
			<p>
				<i>
					(c) {author} {new Date().getFullYear()}
				</i>
			</p>
		</footer>
	);
}

async function BlogIndexPage() {
	const postFiles = await readdir(postsDir);
	console.log(postFiles);
	const postSlugs = postFiles.map((file) => file.slice(0, file.lastIndexOf('.')));
	return (
		<section>
			<h1>Welcome to my blog</h1>
			<div>
				{postSlugs.map((slug) => (
					// @ts-expect-error
					<Post key={slug} slug={slug} />
				))}
			</div>
		</section>
	);
}

function BlogPostPage({ postSlug }: { postSlug: string }) {
	// @ts-expect-error
	return <Post slug={postSlug} />;
}

async function Post({ slug }: { slug: string }) {
	let content;
	try {
		content = await readFile(postsDir + '/' + slug + '.txt', 'utf8');
	} catch (err) {
		throwNotFound(err);
	}
	return (
		<section>
			<h2>
				<a href={prefixUrl + '' + slug}>{slug}</a>
			</h2>
			<article>{content}</article>
		</section>
	);
}

function throwNotFound(cause: unknown) {
	const notFound = new Error('Not found.', { cause }) as Error & { statusCode: number };
	notFound.statusCode = 404;
	throw notFound;
}
