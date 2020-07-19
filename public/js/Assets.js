let Sprites = {};
let Notloaded_assets = 0;

function AssetsLoading_loop(){

    if(Notloaded_assets > 0){
        requestAnimationFrame(AssetsLoading_loop.bind(this));
    } 
}

function loadAssets(){

    function loadIMG(path, imgName){
        Notloaded_assets++;

        var img = new Image();
        img.src = path + imgName;

        img.onload = function(){
            Notloaded_assets--;
        }

        return img;
    }
   

    Sprites.bang = loadIMG("imgs/", "bang.png");
    Sprites.vedle = loadIMG("imgs/", "missed.png");
    Sprites.back = loadIMG("imgs/", "back.png");
    Sprites.dostavnik = loadIMG("imgs/", "diligenza.png");
    Sprites.wellsfargo = loadIMG("imgs/", "wellsfargo.png");
    Sprites.pivo = loadIMG("imgs/", "beer.png");

    AssetsLoading_loop();
}
