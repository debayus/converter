const input_json = ace.edit('input_json');
input_json.setTheme('ace/theme/monokai');
input_json.getSession().setMode('ace/mode/json');
input_json.setShowPrintMargin(false);

const result_code = ace.edit('result_code');
result_code.setShowPrintMargin(false);
let tempClassName = '';

function isJsonString(str) {
    try {
        return({
            success : true,
            json : JSON.parse(str)
        });
    } catch (e) {
        return {
            success : false,
        };
    }
}

const formOnSubmit = e => {
    e.preventDefault();

    // class name
    const className = getPropName(e.target['className'].value, true);
    tempClassName = className;

    // convert string to json
    const isJson = isJsonString(input_json.getValue());
    if (!isJson.success){
        alert('Wrong Format');
    }

    // get params
    const models = getModels(className, isJson.json);
    const listClass = models.reverse().map(x => getClass(x)).join('\r\r');

    let r = `import 'dart:convert';
import 'package:flutter/material.dart';

${listClass}
`;
    result_code.setValue(r);
};

const getModels = (className, json) => {
    const models = [];
    const _getModel = (_className, _json) => {
        const keys = Object.keys(_json);
        const props = [];
        const dynamics = [];
        for(let i = 0; i < keys.length; i++){
            const key = keys[i];
            const val = _json[key];
            const propName = getPropName(key);
            props.push(`\t${getVariable(_className, key, val)} ${propName};`);
            if (Array.isArray(val) && val?.length > 0){
                const classNamex = `${className}${getPropName(key, true)}`;
                models.push(_getModel(classNamex, val[0]));
                let rx = '';
                rx += `\t\tif (dynamicData['${key}'] != null) {\r`;
                rx += `\t\t\tfinal detailT = dynamicData['${key}'] as List;\r`;
                rx += `\t\t\tmodel.${propName} = [];\r`;
                rx += `\t\t\tfor (var i = 0; i < detailT.length; i++) {\r`;
                rx += `\t\t\tmodel.${propName}!.add(${classNamex}.fromDynamic(detailT[i]));\r`;
                rx += `\t\t\t}\r`;
                rx += `\t\t}`;
                dynamics.push(rx);
            } else{
                dynamics.push(`\t\tmodel.${propName} = ${getDynamicData(_className, key, val)};`);
            }
        }
        return {
            className : _className,
            props : props,
            dynamics : dynamics
        };
    };
    models.push(_getModel(className, json));
    return models;
};

const getPropName = (v, sentenceCase = false) => {
    if (!v) return v;
    v = v.split('_').map(x => toSentenceCase(x)).join('');
    if (!sentenceCase){
        v = v[0].toLowerCase() + v.substr(1);
    }
    return v;
};

const getDynamicData = (className, key, val) => {
    const variable = getVariable(className, key, val);
    const dynamic = `dynamicData['${key}']`;
    if (variable === 'DateTime?'){
        return `Helper.stringToDate(${dynamic})`;
    }else{
        return dynamic;
    }
};

const getVariable = (className, key, v) => {
    if (v === 0){
        return 'int?';
    } else if (v === true){
        return 'bool?';
    } else if (v === 'string'){
        return 'String?';
    } else if (!isNaN(new Date(v))){
        return 'DateTime?'
    } else if (v?.ticks === 0) {
        return 'TimeOfDay?'
    } else if (Array.isArray(v)) {
        return `List<${className}${getPropName(key, true)}Model>?`;
    } else {
        return 'String?';
    }
};

const getClass = m => {
    const r = `class ${m.className}Model {

${m.props.join('\r')}

    static fromJson(String jsonString) {
        final data = json.decode(jsonString);
        return fromDynamic(data);
    }

    static fromDynamic(dynamic dynamicData) {
        final model = ${m.className}();

${m.dynamics.join('\r')}

        return model;
    }
}`;
    return r;
};

function toSentenceCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function copyOnPress() {
    navigator.clipboard.writeText(result_code.getValue());
}

function downoadOnPress() {
    if (tempClassName){
        download(`${tempClassName}Model.dart`, result_code.getValue());
    }
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
