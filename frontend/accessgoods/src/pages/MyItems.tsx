import React, {useEffect, useState} from 'react';
import {Box, Grid, Typography} from '@mui/material';
import Header from "../components/molecules/Header";
import ItemSearchBar from "../components/molecules/ItemSearchBar";
import Footer from "../components/molecules/Footer";
import ItemDto from "../components/atoms/ItemDto";
import ItemWindow from "../components/molecules/ItemWindow";
import {getMyItems} from "../components/endpoints/Items";

const homeContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '30px'
};
const MyItems = () => {
    const [items, setItems] = useState<ItemDto[]>()
    const currentAccountId = localStorage.getItem("accountId")
    useEffect(() => {
        setMyItems()
    }, []);

    const setMyItems = async () => {
        try {
            const result = await getMyItems();
            setItems(result);
        }catch (e) {
            console.error('Error fetching data:', e)
        }
    }
    return (
        <div>
            <Header/>
            <Box sx={homeContentStyle}>
                <Typography variant="h6" gutterBottom>
                    Twoje przedmioty
                </Typography>
                <Grid container spacing={2} pl={2}>
                    {items && items.map((item, index) => (
                        <Grid key={index} item xs={12} sm={6} md={4}>
                            <ItemWindow item={item} currentAccountId={(currentAccountId !== undefined ? Number(currentAccountId) :  undefined)}/>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Footer/>
        </div>
    );
};

export default MyItems;