const question = document.getElementById('flashcardAnswer')
const answer = document.getElementById('flashcardPrompt')
const numCards = document.getElementById('numCards')

const get = document.getElementById('getButton')
const save = document.getElementById('saveCardsButton')
const next = document.getElementById('nextCardButton')
const previous = document.getElementById('previousCardButton')

let new_cards = [];

getCards = () => {
  answer.value = "loading..."
  question.value = "loading..."

  chrome.storage.session.get("flashcards")
    .then(({flashcards}) => {
      console.log(flashcards)
      answer.value = flashcards[0].front
      question.value = flashcards[0].back
      numCards.innerText = flashcards.length
    })
    .catch((err)=>{ 
      console.log("error:", err)
    }) 
}

let currentCardIndex = 0;
changeCard = (e) => {
  let direction = 1;
  if (e.target.id === "previousCardButton") {
    direction = -1;
  } else if (e.target.id === "nextCardButton") {
    direction = 1;
  }
  
  chrome.storage.session.get("flashcards")
    .then(({flashcards}) => {
      if (flashcards[currentCardIndex + direction] !== undefined) {
        currentCardIndex += direction;
        answer.value = flashcards[currentCardIndex].front
        question.value = flashcards[currentCardIndex].back
      } else {
        console.log("no cards")
      }
    })  
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

get.addEventListener("click", getCards)
save.addEventListener('click', sendCards)
next.addEventListener("click", changeCard)
previous.addEventListener("click", changeCard)