let dropArea = document.getElementById('drop-area');
let uploadArea = document.querySelector(".upload-area");
let divCount = 0;
let divArray = [];
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
function previewFile(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
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
        dropArea.replaceChild(div, uploadArea);
        dropArea.children[0].style.gridColumn = "1/span 2";
        dropArea.children[0].style.gridRow = "1/span 2";
        dropArea.children[0].style.minHeight = "525px";
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
        div.addEventListener("dragstart", () => {
            draggedDiv = div;
        }, false);
        div.addEventListener("dragenter", swapDiv,false);
        // style div
        div.innerHTML = `<input type="checkbox">
        <img src="zoom.png" alt="">`;
        divArray[div.id].bgImg = reader.result;
        div.style.backgroundImage = `url("${reader.result}")`;
        // style first div
        div.draggable = "true";
    }
}
function swapDiv(e) {
    let targetDiv = e.target;
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
        draggedDiv = targetDiv;
        render();
    }
}
function render() {
    for (let i = 0; i < divArray.length; i++) {
        dropArea.children[i].style.backgroundImage = `url("${divArray[i].bgImg}")`;
    }
}
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
// drag div
document.addEventListener("drag", function (event) {

}, false);