import type { APIRoute } from 'astro';
import { put, list, del } from '@vercel/blob';

export const prerender = false;

const BLOB_NAME = 'resultados.json';

const defaultData = {
  dobles: {
    participantes: {
      A: "Margarita Arizaga / Dora Yánez",
      B: "Paula Bak / Mónica Castrillejo",
      C: "Nadia Marcos / María Jesús Serna",
      D: "Mónica Rodríguez / Ana María Caballero"
    },
    partidos: []
  },
  individual: {
    participantes: {
      A: "Mónica Rodríguez",
      B: "Paula Bak",
      C: "Margarita Arizaga",
      D: "Mónica Castrillejo",
      E: "Jamie Gissel Valencia"
    },
    partidos: []
  }
};

export const GET: APIRoute = async () => {
  try {
    const { blobs } = await list();

    // Buscar el blob más reciente que contenga nuestro nombre
    const matchingBlobs = blobs
      .filter(b => b.pathname.includes('resultados'))
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    if (matchingBlobs.length > 0) {
      const latestBlob = matchingBlobs[0];

      // Eliminar blobs antiguos (mantener solo el más reciente)
      for (let i = 1; i < matchingBlobs.length; i++) {
        try {
          await del(matchingBlobs[i].url);
        } catch (e) {}
      }

      const response = await fetch(latestBlob.url + '?t=' + Date.now());
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    return new Response(JSON.stringify(defaultData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify(defaultData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, max-age=0',
        'CDN-Cache-Control': 'no-store'
      }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const jsonString = JSON.stringify(body, null, 2);

    // Eliminar TODOS los blobs anteriores
    const { blobs } = await list();
    const matchingBlobs = blobs.filter(b => b.pathname.includes('resultados'));

    for (const blob of matchingBlobs) {
      try {
        await del(blob.url);
      } catch (e) {}
    }

    // Crear nuevo blob
    const blob = await put(BLOB_NAME, jsonString, {
      access: 'public',
      contentType: 'application/json'
    });

    return new Response(JSON.stringify({ success: true, url: blob.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Error al guardar' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
