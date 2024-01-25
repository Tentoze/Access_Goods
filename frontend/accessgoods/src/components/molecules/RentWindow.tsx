import React, {useEffect, useState} from 'react';
import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    Container,
    Menu,
    MenuItem,
    Rating,
    TextField,
    Typography
} from '@mui/material';
import {useNavigate} from "react-router";
import {getAccount} from "../endpoints/Accounts";
import {changeRentStatus, getChangeStatusPossibilities} from "../endpoints/Rents";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {Link} from "react-router-dom";
import SuccessDialog from "./SuccessDialog";
import AddOrEditOpinionDialog from "./AddOrEditOpinionDialog";
import {getOpinionForSpecificUserAndFeedbackTarget} from "../endpoints/Opinions";


interface rentWindowProps {
    rentDto: {
        id: number,
        itemId: number,
        itemName: string,
        itemPhoto: string,
        lendingAccountId: number,
        borrowingAccountId: number,
        rentTime: string,
        returnTime: string,
        rentStatus: string,
        totalCost: number
    }
}

const mapStatusToPolish = (status: string): string => {
    const statusMap: Record<string, string> = {
        TO_ACCEPT: 'Do akceptacji',
        IN_RENT: 'W wynajmie',
        CLOSED: 'Zamknięte',
        ACCEPTED: 'Zaakceptowane',
        CANCELLED: 'Anulowane',
        // Dodaj inne statusy, jeśli są dostępne
    };

    return statusMap[status] || status;
};

const mapPolishToStatus = (polishStatus: string): string => {
    const statusMap: Record<string, string> = {
        'Do akceptacji': 'TO_ACCEPT',
        'W wynajmie': 'IN_RENT',
        'Zamknięte': 'CLOSED',
        'Zaakceptowane': 'ACCEPTED',
        'Anulowane': 'CANCELLED',
        // Dodaj inne statusy, jeśli są dostępne
    };

    return statusMap[polishStatus] || polishStatus;
};

const RentWindow = ({rentDto}: rentWindowProps) => {
    // Stan do przechowywania informacji o użytkowniku
    const [currentAccountId, setCurrentAccountId] = useState<Number>();
    const [userDetails, setUserDetails] = useState<any>(null);
    const [statusMenuAnchorEl, setStatusMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [statusOptions, setStatusOptions] = useState<string[]>([]);
    const [rentStatus, setRentStatus] = useState<string>(
        mapStatusToPolish(rentDto.rentStatus)
    );
    const [successMessage, setSuccessMessage] = useState(false);
    const [rating, setRating] = useState<number | null>(0);
    const [isAddOpinionDialogOpen, setAddOpinionDialogOpen] = useState(false);
    const [feedbackTarget, setFeedbackTarget] = useState<string>()
    const [opinion, setOpinion] = useState<{ id: number, rating: number, description: string } | undefined>(undefined)


    const navigate = useNavigate();

    const checkCurrentAccountAndGetRentAccountInformation = async () => {
        try {
            const accountId = localStorage.getItem("accountId");
            if (accountId) {
                setCurrentAccountId(Number(accountId));
            } else {
                navigate("/")
            }
            const feedback = Number(accountId) === rentDto.lendingAccountId ? "LENDER" : "BORROWER";
            setFeedbackTarget(feedback);
            if (Number(accountId) === rentDto.lendingAccountId) {
                setUserDetails(await getAccount(rentDto.borrowingAccountId));
                setStatusOptions((await getChangeStatusPossibilities(rentDto.itemId)).map((status) => mapStatusToPolish(status)))
                try {
                    const data = await getOpinionForSpecificUserAndFeedbackTarget(rentDto.borrowingAccountId, feedback)
                    setOpinion(data);
                    setRating(data.rating);
                } catch (exception) {
                    return
                }
            } else {
                setUserDetails(await getAccount(rentDto.lendingAccountId));
                try {
                    const data = await getOpinionForSpecificUserAndFeedbackTarget(rentDto.lendingAccountId, feedback)
                    setOpinion(data);
                    setRating(data.rating);
                } catch (exception) {
                    return
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    const handleStatusMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setStatusMenuAnchorEl(event.currentTarget);

    };
    const setStatus = async () => {
        const englishStatus = mapPolishToStatus(rentStatus);
        const responseStatus = await changeRentStatus(rentDto.id, englishStatus);
        if (responseStatus === 200) {
            setSuccessMessage(true);
            setStatusOptions((await getChangeStatusPossibilities(rentDto.itemId)).map((status) => mapStatusToPolish(status)))
        }
    };

    const handleStatusMenuClose = () => {
        setStatusMenuAnchorEl(null);
    };

    const handleStatusChange = (status: string) => {
        setRentStatus(status)
        // Zamknięcie menu
        handleStatusMenuClose();
    };

    const handleAddOpinionDialogClose = () => {
        // Zamknij AddOrEditOpinionDialog
        setAddOpinionDialogOpen(false);
    };

    const handleRatingChange = (event: React.ChangeEvent<{}>, newValue: number | null) => {
        if(newValue !== 0 && newValue !== null){
            setRating(newValue);
        }
        // Otwórz AddOrEditOpinionDialog po zmianie oceny
        setAddOpinionDialogOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSuccessMessage(false);
        rentDto.rentStatus = rentStatus;
    };

    useEffect(
        () => {
            checkCurrentAccountAndGetRentAccountInformation();
        }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: 'auto',
                padding: '10px',
                backgroundColor: (currentAccountId === rentDto.lendingAccountId ? 'rgba(49,219,4,0.2)' : 'rgba(1, 1, 207,0.2)'),
                width: '600px', // Dostosuj szerokość okna według potrzeb
            }}
        >
            {/* Zdjęcie po lewej stronie */}
            {userDetails && (
                <Link to={`/item/${(rentDto.itemId)}`}>
                    <Avatar
                        variant="square"
                        alt={`${rentDto.itemName}`}
                        src={rentDto.itemPhoto}
                        sx={{width: 100, height: 100}}
                    />
                </Link>
            )}

            {/* Informacje o przedmiocie */}
            <Box sx={{flexGrow: 1}}>
                <Typography variant="h6">{rentDto.itemName}</Typography>
                {userDetails && (
                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                float: 'left'
                            }}
                        >
                            <Link to={`/account/${(userDetails.id)}`} style={{textDecoration: 'none', color: 'black'}}>
                                <Avatar
                                    alt={`${userDetails.firstName} ${userDetails.lastName}`}
                                    src={userDetails.photo}
                                    sx={{width: 32, height: 32, mr: 1, float: 'left'}}
                                />
                                <Typography sx={{textDecoration: 'none', float: 'left', paddingTop: '4px'}}>
                                    {userDetails.firstName} {userDetails.lastName}
                                </Typography>
                            </Link>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            float: 'right'
                        }}>
                            <Rating
                                name="rating"
                                value={rating}
                                onChange={handleRatingChange}
                            />

                            {/* DodajOpinieDialog otwiera się po zmianie oceny */}
                            {isAddOpinionDialogOpen && (
                                <AddOrEditOpinionDialog
                                    open={isAddOpinionDialogOpen}
                                    onClose={handleAddOpinionDialogClose}
                                    baseRating={rating === null ? undefined : rating}
                                    accountName={userDetails.firstName + " " + userDetails.lastName}
                                    feedbackTarget={feedbackTarget!}
                                    opinionReceiverAccountId={userDetails.id}
                                    opinionGiverAccountId={currentAccountId! as number}
                                    opinionId={opinion?.id}
                                    description={opinion?.description}
                                />
                            )}
                        </Box>
                    </Box>
                )}

                <br/>
                <br/>
                <Box sx={{marginBottom: '5px', float: 'left'}}>
                    <Typography sx={{float: 'left', marginRight: '5px'}}>Aktualny status: </Typography>
                    {userDetails && currentAccountId === rentDto.lendingAccountId && !(rentDto.rentStatus === "CLOSED" || rentDto.rentStatus === "CANCELLED") ? (
                        <Box sx={{float: 'left'}}>
                            <Button sx={{height: '1.5rem', marginTop: '-3px', paddingLeft: '8px', paddingRight: '8px'}}
                                    variant="contained"
                                    onClick={handleStatusMenuOpen} endIcon={<KeyboardArrowDownIcon/>}>
                                {rentStatus}
                            </Button>
                            <Menu
                                anchorEl={statusMenuAnchorEl}
                                open={Boolean(statusMenuAnchorEl)}
                                onClose={handleStatusMenuClose}
                                defaultValue={rentStatus}
                            >
                                {statusOptions.map((status, index) => (
                                    <MenuItem key={index} onClick={() => handleStatusChange(status)}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </Menu>
                            <Box sx={{float: 'right', marginLeft: '8px'}}>
                                {rentStatus !== rentDto.rentStatus ?
                                    (
                                        <Button sx={{
                                            float: 'right',
                                            height: '1.5rem',
                                            paddingLeft: '8px',
                                            paddingRight: '8px'
                                        }} variant="contained" onClick={setStatus}>
                                            Zapisz status
                                        </Button>)
                                    : (<div></div>)}
                            </Box>
                        </Box>
                    ) : <Typography sx={{float: 'left'}}>{rentStatus}</Typography>}
                </Box>
                <br/>
                <Box sx={{marginTop: '8.5px'}}>
                    <Typography sx={{float: ''}}>Cena rezerwacji: {rentDto.totalCost} PLN</Typography>
                    <Typography sx={{float: ''}}>Data rezerwacji
                        od: <b>{rentDto.rentTime} </b> do: <b>{rentDto.returnTime}</b></Typography>
                </Box>
            </Box>
            <div><SuccessDialog open={successMessage} onClose={handleCloseSnackbar}
                                textOnSuccess={"Udało sie zmienic status"}/>
            </div>
        </Box>


    );
};

export default RentWindow;