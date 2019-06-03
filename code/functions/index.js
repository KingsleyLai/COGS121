/**
 * Copyright (c) 2019
 *
 * index.js contains express routing and backend business logic for the web app.
 * It also contains helper functions for accessing Firebase database and user
 * authentication.
 *
 * @summary routing and backend logic for GoDuck.
 * @author GoDuck team, COGS 121, Spring 2019, UC San Diego
 *
 */
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

/**
 * getCurrentUser_ returns current user's id by quering url. If uid is not
 * persented in url, redirect user to login page.
 */
function getCurrentUser_(request, response) {
    if (!request.query.uid) {
        response.redirect('/index');
    }
    return request.query.uid;
}

/**
 * getNewsByUser returns all the News data in a array for the current user
 * based on input parameter userid (String).
 */
function getNewsByUser(userid) {
    const ref = firebaseApp.firestore().collection('news_overview');
    const ref2 = firebaseApp.firestore().collection('favorite').doc(userid);
    const ref3 = firebaseApp.firestore().collection('setting').doc(userid);

    // fetching News data from Firebase Cloudstore
    return ref3.get().then((doc) => {
        const prefer_category = doc.data()['prefer_category'];
        return ref.where('category', '==', prefer_category).get().then((snapshot) => {
            return ref2.get().then((doc) => {
                const result = [];
                const favor_list = doc.data()['record'];
                snapshot.docs.forEach(doc2 => {
                    let temp = doc2.data();
                    let favor = false;
                    if (favor_list.length > 0) {
                        favor_list.forEach(e => {
                            if (doc2.id === e['news_overview_id']) {
                                favor = true;
                            }
                        })
                        if (!favor) {
                            result.push(temp)
                        }
                    } else {
                        result.push(temp);
                    }
                });

                const l = [];
                const r = [];
                let i = 0;
                if (result.length < 4) {
                    if (result.length < 3) {
                        l.push(result[0]);
                        l.push(result[1]);
                    } else {
                        for (i = 0; i < result.length; i++) {
                            if (i % 2 == 0) {
                                l.push(result[i]);
                            } else {
                                r.push(result[i]);
                            }
                        }
                    }
                } else {
                    const newResult = result.slice(result.length - 4, result.length);
                    for (i = 0; i < newResult.length; i++) {
                        if (i % 2 == 0) {
                            l.push(newResult[i]);
                        } else {
                            r.push(newResult[i]);
                        }
                    }
                }
                return ([l, r]);
            }).catch(e => {
                console.log('cannot get news: ' + e);
            });
        }).catch(e => {
            console.log('cannot get news: ' + e);
        });
    }).catch(e => {
        console.log('cannot get news: ' + e);
    });

}

/**
 * getNotebookByUser returns all the Notebook data in a array for the current
 * user based on input parameter userid (String).
 */
function getNotebookByUser(userid) {
    const ref = firebaseApp.firestore().collection('notebook').doc(userid);
    const ref2 = firebaseApp.firestore().collection('setting').doc(userid);

		// fetching Notebook data from Firebase Cloudstore
    return ref2.get().then(doc2 => {
        let prefer_lang;
        const docData = doc2.data();
        prefer_lang = docData['prefer_lang'];
        return ref.get().then((doc) => {
            const allStudySets = []
            doc.data()['record'].forEach(e => {
                const temp = e;
                const keys = Object.keys(temp);
                keys.forEach((e2) => {
                    if (e2 === prefer_lang || e2 === 'en') {

                    } else {
                        delete temp[e2];
                    }
                })
                allStudySets.push(temp);
            });
            return allStudySets;
        }).catch(e => {
            console.log('Cannot get notebook: ' + e);
        });
    }).catch((e) => {
        console.log('Cannot get notebook: ' + e);
    });
}

/**
 * getNotebookByUser returns all the Favorite News data in a array for the
 * current user based on input parameter userid (String).
 */
function getFavorNewsByUser(userid) {
    const ref = firebaseApp.firestore().collection('favorite').doc(userid);
    const ref2 = firebaseApp.firestore().collection('news_overview');

		// fetching Favorite News data from Firebase Cloudstore
    return ref.get().then((doc) => {
        const favorNewsAndTime = [];
        doc.data()['record'].forEach(e => {
            favorNewsAndTime.push(e);
        });
        return ref2.get().then((snapshot) => {
            const result = [];
            snapshot.docs.forEach(doc2 => {
                favorNewsAndTime.forEach(e => {
                    if (e['news_overview_id'] === doc2.id) {
                        const temp = doc2.data();
                        const m = moment(e['add_time'].toDate());
                        temp['add_time'] = m.format('L');
                        result.push(temp);
                        console.log(temp['content_id']);
                    }
                });
            });
            return result;
        }).catch(e => {
            console.log('Cannot get favor news: ' + e);
        });
    }).catch((e) => {
        //backend log error to indicate empty array
        console.log('Cannot get favor news: ' + e);
    });
}

/**
 * getNotebookByUser returns all the History data in a array for the
 * current user based on input parameter userid (String).
 */
function getHistoryByUser(userid) {
    const ref = firebaseApp.firestore().collection('history').doc(userid);
    const ref2 = firebaseApp.firestore().collection('news_overview');
    const ref3 = firebaseApp.firestore().collection('favorite').doc(userid);

		// fetching Notebook data from Firebase Cloudstore
    return ref.get().then((doc) => {
        const history = [];
        doc.data()['record'].forEach(e => {
            history.push(e);
        });
        return ref2.get().then((snapshot) => {
            const result = [];
            snapshot.docs.forEach(doc2 => {
                history.forEach(e => {
                    if (e['news_overview_id'] === doc2.id) {
                        const temp = doc2.data();
                        const m = moment(e['view_time'].toDate());
                        temp['view_time'] = m.format('L');
                        temp['favor'] = false;
                        temp['news_overview_id'] = doc2.id;
                        result.push(temp);
                    }
                });
            });
            if (result.length > 30) {
                const newResult = result.slice(result.length - 30);
                return ref3.get().then((doc3) => {
                    const favor = doc3.data()['record'];
                    const favor_id = [];
                    favor.forEach((e) => {
                        favor_id.push(e['news_overview_id']);
                    });
                    newResult.forEach((e) => {
                        if (favor_id.includes(e['news_overview_id'])) {
                            e['favor'] = true;
                        }
                    })
                    return newResult;

                }).catch(e => {
                    console.log('Get History error:' + e);
                });
            } else {
                return ref3.get().then((doc3) => {
                    const favor = doc3.data()['record'];
                    const favor_id = [];
                    favor.forEach((e) => {
                        favor_id.push(e['news_overview_id']);
                    });
                    result.forEach((e) => {
                        if (favor_id.includes(e['news_overview_id'])) {
                            e['favor'] = true;
                        }
                    })
                    return result;

                }).catch(e => {
                    console.log('Get History error:' + e);
                });
            }
        }).catch(e => {
            console.log('Get History error:' + e);
        });
    }).catch((e) => {
        //backend log error to indicate empty array
        console.log('Get History error:' + e);
    });
}

/**
 * deleteFavorNewsByUser deletes Favorite News by the given userid and
 * news_title.
 */
function deleteFavorNewsByUser(userid, news_title) {
    const ref = firebaseApp.firestore().collection('favorite').doc(userid);
    const ref2 = firebaseApp.firestore().collection('news_overview');

		// delete Favorite News data from Firebase Cloudstore
    return ref2.where('title', '==', news_title).get().then(function(querySnapshot) {
        let news_overview_id;
        querySnapshot.forEach(function(doc2) {
            news_overview_id = doc2.id;
        })
        return ref.get().then((doc) => {
            let favorNews = [];
            doc.data()['record'].forEach((e) => {
                favorNews.push(e);
            });
            let i;
            for (i = 0; i < favorNews.length; i++) {
                if (favorNews[i]['news_overview_id'] === news_overview_id) {
                    favorNews.splice(i, 1);
                    break;
                }
            }
            ref.update({
                record: favorNews
            }).then(() => {
                console.log('delete favor news')
            });
        }).catch((e) => {
            console.log('error on delete favor news: ' + e);
        });
    }).catch(e => {
        console.log('error on delete favor news: ' + e);
    });
}

/**
 * addFavorNewsByUser adds Favorite News by the given userid and news_title.
 */
function addFavorNewsByUser(userid, news_title) {
    const ref = firebaseApp.firestore().collection('favorite').doc(userid);
    const ref2 = firebaseApp.firestore().collection('news_overview');

		// add Favorite News data to Firebase Cloudstore
    return ref2.where('title', '==', news_title).get().then(function(querySnapshot) {
        let news_overview_id;
        querySnapshot.forEach(function(doc2) {
            news_overview_id = doc2.id;
        })
        return ref.get().then((doc) => {
            const favorNews = doc.data()['record'];
            let duplicate = false;
            favorNews.forEach((e) => {
                if (e['news_overview_id'] === news_overview_id) {
                    duplicate = true;
                }
            });
            if (!duplicate) {
                const date = new Date();
                const toAddDate = firebase.firestore.Timestamp.fromDate(date);
                const newFavor = {
                    add_time: toAddDate,
                    news_overview_id: news_overview_id
                };
                favorNews.push(newFavor);
                ref.update({
                    record: favorNews
                }).then(() => {
                    console.log('add new favor news')
                });
            }
        }).catch((e) => {
            console.log('error on add favor news: ' + e);
        });
    }).catch(e => {
        console.log('error on add favor news: ' + e);
    });
}


/**
 * getUserInfo retuns user infomation by the given userid, infomation includes
 * user's prefered language and user's prefered news category.
 */
function getUserInfo(userid) {
    const ref = firebaseApp.firestore().collection('setting').doc(userid);
    return ref.get().then((doc) => {
        const info = {
            prefer_lang: doc.data()['prefer_lang'],
            prefer_category: doc.data()['prefer_category']
        };
        return info;
    }).catch(e => {
        console.log('error on getting user info: ' + e)
    });
}

/**
 * addHistoryByUser adds History data by the given userid and news_title.
 */
function addHistoryByUser(userid, news_title) {
    const ref = firebaseApp.firestore().collection('history').doc(userid);
    const ref2 = firebaseApp.firestore().collection('news_overview');
    return ref2.where('title', '==', news_title).get().then(function(querySnapshot) {
        let targetId;
        querySnapshot.forEach(function(doc2) {
            targetId = doc2.id;
        })
        return ref.get().then((doc) => {
            const history = doc.data()['record'];
            let count;
            for (count = (history.length - 1); count >= 0 && count > (history.length - 30); count--) {
                if (history[count]['news_overview_id'] === targetId) {
                    history.splice(count, 1);
                    break;
                }
            }
            const date = new Date();
            const toAddDate = firebase.firestore.Timestamp.fromDate(date);
            const newHisotry = {
                view_time: toAddDate,
                news_overview_id: targetId
            };
            history.push(newHisotry);
            ref.update({
                record: history
            }).then(() => {
                console.log('add new history')
            });
        }).catch(e => {
            console.log('Cannot add history: ' + e);
        });
    }).catch(e => {
        console.log('Cannot add history: ' + e);
    });
}

/**
 * getNewsContent returns the target user's target news content. Content
 * includes News' title, News' paragraph and it's translate_content.
 */
function getNewsContent(userid, targetId, pid) {
    const ref = firebaseApp.firestore().collection('news_content').doc(targetId);
    const ref2 = firebaseApp.firestore().collection('setting').doc(userid);

		// fetching News content data to Firebase Cloudstore
    return ref2.get().then(doc2 => {
        const docData = doc2.data();
        const prefer_lang = docData['prefer_lang'];
        return ref.get().then((doc) => {
            const allNewsContent = []
            doc.data()['text'].forEach(e => {
                const temp = e;
                const keys = Object.keys(temp);
                keys.forEach((e2) => {
                    if (e2 === prefer_lang || e2 === 'en') {
												// magic happens here!
                    } else {
                        delete temp[e2];
                    }
                })
                allNewsContent.push(temp);
            });
						// Fetch translate_content based on user's preference
            let original_content = allNewsContent[parseInt(pid) - 1]['en'];
            let translate_content = allNewsContent[parseInt(pid) - 1][prefer_lang];
            let news_len = allNewsContent.length;
            const title = doc.data()['title'];
            return [original_content, translate_content, news_len, title, prefer_lang];
        }).catch(e => {
            console.log('Cannot get news content: ' + e);
        });
    }).catch((e) => {
        console.log('Cannot get news content: ' + e);
    });
}

/**
 * addWordByUser adds word to user's studyset
 */
function addWordByUser(userid, word) {
    const ref = firebaseApp.firestore().collection('notebook').doc(userid);
    return ref.get().then((doc) => {
        const wordList = doc.data()['record'];
        let added = true;
        if (!wordList.some(w => w.en === word.en)) {
            wordList.push(word);
            ref.update({
                record: wordList
            }).then(() => {
                console.log('add new word');
            }).catch((e) => {
                console.log('error on add word to studyset: ' + e);
            });
        } else {
            added = false;
        }
        return added;

    });
}

// create Node.js express instance
const app = express();

// create and register handlebars render engine
app.engine('handlebars', hbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// home UI page routing
app.get('/', (request, response) => {
    response.redirect('/home');
});
app.get('/home', (request, response) => {
    const user = getCurrentUser_(request, response);
    getNewsByUser(user).then(news => {
        const l = news[0];
        const r = news[1];
        response.render('home', {
            l,
            r
        });
    });
});

// index UI page routing
app.get('/index', (request, response) => {
    response.render('index');
});

// news reading (learn) page routing
app.get('/learn', (request, response) => {
    const user = getCurrentUser_(request, response);
    const targetId = request.query.nid;
    const currentPid = request.query.pid;
    getNewsContent(user, targetId, currentPid).then(newsContent => {
        const original_content = newsContent[0];
        const translate_content = newsContent[1];
        const targetNextPid = parseInt(currentPid) + 1;
        const targetPrevPid = parseInt(currentPid) - 1;
        const news_len = newsContent[2];
        const title = newsContent[3];
        let prefer_lang = newsContent[4];
        let pl = prefer_lang;
        if (prefer_lang === 'hi') {
            prefer_lang = 2;
            pl = "Hindi";
        } else if (prefer_lang === 'zh') {
            prefer_lang = 0;
            pl = "Chinese";
        } else if (prefer_lang === 'es') {
            prefer_lang = 1;
            pl = "Spanish";
        }
        response.render('learn', {
            original_content,
            translate_content,
            targetNextPid,
            targetPrevPid,
            news_len,
            title,
            prefer_lang,
            pl
        });
    });
});

// AJAX endpoint for loading learn page
app.get('/learnByPage', (request, response) => {
    const user = getCurrentUser_(request, response);
    const targetId = request.query.nid;
    const currentPid = request.query.pid;
    getNewsContent(user, targetId, currentPid).then(newsContent => {
        const original_content = newsContent[0];
        const translate_content = newsContent[1];
        const targetNextPid = parseInt(currentPid) + 1;
        const targetPrevPid = parseInt(currentPid) - 1;
        const news_len = newsContent[2];
				// return new paragraph of news including original_content and
				// translate_content with pid
        response.json({
            original_content: original_content,
            translate_content: translate_content,
            targetNextPid: targetNextPid,
            targetPrevPid: targetPrevPid,
            news_len: news_len
        });
    });
});

// history UI page routing
app.get('/history', (request, response) => {
    const user = getCurrentUser_(request, response);
    getHistoryByUser(user).then(history => {
        response.render('history', {
            history
        });
    }).catch(e => {
        response.render(e);
    });
});

// AJAX endpoint for adding history
app.get('/addhistory', (request, response) => {
    const user = getCurrentUser_(request, response);
    const news_title = request.query.title;
    addHistoryByUser(user, news_title).then(() => {
        response.send({
            success: true
        });
    }).catch(e => {
        response.send({})
    });
});

// Favorite UI page routing
app.get('/favorite', (request, response) => {
    const user = getCurrentUser_(request, response);
    getFavorNewsByUser(user).then(favorNews => {
        response.render('favorite', {
            favorNews
        });
    });
});

// AJAX endpoint for unfavor
app.get('/unfavor', (request, response) => {
    const user = getCurrentUser_(request, response);
    const news_title = request.query.title;
    deleteFavorNewsByUser(user, news_title).then(() => {
        response.send({});
    });
});

// AJAX endpoint for addfavor
app.get('/addfavor', (request, response) => {
    const user = getCurrentUser_(request, response);
    const news_title = request.query.title;
    addFavorNewsByUser(user, news_title).then(() => {
        response.send({});
    });
});

// AJAX endpoint for unfavor
app.get('/studyset', (request, response) => {
    const user = getCurrentUser_(request, response);
    getNotebookByUser(user).then(allstudysets => {
        // the length of studysets is 5, page = 1
        const totalCount = allstudysets.length;
        let result = [];
        const upperBound = Math.min(NUM_STUDY_SET_PER_PAGE, totalCount);
        let i = 0;
        for (i = 0; i < upperBound; i = i + 1) {
            result.push(allstudysets[i]);
        }
        let isZh = false;
        let isEs = false;
        let isHi = false;
        if (totalCount > 0) {
            const keys = Object.keys(result[0]);
            if (keys.includes('zh')) {
                isZh = true;
            } else if (keys.includes('es')) {
                isEs = true;
            } else if (keys.includes('hi')) {
                isHi = true;
            }
        }
        let totalPageNums = Math.ceil(totalCount / NUM_STUDY_SET_PER_PAGE);
        const studysets = result;
        if (totalPageNums == 0) {
            totalPageNums = 1;
        }
        response.render('studyset', {
            isEs,
            isZh,
            isHi,
            studysets,
            totalPageNums
        });
    }).catch((e) => {
        console.log(e);
        response.send({});
    });
});

// AJAX endpoint for fetching studysets page page number
app.get('/getStudySetByPage', (request, response) => {
    // getStudySetByPage?p=2
    const user = getCurrentUser_(request, response);
    const targetPage = request.query.p;
    getNotebookByUser(user).then(allstudysets => {
        const totalCount = allstudysets.length;
        let result = [];

        const upperBound = Math.min(NUM_STUDY_SET_PER_PAGE * targetPage, totalCount);
        let i = 0;
        for (i = (targetPage - 1) * NUM_STUDY_SET_PER_PAGE; i < upperBound; i = i + 1) {
            result.push(allstudysets[i]);
        }
        response.json({
            targetStudySet: result
        });
    }).catch((e) => {
        console.log('error');
        response.send({});
    });
});

// profile UI page routing
app.get('/profile', (request, response) => {
    const user = getCurrentUser_(request, response);
    getUserInfo(user).then(userInfo => {
        const isTech = userInfo.prefer_category == 0;
        const isBusiness = userInfo.prefer_category == 1;
        const isPolitic = userInfo.prefer_category == 2;
        const isZh = userInfo.prefer_lang === 'zh';
        const isEs = userInfo.prefer_lang === 'es';
        const isHi = userInfo.prefer_lang === 'hi';
        response.render('profile', {
            isTech,
            isBusiness,
            isPolitic,
            isZh,
            isEs,
            isHi
        });
    });
});

// onboarding UI page routing
app.get('/onboard', (request, response) => {
    const user = getCurrentUser_(request, response);
    response.render('onboard');
});

// AJAX endpoint for setup onboarding data
app.get('/onboardsetup', (request, response) => {
    const uid = getCurrentUser_(request, response);
    const lang_pref = request.query.la;
    const category = parseInt(request.query.ca);

    //setting user profile db
    const ref = firebaseApp.firestore().collection('setting');
    const settingData = {
        prefer_category: category,
        prefer_lang: lang_pref
    };
    ref.doc(uid).set(settingData);
    //setting favorite db
    const ref2 = firebaseApp.firestore().collection('favorite');
    const favorData = {
        record: []
    };
    ref2.doc(uid).set(favorData);
    //setting history db
    const ref3 = firebaseApp.firestore().collection('history');
    const hisData = {
        record: []
    };
    ref3.doc(uid).set(hisData);
    //setting notebook db
    const ref4 = firebaseApp.firestore().collection('notebook');
    const notebookData = {
        record: []
    };
    ref4.doc(uid).set(notebookData);
    response.send({});
});

// AJAX endpoint for updating user info
app.get('/updateinfo', (request, response) => {
    const uid = getCurrentUser_(request, response);
    const lang_pref = request.query.la;
    const category = parseInt(request.query.ca);
    const ref = firebaseApp.firestore().collection('setting').doc(uid);
    const data = {
        prefer_lang: lang_pref,
        prefer_category: category
    };
    ref.set(data);
    response.send({});
});

// AJAX endpoint for adding word to studyset by user
app.post('/addword', (request, response) => {
    const uid = getCurrentUser_(request, response);
    addWordByUser(uid, request.body).then((added) => {
        if (added) {
            response.send({
                added: 1
            });
        } else {
            response.send({
                added: 0
            });
        }
    })
})

// load express framework for https firebase functions
exports.app = functions.https.onRequest(app);
