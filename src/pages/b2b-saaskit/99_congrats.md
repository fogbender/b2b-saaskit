### Everything is configured!

Now you have finished the tutorial you should have everything running locally. Good next step would be to deploy your project to Vercel. You can do that by following these steps:

1. Switch to production environment in Doppler with `doppler setup`.
2. Configure production secrets, make sure that you can build the project locally with `doppler run yarn build`.
3. Publish your project to github.
4. Link your github project to Vercel.
5. Configure Vercel to use production secrets from Doppler using [Vercel integration](https://www.doppler.com/integrations/vercel) also check out [the docs here](https://docs.doppler.com/docs/vercel).
6. Deploy your project to Vercel.
7. Now you can switch back to development environment in Doppler with `doppler setup` and continue developing your project.
