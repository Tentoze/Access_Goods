import React, {useState} from 'react';
import {Box, Button, Dialog, Snackbar, TextField, Typography} from '@mui/material';
import ImageUpload from "../components/molecules/ImageUpload";
import Header from "../components/molecules/Header";
import ItemSearchBar from "../components/molecules/ItemSearchBar";
import Footer from "../components/molecules/Footer";
import {useNavigate} from "react-router";
import SuccessDialog from "../components/molecules/SuccessDialog";
import {register} from "../components/endpoints/endpoints";
import LocationAutocomplete from "../components/molecules/LocationAutocomplete";

// ... (Komponent ImageUpload)
const homeContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '30px',
    paddingBottom: '60px',
};
const Registration = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [imageSrc, setImageSrc] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState(false);
    const [coordinates, setCoordinates] = useState<{
        longitude: number,
        latitude: number,
        address: string
    }| undefined>();

    const getAndSetCoordinates = (coordinatesFromAutocomplete: {
        longitude: number,
        latitude: number,
        range: number
    }) => {
        setCoordinates({longitude: coordinatesFromAutocomplete.longitude,
        latitude: coordinatesFromAutocomplete.latitude,address: ''});
    };
    const getAndSetAddress = (address: string) => {
        setCoordinates((prevCoordinates) =>
            prevCoordinates
                ? { ...prevCoordinates, address: address }
                : undefined
        );
    };

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        location: '',
        phoneNumber: '',
        // ... inne pola z błędami
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()
        // Walidacja (przykład)
        if (!email.includes('@')) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: 'Niepoprawny format adresu email',
            }));
            return;
        }
        if (password.length < 8 || !/\d/.test(password)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                password: 'Hasło powinno zawierać przynajmniej 8 znaków, w tym 1 cyfrę',
            }));
            return;
        }
        if(coordinates === undefined || coordinates.latitude === undefined || coordinates.longitude === undefined){
            setErrors((prevErrors) => ({
                ...prevErrors,
                location: 'Lokalizacja musi być uzupełniona',
            }));
            return;
        }
        if (isNaN(Number(phone)) || phone.length !== 9) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                phoneNumber: 'Numer telefonu musi składać się z 9 cyfr',
            }));
            return;
        }

        const response = await register(email, password, firstName, lastName, phone, imageSrc,coordinates!.longitude,coordinates!.latitude, coordinates!.address)
        if (response === 200) {
            setSuccessMessage(true);
        } else {

        }
        return;
    };
    const handleImageSrc = (src: string) => {
        setImageSrc(src);
    };
    const navigate = useNavigate();

    const handleCloseSnackbar = () => {
        setSuccessMessage(false);
        navigate('/')
    };

    return (
        <div>
            <Header/>
            <Box sx={homeContentStyle}>
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #ccc', padding: '20px'}}>
                    <form onSubmit={(e) => handleSubmit(e)} style={{maxWidth: '400px', width: '100%'}}>
                        <Typography variant="h5" gutterBottom>
                            Rejestracja
                        </Typography>
                        <TextField sx={{paddingBottom:'6px'}}
                            label="Email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                            fullWidth
                            required
                        />

                        <TextField
                            sx={{paddingBottom:'6px'}}
                            label="Imię"
                            variant="outlined"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            sx={{paddingBottom:'6px'}}
                            label="Nazwisko"
                            variant="outlined"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            sx={{paddingBottom:'6px'}}
                            label="Hasło"
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
                            fullWidth
                            required
                        />
                        <TextField
                            sx={{paddingBottom:'6px'}}
                            label="Numer telefonu"
                            variant="outlined"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            fullWidth
                        />
                        <LocationAutocomplete onSet={getAndSetCoordinates} withRange={false} setAddressOnSelect={getAndSetAddress}  error={errors.location} />
                        <Typography variant="h6" > Zdjęcie: </Typography>
                        {/* Komponent do dodawania zdjęć */}
                        <Box  sx={{marginTop:'-35px',marginLeft: '100px', textAlign: 'center' }}>
                            <ImageUpload onImageSrc={handleImageSrc}/>
                        </Box>


                        <Button sx={{ marginLeft: '120px', textAlign: 'center' }} variant="contained" type="submit" style={{marginTop: '20px'}}>
                            Zarejestruj się
                        </Button>
                    </form>
                </Box>
                <div>
                    <SuccessDialog open={successMessage} onClose={handleCloseSnackbar} textOnSuccess={"Rejestracja zakończona pomyślnie. Link aktywacyjny został wysłany na Twój adres e-mail."}/>
                </div>
            </Box>
            <Footer/>
        </div>
    );
};

export default Registration;
