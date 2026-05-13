import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Typography,
  Button,
  Fade,
  Card,
  CardContent,
  CardMedia,
  MobileStepper,
  CardActions,
  IconButton,
  Box,
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import placeholderWide from '../assets/placeholder_wide.svg';

const cardSx = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(18,18,18,0.75)',
  backdropFilter: 'blur(10px)',
  width: '90vw',
  maxWidth: 800,
  boxShadow: 24,
  p: 4,
};

const mediaContainerSx = (paddingTop) => ({
  position: 'relative',
  width: '100%',
  paddingTop,
});

const mediaSx = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
};

const PreviewModal = ({ open, handleClose, project }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [paddingTop, setPaddingTop] = useState('56.25%');
  const [displayedImage, setDisplayedImage] = useState(placeholderWide);
  const imageCache = useRef({});

  const images = useMemo(() => {
    if (!project) return [];
    return [...project.screenshots]
      .sort((a, b) => {
        const numA = a.download_url.match(/(\d+)(?=\.\w*$)/)?.[0] || '0';
        const numB = b.download_url.match(/(\d+)(?=\.\w*$)/)?.[0] || '0';
        return numA.localeCompare(numB, undefined, { numeric: true });
      })
      .map((s) => s.download_url);
  }, [project]);

  const maxSteps = images.length;
  const cleanName = project?.name?.replace('OPL-Theme-', '') || '';
  const hasMultiple = maxSteps > 1;

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setDisplayedImage(placeholderWide);
      setPaddingTop('56.25%');
      imageCache.current = {};
    }
  }, [open]);

  const prefetchImage = useCallback((index) => {
    if (index < 0 || index >= images.length || imageCache.current[index]) return;

    const img = new Image();
    img.onload = () => { imageCache.current[index] = true; };
    img.onerror = () => { imageCache.current[index] = false; };
    img.src = images[index];
  }, [images]);

  useEffect(() => {
    if (!hasMultiple) return;
    prefetchImage(activeStep - 1);
    prefetchImage(activeStep);
    prefetchImage(activeStep + 1);
  }, [activeStep, prefetchImage, hasMultiple]);

  useEffect(() => {
    if (!images[activeStep]) {
      setDisplayedImage(placeholderWide);
      return;
    }

    const img = new Image();
    let isMounted = true;

    img.onload = () => {
      if (isMounted) {
        setPaddingTop(`${(img.height / img.width) * 100}%`);
        setDisplayedImage(images[activeStep]);
      }
    };
    img.onerror = () => {
      if (isMounted) setDisplayedImage(placeholderWide);
    };
    img.src = images[activeStep];

    return () => {
      isMounted = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [activeStep, images]);

  const handleNext = useCallback(() => {
    setActiveStep((prev) => Math.min(prev + 1, maxSteps - 1));
  }, [maxSteps]);

  const handleBack = useCallback(() => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  }, []);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-title'
      aria-describedby='modal-description'
      slotProps={{ backdrop: { TransitionComponent: Fade } }}
    >
      <Fade in={open}>
        <Card sx={cardSx}>
          <Box sx={mediaContainerSx(paddingTop)}>
            <CardMedia
              component='img'
              sx={mediaSx}
              image={displayedImage}
              alt={`Slide ${activeStep + 1}`}
            />
          </Box>
          {hasMultiple && (
            <MobileStepper
              steps={maxSteps}
              position='static'
              activeStep={activeStep}
              nextButton={
                <IconButton
                  color='primary'
                  onClick={handleNext}
                  disabled={activeStep === maxSteps - 1}
                >
                  <NavigateNextIcon />
                </IconButton>
              }
              backButton={
                <IconButton
                  color='primary'
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  <NavigateBeforeIcon />
                </IconButton>
              }
            />
          )}
          <CardContent>
            <Typography id='modal-title' variant='h6' component='h2'>
              {cleanName || 'Project Preview'}
            </Typography>
            <Typography id='modal-description' sx={{ mt: 2 }}>
              {project?.description || 'No description available'}
            </Typography>
          </CardContent>
          <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
            <Button
              startIcon={<CloudDownloadIcon />}
              variant='outlined'
              href={project?.release_url || '#'}
              target='_blank'
            >
              Download
            </Button>
            <Button onClick={handleClose} variant='outlined' color='error'>
              Close
            </Button>
          </CardActions>
        </Card>
      </Fade>
    </Modal>
  );
};

PreviewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  project: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    release_url: PropTypes.string,
    screenshots: PropTypes.arrayOf(
      PropTypes.shape({ download_url: PropTypes.string }),
    ),
  }),
};

export default PreviewModal;
