import React, {useState} from 'react';
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


const Sidebar: React.FC<SidebarProps> = ({handleFilters}) => {
    const [sortOption, setSortOption] = useState('NONE');
    const [priceFrom, setPriceFrom] = useState<Number | null>(null);
    const [priceTo, setPriceTo] = useState<Number | null>(null);
    const [verifiedUser, setVerifiedUser] = useState<boolean | undefined>();
    const [userHasPhoto, setUserHasPhoto] = useState<boolean | undefined>();
    const [deliveryType, setDeliveryType] = useState('');

    const handleApplyFilters = () => {
        const filters = {
            sortOption,
            priceFrom,
            priceTo,
            verifiedUser,
            userHasPhoto,
            deliveryType,
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
                    onChange={(e) => setSortOption(e.target.value)}>
                    <MenuItem value="PRICE_ASC">Najniższa cena</MenuItem>
                    <MenuItem value="PRICE_DESC">Najwyższa cena</MenuItem>
                    <MenuItem value="OPINION_DESC">Najwyższa ocena</MenuItem>
                </Select>
            </FormControl>
            <br/>
            <br/>

            <TextField
                label="Cena od"
                type="number"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value === null ? null : Number(e.target.value) === 0 ? null : Number(e.target.value))}
            />
            <br/>
            <br/>
            <TextField
                label="Cena do"
                type="number"
                value={priceTo}
                onChange={(e) => setPriceTo(e.target.value === null ? null : Number(e.target.value) === 0 ? null : Number(e.target.value))}
            />
            <br/>
            <br/>
            <FormGroup>
                <FormControlLabel
                    control={<Checkbox checked={verifiedUser} onChange={(e) => setVerifiedUser(e.target.checked)}/>}
                    label="Użytkownik zweryfikowany"
                />
                <FormControlLabel
                    control={<Checkbox checked={userHasPhoto} onChange={(e) => setUserHasPhoto(e.target.checked)}/>}
                    label="Użytkownik posiadający zdjęcie"
                />
            </FormGroup>
            <FormControl fullWidth>
                <InputLabel id="delivery-label">Dostawa/Odbiór osobisty</InputLabel>
                <Select
                    labelId="delivery-label"
                    id="delivery-option"
                    value={deliveryType}
                    label="Dostawa/Odbiór osobisty"
                    onChange={(e) => setDeliveryType(e.target.value)}
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
