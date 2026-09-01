/**
 * Normalizes job URLs by removing transient tracking and referral parameters
 * while preserving essential job identification parameters.
 */
export function normalizeJobUrl(rawUrl: string): string {
  if (!rawUrl) return '';

  try {
    const url = new URL(rawUrl);

    // List of tracking query parameters to safely strip
    const trackingParams = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'refId',
      'trackingId',
      'midToken',
      'trk',
      'trkInfo',
      'tracking_id',
      'fbclid',
      'gclid',
      'sc_src',
      'source',
      'ref',
      'context',
      'originalSubdomain',
      'position',
      'pageNum',
    ];

    // Remove tracking parameters
    for (const param of trackingParams) {
      url.searchParams.delete(param);
    }

    // Special site normalizations
    if (url.hostname.includes('linkedin.com')) {
      // If on LinkedIn search page with currentJobId, normalize to canonical job view URL
      const currentJobId = url.searchParams.get('currentJobId');
      if (currentJobId && url.pathname.includes('/jobs/')) {
        return `https://www.linkedin.com/jobs/view/${currentJobId}`;
      }
    } else if (url.hostname.includes('indeed.com')) {
      // If Indeed search page with vjk parameter, normalize to viewjob?jk=
      const vjk = url.searchParams.get('vjk') || url.searchParams.get('jk');
      if (vjk) {
        return `https://www.indeed.com/viewjob?jk=${vjk}`;
      }
    }

    // Strip URL fragment/hash
    url.hash = '';

    // Remove trailing slash from pathname if present (unless root)
    let pathname = url.pathname;
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }

    const search = url.searchParams.toString();
    return `${url.protocol}//${url.hostname}${pathname}${search ? `?${search}` : ''}`;
  } catch {
    // If URL parsing fails, fallback to cleaned raw string
    return rawUrl.split('#')[0].split('?utm_')[0];
  }
}
