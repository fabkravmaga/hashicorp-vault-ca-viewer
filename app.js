const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const port = 8222;

vaultAddr = process.env["VAULT_ADDR"] || 'https://vault.ai'
vaultToken = process.env["VAULT_TOKEN"] || '';
vaultCABackend = process.env["VAULT_CA_BACKEND"] || '';
DEBUG = process.env["DEBUG"] || 0; //disable for production
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; //enable for production


const app = express();
app.use(bodyParser.json());
app.use(routes);

app.use((req, res, next) => {
    res.setHeader('cache-control', 'private, max-age=0, no-cache, no-store, must-revalidate');
    res.setHeader('expires', '0');
    res.setHeader('pragma', 'no-cache');
    next();
  });

app.listen(port, () => console.log('Hashicorp CA Viewer app listening on port ' + port + '!'));
