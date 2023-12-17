import React from 'react';
import { Box, IconButton, Dialog, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface SuccessDialogProps {
    open: boolean;
    onClose: () => void;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ open, onClose }) => {
    const handleClose = () => {
        onClose();
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
                <IconButton
                    aria-label="Close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h2" color="primary" sx={{ textAlign: 'center' }}>
                    Sukces
                </Typography>
                <Typography variant="h6" mt={2} sx={{ textAlign: 'center' }}>
                    Rejestracja zakończona pomyślnie. Link aktywacyjny został wysłany na Twój adres e-mail.
                </Typography>
            </Box>
        </Dialog>
    );
};

export default SuccessDialog;