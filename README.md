[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


# mielentilatutkimus-thl

Mielentilatutkimus-thl on Terveyden ja hyvinvoinnin laitoksen (THL) mielentilatutkimusprosessia tukeva sovellus. Sovelluksen tavoite on varmistaa kansalaisten oikeusturvan toteutuminen, varmistaa mielentilatutkimusprosessien toimivuus ja vertailtavuus, sekä mahdollistaa tapaus- ja tilastoaineistojen kertyminen tieteellisen tutkimuksen tarpeisiin. 

Sovellusta toteutetaan Helsingin yliopiston aineopintojen kurssille Ohjelmistotuotantoprojekti (syksy 2021).

Linkit dokumentteihin:

* [Product backlog](https://docs.google.com/spreadsheets/d/1g_P3_va9YlYGpdnrq8FU41d5oZMHb35h9sNbHyAd-OI/edit#gid=512054485)
* [Sprint backlog](https://docs.google.com/spreadsheets/d/1kkBy4tXDKeBQ4vNx6RjYenB6CSsVMmcFq5vtddrigGc/edit#gid=2080422479)
* [Työaikakirjanpito](https://docs.google.com/spreadsheets/d/1p0x6vLt4iKnx1ox4t_BIjJfagC9palWiz4syX8-ceUE/edit#gid=0)

## Dokumentaatio


* [Tekninen toteutus](https://github.com/ohtuprojekti-mielentilatutkimus-thl/mielentilatutkimus-thl/tree/main/dokumentaatio/kayttoohje.md)

## Asennusohje

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

#### Palvelimen käynnistäminen porttiin 3000
```
npm start
```

`frontend` toimii osoitteessa localhost:3000/basic_information_form.
`thl-frontend` toimii osoitteessa localhost:3000/thl-admissions.

#### Tuotantoversion buildaaminen

Kopioidaan frontendistä tuotantokoodi backendille. Tämä tapahtuu seuraavasti:

`backend`-kansion juuressa suorita komento:

Mielentilatutkimuspyyntöä tekevä taho:
```
npm run build:ui
```

THL:
```
npm run build:thl
```

Seuraavaksi suorita komento:

```
npm start
```
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
Käynnistä sekä front- että backend (npm start) ja suorita `frontend` komento:  
```
npm run cypress:open
```
#### Sähköpostivahvistukset  
Sovelluksen lähettämät sähköpostiviestit menevät tällä hetkellä `mailDev`:in kautta osoitteeseen `localhost:1080`.
Lisää ohjeita täällä: https://maildev.github.io/maildev/
