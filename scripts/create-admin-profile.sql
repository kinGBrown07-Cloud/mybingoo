-- D'abord, vérifier et récupérer l'ID Supabase de l'utilisateur
WITH supabase_user AS (
  SELECT 
    id::text as supabase_id,
    email,
    raw_user_meta_data->>'role' as role
  FROM auth.users
  WHERE email = 'noblethique@gmail.com'
)
-- Ensuite, créer l'utilisateur dans notre table users s'il n'existe pas déjà
INSERT INTO users (
  id,
  email,
  name,
  password,
  role,
  points,
  balance,
  phone,
  country,
  currency,
  "affiliateCode",
  "referralCount",
  "referralEarnings",
  "regionId",
  "supabaseId",
  "createdAt",
  "updatedAt"
)
SELECT 
  gen_random_uuid(),
  su.email,
  'Admin',
  crypt('Admin123!@#', gen_salt('bf')),
  'ADMIN',
  1000,
  1000.00,
  '+33123456789', 
  'FR', 
  'EUR', 
  'ADMIN' || gen_random_uuid(), 
  0, 
  0, 
  (SELECT id FROM regions WHERE name = 'EUROPE' LIMIT 1), 
  su.supabase_id,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM supabase_user su
WHERE NOT EXISTS (
  -- Vérifier que l'utilisateur n'existe pas déjà dans notre table users
  -- soit par email, soit par supabase_id
  SELECT 1 FROM users u 
  WHERE u.email = su.email 
  OR u."supabaseId" = su.supabase_id
)
RETURNING id, email, role, "supabaseId";
