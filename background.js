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

  chrome.action.setPopup({
    tabId: tab.id,
    popup: "popup/popup.html"
  })


  const input = {
    "text": info.selectionText,
    "origin": tab.url
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
