# Welcome to the B2B SaaS Kit!

The B2B SaaS Kit is a springboard for developers looking to quickly stand up a SaaS product where the customer can be a team of users (i.e., a business).

The kit uses TypeScript, Astro, React, Tailwind CSS, and a number of third-party services that take care of essential, yet peripheral requirements, such as secrets management, user authentication, a database, product analytics, customer support, and deployment infrastructure.

The kit is designed with two primary goals in mind:

1. Start with a fully-functional, relatively complex application. Then, modify it to become your own product.

2. You should be able to go from zero to idea validation verdict for the cost of a domain name - all the third-party services used by the kit offer meaningful free-forever starter plans.

## Why "B2B"?

"B2B" means "business-to-business". In the simplest terms, a B2B product is a product where post-signup, a user can create an organization, invite others, and do something as a team.

B2B companies are fairly common - for example, over 40% of <a href="https://www.ycombinator.com/companies" target="_blank">Y Combinator-funded startups</a> self-identify as B2B - but B2B-specific starter kits appear to be quite rare, hence this effort.

## Get started

### High-level plan

First, check out https://promptswithfriends.com - it's a web-based SaaS application that was built with the B2B SaaS Kit. Prompts with Friends is a way to collaborate on GPT prompts with others.

Next, get your own copy of Prompts with Friends running locally on your machine.

Then, learn how to deploy your version to production.

Lastly, build your own product by modifying the app.

### Get it running locally

1. Install prerequisites
   - Node.js 18

2. Clone repo, start app

```
$ git clone git@github.com:fogbender/b2b-saaskit.git

$ cd b2b-saaskit

$ corepack enable

$ corepack prepare yarn@1.22.19 --activate

$ yarn dev
```

### Follow setup instructions

Open http://localhost:3000 in a browser tab and follow setup instructions.

### Deploy to production

### Make changes

## Third-party services overview

### Secrets management

### User authentication

### Database

### Product analytics

### Customer support

### Hosting and deployment infrastructure

### Other services to consider

- Error tracking
- Backend monitoring
- Incident response

## Custom code

## Prompts with Friends frontend teardown

## Prompts with Friends backend teardown

## License

B2B SaaS Kit is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for more details.
