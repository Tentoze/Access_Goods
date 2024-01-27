import Api, {getAuthorizationHeader} from "./api";
import ItemDto from "../atoms/ItemDto";
import {AxiosRequestConfig, AxiosResponse} from "axios";

export const getAccount = async (accountId: number) => {
    try {
        console.log("get account ", accountId)
        const response = await Api.get(`/accounts/${accountId}`);
        const {
            id,
            email,
            firstName,
            lastName,
            phoneNumber,
            photo,
            locationName,
            latitude,
            longitude,
            avgRating
        } = response.data;
        return {id, email, firstName, lastName, phoneNumber, photo, locationName, latitude, longitude, avgRating};
    } catch (error) {
        throw new Error('Not found');
    }
};

export const updateAccountData = async (
    accountId: number,
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    photo: string,
    longitude: number,
    latitude: number,
    locationName: string
) => {
    try {
        const response = await Api.put(`/accounts/update/${accountId}`, {
            email,
            firstName,
            lastName,
            phoneNumber,
            photo,
            longitude,
            latitude,
            locationName
        }, {headers: {Authorization: getAuthorizationHeader()}});

        // Zwróć status i dane odpowiedzi, jeśli jest to odpowiedź powodzenia
        return {responseStatus: response.status, responseData: response.data};
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                responseStatus: error.response?.status ?? 500,
                responseData: error.response?.data ?? 'Internal Server Error'
            };
        } else if (isAxiosRequestError(error)) {
            throw error;
        } else {
            throw error;
        }
    }
};

// Dodaj typy dla błędów Axios
    interface AxiosError extends Error {
        isAxiosError: boolean;
        config: AxiosRequestConfig;
        code?: string;
        request?: any;
        response?: AxiosResponse;
    }

    interface AxiosRequestError extends AxiosError {
        code: undefined;
    }

    function isAxiosError(error: any): error is AxiosError {
        return error.isAxiosError === true;
    }

    function isAxiosRequestError(error: any): error is AxiosRequestError {
        return error.code === undefined;
    }