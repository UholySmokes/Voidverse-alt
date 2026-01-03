# Voidverse RPG - Developer Guide

## Architecture Overview

### Philosophy
- **Private-first**: Built for single-user, scales to multi-user
- **Stateless server**: Each request contains complete game state
- **Modular design**: Engines are independent and testable
- **LLM-ready**: Structure prepared for AI story generation

## Key Concepts

### State Management
The game state is the single source of truth. Structure:

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

### Fusion System

**Automatic Fusion**
- Triggers when aspects >= 4
- Consumes first 3 aspects
- Generates essence for primary core
- 15% base chance for mutation

**Manual Fusion**
- Player can fuse 2-3 aspects
- Same mechanics as auto-fusion
- Strategic choice for optimization

**Fusion Algorithm**
```
totalPower = sum(aspect.power)
essenceGain = floor(totalPower * 1.5)
mutationChance = 0.15 + (existingMutations * 0.05)
resultPower = floor(totalPower * 0.8)
```

## Engine Components

### fusionEngine.js
**Purpose**: Handles ability fusion logic

**Key Functions**:
- `runFusion(state)`: Check and execute auto-fusion
- `forceFusion(state, indices)`: Manual fusion
- `calculateFusion(aspects, state)`: Core fusion math

**Testing**:
```bash
node backend/engine/fusionEngine.test.js
```

### stateValidator.js
**Purpose**: Ensures state integrity

**Validations**:
- Character structure
- Core abilities exist
- Essence values valid
- Arrays properly formatted

**Key Functions**:
- `validateState(state)`: Throws on invalid state
- `createDefaultState(name)`: Generate starting state

### stateMerge.js
**Purpose**: Apply changes to game state

**Key Functions**:
- `mergeState(oldState, delta)`: Deep clone and apply changes
- `applyChoice(state, choice)`: Convert choice to state delta

**Deltas**:
```javascript
{
  fusion: { consumed: [...], result: {...} },
  addAspect: { name: string, power: number },
  stats: { dominance: +1 },
  experience: 10,
  improveCore: { index: 0 }
}
```

## Adding Features

### Adding a New Choice Type

1. **Add choice generation** in `routes/play.js`:
```javascript
if (state.condition) {
  baseChoices.push("New Choice");
}
```

2. **Handle choice** in `stateMerge.js`:
```javascript
else if (choice.includes("New Choice")) {
  delta.customField = newValue;
}
```

3. **Update state merge** to handle new delta fields

### Adding a New Stat

1. **Add to initial state** in `stateValidator.js`:
```javascript
stats: {
  dominance: 5,
  control: 3,
  awareness: 4,
  newStat: 0  // Add here
}
```

2. **Update UI** in `SystemState.jsx`:
```jsx
<div className="stat-row">
  <span className="label">New Stat:</span>
  <span className="value">{stats.newStat}</span>
</div>
```

3. **Add stat changes** in choice handlers

### Integrating LLM

**Step 1**: Install SDK
```bash
cd backend
npm install @anthropic-ai/sdk
# or
npm install openai
```

**Step 2**: Create LLM module
```javascript
// backend/llm/generator.js
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function generateStory(state, choice) {
  const systemPrompt = fs.readFileSync('./llm/systemPrompt.txt', 'utf8');
  const rulesPrompt = fs.readFileSync('./llm/rulesPrompt.txt', 'utf8');
  
  const userPrompt = buildPrompt(state, choice);
  
  const response = await client.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1024,
    system: systemPrompt + '\n\n' + rulesPrompt,
    messages: [{
      role: 'user',
      content: userPrompt
    }]
  });
  
  return parseResponse(response.content[0].text);
}

function buildPrompt(state, choice) {
  return `
SYSTEM STATE:
${JSON.stringify(state, null, 2)}

PLAYER CHOICE:
"${choice}"

Generate the next story segment and propose state changes.
  `.trim();
}

function parseResponse(text) {
  // Parse LLM response into story and state changes
  // Implementation depends on your prompt engineering
  return {
    story: text,
    stateChanges: {}
  };
}
```

**Step 3**: Use in route
```javascript
// routes/play.js
import { generateStory } from '../llm/generator.js';

const { story, stateChanges } = await generateStory(state, choice);
```

## Testing Strategy

### Unit Tests
Test each engine independently:
```javascript
// Test fusion logic
const result = runFusion(testState);
assert(result.fusion !== undefined);

// Test validation
assert.throws(() => validateState(invalidState));

// Test state merge
const merged = mergeState(state, delta);
assert.equal(merged.character.level, expectedLevel);
```

### Integration Tests
Test complete flow:
```javascript
// Make request
const response = await fetch('/play', {
  method: 'POST',
  body: JSON.stringify({ state, choice })
});

const result = await response.json();
assert(result.sessionId);
assert(result.systemState);
```

### Manual Testing
1. Start with default state
2. Add 4 aspects manually in `App.jsx`
3. Make a choice
4. Verify fusion occurs
5. Check essence gain
6. Verify UI updates

## Common Patterns

### Adding Complexity to Fusion
Modify `calculateFusion()` to consider:
- Aspect types (fire + water = steam)
- Synergies (bonus if similar types)
- Timing (recently used aspects)
- Context (location, recent events)

### Implementing Combat
1. Add combat state to game state
2. Create `combatEngine.js`
3. Add combat-specific choices
4. Integrate with fusion system

### Adding Inventory
```javascript
// Add to state
inventory: {
  items: [
    { name: "Void Shard", quantity: 3 }
  ]
}

// Add UI component
<Inventory items={state.inventory.items} />
```

## Performance Considerations

### State Size
- Keep state < 100KB for responsive UX
- Archive old history to database
- Implement state compression for large sessions

### Fusion Calculations
- Fusion is O(n) where n = aspects
- Current limit: 4 aspects before forced fusion
- Can optimize with aspect indexing if needed

### LLM Calls
- Cache common responses
- Implement rate limiting
- Stream responses for better UX
- Fallback to templates if API fails

## Deployment

### Development
```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm run dev
```

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Serve with backend
cd ../backend
npm install express-static
# Modify server.js to serve frontend/dist
```

### Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
# Edit .env with your values
```

## Troubleshooting

### Fusion Not Triggering
- Check aspect count in state
- Verify `runFusion()` is called
- Check console for errors
- Test with `fusionEngine.test.js`

### State Validation Fails
- Check state structure matches schema
- Ensure all required fields present
- Verify array types
- Use `createDefaultState()` as reference

### UI Not Updating
- Check if state is properly set in React
- Verify API response structure
- Check browser console for errors
- Ensure state is cloned, not mutated

## Next Steps

Priority order for development:
1. ✅ Core MVP functionality
2. ⏳ LLM integration for story
3. ⏳ Database persistence
4. ⏳ Enhanced fusion rules
5. ⏳ Combat system
6. ⏳ Multi-user support

## Resources

- React Docs: https://react.dev
- Express Docs: https://expressjs.com
- Anthropic API: https://docs.anthropic.com
- Vite Docs: https://vitejs.dev
