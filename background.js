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






const input = {

}

chrome.contextMenus.onClicked.addListener(
  selectGetter
)

function selectGetter(info,tab) {
  console.log(info.selectionText)
  console.log(tab.url)
  console.log(typeof info.selectionText)
  console.log(String(info.selectionText).length)

  
  if (String(info.selectionText).length > 0 && String(info.selectionText).length < 1000) {
    fetch(`http://127.0.0.1:5000/flashcards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "url": tab.url,
        "text": info.selectionText})
      })
      .then((res)=>{
        console.log(res.json())
      })
      .catch((err)=>{
        console.log(err)
        console.log('error')
      })
    }

  input["textInput"] = info.selectionText;
  input["textOrigin"] = tab.url;

  chrome.storage.session.set({inputCards: input})
    .then(()=>{
      console.log(`Storage set to ${input}`)
    })
  
  chrome.storage.session.get(["inputCards"])
    .then((result) => {
      console.log(result.textInput, "<")
    })
}





// I will use a background service worker here to 
// open the flashcard queue while navigating to a new tab and to throttle loading
