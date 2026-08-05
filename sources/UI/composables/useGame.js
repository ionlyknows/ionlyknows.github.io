import { inject } from 'vue'

export const GAME_KEY = Symbol('game')

export function useGame()
{
    const game = inject(GAME_KEY)
    if(!game)
        throw new Error('Game has not been provided')

    return game
}
