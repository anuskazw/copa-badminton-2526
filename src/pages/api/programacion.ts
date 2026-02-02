import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const prerender = false;

const TABLE_NAME = 'programacion';

const noCacheHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
  'Pragma': 'no-cache',
  'Expires': '0'
};

// GET - Obtener todos los partidos ordenados
export const GET: APIRoute = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('orden', { ascending: true });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: noCacheHeaders
      });
    }

    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: noCacheHeaders
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: noCacheHeaders
    });
  }
};

// POST - Guardar toda la programación (reemplaza todo)
export const POST: APIRoute = async ({ request }) => {
  try {
    const partidos = await request.json();

    // Eliminar todos los registros existentes
    await supabase.from(TABLE_NAME).delete().neq('id', 0);

    // Insertar los nuevos registros con orden
    if (partidos && partidos.length > 0) {
      const partidosConOrden = partidos.map((p: any, index: number) => ({
        enfrentamiento: p.enfrentamiento || '',
        modalidad: p.modalidad || '',
        pista: p.pista || '',
        hora: p.hora || '',
        orden: index
      }));

      const { error } = await supabase
        .from(TABLE_NAME)
        .insert(partidosConOrden);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
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
