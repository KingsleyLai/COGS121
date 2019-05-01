const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');
const hbs = require('express-handlebars');

const NUM_STUDY_SET_PER_PAGE = 5;

const firebaseApp = firebase.initializeApp(
	functions.config().firebase
);

function getCurrentUser_(request) {
	// console.log("======================================");
	// console.log("=== Current User: " + request.query.uid);
	// console.log("======================================");
	return request.query.uid;
}

function getNewsByUser(userid) {
	const ref = firebaseApp.firestore().collection('news_overview');
	return ref.get().then((snapshot) => {
		var result = []
		snapshot.docs.forEach(doc => {
			result.push(doc.data());
		});
		return result;
	});
}

function getNotebookByUser(userid) {
	const ref = firebaseApp.firestore().collection('notebook');
	return ref.get('testuserid').then((snapshot) => {
		var result = []
		snapshot.docs.forEach(doc => {
			result.push(doc.data());
		});
		return result;
	});
}

function getNotebookByUserWithPage(userid, page) {

}

const app = express();
app.engine('handlebars', hbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', (request, response) => {
	response.redirect('/home');
});

app.get('/home', (request, response) => {
	const user = getCurrentUser_(request);
	getNewsByUser(user).then(news => {
		response.render('home', { news });
	});
});

app.get('/index', (request, response) => {
	response.render('index');
});

app.get('/learn', (request, response) => {
	const user = getCurrentUser_(request);
	response.render('learn');
});

app.get('/history',(request,response) => {
	const user = getCurrentUser_(request);
	getNewsByUser(user).then(news => {
		response.render('history', { news });
	});
});

app.get('/favorite',(request,response) => {
	const user = getCurrentUser_(request);
	getNewsByUser(user).then(news => {
		response.render('favorite', { news });
	});
});

app.get('/studyset',(request,response) => {
	const user = getCurrentUser_(request);
	getNotebookByUser(user).then(studysets => {
		response.render('studyset', { studysets });
	});
});

app.get('/getStudySetByPage',(request,response) => {
	const user = getCurrentUser_(request);
	const targetPage = request.query.page;
	getNotebookByUser(user).then(studysets => {
		response.render('studyset', { studysets });
	});
});

app.get('/getStudySetCount',(request,response) => {
	const user = getCurrentUser_(request);
	getNotebookByUser(user).then(studysets => {
		response.json({count: studysets[0]['record'].length})
	});
});

app.get('/profile',(request,response) => {
	const user = getCurrentUser_(request);
	response.render('profile');
});

app.get('/onboard',(request,response) => {
	const user = getCurrentUser_(request);
	response.render('onboard');
});

exports.app = functions.https.onRequest(app);
