import React, {useEffect, useState} from 'react';
import {Box, Button, Grid, Rating, Slider, Typography} from '@mui/material';
import Header from "../components/molecules/Header";
import ItemSearchBar from "../components/molecules/ItemSearchBar";
import Footer from "../components/molecules/Footer";
import {Link, useParams} from "react-router-dom";
import {getItem} from "../components/endpoints/endpoints";
import ItemDto from "../components/atoms/ItemDto";
import {ImageSlider} from "../components/molecules/ImageSlider";
import TryToRent from "../components/structures/TryToRent";
import {getUnavailableDates} from "../components/endpoints/Rents";
import {Calendar} from "react-date-range";
import {useNavigate} from "react-router";
import {createOrGetChatRoom} from "../components/endpoints/Chats";


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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const data = await getItem(Number(itemId));
                setItemDto(data);
                setUnavailableDates(await getUnavailableDates(Number(itemId)))

            } catch (error) {
                console.error('Error fetching item:', error);
            }
        };
        fetchItem();
    }, [itemId]);

    async function handleCreateMessage() {
        const status = await createOrGetChatRoom(itemDto!.itemId)
        if(status === 200) {
            navigate(`/my-chats`);
        }
    }

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
                                    <Box sx={{
                                        width: '40rem',
                                        margin: 'auto',
                                        padding: '5px',
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
                                        Lokalizacja: <br/>{itemDto.locationName}
                                    </Typography>
                                )}
                            </Grid>
                            {/* Sprzedający */}
                            <Grid item xs={12}>
                                {itemDto && (
                                    <Box sx={{height: '100px', rowGap: '8px'}}>
                                        <Link to={`/account/${(itemDto.accountId)}`}
                                              style={{textDecoration: 'none', color: 'black'}}>

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
                                        </Link>
                                        <Rating sx={{float: 'left', paddingTop: '1px', height: '10px'}} size="medium"
                                                name="rating" value={itemDto.rating} precision={0.5} readOnly/>
                                        <Box sx={{paddingTop: '3vh'}}>
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
                                            {localStorage.getItem("accountId") !== null ?
                                                <div>
                                                    {itemDto.accountId !== Number(localStorage.getItem("accountId")) ?
                                                        <Box>
                                                            <Button sx={{marginLeft: '5vh',}} variant="contained"
                                                                    onClick={() => setOpenRentDialog(true)}>Wypożycz
                                                                przedmiot</Button>
                                                            <TryToRent
                                                                open={openRentDialog}
                                                                handleOpenMethod={() => setOpenRentDialog(true)}
                                                                handleCloseMethod={() => setOpenRentDialog(false)}
                                                                reservedDates={unavailableDates}
                                                                pricePerDay={itemDto!.pricePerDay}
                                                                itemId={Number(itemId!)}/>
                                                            <br/>
                                                            <Button sx={{marginLeft: '6vh',}} variant="contained"
                                                                    onClick={handleCreateMessage}>Wyślij wiadomość
                                                                </Button>
                                                        </Box>
                                                        :
                                                        <Box>
                                                            <Button sx={{
                                                                marginLeft: '5vh', backgroundColor: 'red',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(207, 2, 2)', // Zmniejszenie przejrzystości podczas najechania
                                                                },
                                                            }} variant="contained"
                                                                    onClick={() => navigate(`/edit-item/${itemDto!.itemId}`)}>
                                                                Edytuj przedmiot</Button>
                                                        </Box>}
                                                </div>
                                                : <div/>}
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