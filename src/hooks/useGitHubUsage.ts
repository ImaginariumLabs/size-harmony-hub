;
import axios from 'axios';
import { getApiKey, updateKeyLastUsed } from '../services/mockKeyManager';

export interface GitHubRateLimit {
  resources: {
    core: {
      limit: number;
      used: number;
      remaining: number;
      reset: number;
    };
    search: {
      limit: number;
      used: number;
      remaining: number;
      reset: number;
    };
    graphql: {
      limit: number;
      used: number;
      remaining: number;
      reset: number;
    };
    integration_manifest: {
      limit: number;
      used: number;
      remaining: number;
      reset: number;
    };
    code_scanning_upload: {
      limit: number;
      used: number;
      remaining: number;
      reset: number;
    };
  };
  rate: {
    limit: number;
    used: number;
    remaining: number;
    reset: number;
  };
}

export interface GitHubUsageData {
  rate_limits: GitHubRateLimit;
  user_info: {
    login: string;
    name: string;
    avatar_url: string;
    public_repos: number;
    private_repos: number;
    followers: number;
    following: number;
  } | null;
  last_updated: string;
}

export function useGitHubUsage() {
  const [usage, setUsage] = useState<GitHubUsageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = await getApiKey('github');
      if (!apiKey) {
        setError('No GitHub API key found');
        setLoading(false);
        return;
      }

      // Fetch rate limit data
      const rateLimitResponse = await axios.get(
        'https://api.github.com/rate_limit',
        {
          headers: {
            'Authorization': `token ${apiKey}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      // Fetch user data
      const userResponse = await axios.get(
        'https://api.github.com/user',
        {
          headers: {
            'Authorization': `token ${apiKey}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      // Get repository count
      const reposResponse = await axios.get(
        'https://api.github.com/user/repos?per_page=1',
        {
          headers: {
            'Authorization': `token ${apiKey}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      // Extract total count from Link header
      const linkHeader = reposResponse.headers.link || '';
      const totalReposMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
      const totalRepos = totalReposMatch ? parseInt(totalReposMatch[1], 10) : 0;

      // Count private repos
      const privateReposResponse = await axios.get(
        'https://api.github.com/user/repos?per_page=100&visibility=private',
        {
          headers: {
            'Authorization': `token ${apiKey}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      const privateRepos = privateReposResponse.data.length;
      const publicRepos = totalRepos - privateRepos;

      // Format the data
      const usageData: GitHubUsageData = {
        rate_limits: rateLimitResponse.data,
        user_info: {
          login: userResponse.data.login,
          name: userResponse.data.name,
          avatar_url: userResponse.data.avatar_url,
          public_repos: publicRepos,
          private_repos: privateRepos,
          followers: userResponse.data.followers,
          following: userResponse.data.following
        },
        last_updated: new Date().toISOString()
      };

      setUsage(usageData);

      // Update last used timestamp for the API key
      await updateKeyLastUsed('github');
    } catch (err) {
      console.error('Error fetching GitHub usage:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch GitHub usage data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();

    // Refresh every 15 minutes
    const interval = setInterval(fetchUsage, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { usage, loading, error, refetch: fetchUsage };
}
