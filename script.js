let copyToClipBoardIcon = document.querySelector('.copy-to-clipboard-icon')

copyToClipBoardIcon.addEventListener('click',function(e){
    let copyBoxElement = e.target.parentElement.querySelectorAll('code')
    let text = ''
    for(let i=0;i<copyBoxElement.length;i++){
        text += copyBoxElement[i].innerText 
        text += '\n'
    }
    console.log(text)
    // copyBoxElement.contenteditable = true
    // copyBoxElement.focus()
    // document.execCommand('selectAll')
    // document.execCommand("copy")
    // console.log('text copied!!')
    // copyBoxElement.contenteditable = false
    // let sel = document.getSelection()
    // sel.removeAllRanges()
})
