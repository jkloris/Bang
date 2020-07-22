TODO
* Kontrola, ci hrac zije pri jednotlivych akciach (bang, indiani,..)
    * (?) kontrola, ci sa striela na mrtveho hraca je zatial client-side. Prerobit na server side?
    * Indiani by mali preskakovat mrtvych hracov
    * Takisto aj Salon by mal preskakovat mrtvych hracov
    * mozeme tento bod zmazat, ked otestujeme, ci to naozaj funguje...nechce sa mi teraz robit nejake random testovanie, takze zistime praxou :D
* Vylepsit indianov - AKO??????
* ~~Ked hrac nema pocas hry ziadne karty, nedovoli mu to normalne hrat..vyskoci mu tlacitko na start hry a pod. Treba fixnut, ale neviem kde :D~~
* ~~Discard() presunut komplet na server-side (nech klient robi iba request, nech kontrola kariet a zivotov nie je na client-side...)~~
    * ~~opravit - pridat podmienky do socket handlu~~

POZNAMKI
* Ak niekedy bude blbnut citanie suboru, tak to moze byt kvoli CRLF vs LF. Kod funguje na LF kodovanie
    * za poslednou kartou v subore **nesmie** byt newline
