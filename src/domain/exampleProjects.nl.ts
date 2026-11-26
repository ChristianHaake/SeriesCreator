import type { ExampleProject } from './exampleProjects';

const imagePlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLq7wAAAABJRU5ErkJggg==';

export function getDutchExampleProjects(): ExampleProject[] {
  return [
    {
      id: 'school-climate-code',
      title: 'De klimaatcode van de school',
      subtitle: 'Klimaateducatie als onderzoek in serievorm',
      subject: 'Natuurwetenschappen, aardrijkskunde, politiek',
      grade: 'Klas 8',
      summary: 'Een volledig schoolvoorbeeld met meetgegevens, interviews, twee seizoenen, zes afleveringen, reflectie, bronnen, beeldprompts en teksten voor sociale media.',
      featureHighlights: [
        'Twee seizoenen met afleveringen in volgorde',
        'Tekst- en afbeeldingsblokken in de belangrijkste afleveringen',
        'Maker en automatisch berekende projectvoortgang van 100%',
        'De tabbladen Concept en Bronnen zijn ingevuld',
        'Beeldprompts en materiaal voor sociale media in de eigen sectie',
      ],
      socialCopy: 'Klas 8b maakt van energiegegevens een klimaatonderzoek in serievorm, met concrete maatregelen voor de school.',
      hashtags: ['#SeriesCreator', '#Schoolproject', '#Klimaateducatie', '#Mediawijsheid'],
      imagePrompts: [
        'Modern schoolgebouw bij zonsopkomst, leerlingen met klemborden en een energiemeter, realistisch documentairebeeld, zonder tekst, 16:9.',
        'De klimaatcommissie van leerlingen presenteert energieresultaten aan leerkrachten, constructieve sfeer, zonder tekst, 16:9.',
      ],
      project: {
        schemaVersion: 3,
        title: 'De klimaatcode van de school',
        author: 'Klas 8b',
        description: 'Een klas onderzoekt waar in het dagelijkse schoolleven energie verloren gaat en verwerkt metingen, interviews en observaties tot een concreet klimaatactieplan.',
        previewBrand: 'SchoolStream',
        previewCategory: 'Klasprojecten',
        matchPercentage: 99,
        ageRating: '12+',
        genre: 'Documentaire',
        cast: 'Klas 8b, energieclub, gebouwbeheerder, leerlingenraad',
        seasons: [
          {
            id: 'climate-season-research',
            title: 'Seizoen 1: Het onderzoek',
            episodes: [
              {
                id: 'climate-ep-electricity',
                title: 'De stroomdetective',
                summary: 'De klas meet het sluipverbruik, het stroomverbruik van de verlichting en het gebruik van apparaten en spoort zo verborgen energieverspilling in het lokaal op.',
                altText: 'Leerlingen meten het energieverbruik in een klaslokaal.',
                learningDepth: 'Kernidee: Het stroomverbruik hangt af van de gebruikte apparaten, de tijd in stand-bystand en dagelijkse gewoonten. Onderbouwing: Vergelijk metingen, bereken het aantal kilowatturen en leg uit waar je kunt besparen.',
                contentBlocks: [
                  {
                    id: 'climate-electricity-finding',
                    type: 'text',
                    title: 'De aanwijzing: sluipverbruik',
                    body: 'Via een stekkerdoos kan ongemerkt stroom worden verbruikt. De klas vergelijkt meetwaarden, gebruiksduur en soorten apparaten om te onderbouwen waar besparing mogelijk is.',
                  },
                  {
                    id: 'climate-electricity-image',
                    type: 'image',
                    imageUrl: imagePlaceholder,
                    altText: 'Leerlingen meten het stroomverbruik van apparaten in het lokaal.',
                    caption: 'Metingen maken verborgen energieverspilling zichtbaar.',
                  },
                ],
              },
              {
                id: 'climate-ep-heat',
                title: 'Waar blijft de warmte?',
                summary: 'Temperatuurkaarten en logboeken per lokaal laten zien waar via ramen, radiatoren en dagelijkse gewoonten verwarmingsenergie verloren gaat.',
                altText: 'Leerlingen vergelijken temperatuurmetingen in het klaslokaal.',
                learningDepth: 'Centrale vraag: Welke kenmerken van het gebouw en welke dagelijkse gewoonten beïnvloeden warmteverlies? Vergelijk de temperaturen per lokaal, tijdstip en ventilatie voordat je maatregelen voorstelt.',
              },
              {
                id: 'climate-ep-cafeteria',
                title: 'De kantine in balans',
                summary: 'Het team vergelijkt voedselverspilling, transportroutes en regionale alternatieven om de kantine in het klimaatplan op te nemen.',
                altText: 'Leerlingen brengen voedselverspilling in een schoolkantine in kaart.',
                learningDepth: 'Kernidee: Bij de uitstoot door voedsel tellen productie, vervoer en verspilling mee. De klas beoordeelt regionale alternatieven aan de hand van gemeten hoeveelheden en duidelijke criteria.',
              },
            ],
          },
          {
            id: 'climate-season-action',
            title: 'Seizoen 2: Het actieplan',
            episodes: [
              {
                id: 'climate-ep-data',
                title: 'Wat de cijfers bewijzen',
                summary: 'Met grafieken, kostenramingen en korte interviews zet de klas observaties om in bewijsmateriaal dat de schoolleiding kan beoordelen.',
                altText: 'Leerlingen analyseren grafieken op een scherm in het klaslokaal.',
                learningDepth: 'Inhoudelijke verdieping: Met grafieken, vergelijkingswaarden en bronnen kun je observaties omzetten in betrouwbare argumenten. Kostenramingen en interviews leveren verschillende soorten bewijs.',
              },
              {
                id: 'climate-ep-council',
                title: 'De klimaatraad',
                summary: 'Verschillende groepen discussiëren over comfort, kosten, eerlijkheid en haalbaarheid voordat ze over realistische maatregelen stemmen.',
                altText: 'Leerlingen presenteren hun klimaatbevindingen tijdens een schooloverleg.',
                learningDepth: 'Centrale vraag: Hoe maak je een keuze als kosten, comfort, eerlijkheid en klimaatbescherming met elkaar botsen? Een goed onderbouwd besluit gaat ook in op tegenargumenten.',
              },
              {
                id: 'climate-ep-monday',
                title: 'Een plan voor maandag',
                summary: 'In de finale kiest de klas drie directe veranderingen, twee projecten voor de middellange termijn en één vraag voor het volgende klasproject.',
                altText: 'Leerlingen hangen actiekaarten op een bord in het klaslokaal.',
                learningDepth: 'Kernidee: Een actieplan heeft prioriteiten, verantwoordelijken en toetsbare criteria nodig. De klas maakt onderscheid tussen gewoonten die meteen kunnen veranderen en maatregelen waarover nog een besluit nodig is.',
              },
            ],
          },
        ],
        reflection: 'Het project laat zien hoe meten, interpreteren en communiceren samenhangen. Voordat leerlingen veranderingen voor de school voorstellen, maken ze onderscheid tussen observaties, aannames en bewijs.',
        sources: 'Meetlogboek van de klas, interview met het gebouwbeheer, lesmateriaal over energiebesparing van het Duitse Umweltbundesamt, notities over kantineafval en feedback van de leerlingenraad.',
        customConceptTitle: 'Beeldprompts en materiaal voor sociale media',
        customConceptText: [
          'Tekst voor sociale media: Klas 8b maakt van energiegegevens een onderzoek in serievorm. In zes afleveringen zie je hoe de klas meet, discussieert en concrete klimaatmaatregelen voor de school bedenkt.',
          'Hashtags: #SeriesCreator #Schoolproject #Klimaateducatie #Mediawijsheid',
          'Omslagprompt: Breed, filmisch documentairebeeld van een modern schoolgebouw bij zonsopkomst, leerlingen met klemborden en een energiemeter op het schoolplein, realistisch, natuurlijk licht, zonder tekst, 16:9.',
          'Prompts voor afleveringsminiaturen: 1. Leerlingen meten het verbruik van apparaten in het lokaal met een stekkermeter, realistische documentairefoto, zonder tekst, 16:9. 2. Ramen en radiatoren in een klaslokaal zoals op een warmtebeeld, leerlingen vergelijken notities, zonder tekst, 16:9. 3. Leerlingen wegen voedselresten in de schoolkantine en onderzoeken regionale ingrediënten, zonder tekst, 16:9. 4. Leerlingen analyseren grafieken en rekenbladen op een scherm in de klas, zonder tekst, 16:9. 5. De klimaatcommissie van leerlingen presenteert bevindingen aan leerkrachten, constructieve sfeer, zonder tekst, 16:9. 6. Leerlingen ordenen actiekaarten op een klasbord, praktisch en planmatig, zonder tekst, 16:9.',
        ].join('\n\n'),
      },
    },
    {
      id: 'weimar-file',
      title: 'Het Weimardossier',
      subtitle: 'Geschiedenis als bronnenonderzoek',
      subject: 'Geschiedenis, politiek, mediawijsheid',
      grade: 'Klas 10',
      summary: 'Een historische onderzoeksserie met archiefbronnen, politiek debat, media-analyse, beeldprompts en teksten voor sociale media.',
      featureHighlights: [
        'Historische chronologie verdeeld over twee seizoenen',
        'Tekst- en afbeeldingsblokken voor bronnenanalyse',
        'Maker en automatisch berekende projectvoortgang van 100%',
        'Bronnenkritiek en debat in de samenvattingen van afleveringen',
        'Herbruikbaar materiaal voor sociale media op het tabblad Concept',
      ],
      socialCopy: 'Een geschiedenisgroep maakt van de Weimarrepubliek een bronnenonderzoek in zes afleveringen over democratie onder druk.',
      hashtags: ['#SeriesCreator', '#Geschiedenisles', '#Weimarrepubliek', '#Democratieonderwijs'],
      imagePrompts: [
        'Archieftafel in een klaslokaal met documenten uit de Weimartijd, verkiezingsposters en vergrootglas, realistische onderzoekssfeer, zonder tekst, 16:9.',
        'Klassendebat met gespreksleider en bronkaarten op de tafels, serieuze en constructieve sfeer, zonder tekst, 16:9.',
      ],
      project: {
        schemaVersion: 3,
        title: 'Het Weimardossier',
        author: 'Geschiedenisgroep klas 10',
        description: 'Een geschiedenisgroep brengt de Weimarrepubliek in beeld als onderzoeksserie over democratische verwachtingen, crises, strijd in de media en vragen over verantwoordelijkheid.',
        previewBrand: 'HistoryLab',
        previewCategory: 'Geschiedenisprojecten',
        matchPercentage: 99,
        ageRating: '16+',
        genre: 'Historisch onderzoek',
        cast: 'Geschiedenisgroep klas 10, archiefteam, persgroep, debatpanel',
        seasons: [
          {
            id: 'weimar-season-republic',
            title: 'Seizoen 1: Democratie onder druk',
            episodes: [
              {
                id: 'weimar-ep-constitution',
                title: 'Een nieuw begin',
                summary: 'De openingsaflevering behandelt het einde van het keizerrijk, de nieuwe grondwet en de verwachtingen rond de parlementaire democratie.',
                altText: 'Leerlingen bekijken een historische tijdlijn over de Weimarrepubliek.',
                learningDepth: 'Kernidee: De grondwet maakte democratische inspraak mogelijk en schiep tegelijk spanningen tussen het parlement, de president en de vastgelegde rechten. De bronnen worden geplaatst in de overgang van keizerrijk naar republiek.',
                contentBlocks: [
                  {
                    id: 'weimar-constitution-questions',
                    type: 'text',
                    title: 'Twee perspectieven op een grondwet',
                    body: 'De klas markeert rechten op inspraak, de rol van de president en open vragen. Zo wordt zichtbaar dat een grondwet tegelijk mogelijkheden kan bieden en spanningen kan oproepen.',
                  },
                  {
                    id: 'weimar-constitution-image',
                    type: 'image',
                    imageUrl: imagePlaceholder,
                    altText: 'Leerlingen bekijken een tijdlijn en historische documenten over de Weimarrepubliek.',
                    caption: 'De bronnen plaatsen de overgang van keizerrijk naar republiek in context.',
                  },
                ],
              },
              {
                id: 'weimar-ep-crisis',
                title: 'Inflatie op straat',
                summary: 'Aan de hand van fictieve ooggetuigenverslagen leggen leerlingen verbanden tussen hyperinflatie, dagelijkse ontberingen en politieke radicalisering.',
                altText: 'Leerlingen vergelijken bronkaarten over hyperinflatie.',
                learningDepth: 'Inhoudelijke verdieping: Hyperinflatie veranderde het dagelijks leven en het vertrouwen en trof groepen op verschillende manieren. Leerlingen onderzoeken wat een bron aantoont en hoe crises politiek werden gebruikt.',
              },
              {
                id: 'weimar-ep-culture',
                title: 'Stadslichten, nieuwe stemmen',
                summary: 'De klas onderzoekt moderne cultuur, genderrollen, film en stadsleven als tekenen van maatschappelijke verandering.',
                altText: 'Leerlingen maken in het klaslokaal een collage over de cultuur van de Weimartijd.',
                learningDepth: 'Centrale vraag: Hoe werd modernisering zichtbaar in het dagelijks leven? Cultuur, genderrollen en stadsleven laten verschillende kanten van verandering zien. Samen vormen ze een genuanceerd beeld van vooruitgang.',
              },
            ],
          },
          {
            id: 'weimar-season-breakdown',
            title: 'Seizoen 2: De ondergang',
            episodes: [
              {
                id: 'weimar-ep-propaganda',
                title: 'De propagandaoorlog',
                summary: 'Verkiezingsposters en krantenfragmenten laten zien hoe politieke groepen aandacht zochten, angst aanwakkerden en aanhangers aan zich probeerden te binden.',
                altText: 'Leerlingen analyseren historische verkiezingsposters in de klas.',
                learningDepth: 'Kernidee: Posters en kranten zijn bronnen waarin belangen doorwerken. Analyseer beeldtaal, doelgroepen en emotionele oproepen voordat je hun historische waarde beoordeelt.',
              },
              {
                id: 'weimar-ep-election',
                title: 'Stemmen en geweld',
                summary: 'De aflevering verbindt verkiezingsuitslagen, straatgeweld, presidentiële kabinetten en de afnemende ruimte voor compromissen.',
                altText: 'Leerlingen bespreken een grafiek met verkiezingsuitslagen.',
                learningDepth: 'Inhoudelijke verdieping: Verkiezingsuitslagen geven maar een deel van de verklaring voor politieke verandering. Deze aflevering legt verbanden met geweld, presidentiële kabinetten en de afnemende ruimte voor parlementaire compromissen.',
              },
              {
                id: 'weimar-ep-question',
                title: 'Had het anders kunnen lopen?',
                summary: 'In de finale mondt het onderzoek uit in een begeleid klassendebat over oorzaken, verantwoordelijkheid en de veerkracht van de democratie.',
                altText: 'Leerlingen voeren een debat onder leiding van een gespreksleider in het geschiedenislokaal.',
                learningDepth: 'Centrale vraag: Welke oorzaken waren structureel en welke beslissingen hadden anders kunnen uitvallen? Het debat vraagt om een oordeel op basis van bronnen en de omstandigheden van toen.',
              },
            ],
          },
        ],
        reflection: 'Dit voorbeeld maakt chronologie, bronnenkritiek, verschillende perspectieven en historische oordeelsvorming zichtbaar. Leerlingen gebruiken het bewijsmateriaal om een gestructureerd betoog over de gebeurtenissen op te bouwen.',
        sources: 'Hoofdstuk uit het lesboek over de Weimarrepubliek, geselecteerde grondwetsteksten, tabellen met verkiezingsuitslagen, historische posters, krantenfragmenten en aantekeningen van het klassendebat.',
        customConceptTitle: 'Beeldprompts en materiaal voor sociale media',
        customConceptText: [
          'Tekst voor sociale media: Een geschiedenisgroep maakt van de Weimarrepubliek een bronnenonderzoek. Zes afleveringen verbinden het democratische begin met crises, media en verantwoordelijkheid.',
          'Hashtags: #SeriesCreator #Geschiedenisles #Weimarrepubliek #Democratieonderwijs',
          'Omslagprompt: Filmisch beeld van een archieftafel in een lokaal met documenten uit de Weimartijd, verkiezingsposters, een vergrootglas en leerlingen die aantekeningen maken, realistische sfeer van historisch onderzoek, zonder tekst, 16:9.',
          'Prompts voor afleveringsminiaturen: 1. Leerlingen bestuderen een tijdlijn van keizerrijk naar republiek, documentairefoto in het lokaal, zonder tekst, 16:9. 2. Tafel met bronnen over hyperinflatie, bankbiljetten, schriften en aantekeningen van leerlingen, zonder tekst, 16:9. 3. Collage aan de klasmuur over cultuur, film, kunst en maatschappelijke veranderingen in de jaren twintig, zonder tekst, 16:9. 4. Leerlingen vergelijken politieke posters en krantenknipsels, onderzoekende sfeer, zonder tekst, 16:9. 5. Grafiek met verkiezingsuitslagen op het scherm, leerlingen discussiëren in kleine groepen, zonder tekst, 16:9. 6. Klassendebat met gespreksleider en bronkaarten op de tafels, serieuze en constructieve sfeer, zonder tekst, 16:9.',
        ].join('\n\n'),
      },
    },
  ];
}
