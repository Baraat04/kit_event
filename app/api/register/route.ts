import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const data = await request.json()

    // Получаем тек��щее количество участников для определения следующего номера
    const { count } = await supabase.from("participants").select("*", { count: "exact", head: true })

    // Вычисляем следующий порядковый номер
    const participantNumber = (count ?? 0) + 1

    // Определяем цвет на основе номера
    let colorGroup
    if (participantNumber <= 20) {
      colorGroup = "green"
    } else if (participantNumber <= 40) {
      colorGroup = "yellow"
    } else if (participantNumber <= 60) {
      colorGroup = "orange"
    } else {
      colorGroup = "blue"
    }

    // Генерируем логин и пароль
    const login = `user${participantNumber.toString().padStart(3, "0")}`
    const password = Math.random().toString(36).substring(2, 10)

    // Сохраняем участника в базу данных
    const { data: participant, error } = await supabase
      .from("participants")
      .insert({
        participant_number: participantNumber,
        last_name: data.lastName,
        first_name: data.firstName,
        middle_name: data.middleName,
        region: data.region,
        position: data.position,
        login: login,
        password: password,
        color_group: colorGroup,
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting participant:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      participant: {
        ...participant,
        participantNumber,
        login,
        password,
        colorGroup,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
