TODO
* ~~Discard() presunut komplet na server-side (nech klient robi iba request, nech kontrola kariet a zivotov nie je na client-side...)~~
    * opravit - pridat podmienky do socket handlu
POZNAMKI
* Ak niekedy bude blbnut citanie suboru, tak to moze byt kvoli CRLF vs LF. Kod funguje na LF kodovanie
    * za poslednou kartou v subore **nesmie** byt newline