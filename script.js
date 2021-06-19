let dropArea = document.getElementById('drop-area');
let uploadArea = document.querySelector(".upload-area");
let divCount = 0;
let divArray = [];
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
        if (divCount === 0) {
            div.style.gridColumn = "1/span 2";
            div.style.gridRow = "1/span 2";
            div.style.minHeight = "525px";
        }
        div.classList.add("imgDiv");
        div.style.flexFlow = "column";
        div.appendChild(loader);
        div.appendChild(loadStatus);
        dropArea.replaceChild(div, uploadArea);
        uploadArea.classList.add("dashedBorder");
        dropArea.classList.remove("dashedBorder");
        dropArea.appendChild(uploadArea);
    }
    reader.onloadend = function () {
        div.removeChild(loader);
        div.removeChild(loadStatus);
        // add div in divArray
        divArray.splice(divCount,0, { bgImg: reader.result});
        // style div
        div.innerHTML = `<input type="checkbox">
        <img src="zoom.png" alt="">`;
        div.style.backgroundImage = `url("${divArray[divCount].bgImg}")`;
        // style first div
        div.draggable = "true";
        // insert div in dropArea
        divCount++;
    }
}
// preventDefaults
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
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
