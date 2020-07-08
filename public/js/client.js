const socket = io();

socket.on("message", (msg) => {
    console.log(msg);
})

socket.on("update", hra => {
    console.log(hra);
})

document.addEventListener("click", e => {
    var rect = canvas.getBoundingClientRect();
    var mouse = {x: e.clientX-rect.left, y: e.clientY-rect.top};
    socket.emit("clicked", mouse, socket.id );
})

function drawScene() {
    clear();
}