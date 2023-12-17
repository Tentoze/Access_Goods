import React, {useState} from 'react';
import {Box, Button, Container, Dialog, Grid, TextField, Typography} from '@mui/material';
import Api from "../endpoints/api";

interface LoginProps {
    open: boolean;
    onClose: () => void;
}

const Login: React.FC<LoginProps> = ({open, onClose}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await Api.post('/login', {email, password});
            localStorage.setItem("jwtToken", response.data.autorizationToken);
            localStorage.setItem("accountId",response.data.id);
            onClose(); // Zamknij okno logowania po sukcesie
        } catch (error: any) {
            if (error.response.status === 401) {
                setError('Błędne hasło');
            }
        }
    };
    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '5px',
                }}
            >
                <Typography variant="h6" color="primary" sx={{
                    textAlign: 'center',
                }}>
                    Logowanie
                </Typography>
                <form>
                    <Grid container direction="column" rowGap={2}>
                        {error && (<Grid item>
                            <Typography variant="body2" color="white" sx={{
                                textColor: 'black ',
                                textAlign: 'center',
                                backgroundColor: 'red',
                                padding: '5px',
                                borderRadius: '5px',
                            }}>
                                {error}
                            </Typography >
                        </Grid>)}

                        <Grid item>
                            <TextField label="Email" variant="outlined"
                                       value={email} onChange={(e) => setEmail(e.target.value)} fullWidth/>
                        </Grid>
                        <Grid item>
                            <TextField label="Hasło" type="password" variant="outlined"
                                       value={password} onChange={(e) => setPassword(e.target.value)} fullWidth/>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={handleLogin} color="primary" fullWidth>
                                Zaloguj się
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                <Typography variant="body2" mt={2}>
                    Nie masz jeszcze konta?{' '}
                    <a href="/register" style={{color: 'blue', textDecoration: 'underline'}}>
                        Zarejestruj się
                    </a>
                </Typography>
            </Box>
        </Dialog>
    );
};

export default Login;