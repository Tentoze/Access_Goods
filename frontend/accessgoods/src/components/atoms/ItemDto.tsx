type ImageObject = {
    id: number;
    image: string;
}
class ItemDto {
    images: ImageObject[];
    name: string;
    pricePerDay: number;
    rating: number;
    accountFirstName: string;
    accountLastName: string;
    accountImage: string;
    itemId: number;
    accountId: number;
    description: string;

    constructor(
        images: ImageObject[],
        name: string,
        pricePerDay: number,
        rating: number,
        accountFirstName: string,
        accountLastName: string,
        accountImage: string,
        id: number,
        accountId: number,
        description: string
    ) {
        this.images = images;
        this.name = name;
        this.pricePerDay = pricePerDay;
        this.rating = rating;
        this.accountFirstName = accountFirstName;
        this.accountLastName = accountLastName;
        this.accountImage = accountImage;
        this.itemId = id
        this.accountId = accountId;
        this.description = description
    }
}

export default ItemDto;
