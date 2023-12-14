import React, { useState, useEffect } from 'react';
import {Autocomplete, Box, Button, TextField, Typography} from '@mui/material';
import ItemWindow from "../components/molecules/ItemWindow";
import Footer from "../components/molecules/Footer";
import Header from "../components/molecules/Header";
import Api from "../components/endpoints/api";
import ImageUpload from "../components/molecules/ImageUpload";


const RentNewItem = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [description, setDescription] = useState('');
    const [pricePerDay, setPricePerDay] = useState('');
    const [imageSrc, setImageSrc] = useState<string>('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Pobranie listy kategorii z backendu
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await Api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleItemSubmit = () => {
        // Walidacja informacji i wywołanie metody końcowej
        // ...
    };

    const handleImageSrc = (src: string) => {
        setImageSrc(src);
    };

    return (
        <div>
            <Header />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: '100px',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Wystaw przedmiot
                </Typography>
                <TextField
                    label="Nazwa"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                    inputProps={{ maxLength: 60 }}
                    sx={{ marginBottom: '20px' }}
                />
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={categories}
                    sx={{width: 300}}
                    onChange={(e, value) => value !== null && setCategory(value)} // Sprawdzenie, czy wartość nie jest null
                    renderInput={(params) =>
                        <TextField {...params} label="Kategoria" />}
                />
                <TextField
                    label="Opis"
                    multiline
                    rows={4}
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    required
                    sx={{ marginBottom: '20px' }}
                />
                <TextField
                    label="Cena za dzień"
                    type="number"
                    variant="outlined"
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(e.target.value)}
                    fullWidth
                    required
                    sx={{ marginBottom: '20px' }}
                />
                <Box>
                    <ImageUpload onImageSrc={handleImageSrc}/>
                </Box>
                <Button variant="contained" onClick={handleItemSubmit}>
                    Wystaw przedmiot
                </Button>
            </Box>
            <Footer />
        </div>
    );
};

export default RentNewItem;
