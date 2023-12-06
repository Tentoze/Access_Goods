class Item {
    images: string[];
    name: string;
    pricePerDay: number;
    rating: number;
    userName: string;
    userImage: string;
    itemId: number;

    constructor(
        images: string[],
        name: string,
        pricePerDay: number,
        rating: number,
        userName: string,
        userImage: string,
        itemId: number
    ) {
        this.images = images;
        this.name = name;
        this.pricePerDay = pricePerDay;
        this.rating = rating;
        this.userName = userName;
        this.userImage = userImage;
        this.itemId = itemId;
    }
}

export default Item;
