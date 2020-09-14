TODO
* Slab the killer vs. barel treba nejako poriesit, ale ja si ani nepamatam ako to byva v normalnej hre :D
* Logovat iba eventy, ktore sa naozaj uskutocnia. Teraz do logu zapise aj "pokus o vystrel", ktory sa realne neuskutocni (ked hrac nema dostrel)
* ~~Bang aj~~ Barel je zatial mozne pouzit nekonecne vela krat (neponahla to)
* Otestovat smrt po vybuchu dynamitu - ci mrtvy hrac zahodi karty do kopky
* (?) kontrola, ci sa striela na mrtveho hraca je zatial client-side. Prerobit na server side?
* ~~Kontrolovat, ci spravne funguje duel - nie je otestovany zatial~~
    * ~~myslim, ze funguje~~
* ~~Zoomovanie na charactery som robil po 4 piffkach, takze je to dost dirty spravene, ale ak to nebudes chciet spravit krajsie, tak tento bod zmaz, dobru nocku idem spinkat~~
* ~~Nejake normalne zobrazenie konca hry + ukoncit moznost pokracovat v hre, ktora ma vitaza~~
    * ~~kontrolovat, ci naozaj funguje - ci spravne vyhodnocuje, kto vyhral - myslím, že áno, tak dávam preč~~
* ~~Oznamenie hracovi, ze na neho bola pouzita panika/catbalou~~
    * ~~Klikanie na log by malo fungovat vzdy, teraz funguje iba ked je hrac na tahu. Da sa to spravit nejako jednoducho? Lebo klikanie handluje server a posiela click accepty~~
* ~~Mrtvemu hracovi po smrti vykreslilo karty, ktore ma (mal) na ruke - opravit~~
* ~~Kontrola, ci hrac zije pri jednotlivych akciach (bang, indiani,..)~~
    * ~~(!) kontrola vzdialenosti berie do vypoctu aj mrtvych hracov - opravit~~
    * ~~Indiani by mali preskakovat mrtvych hracov~~
    * ~~Takisto aj Salon by mal preskakovat mrtvych hracov~~
    * ~~mozeme tento bod zmazat, ked otestujeme, ci to naozaj funguje...nechce sa mi teraz robit nejake random testovanie, takze zistime praxou :D~~
        * ~~uz som nasiel nejaké chyby pri indianoch, tak to tu ešte nechame, ci sa nieco nenajde~~
* ~~Spravit celu hru tak, aby sa dala restartnut (zaca odznova) priamo z aplikacie, bez nutnosti restartovat server~~
    * hotovo - kontrolovať, či to funguje správne
* ~~Vazenie ked zahram, tak sa da aj hracovi, ktoreho chcem dat do vazenia, AJ do vyhodenej kopky - opravit !!!~~
* ~~Vylepsit indianov - AKO??????~~
* ~~Ked hrac nema pocas hry ziadne karty, nedovoli mu to normalne hrat..vyskoci mu tlacitko na start hry a pod. Treba fixnut, ale neviem kde :D~~
* ~~Discard() presunut komplet na server-side (nech klient robi iba request, nech kontrola kariet a zivotov nie je na client-side...)~~
    * ~~opravit - pridat podmienky do socket handlu~~
* ~~Vrchna modra karta snima pri kliku len cast ktora je odokryta, ak by nebola uplne vrcha. Fix -> Ma snimat celu kartu~~
* ~~Ked hrac zomrie, jeho karty by mali ist do kopky~~
* ~~Panika (mozno aj cat belou, to neviem zatial) dava zobranu kartu aj mne, aj do vyhodenej kopky~~
    * ~~cat belou myslim, ze nie~~

POZNAMKI
* Reštart hry z ktoréhokoľvek klienta: cez konzolu treba poslať riadok

    ```javascript
    socket.emit('restart');
    ```

* Ak niekedy bude blbnut citanie suboru, tak to moze byt kvoli CRLF vs LF. Kod funguje na LF kodovanie
    
    * za poslednou kartou v subore **nesmie** byt newline

