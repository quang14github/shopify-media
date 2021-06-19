let dropArea = document.getElementById('drop-area');
let imgCount = 0;
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
    let myForm = dropArea.querySelector(".my-form");
    myForm.classList.add("hide");
    dropArea.classList.add("grid-ctn");
    files = [...files]; 
    files.forEach(previewFile);
}
function previewFile(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
        let div = document.createElement('DIV');
        imgCount++;
        div.style.background = `url("${reader.result}") center`;
        if(imgCount === 1) {
            div.style.gridColumn = "1/3";
            div.style.gridRow = "1/3";
            div.style.minHeight = "525px";
        }
        dropArea.appendChild(div);
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
