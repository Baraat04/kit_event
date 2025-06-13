import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    console.log("Registration API called")
    const supabase = createServerSupabaseClient()
    const data = await request.json()
    console.log("Registration data:", data)

    // Проверяем подключение к базе данных
    try {
      const { count, error: countError } = await supabase
        .from("participants")
        .select("*", { count: "exact", head: true })

      if (countError) {
        console.error("Error checking participants count:", countError)
        return NextResponse.json({ error: `Database connection error: ${countError.message}` }, { status: 500 })
      }

      console.log("Current participants count:", count)

      // Вычисляем следующий порядковый номер
      const participantNumber = (count ?? 0) + 1
      console.log("New participant number:", participantNumber)

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

      console.log("Inserting new participant with login:", login)

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
        return NextResponse.json({ error: `Database insert error: ${error.message}` }, { status: 500 })
      }

      console.log("Participant registered successfully:", participant)

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
    } catch (dbError) {
      console.error("Database operation error:", dbError)
      return NextResponse.json(
        { error: `Database operation failed: ${dbError instanceof Error ? dbError.message : "Unknown error"}` },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
