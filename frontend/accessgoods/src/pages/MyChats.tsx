import Header from "../components/molecules/Header";
import {Box, Grid, Paper, Typography} from "@mui/material";
import ItemSearchBar from "../components/molecules/ItemSearchBar";
import Footer from "../components/molecules/Footer";
import React, {useEffect, useState} from "react";
import {getMyItems} from "../components/endpoints/Items";
import ItemDto from "../components/atoms/ItemDto";
import {getChatRoomList} from "../components/endpoints/Chats";
import ItemWindow from "../components/molecules/ItemWindow";
import ChatRoomWindow from "../components/molecules/ChatRoomWindow";

const homeContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '30px'
};
const MyChats = () => {

    const [chatRooms, setChatRooms] = useState< {
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
    }[]>()

    useEffect(() => {
        setMyChatRooms()
    }, []);

    const setMyChatRooms = async () => {
        try {
            const result = await getChatRoomList();
            setChatRooms(result);
        }catch (e) {
            console.error('Error fetching data:', e)
        }
    }

    return (
        <div>
            <Header/>
            <Box sx={homeContentStyle}>
                <Typography variant="h6" gutterBottom>
                    Twoje wiadomości
                </Typography>
                <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '30px', paddingBottom: '50px' }}>
                    {chatRooms && chatRooms.map((chatRoom) => (
                        <Box>
                            <ChatRoomWindow chatRoom={chatRoom}/>
                        </Box>
                    ))}
                </Paper>
            </Box>
            <Footer/>
        </div>
    );
};

export default MyChats;