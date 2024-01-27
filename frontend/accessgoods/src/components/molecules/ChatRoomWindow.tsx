import React, {useEffect, useState} from 'react';
import {Paper, Avatar, Typography, Box, Rating} from '@mui/material';
import {deepOrange} from '@mui/material/colors';
import {getAccount} from "../endpoints/Accounts";
import {addOpinion} from "../endpoints/Opinions";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";
import {getChatRoomList} from "../endpoints/Chats";
import ChatDialog from "./ChatDialog";

interface ChatRoomWindowProps {
    chatRoom: {
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
    };
}

const ChatRoomWindow: React.FC<ChatRoomWindowProps> = ({chatRoom}) => {


    const [chatRoomWindow, setChatRoomWindow] = useState<{
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

    }>(chatRoom);
    const currentAccountId = Number(localStorage.getItem("accountId"));
    const isCurrentAccountOwner = currentAccountId === chatRoomWindow.itemOwnerAccountId;
    const [isChatDialogOpen, setIsChatDialogOpen] = useState<boolean>(false)

    return (
        <Box sx={{padding: '8px'}}>
            <Box sx={{
                mb: 2, border: '1px solid rgb(128,128,128,0.3)',
                gap: '2px',
                margin: 'auto',
                padding: '10px',
                backgroundColor: (isCurrentAccountOwner ? 'rgba(49,219,4,0.2)' : 'rgba(1, 1, 207,0.2)'),
                width: '600px',
                cursor: 'pointer',
            }} onClick={() => {
                setIsChatDialogOpen(true)
            }}>
                {/* Avatar */}
                <Box sx={{paddingBottom: '4px'}}>
                    {chatRoomWindow &&
                        <Box sx={{paddingBottom: '4px'}}>
                            <Avatar
                                src={(isCurrentAccountOwner ? chatRoomWindow.senderAccountPhoto : chatRoomWindow.itemOwnerAccountPhoto)}
                                sx={{float: 'left', bgcolor: deepOrange[500], marginRight: 2}}/>
                            <Typography sx={{float: 'left', marginRight: 2}}
                                        variant="body1"> {(isCurrentAccountOwner ? chatRoomWindow.senderAccountName : chatRoomWindow.itemOwnerAccountName)}</Typography>
                            <Avatar variant="square" src={chatRoomWindow.itemPhoto}
                                    sx={{float: 'right', bgcolor: deepOrange[500], marginRight: 2}}/>
                            <Typography sx={{float: 'right', marginRight: 2}}
                                        variant="body1"> {chatRoomWindow.itemName}</Typography>
                        </Box>

                    }
                    <br/>
                </Box>
                <br/>
                <Typography variant="body2">Ostatnia
                    wiadomość: {(chatRoomWindow.lastMessage === null ? "Brak" : chatRoomWindow.lastMessage)}</Typography>
            </Box>
            <ChatDialog open={isChatDialogOpen} onClose={() => {
                setIsChatDialogOpen(false)
            }} chatRoomInformation={chatRoomWindow}/>
        </Box>
    );


};

export default ChatRoomWindow;
