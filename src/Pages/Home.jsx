import { useEffect, useState } from 'react';
import { Container, Grid, Skeleton } from '@mui/material';
// Components
import Header from './../Components/Header';
import ProjectList from '../Components/ProjectList';
import PreviewModal from '../Components/PreviewModal';
import Footer from '../Components/Footer';
// Configuration
import { API_CONFIG, getGitHubUrl } from '../config/api';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchProjects = async () => {
      try {
        // Fetch user repositories
        const response = await fetch(
          getGitHubUrl(`/users/${API_CONFIG.GITHUB_USERNAME}/repos`),
          { signal: abortController.signal },
        );

        if (!response.ok) {
          throw new Error(
            `GitHub API error: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid API response format');
        }

        // Filter projects with OPL-Theme naming convention
        const filteredProjects = data.filter((project) =>
          project?.name?.includes(API_CONFIG.REPO_NAME_FILTER),
        );

        // Fetch assets and releases for each project
        const projectsWithAssetsAndReleases = await Promise.all(
          filteredProjects.map(async (project) => {
            try {
              const baseRepoUrl = getGitHubUrl(
                `/repos/${API_CONFIG.GITHUB_USERNAME}/${project.name}`,
              );
              const assetsUrl = `${baseRepoUrl}/contents/assets`;
              const screenshotsUrl = `${assetsUrl}/screenshots`;
              const releaseUrl = `https://github.com/${API_CONFIG.GITHUB_USERNAME}/${project.name}/releases`;

              // Fetch assets folder
              const assetsResponse = await fetch(assetsUrl, {
                signal: abortController.signal,
              });

              if (assetsResponse.status !== 200) {
                console.warn(
                  `Assets folder not found for project ${project.name}`,
                );
                return {
                  ...project,
                  assets: [],
                  screenshots: [],
                  release_url: releaseUrl,
                };
              }

              const assets = await assetsResponse.json();

              if (!Array.isArray(assets)) {
                throw new Error(`Invalid assets response for ${project.name}`);
              }

              const assetImages = assets.filter(
                (item) =>
                  item?.type === 'file' &&
                  API_CONFIG.IMAGE_EXTENSIONS.test(item.name),
              );

              // Fetch screenshots folder
              const screenshotsResponse = await fetch(screenshotsUrl, {
                signal: abortController.signal,
              });

              let screenshotImages = [];
              if (screenshotsResponse.ok) {
                const screenshots = await screenshotsResponse.json();
                if (Array.isArray(screenshots)) {
                  screenshotImages = screenshots.filter(
                    (item) =>
                      item?.type === 'file' &&
                      API_CONFIG.IMAGE_EXTENSIONS.test(item.name),
                  );
                }
              }

              return {
                ...project,
                assets: assetImages,
                screenshots: screenshotImages,
                release_url: releaseUrl,
              };
            } catch (error) {
              // Handle individual project errors gracefully
              if (error.name === 'AbortError') {
                return null;
              }
              console.error(
                `Error fetching contents for project ${project.name}:`,
                error,
              );
              return {
                ...project,
                assets: [],
                screenshots: [],
                release_url: '',
              };
            }
          }),
        );

        // Filter out null results from aborted requests
        const validProjects = projectsWithAssetsAndReleases.filter(
          (p) => p !== null,
        );

        setProjects(validProjects);
        setError(null);
      } catch (error) {
        // Only set error if request wasn't aborted
        if (error.name !== 'AbortError') {
          console.error('Error fetching projects:', error);
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    // Cleanup: abort pending requests on unmount
    return () => {
      abortController.abort();
    };
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
                size={{ xs: 12, sm: 6, md: 4 }}
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
        ) : error ? (
          <div
            style={{ textAlign: 'center', color: '#ff6b6b', padding: '40px' }}
          >
            <h3>Failed to load projects</h3>
            <p>{error}</p>
            <p>Please try refreshing the page.</p>
          </div>
        ) : (
          <ProjectList
            projects={projects}
            onPreviewClick={handleOpenModal}
          />
          // <DummyGrid />
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
