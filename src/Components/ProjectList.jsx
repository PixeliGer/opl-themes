import { Grid } from '@mui/material';
import ProjectCard from './ProjectCard';

const ProjectList = ({ projects, onPreviewClick }) => {
  return (
    <Grid
      container
      spacing={4}
      justify='center'
    >
      {projects.map((project) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          key={project.id}
        >
          <ProjectCard
            project={project}
            onPreviewClick={onPreviewClick}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProjectList;
