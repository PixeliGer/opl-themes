import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import GamesIcon from '@mui/icons-material/Games';
import './Header.scss';

const Header = () => {
  return (
    <AppBar
      position='fixed'
      className='custom-header'
    >
      <Container maxWidth='lg'>
        <Toolbar disableGutters>
          <GamesIcon
            color='primary'
            sx={{
              mr: 1,
            }}
          />
          <Typography variant='h6'>PixeliGer OPL Themes</Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
