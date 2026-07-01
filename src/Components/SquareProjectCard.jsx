import { memo, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import GitHubIcon from '@mui/icons-material/GitHub';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import useLazyImage from '../hooks/useLazyImage';
import placeholder from '../assets/placeholder.svg';

const StyledCard = styled(Card)(({ theme }) => ({
  containerType: 'inline-size',
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  borderRadius: '8px',
  transition: 'transform 0.2s, box-shadow 0.2s',
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
    },
  },

  '@media (hover: none)': {
    '&.overlay-open .hoverOverlay': {
      opacity: 1,
      transform: 'translateY(0)',
      pointerEvents: 'auto',
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

const cardActionBtnSx = {
  width: 48,
  height: 48,
  border: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.65)',
  borderColor: 'rgba(255,255,255,0.15)',
  borderRadius: '12px',
  transition:
    'all 100ms ease-in, background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
};

const getTitle = (name = '') => name.replace(/^OPL-Theme-/, '').trim();
const getPrimaryImageUrl = (assets = []) => assets?.[0]?.download_url || null;

const SquareProjectCard = ({ project, onPreviewClick, priority = false }) => {
  const { name, description, html_url, release_url, assets = [] } = project;
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

  const overlaySx = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    p: 3,
    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 100%)`,
    color: '#fff',
    zIndex: 3,
    opacity: 0,
    transform: 'translateY(10px)',
    transition: 'opacity 0.2s, transform 0.2s',
    pointerEvents: 'none',
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: 1.5,
    justifyContent: 'center',
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
              sx={{ '@media (hover: none)': { fontSize: '1.4rem' } }}
            >
              {title}
            </Typography>
            <Typography
              variant='body2'
              sx={{
                opacity: 0.9,
                mt: 1,
                lineHeight: 1.6,
                '@media (hover: none)': { fontSize: '1rem' },
              }}
            >
              {description}
            </Typography>
          </Box>

          <Box sx={buttonGroupStyle}>
            <Tooltip title='View on GitHub'>
              <IconButton
                color='inherit'
                href={html_url}
                target='_blank'
                rel='noopener noreferrer'
                sx={cardActionBtnSx}
                onClick={handleLink}
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Preview theme'>
              <IconButton
                color='primary'
                sx={cardActionBtnSx}
                onClick={handlePreview}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            {release_url && (
              <Tooltip title='Download'>
                <IconButton
                  color='success'
                  href={release_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  sx={cardActionBtnSx}
                >
                  <FileDownloadIcon />
                </IconButton>
              </Tooltip>
            )}
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
    release_url: PropTypes.string,
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
