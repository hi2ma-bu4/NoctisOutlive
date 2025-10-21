// src/core/StageManager.ts

import { StageData } from '../game/data/StageData';
import { Stages } from '../game/data/Stages';

export class StageManager {
    private static currentStage: StageData | null = null;
    private static stages: Record<string, StageData> = {};

    public static init() {
        Stages.forEach(stage => {
            this.stages[stage.id] = stage;
        });
    }

    public static setCurrentStage(stageId: string) {
        if (this.stages[stageId]) {
            this.currentStage = this.stages[stageId];
            console.log(`Stage set to: ${this.currentStage.name}`);
        } else {
            console.error(`Stage with id '${stageId}' not found.`);
        }
    }

    public static getCurrentStage(): StageData | null {
        return this.currentStage;
    }

    public static getStage(stageId: string): StageData | null {
        return this.stages[stageId] || null;
    }

    public static getAllStages(): StageData[] {
        return Object.values(this.stages);
    }
}
