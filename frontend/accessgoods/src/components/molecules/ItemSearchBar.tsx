import React, {useEffect, useState} from 'react';
import {Autocomplete, Button, Container, TextField} from '@mui/material';
import {useNavigate} from 'react-router';
import CategoryDto from "../atoms/CategoryDto";
import {getCategories} from "../endpoints/Categories";
import {useLocation} from "react-router-dom";

interface itemSearchBarProps{
    handleSearchBar?: (searchTerm: string, categoryId?: number) => void
}
const ItemSearchBar = ({handleSearchBar}: itemSearchBarProps) => {
    const location = useLocation();
    const params = new URLSearchParams(location.search)
    const categoryIdFromParams = Number(params.get("categoryId"))
    const searchTermFromParams = params.get("searchTerm")
    const [searchTerm, setSearchTerm] = useState(searchTermFromParams === null ? '' : searchTermFromParams);
    const [categoryName, setCategoryName] = useState('')
    const [categoryNames, setCategoryNames] = useState<String[]>([])
    const [category, setCategory] = useState<CategoryDto | null>();
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    useEffect(() => {
        // Pobranie listy kategorii z backendu
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const categories = await getCategories()
            setCategories(categories);
            setCategoryNames(categories.map(category => category.name));
            console.log(categoryNames)
            const foundCategory = categories.find(category => category.categoryId === categoryIdFromParams);
            if (foundCategory) {
                setCategory(foundCategory);
                setCategoryName(foundCategory.name)
            }
            console.log(foundCategory)
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
        navigate(`${addressString}`); // Przekierowanie do ścieżki /search
        if (handleSearchBar) {
            handleSearchBar(searchTerm,category?.categoryId);
        }
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
            <Button variant="contained" onClick={handleSearch} size="medium">
                Szukaj
            </Button>
        </div>
    );
};

export default ItemSearchBar;
