const url = require('url')

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

module.exports = function(app){

    const crud = {
        hello: (req,res) => {
            res.send("Hello")
        },
        helloName: (req,res) => {
            if(req.params.name.toLowerCase() == "mariane"){
                res.send(description)
            }
            else res.send(`Hello ${req.params.name}`)
        },
        explain: (req,res) => {
            res.send(explain)
        },
        error: (req,res) => {
            res.send('Page not found',404);
        }
    }

    return app
        .get('/hello/:name', crud.helloName)
        .get('/hello', crud.hello)
        .get('/explains', crud.explain)
        .get('*', crud.error)
}