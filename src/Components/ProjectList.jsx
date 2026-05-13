import { Grid } from '@mui/material';
import SquareProjectCard from './SquareProjectCard';

const ProjectList = ({ projects, onPreviewClick }) => {
  return (
    <Grid
      container
      spacing={{ xs: 4, md: 4 }}
      justify='center'
    >
      {projects.map((project) => (
        <Grid
          item
          size={{ xs: 6, sm: 6, md: 4, lg: 3 }}
          key={project.id}
        >
          <SquareProjectCard
            project={project}
            onPreviewClick={onPreviewClick}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProjectList;
