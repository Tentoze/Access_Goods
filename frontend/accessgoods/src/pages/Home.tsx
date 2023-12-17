import React from 'react';
import {Box} from '@mui/material';
import Header from "../components/molecules/Header";
import ItemSearchBar from "../components/molecules/ItemSearchBar";
import Footer from "../components/molecules/Footer";

const homeContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};
const Home = () => {

        return (
        <div>
            <Header/>
            <Box sx={homeContentStyle}>
                <ItemSearchBar />
            </Box>
            <Footer/>
        </div>
    );
};

export default Home;