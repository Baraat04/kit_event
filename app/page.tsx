"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Users, Calendar, Award } from "lucide-react";
import LanguageSelector from "@/components/language-selector";
import RegistrationForm from "@/components/registration-form";
import LoginForm from "@/components/login-form";
import EventInfo from "@/components/event-info";
import { useLanguage } from "@/hooks/use-language";
import LanguageModal from "@/components/language-modal";

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
export default function HomePage() {
  const [currentView, setCurrentView] = useState<
    "language" | "home" | "register" | "login" | "event"
  >("language");
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const { language, translations } = useLanguage();

  const handleRegistrationSuccess = (user: any) => {
    setRegisteredUser(user);
    setCurrentView("event");
  };

  const handleLoginSuccess = (user: any) => {
    setRegisteredUser(user);
    setCurrentView("event");
  };

  const handleLanguageSelected = () => {
    setCurrentView("register");
  };

  if (currentView === "language") {
    return <LanguageModal onLanguageSelected={handleLanguageSelected} />;
  }

  if (currentView === "event") {
    return (
      <EventInfo user={registeredUser} onBack={() => setCurrentView("home")} />
    );
  }

  if (currentView === "login") {
    return (
      <LoginForm
        onSuccess={handleLoginSuccess}
        onBack={() => setCurrentView("register")}
      />
    );
  }

  if (currentView === "register") {
    return (
      <RegistrationForm
        onSuccess={handleRegistrationSuccess}
        onBack={() => setCurrentView("language")}
        onLoginClick={() => setCurrentView("login")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-8">
          <LanguageSelector />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {translations.welcome}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {translations.eventDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="text-center">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {translations.participants}
                </h3>
                <p className="text-gray-600">{translations.participantsDesc}</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="text-center">
                <Calendar className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {translations.program}
                </h3>
                <p className="text-gray-600">{translations.programDesc}</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="text-center">
                <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {translations.speakers}
                </h3>
                <p className="text-gray-600">{translations.speakersDesc}</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="text-center">
                <Globe className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {translations.networking}
                </h3>
                <p className="text-gray-600">{translations.networkingDesc}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700"
              onClick={() => setCurrentView("register")}
            >
              {translations.register}
            </Button>
            <div className="text-sm text-gray-500">
              {translations.freeEvent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
