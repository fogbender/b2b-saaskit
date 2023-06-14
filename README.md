# Welcome to the B2B SaaS Kit!

The B2B SaaS Kit is an open-source springboard for developers looking to quickly stand up a SaaS product where the customer can be a team of users (i.e., a business).

The kit uses TypeScript, Astro, React, Tailwind CSS, and a number of third-party services that take care of essential, yet peripheral requirements, such as secrets management, user authentication, a database, product analytics, customer support, and deployment infrastructure.

The kit is designed with two primary goals in mind:

1. Start with a fully-functional, relatively complex application. Then, modify it to become your own product.

2. You should be able to go from zero to idea validation verdict for the cost of a domain name - all the third-party services used by the kit offer meaningful free-forever starter plans.

## Why "B2B"?

"B2B" means "business-to-business". In the simplest terms, a B2B product is a product where post-signup, a user can create an organization, invite others, and do something as a team.

B2B companies are fairly common - for example, over 40% of <a href="https://www.ycombinator.com/companies" >Y Combinator-funded startups</a> self-identify as B2B - but B2B-specific starter kits appear to be quite rare, hence this effort.

## Get started

### High-level plan

- First, check out https://PromptsWithFriends.com - a web-based SaaS application that was built with this B2B SaaS Kit. _Prompts with Friends_ is a way to collaborate on GPT prompts with others

- Next, get your own copy of _Prompts with Friends_ running locally on your machine

- Then, learn how to deploy your version to production

- Lastly, build your own product by modifying the app

### Get it running locally

1. Install prerequisites

   - Node.js 18

2. Clone repo, start app

```
git clone git@github.com:fogbender/b2b-saaskit.git
cd b2b-saaskit
corepack enable
corepack prepare yarn@1.22.19 --activate
yarn
yarn dev
```

3. Open http://localhost:3000 in a browser tab - you should see a page titled "Welcome to Prompts with Friends"

4. You'll find detailed configuration instructions on http://localhost:3000/setup. Once you're here -

<img width="819" alt="image" src="https://github.com/fogbender/b2b-saaskit/assets/41166/a60efadc-0435-4bd9-ae65-ce516e808b02">

\- you should be able to have a working copy of _Prompts with Friends_ running on http://localhost:3000/app

### Deploy to production

### Make changes

### Vercel quick start

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ffogbender%2Fb2b-saaskit&project-name=my-prompts-with-friends&repository-name=my-prompts-with-friends&demo-title=Prompts%20With%20Friends&demo-description=Built%20with%20B2B%20SaaSKit.%20B2B%20Auth%2C%20OpenAI%2C%20SQL%2C%20Analytics%2C%20Support&demo-url=https%3A%2F%2Fpromptswithfriends.com%2F&demo-image=https%3A%2F%2Fpromptswithfriends.com%2Fog%3Ftitle%3DB2B%2BSaasKit%26description%3Dcreate%2Byour%2Bown%2Bfully%2Bfeatured%2Bapp%2Bin%2Bminutes&integration-ids=oac_UdMtwPpcN7yXVQsZFvMSQFy5)

## License

B2B SaaS Kit is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for more details.
