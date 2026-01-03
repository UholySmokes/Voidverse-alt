import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { command, previousScene } = await request.json();

    if (!command) {
      return NextResponse.json(
        { success: false, error: 'Command is required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // Generate story response based on player command
    const storyCompletion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: `You are a creative adventure game dungeon master running an immersive fantasy text adventure game.

Your role is to:
1. Respond naturally to player actions with consequences
2. Describe new environments vividly with sensory details
3. Introduce new challenges, puzzles, and discoveries
4. Reward creative thinking with interesting outcomes
5. Keep the story moving forward with plot developments
6. Maintain consistency with previous scenes
7. Create tension and excitement throughout the adventure

Style guidelines:
- Write 3-4 paragraphs for each response
- Describe what happens as a result of the player's action
- Include sights, sounds, smells, and atmosphere
- Introduce new elements to explore (items, NPCs, locations)
- End with hints about further actions or discoveries
- Be creative with magical effects and fantasy elements
- If the player's action doesn't make sense, describe the result or suggest alternate approaches
- Handle combat, exploration, interactions, puzzles with appropriate descriptions

IMPORTANT: Always stay in character as the adventure narrator. Never break the fourth wall or mention you're an AI. Just continue the story naturally based on their action.`,
        },
        {
          role: 'user',
          content: `Previous scene: ${previousScene}\n\nPlayer action: ${command}\n\nContinue the story based on this action. Describe what happens next.`,
        },
      ],
      thinking: { type: 'disabled' },
    });

    const story = storyCompletion.choices[0]?.message?.content || 'Something interesting happens...';

    // Generate scene image from the new story
    const imageResponse = await zai.images.generations.create({
      prompt: `${story.substring(0, 500)}. Pixel art style, fantasy video game scene, retro RPG aesthetic, 16-bit graphics, detailed game environment, magical atmosphere, cinematic view, game screenshot style, vibrant colors, digital art`,
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
    console.error('Error processing adventure action:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process action. Please try again.',
        story: 'As you take action, the dungeon seems to shift and change around you. Strange whispers echo through the corridors, and you sense that powerful magic is at work. You press forward, deeper into the unknown...',
        imageUrl: '',
      },
      { status: 500 }
    );
  }
}
