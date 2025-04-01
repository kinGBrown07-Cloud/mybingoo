-- Vérifier le profil complet
SELECT 
  id,
  name,
  email,
  phone,
  country,
  role,
  points,
  balance,
  currency,
  "costPerPlay",
  "emailVerified",
  "affiliateCode",
  "supabaseId"
FROM users 
WHERE email = 'noblethique@gmail.com';
