-- Mettre à jour le profil avec des informations plus complètes
UPDATE users 
SET 
  name = 'Admin',
  phone = '98712666',  -- Numéro de téléphone fictif
  country = 'TG',         -- Togo par défaut
  currency = 'XOF',       -- XOF par défaut
  "costPerPlay" = 300,      -- Coût par partie pour l'Afrique
  "emailVerified" = NOW(),  -- Marquer l'email comme vérifié
  "affiliateCode" = 'ADMIN001'  -- Code d'affiliation unique pour l'admin
WHERE email = 'noblethique@gmail.com';
