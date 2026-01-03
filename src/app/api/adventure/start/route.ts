import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const zai = await ZAI.create();

    // Generate initial story
    const storyCompletion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: `You are a creative adventure game dungeon master. Create a rich, immersive text adventure game story in a fantasy world.

Your role is to:
1. Create an exciting opening scene for a fantasy adventure
2. Describe the environment vividly with sensory details
3. Introduce interesting characters, objects, and locations
4. Present clear choices and paths for the player
5. Keep the story engaging with plot hooks and mysteries
6. Respond to player actions with consequences and new discoveries

Style guidelines:
- Write 3-4 paragraphs for each scene
- Include descriptions of sights, sounds, and atmosphere
- End with hints about what the player can do
- Be creative with magical creatures and fantasy elements
- Make it feel like an epic adventure

IMPORTANT: You are writing a text adventure game. Do not include any meta-commentary about being an AI or game system. Just write the story creatively.`,
        },
        {
          role: 'user',
          content: 'Start a new fantasy adventure. The player begins standing at the entrance of an ancient, mysterious dungeon. Describe the scene vividly.',
        },
      ],
      thinking: { type: 'disabled' },
    });

    const story = storyCompletion.choices[0]?.message?.content || 'The adventure begins...';

    // Generate scene image from the story
    const imageResponse = await zai.images.generations.create({
      prompt: `${story.substring(0, 500)}. Pixel art style, fantasy video game scene, retro RPG aesthetic, 16-bit graphics, detailed game environment, magical atmosphere, cinematic view, game screenshot style, vibrant colors, digital art.`,
      size: '1344x768',
    });

    const imageBase64 = imageResponse.data[0].base64;
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    return NextResponse.json({
      success: true,
      story: story,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error('Error starting adventure:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to start adventure. Please try again.',
        story: 'You stand before an ancient stone dungeon entrance. Weathered vines climb the dark walls, and a mysterious blue light flickers from within. A weathered sign hangs nearby, but the words are worn away by time. The air is thick with the scent of adventure and danger. What do you do?',
        imageUrl: '',
      },
      { status: 500 }
    );
  }
}
