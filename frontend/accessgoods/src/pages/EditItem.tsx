import React, {useState, useEffect} from 'react';
import {
    Box,
    Button,
    Typography,
    TextField,
    Autocomplete,
    InputAdornment,
    ToggleButtonGroup,
    ToggleButton
} from '@mui/material';
import Header from "../components/molecules/Header";
import Footer from "../components/molecules/Footer";
import ItemDto from "../components/atoms/ItemDto";
import {getItem} from "../components/endpoints/endpoints";
import {addItem, editItem} from "../components/endpoints/Items";
import {useNavigate} from "react-router";
import CategoryDto from "../components/atoms/CategoryDto";
import {getCategories} from "../components/endpoints/Categories";
import ImageUpload from "../components/molecules/ImageUpload";
import {useParams} from "react-router-dom";
import itemDto from "../components/atoms/ItemDto"; // Tutaj ścieżka do getItem
const homeContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '30px'
};
const EditItem = () => {
    const MAX_IMAGES = 5;
    const [item, setItem] = useState<ItemDto>();
    const {itemId} = useParams();
    const [category, setCategory] = useState<CategoryDto | null>();
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [imageSrcs, setImageSrcs] = useState<String[]>(new Array(MAX_IMAGES).fill(''))
    const [isActive, setIsActive] = useState<boolean>(true);
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        images: '',
        cost: '',
        category: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const categoriesFound = await getCategories()
                setCategories(categoriesFound)
                const fetchedItem = await getItem(Number(itemId));
                setItem(fetchedItem);
                setCategory(categoriesFound.find(it => it.categoryId === fetchedItem.categoryId))
                setImageSrcs(fetchedItem?.images ? fillImageSrcToMaxImages(fetchedItem.images.map(it => it.image)) : new Array(MAX_IMAGES).fill(''))
                setIsActive(fetchedItem.isActive)
                console.log(fetchedItem.isActive)
            } catch (error) {
                console.error('Error fetching item:', error);
            }
        };
        fetchItem();
    }, [itemId]);

    const fillImageSrcToMaxImages = (images: string[]): string[] => {
        const imagesLength = images.length;
        const filledImages = [...images]; // Stworzenie kopii oryginalnej tablicy

        if (imagesLength < MAX_IMAGES) {
            for (let i = images.length; i < MAX_IMAGES; i++) {
                filledImages.push('');
            }
        }
        return filledImages;
    };

    const handleImageSrc = (index: number, src: string) => {
        const updatedImages = [...imageSrcs];
        updatedImages[index] = src;
        setImageSrcs(updatedImages);
    };
    const renderImageUploads = () => {
        return imageSrcs.map((src, index) => (
            <ImageUpload key={index} onImageSrc={(src) => handleImageSrc(index, src)}
                         currentImageSrc={src === '' ? undefined : (src as string)}/>
        ));
    };

    // Funkcja do obsługi aktualizacji przedmiotu
    const handleItemUpdate = async () => {
        const nonEmptyImages = imageSrcs.filter(src => src !== '');
        if (!item?.name) {
            setErrors(prevErrors => ({...prevErrors, name: 'Wypełnij pole nazwa'}));
        } else {
            setErrors(prevErrors => ({...prevErrors, name: ''}));
        }

        if (!item?.categoryId) {
            setErrors(prevErrors => ({...prevErrors, category: 'Wybierz kategorię'}));
        } else {
            setErrors(prevErrors => ({...prevErrors, category: ''}));
        }

        if (!item?.description) {
            setErrors(prevErrors => ({...prevErrors, description: 'Wypełnij pole opis'}));
        } else {
            setErrors(prevErrors => ({...prevErrors, description: ''}));
        }

        if (!item?.pricePerDay) {
            setErrors(prevErrors => ({...prevErrors, cost: 'Wypełnij pole cena za dzień'}));
        } else {
            setErrors(prevErrors => ({...prevErrors, cost: ''}));
        }

        if (nonEmptyImages.length === 0) {
            setErrors(prevErrors => ({...prevErrors, images: 'Dodaj co najmniej jedno zdjęcie'}));
        } else {
            setErrors(prevErrors => ({...prevErrors, images: ''}));
        }

        if (!item?.name || !item?.categoryId || !item?.description || !item?.pricePerDay || nonEmptyImages.length === 0) {
            return;
        }

        const response = await editItem(item!);
        if (response.status === 200) {
            navigate(`/item/${response.id}`)
        }
        return;
    };
    const handleToggle = () => {
        const newIsActive = !isActive;
        console.log(newIsActive + "XDD")

        setIsActive(newIsActive);
        setItem((prevItem) => ({ ...prevItem!, isActive: newIsActive }));
    };

    return (
        <div>
            <Header/>
            <Box sx={homeContentStyle}>
                {item ? (
                    <>
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
                                Edytuj przedmiot
                            </Typography>
                            <TextField
                                label="Nazwa"
                                variant="outlined"
                                value={item.name || ''}
                                onChange={(e) => setItem({...item, name: e.target.value})}
                                fullWidth
                                required
                                inputProps={{maxLength: 60}}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Typography variant="caption">
                                                {item.name.length}/60
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
                                value={category?.name}
                                options={categories.map(category => category.name)}
                                sx={{width: 300, paddingBottom: '8px'}}
                                onChange={(e, value) => {
                                    if (value === null) {
                                        setCategory(null);
                                    } else {
                                        const selectedCategory = categories.find(category => category.name === value);
                                        if (selectedCategory) {
                                            setCategory(selectedCategory);
                                            setItem({...item, categoryId: selectedCategory.categoryId})
                                        }
                                    }
                                }} renderInput={(params) =>
                                <TextField {...params} label="Kategoria" error={!!errors.category}
                                           helperText={errors.category}/>}
                            />

                            <TextField
                                label="Opis"
                                multiline
                                rows={5}
                                variant="outlined"
                                value={item.description}
                                onChange={(e) => setItem({...item, description: e.target.value})}
                                fullWidth
                                required
                                inputProps={{maxLength: 300}}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Typography variant="caption">
                                                {item.description.length}/300
                                            </Typography>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{paddingBottom: '10px'}}
                                error={!!errors.description} helperText={errors.description}
                            />
                            <Box sx={{flexDirection:'row'}}>
                                <TextField
                                    label="Cena za dzień PLN"
                                    type="number"
                                    variant="outlined"
                                    value={item.pricePerDay || ''}
                                    onChange={(e) => setItem({...item, pricePerDay: Number(e.target.value)})}
                                    fullWidth
                                    required
                                    sx={{paddingBottom: '10px',width: '300px'}}
                                    error={!!errors.cost} helperText={errors.cost}
                                />
                                <ToggleButtonGroup
                                    value={isActive ? 'active' : 'inactive'}
                                    exclusive
                                    onChange={handleToggle}
                                    sx={{paddingTop: '4px', paddingLeft: '4px'}}
                                >
                                    <ToggleButton value="active">Aktywny</ToggleButton>
                                    <ToggleButton value="inactive">Nie aktywny</ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '8px'}}>
                                {renderImageUploads()}
                                <Typography variant="caption" color="error">{errors.images}</Typography>
                            </Box>
                            <Button variant="contained" onClick={handleItemUpdate}>
                                Zapisz zmiany
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Typography variant="h6" gutterBottom>
                        Ładowanie danych...
                    </Typography>
                )}
            </Box>
            <Footer/>
        </div>
    );
};

export default EditItem;
