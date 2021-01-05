TODO
* Pridat nejaky zvuk na hokynarstvo ?
* Log
    * ~~pri tahani na barel - logovat, aka karta bola potiahnuta~~
    * Lucky Duke logovanie nejako spravit
    * tam kde to ma zmysel, pisat do logu aj typ karty (srdce, piko...)
* Vera_custer je v testovacej faze (vela toho treba poosetrovat)
    * willy the kid nejde - vypada ze ide


Zistene bugy pocas hrania s chalosmi:
* ~~dostrel zle vypocitany: http://prntscr.com/w9wt77~~
    * malo by byt fixnute
* volcanic limit bangov zostal 100, aj ked vulcanic uz zmizol
    * ked volcanic zobrali catbalou , tak zostal limit 100



POZNAMKI
* Ak niekedy bude blbnut citanie suboru, tak to moze byt kvoli CRLF vs LF. Kod funguje na LF kodovanie
  
    * za poslednou kartou v subore **nesmie** byt newline

* *deck_final.txt* nebabrať - to je finálna verzia decku. Testy robiť s *deck.txt*
