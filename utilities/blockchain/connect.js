const { privateKeys } = require('../../config/config');
const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig'); // development only
const fetch = require('node-fetch');

const signatureProvider = new JsSignatureProvider(privateKeys);
//const rpc = new JsonRpc("https://jungle4.api.eosnation.io:443", { fetch });
const rpc = new JsonRpc("http://142.132.135.86:9623", { fetch });
const api = new Api({ rpc, signatureProvider });


module.exports.rpc = rpc;
module.exports.api = api;