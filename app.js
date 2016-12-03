var http = require('http');
var firebase = require('firebase');

firebase.initializeApp({
    databaseURL: 'YOUR-FIREBASE-DATABASE-URL'
});

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

function pokeGet(pokeId) {
    http.get({
        host: 'pokeapi.co',
        path: '/api/v2/pokemon/' + pokeId + '/'
    }, function (response) {
        var body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            if (isJsonString(body)) {
                var parsed = JSON.parse(body);
                var db = firebase.database();
                var ref = db.ref('pokemon-teste');
                ref.push().set(parsed);
                console.log('You got a pokemon:', parsed.name);
            } else {
                console.log('A pokemon was escaped! Try again!');
                pokeGet(pokeId);
            }
        });
    }, function (error) {
        console.log('Error', error);
    });
};

console.log("Catch 'em all!");
for (var i = 1; i < 152; i++) {
    pokeGet(i);
};
