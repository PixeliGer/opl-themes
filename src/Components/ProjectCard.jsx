import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import VisibilityIcon from '@mui/icons-material/Visibility';

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  backgroundColor: 'rgba(18,18,18,0.75)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  },
};

const ProjectCard = ({ project, onPreviewClick }) => {
  const cleanName = project.name.replace('OPL-Theme-', '');

  return (
    <Card sx={cardStyle}>
      <CardMedia
        component='img'
        height='280'
        image={project.assets[0].download_url}
        alt={project.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant='h5'
          component='div'
        >
          {cleanName}
        </Typography>
        <Typography
          variant='body2'
          color='text.secondary'
        >
          {project.description}
        </Typography>
      </CardContent>
      <CardActions
        sx={{ p: 2 }}
        style={{ justifyContent: 'space-between' }}
      >
        <Button
          startIcon={<GitHubIcon />}
          variant='outlined'
          href={project.html_url}
          target='_blank'
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
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
