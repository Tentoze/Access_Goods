import React, { useRef, ChangeEvent, useState } from 'react';
import { Box } from '@mui/material';
import { Add } from '@mui/icons-material';

const ImageUpload: React.FC<{onImageSrc: (src: string) => void}> = ({ onImageSrc }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageSrc, setImageSrc] = useState<string>('');

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
                onImageSrc(reader.result as string); // przekazanie imageSrc do komponentu nadrzędnego
            };
            reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <Box
            sx={{
                marginTop: '10px',
                border: '1px solid #000',
                width: '200px',
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                '&:hover': {
                    backgroundColor: '#f5f5f5',
                },
            }}
            onClick={handleButtonClick}
        >
            {imageSrc && (
                <img
                    src={imageSrc}
                    alt="Uploaded"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            )}
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileInputChange}
            />
            {imageSrc ?  <Add sx={{ fontSize: 0 }} /> :<Add sx={{ fontSize: 50 }} /> }
        </Box>
    );
};

export default ImageUpload;
