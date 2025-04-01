import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const adminAccounts = [
  {
    email: 'admin.principal@mybingoo.com',
    password: 'Admin2025@Bingoo',
    name: 'Administrateur Principal',
    role: 'ADMIN'
  },
  {
    email: 'admin.support@mybingoo.com',
    password: 'Admin2025@BingooTwo',
    name: 'Administrateur Support',
    role: 'ADMIN'
  }
];

export async function createAdminAccounts() {
  const supabase = createClientComponentClient();
  
  for (const admin of adminAccounts) {
    try {
      // 1. Créer le compte avec l'API d'administration Supabase
      const response = await supabase.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        email_confirm: true, // Marquer l'email comme vérifié
        user_metadata: {
          name: admin.name,
          role: admin.role
        }
      });

      const { data: { user }, error: authError } = response;

      if (authError) {
        if (authError.message === 'User already registered') {
          // Si l'utilisateur existe déjà, on met à jour son statut de vérification
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            user?.id || '',
            { email_confirm: true }
          );
          
          if (updateError) {
            console.error(`Erreur lors de la mise à jour de la vérification pour ${admin.email}:`, updateError);
          } else {
            console.log(`Statut de vérification mis à jour pour ${admin.email}`);
          }
        } else {
          throw authError;
        }
      }

      if (user) {
        // 2. Ajouter ou mettre à jour l'utilisateur dans la table users
        const { error: userError } = await supabase
          .from('users')
          .upsert({
            supabaseId: user.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
            emailVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });

        if (userError) {
          console.error(`Erreur lors de l'ajout de ${admin.email} dans la table users:`, userError);
        } else {
          console.log(`Compte admin créé avec succès pour ${admin.email}`);
        }
      }
    } catch (error) {
      console.error(`Erreur lors de la création du compte ${admin.email}:`, error);
    }
  }
}
