import React from 'react';
import {Box, Button, Card, CardContent, CardMedia, Typography} from '@mui/material';
import {Link} from "react-router-dom";

const cardStyle = {
    padding: '0px',
    borderRadius: '5px',
};

class ItemWindow extends React.Component<{ item: any }> {
    render() {
        let {item} = this.props;
        const {images, name, pricePerDay, rating, accountFirstName, accountImage, itemId} = item;
        const handleItemClick = () => {
            // Przenieś do strony przedmiotu po kliknięciu na przycisk
        };

        return (
            <Card style={{border: '1px solid #ccc', padding: '5px'}}>
                <CardContent>
                    <CardMedia component="img" image={images[0].image} alt={name}
                               style={{objectFit: 'cover', width: '100%'}}/>
                    <Typography gutterBottom variant="h5" component="div">
                        {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Cena za dzień: {pricePerDay} PLN
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Ocena: {rating}
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <img src={accountImage} alt={accountFirstName}
                             style={{width: '30px', height: '30px', borderRadius: '50%', marginRight: '5px'}}/>
                        <Typography variant="body2" color="text.secondary">
                            {accountFirstName}
                        </Typography>
                    </Box>
                    <Link to={`/item/${itemId}`}>
                        <Button variant="contained" onClick={handleItemClick}>
                            Zobacz więcej
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }
}

export default ItemWindow;
