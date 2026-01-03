import { NextRequest, NextResponse } from 'next/server';

interface Aspect {
  id: string;
  name: string;
  power: number;
  type: string;
  description: string;
}

interface Core {
  name: string;
  essence: number;
  tier: number;
  mutations: string[];
  abilities: string[];
}

// Fusion system implementation
function calculateFusion(aspects: Aspect[], existingMutationCount: number) {
  const totalPower = aspects.reduce((sum, a) => sum + a.power, 0);
  const resultPower = Math.floor(totalPower * 0.8);
  const essenceGain = Math.floor(totalPower * 1.5);

  // Base mutation chance increases with existing mutations
  const baseMutationChance = 0.15;
  const mutationChance = baseMutationChance + (existingMutationCount * 0.05);
  const didMutate = Math.random() < mutationChance;

  // Generate synergy based on aspect types
  const aspectTypes = aspects.map(a => a.type);
  let fusionType = 'Composite';
  let fusionName = 'Fused Ability';
  let fusionDescription = 'A combination of multiple powers.';

  // Synergy logic
  if (aspectTypes.includes('Fire') && aspectTypes.includes('Lightning')) {
    fusionType = 'Plasma Storm';
    fusionName = 'Thunder Inferno';
    fusionDescription = 'Devastating plasma attacks combining fire and lightning.';
  } else if (aspectTypes.includes('Ice') && aspectTypes.includes('Shadow')) {
    fusionType = 'Void Frost';
    fusionName = 'Phantom Chill';
    fusionDescription = 'Freezes targets in absolute darkness.';
  } else if (aspectTypes.includes('Fire') && aspectTypes.includes('Ice')) {
    fusionType = 'Steam Miasma';
    fusionName = 'Scalding Mist';
    fusionDescription = 'Creates burning steam that obscures vision.';
  } else if (aspectTypes.includes('Shadow') && aspectTypes.includes('Poison')) {
    fusionType = 'Death Veil';
    fusionName = 'Venomous Shadow';
    fusionDescription = 'Shadow attacks infused with deadly toxins.';
  } else {
    // Default fusion name
    const prefixes = ['Arcane', 'Mystic', 'Ethereal', 'Primal', 'Cosmic'];
    const suffixes = ['Force', 'Burst', 'Wave', 'Storm', 'Nova'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    fusionName = `${prefix} ${suffix}`;
    fusionDescription = `A fusion of ${aspects.map(a => a.name).join(', ')}.`;
  }

  // Mutation system
  let mutation: string | null = null;
  let mutationEffect: string = '';

  if (didMutate) {
    const mutations = [
      { name: 'Overload', effect: '+20% power, 10% chance of self-damage' },
      { name: 'Efficiency', effect: '-30% resource cost, -10% power' },
      { name: 'Unstable', effect: '+50% power, causes random side effects' },
      { name: 'Resonance', effect: 'Can be cast multiple times in one turn' },
      { name: 'Echo', effect: 'Creates a delayed secondary effect' },
      { name: 'Feedback', effect: 'Deals damage to caster on use' },
      { name: 'Amplified', effect: 'All stats +5, but costs 2x essence' },
      { name: 'Volatile', effect: '+100% power, 30% chance to fail' },
    ];

    const selectedMutation = mutations[Math.floor(Math.random() * mutations.length)];
    mutation = selectedMutation.name;
    mutationEffect = selectedMutation.effect;
  }

  return {
    resultPower,
    essenceGain,
    fusionName,
    fusionType,
    fusionDescription,
    mutation,
    mutationEffect,
    didMutate,
    synergyLevel: aspectTypes.length >= 3 ? 'Perfect' : aspectTypes.length === 2 ? 'Good' : 'Basic',
  };
}

export async function POST(request: NextRequest) {
  let body: { aspects?: Aspect[]; cores?: Core[]; mutationCount?: number } = {};
  
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  try {
    const { aspects, cores, mutationCount } = body;

    if (!aspects || aspects.length < 3) {
      return NextResponse.json(
        { success: false, error: 'At least 3 aspects required for fusion' },
        { status: 400 }
      );
    }

    if (!cores || cores.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least 1 core required for fusion' },
        { status: 400 }
      );
    }

    // Calculate fusion results
    const fusionResult = calculateFusion(aspects, mutationCount || 0);

    // Generate fusion story - try AI, fall back to mock
    let fusionStory: string;
    let sceneImage: string | undefined;

    try {
      const { generateChatCompletion, generateImage } = await import('@/lib/ai-sdk');

      const fusionPrompt = `
Generate a 2-3 paragraph LitRPG fusion narrative:

Aspects being fused: ${aspects.map((a: Aspect) => a.name).join(', ')}
Types: ${aspects.map((a: Aspect) => a.type).join(', ')}
Total Power: ${aspects.reduce((sum: number, a: Aspect) => sum + a.power, 0)}

Fusion Result: ${fusionResult.fusionName} (${fusionResult.fusionType})
Power: ${fusionResult.resultPower}
${fusionResult.mutation ? `Mutation: ${fusionResult.mutation} (${fusionResult.mutationEffect})` : ''}

Write an immersive second-person narrative describing:
1. The fusion process with visual and sensory details
2. The system notification and interface reaction
3. The feeling of the new ability
4. Any side effects or warnings from the system

Format as LitRPG with system messages, stat displays, and vivid descriptions.
`;

      fusionStory = await generateChatCompletion([
        {
          role: 'system',
          content: 'You are a LitRPG fusion narrator. Write vivid, exciting descriptions of ability fusion events with system notifications, visual effects, and emotional impact.',
        },
        {
          role: 'user',
          content: fusionPrompt,
        },
      ]);

      // Generate fusion image
      const imagePrompt = `LitRPG fantasy fusion scene, pixel art style. Glowing magical energy combining three abilities: ${aspects.map((a: Aspect) => a.name).join(', ')}. Dark fantasy aesthetic, 8-bit inspired, retro gaming style. Magical particle effects, glowing core, mystical transformation.`;
      sceneImage = await generateImage(imagePrompt);
    } catch (aiError) {
      console.error('AI SDK error, using fallback fusion story:', aiError);
      fusionStory = generateFallbackFusionStory(aspects, fusionResult);
      sceneImage = undefined;
    }

    // Update cores with fusion result
    const updatedCores = cores.map((core: Core) => {
      if (core.name === 'Void Core' || core.mutations.length < 10) {
        return {
          ...core,
          essence: core.essence + fusionResult.essenceGain,
          abilities: [...core.abilities, fusionResult.fusionName],
          mutations: fusionResult.mutation ? [...core.mutations, fusionResult.mutation] : core.mutations,
        };
      }
      return core;
    });

    // Calculate stat changes based on fusion
    const statChanges = {
      control: fusionResult.mutation ? 3 : 2,
      awareness: 1,
      dominance: fusionResult.synergyLevel === 'Perfect' ? 3 : 1,
    };

    return NextResponse.json({
      success: true,
      fusionStory,
      sceneImage,
      fusionResult,
      updatedCores,
      statChanges,
    });
  } catch (error) {
    console.error('Fusion error:', error);

    // Fallback fusion calculation
    const aspects = body.aspects || [];
    const totalPower = aspects.reduce((sum: number, a: Aspect) => sum + a.power, 0);
    const essenceGain = Math.floor(totalPower * 1.5);

    return NextResponse.json(
      {
        success: true,
        fusionStory: generateFallbackFusionStory(aspects, {
          resultPower: Math.floor(totalPower * 0.8),
          essenceGain,
          fusionName: 'Arcane Fusion',
          fusionType: 'Composite',
          fusionDescription: 'A mysterious fusion of powers.',
          mutation: null,
          mutationEffect: '',
          didMutate: false,
          synergyLevel: 'Basic',
        }),
        sceneImage: undefined,
        fusionResult: {
          resultPower: Math.floor(totalPower * 0.8),
          essenceGain,
          fusionName: 'Arcane Fusion',
          fusionType: 'Composite',
          fusionDescription: 'A mysterious fusion of powers.',
          mutation: null,
          mutationEffect: '',
          didMutate: false,
          synergyLevel: 'Basic',
        },
        updatedCores: body.cores || [],
        statChanges: { control: 1, awareness: 1, dominance: 1 },
      },
      { status: 200 }
    );
  }
}

// Fallback fusion story generator
function generateFallbackFusionStory(aspects: Aspect[], fusionResult: any): string {
  const aspectNames = aspects.map(a => a.name).join(', ');
  const aspectTypes = aspects.map(a => a.type).join(', ');

  return `The fusion chamber hums with ancient power as ${aspectNames} begin to merge together. Brilliant streams of ${aspectTypes} energy intertwine, creating a mesmerizing display of magical convergence.

[System Notification]
⚡ FUSION INITIATED ⚡
Aspects: ${aspectNames}
Total Power: ${aspects.reduce((sum, a) => sum + a.power, 0)}

A blinding light fills the void, and you feel a surge of new energy coursing through your veins. The system interface flickers with arcane symbols as the fusion completes successfully.

[System Notification]
✨ FUSION COMPLETE! ✨
New Ability: ${fusionResult.fusionName} (${fusionResult.fusionType})
Power: ${fusionResult.resultPower}
Essence Gained: ${fusionResult.essenceGain}
${fusionResult.mutation ? `⚠️ MUTATION: ${fusionResult.mutation} - ${fusionResult.mutationEffect}` : ''}

You can feel the new ability settling into your Void Core, ready to be called upon when needed. Your understanding of the fusion arts deepens with every successful combination.`;
}
