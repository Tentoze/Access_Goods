import React, {useEffect, useState} from 'react';
import {Box, Grid, Slider, Typography} from '@mui/material';
import Header from "../components/molecules/Header";
import ItemSearchBar from "../components/molecules/ItemSearchBar";
import Footer from "../components/molecules/Footer";
import {useParams} from "react-router-dom";
import {getItem} from "../components/endpoints/endpoints";
import ItemDto from "../components/atoms/ItemDto";
import {ImageSlider} from "../components/molecules/ImageSlider";



const homeContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '100px', // Odsunięcie od góry
};
const Item = () => {
    const [itemDto, setItemDto] = useState<ItemDto | null>(null);
    const {itemId} = useParams();


    useEffect(() => {
        const fetchItem = async () => {
            try {
                const data = await getItem(Number(itemId));
                setItemDto(data);
                console.log(data);

            } catch (error) {
                console.error('Error fetching item:', error);
            }
        };
        fetchItem();
    }, [itemId]);
    return (
        <div>
            <Header/>
            <Box sx={homeContentStyle}>
                <Typography variant="h4" gutterBottom>
                    {itemDto ? itemDto.name : 'Tytuł przedmiotu'}
                </Typography>
                <Grid container spacing={2}>
                    {/* Lewa strona */}
                    <Grid item xs={12} md={8}>
                        {/* Zdjęcia i opis */}
                        <Grid container spacing={2}>
                            {/* Zdjęcia - slider */}
                            <Grid item xs={12}>
                                {itemDto && itemDto.images.length > 0 && (
                                    <ImageSlider images={itemDto.images}></ImageSlider>
                                )}
                            </Grid>
                            {/* Opis */}
                            <Grid item xs={12}>
                                {itemDto && (
                                    <Typography variant="body1">
                                        {itemDto.description}
                                    </Typography>
                                )}
                            </Grid>
                            {/* Opinie */}
                            <Grid item xs={12}>
                                {/* Tutaj umieść opinie */}
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* Prawa strona */}
                    <Grid item xs={12} md={4}>
                        {/* Lokalizacja i sprzedający */}
                        <Grid container spacing={2}>
                            {/* Lokalizacja */}
                            <Grid item xs={12}>
                                {itemDto && (
                                    <Typography variant="body2">
                                        Lokalizacja:
                                    </Typography>
                                )}
                            </Grid>
                            {/* Sprzedający */}
                            <Grid item xs={12}>
                                {itemDto && (
                                    <Box>
                                        <img src={itemDto.accountImage} alt={`${itemDto.accountFirstName}`} style={{
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                            marginRight: '5px'
                                        }}/>
                                        <Typography variant="body2">
                                            Sprzedający: {itemDto.accountFirstName + ' ' + itemDto.accountLastName}
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <Footer/>
        </div>
    );
};


export default Item;