require('dotenv').config()// import dotenv
const express = require('express'); // import express
const querystring = require('querystring'); // import querystring
const axios = require('axios'); // import axios
const session = require('express-session');// import express-session
const NodeCache = require('node-cache'); // import node-cache


const app = express(); // create express app

const accessTokenCache = new NodeCache();

app.set('view engine', 'pug'); // set view engine to pug

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const REDIRECT_URI = 'http://localhost:3000/oauth-callback';
const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=76cb862b-cce8-4c22-9d7f-78587f33d676&redirect_uri=http://localhost:3000/oauth-callback&scope=crm.objects.contacts.read%20crm.objects.contacts.write`;
  
const refreshTokenStore = {};

const isAuthorized = (userId) => {
    return refreshTokenStore[userId] ? true : false;
}

const getToken = async (userId) => {
   if (accessTokenCache.get(userId)) {
        console.log(accessTokenCache.get(userId));
       return accessTokenCache.get(userId);
   } else {
        try {

            const refreshTokenProof = {
                grant_type: 'refresh_token',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                refresh_token: refreshTokenStore[userId]
            }
            const responseBody = await axios.post('https://api.hubapi.com/oauth/v1/token', querystring.stringify(refreshTokenProof));
            refreshTokenStore[userId] = responseBody.data.refresh_token;
            accessTokenCache.set(userId, responseBody.data.access_token,  Math.round(responseBody.data.expires_in * 0.75));
            console.log('getting refresh token')
            return responseBody.data.access_token;
        } catch (error) {
            console.error(error);
        }
   }
}

app.use(session({
    secret: Math.random().toString(36).substring(2),
    resave: false,
    saveUninitialized: true,
}));

app.get('/', async (req, res) => {
    if (isAuthorized(req.sessionID)) {
        const accessToken = await getToken(req.sessionID);
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };
        const contacts = 'https://api.hubapi.com/crm/v3/objects/contacts';
        try {
            const resp = await axios.get(contacts, { headers });
            const data = resp.data;
            res.render('home', {
                token: accessToken,
                contacts: data.results
            });
            
        } catch (error) {
            console.error(error);
        }
    } else {
        res.render('home', { authUrl });
    }
});

app.get('/oauth-callback', async (req, res) => {
    // res.send(req.query.code);
    const authCodeProof = {
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    code: req.query.code
}
    try {
        const responseBody = await axios.post('https://api.hubapi.com/oauth/v1/token', querystring.stringify(authCodeProof));
        // res.json(responseBody.data);
        refreshTokenStore[req.sessionID] = responseBody.data.access_token;
        accessTokenCache.set(req.sessionID, responseBody.data.access_token,  Math.round(responseBody.data.expires_in * 0.75));
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }

});


PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`................................................`)
    console.log(`🚀  Server running on http://localhost:${PORT}, 🚀`)
    console.log(`...............................................`)
}
);


