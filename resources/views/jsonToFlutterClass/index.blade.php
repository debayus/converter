<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <title>Json To Flutter Class - Mahas</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="/css/jsontoflutterclass.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>
    <nav class="navbar navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Json To Flutter Class</a>
        </div>
    </nav>
    <div class="main">
        <div class="menu">
            <form onsubmit="formOnSubmit(event)">
                <input type="text" class="form-control rounded-0" required name="className" placeholder="Class Name" value="Sample" />
                <pre id="input_json" data-fouc>{
    "number": 0,
    "text": "string",
    "boolean": true,
    "datetime": "2022-07-14T05:24:03.327Z",
    "time": {
        "ticks": 0,
        "days": 0,
        "hours": 0,
        "milliseconds": 0,
        "minutes": 0,
        "seconds": 0,
        "totalDays": 0,
        "totalHours": 0,
        "totalMilliseconds": 0,
        "totalMinutes": 0,
        "totalSeconds": 0
    },
    "list": [
        {
            "number": 0,
            "text": "string",
            "sub_list": [
                {
                    "number": 0,
                    "text": "string"
                }
            ]
        }
    ]
}</pre>
                <button class="btn btn-block btn-primary rounded-0" type="submit">PROCESS</button>
            </form>
        </div>
        <div class="result">
            <div class="text-end">
                <button class="btn btn-block btn-primary rounded-0" onclick="copyOnPress()" type="button">COPY</button>
                <button class="btn btn-block btn-primary rounded-0" onclick="downoadOnPress()" type="button">DOWNLOAD</button>
            </div>
            <pre id="result_code" data-fouc></pre>
        </div>
    <div>

    <script src="/js/ace/ace.js" type="text/javascript"></script>
    <script src="/js/jsontoflutterclass.js" type="text/javascript"></script>
</body>
</html>
