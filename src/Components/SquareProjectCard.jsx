import { Card, CardMedia, Typography, Button, Box } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState, useEffect, useRef, useMemo } from 'react';
import placeholder from '../assets/placeholder.svg';

const cardStyle = {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    borderRadius: 2,
    transition: 'transform 0.3s, box-shadow 0.3s',
    backgroundColor: 'rgba(18, 18, 18, 0.65)',
    backdropFilter: 'blur(10px)',
    '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
        '& .hoverOverlay': {
            opacity: 1,
            transform: 'translateY(0)',
            pointerEvents: 'auto',
            backdropFilter: 'blur(5px)',
        },
    },
};

const mediaWrapperStyle = {
    position: 'relative',
    width: '100%',
    paddingTop: '100%',
};

const mediaStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
};

const overlayStyle = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 3,
    backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)',
    color: '#fff',
    opacity: 0,
    transform: 'translateY(10px)',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    pointerEvents: 'none',
};

const buttonGroupStyle = {
    display: 'flex',
    gap: 1.5,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
};

const getTitle = (name = '') => name.replace(/^OPL-Theme-/, '').trim();
const getPrimaryImageUrl = (assets = []) => assets?.[0]?.download_url || placeholder;

const useLazyImage = (imageUrl, isVisible) => {
    const [src, setSrc] = useState(placeholder);

    useEffect(() => {
        if (!isVisible || !imageUrl) {
            return;
        }

        const image = new Image();
        image.src = imageUrl;
        image.onload = () => setSrc(imageUrl);
        image.onerror = () => setSrc(placeholder);
    }, [imageUrl, isVisible]);

    return src;
};

const useIntersectionVisible = () => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { rootMargin: '50px', threshold: 0.01 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return [ref, isVisible];
};

const SquareProjectCard = ({ project, onPreviewClick }) => {
    const { name, description, html_url, assets = [] } = project;
    const title = useMemo(() => getTitle(name), [name]);
    const primaryImageUrl = useMemo(() => getPrimaryImageUrl(assets), [assets]);
    const [cardRef, isVisible] = useIntersectionVisible();
    const imageSrc = useLazyImage(primaryImageUrl, isVisible);

    return (
        <Card ref={cardRef} sx={cardStyle}>
            <Box sx={mediaWrapperStyle}>
                <CardMedia component='img' image={imageSrc} alt={name} sx={mediaStyle} />
                <Box className='hoverOverlay' sx={overlayStyle}>
                    <Box>
                        <Typography gutterBottom variant='h5' component='div'>
                            {title}
                        </Typography>
                        <Typography variant='body2' sx={{ opacity: 0.9, mt: 1, lineHeight: 1.6 }}>
                            {description}
                        </Typography>
                    </Box>

                    <Box sx={buttonGroupStyle}>
                        <Button
                            startIcon={<GitHubIcon />}
                            variant='outlined'
                            href={html_url}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Link
                        </Button>
                        <Button
                            startIcon={<VisibilityIcon />}
                            variant='outlined'
                            color='success'
                            onClick={() => onPreviewClick(project)}
                        >
                            Preview
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};

export default SquareProjectCard;
