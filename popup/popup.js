
// Get event for browser rightclick Q. 
// Get event payload . . . 
// Get 
const flashcard = document.getElementById('flashcardAnswer')
console.log(flashcard, "<< fc")

chrome.storage.session.get(["inputCards"])
    .then((result) => {
      console.log("Storage is currently" + result.textInput)
      console.log(flashcard)
      flashcard.value = "wah wah wah"
    })

