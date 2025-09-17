# Bridge's react
Dinamikus Űrlap Alkalmazás

Modern, mobilbarát React alkalmazás, amely API-ból dinamikusan generál űrlapokat.

# Funkciók
- Dinamikus űrlapgenerálás API alapján
- Mobilbarát, reszponzív design
- Valós idejű progress bar
- Azonnali validáció és vizuális feedback
- Loading állapotok és error handling

# Stack
- React 18 + Hooks
- Tailwind CSS
- Lucide React icons
- Vite

# Telepítés
```bash
npm install
npm run dev
```

# Fájlok
- `App.jsx` - Fő alkalmazás logika
- `FormField.jsx` - Dinamikus form mezők
- `Alert.jsx` - Hiba/siker üzenetek  
- `Spinner.jsx` - Loading indikátor

# Validáció
- Minden mező kötelező
- Integer: pozitív egész számok
- Text: minimum 2 karakter
- Choice: egy opció kiválasztása kötelező
