// src/game/SampleBoss.ts

import { BaseBoss } from './BaseBoss';
import { BossSpawn } from './data/StageData';
import * as PIXI from 'pixi.js';
import { EffectManager } from '../core/EffectManager';

export class SampleBoss extends BaseBoss {

    constructor(enemyType: string, id: number, bossData: BossSpawn) {
        super(enemyType, id, bossData);
    }

    /**
     * Implement the boss's special abilities.
     */
    protected override useAbility(ability: string, playerPosition: PIXI.Point): void {
        console.log(`${this.stats.name} is using ability: ${ability}`);

        switch (ability) {
            case 'summon_minions':
                // In a real implementation, this would ask EnemyManager to spawn minions
                console.log("Summoning minions!");
                EffectManager.createExplosion(this.position, 0xFF0000); // Use a red explosion for effect
                break;
            case 'aoe_slam':
                console.log("Performing an area-of-effect slam!");
                // Create a visual effect for the slam
                EffectManager.createCircularShockwave(this.position);
                // In a real implementation, this would register a damage area with CollisionManager
                break;
        }
    }
}
