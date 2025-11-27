# Christmas Gift Web App 🎁

Ein liebevolles Weihnachtsgeschenk: Eine tägliche Web-App mit Bildern, Nachrichten und optionalen Mini-Games.

## Projekt-Übersicht

Diese App zeigt täglich:
- Ein Foto von euch beiden
- Eine liebevolle Nachricht/Kompliment/Insider
- Einen Streak-Zähler (ohne Druck!)
- Alle paar Tage: Ein optionales Mini-Game

## Entwicklung

```bash
# Dependencies installieren
npm install

# Dev-Server starten
npm run dev

# Production Build
npm run build
```

## Inhalt anpassen

Die Bilder und Texte findest du in:
- **Bilder**: `public/photos/` - Füge deine Fotos hinzu (z.B. `photo1.jpg`, `photo2.jpg`)
- **Nachrichten**: `src/data/content.js` - Editiere das `messages` Array

### Beispiel: Neue Nachricht hinzufügen

```javascript
export const messages = [
  { id: 1, text: 'Du bist das Schönste in meinem Leben ❤️' },
  { id: 2, text: 'Dein Lächeln macht jeden Tag perfekt ✨' },
  // Füge hier deine eigenen Nachrichten hinzu:
  { id: 6, text: 'Deine neue süße Nachricht 💕' },
];
```

## Deployment

Das Projekt ist auf Vercel gehostet und deployt automatisch bei jedem Git Push.

Siehe `DEPLOYMENT.md` für Details.

## Technologie

- **Framework**: Vite + React
- **Styling**: Tailwind CSS
- **Persistenz**: LocalStorage
- **Hosting**: Vercel
