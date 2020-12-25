TODO
* Pridat nejaky zvuk na hokynarstvo ?
* Log
    * ~~pri tahani na barel - logovat, aka karta bola potiahnuta~~
    * Lucky Duke logovanie nejako spravit


Zistene bugy pocas hrania s chalosmi:
* Double click na next preskoci dalsieho hraca?
    * stalo sa, ze to preskocilo komplet tah niekoho
    * odvtedy sa to nestalo, tak neviem...
* Calamity sa opravovalo zachranne pivo - testovat, ci Calamity funguje spravne
* suzy - ked jej el-gringo zobral kartu a nezostalo jej nic na ruke, tak sa jej nepotiahla karta
    * malo by to byt aj fixnute - skontrolovat
* dostrel zle vypocitany: http://prntscr.com/w9wt77


POZNAMKI
* Ak niekedy bude blbnut citanie suboru, tak to moze byt kvoli CRLF vs LF. Kod funguje na LF kodovanie
  
    * za poslednou kartou v subore **nesmie** byt newline

* *deck_final.txt* nebabrať - to je finálna verzia decku. Testy robiť s *deck.txt*
