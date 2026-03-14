import { Grid } from '@mui/material';
import ProjectCard from './ProjectCard';

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
          size={{ xs: 12, sm: 6, md: 4 }}
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
