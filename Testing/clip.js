let cpyBtns = document.querySelectorAll(".copy-to-clipboard-icon");

for(let i=0;i<cpyBtns.length;i++){
    cpyBtns[i].addEventListener("click",(e) => CopyToClipboard(e));
}

function CopyToClipboard(e) {
    console.log(e)
	// let copyBoxElement = document.querySelector(".code");
	// copyBoxElement.focus();
	// document.execCommand("selectAll");
	// document.execCommand("copy");
	// alert("Text has been copied");
	// copyBoxElement.blur();
	// let sel = document.getSelection();
	// sel.removeAllRanges();
}
