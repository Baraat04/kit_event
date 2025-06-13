import { type NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { login, password } = await request.json();

    if (!login || !password) {
      return NextResponse.json(
        { error: "Login and password are required" },
        { status: 400 }
      );
    }

    // Ищем участника по логину и паролю
    const { data: participant, error } = await supabase
      .from("participants")
      .select("*")
      .eq("login", login)
      .eq("password", password)
      .single();

    if (error || !participant) {
      return NextResponse.json(
        { error: "Invalid login credentials" },
        { status: 401 }
      );
    }

    // Обновляем время последнего входа (опционально)
    await supabase
      .from("participants")
      .update({ last_login: new Date().toISOString() })
      .eq("id", participant.id);

    return NextResponse.json({
      success: true,
      participant,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
