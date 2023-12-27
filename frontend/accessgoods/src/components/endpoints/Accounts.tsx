import Api from "./api";
import ItemDto from "../atoms/ItemDto";

export const getAccount = async (accountId: number) => {
    try {
        console.log("get account ",accountId)
        const response = await Api.get(`/accounts/${accountId}`);
        const {id,email,firstName,lastName,phoneNumber,photo} = response.data;
        return {id,email,firstName,lastName,phoneNumber,photo};
           } catch (error) {
        throw new Error('Not found');
    }
};