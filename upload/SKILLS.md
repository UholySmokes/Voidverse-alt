# Game State Management Skill

## Overview

This skill helps you work with game state management in Voidverse RPG. The project follows a stateless server architecture where the complete game state is passed with each request.

## Architecture Philosophy

### Stateless Server Design

**Key Principle**: The server holds no session state between requests.

**Benefits:**
- Easy to scale horizontally
- Simple debugging (state is always visible)
- No session management complexity
- Easy to implement save/load later

**How it works:**
1. Client sends: `{ choice, state }`
2. Server processes: validates → applies choice → checks fusion
3. Server returns: `{ story, systemState, choices }`
4. Client stores updated state for next request

## State Structure

### Complete State Schema

```javascript
{
  character: {
    name: string,           // Player character name
    level: number,          // Current level (1+)
    experience: number      // Experience points (0+)
  },
  abilities: {
    cores: [                // Permanent abilities
      {
        name: string,       // Core ability name
        essence: number,    // Power level (0+)
        mutations: string[], // Permanent modifications
        tier: number        // Progression tier (1+)
      }
    ],
    aspects: [              // Temporary abilities
      {
        name: string,       // Aspect name
        power: number       // Power level (1+)
      }
    ]
  },
  stats: {
    dominance: number,      // Dominance stat (0+)
    control: number,        // Control stat (0+)
    awareness: number       // Awareness stat (0+)
  }
}
```

## Core Files

### stateValidator.js

**Purpose**: Ensures state integrity and structure

**Key Functions:**

```javascript
// Validates complete state structure
validateState(state)
// Throws errors if state is invalid:
// - Missing required fields
// - Invalid types
// - Out-of-range values
// - Malformed arrays

// Creates valid default state
createDefaultState(characterName = "Wanderer")
// Returns a complete, valid starting state
```

**Validation Rules:**
- Character must exist with name, level, experience
- Abilities must have cores and aspects arrays
- At least one core must exist
- All cores must have name, essence, mutations, tier
- All aspects must have name and power
- Stats must have dominance, control, awareness
- All numeric values must be >= 0
- Level and tier must be >= 1

### stateMerge.js

**Purpose**: Apply changes (deltas) to game state

**Key Functions:**

```javascript
// Applies delta to state immutably
mergeState(oldState, delta)
// Returns new state object (never mutates original)

// Converts choice to state delta
applyChoice(state, choice)
// Returns delta object based on player choice
```

**Delta Structure:**

Deltas describe changes to apply to state:

```javascript
{
  // Fusion result
  fusion: {
    consumed: [aspect, aspect, aspect],
    result: { name, power },
    essenceGain: number,
    mutation?: string
  },
  
  // Add new aspect
  addAspect: { name: string, power: number },
  
  // Stat changes (relative)
  stats: {
    dominance?: +/- number,
    control?: +/- number,
    awareness?: +/- number
  },
  
  // Experience gain
  experience: number,
  
  // Level up
  levelUp: true,
  
  // Improve core
  improveCore: {
    index: number,
    essenceGain: number
  }
}
```

## State Flow

### Request Flow

```
1. Player Action
   ↓
2. Frontend sends { choice, state } to /play
   ↓
3. Backend: validateState(state)
   ↓
4. Backend: runFusion(state) [if aspects >= 4]
   ↓
5. Backend: applyChoice(state, choice)
   ↓
6. Backend: mergeState(state, delta)
   ↓
7. Backend: validateState(newState)
   ↓
8. Backend: returns { story, systemState, choices }
   ↓
9. Frontend updates local state
```

### Fusion Integration

Fusion happens automatically during state processing:

```javascript
// In routes/play.js
const { fusion, state: fusedState } = runFusion(validatedState);

// If fusion occurred
if (fusion) {
  delta.fusion = fusion;
  fusionOccurred = true;
}

// Merge fusion results into state
const newState = mergeState(fusedState, delta);
```

## Common Tasks

### Adding a New Stat

**Step 1**: Update default state in `stateValidator.js`

```javascript
stats: {
  dominance: 5,
  control: 3,
  awareness: 4,
  newStat: 0  // Add here
}
```

**Step 2**: Update validation logic (if needed)

```javascript
if (typeof state.stats.newStat !== 'number') {
  throw new Error('Invalid newStat type');
}
```

**Step 3**: Add stat changes in `stateMerge.js`

```javascript
// In applyChoice function
else if (choice.includes("Action Name")) {
  delta.stats = { newStat: 1 };
}
```

**Step 4**: Update frontend `SystemState.jsx` to display

### Adding a New Choice Type

**Step 1**: Add choice generation in `routes/play.js`

```javascript
// Conditional choice
if (state.stats.awareness > 5) {
  baseChoices.push("Use heightened awareness");
}
```

**Step 2**: Handle choice in `stateMerge.js`

```javascript
else if (choice.includes("Use heightened awareness")) {
  delta.addAspect = { name: "Prescient Vision", power: 2 };
  delta.stats = { awareness: 1 };
}
```

**Step 3**: Test the new choice flow

### Modifying State Structure

**Important**: State structure changes are breaking changes!

**Process:**
1. Update `stateValidator.js` default state
2. Update validation logic
3. Update all files that read/write this state field
4. Add migration logic if needed for existing saves
5. Update frontend components
6. Update documentation

### Adding Experience/Leveling

Example delta for gaining experience:

```javascript
delta.experience = 50;

// Check for level up
const newExp = state.character.experience + delta.experience;
const expForNextLevel = state.character.level * 100;

if (newExp >= expForNextLevel) {
  delta.levelUp = true;
  delta.experience = newExp - expForNextLevel;
}
```

## State Validation Best Practices

### Always Validate

```javascript
// At request start
validateState(incomingState);

// After state changes
validateState(newState);

// Before returning to client
validateState(responseState);
```

### Handle Validation Errors

```javascript
try {
  validateState(state);
} catch (error) {
  return res.status(400).json({
    error: 'Invalid state',
    details: error.message
  });
}
```

### Use Default State as Reference

```javascript
// When in doubt, check the structure
const defaultState = createDefaultState();
// Use this as the authoritative schema
```

## State Merging Best Practices

### Always Create New Objects

```javascript
// ❌ Wrong - mutates original state
state.character.level++;

// ✅ Correct - creates new state
const newState = {
  ...state,
  character: {
    ...state.character,
    level: state.character.level + 1
  }
};
```

### Apply Deltas Immutably

The `mergeState` function handles this automatically:

```javascript
// Internally uses deep cloning
const newState = mergeState(oldState, delta);
// oldState remains unchanged
```

### Combine Multiple Changes

```javascript
// Build up delta object
const delta = {};

if (gainedExperience) {
  delta.experience = 50;
}

if (statBonus) {
  delta.stats = { dominance: 2 };
}

if (newAspect) {
  delta.addAspect = { name: "New Power", power: 3 };
}

// Apply all at once
const newState = mergeState(state, delta);
```

## Testing State Changes

### Unit Test Pattern

```javascript
// Test state merge
const originalState = createDefaultState();
const delta = { experience: 100 };
const newState = mergeState(originalState, delta);

// Verify changes
assert(newState.character.experience === 100);
// Verify immutability
assert(originalState.character.experience === 0);
```

### Integration Test Pattern

```javascript
// Test complete flow
const response = await fetch('/play', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    choice: "Test choice",
    state: createDefaultState()
  })
});

const result = await response.json();
assert(result.systemState);
validateState(result.systemState);
```

### Manual Testing

1. Start with default state
2. Make a choice
3. Verify state changes in response
4. Use browser dev tools to inspect state
5. Check that state is valid

## Common Issues and Solutions

### Issue: State Not Persisting

**Cause**: Stateless architecture - state must be sent with each request

**Solution**: Ensure frontend stores and sends complete state:
```javascript
const response = await makeChoice(currentGameState, choice);
setGameState(response.systemState);  // Store for next request
```

### Issue: Validation Fails After Change

**Cause**: State structure doesn't match schema

**Solution**: 
1. Check `stateValidator.js` for required structure
2. Ensure all required fields are present
3. Verify types match (string, number, array)
4. Check numeric values are in valid ranges

### Issue: State Mutation Bug

**Cause**: Directly modifying state object

**Solution**: Always use immutable patterns:
```javascript
// Use spread operator
const newState = { ...oldState };
// Or use mergeState function
const newState = mergeState(oldState, delta);
```

### Issue: Fusion State Not Merging

**Cause**: Fusion delta not properly integrated

**Solution**: Check fusion integration in route:
```javascript
const { fusion, state: fusedState } = runFusion(state);
if (fusion) {
  delta.fusion = fusion;  // Add to delta
}
const newState = mergeState(fusedState, delta);
```

## Performance Considerations

### State Size

- Keep state compact (currently < 10KB)
- Avoid storing large arrays
- Consider archiving old history
- Use references instead of duplicating data

### Validation Performance

- Validation is fast (< 1ms for normal state)
- Only validate at key points (receive, return)
- Cache validation results if needed

### Cloning Performance

- Deep cloning is fast for small objects
- Current state size is optimal
- Consider shallow cloning for nested objects if state grows

## Future Enhancements

### Database Persistence

When adding database:
1. Store state as JSON blob
2. Add timestamp and version fields
3. Keep current validation logic
4. Add migration system for schema changes

### State History

To track changes over time:
```javascript
{
  history: [
    { timestamp, choice, stateBefore, stateAfter }
  ]
}
```

### State Compression

For large states:
```javascript
// Compress before storing
const compressed = compressState(state);
// Decompress when loading
const state = decompressState(compressed);
```

## Related Documentation

- State structure: `backend/engine/stateValidator.js`
- State merging: `backend/engine/stateMerge.js`
- Fusion integration: `backend/engine/fusionEngine.js`
- API endpoint: `backend/routes/play.js`
- Frontend state: `frontend/src/App.jsx`

## Quick Reference

### Creating New State
```javascript
const state = createDefaultState("PlayerName");
```

### Validating State
```javascript
validateState(state);  // Throws on invalid
```

### Applying Changes
```javascript
const delta = { experience: 50, stats: { dominance: 1 } };
const newState = mergeState(oldState, delta);
```

### Checking Fusion
```javascript
const { fusion, state: fusedState } = runFusion(state);
if (fusion) {
  // Fusion occurred
  console.log(`Gained ${fusion.essenceGain} essence`);
}
```
