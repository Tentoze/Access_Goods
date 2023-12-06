import React, {useState} from 'react';
import Header from "../components/molecules/Header";
import {Box, Grid, IconButton, makeStyles, Paper, Typography} from "@mui/material";
import ItemSearchBar from "../components/molecules/ItemSearchBar";
import Footer from "../components/molecules/Footer";
import Sidebar from "../components/structures/Sidebar";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ItemWindow from "../components/molecules/ItemWindow";

const searchContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '10px', // Odsunięcie od góry
};

type Filters = {
    sort: string;
    priceRange: number[];
    verifiedUser: boolean;
    hasPhoto: boolean;
    deliveryType: string;
};

const sampleItem = {
    images: [
        'https://cdn.x-kom.pl/i/setup/images/prod/big/product-new-big,,2022/6/pr_2022_6_1_10_41_45_846_00.jpg',
        'https://cdn.x-kom.pl/i/setup/images/prod/big/product-new-big,,2022/6/pr_2022_6_1_10_41_45_846_00.jpg',
        'https://cdn.x-kom.pl/i/setup/images/prod/big/product-new-big,,2022/6/pr_2022_6_1_10_41_45_846_00.jpg'
    ],
    name: 'High-performance laptop',
    pricePerDay: 15,
    rating: 4.5,
    userName: 'John Doe',
    userImage: 'https://www.tomcio.pl/images/Anibut/rex/metalik/mini/250px_Obuwie%20Rex%20r%C3%B3%C5%BCowe.jpg',
    itemId: 1
};
const items = [sampleItem, sampleItem, sampleItem, sampleItem];

const Search = () => {

    const filterPanelStyle = {
        top: 0,
        position: 'sticky',
        height: '80vh',
        padding: '16px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        marginBottom: '16px',
    };
    const paperPanelStyle = {
        display: 'static',
        top: 0,
        position: 'sticky',
        marginTop: '-4vh',
    };

    const centeredContentStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'middle',
        height: '100%',
    };
    const [filtersData, setFiltersData] = useState<Filters | null>(null);
    const [showFilters, setShowFilters] = useState(true); // Początkowo pokazane

    const toggleFilters = () => {
        setShowFilters(!showFilters); // Funkcja do przełączania widoczności filtra
    };
    const handleFilters = (data: Filters) => {
        setFiltersData(data);
        console.log("Filters applied:", data);
        // Tutaj możesz dodać logikę przekazania danych filtrowania do backendu
    };
    return (
        <div>
            <Header/>
            <div style={centeredContentStyle}>
                <ItemSearchBar/>
            </div>
            <Grid container>
                {
                    <Grid item xs={3 && showFilters}>
                        <Paper sx={paperPanelStyle}>
                            <IconButton onClick={toggleFilters}>
                                {showFilters ? <KeyboardDoubleArrowLeftIcon/> : <KeyboardDoubleArrowRightIcon/>}
                            </IconButton>
                            {showFilters && (
                                <Box sx={filterPanelStyle}>
                                    <Typography variant="h6" gutterBottom>
                                        Filtry
                                    </Typography>
                                    <Sidebar handleFilters={handleFilters}/>
                                </Box>
                            )
                            }
                        </Paper>
                    </Grid>
                }
                {/* Zawartość wyszukiwania */}
                <Grid item xs={showFilters ? 9 : 12} pr={2}>
                    <Grid container spacing={2} pl={2}>
                        {items.map((item, index) => (
                            <Grid key={index} item xs={12} sm={6} md={4}>
                                <ItemWindow item={item}/>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

            </Grid>
            <Footer/>
        </div>
    );
};

export default Search;