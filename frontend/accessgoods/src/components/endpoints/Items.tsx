import Api from "./api";

export const addItem = async (
    category: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    photo: string
) => {
    try {
        const response = await Api.post('/register', {
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