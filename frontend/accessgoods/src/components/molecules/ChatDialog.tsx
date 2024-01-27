import React, {useEffect, useRef, useState} from "react";
import {Avatar, Box, Dialog, Grid, IconButton, InputBase, Paper, TextField, Typography} from "@mui/material";
import {SendIcon} from "lucide-react";
import {getChatRoomHistory, sendMessage} from "../endpoints/Chats";
import ScrollableFeed from 'react-scrollable-feed'

interface ChatDialogProps {
    open: boolean;
    onClose: () => void;
    chatRoomInformation: {
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
    }
}

const SuccessDialog: React.FC<ChatDialogProps> = ({open, onClose, chatRoomInformation}) => {

    const currentUser = Number(localStorage.getItem("accountId"));
    const isCurrentAccountOwner = currentUser === chatRoomInformation.itemOwnerAccountId;
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<{
        id: number,
        content: string,
        receiverAccountId: number,
        senderAccountId: number,
        chatRoomId: number,
        messageTimestamp: string
    }[]>()

    useEffect(() => {

        fetchChatHistory()
    }, [chatHistory]);


    const fetchChatHistory = async () => {
        try {
            const result = await getChatRoomHistory(chatRoomInformation.id);
            setChatHistory(result)
        } catch (e) {
            console.error('Error fetching data:', e)
        }
    }

    const handleClose = () => {
        onClose();
    };
    const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const handleSendMessage = async () => {
        // Tutaj możesz dodać logikę wysyłania wiadomości
        const result = await sendMessage(chatRoomInformation.id, (isCurrentAccountOwner ? chatRoomInformation.itemOwnerAccountId : chatRoomInformation.senderAccountId), message);
        chatHistory?.push(result)
        setMessage("");
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <Box sx={{width: '550px'}}>
                <Box sx={{
                    position: 'relative',
                    backgroundColor: '#b3d8ff',
                    padding: '20px',
                    paddingBottom: '40px'
                }}>
                    <Box sx={{paddingBottom: '15px'}}>
                        <Avatar
                            src={(isCurrentAccountOwner ? chatRoomInformation.senderAccountPhoto : chatRoomInformation.itemOwnerAccountPhoto)}
                            sx={{float: 'left', marginRight: 2}}/>
                        <Typography sx={{float: 'left', marginRight: 2}}
                                    variant="body1"> {(isCurrentAccountOwner ? chatRoomInformation.senderAccountName : chatRoomInformation.itemOwnerAccountName)}</Typography>
                        <Avatar variant="square" src={chatRoomInformation.itemPhoto}
                                sx={{float: 'right', marginRight: 2}}/>
                        <Typography sx={{float: 'right', marginRight: 2}}
                                    variant="body1"> {chatRoomInformation.itemName}</Typography>
                    </Box>

                </Box>
                <Box
                    sx={{
                        position: 'relative',
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '5px',
                    }}
                >
                    <Box

                        sx={{
                            overflowY: 'auto', // Dodaj tę linijkę
                            maxHeight: '400px',
                        }}>
                        <ScrollableFeed>
                            {chatHistory && chatHistory.map((message, index) => (
                                <Box sx={{marginBottom: '10px'}}>
                                    {message.senderAccountId === currentUser ?
                                        <Box sx={{
                                            paddingBottom: '10px',
                                            textAlign: 'right',
                                        }}>
                                            <Typography
                                                sx={{
                                                    backgroundColor: '#c3d7f6',
                                                    borderRadius: '5px',
                                                    padding: '4px',
                                                    marginRight: '2px',
                                                    display: 'inline-block',
                                                }}
                                            >
                                                {message.content}
                                            </Typography>
                                            <Avatar
                                                src={(currentUser === chatRoomInformation.itemOwnerAccountId ? chatRoomInformation.itemOwnerAccountPhoto : chatRoomInformation.senderAccountPhoto)}
                                                sx={{float: 'right', width: 30, height: 30}}
                                            />
                                        </Box> :
                                        <Box sx={{
                                            paddingBottom: '10px',
                                            textAlign: 'left',
                                        }}>
                                            <Avatar
                                                src={(currentUser !== chatRoomInformation.itemOwnerAccountId ? chatRoomInformation.itemOwnerAccountPhoto : chatRoomInformation.senderAccountPhoto)}
                                                sx={{float: 'left', marginRight: 2}}
                                            />
                                            <Typography
                                                sx={{
                                                    backgroundColor: '#a3b5ce',
                                                    borderRadius: '5px',
                                                    padding: '4px',
                                                    marginLeft: '4px',
                                                    display: 'inline-block',
                                                }}
                                            >
                                                {message.content}
                                            </Typography>
                                        </Box>}
                                </Box>
                            ))}
                        </ScrollableFeed>
                    </Box>
                    <InputBase
                        placeholder="Napisz wiadomość"
                        fullWidth
                        value={message}
                        onChange={handleMessageChange}
                        sx={{
                            marginTop: '10px',
                            border: "1px solid #ccc",
                            padding: "5px",
                            borderRadius: "5px",
                            flex: 1,
                            marginRight: "10px"
                        }}
                        endAdornment={
                            <IconButton onClick={handleSendMessage}>
                                <SendIcon/>
                            </IconButton>
                        }
                    />
                </Box>
            </Box>
        </Dialog>
    );
};

export default SuccessDialog;
