## Milestone 5

### 1.Paragraph describes target population
- Our app is targeting college students who are English Language Learners which is English as Second Language(ESL) students. They want to catch up with the daily news, understand the content in the news, and learn more vocabulary by reading the news. First, ESL students will have to read news from news website such as CNN, but they cannot understand the content due to the limited vocabulary and cannot learn words from it because they don't know the meaning of them. Although Google Chrome comes with a translate function to translate the whole page, they can't connect the translated word to the English word which causes them they cannot learn from it. They have to switch between the translated page and original page to look for connecting the words. Then, those ESL students will search for an app that can display news in two languages parallelly and show them which words are good for ESL students to learn from it, which is our app, DuoNews. By using DuoNews, ESL students can choose their interested topic and prefer language to translate, then reading the news in both original text and translated text, and show the ESL word in the original text and with the translated meaning while they click on them. Students can also add those words in the studyset so they can review the word in the future. Moreover, they can favor the news and read them later and change the topic to view different kinds of news. As a result, those ESL students who want to catch up the daily news and learn English are satisfied, they now can read the news in both English and their native languages without switching the display of the page, and study English to improve their vocabulary.

### 2. Screenshots of latest UI

### 3.Explanation of UI improvement

### 4. Screenshots of Data displayed
- DataTables Frameword and Bootstrap grid system on Favorite Page
![DataDisplay](https://github.com/KingsleyLai/COGS121/blob/master/images/data_display/favorite.png)
- DataTables Frameword and Bootstrap grid system on History Page
![DataDisplay](https://github.com/KingsleyLai/COGS121/blob/master/images/data_display/history.png)

### 5. Explanation of how to implement the data display and how you hooked up to data APIs or databases
- On the Home page, we use the Bootstrap grid system to display a 2 by 2 grid for showing the latest news. In our node.js endpoint, we fetch news from Firebase based on user’s categorical preferences and prioritize to display news with latest timestamp.
- On the History page, we use the DataTables Framework and Bootstrap grid system to display the news user viewed. We put news title, source article link, view date, and actions (read and favor/unfavor) in order so users can access basic information of the news and have actions with them. In our node.js endpoint, we fetch user’s history from the history collection of our database based on the user id and sorted them by time.
- On the Favorite page, we use the DataTables Framework and Bootstrap grid system to display the news user favored.  We put news title, source article link, view date, and actions (read and unfavor) in order so users can access basic information of the news and have actions with them. Also, we fetch the favorite news from the favorite collection of our database using the node.js endpoint.
- On the Studyset page, we display the vocabulary and its translated meaning as a list group using Bootstrap, and its grid system. We also use jQuery’s ajax, HTML, after functions to fetch more vocabulary from the database and dynamically inject them into the HTML file so the user doesn’t need to reload the page when they click on the page, and viewing the words already seen before will not cause an ajax call to the database so the data will display immediately.
- On the Reading news page, we also use ajax call to our database to get news content then displaying each paragraph of the news when the user clicks prev/next button. The news is displayed side by side of its English text and translated text, so the user can see the translation directly. We also highlight the ESL words in the English text body, user can click on these ESL words and a small card will be popped up which displaying the corresponding translation and a button which user can click and add the word into their studyset. We collected ESL words dataset from online resource and created a Jupyter notebook to filter and write the common ESL words into a text file.
- To populate news data into Firebase, we created a Jupyter notebook to read daily news and translate them into different languages using the Google Translate API in Python. Then, pushing the original news and translated news into our firebase database.

### 6. Describe some more ambitious data display ideas.
- Giving a hover effect when the mouse in on the news box and display a short summary of the news
- Allows user to delete the words in the studyset
- Responsive windows that adjust size such as font to adapt most of the screen
- Allow user to select how many words display on the screen
