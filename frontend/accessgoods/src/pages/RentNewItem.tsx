import React, {useState, useEffect} from 'react';
import {Autocomplete, Box, Button, InputAdornment, TextField, Typography} from '@mui/material';
import ItemWindow from "../components/molecules/ItemWindow";
import Footer from "../components/molecules/Footer";
import Header from "../components/molecules/Header";
import Api from "../components/endpoints/api";
import ImageUpload from "../components/molecules/ImageUpload";
import {getCategories} from "../components/endpoints/Categories";
import CategoryDto from "../components/atoms/CategoryDto";


const RentNewItem = () => {
    const MAX_IMAGES = 5; // Maksymalna liczba zdjęć

    const [name, setName] = useState('');
    const [category, setCategory] = useState<CategoryDto | null>();
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [description, setDescription] = useState('');
    const [pricePerDay, setPricePerDay] = useState('');
    const [imageSrcs, setImageSrcs] = useState<string[]>(new Array(MAX_IMAGES).fill(''));
    const [error, setError] = useState('');

    useEffect(() => {
        // Pobranie listy kategorii z backendu
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const categories = await getCategories()
        setCategories(categories)
    };

    const handleItemSubmit = () => {
        // Walidacja informacji i wywołanie metody końcowej
        // ...
    };

    const handleImageSrc = (index: number, src: string) => {
        const updatedImages = [...imageSrcs];
        updatedImages[index] = src;
        setImageSrcs(updatedImages);
    };

    const renderImageUploads = () => {
        return imageSrcs.map((src, index) => (
            <ImageUpload key={index} onImageSrc={(src) => handleImageSrc(index, src)} />
        ));
    };

    return (
        <div>
            <Header/>
            <Box
                sx={{
                    width: '600px',
                    display: 'flex',
                    margin: 'auto',
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
                        inputProps={{maxLength: 60}}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Typography variant="caption">
                                        {name.length}/60
                                    </Typography>
                                </InputAdornment>
                            ),
                        }}
                        sx={{paddingBottom: '8px'}}
                    />
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={categories}
                    getOptionLabel={(option) => option.name}
                    sx={{width: 300, paddingBottom: '8px'}}
                    onChange={(e, value) => value !== null && setCategory(value)} // Sprawdzenie, czy wartość nie jest null
                    renderInput={(params) =>
                        <TextField {...params} label="Kategoria"/>}
                />
                <TextField
                    label="Opis"
                    multiline
                    rows={5}
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    required
                    inputProps={{maxLength: 300}}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Typography variant="caption">
                                    {description.length}/300
                                </Typography>
                            </InputAdornment>
                        ),
                    }}
                    sx={{paddingBottom: '10px'}}
                />
                <TextField
                    label="Cena za dzień PLN"
                    type="number"
                    variant="outlined"
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(e.target.value)}
                    fullWidth
                    required
                    sx={{paddingBottom: '10px'}}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '8px' }}>
                    {renderImageUploads()}
                </Box>
                <Button variant="contained" onClick={handleItemSubmit}>
                    Wystaw przedmiot
                </Button>
            </Box>
            <Footer/>
        </div>
    );
};

export default RentNewItem;
