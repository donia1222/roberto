/* ══════════════════════════════════════════════════════════════
   DESIGN-PROBE — EIN/AUS
   ══════════════════════════════════════════════════════════════
   Hier steuerst du, ob neue Design-Proben angenommen werden.
   Datei aendern, hochladen, fertig. Sonst nichts anfassen.

     'offen'       Alles normal. Anfragen kommen rein.

     'warteliste'  Die Seite laeuft weiter, der Besucher darf sein
                   Design bauen und ansehen — nur der Absende-Knopf
                   wird durch einen Hinweis ersetzt. Nutze das, wenn
                   du gerade zu viele Anfragen hast.

     'zu'          Die Seite verschwindet aus dem Menue. Wer den Link
                   gespeichert hat, sieht eine hoefliche Notiz.
   ══════════════════════════════════════════════════════════════ */

var DESIGN_PROBE_STATUS = 'offen';
