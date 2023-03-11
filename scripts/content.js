// Content scripts will get the text payload content from a webpage by reading the DOM and send it to flashcard api

document.oncontextmenu = () => {
    let selection = document.getSelection();
    let text = selection.toString();
    console.log(text)
}