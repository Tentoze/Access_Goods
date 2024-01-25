type ImageObject = {
    id: number;
    image: string;
}

class ItemDto {
    images: ImageObject[];
    categoryId: number;
    name: string;
    pricePerDay: number;
    rating: number;
    accountFirstName: string;
    accountLastName: string;
    accountImage: string;
    itemId: number;
    accountId: number;
    description: string;
    latitude: number;
    longitude: number;
    locationName: number;
    isActive: boolean;

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
        description: string,
        categoryId: number,
        latitude: number,
        longitude: number,
        locationName: number,
        isActive: boolean
    ) {
        this
            .categoryId = categoryId
        this
            .images = images
        this
            .name = name
        this
            .pricePerDay = pricePerDay
        this
            .rating = rating
        this
            .accountFirstName = accountFirstName
        this
            .accountLastName = accountLastName
        this
            .accountImage = accountImage
        this
            .itemId = id
        this
            .accountId = accountId
        this
            .description = description
        this
            .latitude = latitude
        this
            .longitude = longitude
        this
            .locationName = locationName
        this.isActive = isActive
    }
}

export default ItemDto;
