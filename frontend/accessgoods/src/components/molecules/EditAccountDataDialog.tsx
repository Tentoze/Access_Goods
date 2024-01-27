import React, {useState} from 'react';
import {
    Box,
    IconButton,
    Dialog,
    Typography,
    Rating,
    Button,
    TextField, InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {addOpinion, deleteOpinion, editOpinion} from "../endpoints/Opinions";
import LocationAutocomplete from "./LocationAutocomplete";
import ImageUpload from "./ImageUpload";
import {register} from "../endpoints/endpoints";
import {updateAccountData} from "../endpoints/Accounts";
import SuccessDialog from "./SuccessDialog";

interface EditAccountDataDialogProps {
    open: boolean;
    onClose: () => void;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    photoSrc: string;
    latitude: number;
    longitude: number;
    address: string;
}

const EditAccountDataDialog: React.FC<EditAccountDataDialogProps> = ({
                                                                         open,
                                                                         onClose,
                                                                         email,
                                                                         firstName,
                                                                         lastName,
                                                                         phoneNumber,
                                                                         photoSrc,
                                                                         latitude,
                                                                         longitude,
                                                                         address
                                                                     }) => {

    const [emailEdit, setEmailEdit] = useState(email);
    const [firstNameEdit, setFirstNameEdit] = useState(firstName);
    const [lastNameEdit, setLastNameEdit] = useState(lastName);
    const [phoneEdit, setPhoneEdit] = useState(phoneNumber);
    const [latitudeEdit, setLatitudeEdit] = useState(latitude);
    const [longitudeEdit, setLongitudeEdit] = useState(longitude);
    const [imageSrcEdit, setImageSrcEdit] = useState<string>(photoSrc);
    const [locationAddress, setLocationAddress] = useState(address);
    const [successMessage, setSuccessMessage] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        location: '',
        phoneNumber: '',
        // ... inne pola z błędami
    });


    const handleClose = () => {
        onClose();
    };

    const getAndSetCoordinates = (coordinatesFromAutocomplete: {
        longitude: number,
        latitude: number,
        range: number
    }) => {
        setLatitudeEdit(coordinatesFromAutocomplete.latitude);
        setLongitudeEdit(coordinatesFromAutocomplete.longitude);
    };

    const getAndSetAddress = (address: string) => {
        setLocationAddress(address);
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()
        // Walidacja (przykład)
        if (!emailEdit.includes('@')) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: 'Niepoprawny format adresu email',
            }));
            return;
        }

        if (latitudeEdit === undefined || longitudeEdit === undefined) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                location: 'Lokalizacja musi być uzupełniona',
            }));
            return;
        }
        if (isNaN(Number(phoneEdit)) || phoneEdit.length !== 9) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                phoneNumber: 'Numer telefonu musi składać się z 9 cyfr',
            }));
            return;
        }

        const response = await updateAccountData(Number(localStorage.getItem("accountId")), emailEdit, firstNameEdit, lastNameEdit, phoneEdit, imageSrcEdit, longitudeEdit, latitudeEdit, locationAddress)
        if (response.responseStatus === 200) {
            if (email !== emailEdit) {
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('accountId');
            }
            setSuccessMessage(true);
            setTimeout(() => {
                window.location.reload();
            }, 5000);
        } else {
            if (response.responseData === "Email is already taken.") {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    email: 'Email jest już użyty',
                }));
            }
            if (response.responseData === "Wrong email.") {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    email: 'Niepoprawny format adresu email',
                }));
            }
        }
        return;
    };

    const handleCloseSnackbar = () => {
        setSuccessMessage(false);

    };

    async function handleEditAccountData() {
        onClose();
    }

    const handleImageSrc = (src: string) => {
        setImageSrcEdit(src);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'relative',
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '5px',
                }}
            >
                <form onSubmit={(e) => handleSubmit(e)} style={{maxWidth: '400px', width: '100%'}}>
                    <Typography variant="h5" gutterBottom>
                        Edytuj swoje dane
                    </Typography>
                    <TextField sx={{paddingBottom: '6px'}}
                               label="Email"
                               variant="outlined"
                               value={emailEdit}
                               onChange={(e) => setEmailEdit(e.target.value)}
                               error={!!errors.email}
                               helperText={errors.email}
                               fullWidth
                               required
                    />

                    <TextField
                        sx={{paddingBottom: '6px'}}
                        label="Imię"
                        variant="outlined"
                        value={firstNameEdit}
                        onChange={(e) => setFirstNameEdit(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        sx={{paddingBottom: '6px'}}
                        label="Nazwisko"
                        variant="outlined"
                        value={lastNameEdit}
                        onChange={(e) => setLastNameEdit(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        sx={{paddingBottom: '6px'}}
                        label="Numer telefonu"
                        variant="outlined"
                        value={phoneEdit}
                        onChange={(e) => setPhoneEdit(e.target.value)}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber}
                        fullWidth
                    />
                    <LocationAutocomplete onSet={getAndSetCoordinates} withRange={false}
                                          latLong={{latitude, longitude, range: 0}}
                                          setAddressOnSelect={getAndSetAddress} error={errors.location}/>
                    <Typography variant="h6"> Zdjęcie: </Typography>
                    {/* Komponent do dodawania zdjęć */}
                    <Box sx={{marginTop: '-35px', marginLeft: '100px', textAlign: 'center'}}>
                        <ImageUpload onImageSrc={handleImageSrc} currentImageSrc={imageSrcEdit}/>
                    </Box>

                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto',}}>
                        <Button variant="contained" type="submit"
                                style={{marginTop: '20px'}}>
                            Edytuj dane
                        </Button>
                    </Box>
                </form>
            </Box>
            <div>
                <SuccessDialog open={successMessage} onClose={handleCloseSnackbar}
                               textOnSuccess={"Zmiana danych zakończona pomyślnie." + (emailEdit !== email ? " \nEmail został zmieniony prosimy o ponowne zalogowanie." : "")}/>
            </div>
        </Dialog>
    );
};

export default EditAccountDataDialog;
