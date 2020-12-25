TODO
* Pridat nejaky zvuk na hokynarstvo
* ~~zachranne pivo~~
    * pridane, ale treba poriadne otestovat, ci funguje - nefunguje poriadne - vid dole bugy
* Log
    * ~~vybuch dynamitu logovat~~
    * **pri tahani na vazenie, dynamit, barel - logovat, aka karta bola potiahnuta**
    * logovat discardovanie kariet?
    * ~~logovat iba eventy, ktore sa naozaj uskutocnia. Teraz do logu zapise aj "pokus o vystrel", ktory sa realne neuskutocni (ked hrac nema dostrel)~~
* Otestovat smrt po vybuchu dynamitu - ci mrtvy hrac zahodi karty do kopky


Zistene bugy pocas hrania s chalosmi:
* ~~Hráč vybuchol na dynamit (zomrel), ďalšieho to preskočilo a dalo mu to 3 karty (znova sa to stalo - fakt skontrolovat!!!)~~
    * malo by to by ok
* Double click na next preskoci dalsieho hraca?
    * stalo sa, ze to preskocilo komplet tah niekoho
* Ked sa hrac odpoji, nemalo by to triggernut Death() - lebo to potom robi, akoby ho niekto zabil
* ~~Willy the kid ked zahra vulcanic a potom si ho zmeni, tak mu to deaktivuje schopnost ?~~
    * malo by byt fixnute
* ~~Ked serif zabije vicea, mal by stratit vsetky karty (aj tie co ma na stole)~~
* ~~Na Calamity Janet neslo pouzit zachranne pivo (na ruke mal 2 piva)~~
    * ~~server.js:122 - asi tuto bude problem~~
    * len par x testovane
* ~~Ked chcem zahrat zachranne pivo po dynamite, treba klinut na kopku~~
* nie som si isty, ci toto je pravda:
    * server.js:475: ak hrac zomrie na dynamit, malo by sa cakat, kym sa vykona kod jeho smrti, predtym ako to pusti dalsieho hraca na tah
* dat deasync wait na miesta, kde to vyzera, ze treba...
* ~~ked hracovi vybuchne dynamit (resp na zaciatku tahu) ked mu dovoli zahrat safe beer, tak zakazat vsetky ostatne akcie - napr. nesmie mat moznost tahat si karty~~
    * malo by byt fixnute
* ~~vazenie - ked sa hrac nedostane z vazenia, v odhadzovacej kopke by malo na vrchu zostat vazenie, nie ta karta, ktora sa tahala~~
    * ~~cize zmenit poradie - najprv sa tam hodi potiahnuta karta, az potom sa zahodi vazenie~~
    * ~~ak je kopka prazdna a taha sa na vazenie, potiahnutu karut a vazenie v kopke neukaze~~
* suzy - ked jej el-gringo zobral kartu a nezostalo jej nic na ruke, tak sa jej nepotiahla karta
    * malo by to byt aj fixnute - skontrolovat


POZNAMKI
* Ak niekedy bude blbnut citanie suboru, tak to moze byt kvoli CRLF vs LF. Kod funguje na LF kodovanie
  
    * za poslednou kartou v subore **nesmie** byt newline

* *deck_final.txt* nebabrať - to je finálna verzia decku. Testy robiť s *deck.txt*