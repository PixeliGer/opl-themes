import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG, getGitHubUrl } from '../config/api';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY = 'opl_themes_projects';

const getCached = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    return { data, age: Date.now() - timestamp, timestamp };
  } catch {
    return null;
  }
};

const setCached = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch { /* Storage full or unavailable */ }
};

const createMergedSignal = (signal) => {
  const timeoutSignal = AbortSignal.timeout(API_CONFIG.REQUEST_TIMEOUT);
  if (!signal) return timeoutSignal;
  return AbortSignal.any([signal, timeoutSignal]);
};

const fetchProjectAssets = async (project, signal) => {
  const baseRepoUrl = getGitHubUrl(
    `/repos/${API_CONFIG.GITHUB_USERNAME}/${project.name}`,
  );
  const assetsUrl = `${baseRepoUrl}/contents/assets`;
  const screenshotsUrl = `${assetsUrl}/screenshots`;
  const releaseUrl = `https://github.com/${API_CONFIG.GITHUB_USERNAME}/${project.name}/releases`;
  const mergedSignal = createMergedSignal(signal);

  const [assetsResponse, screenshotsResponse] = await Promise.all([
    fetch(assetsUrl, { signal: mergedSignal }),
    fetch(screenshotsUrl, { signal: mergedSignal }).catch(() => null),
  ]);

  if (!assetsResponse || assetsResponse.status !== 200) {
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

  let screenshotImages = [];
  if (screenshotsResponse?.ok) {
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
    setError(null);

    try {
      const mergedSignal = createMergedSignal(signal);
      const response = await fetch(
        getGitHubUrl(`/users/${API_CONFIG.GITHUB_USERNAME}/repos`),
        { signal: mergedSignal },
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
      setCached(validProjects);
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
    const cached = getCached();
    if (cached) {
      setProjects(cached.data);
      setLoading(false);
      // Re-fetch in background if stale
      if (Date.now() - cached.timestamp >= CACHE_TTL) {
        const abortController = new AbortController();
        fetchProjects(abortController.signal);
      }
    } else {
      const abortController = new AbortController();
      fetchProjects(abortController.signal);
      return () => abortController.abort();
    }
  }, [fetchProjects]);

  return { projects, loading, error };
};

export default useGitHubProjects;
