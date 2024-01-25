import Api, {getAuthorizationHeader} from "./api";
import ItemDto from "../atoms/ItemDto";

export interface AddOpinionResposne {
    id: number;
    status: number;
}
export const addOpinion = async (
    rating: number,
    description: string,
    opinionGiverAccountId: number,
    opinionReceiverAccountId: number,
    feedbackTarget: string
): Promise<AddOpinionResposne> => {
    try {
        const response = await Api.post('/opinions/add', {
            rating,
            description,
            opinionGiverAccountId,
            opinionReceiverAccountId,
            feedbackTarget
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
export const editOpinion = async (
    opinionId: number,
    rating: number,
    description: string,
    opinionGiverAccountId: number,
    opinionReceiverAccountId: number,
    feedbackTarget: string
): Promise<AddOpinionResposne> => {
    try {
        const response = await Api.put(`/opinions/update/${opinionId}`, {
            rating,
            description,
            opinionGiverAccountId,
            opinionReceiverAccountId,
            feedbackTarget
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
export const deleteOpinion = async (
    opinionId: number,
): Promise<number> => {
    try {
        const response = await Api.delete(`/opinions/delete/${opinionId}`, {
            headers: {Authorization: getAuthorizationHeader()}
        });
        return response.status;
    } catch (error) {
        throw error;
    }
};

export const getOpinionForSpecificUserAndFeedbackTarget = async (accountId: Number,feedbackTarget: string) => {
    try {
        const response = await Api.get(`/opinions/currentUserOpinionForSpecificUserAndFeedbackTarget/${accountId}/${feedbackTarget}`,  {
            headers: {Authorization: getAuthorizationHeader()}
        });
        const data: {id: number,rating: number,description: string}  = response.data;
        return data;
    } catch (error) {
        throw error;
    }
};

export const getOpinionsByAccountId = async (accountId: Number) => {
    try {
        const response = await Api.get(`/opinions/byAccount/${accountId}`,  {
        });
        const opinionDataList = response.data;

        const opinionList: [] = opinionDataList.map((itemData: any) => {
            const opinion: {
                id: number,
                rating: number,
                description: string,
                opinionGiverAccountId: number,
                opinionReceiverAccountId: number,
                feedbackTarget: string,
            } = itemData;
            return opinion;
        });
        return opinionList;
    } catch (error) {
        throw error;
    }
};