const socket = io();

socket.on("message",(msg)=>{
    console.log(msg);
})

document.addEventListener("click",e=>{
    var rect = canvas.getBoundingClientRect();
    var mouse = {x: e.clientX-rect.left, y: e.clientY-rect.top};
    socket.emit("clicked", mouse, socket.id );
})