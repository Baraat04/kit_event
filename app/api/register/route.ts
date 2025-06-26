import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    console.log("Registration API called")

    // Проверяем переменные окружения
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables:", {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey,
      })
      return NextResponse.json(
        {
          error: "Server configuration error",
          details: "Missing Supabase environment variables",
        },
        { status: 500 },
      )
    }

    // Создаем клиент Supabase
    const supabase = createServerSupabaseClient()

    // Получаем данные из запроса
    const data = await request.json()
    console.log("Registration data received:", {
      lastName: data.lastName,
      firstName: data.firstName,
      // Не логируем все данные для безопасности
    })

    // Проверяем существование таблицы participants
    try {
      // Проверяем, существует ли таблица participants
      const { data: tableExists, error: tableCheckError } = await supabase.from("participants").select("id").limit(1)

      if (tableCheckError) {
        console.error("Error checking table existence:", tableCheckError)
        return NextResponse.json(
          {
            error: "Database error",
            details: `Table check failed: ${tableCheckError.message}`,
          },
          { status: 500 },
        )
      }

      console.log("Table check successful, table exists")

      // Получаем максимальный номер участника для определения следующего номера
      const { data: maxParticipant, error: maxError } = await supabase
        .from("participants")
        .select("participant_number")
        .order("participant_number", { ascending: false })
        .limit(1)
        .single()

      let participantNumber = 1

      if (maxError && maxError.code !== "PGRST116") {
        // PGRST116 означает "no rows returned", что нормально для пустой таблицы
        console.error("Error getting max participant number:", maxError)
        return NextResponse.json(
          {
            error: "Database error",
            details: `Max participant number query failed: ${maxError.message}`,
          },
          { status: 500 },
        )
      }

      if (maxParticipant) {
        participantNumber = maxParticipant.participant_number + 1
      }

      console.log("Next participant number:", participantNumber)

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

      // Генерируем уникальный логин с проверкой на существование
      let login = `user${participantNumber.toString().padStart(3, "0")}`
      let loginAttempts = 0
      const maxLoginAttempts = 100

      while (loginAttempts < maxLoginAttempts) {
        // Проверяем, существует ли уже такой логин
        const { data: existingUser, error: loginCheckError } = await supabase
          .from("participants")
          .select("id")
          .eq("login", login)
          .single()

        if (loginCheckError && loginCheckError.code === "PGRST116") {
          // Логин свободен
          break
        } else if (loginCheckError) {
          console.error("Error checking login existence:", loginCheckError)
          return NextResponse.json(
            {
              error: "Database error",
              details: `Login check failed: ${loginCheckError.message}`,
            },
            { status: 500 },
          )
        } else {
          // Логин занят, пробуем следующий
          participantNumber++
          login = `user${participantNumber.toString().padStart(3, "0")}`
          loginAttempts++
          console.log(`Login ${login} already exists, trying next one`)
        }
      }

      if (loginAttempts >= maxLoginAttempts) {
        console.error("Could not generate unique login after", maxLoginAttempts, "attempts")
        return NextResponse.json(
          {
            error: "Registration error",
            details: "Could not generate unique login. Please try again.",
          },
          { status: 500 },
        )
      }

      // Генерируем пароль
      const password = Math.random().toString(36).substring(2, 10)

      console.log("Attempting to insert participant with login:", login)

      // Сохраняем участника в базу данных
      const { data: participant, error: insertError } = await supabase
        .from("participants")
        .insert({
          participant_number: participantNumber,
          last_name: data.lastName,
          first_name: data.firstName,
          middle_name: data.middleName,
          region: data.region,
          position: data.position || "Не указана",
          login: login,
          password: password,
          color_group: colorGroup,
        })
        .select()
        .single()

      if (insertError) {
        console.error("Error inserting participant:", insertError)

        // Если все еще есть конфликт логина, попробуем еще раз с временной меткой
        if (insertError.code === "23505" && insertError.message.includes("participants_login_key")) {
          const timestamp = Date.now().toString().slice(-4)
          const fallbackLogin = `user${participantNumber.toString().padStart(3, "0")}_${timestamp}`

          console.log("Trying fallback login:", fallbackLogin)

          const { data: fallbackParticipant, error: fallbackError } = await supabase
            .from("participants")
            .insert({
              participant_number: participantNumber,
              last_name: data.lastName,
              first_name: data.firstName,
              middle_name: data.middleName,
              region: data.region,
              position: data.position || "Не указана",
              login: fallbackLogin,
              password: password,
              color_group: colorGroup,
            })
            .select()
            .single()

          if (fallbackError) {
            console.error("Fallback insert also failed:", fallbackError)
            return NextResponse.json(
              {
                error: "Database error",
                details: `Insert failed: ${fallbackError.message}`,
              },
              { status: 500 },
            )
          }

          console.log("Participant registered successfully with fallback login:", fallbackParticipant.id)

          return NextResponse.json({
            success: true,
            participant: {
              ...fallbackParticipant,
              participantNumber,
              login: fallbackLogin,
              password,
              colorGroup,
            },
          })
        }

        return NextResponse.json(
          {
            error: "Database error",
            details: `Insert failed: ${insertError.message}`,
          },
          { status: 500 },
        )
      }

      console.log("Participant registered successfully with ID:", participant.id)

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
        {
          error: "Database error",
          details: dbError instanceof Error ? dbError.message : "Unknown database error",
        },
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
