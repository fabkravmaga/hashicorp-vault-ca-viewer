const express = require('express');
const router = express.Router();
const fs = require('fs');
const _path = require('path');
const superagent = require('superagent');
const x509 = require('x509');

router.get('/', (req, res) => res.send('Hello Curious!'));

router.get('/certs', function (req, resp) {
    
    superagent.get(vaultAddr + '/v1/'+vaultCABackend+'/certs?list=true')
    .set('X-Vault-Token', vaultToken)
    .set('Accept', 'application/json')
    .end( async (err, res) => {
        let certificatesInX509 = {};
        let certificatesInText = {};
        if (err) { 
            resp.status(200).jsonp(err);
            return console.error(err);
        }

        // console.debug(res.body);

        let certContentArray = res.body.data.keys.map(key => {
            return getCertDetails(vaultAddr, vaultCABackend, vaultToken, key)
        })

        certificatesContentArray = await Promise.all(certContentArray);

        for (let i = 0; i < res.body.data.keys.length; i++){
            certificatesInX509[res.body.data.keys[i]] = certificatesContentArray[i];
            var certText = x509.parseCert(certificatesInX509[res.body.data.keys[i]]);
            certificatesInText[res.body.data.keys[i]] = certText;
            // console.debug(certText);
        }

        if(DEBUG == 1){
            console.debug("certificatesInX509");
            console.debug(certificatesInX509);
            console.debug("certificatesInText");
            console.debug(certificatesInText);
        }
        
        resp.status(200).jsonp(certificatesInText);
     });
});

function getCertDetails(vaultAddr, vaultCABackend, vaultToken, certKey){
    return superagent.get(vaultAddr + '/v1/' + vaultCABackend + '/cert/' + certKey)
            .set('X-Vault-Token', vaultToken)
            .set('Accept', 'application/json')
            .then( (res) => {
                if (DEBUG==1) { console.log(res.body.data.certificate) };
                console.log("SUCCESS getCertDetails: " + certKey);
                return res.body.data.certificate;                
            }).catch((err)=>{
                console.error(err); 
                return res.status(200).jsonp(err);
            })
}

module.exports = router;
