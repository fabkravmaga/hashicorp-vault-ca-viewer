const express = require('express');
const router = express.Router();
const fs = require('fs');
const _path = require('path');
const superagent = require('superagent');
const x509 = require('x509');

router.get('/', (req, res) => res.send('Hello Curious! Post to /api/certs with {"vaultAddr":"value","vaultToken":"value","vaultCABackend":"value"}'));

router.post('/api/certs', function (req, resp) {

    if (!req.body.vaultAddr || !req.body.vaultToken || !req.body.vaultCABackend){
        return resp.status(400).jsonp('{"error": "Post to /api/certs with {"vaultAddr":"value","vaultToken":"value","vaultCABackend":"value"}"');
    }

    var vaultAddr = req.body.vaultAddr;
    var vaultToken = req.body.vaultToken;
    var vaultCABackend = req.body.vaultCABackend;
    
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
            certificatesInText[certText.subject.commonName] = certText;
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

router.get('/api/certs', function (req, resp) {

    if (!req.query.vaultAddr || !req.query.vaultToken || !req.query.vaultCABackend){
        console.log(req.query);
        return resp.status(400).jsonp('{"error": "Post to /api/certs with {"vaultAddr":"value","vaultToken":"value","vaultCABackend":"value"}"');
    }

    var vaultAddr = req.query.vaultAddr;
    var vaultToken = req.query.vaultToken;
    var vaultCABackend = req.query.vaultCABackend;
    
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
            certificatesInText[certText.subject.commonName] = certText;
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
