import { Box, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import './Footer.scss';

const footerStyle = {
  position: 'fixed',
  bottom: 0,
  width: '100%',
  backgroundColor: 'rgba(18,18,18,0.75)',
  backdropFilter: 'blur(10px)',
  textAlign: 'center',
  padding: '10px 0',
  color: '#fff',
};

const Footer = () => {
  return (
    <Box sx={footerStyle}>
      <Typography
        variant='caption'
        sx={{ fontFamily: 'Roboto Mono, sans-serif' }}
      >
        Designed and Coded by{' '}
        <b className='gradient-text'>
          <Link
            href='https://github.com/PixeliGer'
            underline='none'
            target='_blank'
          >
            ❴ PixeliGer ❵{' '}
          </Link>
        </b>
      </Typography>
    </Box>
  );
};

export default Footer;
