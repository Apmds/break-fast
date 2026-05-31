import BaseItem from "./base_item.js";

class Parasol extends BaseItem {
    constructor(position, rotation, scale) {
        const title = "Parasol";
        const description = "???";

        super(title, description, position, rotation, scale);

        this.model = 'parasol';
        this.itemImage = '../assets/item_thumbnails/parasol.png';
    }
}

export default Parasol;