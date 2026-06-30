import { memo, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import GitHubIcon from '@mui/icons-material/GitHub';
import VisibilityIcon from '@mui/icons-material/Visibility';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import useLazyImage from '../hooks/useLazyImage';
import placeholder from '../assets/placeholder.svg';

const StyledCard = styled(Card)(({ theme }) => ({
  containerType: 'inline-size',
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  borderRadius: '8px',
  willChange: 'transform',
  transition: 'transform 0.3s, box-shadow 0.3s',
  backgroundColor: theme.custom.surface.card,
  backdropFilter: 'blur(10px)',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',

  '@media (hover: hover)': {
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: `0 20px 40px ${theme.custom.surface.shadow}`,
    },
    '&:hover .hoverOverlay': {
      opacity: 1,
      transform: 'translateY(0)',
      pointerEvents: 'auto',
      backdropFilter: 'blur(5px)',
    },
  },

  '@media (hover: none)': {
    willChange: 'auto',
    backdropFilter: 'none',
    '&.overlay-open .hoverOverlay': {
      opacity: 1,
      transform: 'translateY(0)',
      pointerEvents: 'auto',
    },
  },

  '@container (max-width: 240px)': {
    '.card-btn-text': {
      display: 'none',
    },
    '.card-btn': {
      minWidth: 'unset',
      width: '40px',
      height: '40px',
      padding: '8px',
    },
    '.card-btn .MuiButton-startIcon': {
      margin: 0,
    },
  },
}));

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

const gitBtnSx = {
  backdropFilter: 'blur(4px)',
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderColor: 'rgba(255,255,255,0.15)',
  color: '#fff',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderColor: 'rgba(255,255,255,0.3)',
  },
};

const previewBtnSx = {
  backdropFilter: 'blur(4px)',
  backgroundColor: 'rgba(74,222,128,0.12)',
  borderColor: 'rgba(74,222,128,0.35)',
  color: '#4ade80',
  '&:hover': {
    backgroundColor: 'rgba(74,222,128,0.22)',
    borderColor: 'rgba(74,222,128,0.6)',
  },
};

const getTitle = (name = '') => name.replace(/^OPL-Theme-/, '').trim();
const getPrimaryImageUrl = (assets = []) => assets?.[0]?.download_url || null;

const SquareProjectCard = ({ project, onPreviewClick, priority = false }) => {
  const { name, description, html_url, assets = [] } = project;
  const title = useMemo(() => getTitle(name), [name]);
  const primaryImageUrl = useMemo(() => getPrimaryImageUrl(assets), [assets]);
  const [cardRef, isVisible] = useIntersectionObserver({
    rootMargin: priority ? '200px' : '50px',
  });
  const imageSrc = useLazyImage(primaryImageUrl, isVisible);
  const [overlayOpen, setOverlayOpen] = useState(false);

  const toggleOverlay = useCallback(() => {
    setOverlayOpen((prev) => !prev);
  }, []);

  const handlePreview = useCallback(
    (e) => {
      e.stopPropagation();
      onPreviewClick(project);
    },
    [onPreviewClick, project],
  );

  const handleLink = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const mobileBarSx = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1,
    px: 1.5,
    pb: 1.25,
    pt: '28px',
    background: `linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)`,
    '@media (hover: hover)': { display: 'none' },
    '@media (hover: none)': { justifyContent: 'flex-end' },
  };

  const overlaySx = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    p: 3,
    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)`,
    color: '#fff',
    zIndex: 3,
    opacity: 0,
    transform: 'translateY(10px)',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    pointerEvents: 'none',
    willChange: 'opacity, transform',
    '@media (hover: none)': { willChange: 'auto' },
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: 1.5,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  };

  return (
    <StyledCard
      ref={cardRef}
      className={overlayOpen ? 'overlay-open' : ''}
      onClick={toggleOverlay}
    >
      <Box sx={mediaWrapperStyle}>
        <CardMedia
          component='img'
          image={imageSrc ?? placeholder}
          alt={name}
          sx={mediaStyle}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding='async'
        />

        <Box
          className='hoverOverlay'
          sx={overlaySx}
        >
          <Box>
            <Typography
              gutterBottom
              variant='h5'
              component='div'
            >
              {title}
            </Typography>
            <Typography
              variant='body2'
              sx={{ opacity: 0.9, mt: 1, lineHeight: 1.6 }}
            >
              {description}
            </Typography>
          </Box>

          <Box sx={buttonGroupStyle}>
            <Button
              className='card-btn'
              startIcon={<GitHubIcon />}
              variant='outlined'
              href={html_url}
              target='_blank'
              rel='noopener noreferrer'
              sx={gitBtnSx}
              onClick={handleLink}
            >
              <span className='card-btn-text'>Link</span>
            </Button>
            <Button
              className='card-btn'
              startIcon={<VisibilityIcon />}
              variant='outlined'
              sx={previewBtnSx}
              onClick={handlePreview}
            >
              <span className='card-btn-text'>Preview</span>
            </Button>
          </Box>
        </Box>

        <Box sx={mobileBarSx}>
          <Typography
            noWrap
            sx={{
              fontWeight: 600,
              fontSize: '0.875rem',
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              flex: 1,
              minWidth: 0,
              '@media (hover: none)': { display: 'none' },
            }}
          >
            {title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexShrink: 0 }}>
            <IconButton
              href={html_url}
              target='_blank'
              rel='noopener noreferrer'
              onClick={handleLink}
              sx={{
                color: '#fff',
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
                '@media (hover: none)': { backdropFilter: 'none' },
                width: 48,
                height: 48,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
              }}
            >
              <GitHubIcon sx={{ fontSize: 22 }} />
            </IconButton>
            <IconButton
              onClick={handlePreview}
              sx={{
                color: '#4ade80',
                backgroundColor: 'rgba(74,222,128,0.15)',
                backdropFilter: 'blur(8px)',
                '@media (hover: none)': { backdropFilter: 'none' },
                width: 48,
                height: 48,
                '&:hover': { backgroundColor: 'rgba(74,222,128,0.25)' },
              }}
            >
              <VisibilityIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </StyledCard>
  );
};

SquareProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    description: PropTypes.string,
    html_url: PropTypes.string,
    assets: PropTypes.arrayOf(
      PropTypes.shape({
        download_url: PropTypes.string,
      }),
    ),
  }).isRequired,
  onPreviewClick: PropTypes.func.isRequired,
  priority: PropTypes.bool,
};

export default memo(SquareProjectCard, (prev, next) => {
  return (
    prev.project?.id === next.project?.id &&
    prev.onPreviewClick === next.onPreviewClick
  );
});
