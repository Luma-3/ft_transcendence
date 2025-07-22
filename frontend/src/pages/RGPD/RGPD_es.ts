
export default function RGPD_ES() {
  return `
	<div class="flex flex-col w-full h-full rounded-lg justify-center items-center mt-5 mb-10 dark:bg-dprimary">
  <div class="flex font-title text-responsive-size justify-center w-1/2 items-center text-tertiary dark:text-dtertiary">
    <section class="p-6 max-w-6xl mx-auto text-tertiary dark:text-dtertiary leading-relaxed text-sm sm:text-base">
      <h1 class="text-2xl font-bold mb-4">Política de Privacidad (RGPD)</h1>

      <p class="mb-4">
        Damos gran importancia a la protección de tus datos personales.
        De acuerdo con el Reglamento General de Protección de Datos (RGPD – Reglamento (UE) 2016/679),
        te informamos de manera clara y transparente sobre la recogida y el uso de tus datos.
        Esta política de privacidad describe los tipos de datos recogidos, su finalidad,
        la base legal del tratamiento, el período de conservación y tus derechos como usuario.
      </p>
      <div class="flex justify-center items-center mb-4">
        <img src="/images/duckCollect.png" alt="Política de Privacidad" class="w-40 h-40 rounded-lg mb-4" />
      </div>

      <h2 class="text-xl font-semibold mt-6 mb-2">Recogida y uso de datos personales</h2>
      <p class="mb-2">
        Nuestra aplicación de juego en línea (juego de Pong) permite a los usuarios crear una cuenta e iniciar sesión.
        Los datos personales recogidos durante el registro son necesarios para gestionar tu cuenta
        y mejorar tu experiencia de juego. Recogemos la siguiente información:
      </p>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li><strong>Nombre de usuario</strong>: tu identificador público en el juego.</li>
        <li><strong>Correo electrónico</strong>: utilizado para verificar la cuenta y activar la autenticación en dos pasos.</li>
        <li><strong>Contraseña</strong>: almacenada de forma cifrada (hash) para garantizar la seguridad.</li>
        <li><strong>Foto de perfil de Google</strong>: Solo se recupera el enlace a tu foto de perfil, y solo si te registras a través de Google.</li>
        <li><strong>ID de Google</strong>: identificador único de tu cuenta de Google, utilizado para la autenticación.</li>
        <li><strong>Foto de perfil / Banner</strong>: Si subes una foto de perfil o banner, se almacenará en nuestros servidores. Si la modificas, la nueva imagen reemplazará a la anterior.</li>
      </ul>

      <p class="mb-4">
        Estos datos son recogidos y tratados por TheDucksCompany, responsable del tratamiento de tus datos.
        La finalidad de la recogida es la gestión de tu cuenta de usuario y el acceso a las funcionalidades del juego (ejecución del contrato, puntuaciones, etc.).
        La base legal del tratamiento es la ejecución del contrato de registro (o tu consentimiento).
      </p>

      <p class="mb-4">
        Esta información no se vende ni se comunica a terceros no autorizados:
        solo los administradores del sitio y los proveedores técnicos esenciales tienen acceso a ella.
      </p>

      <p class="mb-4">
        Cada cuenta se identifica mediante un ID único (UUID), cifrado en nuestra base de datos.
        Toda tu información está encapsulada en tokens JWT seguros. Las conexiones a la aplicación se realizan mediante HTTPS.
      </p>

      <h2 class="text-xl font-semibold mt-6 mb-2">Derechos del usuario y gestión de datos</h2>

      <p class="mb-4">
        De acuerdo con el RGPD, dispones de varios derechos sobre tus datos personales.
        Puedes ejercer estos derechos desde tu perfil o contactándonos:
      </p>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li><strong>Derecho de acceso y rectificación</strong>: consultar y modificar tu información (nombre de usuario, correo, contraseña).</li>
        <li><strong>Derecho de supresión</strong>: eliminar de forma definitiva tu cuenta y los datos asociados (artículo 17 del RGPD).</li>
        <li><strong>Derecho a la limitación y portabilidad</strong>: obtener una copia de tus datos y limitar ciertos tratamientos.</li>
        <li><strong>Derecho a retirar el consentimiento / oposición</strong>: retirar tu consentimiento u oponerte a ciertos tratamientos.</li>
        <li><strong>Derecho a la anonimización</strong>: si lo solicitas, tus datos pueden ser anonimizados de forma irreversible.</li>
      </ul>

      <p class="mb-4">
        Para ejercer tus derechos, puedes eliminar tu cuenta desde la configuración o contactar al responsable del tratamiento en:
        <a href="mailto:contact@theduckscompany.com" class="text-dsecondary hover:underline">contact@theduckscompany.com</a>. Para más información, visita el sitio de la CNIL:
        <a href="https://www.cnil.fr" class="text-dsecondary hover:underline" target="_blank">cnil.fr</a>.
      </p>

      <div class="flex justify-center items-center mb-4">
        <img src="/images/duckPolice.png" alt="Política de Privacidad" class="w-40 h-40 rounded-lg mb-4" />
      </div>

      <h2 class="text-xl font-semibold mt-6 mb-2">Seguridad y conservación de los datos</h2>

      <p class="mb-4">
        Aplicamos medidas técnicas y organizativas para garantizar la seguridad de tus datos:
      </p>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li>Contraseñas cifradas antes de almacenarse.</li>
        <li>UUID cifrado.</li>
        <li>Comunicación segura mediante HTTPS.</li>
        <li>Tokens JWT firmados y seguros.</li>
      </ul>

      <p class="mb-4">
        Tus datos se conservan el tiempo necesario para prestar el servicio.
        Se eliminan o anonimizan cuando eliminas tu cuenta o cuando ya no son necesarios.
        No se conservan datos inactivos de forma indefinida. Se pueden conservar datos anonimizados (no identificables) sobre el rendimiento.
      </p>

      <h2 class="text-xl font-semibold mt-6 mb-2">Contacto</h2>

      <p class="mb-4">
        Para cualquier pregunta o solicitud relacionada con tus datos personales,
        contacta al responsable del tratamiento: <em>duckDataTreatment@theduckscompany.com</em>.<br>
        Si corresponde, nuestro delegado de protección de datos (DPO) está disponible en:
        <em>duckDPO@theduckscompany.com</em>.<br>
        Si consideras que no se han respetado tus derechos, puedes presentar una reclamación ante la CNIL:
        <a href="https://www.cnil.fr" class="text-dsecondary hover:underline" target="_blank">cnil.fr</a>.
      </p>

      <p class="text-sm text-white italic">
        Nos comprometemos a informarte sobre cualquier cambio sustancial en esta política de privacidad.
        Consulta esta página regularmente para mantenerte informado.
      </p>

      <p class="mt-4 text-xs text-white">
        Fuentes: Reglamento UE 2016/679 (RGPD) y Recomendaciones de la CNIL
      </p>
    </section>
  </div>
</div>
`
}