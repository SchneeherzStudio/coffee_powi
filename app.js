// Interaktiver 3D-Kaffee-Globus, Produktionszyklus & Preis-Simulator
// Datenbasis: OroVerde – Die Tropenwaldstiftung (https://www.regenwald-schuetzen.org/handeln/nachhaltige-ernaehrung/kaffee)

const CONTINENTS = [
  // South America
  [[-80,10],[-75,11],[-71,12],[-62,10],[-50,2],[-35,-6],[-38,-13],[-40,-22],[-48,-28],[-53,-34],[-62,-39],[-68,-54],[-74,-52],[-73,-42],[-71,-30],[-70,-18],[-77,-12],[-81,-5],[-79,2],[-77,8]],
  // Central & North America
  [[-80,8],[-83,10],[-84,15],[-88,16],[-90,21],[-87,21],[-97,19],[-97,26],[-90,29],[-82,25],[-80,31],[-75,36],[-70,42],[-60,46],[-65,55],[-80,60],[-95,60],[-125,50],[-124,40],[-117,32],[-110,23],[-105,20],[-92,15],[-85,11]],
  // Caribbean Islands (Cuba / Hispaniola)
  [[-84,22],[-75,20],[-74,22],[-82,23]],
  [[-74,18],[-68,18],[-69,20],[-73,20]],
  // Africa
  [[-17,15],[-12,24],[-6,36],[10,37],[12,33],[32,31],[38,22],[43,12],[51,12],[41,-2],[40,-15],[35,-25],[28,-33],[18,-35],[15,-23],[12,-6],[9,4],[2,6],[-8,5],[-16,11]],
  // Madagascar
  [[44,-13],[50,-15],[47,-25],[43,-22]],
  // Europe
  [[-9,37],[-9,43],[-2,44],[-4,48],[2,51],[8,54],[8,58],[5,62],[15,68],[28,70],[30,60],[28,45],[24,38],[15,38],[16,41],[12,44],[6,43],[3,42],[0,38],[-5,36]],
  // Great Britain
  [[-5,50],[2,51],[0,56],[-5,58],[-6,53]],
  // Asia & Arabian Peninsula
  [[35,31],[36,22],[44,13],[59,22],[56,27],[48,30],[67,24],[72,21],[77,8],[80,15],[88,22],[96,16],[100,13],[104,1],[106,10],[109,20],[121,25],[122,32],[120,40],[130,35],[135,35],[141,42],[140,55],[160,60],[170,65],[100,70],[60,68],[40,45],[30,41]],
  // Indonesia / Southeast Asia Islands (Sumatra, Java, Borneo, Sulawesi, New Guinea)
  [[95,5],[104,-1],[106,-6],[102,-4],[96,3]],
  [[106,-6],[114,-7],[114,-9],[106,-7]],
  [[109,-1],[117,6],[118,-3],[111,-3]],
  [[120,-2],[125,1],[122,-5],[119,-4]],
  [[135,-3],[148,-6],[147,-10],[136,-7]],
  // Australia
  [[114,-22],[122,-17],[131,-12],[142,-11],[150,-22],[153,-28],[147,-38],[136,-35],[128,-32],[115,-34]]
];

const LOCATIONS = [
  {
    id: 'brasilien',
    name: 'Brasilien (Minas Gerais / Santos)',
    short: 'Brasilien (39,2 %)',
    role: 'producer',
    lat: -18.5,
    lon: -46.5,
    portLat: -23.9,
    portLon: -46.3,
    share: '39,2 % Weltmarkt (Nr. 1 · 40 Mio. t)',
    color: '#ef4444',
    info: 'Größter Kaffeeproduzent weltweit (40 Mio. Tonnen in 2023/24). Oft riesige Sonnen-Plantagen mit maschineller Ernte. Jährlich werden hier ca. 38 Mio. kg Pestizide im Kaffeeanbau eingesetzt; hohe Entwaldung in Biodiversitäts-Hotspots.',
    presetMatch: { variety: 'blend', farmingSystem: 'monoculture', harvestMethod: 'machine', processingMethod: 'dry' }
  },
  {
    id: 'vietnam',
    name: 'Vietnam (Zentrales Hochland)',
    short: 'Vietnam (Nr. 2)',
    role: 'producer',
    lat: 12.7,
    lon: 108.0,
    portLat: 10.7,
    portLon: 106.7,
    share: 'Nr. 2 weltweit (Robusta-Zentrum)',
    color: '#f59e0b',
    info: 'Zweitgrößter Kaffeeproduzent weltweit mit Fokus auf Robusta (höherer Ertrag, mehr Koffein). Durch Neuanlage von Plantagen in Tropenwald-Hotspots geht wichtiger Lebensraum verloren.',
    presetMatch: { variety: 'robusta', farmingSystem: 'intensive_deforest', harvestMethod: 'strip', processingMethod: 'dry' }
  },
  {
    id: 'indonesien',
    name: 'Indonesien (Sumatra & Java)',
    short: 'Indonesien (Nr. 3)',
    role: 'producer',
    lat: -1.5,
    lon: 102.5,
    portLat: -6.1,
    portLon: 106.8,
    share: 'Nr. 3 weltweit (Biodiversitäts-Hotspot)',
    color: '#f97316',
    info: 'Drittgrößter Produzent. Kaffee wächst hier inmitten artenreicher Regenwald-Ökosysteme, wo Rodungen für Plantagen gravierende Folgen für bedrohte Tier- und Pflanzenarten haben.',
    presetMatch: { variety: 'robusta', farmingSystem: 'monoculture', harvestMethod: 'strip', processingMethod: 'wet' }
  },
  {
    id: 'kolumbien',
    name: 'Kolumbien (Anden-Kaffeedreieck)',
    short: 'Kolumbien (Nr. 4)',
    role: 'producer',
    lat: 4.8,
    lon: -75.6,
    portLat: 10.4,
    portLon: -75.5,
    share: 'Nr. 4 weltweit (Steilhang-Arabica)',
    color: '#eab308',
    info: 'An steilen Andenhängen sind Erntemaschinen unmöglich: Hier werden traditionell nur die reifen roten Kirschen einzeln mit der Hand gepflückt und meist nass aufbereitet (hohe Qualität, hoher Arbeitsaufwand).',
    presetMatch: { variety: 'arabica', farmingSystem: 'monoculture', harvestMethod: 'hand', processingMethod: 'wet' }
  },
  {
    id: 'aethiopien',
    name: 'Äthiopien (Kefa) & Uganda (Mubende)',
    short: 'Äthiopien (Nr. 5)',
    role: 'producer',
    lat: 7.3,
    lon: 36.2,
    portLat: 11.6,
    portLon: 43.1,
    share: 'Nr. 5 & Urheimat des Kaffees',
    color: '#a855f7',
    info: 'Aus der Region Kefa stammt der Kaffeebaum (Legende des Ziegenhirten Kaldi). Im Nachbarland Uganda (Mubende) wurden 2001 rund 4.000 Menschen für eine Großplantage zugunsten der deutschen Neumann Kaffee Gruppe (NKG) gewaltsam vertrieben.',
    presetMatch: { variety: 'arabica', farmingSystem: 'agroforestry', harvestMethod: 'hand', processingMethod: 'dry' }
  },
  {
    id: 'domrep',
    name: 'Dominikanische Republik (OroVerde-Projekt)',
    short: 'Dom. Rep. (OroVerde)',
    role: 'oroverde',
    lat: 18.8,
    lon: -71.2,
    portLat: 18.4,
    portLon: -69.9,
    share: 'Projekte KlimaWald & BioFinCas',
    color: '#10b981',
    info: 'OroVerde-Projektregion (Hispaniola, Kuba, Mexiko, Guatemala): Schatten-Agroforst unter Bananenstauden mit der hitzeresistenten Sorte Catimor und dem Pilz Beauveria bassiana. In Juan Santiago übernehmen 26 Frauen („Mujeres Dando Pasos“) Anbau, Röstung & Verkauf selbst!',
    presetMatch: { variety: 'catimor', farmingSystem: 'agroforestry', harvestMethod: 'hand', processingMethod: 'honey' }
  },
  {
    id: 'deutschland',
    name: 'Deutschland (Hafen Hamburg & Röstereien)',
    short: 'Deutschland (Röstung)',
    role: 'consumer',
    lat: 53.55,
    lon: 9.99,
    portLat: 53.55,
    portLon: 9.99,
    share: 'Weltmeister im Röstkaffee-Export',
    color: '#38bdf8',
    info: 'Deutschland exportiert weltweit den meisten Röstkaffee und trinkt 169 Liter (4,8 kg) pro Kopf/Jahr. Hier bleiben die größten Preisanteile: Röstereien (0,89 €), Einzelhandel (1,39 €) und die deutsche Kaffeesteuer (2,19 € von 8,06 €/kg)!',
    presetMatch: null
  }
];

const STAGES = [
  {
    id: 'anbau',
    step: 'Stufe 1',
    title: 'Anbau & Sorte',
    subtitle: 'Kaffeegürtel & Wald',
    massInfo: '3–4 Jahre bis zur 1. Ernte',
    zoom: 1.55,
    factTitle: '1. Anbau der Kaffeepflanze im Kaffeegürtel (23,5° N bis 23,5° S)',
    factText: 'Kaffee wächst in über 80 Ländern entlang des Äquators (Top 5: Brasilien mit 39,2 % Weltmarktanteil, Vietnam, Indonesien, Kolumbien, Äthiopien). Arabica (55 %) bevorzugt Schatten, wird aber oft in sonnigen Monokulturen mit massivem Pestizideinsatz (in Brasilien 38 Mio. kg/Jahr) angebaut. Weltweit werden jährlich ca. 130.000 ha Wald für Kaffee gerodet. In OroVerde-Projekten (KlimaWald, BioFinCas) schützt Agroforst-Schattenanbau mit Bananenstauden und dem Nützlingspilz Beauveria bassiana Boden und Artenvielfalt.',
    variables: ['variety', 'farmingSystem', 'weatherRisk']
  },
  {
    id: 'ernte',
    step: 'Stufe 2',
    title: 'Ernte',
    subtitle: '7–8 kg Kirschen',
    massInfo: '7–8 kg Kirschen → 1 kg Röstkaffee',
    zoom: 2.15,
    factTitle: '2. Ernte der Kaffeekirschen (8 Monate nach der Blüte)',
    factText: 'Um 1 kg Röstkaffee zu gewinnen, müssen 7 bis 8 kg rote Kaffeekirschen geerntet werden. Die Handpflückung an steilen Hängen wählt nur reife Kirschen aus und schont den Baum, ist aber sehr zeitintensiv. Beim händischen Stripping oder mit großen Erntemaschinen auf flachen Plantagen werden reife und unreife Kirschen samt Zweigen abgestreift – das spart Zeit und Kosten, verletzt aber die Sträucher und mindert die Qualität.',
    variables: ['harvestMethod']
  },
  {
    id: 'aufbereitung',
    step: 'Stufe 3',
    title: 'Aufbereitung',
    subtitle: 'Trocknen & Fermentieren',
    massInfo: '2 Bohnen je Kirsche lösen',
    zoom: 2.05,
    factTitle: '3. Aufbereitung vor Ort: Trocken, Halbtrocken oder Nass',
    factText: 'Nach der Ernte müssen die zwei Bohnen pro Kirsche vom Fruchtfleisch getrennt, fermentiert und getrocknet werden. Die trockene Aufbereitung (10–30 Tage Sonne) ist besonders günstig und mild. Die halbtrockene („Honey-Processed“) lässt Pulpreste für 1–3 Tage fermentieren (süßliche Note). Die nasse Aufbereitung fermentiert 24–72 Std. im Wassertank (klarer Geschmack & Säure, aber höherer Wasserverbrauch und Preis).',
    variables: ['processingMethod']
  },
  {
    id: 'handel',
    step: 'Stufe 4',
    title: 'Seeweg & Handel',
    subtitle: 'Transport & Löhne',
    massInfo: '80 % aus Kleinbetrieben',
    zoom: 1.15,
    factTitle: '4. Globale Transportwege & Verteilung: Wer verdient am Kaffee?',
    factText: 'Containerschiffe transportieren den Rohkaffee über tausende Seemeilen nach Europa. 25 Mio. Kleinbäuer*innen produzieren 80 % des weltweiten Kaffees, erhalten aber oft nur rund 5–7 % des Endpreises (0,41 € von 8,06 €/kg). Mindestens 5,5 Mio. Bäuer*innen leben unter der Armutsgrenze (3,20 US-Dollar/Tag). Allein durch Bohnenverluste entlang der Lieferkette entstehen 11,5 kg CO₂-eq pro kg Kaffee.',
    variables: ['tradeModel', 'supplyChainLoss']
  },
  {
    id: 'roestung',
    step: 'Stufe 5',
    title: 'Röstung',
    subtitle: '200–800 °C Werthebel',
    massInfo: 'Größte Wertsteigerung',
    zoom: 1.85,
    factTitle: '5. Kaffeeröstung: Der entscheidende Wertschöpfungsschritt',
    factText: 'Die Röstung findet meist erst nach dem Export statt – Deutschland ist weltweit führend beim Export von Röstkaffee. Röstereien verdienen im Schnitt 0,89 €/kg und damit mehr als doppelt so viel wie die Kaffeebäuer*innen (0,41 €/kg). Industrielle Schnellröstung arbeitet bei bis zu 800 °C; schonende Trommelröstung bei 200–220 °C. Wird direkt im Ursprungsland geröstet („Mujeres Dando Pasos“), bleibt dieser Gewinn vor Ort!',
    variables: ['roastMethod']
  },
  {
    id: 'konsum',
    step: 'Stufe 6',
    title: 'Steuer & Tasse',
    subtitle: 'Verkauf & Zubereitung',
    massInfo: '169 Liter/Kopf in DE',
    zoom: 2.0,
    factTitle: '6. Verkauf, Kaffeesteuer & Ökobilanz in der Tasse',
    factText: 'Die größten Anteile am Kilopreis von 8,06 € gehen an den Verkauf/Einzelhandel (1,39 €) und die deutsche Kaffeesteuer (2,19 €/kg). In Deutschland werden pro Kopf 169 Liter (ca. 4,8 kg) im Jahr getrunken. Eine schwarze Tasse (250 ml, 15 g) benötigt 280 L virtuelles Wasser und verursacht 0,35 kg CO₂-eq. Ein Kuhmilch-Latte verdoppelt den Wasserbedarf auf 620 L (0,85 kg CO₂-eq), während Hafermilch weniger als die Hälfte benötigt.',
    variables: ['coffeeTax', 'cupDrink']
  }
];

const VARIABLES = {
  variety: {
    stage: 'anbau',
    label: 'Kaffeesorte (Genus Coffea)',
    description: 'Bestimmt Rohkaffeepreis, Ertrag und Klima-Resilienz',
    options: [
      { id: 'blend', name: 'Standard-Marktmix (55 % Arabica / 45 % Robusta)', sub: 'Globaler Durchschnitt laut Quelle', priceDelta: 0.00, farmerDelta: 0.00, rawDelta: 0.00, co2Delta: 0.0, waterMultiplier: 1.0 },
      { id: 'arabica', name: '100 % Arabica (Coffea arabica)', sub: 'Hochwertiger, geringerer Ertrag, empfindlicher', priceDelta: 0.85, farmerDelta: 0.18, rawDelta: 0.67, co2Delta: 0.8, waterMultiplier: 1.06 },
      { id: 'robusta', name: '100 % Robusta (Coffea canephora)', sub: 'Höherer Ertrag, mehr Koffein (Insektenschutz), günstiger', priceDelta: -0.75, farmerDelta: -0.10, rawDelta: -0.65, co2Delta: -1.1, waterMultiplier: 0.92 },
      { id: 'catimor', name: 'Catimor-Kreuzung (Arabica × Robusta · OroVerde)', sub: 'Klima-resiliente Sorte aus dem Projekt KlimaWald', priceDelta: 0.25, farmerDelta: 0.15, rawDelta: 0.10, co2Delta: -1.4, waterMultiplier: 0.94 }
    ]
  },
  farmingSystem: {
    stage: 'anbau',
    label: 'Anbausystem & Regenwaldschutz',
    description: 'Einfluss auf Entwaldung (3,82 kg CO₂-eq), Pestizide & Anbau-Emissionen (10,75 kg CO₂-eq)',
    options: [
      { id: 'monoculture', name: 'Konventionelle Sonnen-Plantage (Status Quo)', sub: 'Schnelles Wachstum, 38 Mio. kg Pestizide/Jahr in Brasilien, Erosion', priceDelta: 0.00, farmerDelta: 0.00, rawDelta: 0.00, landUseCo2: 3.82, cultivationCo2: 10.75, waterMultiplier: 1.0, biodiversity: 'Niedrig (Rodung & Pestizide)' },
      { id: 'intensive_deforest', name: 'Neuland-Plantage durch Regenwald-Rodung', sub: 'Teil der 130.000 ha jährlichen Entwaldung in Biodiversitäts-Hotspots', priceDelta: -0.35, farmerDelta: -0.05, rawDelta: -0.30, landUseCo2: 9.40, cultivationCo2: 12.10, waterMultiplier: 1.12, biodiversity: 'Kritisch (Artensterben & Grundwassergift)' },
      { id: 'agroforestry', name: 'Agroforst-Schattenanbau (OroVerde KlimaWald / BioFinCas)', sub: 'Unter Bananenstauden, Pilz Beauveria bassiana statt Pestiziden', priceDelta: 0.65, farmerDelta: 0.45, rawDelta: 0.20, landUseCo2: 0.00, cultivationCo2: 6.20, waterMultiplier: 0.82, biodiversity: 'Hoch (Vögel, Insekten, gesunde Böden)' }
    ]
  },
  weatherRisk: {
    stage: 'anbau',
    label: 'Klimawandel & Wetterereignisse (Dürre, Frost, Stürme)',
    description: 'Ernteausfälle treiben den Rohkaffee-Weltmarktpreis stark nach oben',
    options: [
      { id: 'normal', name: 'Normales Erntejahr (Gute Blüte)', sub: 'Reguläre Marktprognose ohne Extremwetter', priceDelta: 0.00, farmerDelta: 0.00, rawDelta: 0.00, traderDelta: 0.00 },
      { id: 'moderate_shock', name: 'Klimastress (Unregelmäßiger Regen / Hitze)', sub: 'Ertrag sinkt um ~15 %, Rohkaffeepreis steigt', priceDelta: 0.90, farmerDelta: -0.04, rawDelta: 0.74, traderDelta: 0.20 },
      { id: 'severe_frost', name: 'Extremwetter-Schock (Dürre / Frost in Brasilien)', sub: 'Ernteausfall & Spekulation verteuern Rohkaffee drastisch', priceDelta: 2.10, farmerDelta: -0.08, rawDelta: 1.73, traderDelta: 0.45 }
    ]
  },
  harvestMethod: {
    stage: 'ernte',
    label: 'Erntemethode (7–8 kg Kirschen pro kg Röstkaffee)',
    description: 'Bestimmt Arbeitsaufwand vor Ort und Bohnenqualität',
    options: [
      { id: 'strip', name: 'Mix / Strip-Pflückung (Zweige abstreifen · Referenz)', sub: 'Reife & unreife Kirschen fallen auf ein Tuch – mittlerer Aufwand', priceDelta: 0.00, farmerDelta: 0.00, rawDelta: 0.00, quality: 'Solide Standardqualität' },
      { id: 'hand', name: 'Selektive Handpflückung (Picking an Steilhängen)', sub: 'Nur reife rote Kirschen gepflückt, schont den Baum, zeitintensiv', priceDelta: 0.75, farmerDelta: 0.50, rawDelta: 0.25, quality: 'Höchste Spezialitäten-Qualität' },
      { id: 'machine', name: 'Maschinelle Ernte (Großplantage, flaches Terrain)', sub: 'Sehr schnell & günstig, verletzt Bäume, viele unreife Kirschen', priceDelta: -0.45, farmerDelta: -0.15, rawDelta: -0.30, quality: 'Niedrigere Qualität (Bitterstoffe)' }
    ]
  },
  processingMethod: {
    stage: 'aufbereitung',
    label: 'Aufbereitung der Kaffeekirschen',
    description: 'Trennen von Fruchtfleisch, Fermentation & Trocknung',
    options: [
      { id: 'dry', name: 'Trockene Aufbereitung (Natural · Referenz)', sub: '10–30 Tage Sonne, besonders günstig, milder & vollmundiger Geschmack', priceDelta: 0.00, rawDelta: 0.00, procCo2: 0.45, waterBonusL: 0 },
      { id: 'honey', name: 'Halbtrockene Aufbereitung (Honey-Processed)', sub: 'Entpulpt mit Pulpresten, 1–3 Tage fermentiert, süßliche Note', priceDelta: 0.30, rawDelta: 0.30, procCo2: 0.61, waterBonusL: 8 },
      { id: 'wet', name: 'Nasse Aufbereitung (Washed)', sub: '24–72 Std. im Wassertank fermentiert, klarer Geschmack & feine Säure', priceDelta: 0.50, rawDelta: 0.50, procCo2: 0.85, waterBonusL: 22 }
    ]
  },
  tradeModel: {
    stage: 'handel',
    label: 'Handelsmodell & Lieferkette',
    description: 'Entscheidet über Löhne, Zwischenhändler und Menschenrechte',
    options: [
      { id: 'conventional', name: 'Konventioneller Welthandel (Status Quo)', sub: 'Farmer*innen erhalten nur 0,41 €/kg (~5,1 %), Risiko für Kinderarbeit', priceDelta: 0.00, farmerDelta: 0.00, traderDelta: 0.00, exportDelta: 0.00, roasterDelta: 0.00, retailDelta: 0.00 },
      { id: 'fairtrade', name: 'Fairtrade- & Bio-Zertifizierung', sub: 'Mindestpreis + Sozialprämie, Kontrolle gegen Kinderarbeit & Landraub', priceDelta: 1.35, farmerDelta: 0.95, traderDelta: 0.10, exportDelta: 0.05, roasterDelta: 0.10, retailDelta: 0.15 },
      { id: 'direct_coop', name: 'Direkthandel / Frauenkooperative „Mujeres Dando Pasos“', sub: '26 Frauen in der Dom. Republik übernehmen Anbau bis Vermarktung selbst', priceDelta: 1.60, farmerDelta: 1.95, traderDelta: -0.26, exportDelta: 0.05, roasterDelta: -0.14, retailDelta: 0.00 }
    ]
  },
  supplyChainLoss: {
    stage: 'handel',
    label: 'Verluste entlang der Lieferkette reduzieren',
    description: 'Laut Studie entstehen 11,5 kg CO₂-eq/kg durch Bohnenverluste beim Transport & Lagerung',
    options: [
      { id: 'standard_loss', name: 'Standard-Lieferkettenverluste (11,50 kg CO₂-eq/kg)', sub: 'Hoher Ausschuss bei Lagerung, Schimmel & Transport', priceDelta: 0.00, rawDelta: 0.00, lossCo2: 11.50 },
      { id: 'optimized_loss', name: 'Optimierte Logistik & luftdichte Lagerung (-50 % Verlust)', sub: 'Bessere Trocknung & Säcke halbieren den Bohnenverlust', priceDelta: -0.25, rawDelta: -0.25, lossCo2: 5.75 }
    ]
  },
  roastMethod: {
    stage: 'roestung',
    label: 'Röstverfahren & Ort der Wertschöpfung',
    description: 'Röstereien in Deutschland verdienen im Schnitt 0,89 €/kg',
    options: [
      { id: 'industrial_de', name: 'Industrielle Großröstung in DE (bis 800 °C · Referenz)', sub: 'Schnellröstung in wenigen Minuten, hohe Marge für Rösterei (0,89 €)', priceDelta: 0.00, roasterDelta: 0.00, farmerDelta: 0.00, retailDelta: 0.00 },
      { id: 'drum_specialty', name: 'Schonende Trommelröstung (200–220 °C · Hell/Mittel/Dunkel)', sub: 'Handwerkliche Röstung (12–18 Min.) für komplexe Schoko-/Fruchtaromen', priceDelta: 1.40, roasterDelta: 1.05, farmerDelta: 0.00, retailDelta: 0.35 },
      { id: 'origin_roast', name: 'Röstung im Ursprungsland (z. B. „La Cañita“ Dom. Rep.)', sub: 'Wertschöpfung der Röstung bleibt direkt bei den Produzent*innen!', priceDelta: 0.40, roasterDelta: -0.65, farmerDelta: 1.05, retailDelta: 0.00 }
    ]
  },
  coffeeTax: {
    stage: 'konsum',
    label: 'Deutsche Kaffeesteuer (Politik-Variable)',
    description: 'In Deutschland fallen fest 2,19 €/kg Röstkaffee an – mehr als 5× so viel wie für die Farmer*innen!',
    options: [
      { id: 'standard_tax', name: 'Gesetzliche Kaffeesteuer (2,19 € / kg · Status Quo)', sub: 'Größter Einzelposten am Gewinn-/Abgabenkuchen in Deutschland', taxAmount: 2.19 },
      { id: 'reduced_tax', name: 'Halbierte Kaffeesteuer (1,10 € / kg · Reformvorschlag)', sub: 'Entlastung für nachhaltig zertifizierten Kaffee', taxAmount: 1.10 },
      { id: 'zero_tax', name: 'Steuerbefreiung für fairen Kaffee (0,00 € / kg · PoWi-Szenario)', sub: 'Was wäre, wenn der Staat auf die 2,19 € Kaffeesteuer verzichtet?', taxAmount: 0.00 }
    ]
  },
  cupDrink: {
    stage: 'konsum',
    label: 'Zubereitung & Milchwahl in deiner Tasse',
    description: 'Bestimmt den Wasser- und CO₂-Fußabdruck deiner täglichen Tasse',
    options: [
      { id: 'black', name: 'Schwarzer Kaffee (250 ml · 15 g Kaffeepulver)', sub: '280 L Wasser · 0,35 kg CO₂-eq pro Tasse (OroVerde-Basis)', gramsPerCup: 15, milkCostPerCup: 0.00, baseWaterL: 280, baseCupCo2: 0.35 },
      { id: 'espresso', name: 'Shot Espresso (ca. 7 g Kaffeepulver)', sub: '~130 L Wasser · 0,16 kg CO₂-eq pro Tasse', gramsPerCup: 7, milkCostPerCup: 0.00, baseWaterL: 130, baseCupCo2: 0.16 },
      { id: 'cappuccino_cow', name: 'Cappuccino mit Kuhmilch', sub: '260 L Wasser · 0,35 kg CO₂-eq pro Tasse (+Milchpreis)', gramsPerCup: 7, milkCostPerCup: 0.18, baseWaterL: 260, baseCupCo2: 0.35 },
      { id: 'cappuccino_oat', name: 'Cappuccino mit Hafermilch (Pflanzliche Alternative)', sub: '~130 L Wasser · nur 0,21 kg CO₂-eq pro Tasse', gramsPerCup: 7, milkCostPerCup: 0.22, baseWaterL: 130, baseCupCo2: 0.21 },
      { id: 'latte_cow', name: 'Latte Macchiato / Café Latte mit Kuhmilch', sub: '620 L Wasser (>2× schwarzer Kaffee!) · 0,85 kg CO₂-eq', gramsPerCup: 15, milkCostPerCup: 0.32, baseWaterL: 620, baseCupCo2: 0.85 },
      { id: 'latte_oat', name: 'Hafer-Latte (Klimafreundliche Alternative)', sub: '290 L Wasser (< Hälfte von Kuhmilch) · 0,47 kg CO₂-eq', gramsPerCup: 15, milkCostPerCup: 0.38, baseWaterL: 290, baseCupCo2: 0.47 }
    ]
  }
};

let state = {
  activeStage: 'anbau',
  activeLocation: 'brasilien',
  showAllVars: false,
  activePreset: 'statusquo',
  tourTimer: null,
  selections: {
    variety: 'blend',
    farmingSystem: 'monoculture',
    weatherRisk: 'normal',
    harvestMethod: 'strip',
    processingMethod: 'dry',
    tradeModel: 'conventional',
    supplyChainLoss: 'standard_loss',
    roastMethod: 'industrial_de',
    coffeeTax: 'standard_tax',
    cupDrink: 'black'
  }
};

let cam = {
  lon: -35,
  lat: 10,
  zoom: 1.25,
  targetLon: -46.5,
  targetLat: -16.0,
  targetZoom: 1.5,
  dragging: false,
  lastX: 0,
  lastY: 0,
  animPhase: 0
};

let projectedPins = [];

function getOpt(varKey) {
  const v = VARIABLES[varKey];
  return v.options.find(o => o.id === state.selections[varKey]) || v.options[0];
}

function fmtEur(n, showSign = false) {
  const sign = showSign ? (n > 0.004 ? '+' : (n < -0.004 ? '−' : '±')) : (n < 0 ? '−' : '');
  return sign + Math.abs(n).toFixed(2).replace('.', ',') + ' €';
}

function focusCameraForStage(stageId, locId) {
  const loc = LOCATIONS.find(l => l.id === (locId || state.activeLocation)) || LOCATIONS[0];
  const st = STAGES.find(s => s.id === stageId) || STAGES[0];

  if (stageId === 'anbau' || stageId === 'ernte' || stageId === 'aufbereitung') {
    const targetLoc = loc.role === 'consumer' ? LOCATIONS[0] : loc;
    state.activeLocation = targetLoc.id;
    cam.targetLon = targetLoc.lon;
    cam.targetLat = targetLoc.lat;
    cam.targetZoom = st.zoom;
  } else if (stageId === 'handel') {
    const prodLoc = loc.role === 'consumer' ? LOCATIONS[0] : loc;
    cam.targetLon = (prodLoc.lon + 9.99) * 0.45;
    cam.targetLat = (prodLoc.lat + 53.55) * 0.45;
    cam.targetZoom = 1.15;
  } else if (stageId === 'roestung') {
    if (state.selections.roastMethod === 'origin_roast') {
      const originLoc = LOCATIONS.find(l => l.id === 'domrep');
      state.activeLocation = 'domrep';
      cam.targetLon = originLoc.lon;
      cam.targetLat = originLoc.lat;
      cam.targetZoom = 2.0;
    } else {
      state.activeLocation = 'deutschland';
      cam.targetLon = 9.99;
      cam.targetLat = 48.0;
      cam.targetZoom = 1.85;
    }
  } else if (stageId === 'konsum') {
    state.activeLocation = 'deutschland';
    cam.targetLon = 10.0;
    cam.targetLat = 50.0;
    cam.targetZoom = 2.05;
  }
}

window.applyPreset = function(presetName) {
  stopTour();
  state.activePreset = presetName;
  if (presetName === 'statusquo') {
    state.selections = {
      variety: 'blend', farmingSystem: 'monoculture', weatherRisk: 'normal',
      harvestMethod: 'strip', processingMethod: 'dry', tradeModel: 'conventional',
      supplyChainLoss: 'standard_loss', roastMethod: 'industrial_de',
      coffeeTax: 'standard_tax', cupDrink: 'black'
    };
    state.activeLocation = 'brasilien';
  } else if (presetName === 'discount') {
    state.selections = {
      variety: 'robusta', farmingSystem: 'intensive_deforest', weatherRisk: 'normal',
      harvestMethod: 'machine', processingMethod: 'dry', tradeModel: 'conventional',
      supplyChainLoss: 'standard_loss', roastMethod: 'industrial_de',
      coffeeTax: 'standard_tax', cupDrink: 'black'
    };
    state.activeLocation = 'vietnam';
  } else if (presetName === 'agroforst') {
    state.selections = {
      variety: 'catimor', farmingSystem: 'agroforestry', weatherRisk: 'normal',
      harvestMethod: 'hand', processingMethod: 'honey', tradeModel: 'fairtrade',
      supplyChainLoss: 'optimized_loss', roastMethod: 'drum_specialty',
      coffeeTax: 'standard_tax', cupDrink: 'cappuccino_oat'
    };
    state.activeLocation = 'domrep';
  } else if (presetName === 'mujeres') {
    state.selections = {
      variety: 'arabica', farmingSystem: 'agroforestry', weatherRisk: 'normal',
      harvestMethod: 'hand', processingMethod: 'wet', tradeModel: 'direct_coop',
      supplyChainLoss: 'optimized_loss', roastMethod: 'origin_roast',
      coffeeTax: 'zero_tax', cupDrink: 'black'
    };
    state.activeLocation = 'domrep';
  }
  focusCameraForStage(state.activeStage, state.activeLocation);
  renderApp();
};

window.selectStage = function(stageId) {
  stopTour();
  state.activeStage = stageId;
  state.showAllVars = false;
  focusCameraForStage(stageId, state.activeLocation);
  renderApp();
};

window.selectLocation = function(locId, applyProfile = true) {
  stopTour();
  state.activeLocation = locId;
  const loc = LOCATIONS.find(l => l.id === locId);
  if (!loc) return;
  cam.targetLon = loc.lon;
  cam.targetLat = loc.lat;
  cam.targetZoom = 1.95;

  if (loc.role === 'consumer') {
    state.activeStage = 'roestung';
  } else {
    if (state.activeStage === 'roestung' || state.activeStage === 'konsum') {
      state.activeStage = 'anbau';
    }
    if (applyProfile && loc.presetMatch) {
      Object.assign(state.selections, loc.presetMatch);
      state.activePreset = 'custom';
    }
  }
  renderApp();
};

window.adjustZoom = function(factor) {
  cam.targetZoom = Math.max(0.95, Math.min(3.3, cam.targetZoom * factor));
};

window.resetGlobeView = function() {
  stopTour();
  cam.targetLon = -15;
  cam.targetLat = 12;
  cam.targetZoom = 1.05;
};

window.playTour = function() {
  if (state.tourTimer) {
    stopTour();
    return;
  }
  const order = ['anbau', 'ernte', 'aufbereitung', 'handel', 'roestung', 'konsum'];
  let idx = 0;
  const btn = document.getElementById('btn-tour');
  if (btn) btn.textContent = '⏸ Weltreise stoppen';

  const stepFn = () => {
    const stId = order[idx];
    state.activeStage = stId;
    state.showAllVars = false;
    if (idx === 0 && state.activeLocation === 'deutschland') {
      state.activeLocation = 'brasilien';
    }
    focusCameraForStage(stId, state.activeLocation);
    renderApp();
    idx = (idx + 1) % order.length;
  };
  stepFn();
  state.tourTimer = setInterval(stepFn, 3600);
};

function stopTour() {
  if (state.tourTimer) {
    clearInterval(state.tourTimer);
    state.tourTimer = null;
    const btn = document.getElementById('btn-tour');
    if (btn) btn.textContent = '▶ Weltreise abspielen';
  }
}

window.toggleAllVarsView = function() {
  state.showAllVars = !state.showAllVars;
  renderApp();
};

window.setVariable = function(varKey, optId) {
  state.selections[varKey] = optId;
  state.activePreset = 'custom';
  if (varKey === 'roastMethod' && optId === 'origin_roast') {
    state.activeLocation = 'domrep';
    cam.targetLon = -71.2;
    cam.targetLat = 18.8;
    cam.targetZoom = 1.95;
  } else if (varKey === 'roastMethod' && optId !== 'origin_roast' && state.activeStage === 'roestung') {
    state.activeLocation = 'deutschland';
    cam.targetLon = 9.99;
    cam.targetLat = 50.0;
    cam.targetZoom = 1.85;
  }
  renderApp();
};

function calculateModel() {
  const vVariety = getOpt('variety');
  const vFarm = getOpt('farmingSystem');
  const vWeather = getOpt('weatherRisk');
  const vHarvest = getOpt('harvestMethod');
  const vProc = getOpt('processingMethod');
  const vTrade = getOpt('tradeModel');
  const vLoss = getOpt('supplyChainLoss');
  const vRoast = getOpt('roastMethod');
  const vTax = getOpt('coffeeTax');
  const vCup = getOpt('cupDrink');

  const farmer = Math.max(0.10, 0.41 + (vVariety.farmerDelta || 0) + (vFarm.farmerDelta || 0) + (vWeather.farmerDelta || 0) + (vHarvest.farmerDelta || 0) + (vTrade.farmerDelta || 0) + (vRoast.farmerDelta || 0));
  const trader = Math.max(0.00, 0.26 + (vWeather.traderDelta || 0) + (vTrade.traderDelta || 0));
  const exporter = Math.max(0.10, 0.29 + (vTrade.exportDelta || 0));
  const roaster = Math.max(0.15, 0.89 + (vTrade.roasterDelta || 0) + (vRoast.roasterDelta || 0));
  const retail = Math.max(0.50, 1.39 + (vTrade.retailDelta || 0) + (vRoast.retailDelta || 0));
  const tax = vTax.taxAmount;
  const rawAndOps = Math.max(1.20, 2.63 + (vVariety.rawDelta || 0) + (vFarm.rawDelta || 0) + (vWeather.rawDelta || 0) + (vHarvest.rawDelta || 0) + (vProc.rawDelta || 0) + (vLoss.rawDelta || 0));

  const totalKgPrice = farmer + trader + exporter + roaster + retail + tax + rawAndOps;
  const diffFromBase = totalKgPrice - 8.06;

  const co2Land = vFarm.landUseCo2;
  const co2Cult = Math.max(3.0, vFarm.cultivationCo2 + (vVariety.co2Delta || 0));
  const co2Proc = vProc.procCo2;
  const co2Trans = 0.18;
  const co2Loss = vLoss.lossCo2;
  const co2Rest = 1.67;
  const totalCo2Kg = co2Land + co2Cult + co2Proc + co2Trans + co2Loss + co2Rest;

  const co2Ratio = totalCo2Kg / 28.53;
  const coffeePortionCo2 = (vCup.gramsPerCup / 15) * 0.35 * co2Ratio;
  const milkPortionCo2 = Math.max(0, vCup.baseCupCo2 - (vCup.gramsPerCup / 15) * 0.35);
  const cupCo2 = coffeePortionCo2 + milkPortionCo2;

  const waterMult = vVariety.waterMultiplier * vFarm.waterMultiplier;
  const coffeeWaterBase = (vCup.gramsPerCup / 15) * 280;
  const milkWaterBase = Math.max(0, vCup.baseWaterL - coffeeWaterBase);
  const cupWaterL = Math.round(coffeeWaterBase * waterMult + vProc.waterBonusL + milkWaterBase);

  const cupCoffeeCost = (totalKgPrice / 1000) * vCup.gramsPerCup;
  const cupTotalCost = cupCoffeeCost + vCup.milkCostPerCup;

  const drivers = [
    { label: 'Kaffeesorte', name: vVariety.name.split(' (')[0], delta: vVariety.priceDelta },
    { label: 'Anbausystem', name: vFarm.name.split(' (')[0], delta: vFarm.priceDelta },
    { label: 'Wetter / Klima', name: vWeather.name.split(' (')[0], delta: vWeather.priceDelta },
    { label: 'Erntemethode', name: vHarvest.name.split(' (')[0], delta: vHarvest.priceDelta },
    { label: 'Aufbereitung', name: vProc.name.split(' (')[0], delta: vProc.priceDelta },
    { label: 'Handelsmodell', name: vTrade.name.split(' (')[0], delta: vTrade.priceDelta },
    { label: 'Lieferkettenverluste', name: vLoss.name.split(' (')[0], delta: vLoss.priceDelta },
    { label: 'Röstung', name: vRoast.name.split(' (')[0], delta: vRoast.priceDelta },
    { label: 'Kaffeesteuer', name: vTax.name.split(' (')[0], delta: vTax.taxAmount - 2.19 }
  ];

  return {
    farmer, trader, exporter, roaster, retail, tax, rawAndOps,
    totalKgPrice, diffFromBase,
    co2Land, co2Cult, co2Proc, co2Trans, co2Loss, totalCo2Kg,
    cupCo2, cupWaterL, cupTotalCost, vCup, vFarm, vHarvest, drivers
  };
}

function renderApp() {
  const m = calculateModel();

  ['statusquo', 'discount', 'agroforst', 'mujeres'].forEach(p => {
    const btn = document.getElementById('preset-' + p);
    if (btn) btn.classList.toggle('active', state.activePreset === p);
  });

  document.getElementById('kpi-price-kg').textContent = fmtEur(m.totalKgPrice);
  document.getElementById('kpi-price-diff').textContent = fmtEur(m.diffFromBase, true);

  const farmerPct = (m.farmer / m.totalKgPrice) * 100;
  document.getElementById('kpi-farmer-eur').textContent = fmtEur(m.farmer);
  document.getElementById('kpi-farmer-pct').textContent = farmerPct.toFixed(1).replace('.', ',') + ' %';

  const povBadge = document.getElementById('kpi-poverty-badge');
  if (m.farmer < 0.80) {
    povBadge.textContent = 'Armutsrisiko (<3,20 $/Tag)';
    povBadge.style.color = 'var(--accent-cherry)';
  } else if (m.farmer < 1.50) {
    povBadge.textContent = 'Existenzsichernd (Fair)';
    povBadge.style.color = 'var(--accent-gold)';
  } else {
    povBadge.textContent = 'Hohe lokale Wertschöpfung!';
    povBadge.style.color = 'var(--accent-forest)';
  }

  document.getElementById('kpi-co2-kg').textContent = m.totalCo2Kg.toFixed(2).replace('.', ',') + ' kg';
  document.getElementById('kpi-co2-cup').textContent = m.cupCo2.toFixed(2).replace('.', ',') + ' kg/Tasse';
  document.getElementById('kpi-water-cup').textContent = m.cupWaterL + ' L';
  document.getElementById('kpi-cup-price').textContent = fmtEur(m.cupTotalCost) + '/Tasse';
  document.getElementById('kpi-drink-label').textContent = m.vCup.name.split(' (')[0];

  // Location Quick-Zoom Pills on Globe
  document.getElementById('location-pills').innerHTML = LOCATIONS.map(l => {
    const isAct = state.activeLocation === l.id;
    return `
      <button onclick="selectLocation('${l.id}')" class="loc-pill ${isAct ? 'active' : ''}">
        <span class="loc-dot" style="background: ${l.color}"></span>
        <span>${l.short}</span>
      </button>
    `;
  }).join('');

  // Globe Bottom Overlay Info Card
  const currentStageObj = STAGES.find(s => s.id === state.activeStage) || STAGES[0];
  const locObj = LOCATIONS.find(l => l.id === state.activeLocation) || LOCATIONS[0];
  document.getElementById('globe-overlay-card').innerHTML = `
    <div class="globe-info-top">
      <div class="globe-loc-title">
        <span class="loc-dot" style="background: ${locObj.color}"></span>
        <span>${locObj.name}</span>
        <span class="globe-loc-badge">${locObj.share}</span>
      </div>
      <span style="font-size: 0.78rem; font-weight: 700; color: #38bdf8">${currentStageObj.step}: ${currentStageObj.title}</span>
    </div>
    <p class="globe-info-desc">${locObj.info}</p>
  `;

  // 6-Stage Cycle Stepper
  const stepperEl = document.getElementById('cycle-stepper');
  stepperEl.innerHTML = STAGES.map(st => {
    const isActive = !state.showAllVars && state.activeStage === st.id;
    const stageDelta = st.variables.reduce((acc, vk) => {
      const opt = getOpt(vk);
      if (vk === 'coffeeTax') return acc + (opt.taxAmount - 2.19);
      return acc + (opt.priceDelta || 0);
    }, 0);
    const badgeText = Math.abs(stageDelta) < 0.005 ? '±0,00 €' : fmtEur(stageDelta, true);
    return `
      <button id="stage-btn-${st.id}" onclick="selectStage('${st.id}')" class="stage-node ${isActive ? 'active' : ''}">
        <div class="stage-node-top">
          <span class="stage-step-num">${st.step}</span>
          <span class="stage-delta-pill">${badgeText}</span>
        </div>
        <div class="stage-node-title">${st.title}</div>
        <div class="stage-node-sub">${st.subtitle}</div>
      </button>
    `;
  }).join('');

  document.getElementById('toggle-all-vars').textContent = state.showAllVars
    ? 'Zur Stufen-Ansicht wechseln'
    : 'Alle 10 Variablen gleichzeitig anzeigen';

  const stageInfoEl = document.getElementById('stage-info-box');
  if (state.showAllVars) {
    stageInfoEl.innerHTML = `
      <div class="stage-story-header">
        <span class="stage-story-title">Gesamtübersicht aller 10 Stellschrauben</span>
        <span class="mass-pill">7–8 kg Kirschen = 1 kg Röstkaffee</span>
      </div>
      <p class="stage-story-text">
        Passe beliebige Variablen entlang der gesamten Wertschöpfungskette an, um live zu testen, wie sich Anbau, Ernte, Aufbereitung, Handel, Röstung und Steuern auf den Endpreis und den Regenwald auswirken.
      </p>
    `;
  } else {
    stageInfoEl.innerHTML = `
      <div class="stage-story-header">
        <span class="stage-story-title">${currentStageObj.factTitle}</span>
        <span class="mass-pill">${currentStageObj.massInfo}</span>
      </div>
      <p class="stage-story-text">${currentStageObj.factText}</p>
    `;
  }

  const varsToRender = state.showAllVars
    ? Object.keys(VARIABLES)
    : currentStageObj.variables;

  const controlsEl = document.getElementById('controls-container');
  controlsEl.innerHTML = varsToRender.map(varKey => {
    const v = VARIABLES[varKey];
    const selectedId = state.selections[varKey];
    return `
      <div class="var-group">
        <div class="var-header">
          <div class="var-title">${v.label}</div>
          <div class="var-desc">${v.description}</div>
        </div>
        <div class="option-list">
          ${v.options.map(opt => {
            const isSelected = opt.id === selectedId;
            let impactLabel = '';
            if (varKey === 'coffeeTax') {
              const d = opt.taxAmount - 2.19;
              impactLabel = fmtEur(d, true) + '/kg';
            } else if (varKey === 'cupDrink') {
              impactLabel = opt.baseWaterL + ' L · ' + opt.baseCupCo2.toFixed(2).replace('.', ',') + ' kg CO₂';
            } else {
              impactLabel = fmtEur(opt.priceDelta || 0, true) + '/kg';
            }
            return `
              <button id="opt-${varKey}-${opt.id}" onclick="setVariable('${varKey}', '${opt.id}')" class="option-btn ${isSelected ? 'selected' : ''}">
                <div>
                  <div class="option-name">${opt.name}</div>
                  <div class="option-sub">${opt.sub}</div>
                </div>
                <span class="option-impact">${impactLabel}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('bar-total-label').textContent = fmtEur(m.totalKgPrice) + ' / kg';
  const actors = [
    { name: 'Farmer*innen (Gewinn/Lohn)', val: m.farmer, ref: 0.41, color: '#2b7a4b' },
    { name: 'Händler*innen', val: m.trader, ref: 0.26, color: '#d97706' },
    { name: 'Export & Verschiffung', val: m.exporter, ref: 0.29, color: '#0284c7' },
    { name: 'Röstereien', val: m.roaster, ref: 0.89, color: '#7c2d12' },
    { name: 'Verkauf / Einzelhandel', val: m.retail, ref: 1.39, color: '#b45309' },
    { name: 'Deutsche Kaffeesteuer', val: m.tax, ref: 2.19, color: '#be123c' },
    { name: 'Rohkaffee-Basis, Aufbereitung & MwSt.', val: m.rawAndOps, ref: 2.63, color: '#78716c' }
  ];

  document.getElementById('price-stacked-bar').innerHTML = actors.map(a => {
    const pct = Math.max(0, (a.val / m.totalKgPrice) * 100);
    return `<div class="bar-seg" style="width: ${pct.toFixed(2)}%; background: ${a.color}" title="${a.name}: ${fmtEur(a.val)}"></div>`;
  }).join('');

  document.getElementById('actor-breakdown-list').innerHTML = actors.map(a => {
    const pct = (a.val / m.totalKgPrice) * 100;
    const diff = a.val - a.ref;
    const diffBadge = Math.abs(diff) > 0.005 ? `<span style="color: var(--text-muted)">(${fmtEur(diff, true)})</span>` : '';
    return `
      <div class="actor-row">
        <div class="actor-left">
          <span class="color-swatch" style="background: ${a.color}"></span>
          <span>${a.name}</span>
        </div>
        <div class="actor-right">
          ${diffBadge}
          <strong>${fmtEur(a.val)}</strong>
          <span style="color: var(--text-muted); width: 44px; text-align: right">${pct.toFixed(1).replace('.', ',')}%</span>
        </div>
      </div>
    `;
  }).join('');

  const activeDrivers = m.drivers.filter(d => Math.abs(d.delta) > 0.005);
  const deltaListEl = document.getElementById('delta-drivers-list');
  if (activeDrivers.length === 0) {
    deltaListEl.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted);">Alle Variablen stehen auf dem OroVerde-Referenzwert (8,06 €/kg). Verändere links eine Variable, um ihren exakten Preiseffekt zu sehen.</div>`;
  } else {
    deltaListEl.innerHTML = activeDrivers.map(d => `
      <div class="eco-row">
        <span><strong>${d.label}:</strong> ${d.name}</span>
        <strong style="font-family: monospace; color: ${d.delta > 0 ? 'var(--accent-cherry)' : 'var(--accent-forest)'}">${fmtEur(d.delta, true)}</strong>
      </div>
    `).join('');
  }

  document.getElementById('eco-breakdown-list').innerHTML = `
    <div class="eco-row">
      <span>Biodiversität &amp; Regenwald:</span>
      <strong>${m.vFarm.biodiversity}</strong>
    </div>
    <div class="eco-row">
      <span>CO₂ Landnutzung / Rodung:</span>
      <span style="font-family: monospace">${m.co2Land.toFixed(2).replace('.', ',')} kg CO₂-eq/kg</span>
    </div>
    <div class="eco-row">
      <span>CO₂ Anbau &amp; Düngung:</span>
      <span style="font-family: monospace">${m.co2Cult.toFixed(2).replace('.', ',')} kg CO₂-eq/kg</span>
    </div>
    <div class="eco-row">
      <span>CO₂ Lieferketten-Verluste:</span>
      <span style="font-family: monospace">${m.co2Loss.toFixed(2).replace('.', ',')} kg CO₂-eq/kg</span>
    </div>
    <div class="eco-row">
      <span>CO₂ Verarbeitung, Transport &amp; Röstung:</span>
      <span style="font-family: monospace">${(m.co2Proc + m.co2Trans + 1.67).toFixed(2).replace('.', ',')} kg CO₂-eq/kg</span>
    </div>
    <div class="eco-row">
      <span>Bohnenqualität in der Tasse:</span>
      <strong>${m.vHarvest.quality}</strong>
    </div>
  `;
}

// --- 3D ORTHOGRAPHIC GLOBE ENGINE ---
function initGlobe() {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function deg2rad(d) { return d * Math.PI / 180; }

  function project(lon, lat, cx, cy, R) {
    const lam = deg2rad(lon - cam.lon);
    const phi = deg2rad(lat);
    const phi0 = deg2rad(cam.lat);

    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    const cosPhi0 = Math.cos(phi0);
    const sinPhi0 = Math.sin(phi0);
    const cosLam = Math.cos(lam);

    const cosC = sinPhi0 * sinPhi + cosPhi0 * cosPhi * cosLam;
    const x = cx + R * (cosPhi * Math.sin(lam));
    const y = cy - R * (cosPhi0 * sinPhi - sinPhi0 * cosPhi * cosLam);
    return { x, y, z: cosC };
  }

  function drawGlobe() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    }
    ctx.save();
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;
    ctx.clearRect(0, 0, W, H);

    if (!cam.dragging) {
      let dLon = cam.targetLon - cam.lon;
      while (dLon > 180) dLon -= 360;
      while (dLon < -180) dLon += 360;
      cam.lon += dLon * 0.08;
      cam.lat += (cam.targetLat - cam.lat) * 0.08;
    }
    cam.zoom += (cam.targetZoom - cam.zoom) * 0.1;
    cam.animPhase = (cam.animPhase + 0.011) % 1;

    const cx = W * 0.5;
    const cy = H * 0.43;
    const baseR = Math.min(W, H) * 0.37;
    const R = baseR * cam.zoom;

    // Atmosphere Glow
    const haloGrad = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.15);
    haloGrad.addColorStop(0, 'rgba(56, 189, 248, 0.24)');
    haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.15, 0, Math.PI * 2);
    ctx.fill();

    // Ocean Clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();

    const oceanGrad = ctx.createRadialGradient(cx - R * 0.28, cy - R * 0.28, R * 0.1, cx, cy, R);
    oceanGrad.addColorStop(0, '#123252');
    oceanGrad.addColorStop(0.7, '#0b1e33');
    oceanGrad.addColorStop(1, '#06101c');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

    // Coffee Belt Band (23.5° N to 23.5° S)
    ctx.beginPath();
    let startedBelt = false;
    for (let lon = -180; lon <= 180; lon += 4) {
      const p = project(lon, 23.5, cx, cy, R);
      if (p.z > -0.2) {
        if (!startedBelt) { ctx.moveTo(p.x, p.y); startedBelt = true; }
        else ctx.lineTo(p.x, p.y);
      }
    }
    for (let lon = 180; lon >= -180; lon -= 4) {
      const p = project(lon, -23.5, cx, cy, R);
      if (p.z > -0.2) ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    const isAgro = state.selections.farmingSystem === 'agroforestry';
    const isDeforest = state.selections.farmingSystem === 'intensive_deforest';
    ctx.fillStyle = isAgro
      ? 'rgba(16, 185, 129, 0.20)'
      : isDeforest
        ? 'rgba(239, 68, 68, 0.20)'
        : 'rgba(245, 158, 11, 0.17)';
    ctx.fill();

    // Tropics & Equator Lines
    [23.5, 0, -23.5].forEach((latLine, idx) => {
      ctx.beginPath();
      ctx.setLineDash(idx === 1 ? [3, 3] : [5, 4]);
      let move = true;
      for (let lon = -180; lon <= 180; lon += 3) {
        const p = project(lon, latLine, cx, cy, R);
        if (p.z > 0) {
          if (move) { ctx.moveTo(p.x, p.y); move = false; }
          else ctx.lineTo(p.x, p.y);
        } else move = true;
      }
      ctx.strokeStyle = idx === 1 ? 'rgba(251, 191, 36, 0.45)' : 'rgba(52, 211, 153, 0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Graticule Meridians
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.09)';
    ctx.lineWidth = 0.8;
    for (let lon = -150; lon <= 180; lon += 30) {
      ctx.beginPath();
      let m = true;
      for (let lat = -80; lat <= 80; lat += 5) {
        const p = project(lon, lat, cx, cy, R);
        if (p.z > 0) {
          if (m) { ctx.moveTo(p.x, p.y); m = false; }
          else ctx.lineTo(p.x, p.y);
        } else m = true;
      }
      ctx.stroke();
    }

    // Continents
    CONTINENTS.forEach(poly => {
      ctx.beginPath();
      let visCount = 0;
      poly.forEach(([lon, lat], i) => {
        const p = project(lon, lat, cx, cy, R);
        if (p.z > 0) visCount++;
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      if (visCount > 0) {
        ctx.fillStyle = '#1f3f31';
        ctx.fill();
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }
    });

    // Maritime Shipping Routes to Hamburg (Germany)
    const hamburg = LOCATIONS.find(l => l.id === 'deutschland');
    LOCATIONS.filter(l => l.role !== 'consumer').forEach(loc => {
      const isSelectedRoute = state.activeLocation === loc.id || state.activeStage === 'handel';
      const steps = 38;
      const pts = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        let midLon = (loc.portLon + hamburg.portLon) * 0.5;
        let midLat = (loc.portLat + hamburg.portLat) * 0.5;
        if (loc.id === 'brasilien' || loc.id === 'kolumbien' || loc.id === 'domrep') {
          midLon -= 16;
          midLat += 6;
        } else if (loc.id === 'vietnam' || loc.id === 'indonesien') {
          midLon = 45;
          midLat = 12;
        } else if (loc.id === 'aethiopien') {
          midLon = 20;
          midLat = 30;
        }
        const lon = (1 - t) * (1 - t) * loc.portLon + 2 * (1 - t) * t * midLon + t * t * hamburg.portLon;
        const lat = (1 - t) * (1 - t) * loc.portLat + 2 * (1 - t) * t * midLat + t * t * hamburg.portLat;
        pts.push(project(lon, lat, cx, cy, R));
      }

      ctx.beginPath();
      let m = true;
      pts.forEach(p => {
        if (p.z > 0) {
          if (m) { ctx.moveTo(p.x, p.y); m = false; }
          else ctx.lineTo(p.x, p.y);
        } else m = true;
      });
      ctx.strokeStyle = isSelectedRoute ? loc.color : 'rgba(148, 163, 184, 0.32)';
      ctx.lineWidth = isSelectedRoute ? 2.4 : 1.1;
      ctx.setLineDash(isSelectedRoute ? [] : [3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (isSelectedRoute) {
        const shipIdx = Math.floor(cam.animPhase * steps);
        const sp = pts[shipIdx];
        if (sp && sp.z > 0) {
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = loc.color;
          ctx.stroke();
        }
      }
    });

    ctx.restore(); // End sphere clip

    // Sphere Rim
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Location Pins
    projectedPins = [];
    LOCATIONS.forEach(loc => {
      const p = project(loc.lon, loc.lat, cx, cy, R);
      if (p.z > 0.02) {
        const isAct = state.activeLocation === loc.id;
        const pinR = isAct ? 7.5 : 5.2;
        projectedPins.push({ id: loc.id, x: p.x, y: p.y, r: 15 });

        if (isAct) {
          const pulseR = 9 + Math.sin(cam.animPhase * Math.PI * 2) * 4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = loc.color;
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, pinR, 0, Math.PI * 2);
        ctx.fillStyle = loc.color;
        ctx.fill();
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.font = (isAct ? 'bold ' : '600 ') + '11.5px Inter, sans-serif';
        const label = loc.short;
        const tw = ctx.measureText(label).width;
        const lx = p.x + 10;
        const ly = p.y + 4;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(lx - 3, ly - 11, tw + 6, 15);
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(label, lx, ly);
      }
    });

    ctx.font = '600 11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(226, 232, 240, 0.72)';
    ctx.fillText('Kaffeegürtel (23,5°N–23,5°S) · Ziehen zum Drehen · Mausrad/Buttons zum Zoomen · Standort anklicken', 12, 18);

    ctx.restore();
    requestAnimationFrame(drawGlobe);
  }

  canvas.addEventListener('pointerdown', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (const pin of projectedPins) {
      const dx = mx - pin.x;
      const dy = my - pin.y;
      if (dx * dx + dy * dy <= pin.r * pin.r) {
        window.selectLocation(pin.id);
        return;
      }
    }

    stopTour();
    cam.dragging = true;
    cam.lastX = e.clientX;
    cam.lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener('pointermove', e => {
    if (!cam.dragging) return;
    const dx = e.clientX - cam.lastX;
    const dy = e.clientY - cam.lastY;
    cam.lastX = e.clientX;
    cam.lastY = e.clientY;
    cam.lon -= dx * (0.35 / cam.zoom);
    cam.lat = Math.max(-70, Math.min(70, cam.lat + dy * (0.35 / cam.zoom)));
    cam.targetLon = cam.lon;
    cam.targetLat = cam.lat;
  });

  canvas.addEventListener('pointerup', () => { cam.dragging = false; });
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    window.adjustZoom(e.deltaY < 0 ? 1.12 : 0.89);
  }, { passive: false });

  requestAnimationFrame(drawGlobe);
}

document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  initGlobe();
});
