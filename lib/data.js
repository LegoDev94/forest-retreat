// Cottage data — i18n-aware text fields use {ru, lv, en} objects.
// Resolve via pick(obj, locale) from src/i18n.jsx.

const L = (ru, lv, en) => ({ ru, lv, en });

export const COTTAGES = [
  {
    id: 'dragon',
    folder: 'dragon-house',
    rating: 9.3,
    reviewsCount: 170,
    pricePerNight: 145,
    sleeps: 4,
    bedrooms: 1,
    area: 35,
    nearby: { deer: 4, fishing: 1, lake: 0, sauna: 2 },
    name: L('Dragon House на дереве', 'Pūķu māja kokā', 'Dragon Tree House'),
    tagline: L('Дом-сказка на дереве', 'Pasaku māja kokā', 'A fairytale tree house'),
    type: L('Дом на дереве', 'Māja kokā', 'Tree house'),
    badge: L('Хит сезона', 'Sezonas hīts', 'Season hit'),
    ratingLabel: L('Превосходно', 'Izcili', 'Excellent'),
    shortDescription: L(
      'Уникальный домик-дракон на дереве с джакузи, сауной и кинопроектором. Вид на озеро и лес — атмосфера, которую невозможно забыть.',
      'Unikāla pūķa mājiņa kokā ar burbuļvannu, pirti un projektoru. Skats uz ezeru un mežu — neaizmirstama atmosfēra.',
      'A unique dragon tree house with a jacuzzi, sauna, and projector. Lake and forest views — an unforgettable atmosphere.'
    ),
    description: L(
      'Dragon House — это атмосферный дом для отпуска в городе Līči, окружённый лесом и стоящий у самой кромки озера. Бесплатные велосипеды, сад, терраса, бесплатный Wi-Fi и круглосуточная стойка регистрации. Из окон открывается потрясающий вид на озеро. Идеально для тех, кто ищет уединение, природу и атмосферу сказки.',
      'Dragon House — atmosfēriska brīvdienu māja Līčos, mežā pie ezera krasta. Bezmaksas velosipēdi, dārzs, terase, bezmaksas Wi-Fi un reģistratūra visu diennakti. No logiem paveras lielisks skats uz ezeru. Ideāli tiem, kas meklē vientulību, dabu un pasakas atmosfēru.',
      'Dragon House is an atmospheric vacation home in Līči, surrounded by forest and standing at the very edge of a lake. Free bikes, a garden, a terrace, free Wi-Fi, and a 24/7 reception. The windows open onto a stunning lake view. Perfect for those seeking solitude, nature, and a fairytale atmosphere.'
    ),
    photos: [
      '268163332.jpg','268163334.jpg','270691627.jpg','270691664.jpg','270691675.jpg',
      '332274112.jpg','332274113.jpg','332274114.jpg','332274117.jpg','332274119.jpg',
      '332274120.jpg','332274122.jpg','332274126.jpg','332274128.jpg','332274130.jpg',
      '332274131.jpg','332274132.jpg','351646563.jpg','351646591.jpg','385427896.jpg',
      '442574593.jpg','442574625.jpg','442574640.jpg','442574645.jpg','486818329.jpg',
      '486818375.jpg','486818450.jpg'
    ],
    amenities: [
      {icon: 'wifi',     key: 'Бесплатный Wi-Fi'},
      {icon: 'parking',  key: 'Бесплатная парковка'},
      {icon: 'jacuzzi',  key: 'Гидромассажная ванна'},
      {icon: 'sauna',    key: 'Сауна'},
      {icon: 'cinema',   key: 'Кинопроектор Netflix'},
      {icon: 'pet',      key: 'Можно с питомцами'},
      {icon: 'kitchen',  key: 'Полная мини-кухня'},
      {icon: 'ac',       key: 'Кондиционер'},
      {icon: 'lake',     key: 'Вид на озеро'},
      {icon: 'fishing',  key: 'Рыбалка'},
      {icon: 'bbq',      key: 'Барбекю-зона'},
      {icon: 'bike',     key: 'Бесплатные велосипеды'},
      {icon: 'transfer', key: 'Трансфер от/до аэропорта'},
      {icon: 'family',   key: 'Семейные номера'}
    ],
    categories: {
      'Персонал': 9.1, 'Удобства': 9.2, 'Чистота': 9.6,
      'Комфорт': 9.0, 'Цена/качество': 9.2, 'Расположение': 9.4
    },
    reviews: [
      {name: 'Diana', country: L('Латвия','Latvija','Latvia'), date: '14.10.2025', score: 10,
       title: L('Идеальное место для уединения с природой','Ideāla vieta vienatnei ar dabu','A perfect place for solitude in nature'),
       text: L(
         'Невероятно атмосферное место. Очень уютный домик на берегу озера, окутан лесом. Особенно здорово, что выходя на террасу — видишь кроликов, которые бегают прямо вокруг домика. Замечательные хозяева!',
         'Neticami atmosfēriska vieta. Ļoti mājīga mājiņa ezera krastā, meža ielokā. Īpaši forši, ka iznākot uz terases — redzi trušus, kas skraida tieši ap mājiņu. Brīnišķīgi saimnieki!',
         'Incredibly atmospheric place. A very cozy cabin on the lake shore, surrounded by forest. Especially nice — stepping out on the terrace you see rabbits running around the cabin. Wonderful hosts!')},
      {name: 'Снежана', country: L('Латвия','Latvija','Latvia'), date: '24.04.2025', score: 10,
       title: L('Шикарное место для отдыха душой и телом','Lieliska vieta atpūtai dvēselei un ķermenim','A gorgeous place to rest body and soul'),
       text: L(
         'Шикарное место для отдыха душой и телом, с детьми и без! Домики у самого озера, всё необходимое для проживания есть. В озере можно купаться и ловить рыбу. Есть баня и кубл. Для детей — детская площадка и домашняя живность, которую можно покормить яблоками и морковкой.',
         'Lieliska vieta atpūtai dvēselei un ķermenim, ar bērniem un bez! Mājiņas tieši pie ezera, viss nepieciešamais ir. Ezerā var peldēties un makšķerēt. Ir pirts un kubuls. Bērniem — rotaļu laukums un mājdzīvnieki, kurus var pabarot ar āboliem un burkāniem.',
         'Stunning place to rest body and soul, with kids or without! Cabins right by the lake, everything needed is provided. You can swim and fish in the lake. There is a sauna and a hot tub. For kids — a playground and farm animals you can feed apples and carrots to.')},
      {name: 'Hanna', country: L('Украина','Ukraina','Ukraine'), date: '13.06.2024', score: 9.0,
       title: L('Место и домик — любовь','Vieta un mājiņa — mīlestība','The place and the cabin — pure love'),
       text: L(
         'Тихое место, уединение с природой. Есть всё, что нужно: мангал, качели, лодка. Бегают кролики, птички стучат в окно. Внутри дом тоже очень атмосферный. Мы остались довольны!',
         'Klusa vieta, vienatne ar dabu. Ir viss nepieciešamais: grils, šūpoles, laiva. Skraida truši, putniņi klauvē pie loga. Iekšā mājiņa arī ļoti atmosfēriska. Mēs palikām apmierināti!',
         'A quiet spot, alone with nature. Everything you need: BBQ, swing, boat. Rabbits run around, birds tap on the window. Inside the house is just as atmospheric. We were thrilled!')},
      {name: 'Alise', country: L('Латвия','Latvija','Latvia'), date: '12.01.2026', score: 10,
       title: L('Прекрасный дом в чудесном месте','Skaista māja brīnišķīgā vietā','A beautiful house in a wonderful location'),
       text: L(
         'Очень уютное и уникальное место. Тихое расположение, ощущение, будто ты в глуши — идеально, чтобы сбежать от городского шума. Удобная кровать, приватность, отличный душ, красивый вид и проектор с Netflix.',
         'Ļoti mājīga un unikāla vieta. Klusa atrašanās vieta — sajūta, ka esi pasaules malā, ideāli, lai aizbēgtu no pilsētas trokšņiem. Ērta gulēšana, privātums, izcila duša, skaists skats un projektors ar Netflix.',
         'A very cozy and unique place. Quiet location, it feels like you are in the middle of nowhere — perfect for getting away from city noises. Comfy place to sleep, privacy, great shower, beautiful view, and a projector with Netflix.')},
      {name: 'Ērika', country: L('Великобритания','Lielbritānija','United Kingdom'), date: '12.07.2023', score: 10,
       title: L('Радушно, уютно, красиво','Sirsnīgi, mājīgi, skaisti','Welcoming, cozy, beautiful'),
       text: L(
         'Понравилось абсолютно всё! Грамотно составлена инструкция по заселению. Потрясающая природа, благоустроенная территория. Есть всё для отдыха и даже немного больше — мини-зоопарк, детская площадка, лес, лодки, SUP, места для шашлыков.',
         'Patika pilnīgi viss! Pārdomāta uzņemšanas instrukcija. Pārsteidzoša daba, sakopta teritorija. Ir viss atpūtai un pat mazliet vairāk — mini zoodārzs, rotaļu laukums, mežs, laivas, SUP, vietas šašlikam.',
         'Loved absolutely everything! Smart check-in instructions. Stunning nature, well-kept grounds. Everything you need for a holiday and then some — mini zoo, playground, forest, boats, SUPs, BBQ spots.')},
      {name: 'Spencer', country: L('Великобритания','Lielbritānija','United Kingdom'), date: '17.08.2025', score: 8.0,
       title: L('Спокойно и безмятежно','Mierīgi un rāmi','Peaceful and serene'),
       text: L(
         'Очень спокойно и безмятежно. Красивые виды и отличная инфраструктура снаружи. Мы чувствовали себя совершенно одни — идеальный побег из города на природу.',
         'Ļoti mierīgi un rāmi. Skaisti skati un lieliska āra infrastruktūra. Jutāmies pilnīgi vieni — ideāls bēgums no pilsētas dabā.',
         'Very peaceful and serene. Beautiful views and great outdoor facilities. We felt completely alone — a perfect getaway from the city to nature.')}
    ]
  },
  {
    id: 'viking',
    folder: 'viking-house',
    rating: 9.0,
    reviewsCount: 137,
    pricePerNight: 135,
    sleeps: 4,
    bedrooms: 1,
    area: 35,
    nearby: { deer: 5, fishing: 2, lake: 1, sauna: 1 },
    name: L('Viking House на дереве', 'Vikingu māja kokā', 'Viking Tree House'),
    tagline: L('Дом викингов на дереве', 'Vikingu mājiņa kokā', 'Viking-style tree cabin'),
    type: L('Дом на дереве', 'Māja kokā', 'Tree house'),
    badge: L('Романтика', 'Romantika', 'Romantic'),
    ratingLabel: L('Превосходно', 'Izcili', 'Excellent'),
    shortDescription: L(
      'Аутентичный дом в стиле викингов с джакузи и сауной. Большие панорамные окна с видом на озеро и закаты, которые запомнятся надолго.',
      'Autentiska vikingu stila māja ar burbuļvannu un pirti. Lieli panorāmas logi ar skatu uz ezeru un saulrieti, kas paliek atmiņā.',
      'An authentic viking-style cabin with a jacuzzi and sauna. Large panoramic windows facing the lake and unforgettable sunsets.'
    ),
    description: L(
      'Viking House — атмосферный домик на дереве в окружении леса с прекрасным видом на озеро. В озере много рыбы — карп, линь, щука, карась. Есть отопление, кондиционер, бесплатный Wi-Fi и собственный балкон со столиком. Идеально для романтического отдыха или семейного уикенда.',
      'Viking House — atmosfēriska mājiņa kokā meža ielokā ar lielisku skatu uz ezeru. Ezerā ir daudz zivju — karpa, līnis, līdaka, karūsa. Apkure, kondicionieris, bezmaksas Wi-Fi un savs balkons ar galdiņu. Ideāli romantiskai atpūtai vai ģimenes nedēļas nogalei.',
      'Viking House is an atmospheric tree cabin nestled in the forest with a beautiful lake view. The lake holds plenty of fish — carp, tench, pike, crucian. Heating, AC, free Wi-Fi, and a private balcony with a table. Perfect for a romantic retreat or family weekend.'
    ),
    photos: [
      '266611698.jpg','266611731.jpg','266611735.jpg','266611745.jpg','266611769.jpg',
      '266611782.jpg','266611790.jpg','266611796.jpg','268163533.jpg','270691697.jpg',
      '273165701.jpg','273165738.jpg','273165760.jpg','273165819.jpg','273165840.jpg',
      '273165912.jpg','273165940.jpg','273166004.jpg','273166018.jpg','273166058.jpg',
      '273434645.jpg','332276396.jpg','332276399.jpg','351646683.jpg','378550907.jpg',
      '385425432.jpg','385425678.jpg','385425808.jpg','385426519.jpg','442574068.jpg',
      '486815050.jpg','486815107.jpg'
    ],
    amenities: [
      {icon: 'wifi',     key: 'Бесплатный Wi-Fi'},
      {icon: 'parking',  key: 'Бесплатная парковка'},
      {icon: 'jacuzzi',  key: 'Гидромассажная ванна'},
      {icon: 'sauna',    key: 'Сауна'},
      {icon: 'pet',      key: 'Можно с питомцами'},
      {icon: 'kitchen',  key: 'Полная мини-кухня'},
      {icon: 'ac',       key: 'Кондиционер'},
      {icon: 'balcony',  key: 'Балкон с видом'},
      {icon: 'lake',     key: 'Вид на озеро'},
      {icon: 'fishing',  key: 'Рыбалка'},
      {icon: 'bbq',      key: 'Барбекю-зона'},
      {icon: 'transfer', key: 'Трансфер от/до аэропорта'},
      {icon: 'family',   key: 'Семейные номера'},
      {icon: 'fire',     key: 'Отопление'}
    ],
    categories: {
      'Персонал': 9.0, 'Удобства': 9.0, 'Чистота': 9.0,
      'Комфорт': 9.1, 'Цена/качество': 8.9, 'Расположение': 9.2
    },
    reviews: [
      {name: 'Arina', country: L('Латвия','Latvija','Latvia'), date: '08.07.2023', score: 10,
       title: L('Я в восторге','Esmu sajūsmā','I am thrilled'),
       text: L(
         'Если ищете место с городской роскошью — это место не для вас, и в этом его плюс. Я чётко знала чего хочу, и это было именно то место. Вся прелесть в приватности, отдалённости от городской суеты, тишине. Полный набор удобств. Обалденная природа.',
         'Ja meklē vietu ar pilsētas greznību — šī vieta nav priekš tevis, un tas ir tās pluss. Es skaidri zināju, ko gribu, un tā bija tieši šī vieta. Visa burvība — privātums, attālums no pilsētas burzmas, klusums. Pilns ērtību komplekts. Apbrīnojama daba.',
         'If you are looking for urban luxury — this is not the place, and that is its strength. I knew exactly what I wanted, and this was it. The magic is in the privacy, the distance from city noise, the silence. All the amenities you need. Stunning nature.')},
      {name: 'Ilze', country: L('Латвия','Latvija','Latvia'), date: '13.06.2025', score: 10,
       title: L('Лучшее приключение','Labākais piedzīvojums','The best adventure ever'),
       text: L(
         'Это было абсолютно идеально, дети были в восторге. Наши малыши (3 и 5 лет) очень расстроились, что нужно уезжать. По словам моего пятилетки, это было «Лучшее приключение в нашей жизни!»',
         'Tas bija pilnīgi ideāli, bērniem ļoti patika. Mūsu mazie (3 un 5 gadi) bija ļoti apbēdināti, ka jābrauc prom. Pēc mana 5-gadnieka vārdiem, tas bija «Labākais piedzīvojums, kāds mums jelkad bijis!»',
         'It was absolutely perfect, kids enjoyed it a lot. Our little ones (3 and 5) were really upset that we had to leave. It has been "The best adventure we have ever had!" according to my 5yo.')},
      {name: 'Anzelika', country: L('Латвия','Latvija','Latvia'), date: '19.04.2025', score: 10,
       title: L('Отличное место для релакса','Lieliska vieta relaksācijai','Excellent spot to unwind'),
       text: L(
         'Спокойствие, природа, уют. Мы смогли отдохнуть от городской суеты. Спасибо вам. Желаем удачи и процветания. Сможем — вернёмся.',
         'Miers, daba, mājīgums. Mēs varējām atpūsties no pilsētas burzmas. Paldies jums. Vēlam veiksmi un labklājību. Ja varēsim — atgriezīsimies.',
         'Calm, nature, comfort. We managed to escape city bustle. Thank you. We wish you success and prosperity. If we can — we will be back.')},
      {name: 'Ksenija', country: L('Латвия','Latvija','Latvia'), date: '02.03.2025', score: 9.0,
       title: L('Очень романтично-аутентичное местечко','Ļoti romantiska un autentiska vietiņa','A very romantic, authentic spot'),
       text: L(
         'Мы были с детками, нам очень понравилось. И на лодке покататься, и зверюшек покормить.',
         'Bijām ar bērniem, ļoti patika. Gan laivā pabraukāt, gan dzīvniekus pabarot.',
         'We came with kids and loved it — both the boat ride and feeding the animals.')},
      {name: 'Vineta', country: L('Латвия','Latvija','Latvia'), date: '02.11.2023', score: 10,
       title: L('Прекрасное место для отдыха на природе','Brīnišķīga vieta atpūtai dabā','A wonderful place to rest in nature'),
       text: L(
         'Рыбалка на лодке, стрельба из пневматической винтовки, баня, кубла, барбекю — всё есть для прекрасного времяпровождения. Очень уютный, тёплый и продуманный до мелочей домик. 10/10.',
         'Makšķerēšana no laivas, šaušana ar pneimatisko šauteni, pirts, kubli, grils — viss ir lieliskai laika pavadīšanai. Ļoti mājīga, silta un līdz sīkumiem pārdomāta mājiņa. 10/10.',
         'Boat fishing, air rifle shooting, sauna, hot tubs, BBQ — everything for a great time. A very cozy, warm cabin thought through to the smallest detail. 10/10.')},
      {name: 'Romans', country: L('Латвия','Latvija','Latvia'), date: '04.05.2024', score: 9.0,
       title: L('Уютное и атмосферное место','Mājīga un atmosfēriska vieta','Cozy and atmospheric place'),
       text: L(
         'Компактный уединённый домик, очень атмосферное место на природе. Понравился охотничий декор и большие окна, отличный вид на озеро и лес, особенно красиво на закате.',
         'Kompakta, vientuļa mājiņa, ļoti atmosfēriska vieta dabā. Patika medību dekors un lielie logi, lielisks skats uz ezeru un mežu, īpaši skaisti saulrieta laikā.',
         'Compact, secluded cabin, very atmospheric spot in nature. Loved the hunting decor and large windows, great view of the lake and forest, especially beautiful at sunset.')}
    ]
  },
  {
    id: 'farm',
    folder: 'farm-lodge',
    rating: 9.1,
    reviewsCount: 120,
    pricePerNight: 125,
    sleeps: 4,
    bedrooms: 1,
    area: 30,
    nearby: { deer: 3, fishing: 4, lake: 3, sauna: 0 },
    name: L('Private Farm Lodge', 'Privātā saimniecība', 'Private Farm Lodge'),
    tagline: L('Частная ферма с альпаками', 'Privāta ferma ar alpakām', 'Private farm with alpacas'),
    type: L('Лодж на ферме', 'Lauku mājiņa', 'Farm lodge'),
    badge: L('С животными', 'Ar dzīvniekiem', 'With animals'),
    ratingLabel: L('Превосходно', 'Izcili', 'Excellent'),
    shortDescription: L(
      'Уютный лодж в самом сердце леса с собственной мини-фермой: альпаки, пони, овцы, кролики. Идеально для детей и романтического отдыха.',
      'Mājīga mājiņa meža sirdī ar savu mini fermu: alpakas, poniji, aitas, truši. Ideāli bērniem un romantiskai atpūtai.',
      'A cozy lodge in the heart of the forest with its own mini-farm: alpacas, ponies, sheep, rabbits. Perfect for kids and romantic stays.'
    ),
    description: L(
      'Private Farm Lodge — лодж в окружении леса с собственной мини-фермой: альпаки, пони, козы, овцы и милейшие кролики, бегающие свободно. Сауна, гидромассаж, бесплатный трансфер, круглосуточная стойка регистрации, бесплатный Wi-Fi. До озера 3 минуты пешком.',
      'Private Farm Lodge — mājiņa meža ielokā ar savu mini fermu: alpakas, poniji, kazas, aitas un mīļākie truši, kas brīvi skraida pa pagalmu. Pirts, burbuļvanna, bezmaksas transfērs, reģistratūra 24/7, bezmaksas Wi-Fi. Līdz ezeram 3 minūtes ar kājām.',
      'Private Farm Lodge sits among trees with its own mini-farm: alpacas, ponies, goats, sheep, and adorable free-roaming rabbits. Sauna, hot tub, free transfer, 24/7 reception, free Wi-Fi. Lake is a 3-minute walk away.'
    ),
    photos: [
      '302520638.jpg','302520656.jpg','302521612.jpg','316750154.jpg','415434198.jpg',
      '415434269.jpg','415434441.jpg','415434538.jpg','415434556.jpg','416618718.jpg',
      '442573481.jpg','442573531.jpg','442573535.jpg','466814740.jpg','714629641.jpg',
      '714629769.jpg','714629877.jpg','714630473.jpg','714630671.jpg','714630818.jpg',
      '714631023.jpg','714631224.jpg','714631637.jpg','714631972.jpg','714632199.jpg',
      '714632488.jpg','714632908.jpg','714633147.jpg','714633441.jpg','714633594.jpg'
    ],
    amenities: [
      {icon: 'wifi',     key: 'Бесплатный Wi-Fi'},
      {icon: 'parking',  key: 'Бесплатная парковка'},
      {icon: 'jacuzzi',  key: 'Гидромассажная ванна'},
      {icon: 'sauna',    key: 'Сауна'},
      {icon: 'pet',      key: 'Можно с питомцами'},
      {icon: 'animals',  key: 'Альпаки, пони, кролики'},
      {icon: 'fire',     key: 'Камин'},
      {icon: 'kitchen',  key: 'Кухня с плитой'},
      {icon: 'darts',    key: 'Дартс'},
      {icon: 'fishing',  key: 'Рыбалка'},
      {icon: 'bbq',      key: 'Принадлежности для BBQ'},
      {icon: 'lake',     key: 'Вид на озеро'},
      {icon: 'transfer', key: 'Трансфер от/до аэропорта'},
      {icon: 'family',   key: 'Семейные номера'}
    ],
    categories: {
      'Персонал': 9.1, 'Удобства': 8.9, 'Чистота': 9.1,
      'Комфорт': 9.0, 'Цена/качество': 9.2, 'Расположение': 9.4
    },
    reviews: [
      {name: 'Julija', country: L('Латвия','Latvija','Latvia'), date: '13.04.2025', score: 10,
       title: L('Замечательное ранчо','Brīnišķīgs rančo','Wonderful ranch'),
       text: L(
         'Привезли морковь и яблоки для пони и козочек, они с удовольствием всё съели. Вокруг бегали кролики, козочки и мышки. Печь в доме очень классно обогревает. Хозяин был максимально гостеприимный — выручил, когда захотелось пару баночек пива! От души рекомендуем и обязательно вернёмся.',
         'Atvedām burkānus un ābolus poniju un kazlēnu vajadzībām, viņi ar prieku visu apēda. Visapkārt skraidīja truši, kazlēni un peles. Krāsns mājā lieliski silda. Saimnieks bija maksimāli viesmīlīgs — palīdzēja, kad gribējās pāris bundžiņas alus! No sirds rekomendējam un noteikti atgriezīsimies.',
         'We brought carrots and apples for the ponies and goats, they happily ate everything. Rabbits, goats and mice ran around. The wood stove heats brilliantly. The host was as welcoming as possible — even helped out when we wanted a couple of beers! Heartily recommend, we will definitely come back.')},
      {name: 'Maija', country: L('Латвия','Latvija','Latvia'), date: '25.12.2023', score: 10,
       title: L('Очень уютное и красивое место','Ļoti mājīga un skaista vieta','A very cozy and beautiful place'),
       text: L(
         'Очень уютное и красивое место вдали от городской суеты. Особенно понравились животные — ламы, овечки и пони, а также самые дружелюбные и ласковые собачки. Обязательно вернёмся!',
         'Ļoti mājīga un skaista vieta tālu prom no pilsētas burzmas. Īpaši patika dzīvnieki — lamas, aitiņas un poniji, kā arī draudzīgākie un mīļākie sunīši. Noteikti atgriezīsimies!',
         'A very cozy and beautiful place far from the city hustle. Especially loved the animals — llamas, sheep, ponies — and the friendliest, most affectionate dogs. We will definitely return!')},
      {name: 'Johanna', country: L('Финляндия','Somija','Finland'), date: '11.08.2023', score: 9.0,
       title: L('Место превзошло наши ожидания','Vieta pārspēja mūsu cerības','Property exceeded our expectations'),
       text: L(
         'Отличное общение. Место превзошло наши ожидания! Прикосновение природы, искусства, фермерства и технологий — всё в одном. Бонусом увидели падающие звёзды августовского неба, сидя в горячем джакузи. 11 из 10!',
         'Lieliska saziņa. Vieta pārspēja mūsu cerības! Dabas, mākslas, lauksaimniecības un tehnoloģiju pieskāriens — viss vienā. Kā bonusu mēs redzējām krītošas zvaigznes augusta debesīs, sēžot karstajā burbuļvannā. 11 no 10!',
         'Excellent communication. The property exceeded our expectations! Touch of nature, art, farming and technology — all in one. As a bonus, we got to see shooting stars in August sky while sitting in a hot jacuzzi. 11 out of 10!')},
      {name: 'Ketija', country: L('Латвия','Latvija','Latvia'), date: '25.10.2023', score: 10,
       title: L('Атмосфера была потрясающей','Atmosfēra bija brīnišķīga','Atmosphere was amazing'),
       text: L(
         'Атмосфера и аура в доме были потрясающими. Это напомнило нам поездки в деревенские дома детства. Животные создают особое чувство — ламы и козы появляются во дворе ночью. Больше, чем мы ожидали — дровяная печь, ночное небо, милые щенки.',
         'Mājas atmosfēra un aura bija brīnišķīga. Tā atgādināja bērnības lauku māju apmeklējumus. Dzīvnieki rada īpašu sajūtu — lamas un kazas, kas naktī parādās pagalmā. Vairāk, nekā gaidījām — malkas krāsns, nakts debesis, mīlīgi kucēni.',
         'Atmosphere and aura in the house was amazing. It reminded us of visiting our childhood country houses. Animals gave that special feeling. Llamas, goats appearing in the yard at night. More than we expected — firewood oven, night sky, cute puppies.')},
      {name: 'Anna', country: L('Латвия','Latvija','Latvia'), date: '18.03.2024', score: 9.0,
       title: L('Очень уютно и спокойно','Ļoti mājīgi un mierīgi','Very cozy and peaceful'),
       text: L(
         'Полностью забываешь о жизненной суете. Понравилось гостеприимство хозяина, милые животные и возможность их покормить, виды на лес, сауна, купель, декор в интерьере и экстерьере, удобная кровать, большое окно из спальни.',
         'Pilnīgi aizmirsties par dzīves burzmu. Patika saimnieka viesmīlība, mīļie dzīvnieki un iespēja tos pabarot, skati uz mežu, pirts, kubuls, interjera un eksterjera dekors, ērta gulta, liels logs no guļamistabas.',
         'You completely forget the daily hustle. We loved the host hospitality, the cute animals you can feed, the forest views, sauna, hot tub, the decor inside and out, the comfortable bed, the big bedroom window.')},
      {name: 'Genevieve', country: L('Мальта','Malta','Malta'), date: '27.12.2024', score: 8.0,
       title: L('Чудесные впечатления','Brīnišķīga pieredze','Wonderful experience'),
       text: L(
         'Тихое, красивое место. Уютный, прелестный домик. Чудесные впечатления. Идеально, чтобы сбежать от всех — покой, тишина, милые фермерские животные.',
         'Klusa, skaista vieta. Mīļa, mājīga mājiņa. Brīnišķīga pieredze. Ideāli, lai aizbēgtu no visiem — miers, klusums, mīlīgi fermas dzīvnieki.',
         'Peaceful, beautiful location. Lovely, cosy cabin. Wonderful experience. Perfect for getting away from everyone — peace and quiet, cute farm animals.')}
    ]
  },
  {
    id: 'black',
    folder: 'black-house',
    rating: 8.7,
    reviewsCount: 37,
    pricePerNight: 110,
    sleeps: 4,
    bedrooms: 1,
    area: 27,
    nearby: { deer: 6, fishing: 3, lake: 1, sauna: 3 },
    name: L('Black House в лесу', 'Melnā māja mežā', 'Black House in the Forest'),
    tagline: L('Чёрный дом с домашним кинотеатром', 'Melnā māja ar mājas kinoteātri', 'Black house with home theater'),
    type: L('Шале', 'Šaleja', 'Chalet'),
    badge: L('Арт-интерьер', 'Arta interjers', 'Art interior'),
    ratingLabel: L('Потрясающе', 'Pārsteidzoši', 'Awesome'),
    shortDescription: L(
      'Стильное чёрное шале в лесу с гидромассажной ванной и домашним кинотеатром. Уникальный интерьер, который переносит в другое время.',
      'Stilīga melnā šaleja mežā ar burbuļvannu un mājas kinoteātri. Unikāls interjers, kas pārceļ citā laikmetā.',
      'A stylish black chalet in the forest with a hot tub and home theater. A unique interior that transports you to another time.'
    ),
    description: L(
      'Black House — шале в городе Līči с пасторальным видом на озеро и террасой. На территории есть частная парковка. Гидромассажная ванна, сауна, домашний кинотеатр (проектор) и оригинальный художественный интерьер. Кролики, пони, овечки и барашки прямо на пороге домика.',
      'Black House — šaleja Līčos ar pastorālu skatu uz ezeru un terasi. Teritorijā privāta autostāvvieta. Burbuļvanna, pirts, mājas kinoteātris (projektors) un oriģināls mākslas interjers. Truši, poniji, aitas un jēriņi tieši pie pat sliekšņa.',
      'Black House is a chalet in Līči with a pastoral lake view and a terrace. Private on-site parking. Hot tub, sauna, home theater (projector), and an original artistic interior. Rabbits, ponies, sheep and lambs right at your doorstep.'
    ),
    photos: [
      '593775112.jpg','593775231.jpg','593775262.jpg','593775275.jpg','593775281.jpg',
      '593775295.jpg','593775303.jpg','593775367.jpg','593775384.jpg','593775479.jpg',
      '733988301.jpg','733988342.jpg','733988348.jpg','733988360.jpg','733988378.jpg',
      '733988384.jpg','733988388.jpg','802490465.jpg','802490542.jpg'
    ],
    amenities: [
      {icon: 'parking',  key: 'Бесплатная парковка'},
      {icon: 'jacuzzi',  key: 'Гидромассажная ванна'},
      {icon: 'sauna',    key: 'Сауна'},
      {icon: 'cinema',   key: 'Домашний кинотеатр'},
      {icon: 'pet',      key: 'Можно с питомцами'},
      {icon: 'fire',     key: 'Камин'},
      {icon: 'kitchen',  key: 'Мини-кухня'},
      {icon: 'lake',     key: 'Вид на озеро'},
      {icon: 'bbq',      key: 'Барбекю'},
      {icon: 'animals',  key: 'Кролики, пони'},
      {icon: 'sofa',     key: 'Уютная гостиная'},
      {icon: 'family',   key: 'Для семьи / пары'}
    ],
    categories: {
      'Персонал': 9.3, 'Удобства': 8.8, 'Чистота': 8.9,
      'Комфорт': 8.4, 'Цена/качество': 8.6, 'Расположение': 9.1
    },
    reviews: [
      {name: 'Čivčiša', country: L('Латвия','Latvija','Latvia'), date: '25.06.2025', score: 10,
       title: L('Великолепно','Lieliski','Magnificent'),
       text: L(
         'Очень понравилось, хозяин отзывчивый, компанейский, весёлый. Каждый день рядом бегают кролики — большие, толстенькие, берите морковку, их можно кормить с рук. В 100 метрах есть пони, дают гладиться. Пиво домашнее вкусно. Кубла — обязательно: вид с неё отличный, на пруд, расслабляет шикарно.',
         'Ļoti patika, saimnieks atsaucīgs, kompānijas cilvēks, jautrs. Katru dienu blakus skraida truši — lieli, druknīši, ņem burkānu, viņus var pabarot no rokas. 100 metru attālumā ir poniji, ļaujas glāstīt. Mājas alus garšīgs. Kubuls — obligāti: skats no tā lielisks, uz dīķi, lieliski atslābina.',
         'Loved it. The host is responsive, sociable, fun. Rabbits — big and chubby — run by every day; bring carrots, you can feed them by hand. There are ponies 100 meters away, they let you pet them. The homemade beer is delicious. The hot tub is a must — the view from it is incredible, looking out over the pond, brilliantly relaxing.')},
      {name: 'Аlla', country: L('Латвия','Latvija','Latvia'), date: '07.05.2025', score: 10,
       title: L('Замечательное место','Brīnišķīga vieta','Wonderful place'),
       text: L(
         'Это замечательное место для любителей природы и животных. Мы уже второй раз приезжаем сюда, и я уже хочу приехать снова.',
         'Šī ir brīnišķīga vieta dabas un dzīvnieku mīļotājiem. Mēs jau otro reizi atbraucam šeit, un es jau gribu atbraukt vēlreiz.',
         'This is a wonderful place for nature and animal lovers. We have come here a second time, and I already want to come back again.')},
      {name: 'Gutmane', country: L('Латвия','Latvija','Latvia'), date: '09.04.2026', score: 10,
       title: L('Сказочное место','Pasakaina vieta','A fairytale place'),
       text: L(
         'Понравилось абсолютно всё, сказочное место, очень интересный интерьер, чувство, что находишься в другом времени. Рекомендую любому, кто любит природу, историю, интересные места для ночёвки.',
         'Patika pilnīgi viss, pasakaina vieta, ļoti interesants interjers, sajūta, ka esi citā laikmetā. Iesaku ikvienam, kuram patīk daba, vēsture, interesantas vietas naktsmītnei.',
         'Loved absolutely everything — a fairytale place, very interesting interior, the feeling of being in another era. Recommended for anyone who loves nature, history, and unusual places to stay overnight.')},
      {name: 'Julija', country: L('Литва','Lietuva','Lithuania'), date: '18.08.2025', score: 9.0,
       title: L('Прекрасное место для отдыха','Brīnišķīga vieta atpūtai','A wonderful place to relax'),
       text: L(
         'Прекрасное место для отдыха, уединение с природой, зайцы приходят прямо на порог домика!',
         'Brīnišķīga vieta atpūtai, vienatne ar dabu, zaķi nāk tieši pie mājiņas sliekšņa!',
         'Wonderful place to relax, alone with nature, the hares come right to the cabin doorstep!')},
      {name: 'Smirnova', country: L('Латвия','Latvija','Latvia'), date: '10.10.2025', score: 10,
       title: L('Тихая гавань для души','Klusa osta dvēselei','A quiet harbor for the soul'),
       text: L(
         'Всё было прекрасно. Покой, тишина… Не понравилось то, что нужно было ехать домой.',
         'Viss bija lieliski. Miers, klusums… Nepatika tikai tas, ka bija jābrauc mājās.',
         'Everything was wonderful. Peace, silence… The only thing we did not like was having to drive home.')},
      {name: 'Santa', country: L('Латвия','Latvija','Latvia'), date: '12.04.2025', score: 10,
       title: L('Прекрасный отдых с комфортом','Brīnišķīga komforta atpūta','A wonderful, comfortable retreat'),
       text: L(
         'Здесь прекрасно, рекомендую каждому, кто хочет сбежать от суеты — покой, тишина, природа. Прекрасные домики, шикарное джакузи, из которого детей вытащить не могли. Здесь фантастически, спасибо хозяевам!',
         'Šeit ir brīnišķīgi, iesaku katram, kurš grib aizbēgt no burzmas — miers, klusums, daba. Lieliskas mājiņas, izcila burbuļvanna, no kuras bērnus nevarējām izvilkt. Šeit fantastiski, paldies saimniekiem!',
         'It is wonderful here, I recommend it to everyone who wants to escape the bustle — peace, quiet, nature. Beautiful cabins, a fantastic jacuzzi the kids did not want to leave. It is fantastic, thanks to the hosts!')}
    ]
  }
];

export const STATS = (() => {
  const totalReviews = COTTAGES.reduce((s, c) => s + c.reviewsCount, 0);
  const avgRating = (COTTAGES.reduce((s, c) => s + c.rating * c.reviewsCount, 0) / totalReviews).toFixed(1);
  return { totalReviews, avgRating, totalCottages: COTTAGES.length };
})();

export function photoUrl(cottage, filename) {
  return `/content/${cottage.folder}/photo/${filename}`;
}

export function findCottage(id) {
  return COTTAGES.find(c => c.id === id);
}
