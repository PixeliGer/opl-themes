import { useState, useCallback, lazy, Suspense } from 'react';
import { Container, Skeleton, Box, Typography } from '@mui/material';
import Header from './../Components/Header';
import ProjectList from '../Components/ProjectList';
import Footer from '../Components/Footer';
import useGitHubProjects from '../hooks/useGitHubProjects';

const PreviewModal = lazy(() => import('../Components/PreviewModal'));

const SKELETON_COUNT = 6;

const modalFallback = (
  <Box
    sx={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1300,
    }}
  >
    <Skeleton variant='rectangular' width={600} height={400} sx={{ borderRadius: 2 }} />
  </Box>
);

const Home = () => {
  const { projects, loading, error } = useGitHubProjects();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpenModal = useCallback((project) => {
    setSelectedProject(project);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedProject(null);
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth='lg' sx={{ pt: { xs: 6, sm: 12.5 }, pb: { xs: 10, sm: 14 } }}>
        {loading ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: 3,
            }}
          >
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <Skeleton key={i} variant='rectangular' sx={{ width: '100%', height: 200, borderRadius: 1 }} />
            ))}
          </Box>
        ) : error ? (
          <Box textAlign='center' py={5}>
            <Typography variant='h5' color='error' gutterBottom>
              Failed to load projects
            </Typography>
            <Typography color='text.secondary' sx={{ mb: 1 }}>
              {error}
            </Typography>
            <Typography variant='body2'>Please try refreshing the page.</Typography>
          </Box>
        ) : (
          <ProjectList
            projects={projects}
            onPreviewClick={handleOpenModal}
          />
        )}
      </Container>
      {modalOpen && (
        <Suspense fallback={modalFallback}>
          <PreviewModal
            open={modalOpen}
            handleClose={handleCloseModal}
            project={selectedProject}
          />
        </Suspense>
      )}
      <Footer />
    </>
  );
};

export default Home;
