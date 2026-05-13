import { memo } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import SquareProjectCard from './SquareProjectCard';

const ProjectList = ({ projects, onPreviewClick }) => {
  return (
    <Grid container spacing={{ xs: 4, md: 4 }}>
      {projects.map((project) => (
        <Grid item size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={project.id}>
          <SquareProjectCard
            project={project}
            onPreviewClick={onPreviewClick}
          />
        </Grid>
      ))}
    </Grid>
  );
};

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  onPreviewClick: PropTypes.func.isRequired,
};

export default memo(ProjectList);
