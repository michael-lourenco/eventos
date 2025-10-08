"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  ChevronRight,
  Download,
  Laptop,
  MapPin,
  Menu,
  Moon,
  Navigation,
  Sun,
  Users,
  User,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import { FiLogIn } from "react-icons/fi"

function ThemeToggleDropdown() {
  const { setTheme, theme } = useTheme()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Alternar tema"
        >
          {theme === "dark" ? (
            <Moon className="h-5 w-5" />
          ) : theme === "light" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Laptop className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" /> Claro{" "}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" /> Escuro{" "}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="mr-2 h-4 w-4" /> Sistema{" "}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { setTheme, theme } = useTheme()
  const { user, loading } = useAuth()

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-0 z-50 flex w-full flex-col items-center border-b backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Eventos Locais</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Funcionalidades
            </Link>
            <Link
              href="#benefits"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Benefícios
            </Link>
            <Link
              href="#showcase"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Demonstração
            </Link>
            <Link
              href="#download"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Download
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                  <Link href="/user">
                    <Button
                      variant="outline"
                      className="hidden bg-primary hover:bg-primary/90 md:flex items-center gap-2"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.photoURL} alt={user.displayName} />
                        <AvatarFallback className="text-xs">
                          {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline">Minha Conta</span>
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="hidden bg-primary hover:bg-primary/90 md:flex"
                    >
                      Entrar agora
                    </Button>
                  </Link>
                )}
              </>
            )}
            <div className="flex items-center gap-2">
              <ThemeToggleDropdown />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Abrir menu"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="flex w-56 flex-col gap-2 p-2"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="#features"
                      className="w-full text-lg font-medium"
                    >
                      Funcionalidades
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="#benefits"
                      className="w-full text-lg font-medium"
                    >
                      Benefícios
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="#showcase"
                      className="w-full text-lg font-medium"
                    >
                      Demonstração
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="#download"
                      className="w-full text-lg font-medium"
                    >
                      Faça a diferença
                    </Link>
                  </DropdownMenuItem>
                  {user ? (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/user"
                        className="w-full"
                      >
                        <Button
                          variant="outline"
                          className="w-full flex items-center gap-2"
                        >
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={user.photoURL} alt={user.displayName} />
                            <AvatarFallback className="text-xs">
                              {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          Minha Conta
                        </Button>
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/login"
                        className="w-full"
                      >
                        <Button
                          variant="outline"
                          className="w-full"
                        >
                          Entrar
                        </Button>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Baixar App
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex w-full flex-col items-center overflow-hidden bg-gradient-to-b from-primary/5 via-background to-muted py-16 md:py-28 lg:py-36">
          <div className="relative z-10 container px-4 md:px-6">
            <div className="grid min-h-[60vh] items-center justify-center gap-12 lg:grid-cols-2">
              <div className="mx-auto flex flex-col items-center justify-center space-y-8 text-center lg:items-start lg:text-left">
                <div className="space-y-6">
                  <h1 className="text-4xl font-extrabold tracking-tight text-primary drop-shadow-sm md:text-5xl xl:text-6xl">
                    Descubra Eventos Incríveis Próximos a Você
                  </h1>
                  <p className="max-w-xl text-lg font-medium text-foreground md:text-2xl">
                    A plataforma{" "}
                    <span className="font-bold text-primary">Eventos Locais</span>{" "}
                    conecta organizadores e participantes para criar experiências
                    únicas na sua cidade.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/events">
                    <Button
                      size="lg"
                      className="bg-primary px-8 py-6 text-lg shadow-lg hover:bg-primary/90"
                    >
                      Comece Agora
                      <Download className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-primary px-8 py-6 text-lg text-primary hover:bg-primary/5"
                    >
                      Saiba Mais
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <Image
                    src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=500&q=80"
                    width={500}
                    height={500}
                    alt="Eventos Locais em uso"
                    className="rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 z-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="flex w-full flex-col items-center bg-card py-16 md:py-28 lg:py-36"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-4xl font-extrabold tracking-tight text-primary">
                  Funcionalidades Poderosas
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed">
                  A plataforma Eventos Locais oferece recursos inovadores para conectar
                  organizadores e participantes de forma eficiente e engajante.
                </p>
              </div>
            </div>
            <div className="mt-16 grid gap-10 md:grid-cols-3">
              <div className="flex flex-col items-center gap-6 rounded-3xl border border-primary/10 bg-primary/5 p-8 text-center shadow-lg transition hover:shadow-2xl">
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-card">
                  <MapPin className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary">
                  Criação de Eventos
                </h3>
                <p className="text-base text-foreground">
                  Crie e publique eventos em segundos, com foto, localização
                  e categoria. Simples, rápido e eficiente.
                </p>
              </div>
              <div className="flex flex-col items-center gap-6 rounded-3xl border border-primary/10 bg-primary/5 p-8 text-center shadow-lg transition hover:shadow-2xl">
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-card">
                  <Navigation className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary">
                  Mapa Interativo
                </h3>
                <p className="text-base text-foreground">
                  Visualize todos os eventos próximos em um mapa dinâmico,
                  com filtros e ícones personalizados.
                </p>
              </div>
              <div className="flex flex-col items-center gap-6 rounded-3xl border border-primary/10 bg-primary/5 p-8 text-center shadow-lg transition hover:shadow-2xl">
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-card">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary">
                  Engajamento Comunitário
                </h3>
                <p className="text-base text-foreground">
                  Demonstre interesse, confirme participação e conecte-se com
                  outros participantes para criar experiências únicas.
                </p>
              </div>
              <div className="flex flex-col items-center gap-6 rounded-3xl border border-primary/10 bg-primary/5 p-8 text-center shadow-lg transition hover:shadow-2xl">
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-card">
                  <Bell className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary">
                  Notificações em Tempo Real
                </h3>
                <p className="text-base text-foreground">
                  Receba atualizações sobre novos eventos próximos a você
                  e mudanças nos eventos que você está interessado.
                </p>
              </div>
              <div className="flex flex-col items-center gap-6 rounded-3xl border border-primary/10 bg-primary/5 p-8 text-center shadow-lg transition hover:shadow-2xl">
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-card">
                  <svg
                    className="h-10 w-10 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary">
                  Eventos Populares
                </h3>
                <p className="text-base text-foreground">
                  A comunidade destaca os eventos mais interessantes,
                  ajudando você a descobrir as melhores experiências.
                </p>
              </div>
              <div className="flex flex-col items-center gap-6 rounded-3xl border border-primary/10 bg-primary/5 p-8 text-center shadow-lg transition hover:shadow-2xl">
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-card">
                  <svg
                    className="h-10 w-10 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary">
                  Histórico de Eventos
                </h3>
                <p className="text-base text-foreground">
                  Acompanhe os eventos que você participou e descubra
                  novas experiências baseadas em seus interesses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="flex w-full flex-col items-center bg-primary/5 py-16 md:py-28 lg:py-36">
          <div className="container px-4 md:px-6">
            <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-4xl font-extrabold tracking-tight text-primary">
                Depoimentos de Quem Usa
              </h2>
              <p className="text-muted-foreground max-w-[700px] md:text-xl/relaxed">
                Veja como Eventos Locais está transformando a vida de
                participantes e organizadores.
              </p>
            </div>
            <div className="grid gap-10 md:grid-cols-3">
              <div className="flex flex-col items-center rounded-2xl border border-primary/10 bg-card p-8 text-center shadow-lg">
                <Image
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  width={72}
                  height={72}
                  alt="Depoimento usuário 1"
                  className="mb-4 rounded-full"
                />
                <p className="text-lg text-foreground italic">
                  &quot;Com Eventos Locais, descobri um festival de música incrível
                  a poucos minutos de casa. Nunca foi tão fácil encontrar eventos
                  próximos!&quot;
                </p>
                <span className="mt-4 font-semibold text-primary">
                  Carlos, participante ativo
                </span>
              </div>
              <div className="flex flex-col items-center rounded-2xl border border-primary/10 bg-card p-8 text-center shadow-lg">
                <Image
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  width={72}
                  height={72}
                  alt="Depoimento usuária 2"
                  className="mb-4 rounded-full"
                />
                <p className="text-lg text-foreground italic">
                  &quot;Organizei meu primeiro evento pela plataforma e tive uma
                  participação incrível! A ferramenta facilita muito a divulgação
                  local.&quot;
                </p>
                <span className="mt-4 font-semibold text-primary">
                  Juliana, organizadora de eventos
                </span>
              </div>
              <div className="flex flex-col items-center rounded-2xl border border-primary/10 bg-card p-8 text-center shadow-lg">
                <Image
                  src="https://randomuser.me/api/portraits/men/65.jpg"
                  width={72}
                  height={72}
                  alt="Depoimento gestor público"
                  className="mb-4 rounded-full"
                />
                <p className="text-lg text-foreground italic">
                  &quot;Eventos Locais me ajudou a encontrar pessoas com interesses
                  semelhantes na minha região. Participei de 5 eventos este mês!&quot;
                </p>
                <span className="mt-4 font-semibold text-primary">
                  Roberto, entusiasta de eventos
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Gráficos Antes/Depois Section */}
        <section className="flex w-full flex-col items-center bg-card py-16 md:py-28 lg:py-36">
          <div className="container px-4 md:px-6">
            <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-4xl font-extrabold tracking-tight text-primary">
                O Impacto de Eventos Locais
              </h2>
              <p className="text-muted-foreground max-w-[700px] md:text-xl/relaxed">
                Veja como a comunidade se conecta e cria experiências
                incríveis através de eventos locais.
              </p>
            </div>
            <div className="grid gap-10 md:grid-cols-2">
              <div className="flex flex-col items-center rounded-2xl border border-primary/10 bg-primary/5 p-8 text-center shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-primary">
                  Antes de Eventos Locais
                </h3>
                <Image
                  src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"
                  width={400}
                  height={220}
                  alt="Antes de Eventos Locais"
                  className="mb-4 rounded-lg object-cover"
                />
                <p className="text-base text-foreground">
                  Difícil descobrir eventos próximos, informações espalhadas
                  em várias plataformas. Falta de conexão com a comunidade local
                  e oportunidades perdidas.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-2xl border border-primary/10 bg-primary/5 p-8 text-center shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-primary">
                  Depois de Eventos Locais
                </h3>
                <Image
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                  width={400}
                  height={220}
                  alt="Depois de Eventos Locais"
                  className="mb-4 rounded-lg object-cover"
                />
                <p className="text-base text-foreground">
                  Descoberta instantânea, conexão com a comunidade e participação
                  ativa em eventos. A vida social se torna mais rica, conectada
                  e vibrante.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section
          id="benefits"
          className="flex w-full flex-col items-center bg-muted py-16 md:py-28 lg:py-36"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-4xl font-extrabold tracking-tight text-primary">
                  Benefícios para Todos
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed">
                  Eventos Locais transforma a forma como você descobre e participa
                  de eventos, promovendo comunidades mais conectadas, engajadas e
                  vibrantes.
                </p>
              </div>
            </div>
            <div className="mt-16 grid gap-10 md:grid-cols-2">
              {/* Card Cidadãos */}
              <div className="flex flex-col items-center gap-6 rounded-3xl border border-primary/10 bg-card p-8 text-center shadow-xl transition hover:shadow-2xl">
                <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-primary/5">
                  <svg
                    className="h-12 w-12 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                    <circle
                      cx="9"
                      cy="7"
                      r="4"
                    />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-primary">
                  Para Participantes
                </h3>
                <ul className="list-none space-y-2 text-base text-foreground">
                  <li>
                    <span className="font-semibold text-primary">
                      ✔ Descoberta instantânea:
                    </span>{" "}
                    encontre eventos próximos em tempo real, filtrados por
                    categoria e distância.
                  </li>
                  <li>
                    <span className="font-semibold text-primary">
                      ✔ Transparência total:
                    </span>{" "}
                    veja detalhes completos, localização exata e informações
                    dos organizadores.
                  </li>
                  <li>
                    <span className="font-semibold text-primary">
                      ✔ Voz ativa:
                    </span>{" "}
                    demonstre interesse, confirme participação e conecte-se
                    facilmente com outros participantes.
                  </li>
                  <li>
                    <span className="font-semibold text-primary">
                      ✔ Comunidade forte:
                    </span>{" "}
                    conecte-se com pessoas de interesses similares e crie
                    experiências memoráveis juntos.
                  </li>
                </ul>
              </div>
              {/* Card Funcionários Públicos */}
              <div className="flex flex-col items-center gap-6 rounded-3xl border border-primary/10 bg-card p-8 text-center shadow-xl transition hover:shadow-2xl">
                <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-primary/5">
                  <svg
                    className="h-12 w-12 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                    />
                    <path d="M16 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M8 21v-4a1 1 0 0 0-1-1H3" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-primary">
                  Para Organizadores
                </h3>
                <ul className="list-none space-y-2 text-base text-foreground">
                  <li>
                    <span className="font-semibold text-primary">
                      ✔ Criação simplificada:
                    </span>{" "}
                    publique eventos em minutos com localização automática
                    e categorização intuitiva.
                  </li>
                  <li>
                    <span className="font-semibold text-primary">
                      ✔ Alcance local:
                    </span>{" "}
                    divulgue para pessoas próximas automaticamente através
                    do mapa interativo.
                  </li>
                  <li>
                    <span className="font-semibold text-primary">
                      ✔ Métricas em tempo real:
                    </span>{" "}
                    acompanhe interesse, confirmações de participação e
                    engajamento do público.
                  </li>
                  <li>
                    <span className="font-semibold text-primary">
                      ✔ Gestão eficiente:
                    </span>{" "}
                    edite, cancele e gerencie seus eventos facilmente em
                    um dashboard completo.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Showcase Section */}
        <section
          id="showcase"
          className="flex w-full flex-col items-center py-12 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Veja Eventos Locais em Ação
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Descubra como você pode ser protagonista na vida cultural da
                  sua comunidade. Eventos Locais foi criado para conectar pessoas,
                  facilitar a descoberta de eventos próximos e fortalecer os
                  laços comunitários. Juntos, tornamos a vida social mais rica,
                  vibrante e conectada para todos.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
              <div className="flex flex-col space-y-4">
                <div className="bg-background overflow-hidden rounded-lg border shadow">
                  <Image
                    src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80"
                    width={600}
                    height={400}
                    alt="Pessoa reportando problema urbano pelo celular"
                    className="aspect-video w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">
                  Crie Eventos em Segundos
                </h3>
                <p className="text-muted-foreground">
                  Quer organizar um evento? Com Eventos Locais, você publica
                  em poucos cliques, alcançando pessoas próximas e criando
                  experiências memoráveis para sua comunidade.
                </p>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="bg-background overflow-hidden rounded-lg border shadow">
                  <Image
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                    width={600}
                    height={400}
                    alt="Mapa interativo urbano em smartphone"
                    className="aspect-video w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">
                  Mapa Interativo de Eventos
                </h3>
                <p className="text-muted-foreground">
                  Veja em tempo real todos os eventos próximos, filtre por
                  categoria e descubra experiências únicas na sua região.
                  Conexão e diversão para todos!
                </p>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="bg-background overflow-hidden rounded-lg border shadow">
                  <Image
                    src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80"
                    width={600}
                    height={400}
                    alt="Acompanhamento de progresso em dashboard digital"
                    className="aspect-video w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">
                  Acompanhe Seus Eventos
                </h3>
                <p className="text-muted-foreground">
                  Receba notificações sobre eventos que você demonstrou interesse,
                  acompanhe mudanças e nunca perca uma experiência incrível.
                  Fique sempre conectado com sua comunidade.
                </p>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="bg-background overflow-hidden rounded-lg border shadow">
                  <Image
                    src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80"
                    width={600}
                    height={400}
                    alt="Pessoas colaborando e engajando em comunidade urbana"
                    className="aspect-video w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Engajamento Comunitário</h3>
                <p className="text-muted-foreground">
                  Participe ativamente: demonstre interesse, confirme participação,
                  compartilhe eventos e motive seus amigos a também participar.
                  Juntos, criamos uma comunidade mais conectada, vibrante
                  e engajada.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section
          id="download"
          className="flex w-full flex-col items-center bg-gradient-to-br from-primary/10 via-primary/5 to-background py-12 border-t border-border md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
                  Pronto para Descobrir Eventos Incríveis?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Comece agora e descubra eventos próximos a você.
                  Conecte-se com sua comunidade local!
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-6 sm:flex-row">
                {user ? (
                  <Link
                    href="/events"
                    className="focus-visible:ring-ring inline-flex h-12 items-center justify-center rounded-md bg-card px-6 text-sm font-medium text-primary shadow transition-colors hover:bg-muted focus-visible:ring-1 focus-visible:outline-none"
                  >
                    <MapPin className="mr-2 h-5 w-5" />
                    Ver Eventos
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="focus-visible:ring-ring inline-flex h-12 items-center justify-center rounded-md bg-card px-6 text-sm font-medium text-primary shadow transition-colors hover:bg-muted focus-visible:ring-1 focus-visible:outline-none"
                  >
                    <FiLogIn className="mr-2 h-5 w-5" />
                    Entrar agora
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* CityFix em Números Section */}
      <section className="flex w-full flex-col items-center bg-card py-16 md:py-28 lg:py-36">
        <div className="container px-4 md:px-6">
          <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-primary">
              Eventos Locais em Números
            </h2>
            <p className="text-muted-foreground max-w-[700px] md:text-xl/relaxed">
              Acompanhe em tempo real o impacto de Eventos Locais na sua comunidade!
            </p>
          </div>
          <EventsStats />
        </div>
      </section>

      <footer className="flex w-full flex-col items-center border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 py-4 md:h-24 md:flex-row md:py-0">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <p className="text-muted-foreground text-sm">
              © 2025 Eventos Locais. Todos os direitos reservados.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-muted-foreground text-sm hover:text-primary"
            >
              Política de Privacidade
            </Link>
            <Link
              href="#"
              className="text-muted-foreground text-sm hover:text-primary"
            >
              Termos de Serviço
            </Link>
            <Link
              href="#"
              className="text-muted-foreground text-sm hover:text-primary"
            >
              Fale Conosco
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Componente de contadores animados
function EventsStats() {
  const [eventos, setEventos] = React.useState(0)
  const [participantes, setParticipantes] = React.useState(0)

  React.useEffect(() => {
    const eventosTarget = 450 // valor ilustrativo
    const participantesTarget = 2500 // valor ilustrativo
    const eventosStep = Math.ceil(eventosTarget / 120)
    const participantesStep = Math.ceil(participantesTarget / 120)
    const eventosInterval = setInterval(() => {
      setEventos((prev) => {
        if (prev + eventosStep >= eventosTarget) {
          clearInterval(eventosInterval)
          return eventosTarget
        }
        return prev + eventosStep
      })
    }, 20)
    const participantesInterval = setInterval(() => {
      setParticipantes((prev) => {
        if (prev + participantesStep >= participantesTarget) {
          clearInterval(participantesInterval)
          return participantesTarget
        }
        return prev + participantesStep
      })
    }, 20)
    return () => {
      clearInterval(eventosInterval)
      clearInterval(participantesInterval)
    }
  }, [])

  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-12 md:flex-row">
      <div className="flex min-w-[260px] flex-col items-center rounded-2xl border border-primary/10 bg-primary/5 p-10 shadow-lg">
        <span className="text-5xl font-extrabold text-primary">
          {eventos.toLocaleString("pt-BR")}
        </span>
        <span className="mt-2 text-lg font-semibold text-foreground">
          eventos criados por mês
        </span>
        <span className="mt-2 text-primary">
          <svg
            className="inline h-8 w-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 2v20" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </span>
      </div>
      <div className="flex min-w-[260px] flex-col items-center rounded-2xl border border-primary/10 bg-primary/5 p-10 shadow-lg">
        <span className="text-5xl font-extrabold text-primary">
          {participantes.toLocaleString("pt-BR")}
        </span>
        <span className="mt-2 text-lg font-semibold text-foreground">
          participantes engajados por mês
        </span>
        <span className="mt-2 text-primary">
          <svg
            className="inline h-8 w-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        </span>
      </div>
    </div>
  )
}
