# GitHub Copilot Instructions for Voidverse RPG

## Repository Overview

Voidverse RPG is a LitRPG web application with an innovative ability fusion system inspired by cultivation novels and progression fantasy. It's built with a private-first architecture designed to easily scale to multi-user later.

### Tech Stack

- **Backend**: Node.js + Express (ES modules)
- **Frontend**: React 18 + Vite
- **State Management**: Stateless server design - each request contains complete game state
- **Architecture**: Modular engine design with independent, testable components

## Project Structure

```
voidverse-rpg/
├── backend/                    # Express server
│   ├── server.js              # Main server entry point
│   ├── routes/
│   │   └── play.js           # Main game endpoint
│   ├── engine/                # Core game logic
│   │   ├── fusionEngine.js   # Ability fusion logic
│   │   ├── stateValidator.js # State validation
│   │   └── stateMerge.js     # State updates
│   ├── llm/                   # LLM prompts (not yet integrated)
│   └── db/                    # Future database schema
└── frontend/                   # React app
    ├── src/
    │   ├── App.jsx           # Main app component
    │   ├── api.js            # Backend API calls
    │   └── components/       # React components
    └── vite.config.js
```

## Setup and Development

### Initial Setup

```bash
# Backend setup
cd backend
npm install
npm start                     # Runs on http://localhost:3001

# Frontend setup (in a new terminal)
cd frontend
npm install
npm run dev                   # Runs on http://localhost:3000
```

### Available Commands

**Backend:**
- `npm start` - Start the server (production mode)
- `npm run dev` - Start with hot reload using Node's --watch flag
- Manual testing: `node backend/engine/fusionEngine.test.js`

**Frontend:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Testing

Currently, the project uses manual testing. To test the fusion system:
1. Modify `frontend/src/App.jsx` to add 4+ aspects to initial state
2. Start both backend and frontend
3. Make a choice to trigger fusion
4. Verify fusion occurs and essence is gained

## Coding Conventions and Best Practices

### General Principles

1. **Private-First Design**: Build for single-user, scale to multi-user later
2. **Stateless Backend**: Each request contains the complete game state
3. **Modular Engines**: Keep fusion/validation logic independent and testable
4. **No Grinding**: Power progression comes from context and story, not repetition

### JavaScript Style

- Use **ES modules** (`import`/`export`, not `require`)
- Use `const` by default, `let` only when reassignment is needed
- Prefer arrow functions for callbacks and short functions
- Use template literals for string interpolation
- Keep functions small and focused on a single responsibility

### State Management

The game state is the single source of truth with this structure:

```javascript
{
  character: {
    name: string,
    level: number,
    experience: number
  },
  abilities: {
    cores: Array<{
      name: string,
      essence: number,
      mutations: string[],
      tier: number
    }>,
    aspects: Array<{
      name: string,
      power: number
    }>
  },
  stats: {
    dominance: number,
    control: number,
    awareness: number
  }
}
```

**Important:** Always validate state changes using `stateValidator.js` before applying them.

### React Patterns

- Use functional components with hooks
- Keep components focused and single-purpose
- Props should be clearly named and documented
- Use CSS modules or standard CSS files (avoid inline styles unless necessary)
- State updates should be immutable

### API Design

- Backend validates all incoming state
- Responses include the updated state and next choices
- Use meaningful HTTP status codes
- Always include session IDs for tracking

### Fusion System Rules

1. **Auto-fusion** triggers when aspects >= 4
2. Consumes the first 3 aspects
3. Essence gain formula: `floor(totalPower * 1.5)`
4. 15% base mutation chance (increases with existing mutations)
5. Result power: `floor(totalPower * 0.8)`

## Common Tasks

### Adding a New Game Stat

1. Update `stateValidator.js` to include the new stat in the default state
2. Modify `frontend/src/components/SystemState.jsx` to display it
3. Update choice handlers in `stateMerge.js` to modify the stat as needed

### Adding a New Choice Type

1. Add choice generation logic in `routes/play.js`
2. Handle the choice in `stateMerge.js` by creating appropriate state deltas
3. Update state merge logic if new delta fields are introduced

### Modifying Fusion Logic

1. All fusion logic is in `backend/engine/fusionEngine.js`
2. The `calculateFusion()` function contains the core math
3. Test changes with `fusionEngine.test.js`
4. Consider edge cases: no cores, empty aspects, mutation chains

## Important Notes for Copilot

1. **Don't add testing frameworks** unless explicitly asked - the project uses manual testing currently
2. **Don't add TypeScript** - the project uses vanilla JavaScript with JSDoc comments when needed
3. **Don't add linters or formatters** unless explicitly requested
4. **Preserve the stateless architecture** - don't introduce server-side state storage without discussion
5. **Keep dependencies minimal** - only add packages when absolutely necessary
6. **LLM integration is planned but not implemented** - the prompts in `backend/llm/` are templates for future use

## Future Roadmap

1. **Phase 1**: LLM Integration (Anthropic API or OpenAI)
2. **Phase 2**: Database persistence (SQLite or PostgreSQL)
3. **Phase 3**: Enhanced gameplay (complex fusion, combat, inventory)
4. **Phase 4**: Multi-user support (authentication, save/load)

## Error Handling

- Backend should validate all incoming requests
- State validation failures should return clear error messages
- Frontend should handle API errors gracefully
- Use try-catch blocks for async operations

## Security Considerations

- Never commit API keys or secrets (use `.env` files)
- Validate and sanitize all user inputs
- When LLM integration is added, implement rate limiting
- Consider implementing CORS properly for production

## Documentation

- Keep README.md focused on quick start and high-level overview
- DEVELOPMENT.md contains detailed architecture and implementation notes
- Add JSDoc comments for complex functions
- Document breaking changes in commit messages

## Resources

- React: https://react.dev
- Express: https://expressjs.com
- Vite: https://vitejs.dev
- Node.js: https://nodejs.org
