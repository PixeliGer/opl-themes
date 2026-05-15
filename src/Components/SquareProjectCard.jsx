import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import GitHubIcon from '@mui/icons-material/GitHub';
import VisibilityIcon from '@mui/icons-material/Visibility';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import useLazyImage from '../hooks/useLazyImage';
import placeholder from '../assets/placeholder.svg';

const StyledCard = styled(Card)({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  borderRadius: 8,
  transition: 'transform 0.3s, box-shadow 0.3s',
  backgroundColor: 'rgba(18, 18, 18, 0.65)',
  backdropFilter: 'blur(10px)',
  '@media (hover: hover)': {
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
  },
  '@media (hover: none)': {
    '& .hoverOverlay': {
      opacity: 0.7,
      transform: 'translateY(0)',
      backdropFilter: 'blur(2px)',
      pointerEvents: 'auto',
    },
  },
});

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
const getPrimaryImageUrl = (assets = []) => assets?.[0]?.download_url || null;

const SquareProjectCard = ({ project, onPreviewClick, priority = false }) => {
  const { name, description, html_url, assets = [] } = project;
  const title = useMemo(() => getTitle(name), [name]);
  const primaryImageUrl = useMemo(() => getPrimaryImageUrl(assets), [assets]);
  const [cardRef, isVisible] = useIntersectionObserver({ rootMargin: priority ? '200px' : '50px' });
  const imageSrc = useLazyImage(primaryImageUrl, isVisible);

  return (
    <StyledCard ref={cardRef}>
      <Box sx={mediaWrapperStyle}>
        <CardMedia component='img' image={imageSrc ?? placeholder} alt={name} sx={mediaStyle} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} />
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
    </StyledCard>
  );
};

SquareProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    description: PropTypes.string,
    html_url: PropTypes.string,
    assets: PropTypes.arrayOf(PropTypes.shape({
      download_url: PropTypes.string,
    })),
  }).isRequired,
  onPreviewClick: PropTypes.func.isRequired,
  priority: PropTypes.bool,
};

export default memo(SquareProjectCard, (prev, next) => {
  return prev.project?.id === next.project?.id &&
    prev.onPreviewClick === next.onPreviewClick;
});
