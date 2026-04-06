import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const TerminosCondiciones = () => {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Terminos y Condiciones</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Ultima actualizacion: {new Date().toLocaleDateString('es-PY', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="prose prose-invert prose-sm md:prose-base max-w-none space-y-8">
          {/* Introduccion */}
          <section className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Bienvenido a SOLENNE. Los presentes Terminos y Condiciones regulan el uso de nuestro sitio web
              y la compra de nuestros productos. Al realizar una compra, usted acepta estos terminos en su totalidad.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Estos terminos se rigen por la <strong>Ley N. 1334/98 de Defensa del Consumidor y del Usuario</strong> de
              la Republica del Paraguay y demas normativas aplicables.
            </p>
          </section>

          {/* 1. Identificacion */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">1. Identificacion del Vendedor</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Nombre comercial:</strong> SOLENNE</li>
              <li><strong>Actividad:</strong> Distribucion y comercializacion de productos cosmeticos</li>
              <li><strong>Domicilio:</strong> Asuncion, Paraguay</li>
              <li><strong>Contacto:</strong> WhatsApp +595 976 287180 | Instagram @bysolenne</li>
            </ul>
          </section>

          {/* 2. Naturaleza del negocio */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">2. Naturaleza del Negocio y Rol del Distribuidor</h2>
            <p className="text-muted-foreground leading-relaxed">
              SOLENNE opera exclusivamente como <strong>distribuidor y comercializador</strong> de productos cosmeticos
              de marcas internacionales. SOLENNE no es el fabricante, formulador ni laboratorio productor de los
              productos que comercializa.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              La formulacion, composicion, proceso de manufactura, pruebas de laboratorio y control de calidad de los
              productos son responsabilidad exclusiva del fabricante original. SOLENNE distribuye los productos en su
              empaque original, sin alteraciones ni modificaciones de ninguna naturaleza.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              La informacion sobre ingredientes, beneficios y modo de uso que figura en nuestro sitio web y materiales
              promocionales se basa en la informacion proporcionada por el fabricante. SOLENNE no realiza pruebas
              clinicas independientes ni garantiza resultados especificos derivados del uso del producto.
            </p>
          </section>

          {/* 3. Productos */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">3. Productos y Descripcion</h2>
            <p className="text-muted-foreground leading-relaxed">
              SOLENNE comercializa productos cosmeticos de uso topico importados legalmente.
              Las caracteristicas, especificaciones e ingredientes de los productos se detallan en nuestro sitio web
              y en el empaque original del producto.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Las imagenes de los productos son ilustrativas. Pueden existir variaciones minimas en tonalidad,
              empaque o presentacion debido a actualizaciones del fabricante o la configuracion de pantalla de cada dispositivo.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Aviso importante sobre productos cosmeticos:</strong>
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Los productos comercializados son cosmeticos de uso topico externo exclusivamente</li>
              <li>No son medicamentos, dispositivos medicos ni tratamientos terapeuticos</li>
              <li>No sustituyen el diagnostico, tratamiento ni consejo de un profesional de la salud</li>
              <li>Los resultados pueden variar de persona a persona segun tipo de piel, edad, rutina de cuidado y otros factores individuales</li>
              <li>Los testimonios y resultados mostrados en nuestro sitio reflejan experiencias individuales y no garantizan resultados identicos</li>
              <li>Se recomienda realizar una prueba de sensibilidad (patch test) en una zona pequena de la piel antes del primer uso</li>
              <li>En caso de irritacion, enrojecimiento o reaccion adversa, suspenda el uso inmediatamente y consulte a un dermatologo</li>
              <li>No utilizar sobre heridas abiertas, piel irritada o con condiciones dermatologicas activas sin consultar previamente a un profesional</li>
            </ul>
          </section>

          {/* 4. Precios */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">4. Precios y Formas de Pago</h2>
            <p className="text-muted-foreground leading-relaxed">
              Todos los precios estan expresados en Guaranies (Gs.) e incluyen IVA cuando corresponda.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Formas de pago aceptadas:</strong>
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Tarjeta de credito/debito:</strong> Procesado de forma segura por Stripe</li>
              <li><strong>Pago contra entrega:</strong> En efectivo al momento de recibir el producto</li>
              <li><strong>Transferencia bancaria:</strong> Previa coordinacion por WhatsApp</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Los precios pueden variar sin previo aviso. El precio aplicable sera el vigente al momento de confirmar su compra.
            </p>
          </section>

          {/* 5. Proceso de Compra */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">5. Proceso de Compra</h2>
            <p className="text-muted-foreground leading-relaxed">
              Al realizar una compra en nuestro sitio:
            </p>
            <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4">
              <li>Seleccione la cantidad de productos deseada</li>
              <li>Complete sus datos personales y direccion de entrega</li>
              <li>Seleccione su metodo de pago preferido</li>
              <li>Confirme su pedido</li>
            </ol>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Recibira una confirmacion de su pedido por WhatsApp. El contrato de compraventa se perfecciona
              al recibir dicha confirmacion.
            </p>
          </section>

          {/* 6. Envios */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">6. Envios y Entregas</h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Zona de cobertura:</strong> Todo Paraguay
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Costo de envio:</strong> GRATIS para todas las compras
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Plazo de entrega:</strong> 1 a 3 dias habiles despues de confirmada la compra
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Los plazos de entrega son estimados y pueden variar por factores externos como clima,
              disponibilidad del destinatario o condiciones logisticas. Nos comunicaremos por WhatsApp para coordinar la entrega.
            </p>
          </section>

          {/* 7. Garantia */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">7. Garantia de Satisfaccion</h2>
            <p className="text-muted-foreground leading-relaxed">
              SOLENNE ofrece una <strong>garantia de satisfaccion de 30 dias</strong> a partir de la fecha de entrega.
              Esta garantia cubre exclusivamente:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Defectos visibles en el empaque o envase del producto al momento de la entrega</li>
              <li>Productos que no correspondan a la descripcion publicada en el sitio web</li>
              <li>Insatisfaccion general con el producto (sujeto a devolucion del producto en condiciones razonables)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>La garantia no cubre:</strong>
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Reacciones adversas, alergicas o de sensibilidad cutanea individuales</li>
              <li>Resultados cosmeticos que no satisfagan las expectativas del comprador</li>
              <li>Danos ocasionados por uso incorrecto, almacenamiento inadecuado o exposicion a condiciones extremas</li>
              <li>Productos abiertos o usados parcialmente que presenten contaminacion por manipulacion del comprador</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Procedimiento:</strong> Contacte a nuestro servicio al cliente por WhatsApp indicando
              su numero de pedido y el motivo del reclamo. Coordinaremos el retiro del producto y,
              una vez verificada la condicion, procederemos al reembolso correspondiente.
            </p>
          </section>

          {/* 8. Devoluciones */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">8. Politica de Devoluciones y Reembolsos</h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Derecho de arrepentimiento:</strong> De acuerdo con la Ley 1334/98, tiene derecho a
              revocar la compra dentro de los 10 dias corridos desde la entrega del producto, sin necesidad
              de expresar causa.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Condiciones para devolucion:</strong>
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>El producto debe estar en su empaque original</li>
              <li>No debe presentar danos causados por mal uso</li>
              <li>Debe incluir todos los componentes originales</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Proceso de reembolso:</strong>
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Pagos con tarjeta:</strong> El reembolso se procesara a la misma tarjeta en un plazo de 5 a 10 dias habiles</li>
              <li><strong>Pagos en efectivo:</strong> Coordinamos transferencia bancaria o retiro en efectivo</li>
            </ul>
          </section>

          {/* 9. Limitacion de Responsabilidad */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">9. Limitacion de Responsabilidad</h2>
            <p className="text-muted-foreground leading-relaxed">
              Al adquirir productos a traves de SOLENNE, el comprador reconoce y acepta lo siguiente:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>SOLENNE actua exclusivamente como distribuidor. La responsabilidad sobre la formulacion, composicion quimica, seguridad del producto y cumplimiento de estandares de fabricacion corresponde al fabricante original</li>
              <li>SOLENNE no sera responsable por reacciones alergicas, irritaciones, sensibilidad cutanea o cualquier efecto adverso derivado del uso del producto, ya que estas reacciones dependen de factores individuales fuera del control del distribuidor</li>
              <li>SOLENNE no garantiza resultados cosmeticos especificos. Las descripciones de beneficios se basan en informacion proporcionada por el fabricante y en experiencias reportadas por usuarios. Los resultados individuales pueden variar</li>
              <li>La responsabilidad total de SOLENNE en cualquier caso no excedera el valor del producto adquirido por el comprador</li>
              <li>SOLENNE no sera responsable por danos indirectos, incidentales, consecuentes o punitivos de ninguna naturaleza</li>
              <li>El comprador es responsable de verificar los ingredientes del producto antes de su uso y de consultar a un profesional de la salud si tiene alergias conocidas, condiciones dermatologicas preexistentes o esta bajo tratamiento medico</li>
              <li>El uso del producto es bajo la exclusiva responsabilidad del comprador. Al completar la compra, el comprador declara haber leido y comprendido esta clausula</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              SOLENNE tampoco sera responsable por:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Uso incorrecto del producto contrario a las instrucciones proporcionadas</li>
              <li>Danos derivados de modificaciones o mezclas realizadas al producto por el comprador</li>
              <li>Retrasos en la entrega por causas de fuerza mayor (clima, paros, restricciones sanitarias, problemas logisticos)</li>
              <li>Errores en los datos de entrega proporcionados por el comprador</li>
              <li>Interrupciones o fallas tecnicas del sitio web ajenas a nuestro control</li>
            </ul>
          </section>

          {/* 10. Propiedad Intelectual */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">10. Propiedad Intelectual</h2>
            <p className="text-muted-foreground leading-relaxed">
              Todos los contenidos del sitio web (textos, imagenes, logotipos, disenos) son propiedad de
              SOLENNE o se utilizan con autorizacion. Queda prohibida su reproduccion, distribucion o
              modificacion sin autorizacion expresa por escrito.
            </p>
          </section>

          {/* 11. Proteccion de Datos */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">11. Proteccion de Datos Personales</h2>
            <p className="text-muted-foreground leading-relaxed">
              El tratamiento de sus datos personales se rige por nuestra{" "}
              <Link to="/politica-de-privacidad" className="text-primary hover:text-primary/80 underline">
                Politica de Privacidad
              </Link>
              , la cual forma parte integral de estos Terminos y Condiciones.
            </p>
          </section>

          {/* 12. Modificaciones */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">12. Modificaciones</h2>
            <p className="text-muted-foreground leading-relaxed">
              SOLENNE se reserva el derecho de modificar estos Terminos y Condiciones en cualquier momento.
              Las modificaciones entraran en vigencia desde su publicacion en el sitio web.
              Las compras realizadas antes de la modificacion se regiran por los terminos vigentes al momento de la compra.
            </p>
          </section>

          {/* 13. Ley Aplicable */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">13. Ley Aplicable y Jurisdiccion</h2>
            <p className="text-muted-foreground leading-relaxed">
              Estos Terminos y Condiciones se rigen por las leyes de la Republica del Paraguay.
              Para cualquier controversia derivada de estos terminos o de la compra de nuestros productos,
              las partes se someten a la jurisdiccion de los tribunales ordinarios de Asuncion, Paraguay.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Sin perjuicio de lo anterior, el consumidor podra recurrir a los mecanismos de defensa del
              consumidor establecidos en la Ley 1334/98 y presentar reclamos ante la{" "}
              <strong>SEDECO (Secretaria de Defensa del Consumidor y el Usuario)</strong>.
            </p>
          </section>

          {/* 14. Contacto */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">14. Contacto y Reclamos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para consultas, reclamos o ejercer sus derechos como consumidor:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>WhatsApp:</strong> +595 976 287180</li>
              <li><strong>Instagram:</strong> @bysolenne</li>
              <li><strong>Horario de atencion:</strong> Lunes a Viernes de 9:00 a 18:00</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nos comprometemos a responder a todos los reclamos en un plazo maximo de 48 horas habiles.
            </p>
          </section>

          {/* Marco Legal */}
          <section className="mt-12 pt-8 border-t border-border/30">
            <p className="text-xs text-muted-foreground/60 leading-relaxed">
              Estos Terminos y Condiciones se rigen por la legislacion de la Republica del Paraguay,
              en particular la Ley N. 1334/98 "De Defensa del Consumidor y del Usuario", el Codigo Civil paraguayo,
              la Ley N. 6534/2020 "De Proteccion de Datos Personales Crediticios" y demas normativas aplicables.
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

export default TerminosCondiciones;
