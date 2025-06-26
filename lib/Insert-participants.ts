import { createServerSupabaseClient } from "./supabase"

interface Participant {
  participant_number: number
  last_name: string
  first_name: string
  middle_name: string | null
  region: string
  position: string
  login: string
  color_group: string
}

// List of participants from the provided data
const participants: Participant[] = [
  // Group 1 (White)
  {
    participant_number: 1,
    last_name: "Бутабаева",
    first_name: "Лаура",
    middle_name: "Аскаровна",
    region: "г. Астана",
    position: "Директор Департамента инклюзивного и специального образования",
    login: "butabaeva_laura",
    color_group: "white",
  },
  {
    participant_number: 2,
    last_name: "Искакова",
    first_name: "Гульнара",
    middle_name: "Кайролловна",
    region: "г. Астана",
    position: "Заместитель директора, Департамент дошкольного образования",
    login: "iskakova_gulnara",
    color_group: "white",
  },
  {
    participant_number: 3,
    last_name: "Бегатаров",
    first_name: "Ардак",
    middle_name: "Курмашевич",
    region: "Костанайская область",
    position: "Заместитель руководителя",
    login: "begatarov_ardak",
    color_group: "white",
  },
  {
    participant_number: 4,
    last_name: "Маралбаева",
    first_name: "Майра",
    middle_name: "Бектемировна",
    region: "г. Астана",
    position: "Зам. директора, Департамент цифровизации и автоматизации государственных услуг",
    login: "maralbaeva_maira",
    color_group: "white",
  },
  {
    participant_number: 5,
    last_name: "Муздыбекова",
    first_name: "Гулсила",
    middle_name: "Орынбековна",
    region: "г. Астана",
    position: "Руководитель управления содержания и методологического обеспечения Комитет среднего образования",
    login: "muzdybekova_gulsila",
    color_group: "white",
  },
  {
    participant_number: 6,
    last_name: "Шаханова",
    first_name: "Бекзада",
    middle_name: "Сейтахметовна",
    region: "г. Астана",
    position: "Руководитель управления стратегического планирования и координации",
    login: "shahanova_bekzada",
    color_group: "white",
  },
  {
    participant_number: 7,
    last_name: "Бекимова",
    first_name: "Кенжегул",
    middle_name: "Тукеновна",
    region: "г. Астана",
    position: "Руководитель, ГУ «Департамент по обеспечению качества в сфере образования»",
    login: "bekimova_kenzhegul",
    color_group: "white",
  },
  {
    participant_number: 8,
    last_name: "Абуов",
    first_name: "Марат",
    middle_name: "Алменович",
    region: "г. Атырау",
    position: "Руководитель, ГУ «Департамент по обеспечению качества в сфере образования»",
    login: "abuov_marat",
    color_group: "white",
  },
  {
    participant_number: 9,
    last_name: "Сафуллин",
    first_name: "Елдос",
    middle_name: "Набиоллиевич",
    region: "г. Уральск",
    position: "Руководитель, ГУ «Управление образования ЗКО»",
    login: "safullin_eldos",
    color_group: "white",
  },
  {
    participant_number: 10,
    last_name: "Масалимова",
    first_name: "Бакытгуль",
    middle_name: "Ешенгазиновна",
    region: "г. Семей",
    position: "Руководитель, ГУ «Департамент по обеспечению качества в сфере образования»",
    login: "masalimova_bakytgul",
    color_group: "white",
  },
  {
    participant_number: 11,
    last_name: "Утепов",
    first_name: "Сарсен",
    middle_name: "Дюсенбаевич",
    region: "ВКО",
    position: "Руководитель ГУ «Отдел образования района Глубокое»",
    login: "utepov_sarsen",
    color_group: "white",
  },
  {
    participant_number: 12,
    last_name: "Нысанбаев",
    first_name: "Мұхит",
    middle_name: "Аманқұлұлы",
    region: "г. Тараз",
    position: "Руководитель Департамента по обеспечению качества в сфере образования",
    login: "nysanbaev_mukhit",
    color_group: "white",
  },
  {
    participant_number: 13,
    last_name: "Айтказина",
    first_name: "Самал",
    middle_name: "Оспановна",
    region: "г. Павлодар",
    position: "Руководитель, ГУ «Управление образования Павлодарской области»",
    login: "aitkazina_samal",
    color_group: "white",
  },
  {
    participant_number: 14,
    last_name: "Сураганова",
    first_name: "Айнагуль",
    middle_name: "Агыбаевна",
    region: "г. Петропавл",
    position: "Руководитель управления, ГУ «Управление образования СКО»",
    login: "suraganova_ainagul",
    color_group: "white",
  },
  {
    participant_number: 15,
    last_name: "Жунусова",
    first_name: "Гулбакыт",
    middle_name: "Серикжановна",
    region: "г. Караганда",
    position: "Руководитель, ГУ «Управление образования Карагандинской области»",
    login: "zhunusova_gulbakyt",
    color_group: "white",
  },
  {
    participant_number: 16,
    last_name: "Балташева",
    first_name: "Айнагуль",
    middle_name: "Кыдырбаевна",
    region: "Акмолинская область",
    position: "Руководитель, ГУ «Управление образования Акмолинской области»",
    login: "baltasheva_ainagul",
    color_group: "white",
  },
  {
    participant_number: 17,
    last_name: "Әліш",
    first_name: "Рыскелді",
    middle_name: "Салхудинұлы",
    region: "г. Шымкент",
    position: "Руководитель, ГУ «Департамент по обеспечению качества в сфере образования»",
    login: "alish_ryskeldi",
    color_group: "white",
  },
  {
    participant_number: 18,
    last_name: "Сулейменов",
    first_name: "Марат",
    middle_name: "Бекбосынович",
    region: "г. Актау",
    position: "Руководитель, ГУ «Департамент по обеспечению качества в сфере образования»",
    login: "suleymenov_marat",
    color_group: "white",
  },
  {
    participant_number: 19,
    last_name: "Мальгаева",
    first_name: "Алёна",
    middle_name: "Сарсенбаевна",
    region: "г. Костанай",
    position: "Руководитель, ГУ «Департамент по обеспечению качества в сфере образования»",
    login: "malgaeva_alena",
    color_group: "white",
  },
  // Participants 55–64
  {
    participant_number: 55,
    last_name: "Такишев",
    first_name: "Дархан",
    middle_name: "Жанболатович",
    region: "Карагандинская область",
    position: "Руководитель ГУ «Отдел образования Нуринского района»",
    login: "takishev_darhan",
    color_group: "green",
  },
  {
    participant_number: 56,
    last_name: "Утесбаева",
    first_name: "Айбаршын",
    middle_name: "Куанышкалиевна",
    region: "г. Актау",
    position: "Руководитель ГУ «Отдел образования по Тупкараганского района»",
    login: "utesbaeva_aibarshyn",
    color_group: "yellow",
  },
  {
    participant_number: 57,
    last_name: "Абилдаева",
    first_name: "Гульназ",
    middle_name: "Сайлауовна",
    region: "г. Шымкент",
    position: "Директор IT-лицея №9 имени О.Жолдасбекова",
    login: "abildaeva_gulnaz",
    color_group: "orange",
  },
  {
    participant_number: 58,
    last_name: "Беков",
    first_name: "Алибек",
    middle_name: "Алимханович",
    region: "Шымкент",
    position: "Политехнический колледж г. Шымкента, зам. директора",
    login: "bekov_alibek",
    color_group: "blue",
  },
  {
    participant_number: 59,
    last_name: "Джаулыев",
    first_name: "Шохан",
    middle_name: "Джазыкбаевич",
    region: "г. Актау",
    position: "Руководитель ГУ «Отдел образования по Бейнеуского района»",
    login: "dzhaulyev_shokhan",
    color_group: "green",
  },
  {
    participant_number: 60,
    last_name: "Кендирбаев",
    first_name: "Сеилхан",
    middle_name: "Саиыпназарович",
    region: "Шымкент",
    position: "М.Өтебаев атындағы жоғары жаңа технологиялар колледжі директорының ақпараттық технологиялар жөніндегі орынбасары",
    login: "kendirbaev_seilkhan",
    color_group: "yellow",
  },
  {
    participant_number: 61,
    last_name: "Сауырбаева",
    first_name: "Улжалгас",
    middle_name: "Мырзакасымовна",
    region: "г. Шымкент",
    position: "Руководитель отдела общего среднего образования",
    login: "sauyrbaeva_ulzhalgas",
    color_group: "orange",
  },
  {
    participant_number: 62,
    last_name: "Белоусова",
    first_name: "Светлана",
    middle_name: "Борисовна",
    region: "г. Костанай",
    position: "Физико-математический лицей, директор",
    login: "belousova_svetlana",
    color_group: "blue",
  },
  {
    participant_number: 63,
    last_name: "Досаева",
    first_name: "Гульнара",
    middle_name: "Габитовна",
    region: "г. Костанай",
    position: "КГУ 'Основная средняя школа №13'",
    login: "dosaeva_gulnara",
    color_group: "green",
  },
  {
    participant_number: 64,
    last_name: "Шарипов",
    first_name: "Дамир",
    middle_name: "Булатович",
    region: "Костанайская область",
    position: "Руководитель ГУ «Отдел образования Карасуского района»",
    login: "sharipov_damir",
    color_group: "yellow",
  },
]

// Function to insert participants into Supabase
async function insertParticipants() {
  const supabase = createServerSupabaseClient()

  try {
    // Check for existing participants to avoid duplicates
    const { data: existingParticipants, error: fetchError } = await supabase
      .from("participants")
      .select("participant_number")

    if (fetchError) {
      throw new Error(`Error fetching existing participants: ${fetchError.message}`)
    }

    const existingNumbers = new Set(existingParticipants?.map(p => p.participant_number) || [])

    // Filter out participants that already exist
    const newParticipants = participants.filter(
      p => !existingNumbers.has(p.participant_number)
    )

    if (newParticipants.length === 0) {
      console.log("No new participants to insert.")
      return
    }

    // Insert new participants
    const { error: insertError } = await supabase
      .from("participants")
      .insert(newParticipants)

    if (insertError) {
      throw new Error(`Error inserting participants: ${insertError.message}`)
    }

    console.log(`Successfully inserted ${newParticipants.length} participants.`)
  } catch (error) {
    console.error("Error in insertParticipants:", error)
    throw error
  }
}

// Execute the insertion
insertParticipants().catch(error => {
  console.error("Failed to insert participants:", error)
})