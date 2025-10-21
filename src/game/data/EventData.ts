// src/game/data/EventData.ts
import { ItemEffect } from './ItemData';

export interface EventChoice {
    text: string;
    description: string; // A short description of the potential outcome
    effects: ItemEffect[];
}

export interface EventData {
    id: string;
    title: string;
    mainText: string;
    choices: EventChoice[];
}

export const eventDatabase: EventData[] = [
    {
        id: 'mysterious_fountain',
        title: 'Mysterious Fountain',
        mainText: 'You find a shimmering fountain bubbling with a strange liquid. What do you do?',
        choices: [
            {
                text: 'Drink from it',
                description: 'Gain a permanent health boost.',
                effects: [{ type: 'health_increase', value: 25 }]
            },
            {
                text: 'Bottle some for later',
                description: 'Receive a random consumable item.',
                effects: [{ type: 'add_item', value: 'random_consumable' }] // Logic to handle this will be needed
            },
            {
                text: 'Leave it alone',
                description: 'Nothing happens.',
                effects: []
            }
        ]
    },
    {
        id: 'goblin_merchant',
        title: 'A Goblin Merchant',
        mainText: 'A shady goblin offers you a powerful-looking sword for a "good price".',
        choices: [
            {
                text: 'Buy it (50 G)',
                description: 'A strong but heavy weapon.',
                effects: [{ type: 'add_item', value: 'goblin_sword' }, { type: 'lose_money', value: 50 }]
            },
            {
                text: 'Decline',
                description: 'You walk away, your wallet safe.',
                effects: []
            }
        ]
    }
];
