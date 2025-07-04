# Firas' Booksters MPW Project

Questo documento ha come scopo quello di introdurre il progetto, spiegare le sue features precedentemente comunicate al docente e testare le sue funzionalità di base.
Il sito è stato realizzato come progetto per il corso MPW e utilizza Node.js, Express e SQLite.

## Booksters.db
Il database del progetto è il file `booksters.db` contiene le seguenti tabelle.
- users
- books
- booksOfTheMonth
- user_books
- reviews
- sessions

Tutte le tabelle contengono già alcune entry preinserite al fine di testare le funzionalità.

### Users
Di seguito gli utenti già registrati sulla piattaforma e i loro credenziali e una breve descrizione dei loro privilegi.
* **L'amministratore** è l'unico che può aggiungere libri del mese alla home page e cancellarli.
* L'altro ruolo è lo **user**. Esso può aggiungere libri, che sono visualizzati sulla propria libreria privata, cercare libri usando la barra di ricerca (premendo invio per farlo), cliccare sulla foto della copertina di un libro per accedere ad una pagina riservata al libro e scrivere una recensione.

### Admin
Per loggarsi come admin:
- Username: admin
- Password: admin789
### User
La tabella `users` contiene alcuni utenti:

L'utente **firas**:
- Username: firas
- Password: firas789

L'utente **marco**:
- Username: marco
- Password: marco789

L'utente **anna**:
- Username: anna
- Password: anna789
