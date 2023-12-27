import Api, {getAuthorizationHeader} from "./api";
import ItemDto from "../atoms/ItemDto";

export const getUnavailableDates = async (itemId: number): Promise<Date[]> => {
    try {
        const response = await Api.get(`/rents/rentDatesByItemId/${itemId}`);
        const itemList: string[] = response.data; // Załóżmy, że wynik to lista stringów

        // Mapowanie stringów dat na obiekty typu Date
        const unavailableDates: Date[] = itemList.map((dateString: string) => new Date(dateString));

        return unavailableDates;
    } catch (error) {
        throw error;
    }
};
export const addRent = async (itemId: number, rentTime: Date, returnTime: Date) => {
    try {
        const response = await Api.post(`/rents/add`, {itemId, rentTime, returnTime}, {
            headers: {Authorization: getAuthorizationHeader()}
        });
        return response.status;
    } catch (error) {
        throw error;
    }
};
export interface Rent {
    id: number;
    itemId: number;
    itemName: string;
    itemPhoto: string;
    lendingAccountId: number;
    borrowingAccountId: number;
    totalCost: number;
    returnTime: string;
    rentTime: string;
    rentStatus: string;
}

export const getCurrentUserRents = async (): Promise<Rent[]> => {
    try {
        const response = await Api.get(`/rents/getCurrentUserRents`, {
            headers: { Authorization: getAuthorizationHeader() },
        });

        const rents: Rent[] = response.data.map((rent: Rent) => {
            const {
                id,
                itemId,
                itemName,
                itemPhoto,
                lendingAccountId,
                borrowingAccountId,
                totalCost,
                returnTime,
                rentTime,
                rentStatus,
            } = rent;

            return {
                id,
                itemId,
                itemName,
                itemPhoto,
                lendingAccountId,
                borrowingAccountId,
                totalCost,
                returnTime,
                rentTime,
                rentStatus,
            };
        });

        return rents;
    } catch (error) {
        throw error;
    }
};
export const getChangeStatusPossibilities = async (itemId: number): Promise<string[]> => {
    try {
        const response = await Api.get(`/rents/getPossibleStatusFlow/${itemId}`);
        const statusPossibilities: string[] = response.data; // Załóżmy, że wynik to lista stringów
        return statusPossibilities;
    } catch (error) {
        throw error;
    }
};