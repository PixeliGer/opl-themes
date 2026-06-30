import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import placeholderWide from '../assets/placeholder_wide.svg';

const MONO = '"Roboto Mono", "Roboto Mono Variable", monospace';

function getVisibleDots(total, active) {
  if (total <= 0) return [];
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => ({ type: 'dot', index: i }));
  }

  const items = [];
  items.push({ type: 'dot', index: 0 });

  if (active <= 3) {
    for (let i = 1; i <= 4; i++) items.push({ type: 'dot', index: i });
    items.push({ type: 'ellipsis' });
  } else if (active >= total - 4) {
    items.push({ type: 'ellipsis' });
    for (let i = total - 5; i <= total - 2; i++)
      items.push({ type: 'dot', index: i });
  } else {
    items.push({ type: 'ellipsis' });
    items.push({ type: 'dot', index: active - 1 });
    items.push({ type: 'dot', index: active });
    items.push({ type: 'dot', index: active + 1 });
    items.push({ type: 'ellipsis' });
  }

  items.push({ type: 'dot', index: total - 1 });
  return items;
}

const PreviewModal = ({ open, handleClose, project }) => {
  const theme = useTheme();
  const palette = theme.custom;
  const touchRef = useRef({ startX: 0, startY: 0 });
  const imageCache = useRef({});
  const imageControllerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const [loaded, setLoaded] = useState(false);

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
  const hasMultiple = maxSteps > 1;
  const visibleDots = useMemo(
    () => getVisibleDots(maxSteps, activeStep),
    [maxSteps, activeStep],
  );

  const goTo = useCallback(
    (step) => {
      setActiveStep((prev) => {
        const next = ((step % maxSteps) + maxSteps) % maxSteps;
        return next !== prev ? next : prev;
      });
    },
    [maxSteps],
  );

  const handleNext = useCallback(
    () => goTo(activeStep + 1),
    [goTo, activeStep],
  );
  const handleBack = useCallback(
    () => goTo(activeStep - 1),
    [goTo, activeStep],
  );

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setAspectRatio(16 / 9);
      setLoaded(false);
      imageCache.current = {};
    }
  }, [open]);

  useEffect(() => {
    if (images.length === 0) return;

    const current = imageControllerRef.current;
    if (current) {
      current.abort();
      imageControllerRef.current = null;
    }

    const controller = new AbortController();
    imageControllerRef.current = controller;

    setLoaded(false);

    const img = new Image();
    const cleanup = () => {
      img.onload = null;
      img.onerror = null;
    };
    controller.signal.addEventListener('abort', cleanup, { once: true });

    img.onload = () => {
      setAspectRatio(img.naturalWidth / img.naturalHeight);
      setLoaded(true);
    };
    img.onerror = () => {
      setAspectRatio(16 / 9);
      setLoaded(true);
    };
    img.src = images[activeStep];

    [activeStep - 1, activeStep + 1].forEach((i) => {
      const idx = ((i % images.length) + images.length) % images.length;
      if (!imageCache.current[idx]) {
        imageCache.current[idx] = true;
        const prefetch = new Image();
        prefetch.src = images[idx];
      }
    });

    return () => {
      controller.abort();
      if (imageControllerRef.current === controller) {
        imageControllerRef.current = null;
      }
    };
  }, [activeStep, images]);

  const handleKeyDown = useCallback(
    (e) => {
      if (!open) return;
      if (e.key === 'ArrowLeft') {
        handleBack();
        e.preventDefault();
      }
      if (e.key === 'ArrowRight') {
        handleNext();
        e.preventDefault();
      }
    },
    [open, handleBack, handleNext],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleTouchStart = useCallback((e) => {
    touchRef.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
    };
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      const diffX = e.changedTouches[0].clientX - touchRef.current.startX;
      const diffY = e.changedTouches[0].clientY - touchRef.current.startY;
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) handleBack();
        else handleNext();
      }
    },
    [handleBack, handleNext],
  );

  const cleanName = project?.name?.replace('OPL-Theme-', '') || '';

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-title'
      aria-describedby='modal-description'
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: palette.surface.modal,
            backdropFilter: 'blur(10px)',
            width: '90vw',
            maxWidth: 900,
            borderRadius: 2,
            boxShadow: 24,
            outline: 'none',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              aspectRatio: `${aspectRatio}`,
              bgcolor: '#000',
              borderRadius: '8px 8px 0 0',
              overflow: 'hidden',
            }}
            onTouchStart={hasMultiple ? handleTouchStart : undefined}
            onTouchEnd={hasMultiple ? handleTouchEnd : undefined}
          >
            <Box
              component='img'
              key={activeStep}
              src={images[activeStep] || placeholderWide}
              alt={`Screenshot ${activeStep + 1}`}
              sx={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                opacity: loaded ? 1 : 0,
                transition: 'opacity 300ms ease',
              }}
            />

            <Tooltip title='Close'>
              <IconButton
                onClick={handleClose}
                aria-label='Close preview'
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 3,
                  bgcolor: 'rgba(0,0,0,0.4)',
                  color: 'white',
                  width: 32,
                  height: 32,
                  opacity: 0.7,
                  transition: 'opacity 200ms, background-color 200ms',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.75)',
                    opacity: 1,
                  },
                }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            {hasMultiple && (
              <>
                <IconButton
                  onClick={handleBack}
                  aria-label='Previous image'
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    left: 8,
                    zIndex: 2,
                    bgcolor: 'rgba(0,0,0,0.4)',
                    color: 'white',
                    width: 40,
                    height: 40,
                    opacity: 0.7,
                    transition: 'opacity 200ms, background-color 200ms',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.75)',
                      opacity: 1,
                    },
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>

                <IconButton
                  onClick={handleNext}
                  aria-label='Next image'
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    right: 8,
                    zIndex: 2,
                    bgcolor: 'rgba(0,0,0,0.4)',
                    color: 'white',
                    width: 40,
                    height: 40,
                    opacity: 0.7,
                    transition: 'opacity 200ms, background-color 200ms',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.75)',
                      opacity: 1,
                    },
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: 'rgba(0,0,0,0.5)',
                  }}
                >
                  {visibleDots.map((item, i) =>
                    item.type === 'ellipsis' ? (
                      <Typography
                        key={`e-${i}`}
                        sx={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: 12,
                          lineHeight: 1,
                          mx: 0.25,
                          userSelect: 'none',
                        }}
                      >
                        &hellip;
                      </Typography>
                    ) : (
                      <Box
                        key={item.index}
                        onClick={() => goTo(item.index)}
                        sx={{
                          width: item.index === activeStep ? 20 : 8,
                          height: 8,
                          borderRadius: 4,
                          bgcolor:
                            item.index === activeStep
                              ? 'white'
                              : 'rgba(255,255,255,0.4)',
                          cursor: 'pointer',
                          transition: 'all 200ms ease',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.7)' },
                        }}
                      />
                    ),
                  )}
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: 11,
                      ml: 1,
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {activeStep + 1} / {maxSteps}
                  </Typography>
                </Box>
              </>
            )}
          </Box>

          <Box sx={{ px: 3, py: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Typography
                id='modal-title'
                variant='h6'
                component='h2'
                sx={{ fontFamily: MONO, fontWeight: 600, flex: 1 }}
              >
                {cleanName || 'Project Preview'}
              </Typography>
              <Tooltip title='Download release'>
                <Button
                  startIcon={<CloudDownloadIcon />}
                  variant='outlined'
                  size='small'
                  href={project?.release_url || '#'}
                  target='_blank'
                  sx={{
                    fontSize: 12,
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  Download
                </Button>
              </Tooltip>
            </Box>
            {project?.description && (
              <Typography
                id='modal-description'
                sx={{
                  mt: 1.5,
                  fontFamily: MONO,
                  fontSize: 13,
                  color: 'text.secondary',
                  lineHeight: 1.7,
                }}
              >
                {project.description}
              </Typography>
            )}
          </Box>
        </Box>
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
