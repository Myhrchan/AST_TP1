const url = require('url')
const qs = require('querystring')

module.exports = {

    serverHandle: function (req, res) {
        const route = url.parse(req.url);
        const path = route.pathname;
        const params = qs.parse(route.query);

        const description = "Je suis Mariane CHAMPALIER, etudiante a l'ECE Paris, et vous etes sur ma page.";
        const explain = '<!DOCTYPE html>' +
            '<html>' +
            '    <head>' +
            '        <meta charset="utf-8" />' +
            '        <title>ECE AST</title>' +
            '    </head>' +
            '    <body>' +
            '         <h1>Instructions</h1>' +
            '         <p>Type <em>/hello</em> to print Hello on the page, and  <em>/hello?name=yourName</em>  so that the website tells you hello. </br>' +

            '         To see a short description of myself, type the url <em>/hello?name=mariane</em></p>' +
            '    </body>' +
            '</html>'

        if (path === '/hello') {
            if ('name' in params && params['name'].toLowerCase() == "mariane") {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.write(description);
            }
            else if ('name' in params) {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.write('Hello ' + params['name']);
            }
            else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.write('Hello');
            }
        }
        else if (path === "/explains") {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(explain);
        }
        else {
            res.writeHead(404);
            res.write('Page not found');
        }

        res.end();
    }
}