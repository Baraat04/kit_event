"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { ArrowLeft, Volume2, VolumeX, Loader2, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface RegistrationFormProps {
  onSuccess: (user: any) => void;
  onBack: () => void;
  onLoginClick: () => void;
}

export default function RegistrationForm({
  onSuccess,
  onBack,
  onLoginClick,
}: RegistrationFormProps) {
  const { translations, language } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    region: "",
    position: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Cleanup function to handle component unmounting
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const playRegistrationSound = async () => {
    if (!audioRef.current) return;

    try {
      setAudioError(false);
      setAudioPlaying(true);

      // Set audio source based on current language
      audioRef.current.src = `/audio/registration-${language}.mp3`;
      audioRef.current.currentTime = 0;

      await audioRef.current.play();
    } catch (error) {
      console.warn("Audio playback failed:", error);
      setAudioError(true);
      setAudioPlaying(false);
    }
  };

  const handleAudioEnded = () => {
    setAudioPlaying(false);
  };

  const handleAudioError = () => {
    setAudioError(true);
    setAudioPlaying(false);
  };

  const getParticipantColor = (number: number) => {
    if (number <= 20) return "bg-green-100 border-green-500";
    if (number <= 40) return "bg-yellow-100 border-yellow-500";
    if (number <= 60) return "bg-orange-100 border-orange-500";
    return "bg-blue-100 border-blue-500";
  };

  const getParticipantColorText = (number: number) => {
    if (number <= 20) return "text-green-800";
    if (number <= 40) return "text-yellow-800";
    if (number <= 60) return "text-orange-800";
    return "text-blue-800";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Play sound when form is submitted
      await playRegistrationSound();

      // Отправляем данные на сервер для регистрации
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Получаем данные участника из ответа сервера
      const participant = data.participant;

      // Создаем объект пользователя с нужными данными для отображения
      const user = {
        ...formData,
        participantNumber: participant.participant_number,
        login: participant.login,
        password: participant.password,
        color: getParticipantColor(participant.participant_number),
        colorText: getParticipantColorText(participant.participant_number),
      };

      setRegisteredUser(user);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: translations.registrationError || "Registration Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    onSuccess(registeredUser);
  };

  if (registeredUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className={`w-full max-w-md ${registeredUser.color} border-2`}>
          <CardHeader className="text-center">
            <CardTitle className={`text-2xl ${registeredUser.colorText}`}>
              #{registeredUser.participantNumber} {registeredUser.lastName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className={`font-semibold ${registeredUser.colorText}`}>
                {translations.registrationSuccess}
              </p>
              <div className="bg-white/50 p-4 rounded-lg">
                <p>
                  <strong>{translations.login}:</strong> {registeredUser.login}
                </p>
                <p>
                  <strong>{translations.password}:</strong>{" "}
                  {registeredUser.password}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                {translations.saveCredentials ||
                  "Save these credentials for future login"}
              </p>
            </div>
            <Button onClick={handleContinue} className="w-full">
              {translations.continue}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <audio
        ref={audioRef}
        preload="none"
        onEnded={handleAudioEnded}
        onError={handleAudioError}
      />

      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-xl">
                {translations.registration}
              </CardTitle>
              {audioPlaying ? (
                <Volume2 className="w-5 h-5 text-blue-600 animate-pulse" />
              ) : audioError ? (
                <VolumeX className="w-5 h-5 text-red-500" />
              ) : (
                <Volume2 className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <Button variant="outline" size="sm" onClick={onLoginClick}>
              <LogIn className="w-4 h-4 mr-2" />
              {translations.login || "Login"}
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            {translations.alreadyRegistered || "Already registered?"}{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-normal text-sm"
              onClick={onLoginClick}
            >
              {translations.clickHereToLogin || "Click here to login"}
            </Button>
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="lastName">{translations.lastName}</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="firstName">{translations.firstName}</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="middleName">{translations.middleName}</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) =>
                  setFormData({ ...formData, middleName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="region">{translations.region}</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) =>
                  setFormData({ ...formData, region: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="position">{translations.position}</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {translations.registering}
                </>
              ) : (
                translations.registerButton
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
