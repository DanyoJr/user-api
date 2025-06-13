const http = require('http');
const fs = require('fs');
const { Z_DATA_ERROR } = require('zlib');

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    //setando o conteudo do header
    res.setHeader('Content-Type', 'text/html');

    let path = './';

    switch(req.url){
        case '/':
            path += 'interface/index.html';
            res.statusCode = 200;
            break;

         case 'interface/index.html':
            res.statusCode = 301;
            res.setHeader('Location', '/');
            res.end()
            break;
        
        default:
            path += '404.html';
            res.statusCode = 404;
            break;
    };

    //setando um arquivo html
    fs.readFile(path, (err, data) => {
        if(err){
            console.log(err);
            res.end();
        } else{
            //res.write(data);
            res.statusCode = 200;
            res.end(data);
        }
    });

});

server.listen(3030, ()=>{
    console.log('serve running');
});
