const renderHTML = (res, data) => {
    if(data === null){
        data = {
            isHaveResponse : false,
            response : false,
        }
    }
    res.set('Content-Type', 'text/html');
    res.send(
`
<html>
    <body>
        <pre>${data.isHaveResponse} ${data.response}</pre>    
    </body>
</html>    
`);
}

module.exports = renderHTML