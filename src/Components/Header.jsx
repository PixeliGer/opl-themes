import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import GamesIcon from '@mui/icons-material/Games';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useThemeMode } from '../context/ThemeContext';
import { BACKGROUND_REGISTRY, getNextBackground } from '../config/backgrounds';

const Header = () => {
  const { mode, toggleTheme, toggleBackground, background } = useThemeMode();
  const nextBgName =
    BACKGROUND_REGISTRY[getNextBackground(background)]?.name ?? '';
  const theme = useTheme();
  const palette = theme.custom;

  return (
    <AppBar
      position='fixed'
      elevation={0}
      sx={{
        backgroundImage: 'none',
        backgroundColor: palette.surface.header,
        backdropFilter: 'blur(10px)',
        transform: 'translateZ(0)',
        borderBottom: `1px solid ${palette.border.subtle}`,
        color: palette.text.primary,
      }}
    >
      <Container maxWidth='lg'>
        <Toolbar
          disableGutters
          sx={{ minHeight: 60, gap: 1.5 }}
        >
          <GamesIcon color='primary' />
          <Typography
            variant='h6'
            sx={{
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: palette.text.primary,
            }}
          >
            PixeliGer OPL Themes
          </Typography>

          <Box sx={{ marginLeft: 'auto' }} />

          <Tooltip title={`Switch to ${nextBgName}`}>
            <IconButton
              onClick={toggleBackground}
              aria-label='Toggle background'
              sx={{
                width: 32,
                height: 32,
                padding: '5px',
                border: 1,
                borderColor:
                  mode === 'dark'
                    ? 'hsla(210, 14%, 22%, 0.5)'
                    : 'rgba(0, 0, 0, 0.15)',
                borderRadius: '12px',
                color:
                  mode === 'dark'
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
                transition:
                  'all 100ms ease-in, background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderColor:
                    mode === 'dark'
                      ? 'hsla(210, 14%, 40%, 0.6)'
                      : 'rgba(0, 0, 0, 0.3)',
                  backgroundColor:
                    mode === 'dark'
                      ? 'hsla(210, 14%, 13%, 0.8)'
                      : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <AutoAwesomeIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Tooltip
            title={
              mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            }
          >
            <IconButton
              onClick={toggleTheme}
              aria-label='Toggle theme'
              sx={{
                width: 32,
                height: 32,
                padding: '5px',
                border: 1,
                borderColor:
                  mode === 'dark'
                    ? 'hsla(210, 14%, 22%, 0.5)'
                    : 'rgba(0, 0, 0, 0.15)',
                borderRadius: '12px',
                color:
                  mode === 'dark'
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
                transition:
                  'all 100ms ease-in, background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderColor:
                    mode === 'dark'
                      ? 'hsla(210, 14%, 40%, 0.6)'
                      : 'rgba(0, 0, 0, 0.3)',
                  backgroundColor:
                    mode === 'dark'
                      ? 'hsla(210, 14%, 13%, 0.8)'
                      : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              {mode === 'dark' ? (
                <LightModeIcon fontSize='small' />
              ) : (
                <DarkModeIcon fontSize='small' />
              )}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
