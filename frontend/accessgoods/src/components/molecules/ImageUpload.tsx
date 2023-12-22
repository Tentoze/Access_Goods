import React, { useRef, ChangeEvent, useState } from 'react';
import { Box } from '@mui/material';
import { Add } from '@mui/icons-material';
const MAX_IMAGE_SIZE = 250 * 1024; // 250KB

const ImageUpload: React.FC<{onImageSrc: (src: string) => void,currentImageSrc?: string}> = ({ onImageSrc, currentImageSrc}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageSrc, setImageSrc] = useState<string>(currentImageSrc ? currentImageSrc : '');

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            if (file.size > MAX_IMAGE_SIZE) {
                // Obrazek jest większy niż 250KB, więc trzeba go przeskalować
                const reader = new FileReader();
                reader.onload = async (event) => {
                    const image = new Image();
                    image.src = event.target!.result as string;

                    image.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d')!;
                        const MAX_WIDTH = 800;
                        const MAX_HEIGHT = 600;

                        let width = image.width;
                        let height = image.height;

                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;

                        ctx.drawImage(image, 0, 0, width, height);

                        canvas.toBlob((blob) => {
                            if (blob) {
                                const scaledFile = new File([blob], file.name, {
                                    type: 'image/jpeg', // Możesz dostosować typ obrazka
                                });

                                const scaledReader = new FileReader();
                                scaledReader.onloadend = () => {
                                    setImageSrc(scaledReader.result as string);
                                    onImageSrc(scaledReader.result as string);
                                };
                                scaledReader.readAsDataURL(scaledFile);
                            }
                        }, 'image/jpeg', 0.7); // Zmień kompresję, jeśli to konieczne
                    };
                };
                reader.readAsDataURL(file);
            } else {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImageSrc(reader.result as string);
                    onImageSrc(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
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
