// src/workers/CollisionWorker.ts

// Define types that match the main thread and Rust lib
// These must be kept in sync manually.
enum CollidableType {
    Player,
    Enemy,
    Projectile,
    ExperienceOrb,
    TreasureChest,
}

interface CollisionEvent {
    type_a: CollidableType;
    id_a: number;
    type_b: CollidableType;
    id_b: number;
}

// A type guard to ensure the imported module has the functions we expect.
type WasmCollisionModule = {
    detect_collisions: (state: any) => CollisionEvent[];
};

let wasm: WasmCollisionModule | null = null;

// The main message handler for the worker
self.onmessage = async (event: MessageEvent) => {
    // The first message should contain the path to the WASM module for initialization.
    if (event.data.type === 'init') {
        try {
            // The path is relative to the final worker script in `dist/workers`
            wasm = await import(event.data.wasmPath) as WasmCollisionModule;
            self.postMessage({ type: 'init_done' });
            console.log("Collision worker WASM module loaded successfully.");
        } catch (e) {
            console.error("Collision worker failed to load WASM:", e);
            self.postMessage({ type: 'init_error', error: e });
        }
        return;
    }

    // Subsequent messages are for collision detection.
    if (event.data.type === 'detect' && wasm) {
        try {
            const gameState = event.data.gameState;
            const results: CollisionEvent[] = wasm.detect_collisions(gameState);

            if (results.length > 0) {
                // Transferable objects could be used here for performance if needed,
                // but the result arrays are typically small.
                self.postMessage({ type: 'collisions', collisions: results });
            }
        } catch (error) {
            // If the WASM call fails, report it back to the main thread.
            console.error("Error during WASM collision detection in worker:", error);
            self.postMessage({ type: 'runtime_error', error });
        }
    }
};
