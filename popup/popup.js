
// Get event for browser rightclick Q. 
// Get event payload . . . 
// Get 
const question = document.getElementById('flashcardAnswer')
const answer = document.getElementById('flashcardPrompt')

chrome.storage.session.get(["inputCards"])
    .then((result) => {
      console.log("Storage is currently" + result.textInput)
    })
    

const test = document.getElementById('testButton')


getCards = () => {
  chrome.storage.session.get(["input"])
    .then(({input}) => {
      console.log(input.text)
      console.log(input.origin)


      const card_type = "default";

      if (input.text.length > 0 && input.text.length < 2000) {
        fetch(`http://127.0.0.1:5000/flashcards`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            },
          body: JSON.stringify({
            "url": String(input.origin),
            "type": card_type,
            "text": String(input.text)
            })
          })
          .then((res)=>{
            return res.json()
          })
          .then(({flashcards})=>{
            answer.value = flashcards[0].front
            question.value = flashcards[0].back
          })
          .catch((err)=>{
            console.log('error!:', err)
        })
      } else {
        console.log("too long", input.text.length)
      }

    })
}

test.addEventListener("click", getCards)