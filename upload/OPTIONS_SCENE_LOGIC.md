# Voidverse RPG - Options & Scene Logic Documentation

## Overview

This document describes the new options generation, character creation, and world rules systems implemented for Voidverse RPG.

## Table of Contents

1. [Option Generation System](#option-generation-system)
2. [Character Creation & Autocomplete](#character-creation--autocomplete)
3. [World Rules & Healing](#world-rules--healing)
4. [Content Rating & Safety](#content-rating--safety)
5. [API Reference](#api-reference)

---

## Option Generation System

### Core Concept

Every scene generates **exactly 6 action options**:
- **4 normal options**: Constructive, neutral, social, or understandable actions
- **2 extreme options**: Absurd, dissociative, overly emotional, or psychologically unusual actions

### Distribution Rules

The system automatically adjusts the distribution based on scene intensity:

- **Calm scenes**: 4 normal + 2 extreme
- **Tense scenes**: 4 normal + 2 extreme
- **Escalated scenes**: Can vary to 5:1 or 3:3 based on context

### Context-Sensitive Generation

Options are generated based on:

1. **Character Psychology**
   - Dominant: Options showing control and territory
   - Anxious: Options for coping with fear
   - Traumatized: Trauma-informed responses
   - Dissociative: Options reflecting disconnection

2. **Current Situation**
   - Recent fusion events
   - Environmental factors
   - Stats levels
   - Mutation count

3. **Emotional State**
   - Anxious, aggressive, reserved, or balanced
   - Derived from stat relationships

### Option Categories

**Normal Options:**
- Introspective (reflection, self-analysis)
- Sensory (exploring surroundings, physical awareness)
- Exploration (investigating, discovering)
- Quiet action (meditation, observation)
- Social/adaptive (context-dependent)

**Extreme Options:**
- Dissociative (viewing self from outside, questioning reality)
- Overly emotional (screaming into void, irrational actions)
- Absurd (eating void matter, inventing new identity)
- Self-testing (pushing limits, dangerous experiments)
- Trauma-related (flashbacks, panic, escape fantasies)

### Usage Example

```javascript
import { generateOptions } from './engine/optionGenerator.js';

const state = {
  character: { name: "Luna", ... },
  abilities: { cores: [...], aspects: [...] },
  stats: { dominance: 6, control: 4, awareness: 7 },
  environment: "neutral"
};

const options = generateOptions(state, lastChoice);
// Returns array of 6 unique options
```

---

## Character Creation & Autocomplete

### Philosophy

Players can provide as much or as little information as they want. The system intelligently fills in missing details to create a complete, plausible character.

### Input Fields

All fields are optional:

```javascript
{
  name: "Luna",                    // Auto-generated if missing
  age: 14,                         // Auto-generated if missing
  appearance: {
    race: "Catgirl",              // Auto-generated if missing
    hairColor: "schwarz",          // Auto-generated if missing
    eyeColor: "bernsteinfarben",   // Auto-generated if missing
    // ... other appearance traits
  },
  personality: {
    coreTraits: ["nachdenklich"],  // Auto-generated if missing
    emotionalTendencies: [],       // Derived from traits
    // ...
  },
  psychologicalTraits: {
    hints: ["traurig", "ängstlich"], // Used to generate related conditions
    disorders: [],                   // Auto-generated based on hints
    traumaResponses: [],             // Context-dependent
    specificFears: []                // Auto-generated
  },
  backstory: "..."                   // Template-based if missing
}
```

### Autocomplete Logic

**1. Basic Info:**
- Name: Random from curated list
- Age: 14-18 for reincarnated form
- Race: Random from available options

**2. Appearance:**
- Height, build, colors based on race
- Race-specific features added automatically

**3. Personality:**
- Core traits from personality pool
- Emotional tendencies derived from core traits
- Coping mechanisms based on other traits

**4. Psychological Traits:**

If hints include "traurig" or "ängstlich":
- May generate depression or anxiety disorders
- Adds appropriate trauma responses
- Generates related fears

If backstory includes transformation/resistance:
- Adds transformation-related trauma
- May flag dissociative tendencies
- Adds identity-related fears

**5. Backstory:**
- Template-based generation
- Incorporates character traits
- Includes previous life details

### Usage Example

```javascript
import { generateCharacter, characterToGameState } from './engine/characterGenerator.js';

// Minimal input
const character = generateCharacter({
  name: "Alex",
  psychologicalTraits: {
    hints: ["ängstlich", "traurig"]
  }
});

// Convert to game state
const gameState = characterToGameState(character);
```

### API Endpoint

**POST /character/create**

Request:
```json
{
  "character": {
    "name": "Alex",
    "psychologicalTraits": {
      "hints": ["ängstlich"]
    }
  }
}
```

Response:
```json
{
  "success": true,
  "character": { /* complete character */ },
  "gameState": { /* ready-to-use game state */ }
}
```

---

## World Rules & Healing

### Physical vs Psychological Healing

#### Physical Healing

**Rules:**
- Physical injuries heal EASILY and RAPIDLY
- Severed limbs, diseases, chronic conditions = like treating a cold
- Magical/medical/technological healing is commonplace
- Body parts can regrow or be replaced
- Physical trauma is NOT a big deal in this world

**Implementation:**
```javascript
import { canHealPhysicalCondition } from './engine/worldRules.js';

const result = canHealPhysicalCondition("broken arm", context);
// Returns:
// {
//   canHeal: true,
//   healingType: 'magical-medical',
//   timeframe: 'Minuten bis Stunden',
//   cost: 'minimal'
// }
```

#### Psychological Healing

**Rules:**
- Mental conditions change REALISTICALLY and GRADUALLY
- No magical therapy or instant healing
- Trauma, PTSD, anxiety require TIME and PROCESSING
- Positive experiences slowly improve mental state
- Negative experiences can worsen conditions

**Implementation:**
```javascript
import { canHealPsychologicalCondition } from './engine/worldRules.js';

const result = canHealPsychologicalCondition("trauma", context);
// Returns:
// {
//   canHeal: true,
//   healingType: 'gradual-realistic',
//   requirements: ['Positive experiences', 'Time', 'Processing'],
//   timeframe: 'Wochen bis Monate',
//   canWorsen: true
// }
```

### Transformation Rules

#### Valid Transformations

Extreme transformations (gender, identity, metamorphosis) require **explicit magical context**:

Valid magical contexts:
- ✅ Reincarnation/rebirth
- ✅ Bloodline awakening
- ✅ Divine intervention
- ✅ Magical artifacts
- ✅ System evolution events
- ✅ Void energy manipulation

#### Validation

```javascript
import { validateTransformation } from './engine/worldRules.js';

const transformation = {
  type: 'gender change',
  trigger: 'reincarnation',
  target: 'character body'
};

const result = validateTransformation(transformation, context);
// Returns:
// {
//   valid: true,
//   reason: 'Transformation durch Reinkarnation narrativ gerechtfertigt',
//   permanent: true,
//   consequences: [...]
// }
```

Without magical context:
```javascript
const result = validateTransformation({
  type: 'gender change',
  trigger: 'decided to change',
  target: 'character'
}, context);
// Returns:
// {
//   valid: false,
//   reason: 'Extreme Transformation ohne magischen Kontext nicht erlaubt',
//   blocked: true
// }
```

### Integration with LLM

The world rules are encoded in the LLM prompts:

**From systemPrompt.txt:**
```
World Rules (CRITICAL):
Healing & Body:
- Physical injuries/diseases heal EASILY and MAGICALLY
- Psychological changes are REALISTIC and GRADUAL
Transformations:
- Extreme transformations require EXPLICIT magical context
- WITHOUT magical justification, transformations DO NOT occur
```

---

## Content Rating & Safety

### Rating Levels

- **SAFE**: No adult themes
- **TEEN**: Mild themes (13+)
- **MATURE**: Strong themes (16+)
- **ADULT**: Adult themes (18+)

### Content Categories

The system detects:
- Violence
- Self-harm
- Suicidal ideation
- Sexual content
- Sexual violence
- Substance abuse
- Psychological trauma
- Body horror
- Death

### Automatic Analysis

Content is automatically analyzed for each story segment:

```javascript
import { analyzeContent } from './engine/contentRating.js';

const analysis = analyzeContent(storyText);
// Returns:
// {
//   rating: 'mature',
//   categories: ['psychological-trauma', 'body-horror'],
//   requiresWarning: true,
//   requiresAgeVerification: false
// }
```

### Content Warnings

When sensitive content is detected, warnings are automatically prepended:

```
⚠️ INHALTSWARNUNG: Dieser Inhalt enthält Darstellungen von: Psychologisches Trauma, Körper-Horror

Diese Themen werden respektvoll und ohne Glorifizierung behandelt.
Wenn du dich unwohl fühlst, kannst du jederzeit eine andere Option wählen.

---

[Story text follows...]
```

### Age Verification

#### When Required

Age verification is required when:
- Content rating is ADULT
- Content includes adult categories (self-harm, suicidal ideation, sexual violence)

#### Verification Process

**1. Backend detects adult content:**
```javascript
if (contentAnalysis.requiresAgeVerification && !hasValidAgeVerification(session)) {
  return res.status(403).json({
    requiresAgeVerification: true,
    contentRating: 'adult',
    message: 'Dieser Inhalt ist für Personen unter 18 Jahren nicht geeignet.'
  });
}
```

**2. Frontend shows verification prompt**

**3. User submits verification:**

**POST /play/verify-age**
```json
{
  "sessionId": "abc-123",
  "birthYear": 1995,
  "confirmed": true
}
```

**4. System validates:**
- Age >= 18
- Confirmation accepted
- Stores in session

**5. Verification lasts 24 hours**

### Safety Features

1. **Never glorifies or trivializes** sensitive topics
2. **Always provides context** for difficult themes
3. **Offers opt-out mechanisms** (undo, choose different option)
4. **Includes help resources** in guidelines
5. **Respects user age** with content filtering

### Content Guidelines

Available via `getContentGuidelines()`:
- Lists what content may appear
- Explains handling approach
- Provides crisis hotlines
- Emphasizes opt-out options

---

## API Reference

### POST /play

Main game endpoint. Now includes content rating.

**Request:**
```json
{
  "sessionId": "optional-uuid",
  "choice": "player's choice",
  "state": { /* game state */ }
}
```

**Response:**
```json
{
  "sessionId": "uuid",
  "story": "story text with optional warning",
  "systemState": { /* updated state */ },
  "choices": [ /* 6 options */ ],
  "fusionOccurred": false,
  "contentRating": "safe",
  "contentWarning": false
}
```

**Error (Age Verification Required):**
```json
{
  "error": "Age verification required",
  "requiresAgeVerification": true,
  "contentRating": "adult",
  "message": "..."
}
```

### POST /play/verify-age

Submit age verification.

**Request:**
```json
{
  "sessionId": "uuid",
  "birthYear": 1995,
  "confirmed": true
}
```

**Response (Success):**
```json
{
  "success": true,
  "verified": true,
  "age": 29
}
```

**Response (Failed):**
```json
{
  "success": false,
  "reason": "Nutzer ist unter 18 Jahre alt"
}
```

### POST /character/create

Create or autocomplete a character.

**Request:**
```json
{
  "character": {
    "name": "Alex",
    "psychologicalTraits": {
      "hints": ["ängstlich"]
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "character": { /* complete character data */ },
  "gameState": { /* ready-to-use game state */ }
}
```

### POST /character/validate

Validate character data (optional).

**Request:**
```json
{
  "character": { /* character data */ }
}
```

**Response:**
```json
{
  "valid": true,
  "issues": []
}
```

---

## Testing

### Run Tests

```bash
# Option generator
cd backend/engine
node optionGenerator.test.js

# Character generator
node characterGenerator.test.js
```

### Manual Testing Flow

1. **Start backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Test option generation:**
   - Make any choice
   - Verify 6 unique options returned
   - Check for mix of normal/extreme

3. **Test character creation:**
   ```bash
   curl -X POST http://localhost:3001/character/create \
     -H "Content-Type: application/json" \
     -d '{"character": {"name": "Test"}}'
   ```

4. **Test age verification:**
   ```bash
   curl -X POST http://localhost:3001/play/verify-age \
     -H "Content-Type: application/json" \
     -d '{"sessionId":"test","birthYear":1995,"confirmed":true}'
   ```

---

## Implementation Notes

### Performance

- Option generation: O(n) where n = pool size
- Character generation: O(1) 
- Content analysis: O(m) where m = text length
- All operations are fast (<10ms typically)

### Memory

- Session data stored in-memory
- Consider moving to database for production
- Age verifications expire after 24 hours

### Security

- Age verification is client-honor-based (no ID verification)
- Session IDs are UUIDs (secure)
- Content filtering prevents accidental exposure

### Extensibility

All systems are modular:
- Add new option types in `optionGenerator.js`
- Add new character traits in `characterGenerator.js`
- Add new content categories in `contentRating.js`
- Extend world rules in `worldRules.js`

---

## Future Enhancements

Potential improvements:

1. **Database persistence** for sessions and characters
2. **ML-based content analysis** for better detection
3. **Multiple language support** for prompts
4. **User preference system** for content filtering
5. **Analytics** on option selection patterns
6. **A/B testing** for option effectiveness

---

## Troubleshooting

### Options Not Generating Correctly

Check:
- State structure is valid
- Stats are within expected ranges
- Context analysis is working

### Character Autocomplete Issues

Check:
- Input structure matches expected format
- Hints are being processed
- Backstory parsing is working

### Age Verification Not Working

Check:
- Session ID is being passed correctly
- Verification data structure is correct
- Birth year is valid (>= 18 years old)

### Content Warnings Not Appearing

Check:
- Content analysis is detecting categories
- Warning generation is enabled
- Text contains relevant keywords

---

## Support

For issues or questions:
- Check DEVELOPMENT.md for architecture details
- Review test files for usage examples
- Check console logs for debugging info

---

*Last Updated: 2024*
