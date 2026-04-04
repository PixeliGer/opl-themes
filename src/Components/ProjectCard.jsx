import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState, useEffect, useRef } from 'react';
import placeholder from '../assets/placeholder.svg';

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  backgroundColor: 'rgba(18,18,18,0.75)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  },
};

const mediaWrapperStyle = {
  position: 'relative',
  width: '100%',
  paddingTop: '100%', // 1:1 aspect ratio for square
};

const mediaStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const ProjectCard = ({ project, onPreviewClick }) => {
  const cleanName = project.name.replace('OPL-Theme-', '');
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  // Intersection Observer: Only load when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Load image only after intersection detected
  useEffect(() => {
    if (!isVisible) return;

    if (project.assets && project.assets[0] && project.assets[0].download_url) {
      const img = new Image();
      img.src = project.assets[0].download_url;
      img.onload = () => setImageSrc(project.assets[0].download_url);
      img.onerror = () => setImageSrc(placeholder);
    } else {
      setImageSrc(placeholder);
    }
  }, [isVisible, project.assets]);

  return (
    <Card ref={cardRef} sx={cardStyle}>
      <div style={mediaWrapperStyle}>
        <CardMedia
          component='img'
          height='280'
          image={imageSrc}
          alt={project.name}
          style={mediaStyle}
        />
      </div>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant='h5'
          component='div'
        >
          {cleanName}
        </Typography>
        <Typography
          variant='body2'
          color='text.secondary'
        >
          {project.description}
        </Typography>
      </CardContent>
      <CardActions
        sx={{ p: 2 }}
        style={{ justifyContent: 'space-between' }}
      >
        <Button
          startIcon={<GitHubIcon />}
          variant='outlined'
          href={project.html_url}
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
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
