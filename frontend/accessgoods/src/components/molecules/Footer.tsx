import { Box, Typography } from '@mui/material';

const footerStyle = {
    backgroundColor: '#333',
    color: '#fff',
    textAlign: 'center',
    padding: '20px',
    width: '100%',
    position:'fixed',
    left:'0',
    bottom:'0',
    right:'0',
    z:'0',
    flexShrink: 0, // Zapobiega zbytniemu skurczowi stopki
};

const Footer = () => {
    return (
        <Box sx={{...footerStyle}}>
            <Typography variant="body1">© 2023 AccessGoods. All rights reserved.</Typography>
        </Box>
    );
};

export default Footer;

