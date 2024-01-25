import React from 'react';
import {Box, Button, Card, CardContent, CardMedia, Rating, Typography} from '@mui/material';
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";

const cardStyle = {
    padding: '0px',
    borderRadius: '5px',
};

class ItemWindow extends React.Component<{ item: any, currentAccountId?: Number, notShowAccountInformation?: boolean }> {
    render() {
        let {item} = this.props;
        let currentAccountIdProp = this.props.currentAccountId;
        const {images, name, pricePerDay, rating, accountFirstName, accountImage, itemId, accountId} = item;

        return (
            <Card style={{border: '1px solid #ccc', padding: '5px'}}>
                <CardContent>
                    <CardMedia component="img" image={images[0].image} alt={name}
                               style={{objectFit: 'cover', width: '100%', maxWidth: '500px', maxHeight:'800px'}}/>
                    <Typography gutterBottom variant="h5" component="div">
                        {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Cena za dzień: {pricePerDay} PLN
                    </Typography>
                    <Box>
                        <Typography sx={{float: 'left'}} variant="body2" color="text.secondary">
                            Ocena:
                        </Typography>
                        <Rating sx={{float: 'left',paddingTop:'1px', height: '10px'}} size="small" name="rating" value={rating} precision={0.5} readOnly/>
                    </Box>
                    <br/>
                    {!this.props.notShowAccountInformation &&
                        <Link to={`/account/${(accountId)}`} style={{textDecoration: 'none', color: 'black'}}>
                            <Box display="flex" alignItems="center">
                                <img src={accountImage} alt={accountFirstName}
                                     style={{width: '30px', height: '30px', borderRadius: '50%', marginRight: '5px'}}/>
                                <Typography variant="body2" color="text.secondary">
                                    {accountFirstName}
                                </Typography>
                            </Box>
                        </Link>}
                    <Box sx={{alignItems: 'center'}}>
                        <Link to={`/item/${itemId}`}>
                            <Button variant="contained">
                                Zobacz więcej
                            </Button>
                        </Link>
                        {currentAccountIdProp &&
                            <Link to={`/edit-item/${itemId}`}>
                                <Button sx={{
                                    backgroundColor: 'red',
                                    '&:hover': {
                                        backgroundColor: 'rgba(207, 2, 2)', // Zmniejszenie przejrzystości podczas najechania
                                    },
                                }} variant="contained">
                                    Edytuj przedmiot
                                </Button>
                            </Link>
                        }

                    </Box>
                </CardContent>
            </Card>
        );
    }
}

export default ItemWindow;
