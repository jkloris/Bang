TODO
* Pridat nejaky zvuk na hokynarstvo
* ~~zachranne pivo~~
    * pridane, ale treba poriadne otestovat, ci funguje
        * hlavne s dynamitom
* Log
    * vybuch dynamitu logovat
    * pri tahani na vazenie, dynamit, barel - logovat, aka karta bola potiahnuta
    * logovat discardovanie kariet
    * logovat iba eventy, ktore sa naozaj uskutocnia. Teraz do logu zapise aj "pokus o vystrel", ktory sa realne neuskutocni (ked hrac nema dostrel)
* Otestovat smrt po vybuchu dynamitu - ci mrtvy hrac zahodi karty do kopky
* ~~Slab the killer vs. barel treba nejako poriesit, ale ja si ani nepamatam ako to byva v normalnej hre :D~~
    * ~~este Slab the killer vs. Lucky duke s barellom (neviem co bude robit)~~
      * uz by to malo vsetko fungovat - TESTOVAT!!!
* ~~(?) kontrola, ci sa striela na mrtveho hraca je zatial client-side. Prerobit na server side?~~
* Hra spadla pri Calamity v dueli 


Zistene pocas hrania s chalosmi:
* Hráč vybuchol na dynamit, ďalšieho to preskočilo a dalo mu to 3 karty

* Double click na next preskoci dalsieho hraca?
    * stalo sa, ze to preskocilo komplet tah niekoho

* Ked sa hrac odpoji, nemalo by to triggernut Death() - lebo to potom robi, akoby ho niekto zabil
* ~~Willy the kid ked zahra vulcanic a potom si ho zmeni, tak mu to deaktivuje schopnost ?~~


POZNAMKI
* Ak niekedy bude blbnut citanie suboru, tak to moze byt kvoli CRLF vs LF. Kod funguje na LF kodovanie
  
    * za poslednou kartou v subore **nesmie** byt newline

* Dynamit odstraneny z decku