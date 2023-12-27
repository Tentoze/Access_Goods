import React, {useEffect, useState} from 'react';
import {Box, Typography} from '@mui/material';
import Header from "../components/molecules/Header";
import Footer from "../components/molecules/Footer";
import RentWindow from "../components/molecules/RentWindow";
import {getCurrentUserRents, Rent} from "../components/endpoints/Rents";

const homeContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '30px',
    paddingBottom: '50px'
};
const MyRents = () => {
    const [rents, setRents] = useState<Rent[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rentsData = await getCurrentUserRents();
                setRents(rentsData);
            } catch (error) {
                console.error('Error fetching rents:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <Header/>
            <Box sx={homeContentStyle}>
                <Typography variant="h6" gutterBottom>
                    Twoje wypożyczenia
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '30px', paddingBottom: '50px' }}>
                    {rents.map((rent, index) => (
                        <Box>
                        <RentWindow rentDto={rent} key={index} />
                            <br/>
                        </Box>

                    ))}
                </div>
            </Box>
            <Footer/>
        </div>
    );
};

export default MyRents;