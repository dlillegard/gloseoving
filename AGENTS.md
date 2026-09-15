# Arbeidsregler for Gloseøving

Disse instruksjonene gjelder hele prosjektet. Les dem før du endrer filer.

## Versjonsnummer og endringslogg

- Hver ferdig, sammenhengende endring skal få et nytt versjonsnummer og dokumenteres i `changelog.txt`. Dette gjelder også feilrettinger, design, dokumentasjon, tester og disse instruksjonene.
- Øk versjonen én gang per ferdig endringssett, ikke for hvert mellomsteg eller hver fil. Rene undersøkelser uten filendringer krever ingen versjonsøkning.
- Bruk `MAJOR.MINOR.PATCH` i `package.json`: PATCH for feilrettinger og mindre justeringer, inkludert dokumentasjon; MINOR for nye funksjoner; MAJOR for større, inkompatible endringer. Tilbakestill lavere ledd ved økning av et høyere ledd.
- Oppdater versjonen i `package.json` og sidefoten i `index.html` i samme endringssett. Sidefoten viser eksempelvis `Versjon 2.1` for `2.1.0`, og `Versjon 2.1.1` for en patchutgave.
- Versjonsnummeret skal stå mellom krediteringen av Daniel Herman Lillegård og «Fri å bruke».
- Legg den nyeste utgaven øverst i `changelog.txt`, med versjon, dato (ÅÅÅÅ-MM-DD), konkrete endringer og utført kontroll. Dokumenter alle endringer i endringssettet på norsk, også interne endringer. Ikke påstå at kontroller er utført når de ikke er det.
- Bevar tidligere logginnføringer. Rett faktiske feil ved behov, men ikke skriv om historikken for å skjule endringer.
- Oppdater annen dokumentasjon dersom endringen gjør den utdatert. Ikke før løpende versjonsnummer flere steder enn nødvendig.
- Commit kildeendringer, versjonsøkning og logg sammen etter kontroll. Marker den ferdige utgaven med en annotert Git-tag, for eksempel `v2.1` eller `v2.1.1`. Ikke flytt eksisterende utgivelsestagger eller skriv om Git-historikken. Ikke push eller publiser uten autorisasjon.
- Før Git tilhører den opprinnelige løsningen 1.x. Nyutviklingen i dette repositoryet startet med utgivelsen 2.0, tagget `v2.0`. Tidligere utviklingscommits her er del av arbeidet fram mot 2.0.

## Pedagogisk kjerne

- Eleven limer inn glosene fra Classroom som `tysk ord - norsk ord`, én per linje. Innlimt tekst må ikke endres av øvingen.
- Spørsmålet vises på norsk, og eleven skriver det tyske svaret.
- Alle svar er case sensitive: store og små bokstaver, inkludert artikler og uttrykk, må være som i fasiten. Ekstra mellomrom og Unicode-sammensetning kan normaliseres; spesialtegn må fortsatt være riktige.
- Standard er listas opprinnelige rekkefølge. Bryteren for tilfeldig rekkefølge stokker alle glosene før hvert forsøk.
- Én feil stopper runden og viser hele lista i forsøksrekkefølge. Riktige svar markeres med grønn hake, feilen med rødt kryss og resten som ubesvart. Elevsvaret og fasiten vises til sammenligning.
- Eleven får studere lista før en full ny runde starter. Ingen automatisk omstart, hopping over ord eller egen runde med bare feil. Et tomt svar forbruker ikke et forsøk.
- Fullføring krever at alle glosene i runden er riktige på rad.
- Bevar disse reglene med mindre brukeren uttrykkelig ber om å endre dem.

## Teknisk struktur og kontroll

- Behold vanlig HTML, CSS og JavaScript uten nødvendige eksterne avhengigheter eller byggeprosess.
- Siden skal fungere både på en webserver og ved direkte åpning av `index.html`. Nettleserskriptene lastes som vanlige `defer`-skript i avhengighetsrekkefølge; ikke innfør modulimport eller filhenting som bryter direkte filåpning.
- Hold svarregler og rundelogikk i `gloser.js`, visninger i `app.js` og lokal lagring i `lagring.js`.
- Gloser og elevsvar behandles lokalt. Bevar feiltolerant lagring og vis innlimt innhold som tekst, aldri som HTML.
- Bevar mobiltilpasning, tastaturbetjening, synlige feltetiketter og tilbakemeldinger som ikke avhenger av farge alene.
- Kjør `npm test` når logikk eller skriptlasting endres. Kontroller relevante grensesnittendringer i nettleseren når mulig. Dokumentasjonsendringer krever ikke nye tester.
- Kjør `git diff --check` og kontroller at versjonsnummer, endringslogg og tag stemmer. Oppgi eventuelle begrensninger ved kontrollen.
- Bruk `npm start` for lokal forhåndsvisning. Serveropplasting omfatter bare de offentlige filene som er listet i `README.md`, aldri `.git` eller utviklingsfiler.
