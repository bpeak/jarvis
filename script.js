var html = `
<html>
    <body>
        <pre>true ㄴㅇㄹㄴㅇㄹ ㄴㅇㄹ ㄴㅇㄹ ㄴㅇㄹ 
        ㄴㅇㄹㄴㅇㄹ ㅇㄴㄹ ㅇ&lt;ㄴㄹ ㅇabcㄴㄹ </pre>    
    </body>
</html>
`
var parse1 = html.slice(html.indexOf("<pre>"), html.length)
var parse2 = parse1.slice(5, parse1.indexOf("</pre>"))
var index = parse2.indexOf(" ")
var front = parse2.substr(0, index)
var end = parse2.substr(index, parse2.length - 1)
end = end.replace(/&lt;/gi, "<")
end = end.replace(/&gt;/gi, ">")
if(front.trim() === "true"){
    console.log(end.trim())
}


var html = Utils.getWebText("http://172.30.1.40:4000/?msg=" + msg + "&sender=" + sender + "&room=" + room)
var parse1 = html.slice(html.indexOf("<pre>"), html.length)
var parse2 = parse1.slice(5, parse1.indexOf("</pre>"))
var index = parse2.indexOf(" ")
var front = parse2.substr(0, index)
var end = parse2.substr(index, parse2.length - 1)
end = end.replace(/&lt;/gi, "<")
end = end.replace(/&gt;/gi, ">")
if(front.trim() === "true"){
    replier.reply(end.trim())
}