# Daten

## 1. Grundsätzliches zu den Daten

### Vollständigkeit und Aktualität der Personendaten

Das Ziel dieser Pilotphase war die **Überführung und Aufbereitung der Leopold- und
Access-Datensätze** in die APIS-Infrastruktur. Auf eine Aktualisierung der erfassten Daten um
Informationen aus der Sekundärliteratur musste weitestgehend aufgrund der zeitlichen Begrenzung des
Pilotprojektes auf 2,5 bzw. 3 Jahre verzichtet werden.

### Personenkreis der Datensätze

Prosopographie bedeutet, Personendaten über die systematische Auswertung von historischen Quellen zu
sammeln, um ein möglichst vollständiges Bild einer bestimmten Bevölkerungsgruppe zu bekommen.
Während der Leopold-Datensatz nahezu **das Gesamtpersonal des Wiener Hofes der Regierungszeit von
Kaiser Leopold I. (1657–1705)** erfasste, fokussiert sich der Access-Datensatz auf das
**Gesamtpersonal der Wiener Hofstaate zwischen 1711 und 1806**, die Datenneuaufnahme hingegen auf
den **Zeitraum von 1807 bis 1835**.

### Begrifflichkeiten _Wiener Hofstaat_ und _Wiener Hof_

Der Begriff des **„Wiener Hofstaats“** bezeichnet die Gesamtheit des Hofpersonals, das für die
persönliche Versorgung des Herrschers/der Herrscherin („Haupthofstaat“) oder eines seiner
Familienmitglieder („Teilhofstaat“) zuständig war. Hierzu werden alle weiblichen und männlichen
Funktionsträger gezählt, die zum einen unabhängig von ihrer Besoldung eine Funktion im Haushalt der
Herrscherfamilien innehatten. Diese Funktion musste zum anderen in der höfischen Ämterstruktur der
obersten Hofämter verortet werden können. Die Summe des Hofpersonals von Haupt- und Teilhofstaaten
der Kaiser, der Kaiserinnen, der Kaiserinwitwen, der Kaiserkinder und anderer Verwandter macht die
**Gesamtheit des Wiener Hofpersonals bzw. des Wiener Hofstaats** aus.

Der Begriff des **„Wiener Hofes“** ist im Hinblick auf seinen Aufgabenbereich und Personenkreis
weiter gefasst, da es außer der Gesamtheit des Hofpersonals (= Wiener Hofstaat) auch das
diplomatische, militärische und administrative Personal umfasst. Der **Wiener Hof bzw. die Wiener
Hofgesellschaft** kam den Bedürfnissen des fürstlichen Haushaltes nach (Versorgungsfunktion) und
hatte eine politisch administrative Aufgabe (Verwaltungs- und Regierungsfunktion) und eine
ökonomisch-kulturelle Rolle (Repräsentationsfunktion) zu erfüllen.

In VieCPro gründet sich ein **Bezug zum Wiener Hof** nicht nur in der Ausübung einer Hoffunktion,
sondern auch über verwandtschaftliche Beziehungen zu Funktionsträger:innen und/oder monetäre Bezüge
aus der Wiener Hofkammer.

### Vereinheitlichungen in den Datensätzen

Personennamen, Funktionsbezeichnungen und Institutionsbezeichnungen wurden unter Berücksichtigung
der zeitgenössisch jeweils vorherrschenden Variante bei gleichzeitiger Dokumentation alternativer
Schreibweisen vereinheitlicht (_➔ Funktionsregister_ [in Arbeit]).

### Deduplizierung und Merging

Der Leopold-Datensatz wurde im Wesentlichen aus drei verschiedenen Ressourcen – Hofzahlamtsbüchern,
Hofstaatsverzeichnissen und Trauungsmatriken / Totenbeschauprotokollen – generiert, in denen viele
Doubletten existieren. Im Prozess der Deduplizierung galt das **Vorsichtsprinzip**. Falls aufgrund
unzureichender Datenlage keine eindeutige Entscheidung zugunsten einer Zusammenführung getroffen
werden konnte, wurden Personen nicht gemergt. Stattdessen wurde zwischen beiden
Personendatenblättern **potenzielle VieCPro-Doubletten** ausgewiesen.

### Hierarchisierungen:

Die in dieser Datenbank angelegte Hierarchisierung kann aufgrund der Natur schematischer
Darstellungen allzu oft nur unzulänglich die Feinheiten des institutionellen und auch persönlichen
Miteinanders abbilden. Es ist auch ein Charakteristikum frühneuzeitlicher Organisationsstrukturen,
dass die Zuständigkeiten nicht immer eindeutig und nachhaltig geklärt waren.

### Manuelle LOD-Verlinkung

Aufgrund weitestgehenden Fehlens von Lebensdaten war ein automatisierter Abgleich der
VieCPro-Personendaten mit existierenden LOD-Ressourcen wie GND, Wikidata, Kaiser und Höfe (München)
nicht möglich. Stattdessen wurden bislang LOD-Referenzen zu 690 Personen in leitenden Funktionen
manuell recherchiert und in VieCPro angelegt. Im Zuge fortschreitender redaktioneller Arbeit werden
weitere LOD-Referenzen eingespeist.

### Gendern & Diskriminierung:

Für jede Funktionsbezeichnung – sofern es einen weiblichen und männlichen Funktionsträger gab –
werden geschlechtsspezifische Bezeichnungen verwendet. Heute negativ konnotierte
Funktionsbezeichnungen wie Zwerg, Hofjude, Kammermensch, Extraweib etc. sind in ihrem historischen
Verwendungskontext ohne modernes Äquivalent zu sehen.

## 2. Bearbeitungsstand

Folgende Tabelle gibt einen Überblick über Quellen, Personenkreis und Umfang wie auch den
Bearbeitungsstand zum jeweiligen Ende der beiden Pilotprojekte:

_coming soon_

## 3. Zur Provenienz unserer Daten

Basis von VieCPro (2020–2024) sind zwei bereits existierende Datensammlungen sowie zwei neue
Datensätze:

- die teilstrukturierten Daten zum Hof Leopolds I. aus dem FWF-Projekt _Die Wiener Hofgesellschaft
  unter Kaiser Leopold I. (1657–1705)_ unter Leitung von Leopold Auer und in der chronologischen
  Folge ihrer Beteiligung Sigrid Freisleben, Johannes Werfring, Ulrike Denk und Katharina Arnegger
  (2001–2005), sog. **Leopold-Daten**

- die strukturierten Daten zu den Hofstaaten Karls VI., Maria Theresias, Josephs II., Leopold II.
  und Franz II. (I.) aus dem FWF-Projekt
  [_Personal und Organisation des Wiener Hofes 1711–1806_](https://hofpersonal.univie.ac.at/de/startseite/)
  unter Leitung von Martin Scheutz und Mitarbeit von Irene Kubiska-Scharl und Michael Pölzl
  (2011–2016), sog. **Access-Daten**

- die manuelle Einspeisung des Hofpersonals unter Franz II. (I.) für die Jahre zwischen 1807 und
  1835 im Rahmen des FWF-Projektes
  [_Der Wiener Hof um 1800: Eliten, Herrschaft und Repräsentation (1790–1835)_](https://www.oeaw.ac.at/ihb/forschungsbereiche/geschichte-der-habsburgermonarchie/forschung/wiener-hof-um-1800)
  unter Leitung von Katrin Keller und unter Mitarbeit von Christian Standhartinger und Markus
  Jeitler (2020–2023), sog. **Datenneuaufnahme**

- das VieCPro-Team hat begonnen, den „geerbten“ Literatur- und Quellenbestand im Zuge der
  Datenkuratierung durch die Verwendung aktueller Literatur zu erweitern. Hierbei kann allerdings
  kein Anspruch auf Vollständigkeit erhoben werden. Ausgehend vom Recherche-gegenstand wurde auf
  Werke der Sekundärliteratur , Nachschlagewerke oder auch genealogische Datenbanken
  zurückgegriffen, um Einträge zu Personen, Institutionen oder Orten zu ergänzen. Sog.
  **redaktionelle Ergänzungen von Personen, Institutionen, Orten**

## 4. Gesamtüberblick zu den drei Datensammlungen

### Datensatz 1: Der Wiener Hof unter Kaiser Leopold I. (1657–1705), sog. Leopold-Daten

Das Team unter Leitung von Leopold Auer hat die Daten zum Wiener Hof in der Zeit von Kaiser Leopold
I. im Wesentlichen aus den Hofstaatsverzeichnissen (HSV), den Hofzahlamtsbüchern (HZAB), den
Instruktionen und den Trauungsmatriken und Totenbeschauprotokollen (TM-TBP) des Österreichischen
Staatsarchivs (ÖStA), des Wiener Stadt- und Landesarchivs, der Archive der Pfarreien St. Stephan und
St. Michael, des Sächsischen Hauptstaatsarchivs und der Landesbibliothek Coburg gesammelt.

Der erfasste Personenkreis des Leopold-Datensatzes umfasst zwei Gruppen mit unterschiedlichen Graden
der Vollständigkeit:

**Gruppe 1: Wiener Hofpersonal** – Personen, die in ihrer Funktion direkt den obersten Hofämtern des
Wiener Hofes zugehörig sind. Neben dem Haupthofstaat von Kaiser Leopold I. sind die Teilhofstaate
seiner drei Ehefrauen und ihrer Kinder, der Kaiserinwitwe Eleonora Gonzaga-Nevers wie auch ihrer
(Stief-)Kinder und seines Onkels Leopold Wilhelm erfasst.

**Gruppe 2: Wiener Hofgesellschaft** – Der Personenstand greift in die Organisationsstruktur des
weitläufigen Verwaltungswesens, Finanzwesens, Gesandtschaftswesens, Kriegswesens und des
Kulturbereiches der Habsburgermonarchie und des Alten Reiches. So werden selektiv
Funktionsträger:innen auf Ebene der Zentralbehörden des Reiches und der Habsburgermonarchie, der
ständischen Landesverwaltung der Habsburgermonarchie, der städtischen Verwaltungsbehörden und
primären Institutionen zur Armen-, Alten- und Krankenversorgung, der frühneuzeitlichen Spitäler und
Zuchthäuser und frühneuzeitlichen Universitäten erfasst.

Der Leopold-Datensatz umfasst **48.000 Zeilen teilstrukturierter Personendaten zu Funktionsträgern
beiderlei Geschlechts, verschiedener sozialer Schichten** – vom Kammerweib bis zum
Obersthofmarschall, vom Kanzlist bis zum Hofkriegsratspräsidenten – wie auch **unterschiedlicher
lokaler und (inter-)nationaler Herkunft**. Es wurden für jede Person – sofern bekannt – Funktion,
Verwandtschaftsverhältnisse und soziales Netzwerk, Hofzugehörigkeit, Zahlungen, Ämter, Wohnorte etc.
dokumentiert.

Während **Gruppe 1** als **nahezu vollständig** betrachtet werden kann, liegen die
Funktionsträger\*innen der **Gruppe 2 selektiver** vor.

Nach Abschluss des Projektes 2005 wurden die dokumentierten Daten in **drei Excel-Blättern zum
jeweiligen Quellenbestand (HZAB, HSV und TM-TBP)** sowie einem Excel-Blatt mit einem Überblick zum
Personal der Hofkammer auf der Website des Österreichischen Staatsarchivs zum Herunterladen zur
Verfügung gestellt (_➔ Materialien_).

Die **Herausforderungen** an das VieCPro-Team bei Überführung und Aufbereitung des Datensatzes in
die APIS-Datenbank und die **Bewältigungsstrategie** waren im Wesentlichen:

- _Große Menge an teilstrukturierten Datensätze (HZAB, HSV, TM-TBP) und Doubletten_ ➔ Fokus auf die
  ersten beiden Datenblätter und Entwicklung eines Tools zur Deduplizierung und Mergen der
  Personendatensätze [Import TM-TBP in Arbeit].

- _Uneinheitliche Schreibweisen und Leseschwierigkeiten durch fehlende Dokumentation des
  ursprünglichen Leopold-Projektes_ ➔ Syntaktische Analyse der Originaldatenblätter vor dem Import,
  anschließende manuelle kontinuierliche Nachbearbeitung des Imports wie auch stichprobenartige
  Überprüfung ausgewerteter Quellen

- _Komplexität der Informationen (Hof- u. Verwaltungsstruktur, Funktions- und
  Institutionsbezeichnungen, etc.)_ ➔ systematische Vereinheitlichung von 2.577
  Funktionsbezeichnungen auf 2.203 und 928 Institutionen auf 863; Kategorisierung und
  organisationsgeschichtliche Hierarchisierung der letztgenannten Entitäten und 229 Hofstaate. Dies
  ging einher mit einer extensiven Recherche zu Funktionsdefinitionen wie auch zur
  Organisationsgeschichte von Hof und Verwaltung der Habsburgermonarchie.

- _Kommentierung der erfassten Daten (Relativierung von Zeitangaben, Zusätze aus den Quellen wie
  Todesursachen, Zahlungsgrund)_ ➔ Implementierung eines ausgeklügelten Abkürzungssystems zur
  Unterscheidung von sicheren und unsicheren Zeitangaben [in Arbeit].

- _Kompilierte Daten zu einer Person aus verschiedenen Quellen in einer Zelle. Mit Ausnahme des
  HZAB-Blattes ist eine 1:1 Rückführung der Informationen zu einer Quelle nicht mehr möglich_ ➔
  Ausgabe eines zusammengefassten Quellenzitates mit Ausnahme des HZAB. Hier Rückführung des
  Quellenzitats in das Kategorie-Schema des HZAB über die Seitenzahl [in Arbeit].

- _Unvollständige oder widersprechende Daten wie fehlende Hofstaatszugehörigkeiten,
  Funktionszeiträume_ ➔ Hermeneutisches Zusammenlesen vorhandenen Informationen im Zuge des
  Mergings, selektive weiterführende Recherchen und Kenntlichmachen von Lücken für die
  Benutzer\*innen [in Arbeit].

### Datensatz 2: Der Wiener Hof im 18. Jahrhundert, sog. Access-Daten

Der zweite Datensatz umfasst die **Daten von 6.188 Hofangehörigen**, die von Irene Kubiska-Scharl
und Michael Pölzl im Rahmen des von Martin Scheutz geleiteten Projektes in einer relationalen
Datenbank (MS Access) strukturiert erfasst wurden. Bislang wurden die Daten zum Hofpersonal zwischen
1711 und 1792 in zwei Bänden 2013 und 2018 publiziert:

- Kubiska-Scharl, Irene, Pölzl, Michael: _Die Karrieren des Wiener Hofpersonals 1711 – 1765. Eine
  Darstellung anhand der Hofkalender und Hofparteienprotokolle_, Innsbruck–Wien–Bozen 2013
  (Forschungen und Beiträge zur Wiener Stadtgeschichte, 58)
- Kubiska-Scharl, Irene, Pölzl, Michael: _Das Ringen um Reformen. Der Wiener Hof und sein Personal
  im Wandel (1766–1792)_, Innsbruck-Wien-Bozen 2018 (Mitteilungen des Österreichischen
  Staatsarchivs, 60).

Als **Quellenbasis** dienten im Wesentlichen **die kaiserlichen Hof- und Ehrenkalender und
Schematismen** und für die Überlieferungslücken der Jahre 1711 bis 1714 und 1741 bis 1744 die
**Hofparteienprotokolle** und Akten der Hofstaatsverwaltung im Wiener Haus-, Hof- und Staatsarchiv.
Die Natur der Quellenbasis ergab, dass der erfasste Personenkreis weitaus kleiner als der des
Leopold-Projektes ist. **Der Fokus lag überwiegend auf dem Wiener Hofstaat.**

Des Weiteren werden zum einen etwa ein **Drittel der „Funktionsträger, vor allem der unteren Ränge,
[…] im Hofkalender nicht namentlich, sondern nur summarisch erwähnt“** (Kubiska-Scharl/Pölzl 2013,
297). Dies führt dazu, dass in VieCPro für den Zeitraum 1711-1806 die niedere Ebene des Hofpersonals
weniger gut dokumentiert ist. Zum anderen sind kaum Angaben zu Gehalt oder
Verwandtschaftsbeziehungen enthalten. Die Personenangaben umfassen Vor- und Nachnamen, Ehrentitel,
militärische Ränge, Informationen zum Personenstand ebenso wie Angaben zu Standeserhebungen,
Tätigkeitsorte, ausgeübte Funktionen, Hofstaatzugehörigkeiten und Beschäftigungsdauern.

Die **Herausforderungen** an das VieCPro-Team bei Überführung und Aufbereitung des Datensatzes in
die APIS-Datenbank und die **Bewältigungsstrategie** waren im Wesentlichen:

- _Große Menge an Funktionsschreibweisen, die von den Leopold-Daten abwichen._ ➔ Anpassung der
  Funktionsschreibweisen an die für die Leopold-Daten bereits etablierten Bezeichnungen im Zuge des
  Imports.
-
- _Sämtliche Institutionen (mit Ausnahme der Obersten Hofämter) waren keine eigenen Entitäten,
  sondern Teil der Funktionsbezeichnung (Erster Amtsschreiber im Hofbauamt)._ ➔ Auslesung der in den
  Funktionsbezeichnungen vorkommenden Institutionen und Import derselben als Entitäten.

- _Abweichende Bezeichnungen für Oberste Hofämter (in Access „Stäbe“) und geringer Grad an
  Differenzierung._ ➔ Anpassung an die bereits etablierten Bezeichnungen, Hierarchisierung der
  Hofstaaten und Institutionen, Kategorisierung der Hofstaaten in regierende Fürsten, Erzherzöge und
  Erzherzoginnen, Junge Herrschaften etc.

- _Heterogenität von unstrukturierten Zusatzinformationen in den Bemerkungsfeldern der
  Personenblätter._ ➔ Strukturierte Auswertung von Informationen aus den Bemerkungsfeldern
  (Lebensdaten, Funktionen, Funktionszusätze, Aufenthaltsorte) teilweise schon beim Import, manuelle
  Nachstrukturierung im Zuge mehrerer Korrekturläufe.

- _Auch der Import von strukturierten Daten ist fehleranfällig._ ➔ Vorwegnahme von ,geplanten‘
  Fehlern für den Import und manuelle Korrektur durch dasVieCPro-Team.

### Datensatz 3: Der Hof von Franz II./I., sog. Datenneuaufnahme

Der dritte Datensatz wird in einem Teilprojekt des FWF-Projektes
[_Der Wiener Hof um 1800: Eliten, Herrschaft und Repräsentation (1790–1835)_](https://www.oeaw.ac.at/ihb/forschungsbereiche/geschichte-der-habsburgermonarchie/forschung/wiener-hof-um-1800)
unter Leitung von Katrin Keller durch Christian Standhartinger erhoben. Der Fokus liegt auf der
**Vervollständigung von unpublizierten Datensätzen des Scheutz-Projektes zum Hofstaat von Franz II.
sowie deren Erweiterung bis zum Jahr 1835.**

Als **Quellenbasis** dienen hierbei vorwiegend die **Hof- und Staatsschematismen
(Staatshandbücher)** der Jahre 1807 bis 1835. Die kriegsbedingten Überlieferungslücken der Jahre
1809, 1810 und 1815 werden hierbei nicht durch die Auswertung zusätzlicher Quellen geschlossen.
Einzelne Personendatenblätter, insbesondere die Träger hoher Hoffunktionen, werden hingegen durch
biographische Lexika und einschlägige Werke der Sekundärliteratur erweitert.

Erfasst werden **sämtliche Personen, die in den Hofschematismen einem der kaiserlichen Obersten
Hofämter oder dem Hofstaat eines anderen Familienmitglieds, sofern sich dieses dauerhaft in Wien
aufhielt,** zugeteilt waren. Zusätzlich wird auch die **Erfassung sämtlicher Geheimer Räte,
Kämmerer, Palastdamen sowie der Träger und Trägerinnen der in den Hofschematismen aufgelisteten
Orden** angestrebt. Sämtliche Zusatzinformationen, die in den Hofschematismen neben der eigentlichen
Hoffunktion angegeben sind, werden strukturiert mitaufgenommen. Dazu zählen Ordensverleihungen,
nicht-höfische Ämter und Würden, militärische Ränge sowie Wohnadressen.

Die **Herausforderungen** an das VieCPro-Team bei Überführung und Aufbereitung des Datensatzes in
die APIS-Datenbank und die **Bewältigungsstrategie** waren im Wesentlichen:

- _Wechselnde Ämterhierarchie und Zuordnung von Funktionen zu bestimmten Ämtern in den
  Schematismen._ ➔ Durchsicht mehrerer aufeinander folgender Schematismen, um Entscheidungen
  bezüglich Ämterhierarchie und Funktionszuordnungen zu treffen.

- _Überlieferungslücken in den Jahren 1809, 1810, 1815._ ➔ Relativierende Zusätze bei Laufzeiten von
  Funktionen, die vor diesen Jahren zum letzten Mal oder nach diesen Jahren zum ersten Mal erwähnt
  werden.

- _Große Zahl von summarischen Personalauflistungen ohne Möglichkeit zur Identifizierung._ ➔
  Einspeisung und Sammlung des summarischen Personals in eigens dafür angelegten,
  hofstaatsspezifischen Personenblättern.

- _Uneinheitliche Angabe von Wohnadressen (Vorstadt + Konskriptionsnummer, Straßenname +
  Konskritpionsnummer)._ ➔ Identifizierung der Straßen und Deduplizierung der Wohnadressen anhand
  der zeitgenössischen Häuserschematismen.

- _Funktionsbezeichnungen, die von den bereits etablierten Bezeichnungen abweichen, aber synonym
  sind._ ➔ Laufende Mitschrift synonymer Bezeichnungen, die später in das Funktionsregister
  eingespeist werden.

- _Unsicherheiten bei der Identifizierung von Personen, die gängige Namen tragen, Gefahr der
  Duplizierung von Personen._ ➔ Anlegen von Relationen zwischen Personen, die möglicherweise
  Doubletten sind.

## 5. VieCPro-Workflow (09/2020 – 06/2024)

### Projektjahr (09/20 – 09/21)

- Analyse der Leopold- und Access-Datensätze hinsichtlich ihrer Zusammensetzung, ihres Aufbaus, wie
  auch ihres Inhalts und Vorbereitung für den Import
- Import der Datensätze mit besonderem Fokus auf die Informationen zum beruflichen Werdegang der
  Personen (Person-Institution-Relationen)
- Erste manuelle Nachkorrektur der importierten Datensätze aufgrund von Importfehlern durch
  uneinheitliche Schreibweisen, der z. T. unvollständigen Erfassung der in dem Leopold-Datensatz
  zusammengestellten Daten und Lese-/Interpretationsschwierigkeiten durch unvollständige
  Dokumentation der Erfassungsrichtlinien des Leopold-Projektes

### Projektjahr (10/21–09/22)

- Vereinheitlichung und Systematisierung von Funktionsbezeichnungen (Reduzierung von 2.577 auf
  2.203) und Institutionsbezeichnungen (von 928 auf 863).
- Kategorisierung der Funktionsbezeichnungen und Institutionen sowie deren
  organisationsgeschichtliche Hierarchisierung, weitestgehend basierend auf den Angaben der
  „Verwaltungsgeschichte der Habsburgermonarchie in der Frühen Neuzeit. 2 Bände, hg. von Michael
  Hochedlinger, Petr Mat'a, Thomas Winkelbauer (MIÖG, Ergänzungsband 62), Wien 2019.
- Entwicklung des Eingabetools für die Datenneuaufnahme
- Beginn der Datenneuaufnahme
- Extraktion und Aufbereitung weiterer Personendaten wie Wohnorte, Quellenzitate,
  Verwandtschaftsverhältnisse etc. aus den Datensätzen und Import derselben in die APIS-Entitäten
  Places, Persons, Works, Labels.

### Projektjahr (10/22 – 03/23)

- Entwicklung eines Tools zur Deduplizierung und zum Merging für die Leopold-Daten
- Deduplizierung von 23.129 Personen der Leopold-Daten auf 10.856 Personen
- Entwicklung des Frontends (Mockups, etc.)
- Verlinkung eines Personensamples mit LOD-Ressourcen wie GND, GeoNames, Wikidata, Kaiser & Höfe
  (München)
- Erstellung des VieCPro-Leitfadens zur Benutzung
- Fortsetzung der Datenneuaufnahme
- Beginn der zweiten und finalen manuellen Nachkorrektur der Leopold-Daten und Access-Daten

03/2023 Ende des ÖAW-Innovationsfonds-Projektes _The Viennese Court. A Prosopographical Portal
(VieCPro)_, Leitung: Marion Romberg

### Projektjahr (04/23 – 06/24)

- Entwicklung eines Tools zur Erfassung der im HZAB-Blatt dokumentierten Hofzahlungen
- Implementierung des Funktionsregisters
- Entwicklung von Visualisierung (Hierarchisierung, Netzwerk, Karten)
- Import des TM-TBP-Blatts des Leopold-Datensatzes (inkl. manuelle Korrektur)
- Fortsetzung der zweiten und finalen manuellen Nachkorrektur der Leopolddaten
- Fortsetzung der Datenneuaufnahme

06/2024 Ende des FWF-Projektes
[_Der Wiener Hof um 1800: Eliten, Herrschaft und Repräsentation (1790–1835)_](https://www.oeaw.ac.at/ihb/forschungsbereiche/geschichte-der-habsburgermonarchie/forschung/wiener-hof-um-1800}),
Leitung: Katrin Keller
