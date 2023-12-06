import Api from "./api";

export const login = async (email: string, password: string) => {
    try {
        const response = await Api.post('/login', { email, password });
        const { authorizationToken } = response.data;
        localStorage.setItem('jwtToken', authorizationToken);
        return response.data;
    } catch (error) {
        throw new Error('Login failed');
    }
};