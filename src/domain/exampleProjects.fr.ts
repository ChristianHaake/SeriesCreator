import type { ExampleProject } from './exampleProjects';
import { PROJECT_SCHEMA_VERSION } from './projectCodec';

const imagePlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLq7wAAAABJRU5ErkJggg==';

export function getFrenchExampleProjects(): ExampleProject[] {
  const climateTitle = 'Le Code climat du collège';
  const weimarTitle = 'Le Dossier Weimar';

  return [
    {
      id: 'school-climate-code',
      title: climateTitle,
      subtitle: 'Une enquête sur le climat au format série',
      subject: 'Sciences, géographie, politique',
      grade: 'Classe de 4e',
      summary:
        'Un projet scolaire complet avec des mesures, des entretiens, deux saisons, six épisodes, un bilan, des sources, des consignes de génération d’images et un texte pour les réseaux sociaux.',
      featureHighlights: [
        'Deux saisons avec des épisodes ordonnés',
        'Blocs de texte et d’image dans les épisodes clés',
        'Auteur renseigné et avancement calculé automatiquement à 100 %',
        'Onglets Concept et Sources renseignés',
        'Consignes de génération d’images et kit pour les réseaux sociaux dans la rubrique personnalisée',
      ],
      socialCopy:
        'La classe de 4e B transforme ses relevés de consommation en une enquête sur le climat au format série et propose des actions concrètes pour le collège.',
      hashtags: ['#SeriesCreator', '#ProjetScolaire', '#ÉducationAuClimat', '#ÉducationAuxMédias'],
      imagePrompts: [
        'Collège moderne au lever du soleil, élèves avec des porte-blocs et un appareil de mesure électrique, image documentaire réaliste, sans texte, 16:9.',
        'Conseil des élèves pour le climat présentant ses conclusions sur l’énergie au personnel enseignant, ambiance de réunion constructive, sans texte, 16:9.',
      ],
      project: {
        schemaVersion: PROJECT_SCHEMA_VERSION,
        title: climateTitle,
        author: 'Classe de 4e B',
        description:
          'Une classe enquête sur les pertes d’énergie dans la vie quotidienne du collège. À partir de mesures, d’entretiens et d’observations, elle élabore un plan d’action concret pour le climat.',
        previewBrand: 'Séries du collège',
        previewCategory: 'Projets de classe',
        matchPercentage: 99,
        ageRating: '12+',
        genre: 'Documentaire',
        cast: 'Classe de 4e B, club énergie, responsable technique, conseil des élèves',
        seasons: [
          {
            id: 'climate-season-research',
            title: 'Saison 1 : L’enquête',
            episodes: [
              {
                id: 'climate-ep-electricity',
                title: 'Sur la piste des watts',
                summary:
                  'La classe mesure la consommation des appareils en veille, de l’éclairage et des équipements en service pour repérer les sources de gaspillage dans la salle de classe.',
                altText: 'Des élèves mesurent la consommation électrique dans une salle de classe.',
                learningDepth:
                  'Idée clé : la consommation électrique dépend des appareils, du temps qu’ils passent en veille et des habitudes d’utilisation. Pour étayer les conclusions, comparez les relevés, calculez les kilowattheures et justifiez les économies possibles.',
                contentBlocks: [
                  {
                    id: 'climate-electricity-finding',
                    type: 'text',
                    title: 'La piste du mode veille',
                    body: 'Une multiprise peut continuer à consommer de l’électricité sans signe visible. La classe compare les relevés, les durées d’utilisation et les types d’appareils avant d’estimer les économies possibles.',
                  },
                  {
                    id: 'climate-electricity-image',
                    type: 'image',
                    imageUrl: imagePlaceholder,
                    altText: 'Des élèves mesurent la consommation électrique des appareils de la salle de classe.',
                    caption: 'Les relevés révèlent les sources de gaspillage invisibles.',
                  },
                ],
              },
              {
                id: 'climate-ep-heat',
                title: 'Où s’échappe la chaleur ?',
                summary:
                  'Des cartes de température et des relevés par salle montrent comment les fenêtres, les radiateurs et les habitudes quotidiennes contribuent aux pertes de chaleur.',
                altText: 'Des élèves comparent des relevés de température en classe.',
                learningDepth:
                  'Question directrice : quelles caractéristiques du bâtiment et quelles habitudes favorisent les pertes de chaleur ? Avant de proposer des mesures, comparez les températures par salle, par heure et selon le mode d’aération.',
              },
              {
                id: 'climate-ep-cafeteria',
                title: 'Le bilan de la cantine',
                summary:
                  'L’équipe examine le gaspillage alimentaire, les trajets de livraison et les produits régionaux pour intégrer la cantine au plan climat.',
                altText: 'Des élèves documentent le gaspillage alimentaire à la cantine.',
                learningDepth:
                  'Idée clé : les émissions liées à l’alimentation proviennent de la production, du transport et du gaspillage. La classe évalue les options régionales à partir des quantités relevées et de critères explicites.',
              },
            ],
          },
          {
            id: 'climate-season-action',
            title: 'Saison 2 : Le plan d’action',
            episodes: [
              {
                id: 'climate-ep-data',
                title: 'Les chiffres à l’appui',
                summary:
                  'Des graphiques, des estimations de coûts et de courts entretiens transforment les observations en éléments que la direction peut examiner.',
                altText: 'Des élèves analysent des graphiques à l’écran dans une salle de classe.',
                learningDepth:
                  'Approfondissement : pour construire une argumentation solide à partir d’observations, il faut des graphiques, des valeurs de référence et des sources. Les estimations de coûts et les entretiens apportent des éléments de nature différente.',
              },
              {
                id: 'climate-ep-council',
                title: 'Le conseil pour le climat',
                summary:
                  'Les groupes débattent du confort, des coûts, de l’équité et de la faisabilité avant de voter sur des mesures réalistes.',
                altText: 'Des élèves présentent les résultats de leur enquête lors d’une réunion au collège.',
                learningDepth:
                  'Question directrice : comment arbitrer entre coûts, confort, équité et protection du climat ? Une décision argumentée prend en compte les objections.',
              },
              {
                id: 'climate-ep-monday',
                title: 'Un plan pour lundi',
                summary:
                  'Le dernier épisode retient trois changements à mettre en œuvre immédiatement, deux projets à moyen terme et une question pour le prochain projet de classe.',
                altText: 'Des élèves placent des fiches d’action sur le tableau de la classe.',
                learningDepth:
                  'Idée clé : un plan d’action fixe des priorités, attribue des responsabilités et définit des critères vérifiables. La classe distingue les habitudes qu’elle peut changer dès maintenant des mesures qui exigent encore des décisions.',
              },
            ],
          },
        ],
        reflection:
          'Le projet montre que mesurer, interpréter et communiquer vont de pair. Avant de proposer des changements pour le collège, les élèves distinguent les observations, les hypothèses et les éléments de preuve.',
        sources:
          'Carnet de relevés de la classe, entretien avec le service technique, ressources pédagogiques de l’Agence fédérale allemande de l’environnement sur les économies d’énergie, relevés du gaspillage à la cantine, retours du conseil des élèves.',
        customConceptTitle: 'Consignes pour les images et kit pour les réseaux sociaux',
        customConceptText: [
          'Texte pour les réseaux sociaux : la classe de 4e B transforme ses relevés de consommation en une enquête au format série. Six épisodes suivent les mesures, les débats et les actions concrètes pour le climat au collège.',
          'Mots-dièses : #SeriesCreator #ProjetScolaire #ÉducationAuClimat #ÉducationAuxMédias',
          'Consigne pour la couverture : plan large cinématographique de style documentaire, collège moderne au lever du soleil, élèves avec des porte-blocs et un appareil de mesure électrique dans la cour, rendu réaliste, lumière naturelle, sans texte, 16:9.',
          'Consignes pour les miniatures : 1. Des élèves mesurent la consommation des appareils d’une salle de classe avec un wattmètre sur prise, photographie documentaire réaliste, sans texte, 16:9. 2. Fenêtres et radiateurs d’une salle de classe vus comme à travers une caméra thermique, élèves comparant leurs notes, sans texte, 16:9. 3. Des élèves pèsent les restes alimentaires et vérifient la provenance des ingrédients de la cantine, sans texte, 16:9. 4. Des élèves analysent des graphiques et des tableaux de données sur un écran en classe, sans texte, 16:9. 5. Le conseil des élèves pour le climat présente ses conclusions au personnel enseignant, réunion constructive, sans texte, 16:9. 6. Des élèves organisent des fiches d’action au tableau, ambiance de préparation concrète, sans texte, 16:9.',
        ].join('\n\n'),
      },
    },
    {
      id: 'weimar-file',
      title: weimarTitle,
      subtitle: 'L’histoire comme enquête à partir des sources',
      subject: 'Histoire, politique, éducation aux médias',
      grade: 'Classe de seconde',
      summary:
        'Une série d’enquête historique avec des archives, un débat politique, une analyse des médias, des consignes de génération d’images et un texte pour les réseaux sociaux.',
      featureHighlights: [
        'Chronologie historique sur deux saisons',
        'Blocs de texte et d’image pour analyser les sources',
        'Auteur renseigné et avancement calculé automatiquement à 100 %',
        'Critique des sources et débats dans les résumés d’épisodes',
        'Contenus réutilisables sur les réseaux sociaux dans l’onglet Concept',
      ],
      socialCopy:
        'Un cours d’histoire transforme la République de Weimar en enquête en six épisodes, fondée sur des sources, sur une démocratie sous pression.',
      hashtags: ['#SeriesCreator', '#CoursDHistoire', '#RépubliqueDeWeimar', '#ÉducationÀLaDémocratie'],
      imagePrompts: [
        'Table de consultation d’archives en classe, documents de l’époque de Weimar, affiches électorales et loupe, ambiance réaliste d’enquête, sans texte, 16:9.',
        'Débat animé en classe, fiches de sources sur les tables, ambiance sérieuse et constructive, sans texte, 16:9.',
      ],
      project: {
        schemaVersion: PROJECT_SCHEMA_VERSION,
        title: weimarTitle,
        author: 'Cours d’histoire de seconde',
        description:
          'Un cours d’histoire met en scène la République de Weimar sous forme de série d’enquête, des espoirs démocratiques aux crises, aux affrontements médiatiques et aux questions de responsabilité.',
        previewBrand: 'Atelier d’histoire',
        previewCategory: 'Projets d’histoire',
        matchPercentage: 99,
        ageRating: '16+',
        genre: 'Enquête historique',
        cast: 'Cours d’histoire de seconde, équipe des archives, groupe de presse, table ronde',
        seasons: [
          {
            id: 'weimar-season-republic',
            title: 'Saison 1 : La démocratie sous pression',
            episodes: [
              {
                id: 'weimar-ep-constitution',
                title: 'Un nouveau départ',
                summary:
                  'Le premier épisode explique la fin de l’Empire, la nouvelle Constitution et les espoirs placés dans la démocratie parlementaire.',
                altText: 'Des élèves examinent une frise chronologique de la République de Weimar.',
                learningDepth:
                  'Idée clé : la Constitution a permis la participation démocratique, tout en suscitant des tensions entre les prérogatives du Parlement, celles du président du Reich et les droits garantis. Les sources sont replacées dans la transition de l’Empire à la République.',
                contentBlocks: [
                  {
                    id: 'weimar-constitution-questions',
                    type: 'text',
                    title: 'Deux regards sur une Constitution',
                    body: 'La classe relève les droits de participation, le rôle du président du Reich et les questions ouvertes. Elle montre ainsi qu’une Constitution peut ouvrir des possibilités et créer des tensions.',
                  },
                  {
                    id: 'weimar-constitution-image',
                    type: 'image',
                    imageUrl: imagePlaceholder,
                    altText: 'Des élèves examinent une frise et des documents historiques sur la République de Weimar.',
                    caption: 'Les sources replacent le passage de l’Empire à la République dans son contexte.',
                  },
                ],
              },
              {
                id: 'weimar-ep-crisis',
                title: 'L’inflation dans la rue',
                summary:
                  'À partir de dossiers de témoins fictifs, les élèves relient l’hyperinflation aux difficultés quotidiennes et à la radicalisation politique.',
                altText: 'Des élèves comparent des fiches de sources sur l’hyperinflation.',
                learningDepth:
                  'Approfondissement : l’hyperinflation a bouleversé le quotidien et ébranlé la confiance, avec des effets différents selon les groupes. Les élèves examinent ce qu’une source permet d’établir et comment les crises ont été exploitées à des fins politiques.',
              },
              {
                id: 'weimar-ep-culture',
                title: 'Nuits lumineuses, voix nouvelles',
                summary:
                  'La classe explore la culture moderne, les rôles de genre, le cinéma et la vie urbaine comme signes de transformation sociale.',
                altText: 'Des élèves réalisent en classe un collage sur la culture de Weimar.',
                learningDepth:
                  'Question directrice : comment la modernisation se manifeste-t-elle dans le quotidien ? La culture, les rôles de genre et la vie en ville offrent plusieurs angles d’analyse et révèlent des évolutions autant que des tensions.',
              },
            ],
          },
          {
            id: 'weimar-season-breakdown',
            title: 'Saison 2 : L’effondrement',
            episodes: [
              {
                id: 'weimar-ep-propaganda',
                title: 'La guerre des affiches',
                summary:
                  'Des affiches électorales et des extraits de presse montrent comment les groupes politiques cherchaient à capter l’attention, à susciter la peur et à obtenir l’adhésion.',
                altText: 'Des élèves analysent en classe des affiches électorales d’époque.',
                learningDepth:
                  'Idée clé : les affiches et les journaux sont des sources qui reflètent des intérêts. Avant d’évaluer leur valeur historique, analysez leurs codes visuels, les publics qu’ils visent et les émotions qu’ils cherchent à provoquer.',
              },
              {
                id: 'weimar-ep-election',
                title: 'Votes et violences',
                summary:
                  'L’épisode relie les résultats électoraux, les violences de rue, les cabinets présidentiels et la raréfaction des possibilités de compromis.',
                altText: 'Des élèves discutent d’un graphique présentant des résultats électoraux.',
                learningDepth:
                  'Approfondissement : les résultats électoraux expliquent une partie seulement de l’évolution politique. L’épisode les met en relation avec la violence, les cabinets présidentiels et le recul des possibilités de compromis parlementaire.',
              },
              {
                id: 'weimar-ep-question',
                title: 'Les choses auraient-elles pu tourner autrement ?',
                summary:
                  'L’épisode final transforme l’enquête en débat encadré en classe sur les causes, les responsabilités et la résilience démocratique.',
                altText: 'Des élèves participent à un débat encadré dans une salle de cours d’histoire.',
                learningDepth:
                  'Question directrice : quelles causes étaient structurelles et quelles décisions auraient pu être prises autrement ? Le débat demande une analyse fondée sur les sources et distingue l’explication historique de l’attribution rétrospective des torts.',
              },
            ],
          },
        ],
        reflection:
          'Cet exemple met en pratique la chronologie, la critique des sources, la prise en compte des points de vue et le jugement historique. Les élèves s’appuient sur des éléments de preuve pour construire une argumentation structurée à partir des faits.',
        sources:
          'Chapitre du manuel sur la République de Weimar, extraits choisis de la Constitution, tableaux des résultats électoraux, affiches historiques, extraits de presse, notes du débat en classe.',
        customConceptTitle: 'Consignes pour les images et kit pour les réseaux sociaux',
        customConceptText: [
          'Texte pour les réseaux sociaux : un cours d’histoire transforme la République de Weimar en enquête fondée sur les sources. Six épisodes relient les débuts démocratiques, les crises, les médias et les responsabilités.',
          'Mots-dièses : #SeriesCreator #CoursDHistoire #RépubliqueDeWeimar #ÉducationÀLaDémocratie',
          'Consigne pour la couverture : plan cinématographique d’une table d’archives en classe, documents de l’époque de Weimar, affiches électorales, loupe et élèves qui prennent des notes, ambiance réaliste d’enquête historique, sans texte, 16:9.',
          'Consignes pour les miniatures : 1. Des élèves étudient une frise allant de l’Empire à la République, photographie documentaire en classe, sans texte, 16:9. 2. Table de sources sur l’hyperinflation, billets, carnets et annotations des élèves, sans texte, 16:9. 3. Collage mural en classe sur la culture des années 1920, le cinéma, l’art et les transformations sociales, sans texte, 16:9. 4. Des élèves comparent des affiches politiques et des coupures de presse, ambiance studieuse, sans texte, 16:9. 5. Graphique électoral à l’écran, élèves débattant en petits groupes, sans texte, 16:9. 6. Débat encadré en classe, fiches de sources sur les tables, ambiance sérieuse et constructive, sans texte, 16:9.',
        ].join('\n\n'),
      },
    },
  ];
}
