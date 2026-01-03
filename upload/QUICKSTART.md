# 🚀 Voidverse RPG - Quick Reference

## Getting Started

### First Time Setup
```bash
# Windows
start.bat

# Linux/Mac
chmod +x start.sh
./start.sh
```

### Manual Setup
```bash
# Backend
cd backend
npm install
npm start          # Runs on :3001

# Frontend (new terminal)
cd frontend
npm install
npm run dev        # Runs on :3000
```

## Project Commands

### Backend
```bash
npm start          # Start server
npm run dev        # Start with auto-reload (if configured)
node engine/fusionEngine.test.js  # Test fusion
```

### Frontend
```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

## File Quick Reference

### Backend Core Files
```
server.js                    # Main server
routes/play.js               # Game logic endpoint
engine/fusionEngine.js       # Ability fusion
engine/stateValidator.js     # State validation
engine/stateMerge.js         # State updates
```

### Frontend Core Files
```
App.jsx                      # Main app
api.js                       # Backend communication
components/StoryPanel.jsx    # Story display
components/Choices.jsx       # Action buttons
components/SystemState.jsx   # Character sheet
styles.css                   # Dark theme
```

## State Structure

```javascript
{
  character: { name, level, experience },
  abilities: {
    cores: [{ name, essence, mutations, tier }],
    aspects: [{ name, power }]
  },
  stats: { dominance, control, awareness }
}
```

## API Endpoint

**POST** `http://localhost:3001/play`

Request:
```json
{
  "sessionId": "uuid-optional",
  "choice": "Action name",
  "state": { /* full game state */ }
}
```

Response:
```json
{
  "sessionId": "uuid",
  "story": "Story text",
  "systemState": { /* updated state */ },
  "choices": ["Choice 1", "Choice 2"],
  "fusionOccurred": boolean
}
```

## Fusion Rules

- **Auto-fusion**: Triggers at 4+ aspects
- **Consumes**: First 3 aspects
- **Generates**: Essence for primary core
- **Mutation chance**: 15% base + 5% per existing mutation
- **Essence formula**: `floor(totalPower * 1.5)`

## Testing Fusion

Add to `App.jsx` initial state:
```javascript
aspects: [
  { name: "Test 1", power: 2 },
  { name: "Test 2", power: 1 },
  { name: "Test 3", power: 3 },
  { name: "Test 4", power: 2 }
]
```

Or run test file:
```bash
node backend/engine/fusionEngine.test.js
```

## Common Modifications

### Add new stat
1. Add to `createDefaultState()` in stateValidator.js
2. Add display in `SystemState.jsx`
3. Add changes in choice handlers

### Add new choice
1. Add to `generateChoices()` in play.js
2. Handle in `generateStoryPlaceholder()` in play.js
3. Add delta in `applyChoice()` in stateMerge.js

### Change fusion threshold
Modify `FUSION_THRESHOLD` in fusionEngine.js

### Change theme colors
Edit CSS variables in styles.css:
```css
:root {
  --bg-primary: #0a0e1a;
  --accent: #6366f1;
  /* etc */
}
```

## Troubleshooting

### Backend won't start
- Check Node.js version (need 18+)
- Run `npm install` in backend/
- Check port 3001 is free

### Frontend won't start
- Check Node.js version (need 18+)
- Run `npm install` in frontend/
- Check port 3000 is free

### API not connecting
- Check backend is running
- Verify URL in `frontend/src/api.js`
- Check CORS is enabled
- Look at browser console for errors

### State errors
- Verify state structure matches schema
- Check browser/server console
- Use default state as template

## Environment Variables

The `.env` file is automatically created in the project root when you run `start.sh` or `start.bat`.

Manual creation (optional):
```bash
# In project root
cp .env.example .env
```

Example `.env` configuration:
```env
PORT=3001
NODE_ENV=development
ENABLE_LLM=true
DEBUG_MODE=true
```

## URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Backend health**: http://localhost:3001/

## Key Design Principles

1. **Private-first**: Single user now, multi-user later
2. **Stateless**: Full state in each request
3. **Modular**: Engines are independent
4. **No grinding**: Power from context, not repetition
5. **Clinical tone**: System is dry, not friendly

## Next Features Priority

1. LLM integration (story generation)
2. Database persistence
3. Enhanced fusion mechanics
4. Combat system
5. Inventory system
6. Multiple characters/saves
7. Authentication/multi-user

## Resources

- Full guide: `README.md`
- Dev guide: `DEVELOPMENT.md`
- State schema: `backend/engine/stateValidator.js`
- Fusion logic: `backend/engine/fusionEngine.js`

---

**Need help?** Check the development guide or create an issue.
