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

interface AddOpinionDialogProps {
    open: boolean;
    onClose: () => void;
    baseRating?: number;
    accountName?: string;
    opinionGiverAccountId: number;
    opinionReceiverAccountId: number;
    feedbackTarget: string;
    opinionId?: number;
    description?: string;

}

const AddOrEditOpinionDialog: React.FC<AddOpinionDialogProps> = ({
                                                                     open,
                                                                     onClose,
                                                                     baseRating,
                                                                     accountName,
                                                                     opinionGiverAccountId,
                                                                     opinionReceiverAccountId,
                                                                     feedbackTarget,
                                                                     opinionId,
                                                                     description
                                                                 }) => {
    const [rating, setRating] = useState<number | null>(baseRating === undefined ? null : baseRating);
    const [comment, setComment] = useState<string>(description === undefined ? '' : description);

    const handleClose = () => {
        onClose();
    };

    const handleAddOpinion = async () => {
        await addOpinion(rating!, comment, opinionGiverAccountId, opinionReceiverAccountId, feedbackTarget)
        onClose();
    };

    async function handleEditOpinion() {
        await editOpinion(opinionId!, rating!, comment, opinionGiverAccountId, opinionReceiverAccountId, feedbackTarget);
        onClose();

    }

    async function handleDeleteOpinion() {
        await deleteOpinion(opinionId!);
        onClose();
    }

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
                    <CloseIcon/>
                </IconButton>
                {opinionId === undefined ?
                    <Typography variant="h4" color="primary" sx={{textAlign: 'center'}}>
                        Dodaj opinię dla użytkownika
                        <br/>
                        {accountName}
                    </Typography> :
                    <Typography variant="h4" color="primary" sx={{textAlign: 'center'}}>
                        Edytuj opinię dla użytkownika
                        <br/>
                        {accountName}
                    </Typography>
                }

                <Box sx={{mt: 2, textAlign: 'center'}}>
                    <Typography variant="subtitle1">Ocena:</Typography>
                    <Rating
                        name="rating"
                        value={rating}
                        onChange={(event, newValue) => setRating(newValue)}
                    />
                </Box>

                <Box sx={{mt: 2}}>
                    <TextField
                        label="Komentarz (maks. 100 znaków)"
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                        inputProps={{maxLength: 100}}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Typography variant="caption">
                                        {comment.length}/100
                                    </Typography>
                                </InputAdornment>
                            ),
                        }} value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </Box>

                {opinionId === undefined ?
                    <Box sx={{mt: 2, textAlign: 'center'}}>
                        <Button variant="contained" color="primary" onClick={handleAddOpinion}>
                            Dodaj Opinię
                        </Button>
                    </Box> :
                    <Box sx={{mt: 2, textAlign: 'center'}}>
                        <Button variant="contained" color="primary" onClick={handleEditOpinion}>
                            Edytuj opinię
                        </Button>
                        <Button sx={{
                            marginLeft: '8px',
                            backgroundColor: 'red',
                            '&:hover': {
                                backgroundColor: 'rgba(207, 2, 2)', // Zmniejszenie przejrzystości podczas najechania
                            },}}
                                variant="contained" onClick={handleDeleteOpinion}>
                            Usuń opinię
                        </Button>
                    </Box>
                }
            </Box>
        </Dialog>
    );
};

export default AddOrEditOpinionDialog;
