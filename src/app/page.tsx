'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Flame, Droplets, Ghost, Sword, Shield, Star, Plus, RefreshCw, Book, TrendingUp, Target, Eye, AlertTriangle } from 'lucide-react';

// Types
interface GameState {
  character: {
    name: string;
    level: number;
    experience: number;
    experienceToNext: number;
  };
  stats: {
    dominance: number;
    control: number;
    awareness: number;
    vitality: number;
  };
  abilities: {
    cores: Core[];
    aspects: Aspect[];
  };
  story: StorySegment[];
  currentScene?: string;
}

interface Core {
  name: string;
  essence: number;
  tier: number;
  mutations: string[];
  abilities: string[];
}

interface Aspect {
  id: string;
  name: string;
  power: number;
  type: string;
  description: string;
}

interface StorySegment {
  id: string;
  type: 'story' | 'fusion' | 'combat' | 'choice';
  content: string;
  timestamp: number;
  sceneImage?: string;
  choices?: string[];
}

export default function LitRPGGenerator() {
  // Game State
  const [gameState, setGameState] = useState<GameState>({
    character: {
      name: 'Abyss Walker',
      level: 1,
      experience: 0,
      experienceToNext: 100,
    },
    stats: {
      dominance: 10,
      control: 10,
      awareness: 10,
      vitality: 100,
    },
    abilities: {
      cores: [
        {
          name: 'Void Core',
          essence: 50,
          tier: 1,
          mutations: [],
          abilities: ['Shadow Touch'],
        },
      ],
      aspects: [],
    },
    story: [],
    currentScene: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [storyInput, setStoryInput] = useState('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [fusionMode, setFusionMode] = useState(false);
  const [selectedAspects, setSelectedAspects] = useState<Set<string>>(new Set());
  const storyEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll story
  useEffect(() => {
    if (storyEndRef.current) {
      storyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [gameState.story, displayedText]);

  // Typewriter effect
  useEffect(() => {
    if (generatedStory && !isTyping) {
      setIsTyping(true);
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedText(generatedStory.slice(0, index + 1));
        index++;
        if (index >= generatedStory.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 15);
      return () => clearInterval(interval);
    }
  }, [generatedStory]);

  // Generate initial aspects on mount
  useEffect(() => {
    const initialAspects: Aspect[] = [
      { id: '1', name: 'Burning Blade', power: 15, type: 'Fire', description: 'Inflicts burning damage' },
      { id: '2', name: 'Shadow Cloak', power: 12, type: 'Shadow', description: 'Grants temporary invisibility' },
      { id: '3', name: 'Lightning Strike', power: 18, type: 'Lightning', description: 'Fast electric attack' },
      { id: '4', name: 'Frost Shield', power: 14, type: 'Ice', description: 'Blocks incoming damage' },
      { id: '5', name: 'Venom Fang', power: 11, type: 'Poison', description: 'Poisons target' },
    ];
    setGameState(prev => ({
      ...prev,
      abilities: { ...prev.abilities, aspects: initialAspects },
    }));
  }, []);

  const generateStory = async (prompt: string) => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/litrpg/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          character: gameState.character,
          stats: gameState.stats,
          cores: gameState.abilities.cores,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedStory(data.story);

        const newSegment: StorySegment = {
          id: Date.now().toString(),
          type: 'story',
          content: data.story,
          timestamp: Date.now(),
          sceneImage: data.sceneImage,
          choices: data.choices,
        };

        setGameState(prev => ({
          ...prev,
          story: [...prev.story, newSegment],
          currentScene: data.sceneImage,
        }));

        // Update stats based on story
        if (data.statChanges) {
          setGameState(prev => ({
            ...prev,
            stats: { ...prev.stats, ...data.statChanges },
            character: data.levelChange
              ? {
                  ...prev.character,
                  level: prev.character.level + 1,
                  experience: 0,
                  experienceToNext: prev.character.experienceToNext * 1.5,
                }
              : prev.character,
          }));
        }
      }
    } catch (error) {
      console.error('Story generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const performFusion = async () => {
    if (selectedAspects.size < 3) return;

    const aspectsToFuse = gameState.abilities.aspects.filter(a => selectedAspects.has(a.id));
    setIsLoading(true);

    try {
      const response = await fetch('/api/litrpg/fusion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aspects: aspectsToFuse,
          cores: gameState.abilities.cores,
          mutationCount: gameState.abilities.cores.reduce((acc, core) => acc + core.mutations.length, 0),
        }),
      });

      const data = await response.json();
      if (data.success) {
        const fusionStory: StorySegment = {
          id: Date.now().toString(),
          type: 'fusion',
          content: data.fusionStory,
          timestamp: Date.now(),
          sceneImage: data.sceneImage,
        };

        // Update game state with fusion results
        setGameState(prev => ({
          ...prev,
          abilities: {
            cores: data.updatedCores,
            aspects: prev.abilities.aspects.filter(a => !selectedAspects.has(a.id)),
          },
          stats: data.statChanges ? { ...prev.stats, ...data.statChanges } : prev.stats,
          story: [...prev.story, fusionStory],
          currentScene: data.sceneImage,
        }));

        setGeneratedStory(data.fusionStory);
        setSelectedAspects(new Set());
        setFusionMode(false);
      }
    } catch (error) {
      console.error('Fusion failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAspectSelection = (aspectId: string) => {
    setSelectedAspects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(aspectId)) {
        newSet.delete(aspectId);
      } else if (newSet.size < 3) {
        newSet.add(aspectId);
      }
      return newSet;
    });
  };

  const getAbilityIcon = (type: string) => {
    switch (type) {
      case 'Fire': return <Flame className="w-4 h-4" />;
      case 'Lightning': return <Zap className="w-4 h-4" />;
      case 'Ice': return <Droplets className="w-4 h-4" />;
      case 'Shadow': return <Ghost className="w-4 h-4" />;
      case 'Poison': return <AlertTriangle className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getStatColor = (value: number) => {
    if (value < 20) return 'text-gray-400';
    if (value < 40) return 'text-green-400';
    if (value < 60) return 'text-blue-400';
    if (value < 80) return 'text-purple-400';
    return 'text-yellow-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white font-mono">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTI4LCAwLCAxMjgsIDAuMSkiLz48L3N2Zz4=')] opacity-20"></div>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto p-4 pb-24">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            ✨ VOIDVERSE RPG ✨
          </h1>
          <p className="text-purple-300 text-sm">LitRPG Story Generator with Ability Fusion Engine</p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column - Character & Abilities */}
          <div className="lg:col-span-3 space-y-4">
            {/* Character Stats */}
            <Card className="bg-slate-900/80 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  {gameState.character.name}
                </CardTitle>
                <CardDescription className="text-purple-300">
                  Level {gameState.character.level}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Experience</span>
                    <span>{gameState.character.experience} / {gameState.character.experienceToNext}</span>
                  </div>
                  <Progress
                    value={(gameState.character.experience / gameState.character.experienceToNext) * 100}
                    className="h-2 bg-slate-800"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-purple-500/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-red-400" />
                      Dominance
                    </span>
                    <span className={`font-bold ${getStatColor(gameState.stats.dominance)}`}>
                      {gameState.stats.dominance}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-400" />
                      Control
                    </span>
                    <span className={`font-bold ${getStatColor(gameState.stats.control)}`}>
                      {gameState.stats.control}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-green-400" />
                      Awareness
                    </span>
                    <span className={`font-bold ${getStatColor(gameState.stats.awareness)}`}>
                      {gameState.stats.awareness}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-pink-400" />
                      Vitality
                    </span>
                    <span className={`font-bold ${getStatColor(gameState.stats.vitality)}`}>
                      {gameState.stats.vitality}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cores Display */}
            <Card className="bg-slate-900/80 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Active Cores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-48 overflow-y-auto">
                {gameState.abilities.cores.map((core, idx) => (
                  <div key={idx} className="bg-slate-800/50 rounded-lg p-3 border border-purple-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm text-purple-300">{core.name}</span>
                      <Badge variant="outline" className="text-xs">
                        Tier {core.tier}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      Essence: <span className="text-purple-400">{core.essence}</span>
                    </div>
                    <div className="space-y-1">
                      {core.mutations.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {core.mutations.map((mutation, i) => (
                            <Badge key={i} variant="secondary" className="text-xs bg-red-500/20 text-red-300">
                              {mutation}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {core.abilities.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {core.abilities.map((ability, i) => (
                            <Badge key={i} className="text-xs bg-blue-500/20 text-blue-300">
                              {ability}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Story & Fusion */}
          <div className="lg:col-span-6 space-y-4">
            {/* Scene Image Display */}
            {gameState.currentScene && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-lg overflow-hidden border-2 border-purple-500/50 mb-4"
              >
                <img
                  src={gameState.currentScene}
                  alt="Current Scene"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </motion.div>
            )}

            {/* Story Display */}
            <Card className="bg-slate-900/80 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Book className="w-5 h-5 text-purple-400" />
                  Adventure Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96 pr-4">
                  <div className="space-y-4">
                    {gameState.story.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-500/50" />
                        <p>Your adventure awaits...</p>
                        <p className="text-sm mt-2">Generate a story to begin your journey!</p>
                      </div>
                    ) : (
                      gameState.story.map((segment) => (
                        <motion.div
                          key={segment.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-3 rounded-lg border ${
                            segment.type === 'fusion'
                              ? 'bg-red-900/20 border-red-500/30'
                              : segment.type === 'combat'
                              ? 'bg-orange-900/20 border-orange-500/30'
                              : 'bg-purple-900/20 border-purple-500/30'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className={
                                segment.type === 'fusion'
                                  ? 'bg-red-500/20 text-red-300'
                                  : segment.type === 'combat'
                                  ? 'bg-orange-500/20 text-orange-300'
                                  : 'bg-purple-500/20 text-purple-300'
                              }
                            >
                              {segment.type}
                            </Badge>
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{segment.content}</p>
                          {segment.choices && segment.choices.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {segment.choices.map((choice, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  className="w-full text-left text-xs bg-slate-800/50 border-purple-500/30 hover:bg-purple-500/20"
                                  onClick={() => generateStory(choice)}
                                >
                                  {choice}
                                </Button>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                    {generatedStory && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-3 rounded-lg border border-purple-500/50 bg-purple-900/30"
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{displayedText}</p>
                        {isTyping && (
                          <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="inline-block ml-1"
                          >
                            ▊
                          </motion.span>
                        )}
                      </motion.div>
                    )}
                  </div>
                  <div ref={storyEndRef} />
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Story Input */}
            <div className="flex gap-2">
              <Textarea
                placeholder="What do you want to do? (e.g., 'Explore the dark forest', 'Challenge the guardian')"
                value={storyInput}
                onChange={(e) => setStoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    generateStory(storyInput);
                    setStoryInput('');
                  }
                }}
                className="flex-1 bg-slate-900/80 border-purple-500/30 min-h-[80px] resize-none text-sm"
                disabled={isLoading}
              />
              <Button
                onClick={() => {
                  generateStory(storyInput);
                  setStoryInput('');
                }}
                disabled={isLoading || !storyInput.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sword className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Right Column - Abilities & Fusion */}
          <div className="lg:col-span-3 space-y-4">
            {/* Tabs for Abilities and Fusion */}
            <Tabs defaultValue="abilities" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-900/80">
                <TabsTrigger value="abilities">Aspects</TabsTrigger>
                <TabsTrigger value="fusion">Fusion</TabsTrigger>
              </TabsList>

              {/* Aspects Tab */}
              <TabsContent value="abilities" className="space-y-2">
                <Card className="bg-slate-900/80 border-purple-500/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-sm">Available Aspects</CardTitle>
                    <CardDescription className="text-xs text-gray-400">
                      Select aspects in Fusion tab to combine them
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {gameState.abilities.aspects.map((aspect) => (
                          <motion.div
                            key={aspect.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-3 bg-slate-800/50 rounded-lg border border-purple-500/20 cursor-pointer hover:border-purple-500/50 transition-colors"
                            onClick={() => toggleAspectSelection(aspect.id)}
                          >
                            <div className="flex items-center gap-2">
                              {getAbilityIcon(aspect.type)}
                              <span className="font-bold text-sm text-purple-300">{aspect.name}</span>
                              <Badge variant="outline" className="ml-auto text-xs">
                                {aspect.power}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-400">{aspect.description}</div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Fusion Tab */}
              <TabsContent value="fusion" className="space-y-2">
                <Card className="bg-slate-900/80 border-red-500/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4 text-red-400" />
                      Fusion Engine
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-400">
                      Select 3 aspects to fuse (Selected: {selectedAspects.size}/3)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {gameState.abilities.aspects.map((aspect) => (
                          <motion.div
                            key={aspect.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleAspectSelection(aspect.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              selectedAspects.has(aspect.id)
                                ? 'bg-red-900/40 border-red-500'
                                : 'bg-slate-800/50 border-purple-500/20 hover:border-purple-500/50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {selectedAspects.has(aspect.id) && <Plus className="w-4 h-4 text-red-400" />}
                              {getAbilityIcon(aspect.type)}
                              <span className="text-sm">{aspect.name}</span>
                              <Badge variant="outline" className="ml-auto text-xs">
                                {aspect.power}
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                    <Button
                      onClick={performFusion}
                      disabled={selectedAspects.size < 3 || isLoading}
                      className="w-full mt-4 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                          Fusing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Fuse Aspects
                        </>
                      )}
                    </Button>
                    <div className="mt-3 text-xs text-gray-400 space-y-1">
                      <p>Fusion Rules:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-500">
                        <li>Combine 3 aspects into 1</li>
                        <li>Base mutation chance: 15%</li>
                        <li>Each mutation +5% chance</li>
                        <li>Essence gain: Power × 1.5</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
