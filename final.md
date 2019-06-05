## Final

### 1. Team Members:
##### Junyu Lai
###### Responsible for
- HTML
- JS
- Some CSS
- Generate the news
##### Dingmei Gu
###### Responsible for
- HTML
- JS
- Writing scripts
- Generate the news
##### Ruoyi Yu
###### Responsible for
- CSS
- Milestone2
- UI design

### 2. List of All Source Code Files
#### (1) HTML files are under the path: COGS121/code/functions/views/
- layouts/main.handlebars: HTML code used for Node.js express framework to render every page in the web app
- partials/header.handlebars: HTML code for the header shows at the top of all pages
- partials/sidebar.handlebars: HTML code for the sidebar shows on the left side of all pages
- favorite.handlebars: HTML code to construct the favorite page where displays a table of list of user's favorite news
- home.handlebars: HTML code to construct the home page where displays four random news
- history.handlebars: HTML code to construct the history page where displays a table of list of all news the user has read
- index.handlebars: HTML code to construct the index page where displays login and signup information
- onboard.handlebars: HTML code to construct the onboard page where allows users to set their preferences
- profile.handlebars: HTML code to construct the profile page where shows user profile
- studyset.handlebars: HTML code to construct the studyset page where shows a list of words which are added by user

#### (2) JS files are under the path: COGS121/code/public/static/js/
- favorite.js: Initialize the Datatable framework, display data, make ajax call to the backend, handle user interactions
- history.js: Initialize the Datatable framework, display data, make ajax call to the backend, handle user interactions
- home.js: Display news overview, handle user interactions, make ajax call to the backend
- index.js: Handle login or signup actions, create a new account for user who signup or login a user.
- learn.js: Display new contents, make ajax call to backend, handle all user interactions
- onbaord.js: Save user setting to Database via ajax call
- profile.js: Display user information, update user setting or password
- share.js: Handle user interactions which the same action will be perform in more than one pages, such as sidebar buttons
- studyset.js: Display vacabulary, dynamically generate html code, make ajax call to backend to fetch data.
- Additional backend index.js file (under the path: COGS121/code/functions/): - Handle all requests from users, retrive data from database, sent data response, or render data to the front-end

#### (3) CSS files are under the path: COGS121/code/public/static/css/
- favNhis.css: CSS for favorite and history page
- home.css: CSS for home page
- index.css: CSS for index page
- learn.css: CSS for learn page
- profile.css: CSS for profile page
- share.css: CSS for element in same class used in more than one page
- sidebar.css: CSS for sidebar
- studyset.css: CSS for studyset page

#### (4) Scripts files are under the path: COGS121/code/script/
- dev-news-fetch.ipynb: Read in news in the JSON file and esl word in txt file, translate title, news content, and populate the data to Firestore database
- populate_esl_words.ipynb: Generate an esl.txt file (this file is under the path: COGS121/code/script/) which contains most common ESL words from an online dataset

#### (5) JSON files are under the path: COGS121/code/script/old_json/
- b1.json - b7.json: Business news data
- p1.json - p2.json: Politics news data
- b1.json - b2.json: Technology news data
- news1.json - news3.json: Mixed topics of news data

#### (6) ESL words dataset txt files are under the path: COGS121/code/script/vocabulary_knowledge_dataset/
- all txt files contain ESL words and every word has a score which indicates the frequency of seeing this word

### 3. Link to Slide
https://docs.google.com/presentation/d/1WGwfzlYwOLfrmRf5jhgBytjWi9z0MHcR_MwwJh9L3kQ/edit?usp=sharing

### 4. Demo Video Link
https://www.youtube.com/watch?v=okYs6XGN6PE&feature=youtu.be
