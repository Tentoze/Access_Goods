import React, { useState } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormGroup,
    FormControlLabel,
    TextField,
    Button,
    Box
} from '@mui/material';

interface SidebarProps {
    handleFilters: (filters: any) => void; // Określ typ właściwości handleFilters
}
const marginBottom = {
    marginBottom: '16px',
};
const positionFlex = {
    position: 'static',
};


const Sidebar: React.FC<SidebarProps> = ({ handleFilters }) => {
    const [sortOption, setSortOption] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [verifiedUser, setVerifiedUser] = useState(false);
    const [hasPhoto, setHasPhoto] = useState(false);
    const [deliveryOption, setDeliveryOption] = useState('');

    const handleApplyFilters = () => {
        const filters = {
            sortOption,
            minPrice,
            maxPrice,
            verifiedUser,
            hasPhoto,
            deliveryOption,
        };
        handleFilters(filters);
    };

    return (
        <Box>
            <FormControl fullWidth className="pt-6">
                <InputLabel id="sort-label">Sortowanie</InputLabel>
                <Select
                    labelId="sort-label"
                    id="sort-option"
                    value={sortOption}
                    label="Sortowanie"
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <MenuItem value="lowestPrice">Najniższa cena</MenuItem>
                    <MenuItem value="highestPrice">Najwyższa cena</MenuItem>
                    <MenuItem value="highestRating">Najwyższa ocena</MenuItem>
                </Select>
            </FormControl>
            <br/>
            <br/>

            <TextField
                label="Cena od"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
            />
            <br/>
            <br/>
            <TextField
                label="Cena do"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
            />
            <br/>
            <br/>
            <FormGroup>
                <FormControlLabel
                    control={<Checkbox checked={verifiedUser} onChange={(e) => setVerifiedUser(e.target.checked)} />}
                    label="Użytkownik zweryfikowany"
                />
                <FormControlLabel
                    control={<Checkbox checked={hasPhoto} onChange={(e) => setHasPhoto(e.target.checked)} />}
                    label="Użytkownik posiadający zdjęcie"
                />
            </FormGroup>
            <FormControl fullWidth>
                <InputLabel id="delivery-label">Dostawa/Odbiór osobisty</InputLabel>
                <Select
                    labelId="delivery-label"
                    id="delivery-option"
                    value={deliveryOption}
                    label="Dostawa/Odbiór osobisty"
                    onChange={(e) => setDeliveryOption(e.target.value)}
                >
                    <MenuItem value="delivery">Z dostawą</MenuItem>
                    <MenuItem value="pickup">Odbiór osobisty</MenuItem>
                </Select>
            </FormControl>
            <Button variant="contained" onClick={handleApplyFilters}>
                Zastosuj filtry
            </Button>
        </Box>
    );
};

export default Sidebar;
