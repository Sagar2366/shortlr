/**
 * Created by championswimmer on 24/11/16.
 */
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config.json');

const app = express();

const shortner = require('./utils/shortner');
const expressGa = require('express-ga-middleware');

const route = {
    api_v1: require('./routes/api_v1'),
    shortcode: require('./routes/shortcode')
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


const redirectToHome = function (req, res) {
    res.redirect('http://codingblocks.com')
};

app.use('/admin', function (req,res,next) {
        if(req.secure || (! config.ALWAYS_HTTPS) ) {
           //already on secure connection
           return next();
        }
        res.redirect('https://' + req.headers.host + req.originalUrl );

    },
    express.static(__dirname + "/static/admin")
);

app.use('/.well-known', express.static(__dirname + "/.well-known"));

app.use(expressGa('UA-83327907-4'));
app.use('/api/v1', route.api_v1);
app.use('/', route.shortcode);
app.use(redirectToHome);


app.listen(4000, () => {
    console.log("Listening on http://localhost:4000/");
});