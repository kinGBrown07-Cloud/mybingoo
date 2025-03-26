import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <WrenchScrewdriverIcon className="mx-auto h-24 w-24 text-indigo-600" />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Site en maintenance
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Notre équipe travaille actuellement sur l'amélioration du site.
          Nous serons bientôt de retour !
        </p>
        <div className="mt-8">
          <div className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100">
            Merci de votre patience
          </div>
        </div>
      </div>
    </div>
  );
}
