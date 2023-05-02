### Step 4: Fogbender

Fogbender is a customer support tool designed specifically for B2B businesses. With its advanced communication model, Fogbender enables many-to-many conversations, allowing entire teams within customer accounts to collaborate with your support agents, instead of just individual end-users.

1. Go to the [Embedding instructions page](https://fogbender.com/admin/-/-/settings/embed) and copy `widgetId` and `Secret` from the top of the instructions.

2. Now set `PUBLIC_FOGBENDER_WIDGET_ID` to the value of widgetId. You can use Doppler UI or CLI to do that. If you are using CLI you can run `doppler secrets set PUBLIC_FOGBENDER_WIDGET_ID`.

3. Secret would be stored in `FOGBENDER_SECRET`. You can use Doppler UI or CLI to do that. If you are using CLI you can run `doppler secrets set FOGBENDER_SECRET`.

4. Now restart `doppler run yarn dev` and you should see the next section of the tutorial.
