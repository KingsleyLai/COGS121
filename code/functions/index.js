const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');
const hbs = require('express-handlebars');
const moment = require('moment');

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
		var allStudySets = []
		snapshot.docs.forEach(doc => {
			allStudySets.push(doc.data());
		});
		return allStudySets;
	});
}

function getFavorNewsByUser(userid) {
	const ref = firebaseApp.firestore().collection('favorite').doc(userid);
	const ref2 = firebaseApp.firestore().collection('news_overview');
	return ref.get().then((doc) => {
		let favorNewsAndTime = []
		doc.data()['record'].forEach(e => {
			favorNewsAndTime.push(e);
		});
		return ref2.get().then((snapshot) => {
			const result = [];
			snapshot.docs.forEach(doc2 => {
				favorNewsAndTime.forEach(e => {
					if (e['news_overview_id'] === doc2.id){
						const temp = doc2.data();
						const m = moment(e['add_time'].toDate());
						temp['add_time'] = m.format('L');
						temp['news_overview_id'] = e['news_overview_id'];
						result.push(temp);
					}
				});
			});
			return result;
		});
	}).catch((e) => {
		//backend log error to indicate empty array
		console.log('error')
	});

}
/*
function deleteFavorNewsByUser(userid,news_overview_id) {
	const ref = firebaseApp.firestore().collection('favorite');
	return ref.get(userid).then( (snapshot) => {
		let favorNews = [];
		snapshot.docs.forEach(doc => {
			favorNews = doc.data()['record'];
		});
		let i;
		for (i = 0;i<favorNews.length;i++){
			if (favorNews[i]['news_overview_id'] === news_overview_id){
				favorNews.splice(i,1);
			}
		}
		const ref2 = firebaseApp.firestore().collection('favorite').doc(userid);
		return ref2.update({
			record: favorNews
		}).then( () => { console.log('delete')});
	});
}*/

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
	getFavorNewsByUser(user).then(favorNews => {
		response.render('favorite', { favorNews });
	});
});
/*
app.post('/unfavor',(request,response) => {
	// getStudySetByPage?nid=
	const user = getCurrentUser_(request);
	const targetId = request.query.nid;
	deleteFavorNewsByUser(user,targetId).then( () => {
		getFavorNewsByUser(user).then( favorNews => {
			response.render('favorite', { favorNews });
		});
	});
});*/

app.get('/studyset',(request,response) => {
	const user = getCurrentUser_(request);
	getNotebookByUser(user).then(allstudysets => {
		// the length of studysets is 5, page = 1

		const totalCount = allstudysets[0]['record'].length;
		let result = [];

		const upperBound = Math.min(NUM_STUDY_SET_PER_PAGE, totalCount);
		let i = 0;
		for (i = 0; i < upperBound; i = i + 1) {
			result.push(allstudysets[0]['record'][i]);
		}

		const totalPageNums = Math.ceil(totalCount / NUM_STUDY_SET_PER_PAGE);
		const studysets = result;
		response.render('studyset', { studysets, totalPageNums });
	});
});

app.get('/getStudySetByPage',(request,response) => {
	// getStudySetByPage?p=2
	const user = getCurrentUser_(request);
	const targetPage = request.query.p;
	getNotebookByUser(user).then(allstudysets => {
		const totalCount = allstudysets[0]['record'].length;
		let result = [];

		const upperBound = Math.min(NUM_STUDY_SET_PER_PAGE * targetPage, totalCount);
		let i = 0;
		for (i = (targetPage - 1) * NUM_STUDY_SET_PER_PAGE; i < upperBound; i = i + 1) {
			result.push(allstudysets[0]['record'][i]);
		}

		response.json({targetStudySet: result});
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
