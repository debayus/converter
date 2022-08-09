const input_json = ace.edit('input_json');
input_json.setTheme('ace/theme/monokai');
input_json.setShowPrintMargin(false);

const input_update = ace.edit('input_update');
input_update.setTheme('ace/theme/monokai');
input_update.setShowPrintMargin(false);

const result_code = ace.edit('result_code');
result_code.setShowPrintMargin(false);
let tempClassName = '';

const formOnSubmit = e => {
    e.preventDefault();
    const values = input_json.getValue().replace(/(\"|\”|\“)/gm, "").split(/[[0-9]| |\.|\?|\;|\!|\,|\:|\r\n|\n|\r|\—|\-|\‘\s]/).reduce((x, y) => {
        if (!Array.isArray(x)){
            x = [x];
        }
        if (!x.find(a => a.toUpperCase() === y.toUpperCase()) && y && y != '’'){
            if (y[y.length - 1] === '’'){
                y = y.substr(0, y.length - 1);
            }
            x.push(y);
        }
        return x;
    });
    const update = input_update.getValue().split('\n');
    result_code.setValue(values.map((v,i) => `${v}${(update[i] ? ` => ${update[i]}` : '')}`).join('\n'));
};

function copyOnPress() {
    navigator.clipboard.writeText(result_code.getValue());
}

function downoadOnPress() {
    download(`textgroup.txt`, result_code.getValue());
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
