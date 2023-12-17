import React, {useState} from 'react';
import Header from "../components/molecules/Header";
import {Box, Grid, IconButton, makeStyles, Paper, Typography} from "@mui/material";
import ItemSearchBar from "../components/molecules/ItemSearchBar";
import Footer from "../components/molecules/Footer";
import Sidebar from "../components/structures/Sidebar";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ItemWindow from "../components/molecules/ItemWindow";
import {useLocation, useParams} from "react-router-dom";
import {searchItem} from "../components/endpoints/Items";
import ItemDto from "../components/atoms/ItemDto";

const searchContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    marginBottom: '60px',
};

type Filters = Partial<{
    searchTerm: string;
    categoryId: number;
    sortOption: string;
    priceFrom: number;
    priceTo: number;
    verifiedUser: boolean;
    userHasPhoto: boolean;
    deliveryType: string;
}>;

const baseFilter: Filters = {
    sortOption: "NONE",
};

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
    const location = useLocation();
    const params = new URLSearchParams(location.search)
    const category = params.get("categoryName")
    const searchTerm = params.get("searchTerm")
    const [items, setItems] = useState<ItemDto[]>()
    const [filtersData, setFiltersData] = useState<Filters | null>(baseFilter);
    const [showFilters, setShowFilters] = useState(true); // Początkowo pokazane


    const toggleFilters = () => {
        setShowFilters(!showFilters); // Funkcja do przełączania widoczności filtra
    };
    const handleFilters = async (data: Filters) => {
        if (params.get("searchTerm") !== null) {
            const paramSearchTerm = String(params.get("searchTerm"))
            if(paramSearchTerm !== ""){
                data.searchTerm = String(params.get("searchTerm"))
            }
        }
        if (params.get("categoryId") !== null) {
            data.categoryId = Number(params.get("categoryId"))
        }
        setFiltersData(data);
        console.log("Filters applied:", data);

        try {
            console.log(data.priceFrom)
            const result = await searchItem(data); // Oczekiwanie na zwrotkę z endpointu
            setItems(result); // Aktualizacja stanu items po otrzymaniu wyniku
        } catch (error) {
            // Obsługa błędu z zapytaniem do API
            console.error('Error fetching data:', error);
        }        return
    };
    return (
        <div>
            <Header/>
            <div style={centeredContentStyle}>
                <ItemSearchBar/>
            </div>
            <Grid container sx={{paddingBottom: '60px', marginBottom: '6px'}}>
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
                        {items && items.map((item, index) => (
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