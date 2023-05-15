
// Get event for browser rightclick Q. 
// Get event payload . . . 
// Get 
const question = document.getElementById('flashcardAnswer')
const answer = document.getElementById('flashcardPrompt')
const numCards = document.getElementById('numCards')

const test = document.getElementById('testButton')
const save = document.getElementById('saveCardsButton')
const next = document.getElementById('nextCardButton')
const previous = document.getElementById('previousCardButton')

const currentCardIndex = 0;

getCards = () => {
  answer.value = "loading..."
  question.value = "loading..."

  chrome.storage.session.get(["input"])
    .then(({input}) => {
      console.log(input.text)
      console.log(input.origin)

      const card_type = "default";

      if (input.text.length > 20 && input.text.length < 1000) {
        fetch(`http://127.0.0.1:5000/flashcards`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            },
          body: JSON.stringify({
            "url": String(input.origin),
            "type": card_type,
            "text": String(input.text),
            "model": "text-davinci-003"
            })
        })
        .then((res)=>{
          return res.json()
        })
        .then(({flashcards})=>{
          numCards.innerText = flashcards.length
          console.log(flashcards.length)
          answer.value = flashcards[0].front
          question.value = flashcards[0].back
          chrome.storage.session.set({"new_cards": flashcards})
        })
        .catch((err)=>{
          console.log('error!:', err)
        })
      } else {
        console.log("too long", input.text.length)
      }

    })
}


changeCard = (currentCardIndex, direction) => {
  console.log('change card')
  console.log(chrome.storage.session.get(["new_cards"]))
  flashcards = chrome.storage.session.get(["new_cards"]).flashcards
  if (currentCardIndex < 0) {
    answer.value = flashcards[currentCardIndex + direction].front
    question.value = flashcards[currentCardIndex - direction].back
  }
}

sendCards = () => {
  chrome.storage.session.get(["new_cards"])
    .then(({new_cards}) => {
      console.log(new_cards)
      fetch(`http://127.0.0.1:5000/new_cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "new_cards": new_cards.flashcards
      })
      .then((res)=>{  
        console.log(res)
      })  
      .catch((err)=>{
        console.log("error:", err)
      })
    })
    .catch((err)=>{
      console.log("error:", err)
    })
  })
}


test.addEventListener("click", getCards)
save.addEventListener('click', sendCards)
next.addEventListener('click', changeCard(currentCardIndex, 1))
previous.addEventListener('click', changeCard(currentCardIndex, -1))