import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const FooterBox = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  width: '100%',
  backgroundColor: theme.custom.surface.footer,
  backdropFilter: 'blur(10px)',
  textAlign: 'center',
  padding: '10px 0',
  color: theme.custom.text.primary,
}));

const GradientLink = styled(Link)(({ theme }) => {
  const [a1, a2, a3, a4] = theme.custom.accent;
  return {
    background: `linear-gradient(270deg, ${a1}, ${a2}, ${a3}, ${a4})`,
    backgroundSize: '800% 800%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: `${gradientAnimation} 20s ease infinite`,
    fontWeight: 700,
  };
});

const Footer = () => {
  return (
    <FooterBox>
      <Typography variant='caption' sx={{ fontFamily: 'Roboto Mono, sans-serif' }}>
        Made by{' '}
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
