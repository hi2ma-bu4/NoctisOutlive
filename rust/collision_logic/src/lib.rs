// rust/collision_logic/src/lib.rs
use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

// --- Data Structures for Game Objects ---
// These structs mirror the data sent from TypeScript.

#[derive(Serialize, Deserialize)]
pub struct Point {
    pub x: f32,
    pub y: f32,
}

#[derive(Serialize, Deserialize)]
pub struct GameObject {
    pub id: u32,
    pub position: Point,
    pub radius: f32,
}

#[derive(Serialize, Deserialize)]
pub struct GameState {
    pub player: GameObject,
    pub enemies: Vec<GameObject>,
    pub projectiles: Vec<GameObject>,
    pub orbs: Vec<GameObject>,
    pub chests: Vec<GameObject>,
}

// --- Collision Result Structures ---
// These structs represent the outcomes of collision checks.

#[derive(Serialize, Deserialize, PartialEq, Eq, Hash, Clone, Copy)]
pub enum CollidableType {
    Player,
    Enemy,
    Projectile,
    ExperienceOrb,
    TreasureChest,
}

#[derive(Serialize, Deserialize)]
pub struct CollisionEvent {
    pub type_a: CollidableType,
    pub id_a: u32,
    pub type_b: CollidableType,
    pub id_b: u32,
}

// --- The main collision detection function ---

#[wasm_bindgen]
pub fn detect_collisions(state_val: JsValue) -> Result<JsValue, JsValue> {
    // Deserialize the game state from JavaScript
    let state: GameState = serde_wasm_bindgen::from_value(state_val)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;

    let mut results = Vec::new();

    // --- Collision Checks ---

    // 1. Projectiles vs Enemies
    for proj in &state.projectiles {
        for enemy in &state.enemies {
            if is_colliding(proj, enemy) {
                results.push(CollisionEvent {
                    type_a: CollidableType::Projectile,
                    id_a: proj.id,
                    type_b: CollidableType::Enemy,
                    id_b: enemy.id,
                });
            }
        }
    }

    // 2. Player vs Enemies
    for enemy in &state.enemies {
        if is_colliding(&state.player, enemy) {
            results.push(CollisionEvent {
                type_a: CollidableType::Player,
                id_a: state.player.id,
                type_b: CollidableType::Enemy,
                id_b: enemy.id,
            });
        }
    }

    // 3. Player vs Experience Orbs
    for orb in &state.orbs {
        if is_colliding(&state.player, orb) {
            results.push(CollisionEvent {
                type_a: CollidableType::Player,
                id_a: state.player.id,
                type_b: CollidableType::ExperienceOrb,
                id_b: orb.id,
            });
        }
    }

    // 4. Player vs Treasure Chests
    for chest in &state.chests {
        if is_colliding(&state.player, chest) {
            results.push(CollisionEvent {
                type_a: CollidableType::Player,
                id_a: state.player.id,
                type_b: CollidableType::TreasureChest,
                id_b: chest.id,
            });
        }
    }

    // Serialize the results back to a JavaScript value
    Ok(serde_wasm_bindgen::to_value(&results)?)
}

// Helper function for distance-based collision check
fn is_colliding(a: &GameObject, b: &GameObject) -> bool {
    let dx = a.position.x - b.position.x;
    let dy = a.position.y - b.position.y;
    let distance_sq = dx * dx + dy * dy;
    let radii_sum = a.radius + b.radius;
    distance_sq < radii_sum * radii_sum
}
