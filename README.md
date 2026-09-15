# Gloseøving

En lett nettside i HTML, CSS og JavaScript, uten eksterne avhengigheter, kontoer eller byggeprosess. Logoen er videreført fra originalen.

## Pedagogisk kjerne

- Eleven limer inn glosene fra Classroom som `tysk ord - norsk ord`, én per linje.
- Glosene kommer i samme rekkefølge som i lista, med norsk spørsmål og tysk svar.
- Én feil stopper runden og viser **hele** lista: tidligere riktige med grønn hake, feilen med rødt kryss, resten ubesvart.
- Eleven kan studere lista før «Start på nytt» begynner fra første glose. Ingen hopping, stokking eller repetisjon av bare feil.
- Målet er alle glosene riktig på rad. Et tomt svar er ikke et innsendt svar og avslutter ikke runden.

## Svarregler og innliming

Artiklene `der`, `die`, `das` må være riktige. Artikkelens forbokstav kan være stor eller liten; resten av substantivuttrykket må samsvare med fasiten og begynne med stor bokstav. Andre ord sammenlignes uten hensyn til store/små bokstaver. Tyske spesialtegn er betydningsfulle. Ekstra mellomrom og forskjeller i Unicode-sammensetning ignoreres.

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
