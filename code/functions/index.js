const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');

const firebaseApp = firebase.initializeApp(
	functions.config().firebase
);

function getNews() {
	const ref = firebaseApp.firestore().collection('news_overview');
	return ref.get().then((snapshot) => {
		var result = []
		snapshot.docs.forEach(doc => {
			console.log(doc.data());
			result.push(doc.data());
		});
		console.log("--------- " + result);
		return result;
	});
}

const app = express();
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

app.get('/home', (request, response) => {
	// console.log("enter get home");
	// cache our content on server, with delay 300 second, storage life 600 second
	// response.set('Cache-Control', 'public, max-age=300, s-maxage=600')
	getNews().then(news => {
		response.render('home', { news });
	});

});

app.get('/index', (request, response) => {
	response.render('index');
});

app.get('/news', (request, response) => {
	response.render('learn');
});

app.get('/histroy',(request,response) => {
	response.render('history');
});

exports.app = functions.https.onRequest(app);
