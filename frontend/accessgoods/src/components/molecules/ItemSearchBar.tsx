import React, {useEffect, useState} from 'react';
import {Autocomplete, Button, Container, TextField} from '@mui/material';
import { useNavigate } from 'react-router';
import CategoryDto from "../atoms/CategoryDto";
import {getCategories} from "../endpoints/Categories";

const ItemSearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState<CategoryDto | null>();
    const [categories, setCategories] = useState<CategoryDto[]>([]);

    useEffect(() => {
        // Pobranie listy kategorii z backendu
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const categories = await getCategories()
        setCategories(categories)
    };

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
                getOptionLabel={(option) => option.name}
                sx={{width: 300}}
                onChange={(e, value) => value !== null && setCategory(value)} // Sprawdzenie, czy wartość nie jest null
                renderInput={(params) =>
                    <TextField {...params} label="Kategoria"/>}
            />
            <Button variant="contained" onClick={handleSearch} size="medium">
                Szukaj
            </Button>
        </div>
    );
};

export default ItemSearchBar;
