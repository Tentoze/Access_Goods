import React, {useState, useEffect} from 'react';
import {Autocomplete, Box, Button, InputAdornment, TextField, Typography} from '@mui/material';
import ItemWindow from "../components/molecules/ItemWindow";
import Footer from "../components/molecules/Footer";
import Header from "../components/molecules/Header";
import Api from "../components/endpoints/api";
import ImageUpload from "../components/molecules/ImageUpload";
import {getCategories} from "../components/endpoints/Categories";
import CategoryDto from "../components/atoms/CategoryDto";
import {addItem} from "../components/endpoints/Items";
import {useNavigate} from "react-router";



const RentNewItem = () => {
    const MAX_IMAGES = 5; // Maksymalna liczba zdjęć

    const [name, setName] = useState('');
    const [category, setCategory] = useState<CategoryDto | null>();
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [description, setDescription] = useState('');
    const [pricePerDay, setPricePerDay] = useState<number>();
    const [imageSrcs, setImageSrcs] = useState<string[]>(new Array(MAX_IMAGES).fill(''));
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        images: '',
        cost: '',
        category: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Pobranie listy kategorii z backendu
        fetchCategories();
    }, []);

    const handleItemSubmit = async () => {
        const nonEmptyImages = imageSrcs.filter(src => src !== '');
        if (!name) {
            setErrors(prevErrors => ({...prevErrors, name: 'Wypełnij pole nazwa'}));
        } else {
            setErrors(prevErrors => ({...prevErrors, name: ''}));
        }

        if (!category) {
            setErrors(prevErrors => ({...prevErrors, category: 'Wybierz kategorię'}));
        } else {
            setErrors(prevErrors => ({...prevErrors, category: ''}));
        }

        if (!description) {
            setErrors(prevErrors => ({...prevErrors, description: 'Wypełnij pole opis'}));
        } else {
            setErrors(prevErrors => ({...prevErrors, description: ''}));
        }

        if (!pricePerDay) {
            setErrors(prevErrors => ({...prevErrors, cost: 'Wypełnij pole cena za dzień'}));
        } else {
            setErrors(prevErrors => ({...prevErrors, cost: ''}));
        }

        if (nonEmptyImages.length === 0) {
            setErrors(prevErrors => ({...prevErrors, images: 'Dodaj co najmniej jedno zdjęcie'}));
        } else {
            setErrors(prevErrors => ({...prevErrors, images: ''}));
        }

        if (!name || !category || !description || !pricePerDay || nonEmptyImages.length === 0) {
            return;
        }

        const response = await addItem(name, description, pricePerDay, nonEmptyImages, category?.categoryId as number);
        console.log(response)
        if(response.status === 200) {
            navigate(`/item/${response.id}`)
        }
        return;
    };

    const fetchCategories = async () => {
        const categories = await getCategories()
        setCategories(categories)
    };

    const handleImageSrc = (index: number, src: string) => {
        const updatedImages = [...imageSrcs];
        updatedImages[index] = src;
        setImageSrcs(updatedImages);
    };


    const renderImageUploads = () => {
        return imageSrcs.map((src, index) => (
            <ImageUpload key={index} onImageSrc={(src) => handleImageSrc(index, src)}/>
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
                    minHeight: '100vh',
                    paddingBottom: '60px',
                    marginBottom: '10px'
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
                    error={!!errors.name} // Ustawienie pola błędu na podstawie stanu errors
                    helperText={errors.name} // Wyświetlanie komunikatu błędu
                />

                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={categories}
                    getOptionLabel={(option) => option.name}
                    sx={{width: 300, paddingBottom: '8px'}}
                    onChange={(e, value) => value !== null && setCategory(value)}
                    renderInput={(params) =>
                        <TextField {...params} label="Kategoria" error={!!errors.category}
                                   helperText={errors.category}/>}
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
                    error={!!errors.description} helperText={errors.description}
                />

                <TextField
                    label="Cena za dzień PLN"
                    type="number"
                    variant="outlined"
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(Number(e.target.value))}
                    fullWidth
                    required
                    sx={{paddingBottom: '10px'}}
                    error={!!errors.cost} helperText={errors.cost}
                />

                <Box sx={{display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '8px'}}>
                    {renderImageUploads()}
                    <Typography variant="caption" color="error">{errors.images}</Typography>
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
