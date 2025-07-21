import { headerPage } from "../components/ui/headerPage";

export default function RGPD() {
  return `
	<div class="flex flex-col w-full h-full rounded-lg justify-center mt-10 p-12">
		${headerPage("rgpd")}
		
		<div class="flex flex-col w-full h-full rounded-lg justify-center items-center mt-5 mb-10 dark:bg-dprimary">
			
			<div class="flex font-title text-responsive-size justify-center w-1/2 items-center text-tertiary dark:text-dtertiary">
	<section class="p-6 max-w-6xl mx-auto text-tertiary dark:text-dtertiary leading-relaxed text-sm sm:text-base">
  <h1 class="text-2xl font-bold mb-4">Politique de confidentialité (RGPD)</h1>

  <p class="mb-4">
    Nous accordons une grande importance à la protection de vos données personnelles.
    Conformément au Règlement général sur la protection des données (RGPD – Règlement (UE) 2016/679),
    nous vous informons de manière claire et transparente sur la collecte et l’utilisation de vos données.
    Cette politique de confidentialité décrit les types de données collectées, leur finalité,
    la base légale du traitement, la durée de conservation, ainsi que vos droits en tant qu’utilisateur.
  </p>
  <div class="flex justify-center items-center mb-4">
  <img src="/images/duckCollect.png" alt="Politique de confidentialité" class="w-40 h-40 rounded-lg mb-4" />
  </div>
  <h2 class="text-xl font-semibold mt-6 mb-2">Collecte et utilisation des données personnelles</h2>
  <p class="mb-2">
    Notre application de jeu en ligne (jeu Pong) permet aux utilisateurs de créer un compte et de se connecter.
    Les données personnelles collectées lors de l’inscription sont nécessaires pour gérer votre compte
    et améliorer votre expérience de jeu. Nous recueillons notamment les informations suivantes :
  </p>

  <ul class="list-disc list-inside mb-4 space-y-1">
    <li><strong>Pseudonyme</strong> : votre identifiant public dans le jeu.</li>
    <li><strong>Adresse e-mail</strong> : utilisée pour la vérification du compte.</li>
    <li><strong>Mot de passe</strong> : stocké sous forme hachée (non lisible) pour garantir la sécurité.</li>
    <li><strong>Photo de profil Google</strong> : Aucune photos n'est récupérée, seulement un lien vers votre photo sur Google. Cela s'applique uniquement si vous vous inscrivez via Google.</li>
    <li><strong>Photo de profil / Bannière</strong> : Si vous téléchargez une photo de profil ou une bannière, celles-ci seront stockées sur nos serveurs. Si vous la modifier, la nouvelle image écrasera l'ancienne sur le serveur.</li>
  </ul>

  <p class="mb-4">
    Ces données sont collectées et traitées par TheDucksCompany,
    responsable du traitement de vos données. La finalité de la collecte est la gestion de votre compte utilisateur
    et l’accès aux fonctionnalités du jeu (exécution du contrat de service, gestion des scores, etc.).
    La base légale est l’exécution de votre contrat d’inscription (ou votre consentement).
  </p>

  <p class="mb-4">
    Ces informations ne sont ni vendues ni communiquées à des tiers non autorisés :
    seuls les administrateurs du site et les prestataires techniques nécessaires au service y ont accès.
  </p>

  <p class="mb-4">
    Chaque compte est identifié par un identifiant unique (UUID), crypté dans notre base de données.
    Toutes vos informations sont encapsulées dans des jetons JWT sécurisés. Les connexions à l’application se font en HTTPS.
  </p>

  <h2 class="text-xl font-semibold mt-6 mb-2">Droits des utilisateurs et gestion des données</h2>

  <p class="mb-4">
    Conformément au RGPD, vous disposez de plusieurs droits sur vos données personnelles.
    Vous pouvez exercer ces droits depuis votre espace personnel ou en nous contactant :
  </p>

  <ul class="list-disc list-inside mb-4 space-y-1">
    <li><strong>Droit d’accès et de rectification</strong> : consulter et modifier vos informations (pseudo, email, mot de passe).</li>
    <li><strong>Droit à l’effacement</strong> : supprimer définitivement votre compte et les données associées (article 17 du RGPD).</li>
    <li><strong>Droit à la limitation et à la portabilité</strong> : obtenir une copie de vos données et limiter certains traitements.</li>
    <li><strong>Droit de retirer votre consentement / opposition</strong> : retirer votre consentement ou vous opposer à certains traitements.</li>
    <li><strong>Droit à l’anonymisation</strong> : sur demande, vos données peuvent être rendues anonymes de manière irréversible.</li>
  </ul>

  <p class="mb-4">
    Pour exercer vos droits, vous pouvez supprimer votre compte dans vos reglages ou contacter notre responsable du traitement a l'adresse mail suivante :
    <a href="mailto:contact@theduckscompany.com" class="text-blue-600 hover:underline">contact@theduckscompany.com</a>. Pour plus d’informations, consultez le site de la CNIL :
    <a href="https://www.cnil.fr" class="text-blue-600 hover:underline" target="_blank">cnil.fr</a>.
  </p>
  <div class="flex justify-center items-center mb-4">
  <img src="/images/duckPolice.png" alt="Politique de confidentialité" class="w-40 h-40 rounded-lg mb-4" />
  </div>
  <h2 class="text-xl font-semibold mt-6 mb-2">Sécurité et conservation des données</h2>

  <p class="mb-4">
    Nous mettons en œuvre des mesures techniques et organisationnelles pour garantir la sécurité de vos données :
  </p>

  <ul class="list-disc list-inside mb-4 space-y-1">
    <li>Mot de passe haché avant stockage.</li>
    <li>UUID crypté.</li>
    <li>Communication sécurisée en HTTPS.</li>
    <li>JWT signés et sécurisés.</li>
  </ul>

  <p class="mb-4">
    Vos données sont conservées le temps nécessaire à la fourniture du service.
    Elles sont supprimées ou anonymisées lorsque vous supprimez votre compte
    ou lorsqu’elles ne sont plus nécessaires. Aucune donnée inactive n’est conservée indéfiniment.
    Des performances anonymisées (non identifiables) peuvent être conservées.
  </p>

  <h2 class="text-xl font-semibold mt-6 mb-2">Contact</h2>

  <p class="mb-4">
    Pour toute question ou demande relative à vos données personnelles,
    contactez le responsable du traitement : <em>duckDataTreatment@theduckscompany.com</em>.<br>
    Le cas échéant, notre délégué à la protection des données (DPO) est joignable à l’adresse :
    <em>duckDPO@theduckscompany.com</em>.<br>
    Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation
    auprès de la CNIL : <a href="https://www.cnil.fr" class="text-blue-600 hover:underline" target="_blank">cnil.fr</a>.
  </p>

  <p class="text-sm text-gray-500 italic">
    Nous nous engageons à vous informer de toute modification substantielle de cette politique de confidentialité.
    Consultez régulièrement cette page pour rester informé.
  </p>

  <p class="mt-4 text-xs text-gray-400">
    Sources : Règlement UE 2016/679 (RGPD) & Recommandations CNIL
  </p>
</section>

			</div>
		</div>`
}