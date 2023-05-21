# Auto Flashcards
Autoflashcards is a plugin for chrome that helps you remember anything. To use auto flashcards you will need to setup a server from **https://github.com/JJJUhlar/flashcards-server**

## Main features:
- Highlight any text you want to remember in Chrome and right click **"make flashcards"**
- A set of flashcards sumarising the highlighted text will be automatically generated by an AI, which you can view by clicking on the extension icon and the 'create panel'.
- Use the 'review' panel to practice your flashcards. Auto Flashcards uses a spaced repetition system to optimise your recollection. If you forget the answer to a flashcard, autoflashcard will open it's source material in a new tab, for you to review.

## Setup
1. Fork / Clone repo locally
2. Add connection by hand. Follow instructions for setting up the server as detailed here: https://github.com/JJJUhlar/flashcards-server/tree/main Save the url of the server to the connection variable on the first line of background.js and connection.js
3. Open Chrome
4. Click 'extensions' button in the top right corner (looks like a jigsaw piece) and go to 'Manage Extensions' page
5. Once in 'Manage Extensions' toggle on 'developer mode' in the top right corner so that you can see the 'Load Unpacked' extension button.
6. Click 'Load Unpacked.' Navigate to the repository and select.
7. Toggle on the extension once it has loaded, it should look like this:
![image](https://github.com/JJJUhlar/auto-flashcards-plugin/assets/60521063/fdca9b03-1b47-4b14-8bc5-e932be854833)
7. Pin Auto Flashcards to your browser by clicking on the manage extensions button and clicking the pin button next to the loaded Flashcards extension.
8. You're ready to go! Try it out by finding something you want to remember.