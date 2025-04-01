-- Mettre à jour le rôle dans auth.users
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"ADMIN"'
)
WHERE email = 'noblethique@gmail.com';

-- Mettre à jour le rôle dans notre table users
UPDATE users 
SET role = 'ADMIN'
WHERE email = 'noblethique@gmail.com';
