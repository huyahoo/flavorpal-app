drop view if exists "public"."product_interactions_view";

alter table "public"."ai_suggestions" alter column "opinion" drop not null;

alter table "public"."ai_suggestions" alter column "reason" drop not null;

alter table "public"."history" enable row level security;

alter table "public"."products" alter column "brands" set data type text using "brands"::text;

alter table "public"."products" alter column "categories" set data type text using "categories"::text;

alter table "public"."user_badges" enable row level security;

create or replace view "public"."reviews_view" as  SELECT reviews.id AS review_id,
    products.id AS product_id,
    products.barcode AS product_barcode,
    products.name AS product_name,
    products.brands AS product_brands,
    products.image_url AS product_image_url,
    reviews.rating AS review_rating,
    reviews.note AS review_note,
    users.id AS reviewer_id,
    users.raw_user_meta_data AS reviewer_metadata,
    reviews.created_at AS date_reviewed,
    reviews.likes_count,
    ai_suggestions.opinion AS ai_health_opinion,
    ai_suggestions.reason AS ai_health_reason
   FROM (((reviews
     JOIN products ON ((reviews.product_id = products.id)))
     JOIN auth.users ON ((reviews.user_id = users.id)))
     LEFT JOIN ai_suggestions ON ((reviews.product_id = ai_suggestions.product_id)));


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


create policy "Enable delete for users based on user_id"
on "public"."history"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."history"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."history"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable delete for users based on user_id"
on "public"."user_badges"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."user_badges"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."user_badges"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



