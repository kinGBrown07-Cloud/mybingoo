export default function VerifyRequest() {
  return (
    <div className="max-w-lg mx-auto text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Vérifiez votre email</h2>
      <p className="text-gray-600 mb-4">
        Un lien de confirmation a été envoyé à votre adresse email.
      </p>
      <p className="text-gray-600 mb-8">
        Veuillez cliquer sur le lien dans l'email pour activer votre compte.
      </p>
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <p className="text-sm text-orange-700">
          Si vous ne trouvez pas l'email, vérifiez votre dossier spam.
        </p>
      </div>
    </div>
  );
}
