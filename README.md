## Projekt „Tweety“
9568510 8393497 1874704

# Anforderungen

Folgende Anforderungen werden benötigt, um das Projekt nutzen zu können:

- Node.js v12 or higher
- Redis Server
- Angular CLI (optional, but recommended) npm i -g @angular/cli

# Setup / Projektstart

Server:

Zur Installation des Servers navigieren Sie zum Verzeichnis /server und starten den Befehl "npm install".

Um den Server zu starten: "npm start".

Der Server ist nun erreichbar unter: http://localhost:3000/


Client

Zur Installation des Clients navigieren Sie zum Verzeichnis /client und starten den Befehl "npm install".

Um den Client zu starten: "npm start" (ohne Angular CLI) oder "ng serve" (mit Angular CLI).

Die Client Web-App ist nun erreichbar unter: http://localhost:4200.

# Grundfunktionen:
-	Kommunikation zwischen verschieden Nutzern mittels Posts
-	Live-Anzeige der Post für alle angemeldeten Nutzer
# Zusatzfunktionen:
-	Allgemeiner Feed: Alle Posts aller Nutzer werden anzeigt
-	Persönlicher Feed: Alle Posts der Nutzer, denen man selbst folgt, werden angezeigt
-	Eigener Feed: Nur die eigenen Posts werden angezeigt
-	Login und Registrierung mit Passwort
-	Anzeige eines Profils mit Username und Bild (zukünftig frei wählbar)
-	Anzeige der Anzahl der Abonnenten und Abonnierten
-	Like und Dislike von Posts
-	Abonnieren neuer User
