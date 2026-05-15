import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import GamesIcon from '@mui/icons-material/Games';

const Header = () => {
  return (
    <AppBar
      position='fixed'
      elevation={0}
      sx={{
        backgroundImage: 'none',
        backgroundColor: 'rgba(18, 18, 18, 0.75)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container maxWidth='lg'>
        <Toolbar disableGutters>
          <GamesIcon color='primary' sx={{ mr: 1 }} />
          <Typography variant='h6'>PixeliGer OPL Themes</Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
