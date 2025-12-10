// API Configuration
export const API_CONFIG = {
  // GitHub API base URL
  GITHUB_API_BASE: 'https://api.github.com',
  // GitHub username for fetching repositories
  GITHUB_USERNAME: 'pixeliger',
  // Repository name filter
  REPO_NAME_FILTER: 'OPL-Theme',
  // Image file extensions to filter
  IMAGE_EXTENSIONS: /\.(jpg|jpeg|png|gif)$/i,
  // API request timeout in milliseconds
  REQUEST_TIMEOUT: 10000,
};

// Helper function to construct GitHub API URLs
export const getGitHubUrl = (endpoint) => {
  return `${API_CONFIG.GITHUB_API_BASE}${endpoint}`;
};
