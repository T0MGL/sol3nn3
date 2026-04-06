import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const PoliticaPrivacidad = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/30">
        <div className="container max-w-[900px] mx-auto px-4 md:px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="text-sm">Volver al inicio</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-[900px] mx-auto px-4 md:px-6 py-8 md:py-12 pb-24">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Politica de Privacidad</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Ultima actualizacion: {new Date().toLocaleDateString('es-PY', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="prose prose-invert prose-sm md:prose-base max-w-none space-y-8">
          {/* Introduccion */}
          <section className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              SOLENNE ("nosotros", "nuestro" o "la empresa") se compromete a proteger la privacidad de sus datos personales
              de conformidad con la <strong>Ley N. 6534/2020 de Proteccion de Datos Personales Crediticios</strong> de la
              Republica del Paraguay y demas normativas aplicables.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Esta Politica de Privacidad describe como recopilamos, utilizamos, almacenamos y protegemos su informacion
              personal cuando utiliza nuestro sitio web, realiza compras o interactua con nosotros por cualquier canal de comunicacion.
            </p>
          </section>

          {/* 1. Responsable */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">1. Responsable del Tratamiento de Datos</h2>
            <p className="text-muted-foreground leading-relaxed">
              El responsable del tratamiento de sus datos personales es SOLENNE, con domicilio en Asuncion, Paraguay.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>WhatsApp: +595 976 287180</li>
              <li>Instagram: @bysolenne</li>
            </ul>
          </section>

          {/* 2. Datos que Recopilamos */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">2. Datos Personales que Recopilamos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Recopilamos los siguientes datos personales al realizar una compra o interactuar con nosotros:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Datos de identificacion:</strong> Nombre completo</li>
              <li><strong>Datos de contacto:</strong> Numero de telefono celular, correo electronico (cuando se proporciona)</li>
              <li><strong>Datos de ubicacion:</strong> Direccion de entrega, ciudad, coordenadas GPS (opcional, para facilitar la entrega)</li>
              <li><strong>Datos de la transaccion:</strong> Productos adquiridos, monto, fecha de compra, metodo de pago seleccionado, numero de pedido</li>
              <li><strong>Datos de comunicacion:</strong> Historial de conversaciones por WhatsApp y otros canales de atencion al cliente</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>No recopilamos:</strong> Datos bancarios completos ni numeros de tarjeta de credito. Estos son procesados
              directamente por nuestro proveedor de pagos Stripe, quien cuenta con certificacion PCI-DSS.
            </p>
          </section>

          {/* 3. Finalidad */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">3. Finalidad del Tratamiento de Datos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sus datos personales seran utilizados para las siguientes finalidades:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Procesar y gestionar su pedido</li>
              <li>Coordinar la entrega de su producto</li>
              <li>Contactarlo en caso de incidencias con su pedido</li>
              <li>Gestionar devoluciones o reclamos bajo nuestra garantia</li>
              <li>Cumplir con obligaciones legales y tributarias</li>
              <li>Enviar comunicaciones relacionadas con su compra (confirmacion, estado del envio)</li>
              <li><strong>Enviar comunicaciones comerciales, promociones, lanzamientos de nuevos productos y contenido de marketing por WhatsApp, correo electronico u otros canales</strong></li>
              <li>Mejorar nuestros productos y servicios en base a la retroalimentacion recibida</li>
              <li>Realizar analisis estadisticos anonimizados sobre el uso de nuestros servicios</li>
            </ul>
          </section>

          {/* 4. Consentimiento y Marketing */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">4. Consentimiento para Comunicaciones Comerciales</h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Al completar una compra en nuestro sitio web o al iniciar una conversacion por WhatsApp,
              usted otorga su consentimiento expreso para que SOLENNE retenga sus datos de contacto y los utilice
              para enviarle comunicaciones comerciales</strong>, incluyendo pero no limitado a: promociones, ofertas especiales,
              lanzamientos de nuevos productos, contenido educativo sobre cuidado de la piel y novedades de la marca.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Este consentimiento es voluntario y puede ser revocado en cualquier momento escribiendo "DEJAR DE RECIBIR"
              por WhatsApp o solicitandolo a nuestros canales de atencion. La revocacion del consentimiento para comunicaciones
              comerciales no afecta la licitud del tratamiento previo ni el procesamiento de sus datos para las demas finalidades
              descritas en esta politica.
            </p>
          </section>

          {/* 5. Base Legal */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">5. Base Legal del Tratamiento</h2>
            <p className="text-muted-foreground leading-relaxed">
              El tratamiento de sus datos se fundamenta en:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Consentimiento:</strong> Otorgado al completar la compra o iniciar comunicacion con nosotros</li>
              <li><strong>Ejecucion contractual:</strong> Necesario para procesar y entregar su pedido</li>
              <li><strong>Interes legitimo:</strong> Para enviar comunicaciones comerciales a clientes existentes sobre productos similares</li>
              <li><strong>Obligaciones legales:</strong> Cumplimiento de normativas tributarias paraguayas</li>
            </ul>
          </section>

          {/* 6. Conservacion */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">6. Conservacion de Datos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sus datos personales seran conservados durante el tiempo necesario para cumplir con las finalidades
              descritas, por el periodo requerido por la legislacion tributaria paraguaya (minimo 5 anos para
              documentacion comercial) y mientras exista una relacion comercial activa o consentimiento vigente para
              comunicaciones de marketing.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Los datos de comunicacion y marketing se conservaran hasta que usted revoque su consentimiento.
              Una vez cumplido el periodo de conservacion, sus datos seran eliminados o anonimizados de forma segura.
            </p>
          </section>

          {/* 7. Derechos ARCO */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">7. Sus Derechos (ARCO)</h2>
            <p className="text-muted-foreground leading-relaxed">
              De acuerdo con la Ley N. 6534/2020, usted tiene los siguientes derechos sobre sus datos personales:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Acceso:</strong> Conocer que datos suyos tenemos almacenados</li>
              <li><strong>Rectificacion:</strong> Corregir datos inexactos o incompletos</li>
              <li><strong>Cancelacion/Supresion:</strong> Solicitar la eliminacion de sus datos cuando ya no sean necesarios</li>
              <li><strong>Oposicion:</strong> Oponerse al tratamiento de sus datos para finalidades especificas, incluyendo marketing</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Para ejercer estos derechos, puede contactarnos por WhatsApp o Instagram. Responderemos a su solicitud
              en un plazo maximo de 10 dias habiles.
            </p>
          </section>

          {/* 8. Seguridad */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">8. Medidas de Seguridad</h2>
            <p className="text-muted-foreground leading-relaxed">
              Implementamos medidas tecnicas y organizativas para proteger sus datos personales contra acceso
              no autorizado, perdida, alteracion o destruccion, incluyendo:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Conexiones seguras mediante protocolo HTTPS/SSL</li>
              <li>Procesamiento de pagos a traves de Stripe (certificacion PCI-DSS nivel 1)</li>
              <li>Acceso restringido a datos personales solo a personal autorizado</li>
              <li>Almacenamiento en servidores seguros con encriptacion</li>
              <li>Comunicaciones por WhatsApp Business API con encriptacion de extremo a extremo</li>
            </ul>
          </section>

          {/* 9. Transferencia a Terceros */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">9. Transferencia de Datos a Terceros</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sus datos pueden ser compartidos unicamente con:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Servicio de entregas:</strong> Para coordinar la entrega de su pedido (solo nombre, telefono y direccion)</li>
              <li><strong>Procesador de pagos (Stripe):</strong> Para procesar transacciones con tarjeta de manera segura</li>
              <li><strong>Plataformas de comunicacion (WhatsApp Business, Chatwoot):</strong> Para gestionar la atencion al cliente</li>
              <li><strong>Plataformas de analisis (Meta Pixel, Google Analytics):</strong> Para medir el rendimiento de campanas publicitarias (datos anonimizados)</li>
              <li><strong>Autoridades competentes:</strong> Cuando sea requerido por ley</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              No vendemos, alquilamos ni compartimos sus datos personales con terceros para fines distintos a los aqui mencionados.
            </p>
          </section>

          {/* 10. Cookies */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">10. Cookies y Tecnologias de Seguimiento</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nuestro sitio web utiliza cookies y tecnologias similares para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Garantizar el funcionamiento correcto del sitio</li>
              <li>Analizar el trafico del sitio</li>
              <li>Medir la efectividad de nuestras campanas publicitarias (Meta Pixel)</li>
              <li>Personalizar su experiencia de navegacion</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Al utilizar nuestro sitio web, usted acepta el uso de estas tecnologias.
              Puede configurar su navegador para rechazar cookies, aunque esto puede afectar algunas funcionalidades del sitio.
            </p>
          </section>

          {/* 11. Menores */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">11. Menores de Edad</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nuestros productos y servicios estan dirigidos a personas mayores de 18 anos. No recopilamos
              intencionalmente datos de menores de edad. Si detectamos que hemos recopilado datos de un menor,
              procederemos a eliminarlos inmediatamente.
            </p>
          </section>

          {/* 12. Cambios */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">12. Modificaciones a esta Politica</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nos reservamos el derecho de modificar esta Politica de Privacidad en cualquier momento.
              Las modificaciones entraran en vigencia desde su publicacion en este sitio web.
              Le recomendamos revisar periodicamente esta pagina.
            </p>
          </section>

          {/* 13. Contacto */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">13. Contacto</h2>
            <p className="text-muted-foreground leading-relaxed">
              Si tiene preguntas sobre esta Politica de Privacidad o desea ejercer sus derechos,
              puede contactarnos a traves de:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>WhatsApp: +595 976 287180</li>
              <li>Instagram: @bysolenne</li>
            </ul>
          </section>

          {/* Marco Legal */}
          <section className="mt-12 pt-8 border-t border-border/30">
            <p className="text-xs text-muted-foreground/60 leading-relaxed">
              Esta Politica de Privacidad se rige por la legislacion de la Republica del Paraguay,
              en particular la Ley N. 6534/2020 "De Proteccion de Datos Personales Crediticios",
              la Ley N. 1334/98 "De Defensa del Consumidor y del Usuario", el Codigo Civil paraguayo
              y demas normativas aplicables.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border/30 py-8 px-4">
        <div className="container max-w-[900px] mx-auto text-center">
          <p className="text-2xl font-bold tracking-tighter opacity-70">SOLENNE</p>
          <p className="text-[10px] md:text-xs text-muted-foreground/60 font-light mt-4">
            &copy; {new Date().getFullYear()} SOLENNE. Todos los Derechos Reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PoliticaPrivacidad;
