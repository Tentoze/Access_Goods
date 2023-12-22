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