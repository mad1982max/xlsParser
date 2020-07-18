import './style.css'
import XLSX from 'xlsx';
import './test.xls';


const dataIn = document.getElementById("data");
const info = document.getElementById("info");
let workbook, sheet;
dataIn.addEventListener("change", onChange);

function onChange(e) {
    deleteOldColumnheaders('.sheetsCont');
    deleteOldColumnheaders('.keyCont');
    let file = e.target.files[0]
    info.textContent = `added: ${file.name}, size: ${(file.size/1024).toFixed(2)} KB`;

    const reader = new FileReader();
    reader.onload = (e) => {
        console.log(e.target.result);  
        var data = new Uint8Array(e.target.result);
        workbook = XLSX.read(data, {type:"array"});
        console.log('--wb', workbook); 
        showSheets(workbook)       
    }
    reader.onerror = (e) => {
        console.log('---some error');
    }
    reader.readAsArrayBuffer(file);

}

let promise = fetch('./assets/test.xls', {})
promise
    .then(response => response.arrayBuffer())
    .then(data => {
    var wb = XLSX.read(data, {type:"array"});
    showSheets(wb);    
})

// var req = new XMLHttpRequest();
// req.open("GET", './test.xls', true);
// req.responseType = "arraybuffer";
 
// req.onload = function(e) {
//   var data = new Uint8Array(req.response);
//   var wb = XLSX.read(data, {type:"array"});
//     showSheets(wb);
// }
 
// req.send();


function showSheets(wb) {
    deleteOldColumnheaders('.sheetsCont');

    let sheetsArr = wb.SheetNames;
    let sheetsCont = document.createElement('div');
    let label = document.createElement('div');
    label.setAttribute('class', 'labelInfo')
    label.textContent = 'choose sheet';
    sheetsCont.appendChild(label);

    sheetsCont.setAttribute('class', 'sheetsCont');
    sheetsArr.forEach(sheet => {
        let singleSheet = document.createElement('div');
        singleSheet.setAttribute('class', 'singleSheet');
        singleSheet.textContent = sheet;
        singleSheet.addEventListener('click', (e) => chooseSheet(e,wb))
        sheetsCont.appendChild(singleSheet);
    })
    document.body.appendChild(sheetsCont);

}

function deleteButtonColors(selector) {
    let sheets = [...document.querySelectorAll(selector)];
    sheets.forEach(sheet => sheet.setAttribute('style', 'background-color: '))
}


function chooseSheet(e, wb) {
    deleteButtonColors('.singleSheet')
    console.log('click sheet:', e.target.textContent);
    sheet = e.target.textContent;
    e.target.setAttribute('style', 'background-color: lightblue');
    showColumnsHeaders(e.target.textContent, wb);    
}

function showColumnsHeaders(sheetname, wb) {
    deleteOldColumnheaders('.keyCont');
    let sheetArr = wb.Sheets[sheetname];
    let sheetArrObj = XLSX.utils.sheet_to_json(sheetArr)
    let keys = Object.keys(sheetArrObj[0]);
    
    let keyCont = document.createElement('div');
    let label = document.createElement('div');
    label.setAttribute('class', 'labelInfo')
    label.textContent = 'choose column';
    keyCont.appendChild(label);

    keyCont.setAttribute('class', 'keyCont');
    keys.forEach(key => {
        let singleSKey = document.createElement('div');
        singleSKey.setAttribute('class', 'singleSKey');
        singleSKey.textContent = key;
        singleSKey.addEventListener('click', (e) => chooseKey(e,wb))
        keyCont.appendChild(singleSKey);
    })
    document.body.appendChild(keyCont);
}

function deleteOldColumnheaders(selector) {
    let columnHeaders = document.querySelector(selector);
    console.log("---del", selector, columnHeaders);
    
    if(columnHeaders) columnHeaders.remove();
}


function chooseKey(e, wb) {
    deleteButtonColors('.singleSKey');
    console.log('click key:', e.target.textContent);
    e.target.setAttribute('style', 'background-color: lightblue');
  
}

// let b = document.getElementById('b');
// b.addEventListener('click', download)

// function download() {
//     var a = document.getElementById("a");
//     var file = new Blob(['file text'], {type: 'text/plain'});
//     a.href = URL.createObjectURL(file);
//     a.download = 'myfilename.txt';
// }

