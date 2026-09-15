# Gloseøving

En lett nettside i HTML, CSS og JavaScript, uten eksterne avhengigheter, kontoer eller byggeprosess. Logoen er videreført fra originalen.

## Versjonering

- **1.x:** Den opprinnelige utgaven fra før Git, brukt som innbygging i Google Sites.
- **2.0:** Den nye utgaven i dette repositoryet. Første utgivelse markeres med Git-taggen `v2.0`; tidligere commits her er utviklingen fram mot 2.0.
- Gjeldende versjon står i sidefoten og i `package.json`. Sidefoten utelater siste ledd når det er null, slik at `2.0.0` vises som `Versjon 2.0`.

Ved kommende utgivelser oppdateres sidefoten og `package.json` sammen, og utgivelsescommiten får en tilsvarende Git-tag. Git-historikken trenger ikke skrives om for å velge versjonsnummer.

`AGENTS.md` beskriver arbeidsreglene, inkludert obligatorisk versjonsøkning og dokumentasjon for hvert ferdige endringssett. `changelog.txt` inneholder endringshistorikken med nyeste utgave øverst.

## Pedagogisk kjerne

- Eleven limer inn glosene fra Classroom som `tysk ord - norsk ord`, én per linje.
- Glosene kommer som standard i listas rekkefølge. Bryteren «Tilfeldig rekkefølge» stokker alle glosene før hvert forsøk. Spørsmålet er norsk og svaret tysk.
- Én feil stopper runden og viser **hele** lista: tidligere riktige med grønn hake, feilen med rødt kryss, resten ubesvart.
- Eleven kan studere hele lista i forsøksrekkefølge før «Start på nytt» begynner en full ny runde. I tilfeldig modus stokkes lista på nytt. Innlimt tekst endres aldri. Ingen hopping eller repetisjon av bare feil.
- Målet er alle glosene riktig på rad. Et tomt svar er ikke et innsendt svar og avslutter ikke runden.

## Svarregler og innliming

Alle svar må samsvare med fasitens store og små bokstaver, også artikler, enkeltord uten artikkel og uttrykk. `die Katze` godtas bare med samme bokstavbruk; `Die Katze` og `die katze` avvises. Tyske spesialtegn er betydningsfulle. Ekstra mellomrom og forskjeller i Unicode-sammensetning ignoreres fortsatt.

Bare bindestrek/tankestrek **med mellomrom på begge sider** brukes som skille. Komma og bindestreker inni ord bevares. Ugyldige eller tvetydige linjer må rettes før start; de droppes aldri stille. Fasit må være skrevet riktig av læreren. Alternative tyske svar tolkes ikke automatisk fra komma eller skråstrek.

## Lokal kjøring

Dobbeltklikk `index.html` for å åpne siden direkte i nettleseren. Alle de offentlige filene må ligge i samme mappe. Siden bruker vanlige skript med `defer`, slik at den også virker med `file://`.

Alternativt, med Node.js installert:

```sh
npm start
```

Åpne http://127.0.0.1:5173. Ingen `npm install` trengs.

```sh
npm test
```

Testene bruker Nodes innebygde testverktøy og dekker tolking, svarregler, tvungen omstart og fullføring.

## På egen server

Legg disse filene i en offentlig mappe som serveres over HTTPS:

```text
index.html
styles.css
app.js
gloser.js
lagring.js
gloseoving.svg
favicon.svg
```

Relative filstier gjør at siden også fungerer i en undermappe. Ingen Node-prosess, database eller serverkode er nødvendig i produksjon. Ikke publiser `.git`, tester eller utviklingsfiler. Sørg for at JavaScript serveres med riktig MIME-type og at HTML revalideres ved nye utgivelser.

## Lokal lagring

Innlimt tekst lagres automatisk i `localStorage` i den aktuelle nettleseren. Gloser og elevsvar sendes ikke til noen tjeneste. Tømming av feltet fjerner den lagrede lista. Nettlesere som blokkerer lagring kan fortsatt bruke øvingen. Ved direkte filåpning kan lagringen variere mellom nettlesere. HTTP/HTTPS anbefales for stabil lokal lagring. Fremdrift lagres ikke; en oppdatering går tilbake til gloselista.

## Filer

- `app.js`: visninger, skjemaer, fokus og tilbakemeldinger.
- `gloser.js`: rene funksjoner for tolking, svarregler og tilstander.
- `lagring.js`: feiltolerant nettleserlagring.
- `server.mjs`: lokal forhåndsvisning med bare nettstedets offentlige filer.

Utviklet av Daniel Herman Lillegård. Videreført som CC0 fra originalen.
