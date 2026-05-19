import BaseItem from "./base_item.js";

class Sunglasses extends BaseItem {
    constructor(position, rotation, scale) {
        const title = "Sunglasses";
        const description = "Cool pair of sunglasses given to you from by The Boss. A good item for the holidays.";

        super(title, description, position, rotation, scale);

        this.model = 'sunglasses';
        this.itemImage = '../assets/item_thumbnails/sunglasses.png';
    }
}

export default Sunglasses;