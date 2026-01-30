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
    const blob = blobs.find(b => b.pathname === BLOB_NAME);

    if (blob) {
      const response = await fetch(blob.url);
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    return new Response(JSON.stringify(defaultData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify(defaultData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const jsonString = JSON.stringify(body, null, 2);

    // Eliminar blob anterior si existe
    const { blobs } = await list();
    const existingBlob = blobs.find(b => b.pathname === BLOB_NAME);
    if (existingBlob) {
      await del(existingBlob.url);
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
