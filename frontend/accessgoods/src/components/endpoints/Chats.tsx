import Api, {getAuthorizationHeader} from "./api";
import CategoryDto from "../atoms/CategoryDto";

export const getChatRoomList = async () => {
    try {
        const response = await Api.get(`/chat/getChatRoomList`, {
            headers: {Authorization: getAuthorizationHeader()}
        });
        const chatRoomDataList = response.data;

        const chatRoomList: [] = chatRoomDataList.map((chatRoomData: any) => {
            const chatRoom: {
                id: number,
                itemId: number,
                itemPhoto: string,
                itemName: string,
                itemOwnerAccountId: number,
                itemOwnerAccountPhoto: string,
                itemOwnerAccountName: string,
                senderAccountId: number,
                senderAccountPhoto: string,
                senderAccountName: string,
                messageTimestamp: string,
                lastMessage: string
            } = chatRoomData
            return chatRoom;
        });
        return chatRoomList;
    } catch (error) {
        throw new Error('Not found');
    }
};
export const getChatRoomHistory = async (chatRoomId: number) => {
    try {
        const response = await Api.get(`/chat/getChatRoomHistory/${chatRoomId}`, {
            headers: {Authorization: getAuthorizationHeader()}
        });
        const chatRoomHistoryMessagesList = response.data;

        const chatRoomHistoryList: [] = chatRoomHistoryMessagesList.map((chatRoomHistory: any) => {
            const chatRoom: {
                id: number,
                content: string,
                receiverAccountId: number,
                senderAccountId: number,
                chatRoomId: number,
                messageTimestamp: string
            } = chatRoomHistory
            return chatRoom;
        });
        return chatRoomHistoryList;
    } catch (error) {
        throw new Error('Not found');
    }
};
export const sendMessage = async (chatRoomId: number, userReceiverId: number, content: string) => {
    try {
        const response = await Api.post(`/chat/sendMessage`, {
            chatRoomId,
            userReceiverId,
            content
        }, {
            headers: {Authorization: getAuthorizationHeader()}
        });
        const chatRoom: {
            id: number,
            content: string,
            receiverAccountId: number,
            senderAccountId: number,
            chatRoomId: number,
            messageTimestamp: string
        } = response.data
        return chatRoom;
    } catch (error) {
        throw new Error('Not found');
    }
};
export const createOrGetChatRoom = async (itemId: number) => {
    try {
        const response = await Api.post(`/chat/createOrGetChatRoom/${itemId}`, {
        }, {
            headers: {Authorization: getAuthorizationHeader()}
        });
        const chatRoom: {
            id: number,
            content: string,
            receiverAccountId: number,
            senderAccountId: number,
            chatRoomId: number,
            messageTimestamp: string
        } = response.data
        return response.status;
    } catch (error) {
        throw new Error('Not found');
    }
};