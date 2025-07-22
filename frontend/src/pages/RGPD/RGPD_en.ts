
export default function RGPD_EN() {
  return `

		
	<div class="flex flex-col w-full h-full rounded-lg justify-center items-center mt-5 mb-10 dark:bg-dprimary">
  <div class="flex font-title text-responsive-size justify-center w-1/2 items-center text-tertiary dark:text-dtertiary">
    <section class="p-6 max-w-6xl mx-auto text-tertiary dark:text-dtertiary leading-relaxed text-sm sm:text-base">
      <h1 class="text-2xl font-bold mb-4">Privacy Policy (GDPR)</h1>

      <p class="mb-4">
        We place great importance on the protection of your personal data.
        In accordance with the General Data Protection Regulation (GDPR – Regulation (EU) 2016/679),
        we inform you clearly and transparently about the collection and use of your data.
        This privacy policy describes the types of data collected, their purpose,
        the legal basis for processing, retention period, and your rights as a user.
      </p>
      <div class="flex justify-center items-center mb-4">
        <img src="/images/duckCollect.png" alt="Privacy Policy" class="w-40 h-40 rounded-lg mb-4" />
      </div>

      <h2 class="text-xl font-semibold mt-6 mb-2">Collection and Use of Personal Data</h2>
      <p class="mb-2">
        Our online gaming application (Pong game) allows users to create an account and log in.
        The personal data collected during registration is necessary to manage your account
        and improve your gaming experience. We collect the following information:
      </p>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li><strong>Username</strong>: your public identifier in the game.</li>
        <li><strong>Email address</strong>: used for account verification and two-factor authentication.</li>
        <li><strong>Password</strong>: stored in hashed form (unreadable) to ensure security.</li>
        <li><strong>Google profile picture</strong>: Only the link to your profile photo is retrieved, and only if you sign up via Google.</li>
        <li><strong>Google ID</strong>: unique identifier of your Google account, used for authentication.</li>
        <li><strong>Profile picture / Banner</strong>: If you upload a profile picture or banner, it will be stored on our servers. If you change it, the new image will replace the old one.</li>
      </ul>

      <p class="mb-4">
        This data is collected and processed by TheDucksCompany, the controller of your data.
        The purpose of the collection is to manage your user account and access to game features (contract execution, score tracking, etc.).
        The legal basis is the execution of your registration contract (or your consent).
      </p>

      <p class="mb-4">
        This information is not sold or shared with unauthorized third parties:
        only site administrators and essential technical service providers have access to it.
      </p>

      <p class="mb-4">
        Each account is identified by a unique ID (UUID), encrypted in our database.
        All your information is encapsulated in secure JWT tokens. Connections to the application are encrypted via HTTPS.
      </p>

      <h2 class="text-xl font-semibold mt-6 mb-2">User Rights and Data Management</h2>

      <p class="mb-4">
        In accordance with the GDPR, you have several rights regarding your personal data.
        You can exercise these rights from your personal account or by contacting us:
      </p>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li><strong>Right of access and rectification</strong>: view and edit your information (username, email, password).</li>
        <li><strong>Right to erasure</strong>: permanently delete your account and associated data (Article 17 of the GDPR).</li>
        <li><strong>Right to restriction and portability</strong>: get a copy of your data and restrict certain processing.</li>
        <li><strong>Right to withdraw consent / object</strong>: withdraw consent or object to certain processing.</li>
        <li><strong>Right to anonymization</strong>: on request, your data can be irreversibly anonymized.</li>
      </ul>

      <p class="mb-4">
        To exercise your rights, you can delete your account from your settings or contact our data controller at:
        <a href="mailto:contact@theduckscompany.com" class="text-dsecondary hover:underline">contact@theduckscompany.com</a>. For more info, visit the CNIL website:
        <a href="https://www.cnil.fr" class="text-dsecondary hover:underline" target="_blank">cnil.fr</a>.
      </p>

      <div class="flex justify-center items-center mb-4">
        <img src="/images/duckPolice.png" alt="Privacy Policy" class="w-40 h-40 rounded-lg mb-4" />
      </div>

      <h2 class="text-xl font-semibold mt-6 mb-2">Data Security and Retention</h2>

      <p class="mb-4">
        We implement technical and organizational measures to ensure the security of your data:
      </p>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li>Passwords are hashed before being stored.</li>
        <li>UUID is encrypted.</li>
        <li>Secure HTTPS communication.</li>
        <li>Signed and secure JWT tokens.</li>
      </ul>

      <p class="mb-4">
        Your data is kept only as long as needed for the service.
        It is deleted or anonymized when you delete your account or when no longer necessary.
        No inactive data is kept indefinitely. Anonymous (non-identifiable) performance data may be retained.
      </p>

      <h2 class="text-xl font-semibold mt-6 mb-2">Contact</h2>

      <p class="mb-4">
        For any questions or requests related to your personal data,
        contact the data controller: <em>duckDataTreatment@theduckscompany.com</em>.<br>
        If applicable, our Data Protection Officer (DPO) can be reached at:
        <em>duckDPO@theduckscompany.com</em>.<br>
        If you believe your rights are not respected, you may file a complaint with CNIL:
        <a href="https://www.cnil.fr" class="text-dsecondary hover:underline" target="_blank">cnil.fr</a>.
      </p>

      <p class="text-sm text-white italic">
        We are committed to informing you of any substantial changes to this privacy policy.
        Please check this page regularly to stay informed.
      </p>

      <p class="mt-4 text-xs text-white">
        Sources: EU Regulation 2016/679 (GDPR) & CNIL Recommendations
      </p>
    </section>
  </div>

		</div>`
}