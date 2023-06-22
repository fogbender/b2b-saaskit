---
title: "Payments with Stripe (optional)"
needsEnv: ["STRIPE_PRICE_ID", "STRIPE_SECRET_KEY"]
---

Stripe (<a href="https://stripe.com" >https://stripe.com</a>) is a payments platform that makes it relatively easy to manage subscriptions in a B2B product.

Stripe makes money whenever you do, by charging a small fee per successful transaction. For details, see <a href="https://stripe.com/pricing">https://stripe.com/pricing</a>.

It takes some effort to open a Stripe account, with details falling outside the scope of this tutorial - we'll assume you've got access to a Stripe account in good standing.

1. While developing locally, you can use Stripe's "Test mode" to avoid experimenting with real customers or payments

1. Navigate to <a href="https://dashboard.stripe.com/test/apikeys">https://dashboard.stripe.com/test/apikeys</a>, locate "Secret key" and store it with `doppler secrets set STRIPE_SECRET_KEY`

1. Create a product of type "subscription" and store its API ID with `doppler secrets set STRIPE_PRICE_ID`

1. Restart `doppler run yarn dev` to move to the next section of the tutorial

At this point, you should be able purchase a (test) subscription on http://localhost:3000/app/settings. For test card numbers, see <a href="https://stripe.com/docs/testing">https://stripe.com/docs/testing</a>.
