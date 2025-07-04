# Firas' Booksters MPW Project

Questo documento introduce il progetto e spiega come testarne le funzionalità principali.  
Il sito è realizzato con Node.js, Express e SQLite.

## Database `booksters.db`

Il database contiene già dati preinseriti per facilitare i test.  
Le tabelle sono:  
- `users`  
- `books`  
- `booksOfTheMonth`  
- `user_books`  
- `reviews`  
- `sessions`

## Utenti di prova e credenziali

| Ruolo        | Username | Password  | Permessi principali                              |
|--------------|----------|-----------|-------------------------------------------------|
| Admin        | admin    | admin789  | Gestione libri del mese (aggiungi, cancella)    |
| Utente | firas    | firas789  | Cerca libri, aggiungi libri alla libreria, scrivi recensioni |
| Utente | marco    | marco789  | Come sopra                                       |
| Utente | anna     | anna789   | Come sopra                                       |

## Come avviare l’applicazione

1. Clona il repository
```
git clone https://github.com/Firasdiciassette/Booksters.git
```
2. Installa le dipendenze con:  
 ```bash
 npm install
 ```
3. Verifica che il file booksters.db sia nella cartella corretta (root o come indicato nel codice)
4. Avvia il server con:
```
npm start
```
5. Apri il browser e visita:
`http://localhost:3000`
## Come testare le funzionalità
- Effettua il login con uno degli utenti di prova (es. admin/admin789)
- Usa la barra di ricerca in homepage per cercare libri (premi Invio per avviare la ricerca)
- Clicca sulle copertine per vedere i dettagli del libro
- Come admin, prova ad aggiungere (tramite la Admin Dashbord) o rimuovere libri del mese (agendo sull'apposito pulsante)
- Come utente, aggiungi libri alla libreria personale, scrivi recensioni e lascia un voto 
