import type { ExampleProject } from './exampleProjects';

const exampleContentImagePlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLq7wAAAABJRU5ErkJggg==';

export function getSpanishExampleProjects(): ExampleProject[] {
  const climateTitle = 'El código climático de la escuela';
  const climateHashtags = ['#SeriesCreator', '#ProyectoEscolar', '#EducaciónClimática', '#EducaciónMediática'];
  const weimarTitle = 'El expediente Weimar';
  const weimarHashtags = ['#SeriesCreator', '#ClaseDeHistoria', '#RepúblicaDeWeimar', '#EducaciónDemocrática'];

  return [
    {
      id: 'school-climate-code',
      title: climateTitle,
      subtitle: 'Educación climática en forma de serie de investigación',
      subject: 'Ciencias, geografía y política',
      grade: '8.º curso',
      summary: 'Un proyecto escolar completo con mediciones, entrevistas, dos temporadas, seis episodios, reflexión, fuentes, instrucciones para generar imágenes y textos para redes sociales.',
      featureHighlights: [
        'Dos temporadas con episodios ordenados',
        'Bloques de texto e imagen en los episodios clave',
        'Autoría y estado del proyecto calculado automáticamente al 100 %',
        'Pestañas de concepto y fuentes completadas',
        'Instrucciones para generar imágenes y material para redes sociales en la sección personalizada',
      ],
      socialCopy: 'La clase 8.º B convierte los datos energéticos en una serie de investigación sobre el clima con medidas concretas para la escuela.',
      hashtags: climateHashtags,
      imagePrompts: [
        'Edificio escolar moderno al amanecer, estudiantes con portapapeles y un medidor de consumo eléctrico, fotograma documental realista, sin texto, 16:9.',
        'Consejo climático estudiantil que presenta sus conclusiones sobre energía al profesorado, ambiente de reunión constructiva, sin texto, 16:9.',
      ],
      project: {
        schemaVersion: 3,
        title: climateTitle,
        author: 'Clase de 8.º B',
        description: 'Una clase investiga dónde se pierde energía en la vida diaria de la escuela y, a partir de mediciones, entrevistas y observaciones, elabora un plan de acción climática concreto.',
        previewBrand: 'Escuela en Pantalla',
        previewCategory: 'Proyectos de clase',
        matchPercentage: 99,
        ageRating: '12+',
        genre: 'Documental',
        cast: 'Clase de 8.º B, club de energía, responsable de mantenimiento y consejo estudiantil',
        seasons: [
          {
            id: 'climate-season-research',
            title: 'Temporada 1: Investigación',
            episodes: [
              {
                id: 'climate-ep-electricity',
                title: 'El detective de la electricidad',
                summary: 'La clase mide el consumo de los aparatos en espera, el de la iluminación y el de los equipos en uso, y detecta consumos ocultos en el aula.',
                altText: 'Estudiantes miden el consumo de energía en un aula.',
                learningDepth: 'Idea clave: El consumo eléctrico depende de los aparatos visibles, del tiempo que pasan en modo de espera y de los hábitos de uso. Para justificar el ahorro posible, se comparan las mediciones y se calcula el consumo en kilovatios hora.',
                contentBlocks: [
                  {
                    id: 'climate-electricity-finding',
                    type: 'text',
                    title: 'La pista del consumo en espera',
                    body: 'Una regleta puede seguir consumiendo electricidad sin que se note. La clase compara las mediciones, los tiempos de uso y los tipos de aparatos para justificar qué se puede ahorrar.',
                  },
                  {
                    id: 'climate-electricity-image',
                    type: 'image',
                    imageUrl: exampleContentImagePlaceholder,
                    altText: 'Estudiantes miden el consumo eléctrico de equipos del aula.',
                    caption: 'Las mediciones revelan consumos de energía que pasan inadvertidos.',
                  },
                ],
              },
              {
                id: 'climate-ep-heat',
                title: 'El calor se escapa',
                summary: 'Los mapas de temperatura y los registros de las aulas revelan dónde se desperdicia energía de calefacción por las ventanas, los radiadores y los hábitos cotidianos.',
                altText: 'Estudiantes comparan las temperaturas que han medido en el aula.',
                learningDepth: 'Pregunta orientadora: ¿Qué características del edificio y qué hábitos cotidianos influyen en la pérdida de calor? Antes de proponer medidas, hay que comparar las temperaturas por aula, momento del día y forma de ventilación.',
              },
              {
                id: 'climate-ep-cafeteria',
                title: 'El balance del comedor',
                summary: 'El equipo compara el desperdicio de alimentos, las rutas de transporte y las opciones regionales para incorporar el comedor al plan climático.',
                altText: 'Estudiantes registran los desperdicios de alimentos en un comedor escolar.',
                learningDepth: 'Idea clave: Las emisiones asociadas a los alimentos incluyen las de su producción, transporte y desperdicio. La clase evalúa las opciones regionales a partir de las cantidades registradas y de criterios explícitos, sin dar nada por supuesto.',
              },
            ],
          },
          {
            id: 'climate-season-action',
            title: 'Temporada 2: Plan de acción',
            episodes: [
              {
                id: 'climate-ep-data',
                title: 'Lo que demuestran los datos',
                summary: 'Los gráficos, las estimaciones de costes y las entrevistas breves convierten las observaciones en pruebas que la dirección escolar puede evaluar.',
                altText: 'Estudiantes analizan gráficos en una pantalla del aula.',
                learningDepth: 'Profundización: Los gráficos, los valores de referencia y las fuentes permiten convertir las observaciones en argumentos sólidos. Las estimaciones de costes y las entrevistas aportan tipos distintos de evidencia y deben valorarse como tales.',
              },
              {
                id: 'climate-ep-council',
                title: 'El consejo climático',
                summary: 'Distintos grupos debaten sobre comodidad, costes, equidad y viabilidad antes de votar medidas realistas.',
                altText: 'Estudiantes presentan sus conclusiones sobre el clima en una reunión escolar.',
                learningDepth: 'Pregunta orientadora: ¿Cómo se decide cuando los costes, la comodidad, la equidad y la protección climática entran en conflicto? Una decisión justificada toma en cuenta los argumentos en contra.',
              },
              {
                id: 'climate-ep-monday',
                title: 'Un plan para el lunes',
                summary: 'El final da prioridad a tres cambios inmediatos, dos proyectos a medio plazo y una pregunta para el próximo proyecto de clase.',
                altText: 'Estudiantes colocan tarjetas con propuestas de acción en la pizarra del aula.',
                learningDepth: 'Idea clave: Un plan de acción necesita prioridades, responsables y criterios verificables. La clase distingue los hábitos que se pueden cambiar de inmediato de las medidas que requieren otras decisiones.',
              },
            ],
          },
        ],
        reflection: 'El proyecto muestra cómo se relacionan la medición, la interpretación y la comunicación. Antes de proponer cambios para la escuela, el alumnado debe distinguir entre observaciones, suposiciones y pruebas.',
        sources: 'Registro de mediciones de la clase, entrevista con el equipo de mantenimiento, material didáctico de la Agencia Federal Alemana de Medio Ambiente sobre ahorro energético, notas sobre el desperdicio en el comedor escolar y comentarios del consejo estudiantil.',
        customConceptTitle: 'Instrucciones para generar imágenes y material para redes sociales',
        customConceptText: [
          'Texto para redes sociales: La clase de 8.º B convierte los datos energéticos en una serie de investigación. En seis episodios, el proyecto presenta mediciones, debates y medidas concretas de acción climática para la escuela.',
          `Etiquetas: ${climateHashtags.join(' ')}`,
          'Instrucciones para la portada: Plano general cinematográfico de estilo documental de un edificio escolar moderno al amanecer, estudiantes con portapapeles y un medidor de consumo eléctrico en el patio, aspecto realista, luz natural, sin texto, 16:9.',
          'Instrucciones para las miniaturas de los episodios: 1. Estudiantes miden el consumo de los aparatos del aula con un medidor de enchufe, fotografía documental realista, sin texto, 16:9. 2. Ventanas y radiadores del aula en una imagen inspirada en una cámara térmica, estudiantes comparando sus notas, sin texto, 16:9. 3. Comedor escolar con estudiantes que pesan restos de comida y comprueban qué ingredientes son regionales, sin texto, 16:9. 4. Estudiantes analizan gráficos y hojas de cálculo en una pantalla del aula, sin texto, 16:9. 5. Consejo climático estudiantil que presenta sus conclusiones al profesorado, ambiente de reunión constructiva, sin texto, 16:9. 6. Estudiantes organizan tarjetas con propuestas de acción en la pizarra, ambiente de trabajo centrado en la planificación, sin texto, 16:9.',
        ].join('\n\n'),
      },
    },
    {
      id: 'weimar-file',
      title: weimarTitle,
      subtitle: 'La historia como investigación a partir de fuentes',
      subject: 'Historia, política y educación mediática',
      grade: '10.º curso',
      summary: 'Una serie de investigación histórica con fuentes de archivo, debate político, análisis de medios, instrucciones para generar imágenes y textos para redes sociales.',
      featureHighlights: [
        'Cronología histórica a lo largo de dos temporadas',
        'Bloques de texto e imagen para el análisis de fuentes',
        'Autoría y estado del proyecto calculado automáticamente al 100 %',
        'Análisis crítico de las fuentes y debate en los resúmenes de los episodios',
        'Material reutilizable para redes sociales en la pestaña de concepto',
      ],
      socialCopy: 'Un grupo de historia investiga la República de Weimar a partir de fuentes y convierte su trabajo en una serie de seis episodios sobre la democracia bajo presión.',
      hashtags: weimarHashtags,
      imagePrompts: [
        'Mesa de archivo en el aula con documentos de la época de Weimar, carteles electorales y una lupa, ambiente realista de investigación histórica, sin texto, 16:9.',
        'Debate moderado en el aula con fichas de fuentes sobre los pupitres, ambiente serio pero constructivo, sin texto, 16:9.',
      ],
      project: {
        schemaVersion: 3,
        title: weimarTitle,
        author: 'Grupo de Historia de 10.º',
        description: 'Un grupo de historia presenta la República de Weimar como una serie de investigación sobre las esperanzas democráticas, la presión de las crisis, las pugnas en los medios y las preguntas sobre la responsabilidad.',
        previewBrand: 'Laboratorio de Historia',
        previewCategory: 'Proyectos de historia',
        matchPercentage: 99,
        ageRating: '16+',
        genre: 'Investigación histórica',
        cast: 'Grupo de Historia de 10.º, equipo de archivo, grupo de prensa y mesa de debate',
        seasons: [
          {
            id: 'weimar-season-republic',
            title: 'Temporada 1: Democracia bajo presión',
            episodes: [
              {
                id: 'weimar-ep-constitution',
                title: 'Un nuevo comienzo',
                summary: 'El primer episodio explica el fin del Imperio, la nueva Constitución y las promesas de la democracia parlamentaria.',
                altText: 'Estudiantes examinan una cronología de la República de Weimar.',
                learningDepth: 'Idea clave: La Constitución abrió vías de participación democrática, pero también creó tensiones entre el Parlamento, la Presidencia y los derechos reconocidos. Las fuentes se sitúan en el contexto de la transición del Imperio a la República.',
                contentBlocks: [
                  {
                    id: 'weimar-constitution-questions',
                    type: 'text',
                    title: 'Dos perspectivas sobre una Constitución',
                    body: 'La clase señala los derechos de participación, el papel del presidente y las preguntas que quedan abiertas. Así se ve que una Constitución puede abrir oportunidades y generar tensiones al mismo tiempo.',
                  },
                  {
                    id: 'weimar-constitution-image',
                    type: 'image',
                    imageUrl: exampleContentImagePlaceholder,
                    altText: 'Estudiantes examinan una cronología y documentos históricos sobre la República de Weimar.',
                    caption: 'Las fuentes ayudan a entender el contexto de la transición del Imperio a la República.',
                  },
                ],
              },
              {
                id: 'weimar-ep-crisis',
                title: 'La inflación a pie de calle',
                summary: 'A partir de testimonios ficticios, el alumnado relaciona la hiperinflación, las dificultades cotidianas y la radicalización política.',
                altText: 'Estudiantes comparan fichas de fuentes sobre la hiperinflación.',
                learningDepth: 'Profundización: La hiperinflación alteró la vida cotidiana y la confianza, pero afectó de forma desigual a distintos grupos. El alumnado comprueba qué demuestra cada fuente y cómo se aprovecharon políticamente las crisis.',
              },
              {
                id: 'weimar-ep-culture',
                title: 'Luces nocturnas, voces nuevas',
                summary: 'La clase explora la cultura moderna, los roles de género, el cine y la vida urbana como señales de cambio social.',
                altText: 'Estudiantes preparan en el aula un collage sobre la cultura de la época de Weimar.',
                learningDepth: 'Pregunta orientadora: ¿Cómo se hizo visible la modernización en la vida cotidiana? La cultura, los roles de género y la vida urbana ofrecen perspectivas distintas que no se reducen a un único relato de progreso.',
              },
            ],
          },
          {
            id: 'weimar-season-breakdown',
            title: 'Temporada 2: Desintegración',
            episodes: [
              {
                id: 'weimar-ep-propaganda',
                title: 'La guerra de los carteles',
                summary: 'Carteles electorales y fragmentos de periódicos muestran cómo los grupos políticos competían por captar la atención, avivar el miedo y ganarse la lealtad.',
                altText: 'Estudiantes analizan carteles electorales históricos en clase.',
                learningDepth: 'Idea clave: Los carteles y los periódicos son fuentes marcadas por determinados intereses. Antes de valorar lo que aportan a la investigación histórica, hay que analizar sus imágenes, el público al que se dirigen y las emociones que buscan provocar.',
              },
              {
                id: 'weimar-ep-election',
                title: 'Votos y violencia',
                summary: 'El episodio relaciona los resultados electorales, la violencia callejera, los gabinetes presidenciales y el estrechamiento del margen para llegar a acuerdos.',
                altText: 'Estudiantes comentan un gráfico de resultados electorales.',
                learningDepth: 'Profundización: Los resultados electorales por sí solos no explican el cambio político. El episodio relaciona las cifras con la violencia, los gabinetes presidenciales y la disminución de las posibilidades de acuerdo parlamentario.',
              },
              {
                id: 'weimar-ep-question',
                title: '¿Podría haber sido distinto?',
                summary: 'El final convierte la investigación en un debate moderado en el aula sobre las causas, la responsabilidad y la capacidad de resistencia de la democracia.',
                altText: 'Estudiantes participan en un debate moderado en el aula de Historia.',
                learningDepth: 'Pregunta orientadora: ¿Qué causas eran estructurales y qué decisiones podrían haber sido distintas? El debate exige fundamentar las valoraciones en las fuentes, sin limitarse a atribuir culpas a posteriori.',
              },
            ],
          },
        ],
        reflection: 'Este ejemplo muestra cómo se establece una cronología, se examinan críticamente las fuentes, se adoptan distintas perspectivas y se formula un juicio histórico. El alumnado va más allá de relatar hechos y construye una argumentación estructurada a partir de las pruebas.',
        sources: 'Capítulo del libro de texto sobre la República de Weimar, fragmentos seleccionados de la Constitución, tablas de resultados electorales, carteles históricos, recortes de prensa y notas del debate en clase.',
        customConceptTitle: 'Instrucciones para generar imágenes y material para redes sociales',
        customConceptText: [
          'Texto para redes sociales: Un grupo de historia investiga la República de Weimar a partir de fuentes. Seis episodios relacionan los comienzos de la democracia, la crisis, los medios y la responsabilidad.',
          `Etiquetas: ${weimarHashtags.join(' ')}`,
          'Instrucciones para la portada: Plano cinematográfico de una mesa de archivo en el aula con documentos de la época de Weimar, carteles electorales, una lupa y estudiantes tomando notas, ambiente realista de investigación histórica, sin texto, 16:9.',
          'Instrucciones para las miniaturas de los episodios: 1. Estudiantes estudian una cronología del Imperio a la República, fotografía documental de aula, sin texto, 16:9. 2. Mesa con fuentes sobre la hiperinflación, billetes, cuadernos y anotaciones del alumnado, sin texto, 16:9. 3. Collage en la pared del aula sobre la cultura de los años veinte, el cine, el arte y el cambio social, sin texto, 16:9. 4. Estudiantes comparan carteles políticos y recortes de periódicos, ambiente de análisis, sin texto, 16:9. 5. Gráfico de resultados electorales en la pantalla del aula, estudiantes debatiendo en grupos pequeños, sin texto, 16:9. 6. Debate moderado en el aula con fichas de fuentes sobre los pupitres, ambiente serio pero constructivo, sin texto, 16:9.',
        ].join('\n\n'),
      },
    },
  ];
}
