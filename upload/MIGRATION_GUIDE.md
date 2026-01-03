# Migration Guide: New Architecture

## Overview

The Voidverse RPG codebase has been refactored to follow modern software architecture principles. This guide explains the changes and how to work with the new structure.

## What Changed?

### Before (Monolithic)
```
backend/engine/
└── fusionEngine.js (678 lines - everything in one file)
    ├── Constants and data
    ├── Tag generation
    ├── Synergy finding
    ├── Name generation
    ├── Mutation logic
    ├── Fusion calculation
    └── Aspect generation
```

### After (Modular)
```
backend/
├── config/              # Data configuration (92 lines total)
│   ├── aspectTags.js   # Tag definitions
│   ├── synergies.js    # Synergy bonuses
│   ├── environments.js # Environment modifiers
│   ├── mutations.js    # Mutation types
│   └── nameGeneration.js # Name generation data
├── utils/               # Reusable utilities (264 lines total)
│   ├── TagGenerator.js
│   ├── SynergyFinder.js
│   └── NameGenerator.js
├── services/            # Business logic (432 lines total)
│   ├── FusionCalculator.js
│   ├── MutationService.js
│   └── AspectService.js
└── engine/
    └── fusionEngine.js  # Core orchestration (219 lines)
```

**Result**: 678 lines → 219 lines in main file (68% reduction)  
**Total Code**: 974 lines (more organized, easier to maintain)

## Benefits

### 1. Single Responsibility Principle
Each file/class now has one clear purpose:
- Config files contain only data
- Utilities handle specific tasks
- Services encapsulate business logic
- Engine orchestrates everything

### 2. Easier Testing
```javascript
// Before: Had to test everything together
import { calculateFusion } from './fusionEngine.js';

// After: Can test components in isolation
import { tagGenerator } from './utils/TagGenerator.js';
import { fusionCalculator } from './services/FusionCalculator.js';
```

### 3. Better Maintainability
- Find code faster (clear directory structure)
- Modify one thing without affecting others
- Add new features without bloating existing files

### 4. Reusability
Utilities and services can be used anywhere:
```javascript
import { tagGenerator } from '../utils/TagGenerator.js';
import { synergyFinder } from '../utils/SynergyFinder.js';

// Use in new contexts without duplicating code
```

## How to Use the New Structure

### Working with Config Files

**Modifying game data** (tags, synergies, mutations, environments):
```javascript
// backend/config/synergies.js
export const TAG_SYNERGIES = {
  'fire+ice': { bonus: 1.5, suffix: 'Paradox', description: '...' },
  // Add new synergy here:
  'void+light': { bonus: 2.0, suffix: 'Twilight', description: 'Between worlds' }
};
```

### Using Utilities

**Direct usage** (recommended for new code):
```javascript
import { tagGenerator } from '../utils/TagGenerator.js';
import { synergyFinder } from '../utils/SynergyFinder.js';
import { nameGenerator } from '../utils/NameGenerator.js';

// Generate tags for an aspect
const tags = tagGenerator.generateTags('Fire Aspect', { environment: 'void_storm' });

// Find synergies
const synergies = synergyFinder.findSynergies(['fire', 'ice']);

// Generate a name
const name = nameGenerator.generateFusionName(aspects, synergies, context);
```

**Legacy wrapper functions** (for backward compatibility):
```javascript
import { generateAspectTags, findSynergies, generateFusionName } from './fusionEngine.js';

// These still work but are deprecated
const tags = generateAspectTags('Fire Aspect');
```

### Using Services

**Direct service usage** (recommended):
```javascript
import { fusionCalculator } from '../services/FusionCalculator.js';
import { mutationService } from '../services/MutationService.js';
import { aspectService } from '../services/AspectService.js';

// Calculate a fusion
const result = fusionCalculator.calculate(aspects, state, context);

// Determine a mutation
const mutation = mutationService.determineMutation(state, context);

// Generate a procedural aspect
const newAspect = aspectService.generateProceduralAspect(context);
```

## Backward Compatibility

**All existing code continues to work!** The old function exports still exist:

```javascript
// These still work (but use services internally)
import { 
  calculateFusion, 
  determineMutation, 
  generateProceduralAspect 
} from './fusionEngine.js';
```

## Adding New Features

### Adding a New Synergy
1. Edit `/backend/config/synergies.js`
2. Add your synergy to the `TAG_SYNERGIES` object
3. That's it! No need to touch engine code.

### Adding a New Utility Function
1. Add method to the appropriate utility class
2. Or create a new utility class if it's a new concern
3. Example:
```javascript
// backend/utils/TagGenerator.js
export class TagGenerator {
  // ... existing methods ...
  
  // New method
  countTags(aspectName) {
    const tags = this.generateTags(aspectName);
    return tags.length;
  }
}
```

### Adding a New Service
1. Create file in `/backend/services/`
2. Follow the existing pattern:
```javascript
export class MyNewService {
  doSomething(param) {
    // Business logic here
  }
}

export const myNewService = new MyNewService();
```

## Testing

### Unit Tests (Easy with new structure)
```javascript
// Test a utility in isolation
import { TagGenerator } from './utils/TagGenerator.js';

const generator = new TagGenerator();
const tags = generator.generateTags('Fire Aspect');
assert(tags.includes('fire'));
```

### Integration Tests
```javascript
// Test services together
import { fusionCalculator } from './services/FusionCalculator.js';
import { mutationService } from './services/MutationService.js';

const mutation = mutationService.determineMutation(state, context);
const result = fusionCalculator.calculate(aspects, state, { ...context, mutation });
```

## Migration Checklist for Developers

- [x] Phase 1: Config extraction (data separated)
- [x] Phase 2: Utility classes (tools separated)
- [x] Phase 3: Service layer (business logic separated)
- [ ] Phase 4: Add unit tests for utilities and services
- [ ] Phase 5: Convert old code to use new structure directly
- [ ] Phase 6: Remove deprecated wrapper functions

## Common Patterns

### Pattern 1: Adding Game Data
**Location**: `/backend/config/`
**Files**: `aspectTags.js`, `synergies.js`, `mutations.js`, `environments.js`, `nameGeneration.js`
**Reason**: Data changes shouldn't require code changes

### Pattern 2: Reusable Tools
**Location**: `/backend/utils/`
**Examples**: `TagGenerator`, `SynergyFinder`, `NameGenerator`
**Reason**: Can be used anywhere, tested in isolation

### Pattern 3: Business Logic
**Location**: `/backend/services/`
**Examples**: `FusionCalculator`, `MutationService`, `AspectService`
**Reason**: Encapsulates complex rules, stateless where possible

## FAQs

**Q: Will this break my existing code?**  
A: No! All old exports still exist as compatibility wrappers.

**Q: Should I use the new classes or old functions?**  
A: New code should use classes directly. Old code can migrate gradually.

**Q: Where do I add new game data?**  
A: In the appropriate file under `/backend/config/`

**Q: Can I still use `import { calculateFusion } from './fusionEngine.js'`?**  
A: Yes, but it's deprecated. Use `fusionCalculator.calculate()` instead.

**Q: How do I test a specific component?**  
A: Import it directly from its module and test it in isolation.

## Performance Notes

- **Caching**: TagGenerator includes a cache (1000 item limit)
- **No overhead**: Services are singletons, created once
- **Same performance**: Just better organized, not slower

## Further Reading

- [ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md) - Detailed architecture analysis
- [DEVELOPMENT.md](../DEVELOPMENT.md) - Developer guide
- [README.md](../README.md) - Quick start guide

---

**Questions or issues?** Check the architecture review document or ask the team.
