TODO
* Pridat nejaky zvuk na hokynarstvo
* pridat nejaky zvuk (alebo nieco), ked napriklad po niekom strielam a on da vedle, tak ze idem zase ja, chapes :D
* zachranne pivo
* Upravit game over screen, nech je vidno, kto bol aka postava a tak
* Log
    * logovat iba eventy, ktore sa naozaj uskutocnia. Teraz do logu zapise aj "pokus o vystrel", ktory sa realne neuskutocni (ked hrac nema dostrel)
    * do logu pridat rozdelenie, kedy zacina kolo
    * celkovo zlepsit log, niektore veci sa loguju zbytocne alebo neuplne informacie
* Otestovat smrt po vybuchu dynamitu - ci mrtvy hrac zahodi karty do kopky
* ~~3 karty po smrti banditu, serif zahodi karty ked zabije vica~~
* ~~Slab the killer vs. barel treba nejako poriesit, ale ja si ani nepamatam ako to byva v normalnej hre :D~~
    * ~~este Slab the killer vs. Lucky duke s barellom (neviem co bude robit)~~
      * uz by to malo vsetko fungovat - TESTOVAT!!!
* ~~(?) kontrola, ci sa striela na mrtveho hraca je zatial client-side. Prerobit na server side?~~
* ~~Zoomovanie na charactery som robil po 4 piffkach, takze je to dost dirty spravene, ale ak to nebudes chciet spravit krajsie, tak tento bod zmaz, dobru nocku idem spinkat~~

POZNAMKI
* Ak niekedy bude blbnut citanie suboru, tak to moze byt kvoli CRLF vs LF. Kod funguje na LF kodovanie
  
    * za poslednou kartou v subore **nesmie** byt newline

