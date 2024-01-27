import React, {useEffect, useState} from 'react';
import {Avatar, Box, Button, Grid, Paper, Typography} from '@mui/material';
import Header from "../components/molecules/Header";
import ItemSearchBar from "../components/molecules/ItemSearchBar";
import Footer from "../components/molecules/Footer";
import {getAccount} from "../components/endpoints/Accounts";
import {useParams} from "react-router-dom";
import ItemWindow from "../components/molecules/ItemWindow";
import {getUserItems} from "../components/endpoints/Items";
import ItemDto from "../components/atoms/ItemDto";
import {getOpinionsByAccountId} from "../components/endpoints/Opinions";
import OpinionWindow from "../components/molecules/OpinionWindow";
import SuccessDialog from "../components/molecules/SuccessDialog";
import EditAccountDataDialog from "../components/molecules/EditAccountDataDialog";

const homeContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '30px'
};
const Account = () => {
    const {accountId} = useParams();
    const [accountData, setAccountData] = useState<any>(null);
    const [items, setItems] = useState<ItemDto[]>()
    const [successMessage, setSuccessMessage] = useState(false);
    const [opinions, setOpinions] = useState<{
        id: number,
        rating: number,
        description: string,
        opinionGiverAccountId: number,
        opinionReceiverAccountId: number,
        feedbackTarget: string,
    }[]>([]);
    const [isEditAccountDataDialogOpen, setIsEditAccountDataDialogOpen] = useState(false);


    useEffect(() => {
        fetchAccountData();
        fetchRecentRentals();
        fetchAccountOpinions()
        // Pobieranie zaaktualizowanych wypożyczeń
        // fetchUpdatedRentals();
    }, []);

    const handleCloseSnackbar = () => {
        setSuccessMessage(false);
    };
    const fetchAccountData = async () => {
        const data = await getAccount(Number(accountId)) // Pobierz dane konta z API
        setAccountData(data);
    }
    const fetchAccountOpinions = async () => {
        const data = await getOpinionsByAccountId(Number(accountId)) // Pobierz dane konta z API
        setOpinions(data);
    }

    // Pobranie ostatnich wypożyczeń z backendu
    const fetchRecentRentals = async () => {
        const rentals = await getUserItems(Number(accountId)) // Pobierz ostatnie wypożyczenia z API
        setItems(rentals);
    }

    // Pobranie zaaktualizowanych wypożyczeń z backendu
    // const fetchUpdatedRentals = async () => {
    //     const updatedRentals = await API.getUpdatedRentals(); // Pobierz zaaktualizowane wypożyczenia z API
    //     setUpdatedRentals(updatedRentals);
    // }

    return (
        <div>
            <Header/>
            <Grid container sx={{paddingTop: '20px', marginBottom: '6px'}}>
                <Grid item xs={5}>
                    <Box sx={{display: 'flex', flexDirection: 'row',}}>
                        <Paper sx={{marginLeft: '20px'}} variant={"elevation"}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                margin: 'auto',
                                gap: '10px',
                                padding: '25px',
                                width: '30vh'
                            }}>
                                <Avatar sx={{height: '20vh', width: '20vh'}}
                                        alt="User Avatar" src={accountData?.photo} variant="square"/>
                                <Typography variant="h6">{accountData?.firstName} {accountData?.lastName}</Typography>
                            </Box>
                            <Typography variant="h6">Lokalizacja: {accountData?.locationName} </Typography>
                            <br/>
                            <Button sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                margin: 'auto',
                            }} variant="contained" onClick={() => (setSuccessMessage(true))}>Skontaktuj się</Button>
                            <br/>
                            {accountData?.id === Number(localStorage.getItem("accountId")) &&
                                <Button sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    margin: 'auto',
                                    backgroundColor: 'red',
                                    '&:hover': {
                                        backgroundColor: 'rgba(207, 2, 2)', // Zmniejszenie przejrzystości podczas najechania
                                    },
                                }} variant="contained" onClick={() => setIsEditAccountDataDialogOpen(true)}>Edytuj swoje
                                    dane</Button>}
                            <br/>
                        </Paper>
                    </Box>
                </Grid>
                <Grid item xs={6} sx={{marginLeft: '5vh'}}>
                    <Paper variant={"outlined"}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px',
                            paddingBottom: '15px'
                        }}>
                            <Typography variant={"h6"} sx={{paddingTop: '5px'}}>Przedmioty użytkownika</Typography>
                            {/* Lista ostatnich wypożyczeń */}
                            <Grid container spacing={2} pl={2}>
                                {items && items.map((item, index) => (
                                    <Grid key={index} item xs={12} sm={6} md={4}>
                                        <ItemWindow item={item} notShowAccountInformation={true}/>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Przycisk do strony z wypożyczonymi przedmiotami
                            <Button variant="contained" href="/rented-items">Zobacz wypożyczone przedmioty</Button>
*/}

                        </Box>
                    </Paper>
                    <br/>
                    <br/>
                    <Paper variant={"outlined"}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            alignItems: 'center',
                            paddingBottom: '15px',
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center', // Wyśrodkowanie "Opinie użytkowników"
                                gap: '10px',
                                paddingTop: '5px',
                                width: '100%', // W pełnej szerokości kontenera
                            }}>
                                <Typography sx={{paddingLeft: '8px'}} variant={"h6"}>Opinie użytkowników</Typography>
                                <Box
                                    sx={{flex: 1}}/> {/* Elastyczny element do rozciągnięcia, aby "Śr. ocena" był przyklejony do prawego brzegu */}
                                {accountData?.avgRating !== null ?
                                    <Typography variant={"h6"}>
                                        Średnia ocena: {accountData?.avgRating.toFixed(1)}
                                    </Typography>
                                    : <div/>}
                            </Box>

                            <Grid container spacing={2} pl={2}>
                                {opinions && opinions.map((opinion, index) => (
                                    <OpinionWindow key={index} opinion={opinion}/>
                                ))}
                            </Grid>

                            {/*<Button variant="contained" href="/rented-items">
                                Pokaż więcej opinii
                            </Button>*/}
                        </Box>

                    </Paper>
                </Grid>
            </Grid>
            {accountData?.id === Number(localStorage.getItem("accountId")) &&
                <EditAccountDataDialog open={isEditAccountDataDialogOpen}
                                       onClose={() => setIsEditAccountDataDialogOpen(false)} email={accountData.email}
                                       firstName={accountData.firstName} lastName={accountData.lastName}
                                       phoneNumber={accountData.phoneNumber} photoSrc={accountData.photo}
                                       latitude={accountData.latitude} longitude={accountData.longitude}
                                       address={accountData.locationName}/>
            }
            <SuccessDialog open={successMessage} onClose={handleCloseSnackbar}
                           textOnSuccess={"Email: " + accountData?.email +
                               `\n Numer telefonu: ` + accountData?.phoneNumber} titleSuccess={"Skontaktuj się"}/>

            <Footer/>
        </div>
    );
};

export default Account;