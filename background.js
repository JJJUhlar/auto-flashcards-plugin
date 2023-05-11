chrome.runtime.onInstalled.addListener(() => {

  chrome.storage.session.set({inputCards: []})
    .then(()=>{
      console.log("Storage set to " + [])
    })

  chrome.storage.session.get(["inputCards"])
    .then((result) => {
      console.log("Storage is currently" + result)
    })
  
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
  console.log(info.selectionText)
  console.log(tab.url)
  
  const input = {
    "text": info.selectionText,
    "origin": tab.url
  }

  chrome.storage.session.set({"input": input})
    .then(()=>{
      console.log(`Storage set to ${input}`)
    })
  
  chrome.storage.session.get("input")
    .then((result) => {
      console.log(result, "<")
    })
}





// I will use a background service worker here to 
// open the flashcard queue while navigating to a new tab and to throttle loading
