chrome.runtime.onInstalled.addListener(() => {

  
  chrome.contextMenus.create({
    title: "make flashcard for '%s'",
    contexts: ['page','selection'],
    type: "normal",
    visible: true,
    enabled: true,
    id: "flashcardContextMenu"
  })
});

chrome.contextMenus.onClicked.addListener(
  selectGetter
)

function selectGetter(info,tab) {

  const input = {
    "text": info.selectionText,
    "origin": tab.url
  }

  if (input.text.length > 20 && input.text.length < 2000) {
    fetch(`http://127.0.0.1:8080/flashcards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        },
      body: JSON.stringify({
        "url": String(input.origin),
        "type": "default",
        "text": String(input.text),
        "model": "text-davinci-003"
        })
      })
      .then((res)=>{
        return res.json()
      })
      .then(({flashcards})=>{
        chrome.storage.session.set({"flashcards": flashcards})
      })
      .catch((err)=>{
        console.log('error!:', err)
      })
    } else {
      console.log("wrong input length:", input.text.length)
    }




  chrome.storage.session.set({"input": input})
    .then(()=>{
      console.log(`${input.text}, ${input.url} saved to storage`)
    })
  
  chrome.storage.session.get("input")
    .then((result) => {
      console.log(result, "<")
    })
}





// I will use a background service worker here to 
// open the flashcard queue while navigating to a new tab and to throttle loading
