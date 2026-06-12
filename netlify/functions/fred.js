// FRED API Proxy — Netlify Serverless Function
// Fetches economic data from Federal Reserve Economic Data (FRED)
// Required env var: FRED_API_KEY (free at https://fred.stlouisfed.org/docs/api/api_key.html)

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'public, s-maxage=3600, max-age=3600',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  const params = event.queryStringParameters || {};
  const seriesParam = params.series;

  if (!seriesParam) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing required parameter: series (comma-separated FRED series IDs)' }),
    };
  }

  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'FRED_API_KEY environment variable not configured' }),
    };
  }

  const seriesIds = seriesParam.split(',').map(s => s.trim()).filter(Boolean);
  const startDate = params.start || '2019-01-01';
  const endDate = params.end || new Date().toISOString().split('T')[0];

  try {
    const results = {};

    await Promise.all(
      seriesIds.map(async (seriesId) => {
        const url = new URL('https://api.stlouisfed.org/fred/series/observations');
        url.searchParams.set('series_id', seriesId);
        url.searchParams.set('api_key', apiKey);
        url.searchParams.set('file_type', 'json');
        url.searchParams.set('observation_start', startDate);
        url.searchParams.set('observation_end', endDate);
        url.searchParams.set('sort_order', 'asc');

        const response = await fetch(url.toString());

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`FRED API error for ${seriesId}: ${response.status} — ${text.slice(0, 200)}`);
        }

        const data = await response.json();

        results[seriesId] = (data.observations || [])
          .filter(obs => obs.value !== '.')
          .map(obs => ({
            date: obs.date,
            value: parseFloat(obs.value),
          }));
      })
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(results),
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
