import React, { useState } from 'react';
import { Dialog, Box, Button, TextField } from '@mui/material';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Zaimportuj styl
import 'react-date-range/dist/theme/default.css'; // Zaimportuj styl

interface TryToRentProps {
    open: boolean;
    reservedDates: Date[];
    handleOpenMethod: () => void;
    handleCloseMethod: () => void;
    pricePerDay: number;
}


const TryToRent = ({ open, reservedDates, handleOpenMethod, handleCloseMethod, pricePerDay }: TryToRentProps) => {
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(), // Dzisiaj
            endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Jutro
            key: 'selection',
        },
    ]);

    const today = new Date();
    const nextYear = new Date(today.getFullYear() + 1, 11, 31); // Koniec następnego roku
    const handleOpen = () => {
        handleOpenMethod();
    };

    const handleClose = () => {
        handleCloseMethod();
    };

    const handleRent = () => {
        // Logika obliczeń i zapisu wybranego zakresu dat
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '5px',
                    }}
                >
                    <DateRange

                        editableDateInputs={true}
                        dateDisplayFormat="dd.MM.yyyy"
                        onChange={(item) => {
                            setDateRange([
                                {
                                    startDate: item.selection.startDate || dateRange[0].startDate,
                                    endDate: item.selection.endDate || dateRange[0].endDate,
                                    key: 'selection',
                                },
                            ]);
                        }}
                        ranges={dateRange}
                        disabledDates={reservedDates}
                        minDate={today}
                        maxDate={nextYear}
                    />
                    {/* Reszta Twojego kodu */}
                    <Button onClick={handleRent}>Confirm Rental</Button>
                </Box>
            </Dialog>
        </div>
    );
};

export default TryToRent;
