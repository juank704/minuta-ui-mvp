import { client } from '../../lib/elastic';

export default async function handler(req, res) {
  try {
    const result = await client.search({
      index: 'minutas',
      size: 100,
      query: {
        match_all: {}
      },
      sort: [{ fecha: { order: 'desc' } }]
    });

    res.status(200).json(result.hits.hits.map(hit => ({
      id: hit._id,
      ...hit._source
    })));
  } catch (error) {
    console.error('Error en /api/todas:', error);
    res.status(500).json({ error: 'Error al buscar minutas', detalle: error.message });
  }
}
