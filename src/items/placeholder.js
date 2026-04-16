import WorldObject from "../utils/world_object.js";

class PlaceHolderItem extends WorldObject {
    constructor(position, rotation, scale) {
        super(position, rotation, scale, true);

        this.model = 'citizen';
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

export default PlaceHolderItem;