import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Autocomplete } from '@mui/material';
import Header from "../components/molecules/Header";
import Footer from "../components/molecules/Footer";
import ItemDto from "../components/atoms/ItemDto";
import {getItem} from "../components/endpoints/endpoints"; // Tutaj ścieżka do getItem
const homeContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '30px'
};
const EditItem = () => {
    const [item, setItem] = useState<ItemDto>();
    const itemId = 3; // Załóżmy, że identyfikator przedmiotu to 3

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const fetchedItem = await getItem(itemId);
                setItem(fetchedItem);
            } catch (error) {
                console.error('Error fetching item:', error);
            }
        };

        fetchItem();
    }, [itemId]);

    // Funkcja do obsługi aktualizacji przedmiotu
    const handleItemUpdate = () => {
        // Tutaj możesz zaimplementować logikę aktualizacji przedmiotu na podstawie danych z 'item'
    };

    return (
        <div>
            <Header />
            <Box sx={homeContentStyle}>
                {item ? (
                    <>
                        <Typography variant="h4" gutterBottom>
                            Edytuj przedmiot
                        </Typography>
                        <TextField
                            label="Nazwa"
                            variant="outlined"
                            value={item.name || ''}
                            onChange={(e) => setItem({ ...item, name: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Opis"
                            multiline
                            rows={5}
                            variant="outlined"
                            value={item.description || ''}
                            onChange={(e) => setItem({ ...item, description: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Cena za dzień PLN"
                            type="number"
                            variant="outlined"
                            value={item.pricePerDay || ''}
                            onChange={(e) => setItem({ ...item, pricePerDay: Number(e.target.value) })}
                            fullWidth
                        />
                        <Button variant="contained" onClick={handleItemUpdate}>
                            Zapisz zmiany
                        </Button>
                    </>
                ) : (
                    <Typography variant="h6" gutterBottom>
                        Ładowanie danych...
                    </Typography>
                )}
            </Box>
            <Footer />
        </div>
    );
};

export default EditItem;
