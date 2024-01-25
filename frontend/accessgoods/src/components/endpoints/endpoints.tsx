import Api from "./api";
import ItemDto from "../atoms/ItemDto";
import CategoryDto from "../atoms/CategoryDto";

export const login = async (email: string, password: string) => {
    try {
        const response = await Api.post('/login', {email, password});
        const {authorizationToken} = response.data;
        localStorage.setItem('jwtToken', authorizationToken);
        return response.data;
    } catch (error) {
        throw new Error('Login failed');
    }
};
export const getItem = async (itemId: number) => {
    try {
        const response = await Api.get(`/items/${itemId}`);
        const itemData = response.data;
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
    } catch (error) {
        throw new Error('Not found');
    }
};

export const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    photo: string,
    longitude: number,
    latitude: number,
    locationName: string
) => {
    try {
        const response = await Api.post('/register', {
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            photo,
            longitude,
            latitude,
            locationName
        });
        return response.status;
    } catch (error) {
        throw new Error('Registration failed');
    }
};

