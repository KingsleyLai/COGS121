README

Vocabulary Knowledge Dataset for 16 English Learners.

TERMS OF USE:

If you use this dataset, please cite the following two papers:

@article{Ehara:2013:PRS:2438653.2438666,
 author = {Ehara, Yo and Shimizu, Nobuyuki and Ninomiya, Takashi and Nakagawa, Hiroshi},
 title = {Personalized reading support for second-language web documents},
 journal = {ACM Transactions of Intelligent Systems and Technology},
 issue_date = {March 2013},
 volume = {4},
 number = {2},
 month = apr,
 year = {2013},
 issn = {2157-6904},
 pages = {31:1--31:19},
 articleno = {31},
 numpages = {19},
 url = {http://doi.acm.org/http://dx.doi.org/10.1145/2438653.2438666},
 doi = {http://dx.doi.org/10.1145/2438653.2438666},
 acmid = {2438666},
 publisher = {ACM},
 address = {New York, NY, USA},
 keywords = {Reading support, Web pages, glossing systems, item response theory, logistic regression},
} 

@InProceedings{ehara-EtAl:2012:PAPERS,
  author    = {Ehara, Yo  and  Sato, Issei  and  Oiwa, Hidekazu  and  Nakagawa, Hiroshi},
  title     = {Mining Words in the Minds of Second Language Learners: Learner-Specific Word Difficulty},
  booktitle = {Proceedings of COLING 2012},
  month     = {December},
  year      = {2012},
  address   = {Mumbai, India},
  publisher = {The COLING 2012 Organizing Committee},
  pages     = {799--814},
  url       = {http://www.aclweb.org/anthology/C12-1049}
}


This dataset is for research purpose only.
If you want to use this dataset for commercial purpose,
please contact me (Yo Ehara) from the last of this document.

Do NOT redistribute this dataset.
Telling the URL of this dataset is allowed, but 
do not pass the compressed file containing the dataset to other people.

Details:
Data is collected January 2009.
Every learner had one week to complete all 12,000 words.
Within the 12,000 words, 1 word: "clich" is a pseudo word, 
and other 11,999 words are English words.

Data format:
Each file contains the data for each subject.
svl_inputted_user[0-15].txt

All subjects are fluent in Japanese.
The native languages of the subjects are Japanese except those of user3 and user14:
The native language of user 3 is Chinese Mandarin and that of user14 is Cantonese.

user0: Not-paid
user1-15: paid (30,000 JPY (about 300 USD) / per person))


In each file, every line contains:
[word]	[score]

All subjects were shown the same set of words in the same order.
The set of words were selected from SVL12000. It is a set of words manually selected for Japanese learners of English by English teachers including English native speakers.
Although the original SVL12000 are divided into 12 ``levels of difficulty'', which the designer of this dataset define, these levels were NEVER shown to each subject to avoid prejudice.
http://www.alc.co.jp/eng/vocab/svl/

The order of words was randomly shuffled so that the subjects are not able to guess the words' difficulty from the ordering.

The score ranges from 1 to 5.
The definition of each score follows. The Japanese translations of these definitions were shown to each subject before they label the datasets.

1	never seen the word before
2	probably seen the word before
3	absolutely seen the word before but don't know its meaning / tried to learn the word before but forgot its meaning
4	probably know the word's meaning / able to guess the wordÅfs meaning
5	absolutely know the word's meaning

Contact:
Yo Ehara, Ph.D. (Information Science and Technology)

ehara[at]nii.ac.jp
niam[at]bk.main.jp
