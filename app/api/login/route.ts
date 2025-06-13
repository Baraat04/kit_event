import { type NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    console.log("Login API called");
    const supabase = createServerSupabaseClient();
    const { login, password } = await request.json();
    console.log("Login attempt for:", login);

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
      console.error("Login failed for user:", login, error);
      return NextResponse.json(
        { error: "Invalid login credentials" },
        { status: 401 }
      );
    }

    console.log("Login successful for user:", login);

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
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
