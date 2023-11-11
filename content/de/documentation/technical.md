---
title: Forschungsinfrastruktur
---

Das APIS-Modell basiert auf vier verschiedenen Entitäten (Personen, Orte, Institutionen,
Ereignisse), Beziehungen zwischen diesen Entitäten, Vokabularien für die Eingabe von Beziehungen und
Entitäten, Volltexten sowie Annotationen zu diesen Volltexten. Die Datensätze aus den Leopold- und
Access-Daten entsprechen strukturell diesen Entitäten. Es bestand also eine grundsätzliche
Kompatibilität der beiden Datenbankmodelle. In mehreren Iterationen wurden Änderungswünsche
gesammelt und der Code wurde weiter verbessert. Dank der ACDH-internen Backup-Strategie und der
Konzeption des APIS-Systems wurde produktives Arbeiten bereits in dieser Testphase möglich und die
Datenintegrität trotz Codeänderungen gewährleistet. Nachdem das Datenmodell für stabil erklärt
wurde, wurde ein Mapping des internen Datenmodells auf eine weiter verbreitete Ontologie (geplant:
CIDOC CRM oder eine Ableitung) erstellt. Sowohl die Abbildung auf eine weit verbreitete Ontologie
als auch die Archivierung des endgültigen Datensatzes in ARCHE, der auch mit SPARQL durchsucht
werden kann, garantieren die bestmögliche Wiederverwendbarkeit des Datensatzes. Dieser Rohdatensatz
ist für die wissenschaftliche Weiterverwendung von besonderem Interesse.

Das System bietet einen dezentralen Zugang zu den Daten über das Webinterface, eine genaue
Definition der Berechtigungen jedes Nutzers/jeder Nutzerin, die Integration bestehender
LOD-Ressourcen (wie GND, VIAF, wikidata und HistoGIS) und die einfache Wiederverwendung bestehender
Metadaten aus diesen Ressourcen. Alle Änderungen an den Daten wurden versioniert, sodass ein
früherer Zustand der Datenbank jederzeit wiederhergestellt werden kann. Für den programmatischen
Zugriff wurde eine dokumentierte REST-FUL API bereitgestellt. Damit ist eine Verknüpfung der Daten
auch in einer späteren Arbeitsphase möglich.

## Entität: Person

Die Entität „Person“ enthält zum einen Personen in direkter beruflicher Zugehörigkeit zu den
obersten Hofämtern am Wiener Hof, zum anderen reicht der Personenstand – vor allem für die Zeit von
Kaiser Leopold I. (1657–1705) – bis in die Organisationsstruktur des weitläufigen Verwaltungswesens,
Finanzwesens, Gesandtschaftswesens, Kriegswesens und des Kulturbereiches der Habsburgermonarchie
bzw. des Alten Reiches hinein. Es werden für jede Person – sofern bekannt – Funktion, familiärer
Kreis, Hofzugehörigkeit, Gehalt, Ämter, Wohnorte etc. ausgegeben. Durch die Dokumentation von
Funktionsinhabern beiderlei Geschlechts, verschiedener sozialer Schichten – vom Kammerweib bis zum
Obersthofmarschall, vom Kanzlist bis zum Hofkriegsratspräsidenten – wie auch unterschiedlicher
lokaler und (inter-)nationaler Herkunft wird das Verständnis des Wiener Hofes als „multifunktionaler
Konzentrationspunkt“ (Scheutz / Wührer 2007, 15f.) und der Beitrag des Wiener Hofes zur Integration
der werdenden Habsburgermonarchie verdeutlicht.

**➔ Weitere ausführliche Informationen finden sich in den _VieCPro-Leitfaden zur Benutzung_ im
VieCPro-Downloadbereich _Materialien_.**

## Entität: Institution und Hofstaat

Die Entität „Hofstaat“ listet 128 Hofstaate vom 17. bis zum Anfang des 19. Jahrhunderts. Neben dem
Haupthofstaat des Kaisers wird in VieCPro das Hofpersonal beginnend vom Hofstaat der Jungen
Herrschaft, der sog. Kinderstube für die jungen Erzherzöge und Erzherzoginnen, bis zu den Hofstaaten
der kaiserlichen Gemahlin, Geschwister und der Kaiserinwitwe erfasst. Bedingung ist, dass die
Inhaber:innen aller Teilhofstaate in verwandtschaftlichem Bezug zum Kaiser oder in einem
Eheverhältnis zu einem Familienmitglied stehen sowie in Wien residieren. Der Vollständigkeitsgrad
des dokumentierten Hofpersonal variiert je nach Erfassungsstand.

Jeder Hofstaat ist einer der sechs Kategorien – Kaiser, Kaiserin, Kaiserinwitwe, Erzherzog:in, Junge
Herrschaft oder Sonstiger Hofstaat – zugeordnet und ausgehend vom Haupthofstaat des Kaisers
hierarchisiert. Das jeweilige Hofstaatskürzel, das sich aus den Anfangsbuchstaben des/r Vornamens/n
ergibt, dient der Differenzierung der einzelnen Hofstaatsinhaber:innen und Identifizierung der ihnen
zugeordneten Institutionen. Diesem Kürzel wird bei einigen Familienmitgliedern ein Rangkürzel –
Kaiser, Kaiserin, Kaiserinwitwe, Erzherzog/in – beigefügt, wobei das Rangkürzel Erzherzog:in
(Ehzg./Ehzgin.) nur bei Thronfolger:innen explizit zur Unterscheidung der erzherzöglichen vom
kaiserlichen Hofstaat angefügt wird. **Eine Liste aller Akronyme findet sich im
VieCPro-Downloadbereich _Materialien_.**

VieCPro enthält **mehr als 700 Institutionen**, wovon circa ein Viertel Hofämter und Hofgruppen
zwischen dem 17. und beginnenden 19. Jahrhundert ausmachen. Der Rest sind Institutionen der
Reichsebene, der habsburgischen Länder, verschiedener Städte sowie der lokalen Ebene, vor allem
während der leopoldinischen Zeit.

Die Institutionen werden ausgehend von der prinzipiellen Unterscheidung der beiden Hauptkategorien
_Amt/Behörde/Verband_ (kurz Institution) und der zu einer besseren Datenstrukturierung vom
Projektteam eingeführter _Gruppe_ mehreren Unterkategorien zugeordnet. Diese reichen vom Bauwesen
über das Gesandtschaftswesen bis hin zum Versorgungswesen. Eine Mehrfachzuordnung einer Institution
oder einer Gruppe zu einer der zehn Unterkategorien ist möglich. **Eine Liste aller Kategorien
findet sich im VieCPro-Downloadbereich _Materialien_.**

Die in dieser Datenbank angelegte **Hierarchisierung von Institutionen und Hofstaaten** kann
aufgrund der Natur schematischer Darstellungen die Feinheiten institutioneller
Organisationsstrukturen allzu oft nur unzulänglich abbilden. Zuständigkeiten von und Abhängigkeiten
zwischen Ämtern oder Institutionen konnten auch zeitgenössisch nicht immer eindeutig und nachhaltig
geklärt werden.

**➔ Weitere ausführliche Informationen finden sich in den _VieCPro-Leitfaden zur Benutzung_ im
VieCPro-Downloadbereich _Materialien_.**

## Entität: Orte

VieCPro enthält 2493 Orte, deren Zahl durch die Datenneuerhebung weiterwachsen wird. Mehr als ein
Drittel dieser Orte sind Wohnadressen, die hauptsächlich die Leopold-Daten (Häuser- und Schildnamen)
sowie die Daten der Neuerhebung (Straßennamen/Vorstadtnamen + Konskriptionsnummern) betreffen und
ausschließlich in der Stadt Wien, ihren Vorstädten und Vororten liegen. Die restlichen zwei Drittel
verteilen sich auf unterschiedliche Ortstypen, die eine Hierarchisierung der Orte zueinander
ermöglichen, ausgehend von der größtmöglichen historischen politischen Entität (wie z. B. dem
Heiligen Römischen Reich) über darin integrierte Territorien bis hin zur Stadt Wien, einer einzelnen
Straße und einem darin befindlichen Haus.

Ein Teil der Wohnadressen aus den Leopold-Daten wurde unter Zuhilfenahme zeitgenössischer
Stadtpläne, des [WienGeschichteWiki](https://www.geschichtewiki.wien.gv.at/Wien_Geschichte_Wiki)
sowie des mehrbändigen Werkes von Paul Harrer-Lucienfeld, _Wien – seine Häuser, Menschen und Kultur_
(Manuskript), Wien 1951-1958, eindeutig identifiziert und georeferenziert. Städte und Orte wurden
zusätzlich über die geographische Ortsdatenbank [geonames.org](http://www.geonames.org/) mit Längen-
und Breitengraden versehen. Einzelne Orte, insbesondere Wohnhäuser aus der leopoldinischen Zeit,
wurden mit den entsprechenden Belegen zu den Einträgen im WienGeschichteWiki und Harrer-Lucienfeld
versehen.

Geburts- und Sterbeorte sowie Wirkungs- oder Tätigkeitsorte werden nicht in der Ortsentität selbst
ausgedrückt, sondern in der Relation, die Personen mit Orten verbindet. Darunter fallen Relationen
wie „ist geboren in“ ebenso wie ungenaue Angaben zur Wohnadresse, die zum Beispiel in der Relation
„wohnte neben“ oder „wohnte gegenüber von“ dargestellt werden.

## Entität: Ereignisse

coming soon

## Entität: Zahlungen

coming soon
