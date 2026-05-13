import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG, getGitHubUrl } from '../config/api';

const fetchProjectAssets = async (project, signal) => {
  const baseRepoUrl = getGitHubUrl(
    `/repos/${API_CONFIG.GITHUB_USERNAME}/${project.name}`,
  );
  const assetsUrl = `${baseRepoUrl}/contents/assets`;
  const screenshotsUrl = `${assetsUrl}/screenshots`;
  const releaseUrl = `https://github.com/${API_CONFIG.GITHUB_USERNAME}/${project.name}/releases`;

  const assetsResponse = await fetch(assetsUrl, { signal });
  if (assetsResponse.status !== 200) {
    return { ...project, assets: [], screenshots: [], release_url: releaseUrl };
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

  const screenshotsResponse = await fetch(screenshotsUrl, { signal });
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
};

const useGitHubProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async (signal) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        getGitHubUrl(`/users/${API_CONFIG.GITHUB_USERNAME}/repos`),
        { signal },
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

      const filteredProjects = data.filter((project) =>
        project?.name?.includes(API_CONFIG.REPO_NAME_FILTER),
      );

      const projectsWithAssets = await Promise.all(
        filteredProjects.map(async (project) => {
          try {
            return await fetchProjectAssets(project, signal);
          } catch (err) {
            if (err.name === 'AbortError') return null;
            console.error(`Error fetching contents for ${project.name}:`, err);
            return { ...project, assets: [], screenshots: [], release_url: '' };
          }
        }),
      );

      const validProjects = projectsWithAssets.filter(Boolean);
      setProjects(validProjects);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching projects:', err);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchProjects(abortController.signal);
    return () => abortController.abort();
  }, [fetchProjects]);

  return { projects, loading, error };
};

export default useGitHubProjects;
