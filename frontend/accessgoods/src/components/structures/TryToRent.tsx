import React, {useState} from 'react';
import {Dialog, Box, Button, TextField, Typography} from '@mui/material';
import {DateRange} from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Zaimportuj styl
import 'react-date-range/dist/theme/default.css';
import {addRent} from "../endpoints/Rents";
import {useNavigate} from "react-router"; // Zaimportuj styl

interface TryToRentProps {
    open: boolean;
    reservedDates: Date[];
    handleOpenMethod: () => void;
    handleCloseMethod: () => void;
    pricePerDay: number;
    itemId: number;
}


const TryToRent = ({open, reservedDates, handleOpenMethod, handleCloseMethod, pricePerDay, itemId}: TryToRentProps) => {
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(), // Dzisiaj
            endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Jutro
            key: 'selection',
        },
    ]);
    const [endDateWithAdjustOneDay, setEndDateWithAdjustOneDay] = useState(new Date(new Date().getTime() + (24 * 60 * 60 * 1000) * 2))
    const navigate = useNavigate();

    const today = new Date();
    const nextYear = new Date(today.getFullYear() + 1, 11, 31); // Koniec następnego roku
    const handleOpen = () => {
        handleOpenMethod();
    };

    const handleClose = () => {
        handleCloseMethod();
    };

    const handleRent = async () => {
        const response = await addRent(itemId, new Date(dateRange[0].startDate.getTime() + (2 * 60 * 60 * 1000)), endDateWithAdjustOneDay)
        if (response === 200) {
            navigate("/my-rents")
        }
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
                    <Box>
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
                                if (item.selection.endDate) {
                                    setEndDateWithAdjustOneDay(new Date(item.selection.endDate.getTime() + (24 * 60 * 60 * 1000)))
                                }
                            }}
                            ranges={dateRange}
                            disabledDates={reservedDates}
                            minDate={today}
                            maxDate={nextYear}
                        />
                    </Box>
                    <Typography variant={"h6"}>Cena
                        za {(((endDateWithAdjustOneDay.getTime() - dateRange[0].startDate.getTime())) / (1000 * 60 * 60 * 24))} dni
                        : {(((endDateWithAdjustOneDay.getTime() - dateRange[0].startDate.getTime())) / (1000 * 60 * 60 * 24)) * pricePerDay} PLN</Typography>
                    <Box sx={{marginLeft: '65px'}}>
                        <Button variant='contained' onClick={handleRent}>Wypożycz przedmiot</Button>
                    </Box>
                </Box>

            </Dialog>
        </div>
    );
};

export default TryToRent;
