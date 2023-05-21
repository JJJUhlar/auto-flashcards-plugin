const question = document.getElementById('flashcardAnswer')
const answer = document.getElementById('flashcardPrompt')
const numCreatedCards = document.getElementById('numCreatedCards')

const create = document.getElementById('createButton')
const save = document.getElementById('saveCardsButton')
const next = document.getElementById('nextCardButton')
const previous = document.getElementById('previousCardButton')

const reviewPanelButton = document.getElementById('review-panel-button')
const createPanelButton = document.getElementById('create-panel-button')

const reviewPanel = document.getElementById('review-panel')
const createPanel = document.getElementById('create-panel')

const reviewInterface = document.getElementById('reviewInterface')
const reviewCardPrompt = document.getElementById('reviewCardPrompt')
const reviewCardAnswer = document.getElementById('reviewCardAnswer')
const numReviewCards = document.getElementById('numReviewCards')
const easy_btn = document.getElementById('easy_btn')
const dunno_btn = document.getElementById('dunno_btn')
const delete_btn = document.getElementById('delete_btn')
const show_answer_btn = document.getElementById('show_answer_btn')
const review_answer_btns = document.getElementById('review_answer_btns')



changePanel = (e) => {
	
	const panels_lookup = {
		"review-panel-button": reviewPanel,
		"create-panel-button":	createPanel
	}

	const panel_buttons = Object.keys(panels_lookup)

	for (let panel_button of panel_buttons) {
		if (panel_button === e.target.id) {
			panels_lookup[e.target.id]['hidden'] = false
		} else {
			panels_lookup[panel_button]['hidden'] = true
		}
	}
}

easyCard = () => {
	chrome.storage.session.get("due_cards")
		.then(({due_cards}) => {
			if (!due_cards) return Error("no due cards")
			if (due_cards.length === 0) {
				finishedReviewSession()
			} else {
				fetch(`http://127.0.0.1:8080/update_card`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						"card_to_update_id": due_cards[0].id,
					})
				})

				chrome.storage.session.set({"due_cards": due_cards.slice(1)})
					.then(()=>{
						refreshCurrentReviewCard()
					})
			}
		})
}

dunnoCard = () => {
	reviewCardAnswer.hidden = true;
	review_answer_btns.hidden = true;
	chrome.storage.session.get('due_cards')
		.then(({due_cards}) => {

			chrome.tabs.create({
				"url": due_cards[0].origin,
				"active": false,
			}, (tab)=> {
				chrome.scripting.executeScript({
					target: {tabId: tab.id},
					files: ['./scripts/content.js']
				})
			})

			fetch(`http://127.0.0.1:8080/reset_card`, {
					method: "PATCH",
					headers: {
					"Content-Type": "application/json",
					},
					body: JSON.stringify({
					"card_to_reset_id": due_cards[0].id,
				})
			})

			due_cards.push(due_cards[0])
			chrome.storage.session.set({"due_cards": due_cards.slice(1)})
				.then(()=> refreshCurrentReviewCard())

		})
		.catch((err)=>{
			console.log(err)
		})
}

deleteCard = () => {
	chrome.storage.session.get('due_cards')
		.then(({due_cards}) => {
			fetch(`http://127.0.0.1:8080/delete_card`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						},
					body: JSON.stringify({
						"card_to_reset_id": due_cards[0].id,
					})
				})
			chrome.storage.session.set({"due_cards": due_cards.slice(1)}).then(()=> refreshCurrentReviewCard())
		})
		.catch((err)=>{
			console.log(err)
		})
}


createCards = () => {
	
  	answer.value = "loading..."
  	question.value = "loading..."

  	chrome.storage.session.get("created_cards")
		.then(({created_cards}) => {
			if (!created_cards) return Error("no created cards")
		  	refreshCreatedCard()
		})
		.catch((err)=>{ 
	  		console.log("error:", err)
		})
}

refreshCreatedCard = (direction) => {
	let currentCardIndex = 0;

	let nextCardIndex = currentCardIndex + direction;	
	chrome.storage.session.get("created_cards")
		.then(({created_cards}) => {
			if (!created_cards) return Error("no created cards")
			if (created_cards[nextCardIndex]) {
				answer.value = created_cards[nextCardIndex].front
				question.value = created_cards[nextCardIndex].back
				numCreatedCards.value = created_cards.length
				currentCardIndex = nextCardIndex;
			}
		})
		.catch((err)=>{	
			console.log("error:", err)
		})
}

changeCreatedCard = (e) => {

	let direction = 1;
	if (e.target.id === "previousCardButton") {
		direction = -1;
	} else if (e.target.id === "nextCardButton") {
		direction = 1;
	}

	refreshCreatedCard(direction)
}

showAnswer = () => {
	reviewCardAnswer.hidden = false;
	review_answer_btns.hidden = false;
}

saveCards = () => {
	chrome.storage.session.get("created_cards")
		.then(({created_cards}) => {
			fetch(`http://127.0.0.1:8080/save_cards`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					"created_cards": created_cards
				})
		})
		.then((res)=>{  
			return res.json()
		})
		.then((res)=>{
			console.log(res)
		})
		.catch((err)=>{
			console.log("error:", err)
		})
	})
}

getDueCards = () => {
	chrome.storage.session.get("due_cards") 
		.then(({due_cards}) => {
			if (due_cards && due_cards.length > 0) {
				refreshCurrentReviewCard()		
			} else {
				fetch(`http://127.0.0.1:8080/due_cards`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					}
				})
				.then((res)=>{
					return res.json()
				})
				.then((due_cards)=>{
					if (due_cards.msg) {
						console.log(due_cards.msg)
						finishedReviewSession(due_cards.msg)
						return
					} else {
						reviewInterface.hidden = false;
						chrome.storage.session.set({"due_cards": due_cards}) 
						refreshCurrentReviewCard()
					}
				})
				.catch((err)=>{
					numReviewCards.innerText = "couldn't get flashcards"
					console.log("error:", err)
				})
			}
		})
		.catch((err)=>{
			console.log(err)
		})
}

finishedReviewSession = (msg) => {
	if (msg) console.log(msg)
	numReviewCards.innerText = "no due cards; You've got no cards left today!"
	reviewInterface.hidden = true;
}

refreshCurrentReviewCard = () => {
	chrome.storage.session.get("due_cards")
		.then(({due_cards}) => {
			
			if (!due_cards || due_cards === undefined) return Error("no due cards")
			if (due_cards.length === 0) {
				finishedReviewSession()
			} else {
				reviewCardAnswer.innerText = due_cards[0].card_back
				reviewCardPrompt.innerText = due_cards[0].card_front
				numReviewCards.innerText = `${due_cards.length}`
				review_answer_btns.hidden = true;
			}
		})
		.catch((err)=>{
			console.log(err)
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

changeToReviewPanel = (e) => {
	changePanel(e)
	getDueCards()
}

create.addEventListener("click", createCards)
save.addEventListener('click', saveCards)
next.addEventListener("click", changeCreatedCard)
previous.addEventListener("click", changeCreatedCard)

reviewPanelButton.addEventListener("click", changeToReviewPanel)
createPanelButton.addEventListener("click", changePanel)

easy_btn.addEventListener('click', easyCard)
dunno_btn.addEventListener('click', dunnoCard)
delete_btn.addEventListener('click', deleteCard)
show_answer_btn.addEventListener('click', showAnswer)