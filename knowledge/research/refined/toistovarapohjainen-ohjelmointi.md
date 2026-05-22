# Toistovarapohjainen ohjelmointi (RIR) — Tiivistetty

**Lähde:** [raw/toistovarapohjainen-ohjelmointi.md](../raw/toistovarapohjainen-ohjelmointi.md)

## Keskeiset periaatteet

1. **RIR (Repetitions in Reserve)** = kuinka monta toistoa jää "varastoon" sarjan lopussa. Arviointitarkkuus ryhmätasolla hyvä (aliarviointi ~1 toisto). Tarkkuus paranee harjoittelulla.
2. **Uupumukseen asti harjoittelu ei ole välttämätöntä** — meta-analyysit eivät osoita selvää etua voimalle tai lihaskoolle verrattuna maltillisempaan toistovaraan.
3. **Väsymyksen hallinta on avain** — jatkuva uupumukseen harjoittelu kumuloi väsymystä ja voi heikentää kokonaiskehitystä.
4. **Intensiteetti vaikuttaa optimaaliseen toistovaraan** — kevyillä kuormilla lähemmäs uupumusta, raskailla suurempi vara.
5. **Vahvemmat yksilöt** hyötyvät suuremmasta toistovarasta (suuremmat absoluuttiset kuormat → enemmän väsymystä).

## Käytännön ohjelmointi

### Voima (ensisijainen tavoite)
- Pääosa harjoittelusta **RIR 2–4**
- Kuorman progressio toistovaraa tärkeämpi tekijä
- Sarjojen pilkkominen lyhyempiin osiin voi olla edullista (suurempi kokonaisvoimantuotto)
- Uupumukseen asti harjoittelu ei erityisen haitallista, mutta ei tuota lisäetua

### Lihaskasvu (ensisijainen tavoite)
- Pääosa harjoittelusta **RIR 0–3**
- Turvallisissa eristävissä liikkeissä ajoittain RIR 0 (uupumukseen)
- Haastavissa moninivelliikkeissä RIR 2–4
- Uupumukseen harjoittelu harjoituksen **loppupuolelle** sijoitettuna
- Kevyillä kuormilla (>12 toistoa) lähemmäs uupumusta → arviointitarkkuus heikentyy pitkissä sarjoissa

### Toistovaran aaltoiluttaminen
- Toimiva strategia: RIR laskee viikon/mesosyklin edetessä (esim. RIR 4 → RIR 1)
- Tutkimusnäyttö: yhtä tehokasta kuin vakio-RIR, mutta koetaan helpompana
- Mahdollistaa suuremman kokonaisvolyymin ja paremman sitoutumisen

### Autoregulaatio käytännössä
- Määritä sarjakohtainen tavoite-RIR
- Mukauuta kuormaa sarjojen välillä toteutuneen RIR:n perusteella
- Toistoalue + RIR-tavoite yhdessä (esim. 8–12 toistoa @ RIR 2)

## Ohjelmoinnissa huomioitavaa

| Tilanne | Suositus |
|---------|----------|
| Voima ei kehity, harjoittelu aina uupumukseen | Kasvata toistovaraa (RIR 2–4) |
| Lihaskasvu ei tyydytä, harjoittelu kaukana uupumuksesta | Pienennä toistovaraa (RIR 0–2) |
| Vahva/kokenut harjoittelija | Keskimäärin suurempi toistovara |
| Kevyet kuormat (>12 toistoa) | Lähemmäs uupumusta |
| Raskaat kuormat (<6 toistoa) | Suurempi toistovara |
| Monivelliike (kyykky, maastaveto) | RIR 2–4, ei rutiinisti uupumukseen |
| Eristävä liike (ojentajat, hauis) | RIR 0–2, ajoittain uupumukseen ok |
