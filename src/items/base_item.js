import WorldObject from "../object/world_object.js";
import UIUtils from "../utils/ui_utils.js";

class BaseItem extends WorldObject {
    constructor(title, description, position, rotation, scale) {
        super(position, rotation, scale, true);

        this.itemImage = null;
        this.title = title;
        this.description = description;
    }

    setItemImage(value) {
        this.itemImage = value;
    }

    onInteract(player) {
        player.canMove = false;
        player.hasItem = true;

        UIUtils.showGetItemMenu(this.title, this.description, this.itemImage);

        player.inventory.push(this);

        if (this._model && player.scene) {
            player.scene.remove(this._model);
        }
    }
}

export default BaseItem;