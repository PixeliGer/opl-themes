import { useState, useEffect } from 'react';
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
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const style = {
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

const PreviewModal = ({ open, handleClose, project }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [fade, setFade] = useState(true);
  const images = project
    ? project.screenshots
        .map((screenshot) => screenshot.download_url)
        .sort((a, b) => {
          const numA = a.match(/(\d+)(?=\.\w*$)/)[0];
          const numB = b.match(/(\d+)(?=\.\w*$)/)[0];
          return numA.localeCompare(numB, undefined, { numeric: true });
        })
    : [];
  const maxSteps = images.length;
  const cleanName = project?.name.replace('OPL-Theme-', '');

  useEffect(() => {
    if (open) {
      setActiveStep(0);
    }
  }, [open]);

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setFade(true);
    }, 200);
  };

  const handleBack = () => {
    setFade(false);
    setTimeout(() => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      setFade(true);
    }, 200);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-title'
      aria-describedby='modal-description'
      slotProps={{
        backdrop: {
          TransitionComponent: Fade,
        },
      }}
    >
      <Fade in={open}>
        <Card sx={style}>
          <Fade
            in={fade}
            timeout={300}
          >
            <CardMedia
              component='img'
              height='400'
              image={images[activeStep]}
              alt={`Slide ${activeStep + 1}`}
            />
          </Fade>
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
          <CardContent>
            <Typography
              id='modal-title'
              variant='h6'
              component='h2'
            >
              {project ? cleanName : 'Project Preview'}
            </Typography>
            <Typography
              id='modal-description'
              sx={{ mt: 2 }}
            >
              {project
                ? project.description
                : 'This is a detailed project description'}
            </Typography>
          </CardContent>
          <CardActions
            sx={{ p: 2 }}
            style={{ justifyContent: 'space-between' }}
          >
            <Button
              startIcon={<CloudDownloadIcon />}
              variant='outlined'
              href={project ? project.release_url : '#'}
              target='_blank'
            >
              Download
            </Button>
            <Button
              onClick={handleClose}
              variant='outlined'
              color='error'
            >
              Close
            </Button>
          </CardActions>
        </Card>
      </Fade>
    </Modal>
  );
};

export default PreviewModal;
