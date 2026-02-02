import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const prerender = false;

const TABLE_NAME = 'resultados';

const defaultData = {
  dobles: {
    participantes: {
      A: "",
      B: "",
      C: "",
      D: ""
    },
    partidos: []
  },
  individual: {
    participantes: {
      A: "",
      B: "",
      C: "",
      D: "",
      E: ""
    },
    partidos: []
  },
  programacion: []
};

const noCacheHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
  'Pragma': 'no-cache',
  'Expires': '0'
};

export const GET: APIRoute = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('data')
      .eq('id', 1)
      .single();

    if (error || !data) {
      return new Response(JSON.stringify(defaultData), {
        status: 200,
        headers: noCacheHeaders
      });
    }

    return new Response(JSON.stringify(data.data), {
      status: 200,
      headers: noCacheHeaders
    });
  } catch (error) {
    return new Response(JSON.stringify(defaultData), {
      status: 200,
      headers: noCacheHeaders
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const { error } = await supabase
      .from(TABLE_NAME)
      .upsert({ id: 1, data: body, updated_at: new Date().toISOString() });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
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
