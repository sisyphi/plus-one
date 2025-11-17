export type GameState = 'menu' | 'game' | 'success' | 'guide';

export let gameState = $state<{ value: GameState }>({ value: 'menu' });
