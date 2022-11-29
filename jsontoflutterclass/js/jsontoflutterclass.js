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
import '../mahas/services/mahas_format.dart';

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
            if (Array.isArray(val) && val?.length > 0){
                const classNamex = `${className}${getPropName(key, true)}`;
                models.push(_getModel(classNamex, val[0]));
                let rx = '';
                rx += `\t\tif (dynamicData['${key}'] != null) {\r`;
                rx += `\t\t\tfinal detailT = dynamicData['${key}'] as List;\r`;
                rx += `\t\t\tmodel.${propName} = [];\r`;
                rx += `\t\t\tfor (var i = 0; i < detailT.length; i++) {\r`;
                rx += `\t\t\t\tmodel.${propName}!.add(${classNamex}Model.fromDynamic(detailT[i]));\r`;
                rx += `\t\t\t}\r`;
                rx += `\t\t}`;
                props.push(`\t${getVariable(classNamex, val)} ${propName};`);
                dynamics.push(rx);
            } else{
                props.push(`\t${getVariable(_className, val)} ${propName};`);
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
    const variable = getVariable(className, val);
    const dynamic = `dynamicData['${key}']`;
    if (variable === 'DateTime?'){
        return `MahasFormat.dynamicToDateTime(${dynamic})`;
    } else if (variable === 'int?'){
        return `MahasFormat.dynamicToInt(${dynamic})`;
    } else if (variable === 'double?'){
        return `MahasFormat.dynamicToDouble(${dynamic})`;
    } else if (variable === 'bool?'){
        return `MahasFormat.dynamicToBool(${dynamic})`;
    } else{
        return dynamic;
    }
};

const getVariable = (className, v) => {
    if (typeof v == 'number'){
        return isFloat(v) ? 'double?' : 'int?';
    } else if (v === true || v === false){
        return 'bool?';
    } else if (v === 'string'){
        return 'String?';
    } else if (!isNaN(new Date(v))){
        return 'DateTime?'
    } else if (v?.ticks === 0) {
        return 'TimeOfDay?'
    } else if (Array.isArray(v)) {
        return `List<${className}Model>?`;
    } else {
        return 'String?';
    }
};

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

const getClass = m => {
    const r = `class ${m.className}Model {
${m.props.join('\r')}

\tstatic fromJson(String jsonString) {
\t\tfinal data = json.decode(jsonString);
\t\treturn fromDynamic(data);
\t}

\tstatic fromDynamic(dynamic dynamicData) {
\t\tfinal model = ${m.className}Model();

${m.dynamics.join('\r')}

\t\treturn model;
\t}
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
