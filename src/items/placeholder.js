import BaseItem from "./base_item.js";

class PlaceHolderItem extends BaseItem {
    constructor(position, rotation, scale) {
        const title = "Placeholder";
        const description = "A cool placeholder item. Looks like a person for some reason.";

        super(title, description, position, rotation, scale);

        this.model = 'citizen';
        this.itemImage = '../assets/textures/fiveTone.jpg';
    }
}

export default PlaceHolderItem;