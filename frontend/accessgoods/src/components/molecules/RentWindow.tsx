import React, {useEffect, useState} from 'react';
import {Autocomplete, Avatar, Box, Button, Container, Menu, MenuItem, TextField, Typography} from '@mui/material';
import {useNavigate} from "react-router";
import {getAccount} from "../endpoints/Accounts";
import {getChangeStatusPossibilities} from "../endpoints/Rents";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


interface rentWindowProps {
    rentDto: {
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

const RentWindow = ({rentDto}: rentWindowProps) => {
    // Stan do przechowywania informacji o użytkowniku
    const [currentAccountId, setCurrentAccountId] = useState<Number>();
    const [userDetails, setUserDetails] = useState<any>(null);
    const [statusMenuAnchorEl, setStatusMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [statusOptions, setStatusOptions] = useState<string[]>([]);
    const [rentStatus, setRentStatus] = useState<string>(rentDto.rentStatus);



    const navigate = useNavigate();

    const checkCurrentAccountAndGetRentAccountInformation = async () => {
        try {
            const accountId = localStorage.getItem("accountId");
            if (accountId) {
                setCurrentAccountId(Number(accountId));
            } else {
                navigate("/")
            }
            if (Number(accountId) === rentDto.lendingAccountId) {
                console.log(rentDto.borrowingAccountId)
                setUserDetails(await getAccount(rentDto.borrowingAccountId));
                setStatusOptions(await getChangeStatusPossibilities(rentDto.itemId))
            } else {
                console.log(rentDto.lendingAccountId)

                setUserDetails(await getAccount(rentDto.lendingAccountId));
            }
        } catch (e) {
            console.log(e)
        }
    }

    const handleStatusMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setStatusMenuAnchorEl(event.currentTarget);
    };

    const handleStatusMenuClose = () => {
        setStatusMenuAnchorEl(null);
    };

    const handleStatusChange = (status: string) => {
        setRentStatus(status)

        // Zamknięcie menu
        handleStatusMenuClose();
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
                <Avatar
                    variant="square"
                    alt={`${rentDto.itemName}`}
                    src={rentDto.itemPhoto}
                    sx={{width: 100, height: 100}}
                />
            )}

            {/* Informacje o przedmiocie */}
            <Box sx={{flexGrow: 1}}>
                <Typography variant="h6">{rentDto.itemName}</Typography>
                <Typography>
                    {userDetails && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            {/* Zdjęcie i imię/nazwisko użytkownika */}
                            <Avatar
                                alt={`${userDetails.firstName} ${userDetails.lastName}`}
                                src={userDetails.photo}
                                sx={{width: 32, height: 32, mr: 1}}
                            />
                            <Typography>
                                {userDetails.firstName} {userDetails.lastName}
                            </Typography>
                        </Box>
                    )}
                </Typography>

                <Typography >Aktualny status:
                    {userDetails && currentAccountId === rentDto.lendingAccountId ? (
                        <Box sx={{float: 'right',gap: '8px'}}>
                            <Button sx={{height: '1.5rem',paddingLeft: '8px', paddingRight:'8px'}} variant="contained" onClick={handleStatusMenuOpen} endIcon={<KeyboardArrowDownIcon/>}>
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
                            <Box sx={{float: 'right',marginLeft: '8px'}}>
                                {rentStatus !== rentDto.rentStatus ?
                                    (
                                    <Button sx={{float:'right',height: '1.5rem',paddingLeft: '8px', paddingRight:'8px'}} variant="contained" onClick={handleStatusMenuOpen}>
                                        Zapisz status
                                    </Button>)
                                : (<div></div>)}
                            </Box>
                        </Box>
                    ) : rentDto.rentStatus}
                </Typography>

                <Typography>Cena rezerwacji: {rentDto.totalCost} PLN</Typography>
            </Box>
        </Box>
    );
};

export default RentWindow;