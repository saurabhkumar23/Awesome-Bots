let cpyBtns = document.querySelectorAll(".copy-to-clipboard-icon");

for(let i=0;i<cpyBtns.length;i++){
    cpyBtns[i].addEventListener("click",(e) => CopyToClipboard(e));
}

function CopyToClipboard(e) {
    // console.log(e.target.parentElement.querySelector('div'))
	// let copyBoxElement = document.querySelector(".code");
    let copyBoxElement = e.target.parentElement.querySelector('div');
    console.log(copyBoxElement)
    copyBoxElement.contenteditable = true
    copyBoxElement.focus();
    copyBoxElement.select();
	document.execCommand("copy");
	alert("Text has been copied");
    copyBoxElement.contenteditable = false
	copyBoxElement.blur();
	let sel = document.getSelection();
	sel.removeAllRanges();
}
