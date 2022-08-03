# cAutoh

Track your Carbon Dioxide emissions while driving

Demonstration video: https://youtu.be/m0cx_Orydpg

# Usage

## No account on Hedera? No problem

To try out the app without needing a testnet account on the Hedera blockchain, go to the app URL in the top-right of this page with your mobile phone. The best browser experience is usually with Chrome.

Once launching the app on your phone, Click "Link with Mobile" then "On Mobile: Scan Code", give the app camera permission and scan the code below to link a prepared test account:

![QR code](./qr-cautoh.PNG)

Now you're ready to set up a vehicle and start tracking! See the video linked to above for how to use.

## Use with a Hedera account

See the next sections on how to create a testnet account if you do not already have one. Then consult the demo video linked to above.

# How to run

## Secure local dev environment

Use a tool like `mkcert` to generate SSL certificates for your dev environment. Paste the generated `.pem` files to the `src/api` directory and update the `.env` file accordingly

If you do not have a Hedera testnet account, head over to [portal.hedera.com](https://portal.hedera.com/?network=testnet) and create one. Use those credentials for the OP_ID and OP_SK (private key) `.env` variables

Now you can run

```
yarn
yarn dev
```

and open https://localhost:3000
Running from the `main` branch will record demo speed data on the 'compute' page. The `staging` branch records actual geolocation speeds when given permission

# Permissions

This dApp requires camera and geolocation permissions to work properly
