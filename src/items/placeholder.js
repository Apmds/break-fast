import BaseItem from "./base_item.js";

class PlaceHolderItem extends BaseItem {
    constructor(position, rotation, scale) {
        super(position, rotation, scale);

        this.model = 'citizen';
    }
}

export default PlaceHolderItem;