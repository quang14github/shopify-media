let dropArea = document.getElementById('drop-area');
let uploadArea = document.querySelector(".upload-area");
let divCount = 0;
let divArray = [], imgArray = [];
var draggedDiv;
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}
function highlight(e) {
    dropArea.classList.add('highlight');
}

function unhighlight(e) {
    dropArea.classList.remove('highlight');
}
function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    handleFiles(files);
}
function handleFiles(files) {
    dropArea.classList.add("grid-ctn");
    files = [...files];
    files.forEach(uploadFile);
    files.forEach(previewFile);
}
function uploadFile(file) {
    let url = 'YOUR URL HERE';
    let formData = new FormData();

    formData.append('file', file);

    fetch(url, {
        method: 'POST',
        body: formData
    })
        .then(() => { /* Done. Inform the user */ })
        .catch(() => { /* Error. Inform the user */ });
}
// drag to upload
// preventDefaults
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    document.addEventListener(eventName, preventDefaults, false);
});
// highlight
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});
['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});
// handleDrop
dropArea.addEventListener('drop', handleDrop, false);
// preview img
function previewFile(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    let divCtn = document.createElement('DIV');
    let div = document.createElement('DIV');
    let loader = document.createElement('DIV');
    let loadStatus = document.createElement('DIV');
    reader.onloadstart = function () {
        loader.classList.add("loader");
        loadStatus.innerHTML = "Uploading...";
        div.classList.add("imgDiv");
        div.style.flexFlow = "column";
        div.appendChild(loader);
        div.appendChild(loadStatus);
        divCtn.appendChild(div);
        divCtn.style.border = "1px solid #C3C7CA";
        divCtn.style.backgroundImage = "url('./shopify-logo.png')";
        dropArea.replaceChild(divCtn, uploadArea);
        dropArea.children[0].style.gridColumn = "1/span 2";
        dropArea.children[0].style.gridRow = "1/span 2";
        dropArea.children[0].children[0].style.minHeight = "525px";
        // change dashed border
        uploadArea.classList.add("dashedBorder");
        dropArea.classList.remove("dashedBorder");
        dropArea.appendChild(uploadArea);
        divArray.splice(divCount, 0, { id: divCount });
        div.id = `${divCount}`;
        divCount++;
    }
    reader.onloadend = function () {
        div.removeChild(loader);
        div.removeChild(loadStatus);
        divCtn.style.backgroundImage = "";
        div.innerHTML = `<input type="checkbox" draggable="false">
        <img src="./zoom.png" alt="" draggable="false" id="zoom">`;
        div.querySelector("input[type=checkbox").addEventListener("click", selectImg);
        divArray[div.id].bgImg = reader.result;
        div.style.backgroundImage = `url("${reader.result}")`;
        div.draggable = "true";
        div.addEventListener("mouseover", addHover);
        div.addEventListener("mouseout", removeHover);
        div.addEventListener("dragstart", dragStart, false);
        divCtn.addEventListener("dragenter", dragEnter, false);
        div.addEventListener("dragend", dragEnd, false);
        divCtn.addEventListener("drop", dragDrop, false);
    }
}
function addHover() {
    this.classList.add("hoverEffect");
}
function removeHover() {
    this.classList.remove("hoverEffect");
}
function dragStart(e) {
    draggedDiv = e.target;
    setTimeout(() => {
        draggedDiv.className = 'invisible';
        draggedDiv.parentNode.style.backgroundColor = "#DBDFE5";
    }, 0);
}
function dragEnter(e) {
    let targetDiv = this.children[0];
    console.log(draggedDiv);
    if (draggedDiv != undefined) {
        if (targetDiv.id != draggedDiv.id) {
            draggedPosition = parseInt(draggedDiv.id);
            targetPosition = parseInt(targetDiv.id);
            var draggedValue = divArray[draggedPosition];
            if (draggedPosition < targetPosition) {
                for (let i = draggedPosition; i < targetPosition; i++) {
                    divArray[i] = divArray[i + 1];
                }
                divArray[targetPosition] = draggedValue;
            } else {
                for (let i = draggedPosition; i > targetPosition; i--) {
                    divArray[i] = divArray[i - 1];
                }
                divArray[targetPosition] = draggedValue;
            }
            targetDiv.className = 'invisible';
            targetDiv.parentNode.style.backgroundColor = "#DBDFE5";
            draggedDiv.parentNode.style.backgroundColor = "";
            draggedDiv.className = 'imgDiv';
            draggedDiv = targetDiv;
            render();
        }
    }
}
function dragEnd() {
    if (draggedDiv != undefined) {
        draggedDiv.parentNode.style.backgroundColor = "";
        draggedDiv.className = 'imgDiv';
    }
}
function dragDrop() {
    if (draggedDiv != undefined) {
        draggedDiv.parentNode.style.backgroundColor = "";
        draggedDiv.className = 'imgDiv';
    }
}
function render() {
    for (let i = 0; i < divArray.length; i++) {
        dropArea.children[i].children[0].style.backgroundImage = `url("${divArray[i].bgImg}")`;
    }
}
function selectImg() {
    let checkbox = this;
    let div = checkbox.parentNode;
    if (checkbox.checked == true) {
        div.removeEventListener("mouseout", removeHover);
        div.children[1].classList.add("hide");
        imgArray.push(parseInt(div.id));
    } else {
        div.addEventListener("mouseout", removeHover);
        div.children[1].classList.remove("hide");
        for (let i in imgArray) {
            if (imgArray[i] == div.id) {
                imgArray.splice(i, 1);
                break;
            }
        }
    }
    let content = (imgArray.length > 0) ? `${imgArray.length} media selected` : `Media`;
    if (imgArray.length > 0) showDeleteBtn();
    else hideDeleteBtn();
    document.querySelector(".part-name").innerHTML = `${content}`;
}
function showDeleteBtn() {
    document.querySelector(".delete-btn").style.display = "block";
    document.querySelector(".add-file-url").style.display = "none";
}
function hideDeleteBtn() {
    document.querySelector(".delete-btn").style.display = "none";
    document.querySelector(".add-file-url").style.display = "block";
}
// delete Img
document.querySelector(".delete-btn").addEventListener("click", () => {
    imgArray.sort(function(a,b) {return b-a});
    imgArray.forEach(element => {
        divArray.splice(element, 1);
        let divCtn = document.getElementById(`${element}`).parentNode;
        dropArea.removeChild(divCtn);
    });
    hideDeleteBtn();
    divCount -= imgArray.length;
    imgArray = [];
    let remainDiv = document.querySelectorAll(".imgDiv");
    for (let i = 0; i < remainDiv.length; i++) {
        remainDiv[i].id = i;
    }
    if (dropArea.childElementCount == 1) dropArea.classList.remove("grid-ctn");
    else {
        dropArea.children[0].style.gridColumn = "1/span 2";
        dropArea.children[0].style.gridRow = "1/span 2";
        dropArea.children[0].children[0].style.minHeight = "525px";
    }
    document.querySelector(".part-name").innerHTML = `Media`;
});

