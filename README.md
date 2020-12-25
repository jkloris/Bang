TODO
* Pridat nejaky zvuk na hokynarstvo
* ~~zachranne pivo~~
    * pridane, ale treba poriadne otestovat, ci funguje - nefunguje poriadne - vid dole bugy
* Log
    * ~~vybuch dynamitu logovat~~
    * **pri tahani na vazenie, dynamit, barel - logovat, aka karta bola potiahnuta**
    * logovat discardovanie kariet?
    * ~~logovat iba eventy, ktore sa naozaj uskutocnia. Teraz do logu zapise aj "pokus o vystrel", ktory sa realne neuskutocni (ked hrac nema dostrel)~~


Zistene bugy pocas hrania s chalosmi:
* Double click na next preskoci dalsieho hraca?
    * stalo sa, ze to preskocilo komplet tah niekoho
* ~~Ked sa hrac odpoji, nemalo by to triggernut Death() - lebo to potom robi, akoby ho niekto zabil~~
    * malo by byt fixnute
* ~~Willy the kid ked zahra vulcanic a potom si ho zmeni, tak mu to deaktivuje schopnost ?~~
    * malo by byt fixnute
* Calamity sa opravovalo zachranne pivo - testovat, ci Calamity funguje spravne
* ~~nie som si isty, ci toto je pravda:~~
    * ~~server.js:475: ak hrac zomrie na dynamit, malo by sa cakat, kym sa vykona kod jeho smrti, predtym ako to pusti dalsieho hraca na tah~~
    * ~~dat deasync wait na miesta, kde to vyzera, ze treba...~~
* suzy - ked jej el-gringo zobral kartu a nezostalo jej nic na ruke, tak sa jej nepotiahla karta
    * malo by to byt aj fixnute - skontrolovat


POZNAMKI
* Ak niekedy bude blbnut citanie suboru, tak to moze byt kvoli CRLF vs LF. Kod funguje na LF kodovanie
  
    * za poslednou kartou v subore **nesmie** byt newline

* *deck_final.txt* nebabrať - to je finálna verzia decku. Testy robiť s *deck.txt*