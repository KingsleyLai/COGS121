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
	const ref = firebaseApp.firestore().collection('notebook').doc(userid);
	return ref.get().then((doc) => {
		const allStudySets = []
		doc.data()['record'].forEach(e => {
			allStudySets.push(e);
		});
		return allStudySets;
	}).catch((e) => {
		console.log('Cannot get notebook');
	});
}

function getFavorNewsByUser(userid) {
	const ref = firebaseApp.firestore().collection('favorite').doc(userid);
	const ref2 = firebaseApp.firestore().collection('news_overview');
	return ref.get().then((doc) => {
		const favorNewsAndTime = [];
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

function getHistoryByUser(userid){
	const ref = firebaseApp.firestore().collection('history').doc(userid);
	const ref2 = firebaseApp.firestore().collection('news_overview');
	return ref.get().then((doc) => {
		const history = [];
		doc.data()['record'].forEach(e => {
			history.push(e);
		});
		return ref2.get().then((snapshot) => {
			const result = [];
			snapshot.docs.forEach(doc2 => {
				history.forEach(e => {
					if (e['news_overview_id'] === doc2.id){
						const temp = doc2.data();
						const m = moment(e['view_time'].toDate());
						temp['view_time'] = m.format('L');
						temp['news_overview_id'] = e['news_overview_id'];
						result.push(temp);
					}
				});
			});
			return result;
		});
	}).catch((e) => {
		//backend log error to indicate empty array
		console.log('error3');
	});
}

function deleteFavorNewsByUser(userid,news_overview_id) {
	const ref = firebaseApp.firestore().collection('favorite').doc(userid);
	return ref.get().then( (doc) => {
		let favorNews = [];
		doc.data()['record'].forEach((e) => {
			favorNews.push(e);
		});
		let i;
		for (i = 0;i<favorNews.length;i++){
			if (favorNews[i]['news_overview_id'] === news_overview_id){
				favorNews.splice(i,1);
				break;
			}
		}
		ref.update({
			record: favorNews
		}).then(() => {console.log('delete favor news')});
	}).catch((e) => {console.log('error on delete favor news')});
}

function addFavorNewsByUser(userid,news_overview_id) {
	const ref = firebaseApp.firestore().collection('favorite').doc(userid);
	return ref.get().then( (doc) => {
		const favorNews = doc.data()['record'];
		let duplicate = false;
		favorNews.forEach((e) => {
			if (e['news_overview_id'] === news_overview_id){
				duplicate = true;
			}
		});
		if(!duplicate){
			const date = new Date();
			const toAddDate = firebase.firestore.Timestamp.fromDate(date);
			const newFavor = {add_time: toAddDate,news_overview_id: news_overview_id};
			favorNews.push(newFavor);
			ref.update({
				record: favorNews
			}).then(() => {console.log('add new favor news')});
		}
	}).catch((e) => {console.log('error on add favor news')});
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
	getHistoryByUser(user).then(history => {
		response.render('history', { history });
	});
});

app.get('/favorite',(request,response) => {
	const user = getCurrentUser_(request);
	getFavorNewsByUser(user).then(favorNews => {
		response.render('favorite', { favorNews });
	});
});

app.get('/unfavor',(request,response) => {
	// unfavor?nid=
	const user = getCurrentUser_(request);
	const targetId = request.query.nid;
	deleteFavorNewsByUser(user,targetId).then( () => {
		response.send({});
	});
});

app.get('/addfavor',(request,response) => {
	// unfavor?nid=
	const user = getCurrentUser_(request);
	//const targetId = request.query.nid;
	const targetId = 'Aweas71HCwtPN1WVpZk4';
	addFavorNewsByUser(user,targetId).then( () => {
		response.send({});
	});
});

app.get('/studyset',(request,response) => {
	const user = getCurrentUser_(request);
	getNotebookByUser(user).then(allstudysets => {
		// the length of studysets is 5, page = 1

		const totalCount = allstudysets.length;
		let result = [];

		const upperBound = Math.min(NUM_STUDY_SET_PER_PAGE, totalCount);
		let i = 0;
		for (i = 0; i < upperBound; i = i + 1) {
			result.push(allstudysets[i]);
		}

		const totalPageNums = Math.ceil(totalCount / NUM_STUDY_SET_PER_PAGE);
		const studysets = result;
		response.render('studyset', { studysets, totalPageNums });
	}).catch((e) => {
		console.log('error');
		response.send({});
	});
});

app.get('/getStudySetByPage',(request,response) => {
	// getStudySetByPage?p=2
	const user = getCurrentUser_(request);
	const targetPage = request.query.p;
	getNotebookByUser(user).then(allstudysets => {
		const totalCount = allstudysets.length;
		let result = [];

		const upperBound = Math.min(NUM_STUDY_SET_PER_PAGE * targetPage, totalCount);
		let i = 0;
		for (i = (targetPage - 1) * NUM_STUDY_SET_PER_PAGE; i < upperBound; i = i + 1) {
			result.push(allstudysets[i]);
		}

		response.json({targetStudySet: result});
	}).catch((e) => {
		console.log('error');
		response.send({});
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
