# Quick Start Guide - New Features

## What's New

The game now has:
1. **Smart Option Generation** - Always 6 contextual options (4 normal, 2 extreme)
2. **Character Creator** - Auto-complete missing character details
3. **World Rules** - Physical healing is easy, mental healing takes time
4. **Content Safety** - Age verification for adult themes with warnings

## Testing the New Features

### 1. Test Option Generation

The options are now automatically generated based on your character's state and psychology.

**Start the backend:**
```bash
cd backend
npm install
npm start
```

**Start the frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Play the game:**
- Make any choice
- You should see 6 unique options
- Mix of normal (introspective, exploration) and extreme (dissociative, absurd)
- Options change based on your stats and situation

### 2. Test Character Creation

**Using curl:**
```bash
curl -X POST http://localhost:3001/character/create \
  -H "Content-Type: application/json" \
  -d '{
    "character": {
      "name": "Your Name"
    }
  }'
```

**Or with more details:**
```bash
curl -X POST http://localhost:3001/character/create \
  -H "Content-Type: application/json" \
  -d '{
    "character": {
      "name": "Alex",
      "psychologicalTraits": {
        "hints": ["ängstlich", "traurig"]
      }
    }
  }'
```

The system will auto-generate:
- Age, appearance, race
- Personality traits
- Psychological conditions (based on hints)
- Backstory
- Previous life details

### 3. Test Content Rating

Content is automatically analyzed. If adult themes are detected:

**You'll get a 403 error:**
```json
{
  "error": "Age verification required",
  "requiresAgeVerification": true,
  "contentRating": "adult"
}
```

**Submit verification:**
```bash
curl -X POST http://localhost:3001/play/verify-age \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "your-session-id",
    "birthYear": 1995,
    "confirmed": true
  }'
```

**Then retry your action** - it should work now.

### 4. Test Content Warnings

When sensitive content appears, you'll see:

```
⚠️ INHALTSWARNUNG: Dieser Inhalt enthält Darstellungen von: 
Psychologisches Trauma

Diese Themen werden respektvoll und ohne Glorifizierung behandelt.
Wenn du dich unwohl fühlst, kannst du jederzeit eine andere Option wählen.

---

[Story continues...]
```

## Manual Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend connects to backend
- [ ] 6 options appear after each choice
- [ ] Options are unique and make sense
- [ ] Character creation works with minimal input
- [ ] Character creation auto-completes missing fields
- [ ] Content warnings appear when appropriate
- [ ] Age verification blocks adult content
- [ ] After verification, adult content is accessible
- [ ] Story text shows emotions narratively (not as stats)

## Example Gameplay

1. **Start game** - You see initial story and 6 options
2. **Choose "Den eigenen Körper von außen betrachten"** (extreme option)
3. **System generates** - New story segment showing dissociative experience
4. **You get 6 new options** - Mix changes based on your psychological state
5. **If content gets mature** - Warning appears automatically
6. **If content is adult** - Age verification required

## Quick Debug

**Options not appearing?**
```bash
# Check backend logs
cd backend
npm start
# Look for errors in option generation
```

**Character creation failing?**
```bash
# Test directly
cd backend/engine
node characterGenerator.test.js
```

**Age verification not working?**
```bash
# Check session ID is passed
# Check birth year is >= 18 years ago
# Check confirmed is true
```

## API Quick Reference

### Create Character
```
POST /character/create
Body: { "character": { "name": "..." } }
```

### Play Game
```
POST /play
Body: { "sessionId": "...", "choice": "...", "state": {...} }
```

### Verify Age
```
POST /play/verify-age
Body: { "sessionId": "...", "birthYear": 1995, "confirmed": true }
```

## For Developers

**Run all tests:**
```bash
cd backend/engine
node optionGenerator.test.js
node characterGenerator.test.js
```

**Check code:**
```bash
# Option generation
backend/engine/optionGenerator.js

# Character creation
backend/engine/characterGenerator.js

# World rules
backend/engine/worldRules.js

# Content rating
backend/engine/contentRating.js
```

## Getting Help

- **English docs**: `docs/OPTIONS_SCENE_LOGIC.md`
- **German docs**: `docs/IMPLEMENTIERUNG_DE.md`
- **Dev guide**: `DEVELOPMENT.md`
- **Tests**: `backend/engine/*.test.js`

---

**Everything is working if:**
✅ Backend starts
✅ 6 options per scene
✅ Options match character psychology
✅ Character creation auto-completes
✅ Content warnings appear
✅ Age verification blocks/allows content
