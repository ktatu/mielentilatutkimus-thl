[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/ohtuprojekti-mielentilatutkimus-thl/mielentilatutkimus-thl/actions/workflows/cd.yml/badge.svg)](https://github.com/ohtuprojekti-mielentilatutkimus-thl/mielentilatutkimus-thl/actions/workflows/cd.yml)
[![Staging](https://github.com/ohtuprojekti-mielentilatutkimus-thl/mielentilatutkimus-thl/actions/workflows/staging.yml/badge.svg)](https://github.com/ohtuprojekti-mielentilatutkimus-thl/mielentilatutkimus-thl/actions/workflows/staging.yml)
[![codecov](https://codecov.io/gh/ohtuprojekti-mielentilatutkimus-thl/mielentilatutkimus-thl/branch/codecov/graph/badge.svg?token=rx0tIT6gVh)](https://codecov.io/gh/ohtuprojekti-mielentilatutkimus-thl/mielentilatutkimus-thl)

# mielentilatutkimus-thl

Mielentilatutkimus-thl on Terveyden ja hyvinvoinnin laitoksen (THL) mielentilatutkimusprosessia tukeva sovellus. Sovelluksen tavoite on varmistaa kansalaisten oikeusturvan toteutuminen, varmistaa mielentilatutkimusprosessien toimivuus ja vertailtavuus, sekä mahdollistaa tapaus- ja tilastoaineistojen kertyminen tieteellisen tutkimuksen tarpeisiin. 

Sovellusta toteutetaan Helsingin yliopiston aineopintojen kurssille Ohjelmistotuotantoprojekti (syksy 2021).

Linkit dokumentteihin:

* [Product backlog](https://docs.google.com/spreadsheets/d/1g_P3_va9YlYGpdnrq8FU41d5oZMHb35h9sNbHyAd-OI/edit#gid=512054485)
* [Sprint backlog](https://docs.google.com/spreadsheets/d/1kkBy4tXDKeBQ4vNx6RjYenB6CSsVMmcFq5vtddrigGc/edit#gid=2080422479)
* [Työaikakirjanpito](https://docs.google.com/spreadsheets/d/1p0x6vLt4iKnx1ox4t_BIjJfagC9palWiz4syX8-ceUE/edit#gid=0)

## Demovideo
[![demovideo](https://img.youtube.com/vi/GNzB9eid5cI/0.jpg)](https://www.youtube.com/watch?v=GNzB9eid5cI)

## Dokumentaatio


* [Tekninen toteutus](https://github.com/ohtuprojekti-mielentilatutkimus-thl/mielentilatutkimus-thl/tree/main/dokumentaatio/toteutus.md)
* [Sovelluksen toiminnallisuuksien kuvaukset](https://docs.google.com/document/d/1eri57ZCDeMbGBXXQlGoBN3HUaykOZMgz1Ea3049YLCo/edit?usp=sharing)

## Asennusohje

Sovelluksen kehitys on tapahtunut Ubuntun versiolla 18.04, eivätkä mm. package.json-tiedostojen komennot välttämättä toimi muilla käyttöjärjestelmillä.

### Repositorion lataaminen

Suorita terminaalissa komento:
```
git clone https://github.com/ohtuprojekti-mielentilatutkimus-thl/mielentilatutkimus-thl/
```

### Tietokanta

Backend käyttää tietokantana paikallisesti pyörivää MongoDB:tä, joka tulee olla asennettuna sovelluksen käyttöä varten. MongoDB:n asennusohjeet löydät [täällä](https://docs.mongodb.com/manual/administration/install-community/).

### Backend

> Alla olevat komennot suoritetaan `backend` kansion juuressa.

Ensimmäisellä kerralla asenna backendin riippuvuudet suorittamalla komento `npm install`

#### Palvelimen käynnistäminen porttiin 3001
```
npm start
```


### Frontend

Sovelluksessa on kaksi erillistä frontendiä, toinen on suunnattu mielentilatutkimuspyyntöä tekevälle taholle, ja toinen THL:n edustajille, jotka tarkastelevat tehtyjä mielentilatutkimuspyyntöjä. `frontend`-kansiosta löydät mielentilatutkimuspyyntöä tekevän tahon sovellusnäkymän, ja `thl-frontend`-kansiosta THL:n edustajille suunnatun näkymän.

> Alla olevat komennot suoritetaan `frontend`- tai `thl-frontend`-kansion juuressa.

Ensimmäisellä kerralla asenna frontendin riippuvuudet suorittamalla komento `npm install`. 

#### Palvelimen käynnistäminen
```
npm start
```

`frontend` toimii osoitteessa localhost:3000/mielentilatutkimus/basic_information_form.
`thl-frontend` toimii osoitteessa localhost:3002/thl/thl-admissions.

#### Tuotantoversion buildaaminen

Frontendien tuotantoversiot on yhdistetty backendissä, eli voit suorittaa molempien frontendien allaolevat komennot ja käyttää niitä samanaikaisesti.

Kopioidaan frontendistä tuotantokoodi backendille.

Seuraavat komennot syötetään `backend`-kansion juuressa:

Mielentilatutkimuspyyntöä tekevä taho:
```
npm run build:ui
```

THL:
```
npm run build:thl
```

Vaihtoehtoisesti molemmat tuotantoversiot voi luoda komennolla `npm run build:both`. Tämä kuitenkin vaatii suoritusoikeuksien lisäämistä skriptille `build_frontends.sh`. Lisäohjeet [täällä](https://github.com/ohtuprojekti-mielentilatutkimus-thl/mielentilatutkimus-thl/tree/main/scripts).

Seuraavaksi suorita komento:

```
npm start
```
Tuotantoversioita käytettäessä frontendien alkuosoitteet ovat localhost:3001/mielentilatutkimus/basic_information_form ja localhost:3001/thl/thl-admissions

### Testaus

#### Backendin testien ajaminen

Backendin testit suoritetaan `backend`-kansiossa komennolla:

```
npm test
```

#### Frontendien testien ajaminen

Frontendien testit suoritetaan joko kansiossa `frontend` tai `thl-frontend` komennolla:

```
npm test
```

#### Sovelluskoodin ESlint tarkistus

Tyylitarkistuksen voi suorittaa `backend`-kansiossa komennolla:

```
npm run lint
```

#### EndToEnd -testaus  
Käynnistä frontend komennolla `npm start` ja backend komennolla `npm run start:cypress`, sekä suorita `frontend` komento:  
```
npm run cypress:open
```
Cypress-testejä voi myös suorittaa [bash-skriptillä](https://github.com/ohtuprojekti-mielentilatutkimus-thl/mielentilatutkimus-thl/tree/main/scripts)

#### Sähköpostivahvistukset  
Sovelluksen lähettämät sähköpostiviestit menevät tällä hetkellä `mailDev`:in kautta osoitteeseen `localhost:1080`.
Lisää ohjeita täällä: https://maildev.github.io/maildev/
