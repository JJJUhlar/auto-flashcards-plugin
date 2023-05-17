
const question = document.getElementById('flashcardAnswer')
const answer = document.getElementById('flashcardPrompt')
const numCards = document.getElementById('numCards')

const get = document.getElementById('getButton')
const save = document.getElementById('saveCardsButton')
const next = document.getElementById('nextCardButton')
const previous = document.getElementById('previousCardButton')
const getDueCardsButton = document.getElementById('getDueCardsButton')

const reviewPanelButton = document.getElementById('review-panel-button')
const createPanelButton = document.getElementById('create-panel-button')
const settingsPanelButton = document.getElementById('settings-panel-button')

const reviewPanel = document.getElementById('review-panel')
const createPanel = document.getElementById('create-panel')
const settingsPanel = document.getElementById('settings-panel')

let currentCardIndex = 0;


const panels_lookup = {
	"review-panel-button": reviewPanel,
	"create-panel-button":	createPanel,
	"settings-panel-button": settingsPanel
}
const panel_buttons = Object.keys(panels_lookup)

changePanel = (e) => {
	for (let panel_button of panel_buttons) {

		if (panel_button === e.target.id) {
			panels_lookup[e.target.id]['hidden'] = false
		} else {
			panels_lookup[panel_button]['hidden'] = true
		}

	}


	// for (panel of panel_buttons) {
		
	// 	if (e.target.id === panel) {
	// 		panels_lookup[e.target.id].hidden = false
	// 	}
	// 	panels_lookup[panel].hidden = true;
	// }
}

updateCardNum = () => {
  chrome.storage.session.get("flashcards")
	.then(({flashcards}) => {
	  numCards.innerText = `${currentCardIndex + 1} / ${flashcards.length}`
	})
	.catch((err)=>{ 
	  console.log("error:", err)
	})
}

getCards = () => {
  answer.value = "loading..."
  question.value = "loading..."

  chrome.storage.session.get("flashcards")
	.then(({flashcards}) => {
	  console.log(flashcards)
	  answer.value = flashcards[0].front
	  question.value = flashcards[0].back
	  updateCardNum()
	})
	.catch((err)=>{ 
	  console.log("error:", err)
	}) 
}

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
		updateCardNum()
	  } else {
		console.log("no cards")
	  }
	})
}

sendCards = () => {
  chrome.storage.session.get("flashcards")
	.then(({flashcards}) => {
	  fetch(`http://127.0.0.1:8080/save_cards`, {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify({
		  "flashcards": flashcards
		})
	  })
	  .then((res)=>{  
		alert("cards sent")
		console.log("cards sent", res.statusText)
	  })
	  .catch((err)=>{
		console.log("error:", err)
	  })
	})
}

getDueCards = () => {
  fetch(`http://127.0.0.1:8080/due_cards`, {
	method: "GET",
	headers: {
	  "Content-Type": "application/json",
	}
  })
  .then((res)=>{
	return res.json()
  })
  .then((data)=>{
	console.log(data)
	console.log(data.due_cards)
	chrome.storage.session.set({"due_cards": data.due_cards})
  })
  .catch((err)=>{
	console.log("error:", err)
  })
}

updatePracticedCards = (practiced_flashcards) => {
  fetch(`http://127.0.0.1:8080/update_cards`,{
	method: "PATCH",
	headers: { 
	  "Content-Type": "application/json",
	},
	body: JSON.stringify({
	  "cards_to_update": practiced_flashcards
	})
  })
  .then((res)=>{
	return res.json()
  })
  .then((data)=>{
	console.log(data)
  })
  .catch((err)=>{
	console.log("error:", err)
  })
}

deleteCard = (card_to_delete_id) => {
  fetch(`http://127.0.0.1:8080/delete_card`,{
	method: "DELETE",
	headers: { 
	  "Content-Type": "application/json",
	},
	body: JSON.stringify({
	  "card_to_delete_id": card_to_delete_id
	})
  })
  .then((res)=>{
	return res.json()
  })
  .then((data)=>{
	console.log(data)
  })
  .catch((err)=>{
	console.log("error:", err)
  })
}

get.addEventListener("click", getCards)
save.addEventListener('click', sendCards)
next.addEventListener("click", changeCard)
previous.addEventListener("click", changeCard)
getDueCardsButton.addEventListener("click", getDueCards)

reviewPanelButton.addEventListener("click", changePanel)
createPanelButton.addEventListener("click", changePanel)
settingsPanelButton.addEventListener("click", changePanel)
