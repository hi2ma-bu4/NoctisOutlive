// src/game/bosses/GoblinLeader.ts
import { BaseBoss } from '../BaseBoss';
import { BossSpawn } from '../data/StageData';
import * as PIXI from 'pixi.js';

export class GoblinLeader extends BaseBoss {
    private summonCooldown: number = 10 * 60; // 10 seconds

    constructor(enemyType: string, id: number, bossData: BossSpawn, spawnEnemyCallback: (enemyType: string, position: PIXI.Point) => void) {
        super(enemyType, id, bossData, spawnEnemyCallback);
    }

    protected override useAbility(ability: string, playerPosition: PIXI.Point): void {
        if (ability === 'summon_goblin' && this.abilityCooldowns.get(ability)! <= 0) {
            console.log(`${this.stats.name} uses Summon Goblin!`);

            const spawnCount = 3;
            for (let i = 0; i < spawnCount; i++) {
                // Spawn goblins in a semi-circle behind the leader
                const angle = (Math.PI / 4) * (i - 1); // -45, 0, 45 degrees
                const spawnPos = new PIXI.Point(
                    this.x + Math.cos(angle) * 100,
                    this.y + Math.sin(angle) * 100
                );
                this.spawnEnemyCallback('goblin', spawnPos);
            }

            this.abilityCooldowns.set(ability, this.summonCooldown);
        }
    }
}
