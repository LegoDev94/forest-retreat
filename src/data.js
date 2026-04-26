// Cottage data — extracted from info.txt files
export const COTTAGES = [
  {
    id: 'dragon',
    name: 'Dragon House in the Tree',
    tagline: 'Дом-сказка на дереве',
    folder: 'dragon-house',
    rating: 9.3,
    reviewsCount: 170,
    ratingLabel: 'Превосходно',
    pricePerNight: 145,
    sleeps: 4,
    bedrooms: 1,
    area: 35,
    type: 'Дом на дереве',
    badge: 'Хит сезона',
    shortDescription: 'Уникальный домик-дракон на дереве с джакузи, сауной и кинопроектором. Вид на озеро и лес — атмосфера, которую невозможно забыть.',
    description: 'Dragon House — это атмосферный дом для отпуска в городе Līči, окружённый лесом и стоящий у самой кромки озера. Бесплатные велосипеды, сад, терраса, бесплатный Wi-Fi и круглосуточная стойка регистрации. Из окон открывается потрясающий вид на озеро. Идеально для тех, кто ищет уединение, природу и атмосферу сказки.',
    photos: [
      '268163332.jpg','268163334.jpg','270691627.jpg','270691664.jpg','270691675.jpg',
      '332274112.jpg','332274113.jpg','332274114.jpg','332274117.jpg','332274119.jpg',
      '332274120.jpg','332274122.jpg','332274126.jpg','332274128.jpg','332274130.jpg',
      '332274131.jpg','332274132.jpg','351646563.jpg','351646591.jpg','385427896.jpg',
      '442574593.jpg','442574625.jpg','442574640.jpg','442574645.jpg','486818329.jpg',
      '486818375.jpg','486818450.jpg'
    ],
    amenities: [
      {icon: 'wifi', label: 'Бесплатный Wi-Fi'},
      {icon: 'parking', label: 'Бесплатная парковка'},
      {icon: 'jacuzzi', label: 'Гидромассажная ванна'},
      {icon: 'sauna', label: 'Сауна'},
      {icon: 'cinema', label: 'Кинопроектор Netflix'},
      {icon: 'pet', label: 'Можно с питомцами'},
      {icon: 'kitchen', label: 'Полная мини-кухня'},
      {icon: 'ac', label: 'Кондиционер'},
      {icon: 'lake', label: 'Вид на озеро'},
      {icon: 'fishing', label: 'Рыбалка'},
      {icon: 'bbq', label: 'Барбекю-зона'},
      {icon: 'bike', label: 'Бесплатные велосипеды'},
      {icon: 'transfer', label: 'Трансфер от/до аэропорта'},
      {icon: 'family', label: 'Семейные номера'}
    ],
    categories: {
      'Персонал': 9.1, 'Удобства': 9.2, 'Чистота': 9.6,
      'Комфорт': 9.0, 'Цена/качество': 9.2, 'Расположение': 9.4
    },
    reviews: [
      {name: 'Diana', country: 'Латвия', date: '14.10.2025', score: 10, title: 'Идеальное место для уединения с природой',
       text: 'Невероятно атмосферное место. Очень уютный домик на берегу озера, окутан лесом. Особенно здорово, что выходя на террасу — видишь кроликов, которые бегают прямо вокруг домика. Замечательные хозяева!'},
      {name: 'Снежана', country: 'Латвия', date: '24.04.2025', score: 10, title: 'Шикарное место для отдыха душой и телом',
       text: 'Шикарное место для отдыха душой и телом, с детьми и без! Домики у самого озера, всё необходимое для проживания есть. В озере можно купаться и ловить рыбу. Есть баня и кубл. Для детей — детская площадка и домашняя живность, которую можно покормить яблоками и морковкой.'},
      {name: 'Hanna', country: 'Украина', date: '13.06.2024', score: 9.0, title: 'Место и домик — любовь',
       text: 'Тихое место, уединение с природой. Есть всё, что нужно: мангал, качели, лодка. Бегают кролики, птички стучат в окно. Внутри дом тоже очень атмосферный. Мы остались довольны!'},
      {name: 'Alise', country: 'Латвия', date: '12.01.2026', score: 10, title: 'A beautiful house in a wonderful location',
       text: 'A very cozy and unique place. Quiet location, it feels like you are in the middle of nowhere — perfect for getting away from city noises. Comfy place to sleep, privacy, great shower, beautiful view, and a projector with Netflix.'},
      {name: 'Ērika', country: 'Великобритания', date: '12.07.2023', score: 10, title: 'Радушно, уютно, красиво',
       text: 'Понравилось абсолютно всё! Грамотно составлена инструкция по заселению. Потрясающая природа, благоустроенная территория. Есть всё для отдыха и даже немного больше — мини-зоопарк, детская площадка, лес, лодки, SUP, места для шашлыков.'},
      {name: 'Spencer', country: 'Великобритания', date: '17.08.2025', score: 8.0, title: 'Peaceful and serene',
       text: 'Very peaceful and serene. Beautiful views and great outdoor facilities. We felt completely alone — a perfect getaway from the city to nature.'}
    ]
  },
  {
    id: 'viking',
    name: 'Viking House in the Tree',
    tagline: 'Дом викингов на дереве',
    folder: 'viking-house',
    rating: 9.0,
    reviewsCount: 137,
    ratingLabel: 'Превосходно',
    pricePerNight: 135,
    sleeps: 4,
    bedrooms: 1,
    area: 35,
    type: 'Дом на дереве',
    badge: 'Романтика',
    shortDescription: 'Аутентичный дом в стиле викингов с джакузи и сауной. Большие панорамные окна с видом на озеро и закаты, которые запомнятся надолго.',
    description: 'Viking House — атмосферный домик на дереве в окружении леса с прекрасным видом на озеро. В озере много рыбы — карп, линь, щука, карась. Есть отопление, кондиционер, бесплатный Wi-Fi и собственный балкон со столиком. Идеально для романтического отдыха или семейного уикенда.',
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
      {icon: 'wifi', label: 'Бесплатный Wi-Fi'},
      {icon: 'parking', label: 'Бесплатная парковка'},
      {icon: 'jacuzzi', label: 'Гидромассажная ванна'},
      {icon: 'sauna', label: 'Сауна'},
      {icon: 'pet', label: 'Можно с питомцами'},
      {icon: 'kitchen', label: 'Полная мини-кухня'},
      {icon: 'ac', label: 'Кондиционер'},
      {icon: 'balcony', label: 'Балкон с видом'},
      {icon: 'lake', label: 'Вид на озеро'},
      {icon: 'fishing', label: 'Рыбалка'},
      {icon: 'bbq', label: 'Барбекю-зона'},
      {icon: 'transfer', label: 'Трансфер от/до аэропорта'},
      {icon: 'family', label: 'Семейные номера'},
      {icon: 'fire', label: 'Отопление'}
    ],
    categories: {
      'Персонал': 9.0, 'Удобства': 9.0, 'Чистота': 9.0,
      'Комфорт': 9.1, 'Цена/качество': 8.9, 'Расположение': 9.2
    },
    reviews: [
      {name: 'Arina', country: 'Латвия', date: '08.07.2023', score: 10, title: 'Я в восторге',
       text: 'Если ищете место с городской роскошью — это место не для вас, и в этом его плюс. Я чётко знала чего хочу, и это было именно то место. Вся прелесть в приватности, отдалённости от городской суеты, тишине. Полный набор удобств. Обалденная природа.'},
      {name: 'Ilze', country: 'Латвия', date: '13.06.2025', score: 10, title: 'The best adventure ever',
       text: 'It was absolutely perfect, kids enjoyed it a lot. Our little ones (3 and 5) were really upset that we had to leave. It has been "The best adventure we have ever had!" according to my 5yo.'},
      {name: 'Anzelika', country: 'Латвия', date: '19.04.2025', score: 10, title: 'Отличное место для релакса',
       text: 'Спокойствие, природа, уют. Мы смогли отдохнуть от городской суеты. Спасибо вам. Желаем удачи и процветания. Сможем — вернёмся.'},
      {name: 'Ksenija', country: 'Латвия', date: '02.03.2025', score: 9.0, title: 'Очень романтично-аутентичное местечко',
       text: 'Мы были с детками, нам очень понравилось. И на лодке покататься, и зверюшек покормить.'},
      {name: 'Vineta', country: 'Латвия', date: '02.11.2023', score: 10, title: 'Прекрасное место для отдыха на природе',
       text: 'Рыбалка на лодке, стрельба из пневматической винтовки, баня, кубла, барбекю — всё есть для прекрасного времяпровождения. Очень уютный, тёплый и продуманный до мелочей домик. 10/10.'},
      {name: 'Romans', country: 'Латвия', date: '04.05.2024', score: 9.0, title: 'Уютное и атмосферное место',
       text: 'Компактный уединённый домик, очень атмосферное место на природе. Понравился охотничий декор и большие окна, отличный вид на озеро и лес, особенно красиво на закате.'}
    ]
  },
  {
    id: 'farm',
    name: 'Private Farm Lodge',
    tagline: 'Частная ферма с альпаками',
    folder: 'farm-lodge',
    rating: 9.1,
    reviewsCount: 120,
    ratingLabel: 'Превосходно',
    pricePerNight: 125,
    sleeps: 4,
    bedrooms: 1,
    area: 30,
    type: 'Лодж на ферме',
    badge: 'С животными',
    shortDescription: 'Уютный лодж в самом сердце леса с собственной мини-фермой: альпаки, пони, овцы, кролики. Идеально для детей и романтического отдыха.',
    description: 'Private Farm Lodge — лодж в окружении леса с собственной мини-фермой: альпаки, пони, козы, овцы и милейшие кролики, бегающие свободно. Сауна, гидромассаж, бесплатный трансфер, круглосуточная стойка регистрации, бесплатный Wi-Fi. До озера 3 минуты пешком.',
    photos: [
      '302520638.jpg','302520656.jpg','302521612.jpg','316750154.jpg','415434198.jpg',
      '415434269.jpg','415434441.jpg','415434538.jpg','415434556.jpg','416618718.jpg',
      '442573481.jpg','442573531.jpg','442573535.jpg','466814740.jpg','714629641.jpg',
      '714629769.jpg','714629877.jpg','714630473.jpg','714630671.jpg','714630818.jpg',
      '714631023.jpg','714631224.jpg','714631637.jpg','714631972.jpg','714632199.jpg',
      '714632488.jpg','714632908.jpg','714633147.jpg','714633441.jpg','714633594.jpg'
    ],
    amenities: [
      {icon: 'wifi', label: 'Бесплатный Wi-Fi'},
      {icon: 'parking', label: 'Бесплатная парковка'},
      {icon: 'jacuzzi', label: 'Гидромассажная ванна'},
      {icon: 'sauna', label: 'Сауна'},
      {icon: 'pet', label: 'Можно с питомцами'},
      {icon: 'animals', label: 'Альпаки, пони, кролики'},
      {icon: 'fire', label: 'Камин'},
      {icon: 'kitchen', label: 'Кухня с плитой'},
      {icon: 'darts', label: 'Дартс'},
      {icon: 'fishing', label: 'Рыбалка'},
      {icon: 'bbq', label: 'Принадлежности для BBQ'},
      {icon: 'lake', label: 'Вид на озеро'},
      {icon: 'transfer', label: 'Трансфер от/до аэропорта'},
      {icon: 'family', label: 'Семейные номера'}
    ],
    categories: {
      'Персонал': 9.1, 'Удобства': 8.9, 'Чистота': 9.1,
      'Комфорт': 9.0, 'Цена/качество': 9.2, 'Расположение': 9.4
    },
    reviews: [
      {name: 'Julija', country: 'Латвия', date: '13.04.2025', score: 10, title: 'Замечательное ранчо',
       text: 'Привезли морковь и яблоки для пони и козочек, они с удовольствием всё съели. Вокруг бегали кролики, козочки и мышки. Печь в доме очень классно обогревает. Хозяин был максимально гостеприимный — выручил, когда захотелось пару баночек пива! От души рекомендуем и обязательно вернёмся.'},
      {name: 'Maija', country: 'Латвия', date: '25.12.2023', score: 10, title: 'Очень уютное и красивое место',
       text: 'Очень уютное и красивое место вдали от городской суеты. Особенно понравились животные — ламы, овечки и пони, а также самые дружелюбные и ласковые собачки. Обязательно вернёмся!'},
      {name: 'Johanna', country: 'Финляндия', date: '11.08.2023', score: 9.0, title: 'Property exceeded our expectations',
       text: 'Excellent communication. The property exceeded our expectations! Touch of nature, art, farming and technology — all in one. As a bonus, we got to see shooting stars in August sky while sitting in a hot jacuzzi. 11 out of 10!'},
      {name: 'Ketija', country: 'Латвия', date: '25.10.2023', score: 10, title: 'Atmosphere was amazing',
       text: 'Atmosphere and aura in the house was amazing. It reminded us of visiting our childhood country houses. Animals gave that special feeling. Lamas, goats appearing in the yard at night. More than we expected — firewood oven, night sky, cute puppies.'},
      {name: 'Anna', country: 'Латвия', date: '18.03.2024', score: 9.0, title: 'Очень уютно и спокойно',
       text: 'Полностью забываешь о жизненной суете. Понравилось гостеприимство хозяина, милые животные и возможность их покормить, виды на лес, сауна, купель, декор в интерьере и экстерьере, удобная кровать, большое окно из спальни.'},
      {name: 'Genevieve', country: 'Мальта', date: '27.12.2024', score: 8.0, title: 'Wonderful experience',
       text: 'Peaceful, beautiful location. Lovely, cosy cabin. Wonderful experience. Perfect for getting away from everyone — peace and quiet, cute farm animals.'}
    ]
  },
  {
    id: 'black',
    name: 'Black House in the Forest',
    tagline: 'Чёрный дом с домашним кинотеатром',
    folder: 'black-house',
    rating: 8.7,
    reviewsCount: 37,
    ratingLabel: 'Потрясающе',
    pricePerNight: 110,
    sleeps: 4,
    bedrooms: 1,
    area: 27,
    type: 'Шале',
    badge: 'Арт-интерьер',
    shortDescription: 'Стильное чёрное шале в лесу с гидромассажной ванной и домашним кинотеатром. Уникальный интерьер, который переносит в другое время.',
    description: 'Black House — шале в городе Līči с пасторальным видом на озеро и террасой. На территории есть частная парковка. Гидромассажная ванна, сауна, домашний кинотеатр (проектор) и оригинальный художественный интерьер. Кролики, пони, овечки и барашки прямо на пороге домика.',
    photos: [
      '593775112.jpg','593775231.jpg','593775262.jpg','593775275.jpg','593775281.jpg',
      '593775295.jpg','593775303.jpg','593775367.jpg','593775384.jpg','593775479.jpg',
      '733988301.jpg','733988342.jpg','733988348.jpg','733988360.jpg','733988378.jpg',
      '733988384.jpg','733988388.jpg','802490465.jpg','802490542.jpg'
    ],
    amenities: [
      {icon: 'parking', label: 'Бесплатная парковка'},
      {icon: 'jacuzzi', label: 'Гидромассажная ванна'},
      {icon: 'sauna', label: 'Сауна'},
      {icon: 'cinema', label: 'Домашний кинотеатр'},
      {icon: 'pet', label: 'Можно с питомцами'},
      {icon: 'fire', label: 'Камин'},
      {icon: 'kitchen', label: 'Мини-кухня'},
      {icon: 'lake', label: 'Вид на озеро'},
      {icon: 'bbq', label: 'Барбекю'},
      {icon: 'animals', label: 'Кролики, пони'},
      {icon: 'sofa', label: 'Уютная гостиная'},
      {icon: 'family', label: 'Для семьи / пары'}
    ],
    categories: {
      'Персонал': 9.3, 'Удобства': 8.8, 'Чистота': 8.9,
      'Комфорт': 8.4, 'Цена/качество': 8.6, 'Расположение': 9.1
    },
    reviews: [
      {name: 'Čivčiša', country: 'Латвия', date: '25.06.2025', score: 10, title: 'Великолепно',
       text: 'Очень понравилось, хозяин отзывчивый, компанейский, весёлый. Каждый день рядом бегают кролики — большие, толстенькие, берите морковку, их можно кормить с рук. В 100 метрах есть пони, дают гладиться. Пиво домашнее вкусно. Кубла — обязательно: вид с неё отличный, на пруд, расслабляет шикарно.'},
      {name: 'Аlla', country: 'Латвия', date: '07.05.2025', score: 10, title: 'Замечательное место',
       text: 'Это замечательное место для любителей природы и животных. Мы уже второй раз приезжаем сюда, и я уже хочу приехать снова.'},
      {name: 'Gutmane', country: 'Латвия', date: '09.04.2026', score: 10, title: 'Сказочное место',
       text: 'Понравилось абсолютно всё, сказочное место, очень интересный интерьер, чувство, что находишься в другом времени. Рекомендую любому, кто любит природу, историю, интересные места для ночёвки.'},
      {name: 'Julija', country: 'Литва', date: '18.08.2025', score: 9.0, title: 'Прекрасное место для отдыха',
       text: 'Прекрасное место для отдыха, уединение с природой, зайцы приходят прямо на порог домика!'},
      {name: 'Smirnova', country: 'Латвия', date: '10.10.2025', score: 10, title: 'Тихая гавань для души',
       text: 'Всё было прекрасно. Покой, тишина… Не понравилось то, что нужно было ехать домой.'},
      {name: 'Santa', country: 'Латвия', date: '12.04.2025', score: 10, title: 'Прекрасный отдых с комфортом',
       text: 'Здесь прекрасно, рекомендую каждому, кто хочет сбежать от суеты — покой, тишина, природа. Прекрасные домики, шикарное джакузи, из которого детей вытащить не могли. Здесь фантастически, спасибо хозяевам!'}
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
