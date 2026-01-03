import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, character, stats, cores } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Try to use AI SDK, but fall back to mock if it fails
    let storyText: string;
    let sceneImage: string | undefined;

    try {
      const { generateChatCompletion, generateImage } = await import('@/lib/ai-sdk');

      // Create context from game state
      const context = `
Character: ${character.name}
Level: ${character.level}
Stats: Dominance ${stats.dominance}, Control ${stats.control}, Awareness ${stats.awareness}, Vitality ${stats.vitality}
Cores: ${cores.map((c: any) => c.name).join(', ')}

Write a LitRPG-style story segment (6-9 paragraphs, approximately 500-700 words) based on the player's action: "${prompt}"

Requirements:
- Include vivid descriptions of the environment and characters
- Show the LitRPG system interface (stats, skills, notifications)
- Create tension and meaningful choices
- Include stat gains/losses as appropriate
- Format as immersive second-person narrative
- Make the narrative detailed and engaging with rich world-building

After the story, provide EXACTLY 6 choices the player can make, numbered 1-6:
- 4 normal options (constructive, neutral, social, or understandable actions)
- 2 extreme options (bold, risky, or psychologically unusual actions)
All options must fit the current context and story situation.

End with: [STATS: dominance:+X,control:+Y,awareness:+Z] if stats change
`;

      // Generate story using LLM
      storyText = await generateChatCompletion([
        {
          role: 'system',
          content: 'You are a LitRPG story generator. Write engaging, progression-focused fantasy stories with game-like elements, stat systems, and meaningful choices. Use vivid imagery and second-person perspective.',
        },
        {
          role: 'user',
          content: context,
        },
      ]);

      // Generate scene image
      const imagePrompt = `LitRPG fantasy scene, pixel art style, ${prompt.slice(0, 50)}. Dark fantasy aesthetic with magical elements. 8-bit inspired, retro gaming style.`;
      sceneImage = await generateImage(imagePrompt);
    } catch (aiError) {
      console.error('AI SDK error, using fallback:', aiError);
      // Fallback story generation
      storyText = generateFallbackStory(prompt, character, stats, cores);
      sceneImage = undefined;
    }

    // Parse story for stat changes
    const statMatch = storyText.match(/\[STATS:\s*([^\]]+)\]/);
    let statChanges: Record<string, number> = {};
    let levelChange = false;

    if (statMatch) {
      const statsString = statMatch[1];
      const statPairs = statsString.split(',');
      statPairs.forEach((pair: string) => {
        const [stat, value] = pair.split(':');
        if (stat && value) {
          const numValue = parseInt(value.replace(/[+\-]/, ''));
          if (!isNaN(numValue)) {
            statChanges[stat.trim()] = numValue;
          }
        }
      });

      // Remove stats from story text for display
      storyText = storyText.replace(/\[STATS:\s*[^\]]+\]/g, '');
    }

    // Check for level up indication
    if (storyText.includes('[LEVEL UP]')) {
      levelChange = true;
      storyText = storyText.replace(/\[LEVEL UP\]/g, '');
    }

    // Extract choices from the story
    const choices = storyText
      .split('\n')
      .filter(line => line.trim().match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim());

    return NextResponse.json({
      success: true,
      story: storyText,
      sceneImage,
      choices,
      statChanges: Object.keys(statChanges).length > 0 ? statChanges : undefined,
      levelChange,
    });
  } catch (error) {
    console.error('Story generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate story',
        story: `You ${prompt}. The path ahead remains shrouded in mystery. What will you do next?`,
      },
      { status: 500 }
    );
  }
}

// Fallback story generator for when AI SDK fails
function generateFallbackStory(prompt: string, character: any, stats: any, cores: any): string {
  const actions = [
    'The shadows lengthen around you as you',
    'A mysterious energy pulses through your veins as you',
    'The Void Core hums with ancient power as you',
    'The air crackles with magical energy as you',
  ];
  const environments = [
    'in this forgotten realm of the Voidverse.',
    'amidst the crumbling ruins of an ancient civilization.',
    'under the watchful gaze of unseen entities.',
    'in a realm where reality bends to will alone.',
  ];
  const outcomes = [
    'You sense your connection to the Void growing stronger.',
    'The system acknowledges your progress with a chime.',
    'Your abilities resonate with newfound power.',
    'A notification flickers in your vision, indicating growth.',
  ];
  const descriptions = [
    'The ground beneath your feet trembles slightly, as if the very earth recognizes the power coursing through you. Ancient runes etched into nearby stones begin to glow with a soft violet light, responding to your presence.',
    'A cold wind sweeps across the landscape, carrying whispers of forgotten knowledge and promises of power yet to be claimed. The sky above shifts between hues of purple and crimson, painting an otherworldly scene.',
    'Your senses sharpen as you attune to the ambient magical energies. Every sound, every movement in the darkness becomes crystal clear. You can feel the pulse of life—and something else—all around you.',
  ];
  const encounters = [
    'In the distance, you spot a flickering figure—perhaps a lost spirit or another traveler in this strange dimension. The figure seems to be watching you, waiting to see what you will do next.',
    'A peculiar structure rises from the mist ahead, its architecture defying conventional logic. Doorways lead into darkness, and windows reflect images of places you have never seen.',
    'The air grows thick with magical residue, and you notice traces of a recent battle. Scorched earth and shattered crystals tell a story of conflict. Someone—or something—was here before you.',
  ];
  const systemMessages = [
    'Your Void Core resonates with the ambient energy, strengthening its connection to this plane of existence.',
    'The system detects an anomaly in the local magical field. Proceed with caution—or exploit it for your advantage.',
    'A faint pulse echoes through your consciousness, signaling the presence of a powerful artifact nearby.',
  ];

  const randomAction = actions[Math.floor(Math.random() * actions.length)];
  const randomEnv = environments[Math.floor(Math.random() * environments.length)];
  const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
  const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
  const randomEncounter = encounters[Math.floor(Math.random() * encounters.length)];
  const randomSystem = systemMessages[Math.floor(Math.random() * systemMessages.length)];

  const story = `${randomAction} ${prompt} ${randomEnv}

${randomDesc}

[System Notification]
Action Completed!
${character.name} - Level ${character.level}
Stats: Dominance ${stats.dominance}, Control ${stats.control}, Awareness ${stats.awareness}

${randomOutcome} The essence flows through you, reinforcing your connection to this strange new world. Your abilities continue to evolve, adapting to the challenges you face.

${randomEncounter}

[System Alert]
${randomSystem}

The paths before you diverge into countless possibilities. Your next choice could shape the very fabric of your destiny in the Voidverse. The power is within your grasp—how you wield it is entirely up to you.

[STATS: awareness:+2,control:+1]

Your enhanced senses pick up several paths forward:
1. Investigate the glowing artifact nearby
2. Meditate and absorb the ambient energy
3. Push deeper into the unknown territory
4. Attempt to communicate with any nearby entities
5. Channel your Void Core's power to sense hidden dangers
6. Recklessly charge toward the source of magical disturbance
`;

  return story;
}
