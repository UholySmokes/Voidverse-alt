# Quick Reference Guide

## Development Commands

### Backend
```bash
cd backend
npm install        # Install dependencies
npm start          # Start server (production)
npm run dev        # Start with hot reload
node engine/fusionEngine.test.js  # Run tests
```

### Frontend
```bash
cd frontend
npm install        # Install dependencies
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Build for production
npm run preview    # Preview production build
```

## Environment Setup

1. Copy `.env.example` to `.env`
2. Add your LLM API key (optional but recommended):
   - **OpenAI**: `OPENAI_API_KEY=your-key`
   - **Anthropic**: `ANTHROPIC_API_KEY=your-key`

## Key Architecture Concepts

### State Flow
1. User makes choice → Frontend sends request
2. Backend validates state → Runs fusion engine
3. LLM generates story (or placeholder)
4. State merged with deltas → Returns to frontend
5. Frontend updates UI with new state

### Fusion System
- **Auto-fusion**: Triggers when aspects >= 4
- **Manual fusion**: Player can force with 2-3 aspects
- **Essence gain**: `floor(totalPower * 1.5 * multipliers)`
- **Mutations**: 15% base chance + modifiers

### Tag System
- Each aspect has 1-3 tags (fire, ice, shadow, etc.)
- Tags combine to create **synergies**
- Synergies boost fusion power and essence
- 35+ unique synergy combinations available

## Code Organization

```
backend/
├── server.js              # Express server entry point
├── routes/
│   └── play.js           # Main game endpoint
├── engine/
│   ├── fusionEngine.js   # Core fusion logic (650+ lines)
│   ├── stateValidator.js # State validation
│   └── stateMerge.js     # State updates (680+ lines)
└── llm/
    └── llmService.js     # LLM integration (3 providers)

frontend/
├── src/
│   ├── App.jsx           # Main component
│   ├── api.js            # Backend calls
│   └── components/       # UI components
```

## Important Functions

### fusionEngine.js
- `runFusion(state)` - Check and execute auto-fusion
- `calculateFusion(aspects, state, context)` - Core fusion math
- `generateAspectTags(name, context)` - Tag generation (cached)
- `findSynergies(tags, context)` - Synergy detection
- `determineMutation(state, context)` - Mutation logic

### stateMerge.js
- `mergeState(oldState, delta)` - Apply changes to state
- `handleFusion(state, fusion)` - Process fusion results
- `applyMutationEffect(state, effect)` - Apply mutation effects
- `checkMutationDiscoveries(state)` - Unlock progression

### llmService.js
- `generateStory(choice, state, evolvedState)` - Main entry point
- `callOpenAI(prompt)` - OpenAI API
- `callAnthropic(prompt)` - Anthropic API

## Testing

### Manual Testing
```bash
# Test fusion engine
node backend/engine/fusionEngine.test.js

# Test backend server
cd backend && npm start
# Open http://localhost:3001 - should see status

# Test frontend
cd frontend && npm run dev
# Open http://localhost:3000 - should see game
```

### Adding Test Aspects
Edit `frontend/src/App.jsx` initial state:
```javascript
aspects: [
  { name: "Test Fire", power: 3 },
  { name: "Test Ice", power: 2 },
  { name: "Test Shadow", power: 2 },
  { name: "Test Light", power: 1 }
]
// Next action will trigger fusion
```

## Common Issues

### Backend won't start
- Check `.env` file exists
- Verify port 3001 is free
- Run `npm install` in backend/

### Frontend won't connect
- Ensure backend is running on port 3001
- Check CORS is enabled in server.js
- Verify API_BASE in `frontend/src/api.js`

### LLM not working
- Verify API key in `.env`
- Check `ENABLE_LLM=true`
- Look for error messages in backend console
- System will fallback to placeholder text

### Tests failing
- Ensure all dependencies installed
- Check for typos in recent changes
- Verify state structure matches validator

## Performance Tips

1. **Tag caching**: Automatically enabled (1000 item limit)
2. **Synergy calculations**: Consider pre-computing common combos
3. **State size**: Keep < 100KB for responsive UX
4. **LLM calls**: Choose based on budget (GPT-3.5 for dev, GPT-4/Claude for production)
5. **Frontend builds**: Run `npm run build` for production

## Security Checklist

- [ ] Never commit `.env` file (in .gitignore)
- [ ] Keep API keys secure and rotated
- [ ] Update dependencies regularly (`npm audit`)
- [ ] Validate all user inputs on backend
- [ ] Use HTTPS in production
- [ ] Set appropriate CORS origins

## Useful Resources

- [React Docs](https://react.dev)
- [Express Guide](https://expressjs.com/en/guide/routing.html)
- [OpenAI API](https://platform.openai.com/docs)
- [Anthropic API](https://docs.anthropic.com)

## Getting Help

1. Check DEVELOPMENT.md for detailed architecture
2. Read LLM_SETUP.md for LLM configuration
3. Review this Quick Reference for common tasks
4. Check the code comments - they're comprehensive
