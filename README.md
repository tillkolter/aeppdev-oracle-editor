# aeppdev-oracle-editor

VueJs based Æternity Oracles connector to develop and test oracles.

For more information on Æternity oracles read [this](https://github.com/aeternity/protocol/blob/master/epoch/api/oracle_api_usage.md)

## Usage

For a brief introduction video of the usage workflow please click on the image below 
[![Oracle Editor Introduction](https://user-images.githubusercontent.com/590062/35821941-fdd24f5a-0aaa-11e8-8e8d-0b4435a195e2.png)](https://www.youtube.com/watch?v=rfZ_moWlPhg)

## Configuration

This section contains notes on Æternity specific configuration. For building instructions please read the section below.

**IMPORTANT:** Before you can start the dev server please make sure that you have set up a local Æternity Epoch testnet node with a tuned mining interval. Find a detailed instruction [here](https://github.com/aeternity/dev-tools/blob/master/INSTALL.md). If you are having any difficulties, please dont hesitate to get in touch!

Before you can test the Oracle editor you have to make sure, that your local node is running *and mining!*

To set up the editor please copy the file [`src/config.json.temp`](https://github.com/tillkolter/aeppdev-oracle-editor/blob/master/src/config.json.template) to `src/config.json` and fill in the public key of your account. The template contains the standard ports, so you would not have to change that unless you have edited the `epoch.yaml` in your Epoch root.

That should be it for running the editor.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
