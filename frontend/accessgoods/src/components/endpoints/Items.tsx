import Api, {getAuthorizationHeader} from "./api";
import api from "./api";
import ItemDto from "../atoms/ItemDto";

export interface AddItemResposne {
    id: number;
    status: number;
}

export const addItem = async (
    name: string,
    description: string,
    cost: number,
    images: string[],
    categoryId: number,
    active: boolean
): Promise<AddItemResposne> => {
    try {
        const response = await Api.post('/items/add', {
            name,
            description,
            cost,
            images,
            categoryId,
            active,
        }, {
            headers: {Authorization: getAuthorizationHeader()}
        });
        return {
            id: response.data.id,
            status: response.status
        };
    } catch (error) {
        throw error;
    }
};
export const editItem = async (itemDto: ItemDto) => {
    try {
        const response = await Api.put(`/items/update/${itemDto.itemId}`, {
            name: itemDto.name,
            description: itemDto.description,
            cost: itemDto.pricePerDay,
            images: itemDto.images,
            categoryId: itemDto.categoryId,
            active: itemDto.isActive
        }, {
            headers: {Authorization: getAuthorizationHeader()}
        });
        return {
            id: response.data.id,
            status: response.status
        };
    } catch (error) {
        throw error;
    }
};

type Filters = {
    searchTerm: string;
    categoryId: number;
    sortOption: string;
    priceFrom: number;
    priceTo: number;
    verifiedUser: boolean;
    userHasPhoto: boolean;
    deliveryType: string;
    longitude: number;
    latitude: number;
    distanceInMeters: number;

};

export const searchItem = async (filters: Partial<Filters> | null) => {
    try {
        const response = await Api.get('/items/search', {
            params: filters
        });
        const itemDataList = response.data;

        const itemList: ItemDto[] = itemDataList.map((itemData: any) => {
            const {
                images,
                name,
                cost,
                avgRating,
                accountFirstName,
                accountLastName,
                accountImage,
                id,
                accountId,
                description,
                categoryId,
                latitude,
                longitude,
                locationName,
                active
            } = itemData;
            return new ItemDto(images, name, cost, avgRating, accountFirstName, accountLastName, accountImage, id, accountId, description, categoryId,
                latitude,
                longitude,
                locationName,
                active
            )
        });
        return itemList;

    } catch (error) {
        throw error;
    }
};
export const getMyItems = async () => {
    try {
        const response = await Api.get('/items/showMyItems', {
            headers: {Authorization: getAuthorizationHeader()}
        });
        const itemDataList = response.data;

        const itemList: ItemDto[] = itemDataList.map((itemData: any) => {
            const {
                images,
                name,
                cost,
                avgRating,
                accountFirstName,
                accountLastName,
                accountImage,
                id,
                accountId,
                description,
                categoryId,
                latitude,
                longitude,
                locationName,
                active
            } = itemData;
            return new ItemDto(images, name, cost, avgRating, accountFirstName, accountLastName, accountImage, id, accountId, description, categoryId,
                latitude,
                longitude,
                locationName,
                active
            )
        });
        return itemList;
    } catch (error) {
        throw error;
    }
};
export const getUserItems = async (accountId: Number) => {
    try {
        const response = await Api.get(`/items/byAccount/${accountId}`, {
        });
        const itemDataList = response.data;

        const itemList: ItemDto[] = itemDataList.map((itemData: any) => {
            const {
                images,
                name,
                cost,
                avgRating,
                accountFirstName,
                accountLastName,
                accountImage,
                id,
                accountId,
                description,
                categoryId,
                latitude,
                longitude,
                locationName,
                active
            } = itemData;
            return new ItemDto(images, name, cost, avgRating, accountFirstName, accountLastName, accountImage, id, accountId, description, categoryId,
                latitude,
                longitude,
                locationName,
                active
            )
        });
        return itemList;
    } catch (error) {
        throw error;
    }
};