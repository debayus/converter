<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <title>Text Group - Mahas</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="/css/textgroup.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>
    <nav class="navbar navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="/textgroup">Text Group</a>
        </div>
    </nav>
    <div class="main">
        <div class="menu">
            <form onsubmit="formOnSubmit(event)">
                <pre id="input_json" data-fouc></pre>
                <button class="btn btn-primary rounded-0" type="submit">PROCESS</button>
            </form>
        </div>
        <div class="menu">
            <form onsubmit="formOnSubmit(event)">
                <pre id="input_update" data-fouc></pre>
                <button class="btn btn-primary rounded-0" type="submit">PROCESS</button>
            </form>
        </div>
        <div class="result">
            <div class="text-end result-buttons">
                <button class="btn btn-primary rounded-0" onclick="copyOnPress()" type="button">COPY</button>
                <button class="btn btn-primary rounded-0" onclick="downoadOnPress()" type="button">DOWNLOAD</button>
            </div>
            <pre id="result_code" data-fouc></pre>
        </div>
    <div>

    <script src="/js/ace/ace.js" type="text/javascript"></script>
    <script src="/js/textgroup.js" type="text/javascript"></script>
</body>
</html>
