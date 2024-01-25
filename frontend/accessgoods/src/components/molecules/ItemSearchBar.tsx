import React, {useEffect, useState} from 'react';
import {Autocomplete, Button, Container, TextField} from '@mui/material';
import {useNavigate} from 'react-router';
import CategoryDto from "../atoms/CategoryDto";
import {getCategories} from "../endpoints/Categories";
import {useLocation} from "react-router-dom";
import LocationAutocomplete from "./LocationAutocomplete";

interface itemSearchBarProps {
    handleSearchBar?: (searchTerm: string, categoryId?: number, latitude?: number, longitude?: number, distanceInMeters?: number) => void
}

const ItemSearchBar = ({handleSearchBar}: itemSearchBarProps) => {
    const location = useLocation();
    const params = new URLSearchParams(location.search)
    const categoryIdFromParams = Number(params.get("categoryId"))
    const searchTermFromParams = params.get("searchTerm")
    const longitudeFromParams = Number(params.get("longitude"))
    const latitudeFromParams = Number(params.get("latitude"))
    const rangeFromParams = Number(params.get("range"))
    const [searchTerm, setSearchTerm] = useState(searchTermFromParams === null ? '' : searchTermFromParams);
    const [categoryName, setCategoryName] = useState('')
    const [categoryNames, setCategoryNames] = useState<String[]>([])
    const [category, setCategory] = useState<CategoryDto | null>();
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [coordinates, setCoordinates] = useState<{
        longitude: number,
        latitude: number,
        range: number
    }| undefined>(() => {
        if (!isNaN(longitudeFromParams) && !isNaN(latitudeFromParams) && !isNaN(rangeFromParams)) {
            return {
                longitude: longitudeFromParams,
                latitude: latitudeFromParams,
                range: rangeFromParams
            };
        }
        return undefined;
    });

    useEffect(() => {
        // Pobranie listy kategorii z backendu
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const categories = await getCategories()
            setCategories(categories);
            setCategoryNames(categories.map(category => category.name));
            const foundCategory = categories.find(category => category.categoryId === categoryIdFromParams);
            if (foundCategory) {
                setCategory(foundCategory);
                setCategoryName(foundCategory.name)
            }
        } catch (e) {
            throw new Error("Exception during fetch categories")
        }
    };

    const navigate = useNavigate();
    const handleSearch = () => {
        let addressString = '/search/?'
        if (category) {
            addressString = addressString + `categoryId=${category.categoryId}&`
        }
        if (searchTerm != null) {
            addressString = addressString + `searchTerm=${searchTerm}&`
        }
        if (coordinates != null) {
            addressString = `${addressString}latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&range=${coordinates.range}&`
        }
        navigate(`${addressString}`); // Przekierowanie do ścieżki /search
        if (handleSearchBar) {
            handleSearchBar(searchTerm, category?.categoryId, coordinates?.latitude, coordinates?.longitude, coordinates?.range === undefined ? undefined : coordinates!.range * 1000);
        }
    };
    const getAndSetCoordinates = (coordinatesFromAutocomplete: {
        longitude: number,
        latitude: number,
        range: number
    }) => {
        setCoordinates(coordinatesFromAutocomplete);
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
                id="combo-box-demo"
                value={categoryName}
                options={categoryNames}
                sx={{width: 300}}
                onChange={(e, value) => {
                    if (value === null) {
                        setCategory(null);
                        setCategoryName("");
                    } else {
                        const selectedCategory = categories.find(category => category.name === value);
                        if (selectedCategory) {
                            setCategory(selectedCategory);
                            setCategoryName(selectedCategory.name);
                        }
                    }
                }}
                renderInput={(params) =>
                    <TextField {...params} label="Kategoria"/>}
            />
            <LocationAutocomplete onSet={getAndSetCoordinates}
                                  latLong={coordinates && coordinates.longitude && coordinates.latitude ? coordinates : undefined}
                                  withRange={true}/>
            <Button variant="contained" onClick={handleSearch} size="medium">
                Szukaj
            </Button>
        </div>
    );
};

export default ItemSearchBar;
