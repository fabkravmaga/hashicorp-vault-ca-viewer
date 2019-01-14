# hashicorp-vault-ca-viewer
views certificates in Vault CA

in your terminal run:
```
export VAULT_ADDR=<<<YOUR VAULT SERVER URL WITH PORT>>>
export VAULT_TOKEN=<<YOUR VAULT TOKEN WITH PERMISSION TO READ VAULT_CA_BACKEND>>
export VAULT_CA_BACKEND=<<YOUR CA BACKEND IN VAULT>>
export DEBUG=1 #for debug logs
node app.js
```

Open (http://localhost:8222/certs) in your browser

Enjoy.