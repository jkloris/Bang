//funkcie na vykreslovanie do canvasu

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function clear(){
    ctx.fillStyle="white";
    ctx.fillRect(0,0,1000,1000);
}
clear();
