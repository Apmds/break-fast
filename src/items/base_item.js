import WorldObject from "../object/world_object.js";

class BaseItem extends WorldObject {
    constructor(position, rotation, scale) {
        super(position, rotation, scale, true);
    }

    onInteract(player) {
        // Add item to player's inventory
        player.inventory.push(this);
        
        // Remove from scene
        if (this._model && player.scene) {
            player.scene.remove(this._model);
        }
    }
}

export default BaseItem;