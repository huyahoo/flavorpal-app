set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_similar_products(query_vector vector, min_similarity double precision DEFAULT 0.7)
 RETURNS TABLE(id bigint, image_embedding vector, similarity double precision)
 LANGUAGE sql
AS $function$
  SELECT
    p.id,
    p.image_embedding,
    (1 - (p.image_embedding <-> query_vector)) as similarity
  FROM products p
  WHERE (1 - (p.image_embedding <-> query_vector)) > min_similarity
  ORDER BY p.image_embedding <-> query_vector  -- Still order by distance for performance
  LIMIT 1;
$function$
;


