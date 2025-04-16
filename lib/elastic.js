import { Client } from '@elastic/elasticsearch';

export const client = process.env.NODE_ENV === 'development'
  ? new Client({
      node: process.env.ELASTIC_URL, // ejemplo: http://localhost:9200
    })
  : new Client({
      node: process.env.ELASTICSEARCH_URL,
      auth: {
        apiKey: process.env.ELASTICSEARCH_API_KEY,
      },
    });
