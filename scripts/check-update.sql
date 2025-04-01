-- Vérifier que le supabaseId a bien été mis à jour
SELECT u.id, u.email, u."supabaseId", a.id as auth_id
FROM users u
LEFT JOIN auth.users a ON a.email = u.email
WHERE u.email = 'noblethique@gmail.com';
