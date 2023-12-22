import React, {useEffect, useState} from 'react';
import {Box, Button, Grid, Slider, Typography} from '@mui/material';
import Header from "../components/molecules/Header";
import ItemSearchBar from "../components/molecules/ItemSearchBar";
import Footer from "../components/molecules/Footer";
import {useParams} from "react-router-dom";
import {getItem} from "../components/endpoints/endpoints";
import ItemDto from "../components/atoms/ItemDto";
import {ImageSlider} from "../components/molecules/ImageSlider";
import TryToRent from "../components/structures/TryToRent";
import {getUnavailableDates} from "../components/endpoints/Rents";
import {Calendar} from "react-date-range";


const homeContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '40px',
    paddingBottom: '40px',
    marginBottom: '50px',
    minHeight: '100vh',// Odsunięcie od góry
};
const Item = () => {
    const [itemDto, setItemDto] = useState<ItemDto | null>(null);
    const [openRentDialog, setOpenRentDialog] = useState(false);
    const [unavailableDates, setUnavailableDates] = useState<Date[]>([])
    const {itemId} = useParams();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const data = await getItem(Number(itemId));
                setItemDto(data);
                setUnavailableDates(await getUnavailableDates(Number(itemId)))
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
                            <Box>
                                <Grid item xs={12}>
                                    {itemDto && (
                                        <Box sx={{
                                            marginLeft: '10vh',
                                            padding: '5px',
                                            paddingRight: '500px',
                                            border: '2px solid rgb(128,128,128,0.3)',
                                        }}>
                                            <Typography variant="h5">
                                                Opis:
                                            </Typography>
                                            <Typography>
                                                {itemDto.description}
                                            </Typography>
                                        </Box>
                                    )}
                                </Grid>
                                {/* Opinie */}
                                <Grid item xs={12}>
                                    {/* Tutaj umieść opinie */}
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                    {/* Prawa strona */}
                    <Grid item xs={12} md={4}>
                        {/* Lokalizacja i sprzedający */}
                        <Grid container spacing={2}>
                            {/* Lokalizacja */}
                            <Grid item xs={12}>
                                {itemDto && (
                                    <Typography variant="h6">
                                        Lokalizacja:
                                    </Typography>
                                )}
                            </Grid>
                            {/* Sprzedający */}
                            <Grid item xs={12}>
                                {itemDto && (
                                    <Box sx={{height: '100px', rowGap: '8px'}}>
                                        <img src={itemDto.accountImage} alt={`${itemDto.accountFirstName}`} style={{
                                            float: "left",
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '10%',
                                            marginRight: '5px'
                                        }}>
                                        </img>
                                        <Typography variant="h6" sx={{alignText: 'center'}}>
                                            Sprzedający: <br/>{itemDto.accountFirstName + ' ' + itemDto.accountLastName}
                                        </Typography>
                                        <Box sx={{paddingTop:'3vh'}}>

                                            <Typography variant="h6" sx={{
                                                paddingLeft: '7vh',
                                                paddingTop: '3vh',
                                                alignText: 'center',
                                                margin: 'auto',

                                            }}>
                                                Dostępne dni
                                            </Typography>
                                            <div style={{marginTop: '-10px'}}>
                                                <Calendar
                                                    minDate={new Date()}
                                                    maxDate={new Date(new Date().getFullYear() + 1, 11, 31)}
                                                    dateDisplayFormat="dd.MM.yyyy"
                                                    disabledDates={unavailableDates}
                                                />
                                            </div>
                                            <Button sx={{  marginLeft: '5vh',}} variant="contained" onClick={() => setOpenRentDialog(true)}>Wypożycz
                                                przedmiot</Button>
                                            <TryToRent
                                                open={openRentDialog}
                                                handleOpenMethod={() => setOpenRentDialog(true)}
                                                handleCloseMethod={() => setOpenRentDialog(false)}
                                                reservedDates={unavailableDates}
                                                pricePerDay={itemDto!.pricePerDay}
                                            />
                                        </Box>
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