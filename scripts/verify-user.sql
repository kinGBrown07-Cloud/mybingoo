-- Vérifier l'utilisateur dans la table users
SELECT 
  id,
  email,
  name,
  role,
  "supabaseId",
  "createdAt",
  "updatedAt"
FROM users 
WHERE email = 'noblethique@gmail.com';
