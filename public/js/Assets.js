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
    Sprites.dostavnik = loadIMG("imgs/", "diligenza.png");
    Sprites.wellsfargo = loadIMG("imgs/", "wellsfargo.png");
    Sprites.pivo = loadIMG("imgs/", "beer.png");
    Sprites.salon = loadIMG("imgs/", "saloon.png");
    Sprites.catbalou = loadIMG("imgs/", "catbalou.png");
    Sprites.indiani = loadIMG("imgs/", "indians.png");
    Sprites.gulomet = loadIMG("imgs/", "gatling.png");
    Sprites.panika = loadIMG("imgs/", "panico.png");
    Sprites.hokynarstvo = loadIMG("imgs/", "emporio.png");
    Sprites.duel = loadIMG("imgs/", "duel.png");
    
    Sprites.schofield = loadIMG("imgs/", "schofield.png");
    Sprites.remington = loadIMG("imgs/", "remington.png");
    Sprites.carabine = loadIMG("imgs/", "carabine.png");
    Sprites.winchester = loadIMG("imgs/", "winchester.png");
    Sprites.volcanic = loadIMG("imgs/", "volcanic.png");
    Sprites.appaloosa = loadIMG("imgs/", "appaloosa.png");
    Sprites.mustang = loadIMG("imgs/", "mustang.png");
    
    Sprites.barel = loadIMG("imgs/", "barrel.png");
    Sprites.dynamit = loadIMG("imgs/", "dynamite.png");
    Sprites.vazenie = loadIMG("imgs/", "jail.png");
    
    Sprites.srdce = loadIMG("imgs/", "srdce.png");
    Sprites.pika = loadIMG("imgs/", "pika.png");
    Sprites.kara = loadIMG("imgs/", "kara.png");
    Sprites.tref = loadIMG("imgs/", "tref.png");

    Sprites.back = loadIMG("imgs/", "back.png");
    Sprites.back_character = loadIMG("imgs/", "back-character.png");

    Sprites.sheriff = loadIMG("imgs/", "sheriff.png");
    Sprites.vice = loadIMG("imgs/", "vice.png");
    Sprites.bandita = loadIMG("imgs/", "outlaw.png");
    Sprites.odpadlik = loadIMG("imgs/", "renegade.png");

    Sprites.black_jack = loadIMG("imgs/", "black-jack.png");
    Sprites.bart_cassidy = loadIMG("imgs/", "bart-cassidy.png");
    Sprites.calamity_janet = loadIMG("imgs/", "calamity-janet.png");
    Sprites.el_gringo = loadIMG("imgs/", "el-gringo.png");
    Sprites.jesse_jones = loadIMG("imgs/", "jesse-jones.png");
    Sprites.jourdonnais = loadIMG("imgs/", "jourdonnais.png");
    Sprites.kit_carlson = loadIMG("imgs/", "kit-carlson.png");
    Sprites.lucky_duke = loadIMG("imgs/", "lucky-duke.png");
    Sprites.paul_regret = loadIMG("imgs/", "paul-regret.png");
    Sprites.pedro_ramirez = loadIMG("imgs/", "pedro-ramirez.png");
    Sprites.rose_doolan = loadIMG("imgs/", "rose-doolan.png");
    Sprites.sid_ketchum = loadIMG("imgs/", "sid-ketchum.png");
    Sprites.slab_the_killer = loadIMG("imgs/", "slab-the-killer.png");
    Sprites.suzy_lafayette = loadIMG("imgs/", "suzy-lafayette.png");
    Sprites.vulture_sam = loadIMG("imgs/", "vulture-sam.png");
    Sprites.willy_the_kid = loadIMG("imgs/", "willy-the-kid.png");
    Sprites.felipe_prisonero = loadIMG("imgs/", "felipe_prisonero.png");
 

    AssetsLoading_loop();
}
