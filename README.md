# cAutoh

Track your Carbon Dioxide emissions while driving

Demonstration video: https://youtu.be/m0cx_Orydpg

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

## Permissions

This dApp requires camera and geolocation permissions to work properly

## Usage

Please consult the demo video as link to above, I will work on getting a better quality one uploaded soon
