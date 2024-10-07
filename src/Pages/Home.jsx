import { useEffect, useState } from 'react';
import { Container, Grid, Skeleton } from '@mui/material';
// # Components
import Header from './../Components/Header';
import ProjectList from '../Components/ProjectList';
import PreviewModal from '../Components/PreviewModal';
import Footer from '../Components/Footer';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/users/pixeliger/repos'
        );
        const data = await response.json();
        const filteredProjects = data.filter((project) =>
          project.name.includes('OPL-Theme')
        );

        const projectsWithAssetsAndReleases = await Promise.all(
          filteredProjects.map(async (project) => {
            try {
              const assetsResponse = await fetch(
                `https://api.github.com/repos/pixeliger/${project.name}/contents/assets`
              );
              const assets = await assetsResponse.json();
              const assetImages = assets.filter(
                (item) =>
                  item.type === 'file' &&
                  item.name.match(/\.(jpg|jpeg|png|gif)$/)
              );

              const screenshotsResponse = await fetch(
                `https://api.github.com/repos/pixeliger/${project.name}/contents/assets/screenshots`
              );
              const screenshots = await screenshotsResponse.json();
              const screenshotImages = screenshots.filter(
                (item) =>
                  item.type === 'file' &&
                  item.name.match(/\.(jpg|jpeg|png|gif)$/)
              );

              const releaseUrl = `https://github.com/pixeliger/${project.name}/releases`;

              return {
                ...project,
                assets: assetImages,
                screenshots: screenshotImages,
                release_url: releaseUrl,
              };
            } catch (error) {
              console.error(
                `Error fetching contents for project ${project.name}:`,
                error
              );
              return {
                ...project,
                assets: [],
                screenshots: [],
                release_url: '',
              };
            }
          })
        );

        setProjects(projectsWithAssetsAndReleases);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <>
      <Header />
      <Container
        maxWidth='lg'
        style={{ paddingTop: 100, paddingBottom: 100 }}
      >
        {loading ? (
          // Display skeletons as card grids while loading
          <Grid
            container
            spacing={3}
          >
            {Array.from(new Array(6)).map((_, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={index}
              >
                <Skeleton
                  variant='rectangular'
                  width='100%'
                  height={200}
                />
                <Skeleton width='60%' />
                <Skeleton width='80%' />
              </Grid>
            ))}
          </Grid>
        ) : (
          <ProjectList
            projects={projects}
            setProjects={setProjects}
            onPreviewClick={handleOpenModal}
          />
        )}
      </Container>
      <PreviewModal
        open={modalOpen}
        handleClose={handleCloseModal}
        project={selectedProject}
      />

      <Footer />
    </>
  );
};

export default Home;
