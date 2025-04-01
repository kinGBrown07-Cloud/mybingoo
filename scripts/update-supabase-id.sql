-- Récupérer l'ID Supabase et mettre à jour l'utilisateur
WITH supabase_user AS (
  SELECT id
  FROM auth.users
  WHERE email = 'noblethique@gmail.com'
)
UPDATE users 
SET "supabaseId" = (SELECT id FROM supabase_user)
WHERE email = 'noblethique@gmail.com';
