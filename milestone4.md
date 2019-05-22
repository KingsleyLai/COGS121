## Milestone4

### 1.Latest UI skeleton
#### Homepage
![Homepage](https://github.com/KingsleyLai/COGS121/blob/master/images/milestone4/Home.png)

#### Read News Page (Learning Page)
![Learnpage](https://github.com/KingsleyLai/COGS121/blob/master/images/milestone4/Learn.png)
![Word Translation](https://github.com/KingsleyLai/COGS121/blob/master/images/milestone4/Learn2.png)
![Success](https://github.com/KingsleyLai/COGS121/blob/master/images/milestone4/Success.png)
![Ooops](https://github.com/KingsleyLai/COGS121/blob/master/images/milestone4/Ooops.png)

#### Study Sets Page
![Studyset](https://github.com/KingsleyLai/COGS121/blob/master/images/milestone4/Studyset.png)

#### Favorite Page
![Favorite](https://github.com/KingsleyLai/COGS121/blob/master/images/milestone4/Favorite.png)

#### History Page
![History](https://github.com/KingsleyLai/COGS121/blob/master/images/milestone4/History.png)
![History](https://github.com/KingsleyLai/COGS121/blob/master/images/milestone4/History2.png)

### 2.Explanation
UI changes
#### General:
- Redesigned headers on each page
- Changed colors to fit theme style
- Styled all buttons 

#### Sidebar:
- Styled user profile information
- Added background color to menu buttons to indicate which page user is in
- Adjusted layout of user picture and menu buttons

#### Homepage:
- Added heart icon that changes color for "favorite news" function
- Aligned and modified sizes and positions of all elements

#### Read News page:
- Adjusted and modified fonts, color, sizes and layouts
- Styled pop-up window for word translation
- Designed toast notifications based on user's action 
    1.Green for success message
    2.Red for "ooops" message

#### Favorite and History pages:
- Modified the tables (color, size, margin, etc.)
- Styled all buttons to fit theme


### 3.Non trivial Actions
#### (1) Reading the news
- Login or signup an account to the Home page
- Click the read news button in one of the news prompts
- Start reading the news in English and translated languages
- Click Next or Previous to navigate to the next or previous paragraph of the news
#### (2) Add esl words to studyset and view them in studyset
- Login or signup an account to the Home page
- Click the read news button in one of the news prompts
- Click the highlighted words to see the word's meaning
- Click Add to studyset to add the word in the studyset
- If the word is not in the studyset, a toast should say add to studyset successfully. Else it would says words already in studyset
- Click studyset on the sidebar to go check your studyset