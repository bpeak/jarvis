const send = (msg, sender, room) => {
    return fetch(`http://localhost:4000?msg=${msg}&sender=${sender}&room=${room}`)
}

window.addEventListener('keypress', (e) => {
    if(e.keyCode === 13){
        const msg = document.getElementById('msg').value
        const sender = document.getElementById('sender').value

        const div = document.getElementById('div')
        const myDiv = document.createElement("div")
        myDiv.setAttribute('id', "user")
        myDiv.innerHTML = `${sender} : ${msg}`
        div.appendChild(myDiv)


        const room = document.getElementById('room').value
        document.getElementById('msg').value = ""
        send(msg, sender, room)
        .then(response => response.text())
        .then(html => {
            var parse1 = html.slice(html.indexOf("<pre>"), html.length)
            var parse2 = parse1.slice(5, parse1.indexOf("</pre>"))
            var index = parse2.indexOf(" ")
            var front = parse2.substr(0, index)
            var end = parse2.substr(index, parse2.length - 1)
            if(front.trim() === "true"){
                const responseDiv = document.createElement('div')
                responseDiv.innerHTML = end.trim()
                div.appendChild(responseDiv)
                div.scrollTop = div.scrollHeight           
                console.log(end.trim()) 
            }
        })
    }
})
document.getElementById('btn').addEventListener('click', () => {
    const msg = document.getElementById('msg').value
    const sender = document.getElementById('sender').value

    const div = document.getElementById('div')
    const myDiv = document.createElement("div")
    myDiv.setAttribute('id', "user")
    myDiv.innerHTML = `${sender} : ${msg}`
    div.appendChild(myDiv)


    send(msg, sender)
    .then(response => response.text())
    .then(html => {
        var parse1 = html.slice(html.indexOf("<pre>"), html.length)
        var parse2 = parse1.slice(5, parse1.indexOf("</pre>"))
        var index = parse2.indexOf(" ")
        var front = parse2.substr(0, index)
        var end = parse2.substr(index, parse2.length - 1)
        if(front.trim() === "true"){
            const responseDiv = document.createElement('div')
            responseDiv.innerHTML = end.trim()
            div.appendChild(responseDiv)
            div.scrollTop = div.scrollHeight            
        }
    })
})


// const html = "<html><head></head><body><pre>true 레스폰스!</pre></body></html>"

// // replier.reply(Utils.getWebText("http://172.30.1.47/?msg=" + msg + "?sender=" + sender))

// var html = "<html><head></head><body><pre>true 이거 전부다 잘 받\n아지는 부분임 ? ? ? </pre></body></html>"
// var parse1 = html.slice(html.indexOf("<pre>"), html.length)
// var parse2 = parse1.slice(5, parse1.indexOf("</pre>"))
// var index = parse2.indexOf(" ")
// var front = parse2.substr(0, index)
// var end = parse2.substr(index, parse2.length - 1)
// if(front.trim() === "true"){
//     replier.reply(end.trim())
// }
