
export interface StageData {
    id: string;
    name: string;
    // Future properties: enemy types, boss, duration, etc.
}

export class StageManager {
    private static currentStage: StageData | null = null;
    private static stages: Record<string, StageData> = {
        'stage1': {
            id: 'stage1',
            name: 'Forest of Beginnings',
        },
        'stage2': {
            id: 'stage2',
            name: 'Cursed Highlands',
        },
    };

    public static setCurrentStage(stageId: string) {
        if (this.stages[stageId]) {
            this.currentStage = this.stages[stageId];
        } else {
            console.error(`Stage with id '${stageId}' not found.`);
        }
    }

    public static getCurrentStage(): StageData | null {
        return this.currentStage;
    }

    // Methods to get stage-specific data will be added here
}
