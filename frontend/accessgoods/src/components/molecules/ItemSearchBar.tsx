import React, {useState} from 'react';
import {Autocomplete, Button, Container, TextField} from '@mui/material';
import { useNavigate } from 'react-router';

const ItemSearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');

    const categories = [
        {label: 'Super kategoria', id: 1},
        {label: 'Fajna kategoria', id: 2}, //docelowo ma byc pobrane
    ];

    const navigate = useNavigate();
    const handleSearch = () => {
        console.log(`Szukanie przedmiotów: ${searchTerm}, Kategoria: ${category}`);
        navigate('/search'); // Przekierowanie do ścieżki /search
    };

    return (
        <div style={{display: 'flex', alignItems: 'center', gap: '8px', margin: 'auto'}}>
            <TextField
                className="pt-50"
                label="Szukaj przedmiotu"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={categories}
                sx={{width: 300}}
                onChange={(e, value) => value !== null && setCategory(value.label)} // Sprawdzenie, czy wartość nie jest null
                renderInput={(params) =>
                    <TextField {...params} label="Kategoria" />}
            />
            <Button variant="contained" onClick={handleSearch} size="medium">
                Szukaj
            </Button>
        </div>
    );
};

export default ItemSearchBar;
