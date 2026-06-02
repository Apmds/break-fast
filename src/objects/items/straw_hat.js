import BaseItem from "./base_item.js";

class StrawHat extends BaseItem {
    constructor(position, rotation, scale) {
        const title = "Straw Hat";
        const description = "A hat made of straw. The red band gives you a sense of confort...";

        super(title, description, position, rotation, scale);

        this.model = 'straw_hat';
        this.itemImage = '../assets/item_thumbnails/straw_hat.png';
    }
}

export default StrawHat;