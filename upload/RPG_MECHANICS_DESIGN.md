# RPG Mechanic Designer & Hidden Synergies - Voidverse RPG

## Overview

This document defines the skill, ability, and magic systems for Voidverse RPG. Most mechanics are documented and balanced, but some interactions are intentionally left undocumented, allowing for emergent "broken" combinations that feel rare and exciting to discover.

**Design Philosophy**:
- 90% of skills are balanced and clearly defined
- 8% of interactions are soft-documented (hints exist)
- 2% of combinations are completely hidden and potentially broken
- Hidden synergies are unstable, situational, or have hidden costs
- The system itself doesn't acknowledge these exploits

---

## Part 1: Skill Architecture Overview

### Skill Categories

#### 1. Active Skills
**Definition**: Abilities that require conscious activation and resource expenditure

**Structure**:
```
Skill Name: [Name]
Type: Active
Cost: [Mana/Soul Force/Essence/Cooldown]
Effect: [What it does]
Scaling: [Which stats affect power]
Unlock: [How to acquire]
```

**Example**:
```
Skill: Territorial Pulse
Type: Active
Cost: 20 Mana
Effect: Sense all entities within territory (range: 100m * Dominance)
Scaling: +5% range per Awareness point
Unlock: Core ability (Territorial Dominance), Level 5
```

**Characteristics**:
- Immediate, controlled effects
- Clear resource costs
- Cooldowns prevent spam
- Visible in skill list

---

#### 2. Passive Skills
**Definition**: Always-active abilities that provide constant benefits

**Structure**:
```
Skill Name: [Name]
Type: Passive
Effect: [Constant benefit]
Condition: [Active when...]
Unlock: [How to acquire]
```

**Example**:
```
Skill: Sovereign Presence
Type: Passive
Effect: +2 Dominance when in personal territory
Condition: Always active in territory
Unlock: Bloodline trait (Sovereign)
```

**Characteristics**:
- No resource cost
- Cannot be toggled off
- Often conditional (location, time, health threshold)
- Can stack with other passives

---

#### 3. Conditional Skills
**Definition**: Abilities that trigger automatically when specific conditions are met

**Structure**:
```
Skill Name: [Name]
Type: Conditional
Trigger: [When does it activate]
Effect: [What happens]
Cost: [If any]
Unlock: [How to acquire]
```

**Example**:
```
Skill: Predator's Reflex
Type: Conditional
Trigger: Enemy attacks from behind
Effect: Automatic dodge + counter (50% damage)
Cost: 10 Mana (auto-deducted)
Unlock: Mutation (acquired through fusion)
```

**Characteristics**:
- Automatic activation
- No player input required (can't be controlled)
- Often defensive or reactive
- Can trigger at inconvenient times

---

#### 4. Reactive Skills
**Definition**: Abilities that respond to specific actions (player or enemy)

**Structure**:
```
Skill Name: [Name]
Type: Reactive
React To: [What triggers response]
Effect: [Response action]
Window: [Time frame to activate]
Cost: [Resource cost]
Unlock: [How to acquire]
```

**Example**:
```
Skill: Aura Parry
Type: Reactive
React To: Incoming magical attack
Effect: Reflect 30% of damage back to attacker
Window: 0.5 seconds after attack begins
Cost: 15 Soul Force
Unlock: Awareness 15+, Quest "Mirror's Edge"
```

**Characteristics**:
- Requires player awareness
- Timing-dependent
- Higher skill ceiling than passive
- Powerful when mastered

---

### Skill Tiers

**Tier 0 (Basic)**: Universal, anyone can learn  
- Low power, low cost
- No prerequisites
- Examples: Basic strike, simple mana manipulation

**Tier 1 (Trained)**: Requires training or system unlocks  
- Moderate power, moderate cost
- Prerequisites: Level 5+, some stat requirements
- Examples: Territorial Pulse, Aura Manipulation

**Tier 2 (Advanced)**: Requires specialization  
- High power, high cost
- Prerequisites: Level 15+, multiple stat requirements, quest completion
- Examples: Domain Expansion, Shadow Step

**Tier 3 (Master)**: Peak of normal capability  
- Very high power, very high cost
- Prerequisites: Level 30+, achievement unlocks, rare items
- Examples: Reality Anchor, Soul Fusion

**Tier 4 (Transcendent)**: Beyond normal limits  
- Game-changing effects, extreme costs
- Prerequisites: Level 50+, specific story events, system evolution
- Examples: Void Walk, Essence Rewrite

**Tier 5 (Mythic)**: World-shaking abilities  
- Reality-altering, potentially permanent costs
- Prerequisites: Endgame content only
- Examples: System Override, Multiversal Shift

---

## Part 2: Magic & Ability Rule Foundation

### Core Magic Systems

#### 1. Mana-Based Magic (Standard System)
**Source**: Ambient energy in the environment  
**How It Works**:
- User channels mana through their system
- System converts mana into desired effect
- Cost = complexity of effect
- Regeneration: 5 MP/minute at rest

**Limitations**:
- Mana pools are finite (50-500 based on level)
- Dead zones = no mana available
- Over-casting = exhaustion or damage

**Example Spells**:
- Fireball (20 MP): Standard attack spell
- Shield (15 MP/sec): Defensive barrier
- Mana Sense (5 MP): Detect magic in area

---

#### 2. Soul Force Magic (Internal System)
**Source**: User's life energy and willpower  
**How It Works**:
- Soul Force represents spiritual strength
- More stable than mana (doesn't deplete in dead zones)
- Slower regeneration: 1 SF/hour

**Limitations**:
- Using Soul Force is exhausting (affects stamina)
- Depleting to 0 = unconsciousness
- Harder to increase than mana

**Example Abilities**:
- Willpower Strike (10 SF): Ignores physical armor
- Soul Anchor (20 SF): Resist mind control
- Vital Surge (30 SF): Temporary HP boost

---

#### 3. Essence Magic (Permanent System)
**Source**: Condensed power from fusions  
**How It Works**:
- Essence is stored in cores
- Can be spent on permanent upgrades
- Does NOT regenerate naturally

**Limitations**:
- Essence is extremely valuable
- Spending it is permanent
- Hard to acquire (fusion/achievements only)

**Example Uses**:
- Tier Upgrade (500 Essence): Increase core tier
- Mutation Stabilization (200 Essence): Lock in beneficial mutation
- Skill Evolution (300 Essence): Upgrade skill to next tier

---

#### 4. Bloodline Magic (Inherent System)
**Source**: Genetic/spiritual heritage  
**How It Works**:
- Certain abilities come from bloodline
- No resource cost (passive always-on effects)
- Cannot be learned, only inherited

**Limitations**:
- Cannot be changed (without evolution)
- May have hidden drawbacks
- Strength tied to bloodline purity

**Example Abilities**:
- Sovereign Territory Bonus (+Dominance in territory)
- Predatory Instinct (danger sense)
- Void Affinity (resistance to void damage)

---

### Magic Costs & Backlash

#### Resource Exhaustion
**Mana Exhaustion** (0 MP):
- Spells fail
- Skills become unavailable
- HP regeneration slows 50%

**Soul Force Depletion** (0 SF):
- Unconsciousness
- Cannot use willpower-based abilities
- Vulnerability to mental attacks

**Essence Bankruptcy** (0 Essence):
- Cannot upgrade or evolve
- Stuck at current power level
- No immediate danger, just stagnation

#### Overcasting Penalties
**Casting Beyond Available Resources**:
- Possible with high Awareness (system override)
- Draws from HP/Vitality instead
- 1:10 ratio (1 HP = 10 MP emergency)
- Causes "Mana Burn" status effect

**Mana Burn**:
- -50% max MP for 24 hours
- All spells cost +50% more
- Risk of permanent MP reduction

#### Backlash Events
**When They Occur**:
- Casting Tier 3+ spells with low Control stat
- System instability during spellcasting
- Attempting spells above skill level

**Effects**:
- Spell misfires (wrong target, wrong effect)
- Damage to caster
- Environmental destruction
- Permanent stat damage (rare)

---

## Part 3: Interaction & Stacking Logic

### Standard Interaction Rules

#### Skill Stacking
**Same Skill Multiple Times**: Does NOT stack  
- Using "Shield" twice doesn't double defense
- Only refreshes duration

**Different Skills, Same Effect**: Additive stacking (diminishing returns)  
- Shield (50% reduction) + Armor (30% reduction) = 65% total (not 80%)
- Formula: Total = 1 - (1 - A) * (1 - B) * diminishing factor
- Diminishing factor: 0.9 for 2 effects, 0.8 for 3, 0.7 for 4+

**Passive Skill Stacking**: Additive up to cap  
- +2 Dominance from Title + +2 from Bloodline = +4 total
- Caps exist per stat (usually 2x base value)

---

#### Buff/Debuff Interactions

**Buff Stacking**:
- Multiple buffs of same type: Best effect only
- Different buff types: All apply
- Example: +10% damage (buff A) + +15% damage (buff B) = only +15% applies

**Buff/Debuff Cancellation**:
- Opposing effects cancel proportionally
- +20% speed buff vs -30% speed debuff = -10% speed net

---

#### Elemental Interactions
**Standard Relationships**:
- Fire > Ice > Wind > Earth > Lightning > Water > Fire
- Using advantage = +25% damage
- Using disadvantage = -25% damage

**Combination Effects** (Advanced):
- Fire + Wind = Firestorm (area effect)
- Water + Lightning = Electrocution (paralysis)
- Ice + Earth = Frozen Ground (movement lockdown)

**Requirement**: Must cast both spells within 3 seconds

---

#### Mutation Stacking
**Multiple Mutations on Same Core**: All apply  
- No limit except mutation cap (10 per core)
- Synergies possible (see Hidden Synergies)

**Mutation Conflicts**:
- Some mutations are incompatible (system warns)
- Example: "Frenzy" (lose control) + "Precise Strike" (requires control) = conflict
- Result: Both active but weakened (50% effectiveness each)

---

## Part 4: Hidden Synergy Design Philosophy

### Why Hidden Synergies Exist

**Design Goals**:
1. Reward experimentation and discovery
2. Create "wow" moments when found
3. Prevent solved meta (wikis can't document randomness)
4. Make players feel clever
5. Add replayability (different builds discover different synergies)

**Implementation Rules**:
- Hidden synergies are NOT in skill descriptions
- System doesn't acknowledge them
- They emerge from rule interactions, not explicit design
- They're often situational or have hidden costs
- They can be nerfed if discovered (system "patches")

---

### Types of Hidden Synergies

#### Type 1: Stat Overflow Synergies
**How They Work**: Stacking bonuses past intended caps triggers unintended effects

**Example**:
- Dominance cap: 50
- Player uses: Title (+5) + Territory Bonus (+5) + Bloodline (+3) + Equipment (+10) + Temporary Buff (+15)
- Total: 88 Dominance (38 over cap)
- **Hidden Effect**: System overflow causes "Absolute Authority" state
  - All entities within 10m forced to submit (bypasses will saves)
  - Duration: 10 seconds
  - Cost: All Soul Force
  - Side Effect: Intense headache, -50% Awareness for 1 hour

**Why It's Broken**:
- Bypasses resistance mechanics entirely
- Can instant-win some encounters

**Why It's Balanced**:
- Requires specific item/buff combo (hard to maintain)
- Very short duration
- Massive side effect cost
- Situational (useless against non-sentient enemies)

---

#### Type 2: Cross-System Resonance
**How They Work**: Combining magic systems in unintended ways

**Example**:
- Soul Force ability: "Vital Surge" (spend 30 SF for +100 temporary HP)
- Mana ability: "Life Steal" (convert damage to HP, 10 MP cost)
- **Hidden Synergy**: Casting both simultaneously causes "Vampiric Overdrive"
  - Damage dealt = heals you + damages enemy
  - Healed HP exceeds max HP, converting to temporary Soul Force
  - Conversion rate: 10 HP = 1 SF
  - Duration: Until temporary HP depleted

**Why It's Broken**:
- Converts common resource (HP) into rare resource (SF)
- Can spam to refill Soul Force mid-combat

**Why It's Balanced**:
- Requires continuous combat to maintain
- If damage stops, temporary HP decays (5 HP/sec)
- Overhealing past double max HP causes "Blood Curse" (DoT)
- Very mana-intensive (10 MP per second to maintain)

---

#### Type 3: Mutation Resonance
**How They Work**: Specific mutation pairs create emergent abilities

**Example**:
- Mutation A: "Shadow Step" (short-range teleport in territory)
- Mutation B: "Predator's Senses" (see through obstacles)
- **Hidden Synergy**: "Shadow Hunt"
  - Can teleport to ANY location within sensing range (not just territory)
  - No mana cost if target is unaware of player
  - Arrival is silent and invisible for 2 seconds
  - After use: leaves shadow "echo" at start point (10 sec duration)

**Why It's Broken**:
- Essentially a free, long-range, invisible teleport
- Perfect assassination tool

**Why It's Balanced**:
- Shadow echo reveals where you teleported FROM (enemies can track you)
- If target becomes aware mid-teleport, you appear stunned (3 sec)
- Extended use (3+ times in 1 minute) causes "Shadow Sickness"
  - Max vitality reduced by 10% (permanent until rest)
  - Vision becomes shadowy and unreliable
- Only works once per target (they "learn" your pattern)

---

#### Type 4: Equipment Exploit Chains
**How They Work**: Item interactions create multiplicative loops

**Example**:
- Item 1: "Essence Accumulator" (1% of damage dealt → essence)
- Item 2: "Berserker's Rage" (spend 10 HP → +50% damage for 10 sec)
- Item 3: "Blood-Forged Armor" (HP loss → temporary Strength boost)
- **Hidden Synergy**: "Essence Siphon Loop"
  - Damage yourself with Berserker's Rage
  - Blood-Forged Armor converts HP loss to Strength
  - Higher Strength = more damage
  - Essence Accumulator converts damage to essence
  - Essence can be used to heal (via shop items)
  - Loop continues

**Why It's Broken**:
- Infinite essence generation (in theory)
- Converts HP → Essence → HP in a cycle

**Why It's Balanced**:
- Requires all 3 items equipped (expensive, opportunity cost)
- Each cycle takes time (10 sec Berserker duration)
- Essence Accumulator gives 1% (need 10,000 damage for 100 essence)
- Blood-Forged Armor has stacking diminishing returns (first loss +5 Str, 10th loss +1 Str)
- After 5 loops, system flags it as "Anomalous Activity" and increases shop prices 500%
- If persisted, system may "patch" the interaction (items stop working together)

---

#### Type 5: Environmental Exploits
**How They Work**: Using environment + abilities in creative ways

**Example**:
- Ability: "Territorial Pulse" (sense entities in territory)
- Environment: Dead zone (no mana, system weakened)
- **Hidden Synergy**: "Blind Spot"
  - In dead zones, Territorial Pulse uses Soul Force instead of Mana
  - Soul Force version detects "absences" (where things SHOULD be but aren't)
  - Can detect invisible, phased, or dimension-shifted entities
  - Range reduced to 10m but ignores all stealth

**Why It's Broken**:
- Perfect counter to invisibility/stealth
- Works in dead zones where most magic fails

**Why It's Balanced**:
- Only works in dead zones (player also weakened there)
- Soul Force cost is high (20 SF per pulse)
- Detecting doesn't mean you can affect (invisible enemies still invisible)
- Requires player to intentionally go to dead zone (risky)

---

#### Type 6: Timing-Based Glitches
**How They Work**: Frame-perfect or near-perfect timing exploits

**Example**:
- Skill: "Aura Parry" (reactive, reflects magic)
- System Glitch: Animation cancel window (0.1 seconds)
- **Hidden Synergy**: "Infinite Reflect"
  - If Aura Parry is activated and cancelled in 0.1 sec window
  - It refunds the Soul Force cost but effect lingers (1 sec)
  - Can be chained: Activate → Cancel → Activate → Cancel
  - Result: Constant magic reflection with no cost

**Why It's Broken**:
- Essentially invincibility against magic
- No resource drain

**Why It's Balanced**:
- Requires frame-perfect timing (0.1 sec window)
- Extremely difficult to execute consistently
- If mistimed, wastes Soul Force (15 SF per attempt)
- System detects repeated animation cancels and slows response time (lag)
- After 10 successful chains, system forcibly reboots (5 sec downtime, vulnerability)

---

## Part 5: Examples of Undocumented Broken Combinations

### Combination 1: "Essence Overcharge"
**Components**:
- Mutation: "Essence Conduit" (channeling essence increases spell power)
- Skill: "Mana Burn" (sacrifice HP for MP at 1:10 ratio)
- Title: "Reckless Gambler" (+50% crit chance at <25% HP)

**The Exploit**:
1. Spend essence to activate Essence Conduit (normally: +10% spell power per 10 essence spent)
2. Drop HP below 25% using Mana Burn
3. Reckless Gambler triggers (+50% crit chance)
4. Cast any spell with the boosted power + high crit chance
5. **Hidden Interaction**: Essence Conduit at low HP applies multiplicatively, not additively
   - Normal: 100 damage + 10% = 110 damage
   - At <25% HP: 100 damage * 1.1 * 1.5 (crit) * 2.0 (low HP bonus) = 330 damage

**Why It's Broken**:
- Can one-shot enemies far above player's level

**Hidden Costs**:
- Using this burns 1% max essence permanently (not displayed)
- After 10 uses, player's essence core develops "Fracture" mutation
  - All future essence gains reduced by 50%
  - Casting spells has 5% chance to cause essence leak (lose 10 essence)
- System eventually flags player as "Anomalous" and increases enemy awareness

**Discovery Method**: Pure luck or desperation play at low HP

---

### Combination 2: "Sovereign's Paradox"
**Components**:
- Bloodline: Sovereign (bonuses in territory)
- Skill: "Void Walk" (Tier 4, teleport anywhere you've been)
- Mutation: "Spatial Memory" (remember exact coordinates of visited locations)

**The Exploit**:
1. Establish small territories in multiple locations
2. Use Void Walk to teleport between them instantly
3. **Hidden Interaction**: System treats rapid territory switches as "superposition"
   - For 3 seconds after teleport, player exists in ALL territories simultaneously
   - Bonuses stack: If 5 territories, +10 Dominance from each = +50 total
   - Player effectively becomes untouchable (in 5 places at once)

**Why It's Broken**:
- Stacking territory bonuses was never intended
- Makes player nearly god-tier for 3 seconds

**Hidden Costs**:
- Each use costs 50 Soul Force (steep)
- Superposition state is unstable: 10% chance per second to "collapse" wrong location
  - If collapse fails, player teleports to random territory (possibly dangerous)
- Frequent use causes "Spatial Fragmentation"
  - Random involuntary teleports
  - May teleport mid-combat or mid-conversation
  - Eventually: player becomes "unstuck" from reality (bad end)

**Discovery Method**: High-level play, extensive territory network required

---

### Combination 3: "Soul Echo"
**Components**:
- Skill: "Vital Surge" (spend SF for temporary HP)
- Mutation: "Regeneration" (passive HP regen)
- Equipment: "Echo Stone" (duplicates last action with 50% effect)

**The Exploit**:
1. Use Vital Surge to gain +100 temporary HP (costs 30 SF)
2. Regeneration ticks, healing temporary HP loss
3. Echo Stone activates, casting Vital Surge again (15 SF cost, +50 HP)
4. **Hidden Interaction**: Regeneration healing temporary HP converts it to real HP
   - Normally temporary HP can't be healed
   - But Regeneration ignores this rule (bug)
   - Temporary HP "solidifies" into permanent HP
5. Result: Infinite HP generation (capped at 3x max HP)

**Why It's Broken**:
- Become unkillable in prolonged fights
- HP pool grows beyond intended limits

**Hidden Costs**:
- Exceeding 2x max HP causes "Hypertrophy"
  - Movement speed reduced 50%
  - Larger hitbox (easier to hit)
  - Constant hunger (need to eat frequently or lose HP)
- At 3x max HP, body begins to reject excess vitality
  - Random HP loss (10-50 per minute)
  - Risk of "Vital Rupture" (instant death if HP drops to 0 from full)
- Echo Stone has 1% chance per use to shatter (permanently lost)

**Discovery Method**: Accidental during boss fight with long duration

---

### Combination 4: "System Hijack"
**Components**:
- Title: "Glitch Exploiter" (earned by triggering 10 system glitches)
- Skill: "Override Command" (Tier 3, force system to execute specific action)
- Mutation: "System Affinity" (faster system response time)

**The Exploit**:
1. Trigger system instability (force glitches intentionally)
2. During glitch window (system lagging), use Override Command
3. **Hidden Interaction**: Unstable system accepts commands it normally wouldn't
   - Can force system to unlock features early
   - Can duplicate items (tell system to "spawn" item you already have)
   - Can modify quest rewards retroactively
4. With System Affinity, response time is fast enough to execute before system stabilizes

**Why It's Broken**:
- Essentially a cheat code
- Can break game economy (duplicate rare items)
- Can unlock endgame content early

**Hidden Costs**:
- Each successful hijack adds 1 "Glitch Scar" permanently
  - 3+ scars: System becomes hostile (sabotages player)
  - 5+ scars: System attempts to purge itself (kills host)
- Items/features gained this way are "corrupted"
  - Duplicated items have 50% chance to vanish randomly
  - Early-unlocked features may malfunction
- System learns: Each hijack makes future attempts harder (requires more instability)
- If discovered by NPCs, player is hunted as "System Corruptor"

**Discovery Method**: Extremely rare, requires deep system knowledge + specific title

---

### Combination 5: "Temporal Flux"
**Components**:
- Mutation: "Accelerated Perception" (time seems slower to player)
- Skill: "Haste" (increases action speed 200%)
- Conditional Skill: "Counter Strike" (auto-attack on dodge)

**The Exploit**:
1. Activate Haste (action speed doubled)
2. Accelerated Perception makes this feel like 4x speed
3. Dodge incoming attack → Counter Strike triggers
4. **Hidden Interaction**: Counter Strike during Haste state triggers multiple times
   - System calculates counter once per "frame"
   - Haste increases frame rate
   - Result: Single counter becomes 10-20 hits in one second
5. Each hit has chance to trigger other conditionals (cascading effect)

**Why It's Broken**:
- One counter can delete an enemy in 1 second
- Feels like time manipulation (not supposed to exist)

**Hidden Costs**:
- Accelerated Perception + Haste causes "Temporal Strain"
  - After effect ends, player moves at 50% speed for 10 seconds (time debt)
  - Repeated use causes "Chronological Desync"
    - Player ages faster (1 hour = 2 hours of aging)
    - Max HP slowly decreases
    - Eventually: player becomes "temporally unstable" (random slowdowns/speedups)
- Enemies adapted to this (high-level NPCs have "temporal resistance")
- System may "patch" if overused (reduces Haste effect)

**Discovery Method**: Mid-game, specific mutation + skill combo

---

## Part 6: Narrative Implications of Accidental God-Tier Power

### How Hidden Synergies Affect Story

#### Scenario 1: Player Discovers Broken Combo Early
**Story Response**:
- NPCs notice player's sudden power spike
- Rumors spread ("How is she so strong?")
- Powerful factions investigate (recruitment or elimination)
- System itself becomes curious/concerned

**Narrative Branching**:
- Path A: Hide the power (become mysterious figure)
- Path B: Flaunt it (become target)
- Path C: Research it (uncover deeper system secrets)

#### Scenario 2: Combo Has Terrible Hidden Cost
**Story Response**:
- Player grows powerful but starts showing side effects
- NPCs notice mutations, instability, or erratic behavior
- System issues warnings (too late)
- Player must choose: continue using combo (power) or stop (safety)

**Narrative Weight**:
- "Faustian bargain" arc
- Power vs. humanity themes
- Potential redemption quest (fix the damage)

#### Scenario 3: System Patches the Exploit
**Story Response**:
- Mid-story, the combo stops working
- System message: "Anomalous interaction corrected"
- Player forced to adapt (learn new strategies)
- NPCs who relied on player's power feel betrayed

**Narrative Function**:
- Prevents single-strategy dominance
- Forces character growth
- Shows system is "alive" and learning

#### Scenario 4: Exploit Becomes Plot-Critical
**Story Response**:
- Final boss is immune to normal damage
- Only the broken combo can hurt it
- Player must risk using unstable power to win
- Success, but at what cost?

**Narrative Payoff**:
- Hidden synergy becomes Chekhov's gun
- Validates player's experimentation
- Creates memorable climax

---

### The Meta-Game

#### Community Discovery
**In Real World**:
- Players share discoveries on forums/wikis
- Some combos become "famous" before devs can patch
- Speedrun community exploits hidden synergies

**Developer Response**:
- Gentle nerfs (not removal, just balancing)
- Introduce new counters (enemies resistant to known exploits)
- Create new hidden synergies (keep discovery alive)

**In-Universe Explanation**:
- System is learning from users
- Widely-known exploits become "patched" (system adapts)
- Rare/unique combinations remain powerful (system doesn't detect them)

---

## Part 7: Design Summary

### What Makes This System Work

1. **90% Clarity**: Most skills are documented, learnable, balanced
2. **8% Hints**: Some interactions are hinted at (reward keen observation)
3. **2% Mystery**: True hidden synergies feel magical when found
4. **Instability**: Broken combos are unstable, situational, or costly
5. **Adaptation**: System learns and patches (keeps meta fluid)
6. **Narrative Integration**: Exploits become story elements, not just mechanics

### Player Experience Goals

- **Experimentation Rewards**: Trying weird combos can pay off
- **Discovery Joy**: "I can't believe that worked!" moments
- **Risk/Reward**: Power comes with cost
- **Clever Play**: Outsmarting the system feels good
- **No Permanent Meta**: What's broken today may not work tomorrow

### The Hidden Philosophy

The system is designed to feel like a living entity—one that can be learned, exploited, and even fooled. By intentionally leaving gaps in documentation and adding hidden costs, we create a world where:

- **Power is earned through discovery, not just grinding**
- **Broken builds feel special, not standard**
- **The system is a character, not just UI**
- **Players can be clever and feel rewarded for it**

But most importantly: **The system doesn't tell you everything, and neither does this document.** There are synergies even the designer hasn't fully documented, waiting to emerge from the complex interaction of hundreds of rules.

And that's exactly how it should be.

---

## Closing Note

This document describes the mechanical architecture of Voidverse RPG's skill and magic systems, along with the philosophy behind hidden synergies. The goal is not to create a solved game, but a living world where discovery remains possible even after hundreds of hours of play.

Most skills are balanced. Some interactions are powerful. A few combinations are broken—but finding them, using them, and living with the consequences is part of the story.

The system is not your enemy. It's not your friend. It's a tool, a puzzle, and sometimes... a trap.

Good luck.
