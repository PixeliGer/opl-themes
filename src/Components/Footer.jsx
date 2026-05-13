import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Link } from '@mui/material';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const FooterBox = styled(Box)({
  position: 'fixed',
  bottom: 0,
  width: '100%',
  backgroundColor: 'rgba(18,18,18,0.75)',
  backdropFilter: 'blur(10px)',
  textAlign: 'center',
  padding: '10px 0',
  color: '#fff',
});

const GradientLink = styled(Link)({
  background: 'linear-gradient(270deg, #ff6ec4, #7873f5, #4ade80, #facc15)',
  backgroundSize: '800% 800%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${gradientAnimation} 20s ease infinite`,
  fontWeight: 700,
});

const Footer = () => {
  return (
    <FooterBox>
      <Typography variant='caption' sx={{ fontFamily: 'Roboto Mono, sans-serif' }}>
        Designed and Coded by{' '}
        <GradientLink
          href='https://github.com/PixeliGer'
          underline='none'
          target='_blank'
          rel='noopener noreferrer'
        >
          {'\u2774'} PixeliGer {'\u2775'}
        </GradientLink>
      </Typography>
    </FooterBox>
  );
};

export default Footer;
