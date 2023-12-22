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
    categoryId: number
): Promise<AddItemResposne> => {
    try {
        const response = await Api.post('/items/add', {
            name,
            description,
            cost,
            images,
            categoryId
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
            categoryId: itemDto.categoryId
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
};

export const searchItem = async (filters: Partial<Filters> | null) => {
    try {
        const response = await Api.get('/items/search',  {
            params: filters
        });
        const itemDataList = response.data;

        const itemList: ItemDto[] = itemDataList.map((itemData: any) => {
            const {
                images,
                name,
                cost,
                rating,
                accountFirstName,
                accountLastName,
                accountImage,
                id,
                accountId,
                description,
                categoryId
            } = itemData;
            return new ItemDto(images, name, cost, rating, accountFirstName, accountLastName, accountImage, id, accountId, description, categoryId);
        });
        return itemList;

    } catch (error) {
        throw error;
    }
};
export const getMyItems = async () => {
    try {
        const response = await Api.get('/items/showMyItems',  {
            headers: {Authorization: getAuthorizationHeader()}
        });
        const itemDataList = response.data;

        const itemList: ItemDto[] = itemDataList.map((itemData: any) => {
            const {
                images,
                name,
                cost,
                rating,
                accountFirstName,
                accountLastName,
                accountImage,
                id,
                accountId,
                description,
                categoryId
            } = itemData;
            return new ItemDto(images, name, cost, rating, accountFirstName, accountLastName, accountImage, id, accountId, description, categoryId);
        });
        return itemList;
    } catch (error) {
        throw error;
    }
};