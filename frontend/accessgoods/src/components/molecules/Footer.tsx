import { Box, Typography } from '@mui/material';

const Footer = () => {
    const footerStyle = {
        backgroundColor: '#333',
        color: '#fff',
        textAlign: 'center',
        padding: '20px',
        width: '100%',
        position: 'fixed',
        bottom: 0,
    };

    return (
        <Box sx={footerStyle}>
            <Typography variant="body1">© 2023 AccessGoods. All rights reserved.</Typography>
        </Box>
    );
};

export default Footer;
