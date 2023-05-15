---
title: "Customer support with Fogbender (optional)"
needsEnv: ["PUBLIC_FOGBENDER_WIDGET_ID", "FOGBENDER_SECRET"]
---

Fogbender (<a href="https://fogbender.com" target="_blank">https://fogbender.com</a>) is a B2B customer support tool that enables users associated with the same customer organization to collaborate in vendor support conversations as a team.

Fogbender is free for 2 customer-facing agents and unlimited "readers" (agents with read-only access to customer conversations).

1. Open the <a href="https://fogbender.com/admin/-/-/settings/embed" target="_blank">embedding instructions</a> and copy the `widgetId` (look for text with light green background)

2. Run `doppler secrets set PUBLIC_FOGBENDER_WIDGET_ID` and paste the widgetId as the value

3. Go back to the <a href="https://fogbender.com/admin/-/-/settings/embed" target="_blank">embedding instructions</a> and copy the `Secret`

4. Run `doppler secrets set FOGBENDER_SECRET` and paste the secret as the value

5. Restart `doppler run yarn dev` to move to the next section of the tutorial
