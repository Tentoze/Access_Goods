import React, {useEffect, useState} from 'react';
import {Paper, Avatar, Typography, Box, Rating} from '@mui/material';
import {deepOrange} from '@mui/material/colors';
import {getAccount} from "../endpoints/Accounts";
import {addOpinion} from "../endpoints/Opinions";

interface OpinionWindowProps {
    opinion: {
        id: number,
        rating: number,
        description: string,
        opinionGiverAccountId: number,
        opinionReceiverAccountId: number,
        feedbackTarget: string,
    };
}

const OpinionWindow: React.FC<OpinionWindowProps> = ({opinion}) => {

    const [userDetails, setUserDetails] = useState<any>(null);

    const fetchUserOpinionDetails = async () => {
        setUserDetails(await getAccount(opinion.opinionGiverAccountId));
    };

    useEffect(
        () => {
            fetchUserOpinionDetails();
        }, []);

    return (
        <Box sx={{p: 2, mb: 2,  width: '40rem', margin:'10px',border: '1px solid rgb(128,128,128,0.3)',  }}>
            {/* Avatar */}
            <Box sx={{paddingBottom:'4px'}}>
            {userDetails &&
                <Box sx={{paddingBottom:'4px'}}>
                    <Avatar src={userDetails.photo} sx={{float: 'left', bgcolor: deepOrange[500], marginRight: 2}}/>
                    <Typography sx={{float: 'left'}}
                                variant="body1"> {userDetails.firstName} {userDetails.lastName}</Typography>
                </Box>

            }
                <br/>
                <Rating sx={{float:'left'}} name="rating" value={opinion.rating} precision={0.5} readOnly/>
            {/* Komentarz opinii */}
            </Box>
            <br/>
                <Typography variant="body1">{opinion.description}</Typography>

        </Box>
    );
};

export default OpinionWindow;
