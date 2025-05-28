create or replace view "public"."product_interactions_view" as  SELECT p.id AS product_id,
    p.barcode,
    p.name,
    p.brands,
    p.image_url,
    p.categories,
        CASE
            WHEN (r.id IS NOT NULL) THEN true
            ELSE false
        END AS is_reviewed,
    r.rating AS user_rating,
    r.note AS user_note,
    r.created_at AS date_reviewed,
    r.likes_count,
    h.created_at AS date_scanned,
    ai.opinion AS ai_opinion,
    ai.reason AS ai_reason
   FROM (((history h
     JOIN products p ON ((h.product_id = p.id)))
     LEFT JOIN reviews r ON (((h.product_id = r.product_id) AND (r.user_id = h.user_id))))
     LEFT JOIN ai_suggestions ai ON (((ai.product_id = h.product_id) AND (ai.user_id = h.user_id))));



