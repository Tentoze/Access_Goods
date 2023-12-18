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
    photo: string
) => {
    try {
        const response = await Api.post('/register', {
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            photo
        });
        return response.status;
    } catch (error) {
        throw new Error('Registration failed');
    }
};

