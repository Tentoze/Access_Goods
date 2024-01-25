import React, {useEffect, useState} from 'react';
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from 'react-places-autocomplete';
import {Box, Dialog, DialogContent, DialogTitle, InputAdornment, TextField, Typography} from "@mui/material";
interface locationAutocompleteProps {
    onSet: (coordinates: {longitude: number,
        latitude: number, range: number}) => void;
    latLong?: {
        latitude: number;
        longitude: number;
        range: number;
    }
    withRange: boolean;
    setAddressOnSelect?: (address: string) => void;
    error?: string;

}
const LocationAutocomplete = ({onSet,latLong,withRange,setAddressOnSelect,error}: locationAutocompleteProps) => {
    const [address, setAddress] = useState<string>('');
    const [coordinates, setCoordinates] = useState<{ latitude: number,
        longitude: number}>();
    const [range, setRange] = useState<number|undefined>(5);

    useEffect(() => {
        console.log(latLong)
        if (latLong?.latitude !== undefined && latLong?.longitude !== undefined) {
            (async () => {
                try {
                    const results = await geocodeByAddress(`${latLong.latitude}, ${latLong.longitude}`);
                    const address = results[0]?.formatted_address || '';
                    setAddress(address);
                    setCoordinates({latitude: latLong.latitude, longitude: latLong.longitude})
                } catch (error) {
                    console.error('Error:', error);
                }
            })();
        }
    }, []);
    const handleSelect = async (value: string) => {
        setAddress(value);
        try {
            const results = await geocodeByAddress(value);
            const latLng = await getLatLng(results[0]);
            setCoordinates({
                latitude: latLng.lat,
                longitude: latLng.lng,
            });
            onSet({ latitude: latLng.lat, longitude: latLng.lng, range: range === undefined ? 5 : range })
            setAddressOnSelect && setAddressOnSelect(value)
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        if(isNaN(value)) {
            setRange(undefined)
            return
        }
        if (value > 0) {
            setRange(value);
        }
        else {
            setRange(0);
        }
        console.log("XD")
        onSet({ latitude: coordinates!.latitude, longitude: coordinates!.longitude, range: value === undefined ? 5 : value })
    };

    return (
        <div>
            <Box sx={{float:'left'}}>
            <PlacesAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={handleSelect}
                searchOptions={{
                  //  types: ['(regions)'],
                    componentRestrictions: {country: 'PL'},

                    // Ogranicz wyszukiwanie tylko do Polski
                }}
            >
                {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                    <div style={{position: 'relative', width: (withRange ? 300 : 400),float: 'left'}}>
                        <TextField
                            {...getInputProps({placeholder: 'Wpisz lokalizację...', sx: {width: '100%'}})}
                            variant="outlined"
                            label="Lokalizacja"
                        />
                        {error && <div style={{position:'relative', color: 'red',  }}>{error}</div>}
                        <div style={{ position: 'absolute', top: 50, left: 0, right: 0, zIndex: 1 }}>
                                                      {loading ? <div>Ładowanie...</div> : null}
                            {suggestions.map((suggestion) => {
                                const style = {
                                    backgroundColor: suggestion.active ? '#41b6e6' : '#fff',
                                    padding: '8px',
                                    marginTop: '1px',
                                    borderBottom: '2px solid #ccc',
                                    cursor: 'pointer',
                                };
                                return (
                                    <div
                                        {...getSuggestionItemProps(suggestion, {style})}
                                    >
                                        {suggestion.description}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
                {coordinates && withRange && <TextField
                    label="Zasięg"
                    value={range}
                    onChange={handleRangeChange}
                    sx={{ marginLeft: '8px',float: 'right',width: '80px' }}
                    inputProps={{maxLength: 60,style: { appearance: 'textfield' },}}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Typography sx={{marginTop:'5px'}} variant="caption">
                                    km
                                </Typography>
                            </InputAdornment>
                        ),
                    }}
                />
                }

            </Box>
        </div>
    );
};

export default LocationAutocomplete;
