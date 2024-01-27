import React, {useEffect, useState} from 'react';
import {AppBar, Toolbar, Typography, Button, Theme, makeStyles, Menu, MenuItem, useScrollTrigger} from '@mui/material';
import {Link} from 'react-router-dom';
import Login from "../structures/Login";
import {useNavigate} from "react-router";


const Header = () => {
    const [showPopUp, setShowPopUp] = useState(false);
    const [jwtToken, setJwtToken] = useState<String | null>(localStorage.getItem('jwtToken'));
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLoginClick = () => {
        setShowPopUp(true);
    };

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const logoutUser = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('accountId');
        setJwtToken(null)
        handleClose();
    };
    const rentNewItem = () => {
        handleClose();
        navigate('/rent-new-item');
    };
    const myItems = () => {
        handleClose()
        navigate('/my-items')
    }
    const myRents = () => {
        handleClose()
        navigate('/my-rents')
    }
    const myChats = () => {
        handleClose()
        navigate('/my-chats')
    }
    const goToCurrentRents = () => {
        handleClose();
    };

    const handleClosePopUp = () => {
        setShowPopUp(false);
        setJwtToken(localStorage.getItem('jwtToken'));
    };
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/'); // Przekierowanie do ścieżki /search
    };

    const loginButtonStyle = {
        marginLeft: 'auto', // Przesunięcie przycisku na prawo
        color: '#2196f3', // Kolor tekstu na niebieski
        border: '1px solid white', // Biała obramówka
        borderRadius: '4px', // Zaokrąglenie krawędzi
        backgroundColor: 'white',
        '&:hover': {
            border: '#CCFFFF',
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Tło po najechaniu myszką
            color: '#2196f3', // Kolor tekstu po najechaniu myszką
        },
    };

    function myAccount() {
        handleClose()
        navigate(`/account/${Number(localStorage.getItem('accountId'))}`)
        window.location.reload();
    }

    return (

        <AppBar position="static" >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" onClick={handleGoBack} style={{ cursor: 'pointer' }}>
                    AccessGoods
                </Typography>

                {jwtToken !== null && (
                    <div>
                        <Button color="inherit" onClick={handleClick} sx={loginButtonStyle}>
                            Moje konto
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem onClick={logoutUser}>Wyloguj</MenuItem>
                            <MenuItem onClick={rentNewItem}>Wystaw przedmiot</MenuItem>
                            <MenuItem onClick={myItems}>Moje Przedmioty</MenuItem>
                            <MenuItem onClick={myRents}>Moje Wypożyczenia</MenuItem>
                            <MenuItem onClick={myChats}>Moje Wiadomości</MenuItem>
                            <MenuItem onClick={myAccount}>Mój profil</MenuItem>
                        </Menu>
                    </div>
                )}
                {
                    jwtToken === null && (
                        <Button onClick={handleLoginClick} color="inherit" sx={loginButtonStyle}>
                            Zaloguj się
                        </Button>)
                }
                {showPopUp && <Login open={showPopUp} onClose={handleClosePopUp}/>} {/* Dodanie komponentu PopUp */}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
