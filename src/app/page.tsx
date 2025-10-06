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
            <MapPin className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">Eventos Locais</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium transition-colors hover:text-emerald-500"
            >
              Funcionalidades
            </Link>
            <Link
              href="#benefits"
              className="text-sm font-medium transition-colors hover:text-emerald-500"
            >
              Benefícios
            </Link>
            <Link
              href="#showcase"
              className="text-sm font-medium transition-colors hover:text-emerald-500"
            >
              Demonstração
            </Link>
            <Link
              href="#download"
              className="text-sm font-medium transition-colors hover:text-emerald-500"
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
                      className="hidden bg-emerald-500 hover:bg-emerald-600 md:flex items-center gap-2"
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
                      className="hidden bg-emerald-500 hover:bg-emerald-600 md:flex"
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
                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
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
        <section className="relative flex w-full flex-col items-center overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-slate-50 py-16 md:py-28 lg:py-36">
          <div className="relative z-10 container px-4 md:px-6">
            <div className="grid min-h-[60vh] items-center justify-center gap-12 lg:grid-cols-2">
              <div className="mx-auto flex flex-col items-center justify-center space-y-8 text-center lg:items-start lg:text-left">
                <div className="space-y-6">
                  <h1 className="text-4xl font-extrabold tracking-tight text-emerald-700 drop-shadow-sm md:text-5xl xl:text-6xl">
                    Descubra Eventos Incríveis Próximos a Você
                  </h1>
                  <p className="max-w-xl text-lg font-medium text-slate-700 md:text-2xl">
                    A plataforma{" "}
                    <span className="font-bold text-emerald-600">Eventos Locais</span>{" "}
                    conecta organizadores e participantes para criar experiências
                    únicas na sua cidade.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/events">
                    <Button
                      size="lg"
                      className="bg-emerald-600 px-8 py-6 text-lg shadow-lg hover:bg-emerald-700"
                    >
                      Comece Agora
                      <Download className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-emerald-500 px-8 py-6 text-lg text-emerald-700 hover:bg-emerald-50"
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
                    src="/reporta-cidade.svg?height=684&width=334"
                    width={500}
                    height={1042}
                    alt="App CityFix em uso"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent" />
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="flex w-full flex-col items-center bg-white py-16 md:py-28 lg:py-36"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-4xl font-extrabold tracking-tight text-emerald-700">
                  Funcionalidades Poderosas
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed">
                  A plataforma Eventos Locais oferece recursos inovadores para conectar
                  organizadores e participantes de forma eficiente e engajante.
                </p>
              </div>
            </div>
            <div className="mt-16 grid gap-10 md:grid-cols-3">
              <div className="flex flex-col items-center gap-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-8 text-center shadow-lg transition hover:shadow-2xl">
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white">
                  <MapPin className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-emerald-700">
                  Criação de Eventos
                </h3>
                <p className="text-base text-slate-700">
                  Crie e publique eventos em segundos, com foto, localização
                  e categoria. Simples, rápido e eficiente.
                </p>
              </div>
              <div className="flex flex-col items-center gap-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-8 text-center shadow-lg transition hover:shadow-2xl">
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white">
                  <Navigation className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-emerald-700">
                  Mapa Interativo
                </h3>
                <p className="text-base text-slate-700">
                  Visualize todos os eventos próximos em um mapa dinâmico,
                  com filtros e ícones personalizados.
                </p>
              </div>
              <div className="flex flex-col items-center gap-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-8 text-center shadow-lg transition hover:shadow-2xl">
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white">
                  <Users className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-emerald-700">
                  Engajamento Comunitário
                </h3>
                <p className="text-base text-slate-700">
                  Demonstre interesse, confirme participação e conecte-se com
                  outros participantes para criar experiências únicas.
                </p>
              </div>
              <div className="flex flex-col items-center gap-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-8 text-center shadow-lg transition hover:shadow-2xl">
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white">
                  <Bell className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-emerald-700">
                  Notificações em Tempo Real
                </h3>
                <p className="text-base text-slate-700">
                  Receba atualizações sobre o andamento dos problemas reportados
                  e fique por dentro das melhorias na sua região.
                </p>
              </div>
              <div className="flex flex-col items-center gap-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-8 text-center shadow-lg transition hover:shadow-2xl">
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white">
                  <svg
                    className="h-10 w-10 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-emerald-700">
                  Priorização Inteligente
                </h3>
                <p className="text-base text-slate-700">
                  A comunidade ajuda a priorizar os problemas mais urgentes,
                  tornando a gestão pública mais eficiente.
                </p>
              </div>
              <div className="flex flex-col items-center gap-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-8 text-center shadow-lg transition hover:shadow-2xl">
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white">
                  <svg
                    className="h-10 w-10 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-emerald-700">
                  Acompanhamento Visual
                </h3>
                <p className="text-base text-slate-700">
                  Monitore o progresso das soluções e veja como sua cidade
                  evolui com a participação de todos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="flex w-full flex-col items-center bg-emerald-50 py-16 md:py-28 lg:py-36">
          <div className="container px-4 md:px-6">
            <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-4xl font-extrabold tracking-tight text-emerald-700">
                Depoimentos de Quem Usa
              </h2>
              <p className="text-muted-foreground max-w-[700px] md:text-xl/relaxed">
                Veja como o CityFix está transformando a vida de cidadãos e
                gestores públicos.
              </p>
            </div>
            <div className="grid gap-10 md:grid-cols-3">
              <div className="flex flex-col items-center rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-lg">
                <Image
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  width={72}
                  height={72}
                  alt="Depoimento usuário 1"
                  className="mb-4 rounded-full"
                />
                <p className="text-lg text-slate-700 italic">
                  “Com o CityFix, consegui reportar um buraco na minha rua e em
                  poucos dias já estava resolvido. Nunca foi tão fácil ser
                  ouvido!”
                </p>
                <span className="mt-4 font-semibold text-emerald-700">
                  Carlos, morador de São Paulo
                </span>
              </div>
              <div className="flex flex-col items-center rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-lg">
                <Image
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  width={72}
                  height={72}
                  alt="Depoimento usuária 2"
                  className="mb-4 rounded-full"
                />
                <p className="text-lg text-slate-700 italic">
                  “Acompanhar o status dos problemas e votar nas prioridades do
                  bairro me faz sentir parte da solução!”
                </p>
                <span className="mt-4 font-semibold text-emerald-700">
                  Juliana, líder comunitária
                </span>
              </div>
              <div className="flex flex-col items-center rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-lg">
                <Image
                  src="https://randomuser.me/api/portraits/men/65.jpg"
                  width={72}
                  height={72}
                  alt="Depoimento gestor público"
                  className="mb-4 rounded-full"
                />
                <p className="text-lg text-slate-700 italic">
                  “O CityFix facilitou muito a gestão das demandas da cidade.
                  Agora priorizamos o que realmente importa para a população.”
                </p>
                <span className="mt-4 font-semibold text-emerald-700">
                  Roberto, gestor público
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Gráficos Antes/Depois Section */}
        <section className="flex w-full flex-col items-center bg-white py-16 md:py-28 lg:py-36">
          <div className="container px-4 md:px-6">
            <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-4xl font-extrabold tracking-tight text-emerald-700">
                O Impacto do CityFix
              </h2>
              <p className="text-muted-foreground max-w-[700px] md:text-xl/relaxed">
                Veja como a cidade pode evoluir com a participação ativa dos
                cidadãos e o uso da tecnologia.
              </p>
            </div>
            <div className="grid gap-10 md:grid-cols-2">
              <div className="flex flex-col items-center rounded-2xl border border-emerald-100 bg-emerald-50 p-8 text-center shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-emerald-700">
                  Antes do CityFix
                </h3>
                <Image
                  src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"
                  width={400}
                  height={220}
                  alt="Gráfico antes do CityFix"
                  className="mb-4 rounded-lg object-cover"
                />
                <p className="text-base text-slate-700">
                  Problemas demoravam semanas para serem reportados e
                  resolvidos. Falta de transparência e comunicação dificultava a
                  vida do cidadão.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-2xl border border-emerald-100 bg-emerald-50 p-8 text-center shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-emerald-700">
                  Depois do CityFix
                </h3>
                <Image
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                  width={400}
                  height={220}
                  alt="Gráfico depois do CityFix"
                  className="mb-4 rounded-lg object-cover"
                />
                <p className="text-base text-slate-700">
                  Respostas rápidas, acompanhamento em tempo real e participação
                  ativa da população. A cidade se torna mais eficiente, limpa e
                  segura.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section
          id="benefits"
          className="flex w-full flex-col items-center bg-slate-50 py-16 md:py-28 lg:py-36"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-4xl font-extrabold tracking-tight text-emerald-700">
                  Benefícios para Todos
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed">
                  O CityFix transforma a relação entre cidadãos e poder público,
                  promovendo cidades mais inteligentes, seguras e
                  participativas.
                </p>
              </div>
            </div>
            <div className="mt-16 grid gap-10 md:grid-cols-2">
              {/* Card Cidadãos */}
              <div className="flex flex-col items-center gap-6 rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-xl transition hover:shadow-2xl">
                <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                  <svg
                    className="h-12 w-12 text-emerald-500"
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
                <h3 className="text-2xl font-bold text-emerald-700">
                  Para Cidadãos
                </h3>
                <ul className="list-none space-y-2 text-base text-slate-700">
                  <li>
                    <span className="font-semibold text-emerald-600">
                      ✔ Reporte instantâneo:
                    </span>{" "}
                    registre buracos, iluminação, lixo e outros problemas em
                    segundos.
                  </li>
                  <li>
                    <span className="font-semibold text-emerald-600">
                      ✔ Transparência total:
                    </span>{" "}
                    acompanhe o status de cada solicitação e receba notificações
                    de progresso.
                  </li>
                  <li>
                    <span className="font-semibold text-emerald-600">
                      ✔ Voz ativa:
                    </span>{" "}
                    vote, comente e colabore para priorizar o que é mais urgente
                    no seu bairro.
                  </li>
                  <li>
                    <span className="font-semibold text-emerald-600">
                      ✔ Comunidade forte:
                    </span>{" "}
                    conecte-se com vizinhos engajados e ajude a construir uma
                    cidade melhor para todos.
                  </li>
                </ul>
              </div>
              {/* Card Funcionários Públicos */}
              <div className="flex flex-col items-center gap-6 rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-xl transition hover:shadow-2xl">
                <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                  <svg
                    className="h-12 w-12 text-emerald-500"
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
                <h3 className="text-2xl font-bold text-emerald-700">
                  Para Funcionários Públicos
                </h3>
                <ul className="list-none space-y-2 text-base text-slate-700">
                  <li>
                    <span className="font-semibold text-emerald-600">
                      ✔ Gestão centralizada:
                    </span>{" "}
                    visualize e priorize demandas da cidade em um só lugar.
                  </li>
                  <li>
                    <span className="font-semibold text-emerald-600">
                      ✔ Decisão baseada em dados:
                    </span>{" "}
                    use relatórios e mapas para alocar recursos de forma
                    eficiente.
                  </li>
                  <li>
                    <span className="font-semibold text-emerald-600">
                      ✔ Comunicação direta:
                    </span>{" "}
                    envie atualizações e interaja com os cidadãos de maneira
                    transparente.
                  </li>
                  <li>
                    <span className="font-semibold text-emerald-600">
                      ✔ Redução de custos:
                    </span>{" "}
                    resolva problemas rapidamente e evite gastos maiores no
                    futuro.
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
                  Veja o CityFix em Ação
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Descubra como você pode ser protagonista na transformação da
                  sua cidade. O CityFix foi criado para dar voz ao cidadão,
                  facilitar o reporte de problemas urbanos e fortalecer a
                  colaboração entre moradores e poder público. Juntos, tornamos
                  a cidade mais segura, bonita e eficiente para todos.
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
                  Reporte Problemas em Segundos
                </h3>
                <p className="text-muted-foreground">
                  Identificou um buraco, lâmpada queimada ou lixo acumulado? Com
                  o CityFix, você registra o problema em poucos cliques,
                  ajudando a prefeitura a agir mais rápido e tornando sua
                  vizinhança melhor para todos.
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
                  Mapa Interativo de Problemas
                </h3>
                <p className="text-muted-foreground">
                  Veja em tempo real os pontos críticos da cidade, acompanhe as
                  demandas do seu bairro e colabore indicando locais que
                  precisam de atenção. Transparência e participação para todos!
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
                  Acompanhe o Progresso das Soluções
                </h3>
                <p className="text-muted-foreground">
                  Receba notificações sobre cada etapa: do recebimento do seu
                  reporte até a solução. Sinta-se parte do processo de melhoria
                  e veja o impacto da sua participação na cidade.
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
                  Participe ativamente: vote nos problemas mais urgentes,
                  comente, compartilhe ideias e motive seus vizinhos a também
                  contribuir. Juntos, criamos uma cidade mais humana, conectada
                  e eficiente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section
          id="download"
          className="flex w-full flex-col items-center bg-emerald-500 py-12 text-white md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Pronto para Fazer a Diferença?
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Baixe o CityFix hoje e comece a reportar problemas de
                  infraestrutura na sua comunidade.
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-6 sm:flex-row">
                {user ? (
                  <Link
                    href="/events"
                    className="focus-visible:ring-ring inline-flex h-12 items-center justify-center rounded-md bg-white px-6 text-sm font-medium text-emerald-500 shadow transition-colors hover:bg-gray-100 focus-visible:ring-1 focus-visible:outline-none"
                  >
                    <MapPin className="mr-2 h-5 w-5" />
                    Ver Eventos
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="focus-visible:ring-ring inline-flex h-12 items-center justify-center rounded-md bg-white px-6 text-sm font-medium text-emerald-500 shadow transition-colors hover:bg-gray-100 focus-visible:ring-1 focus-visible:outline-none"
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
      <section className="flex w-full flex-col items-center bg-white py-16 md:py-28 lg:py-36">
        <div className="container px-4 md:px-6">
          <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-emerald-700">
              CityFix em números
            </h2>
            <p className="text-muted-foreground max-w-[700px] md:text-xl/relaxed">
              Acompanhe em tempo real o impacto do CityFix na sua cidade!
            </p>
          </div>
          <CityFixStats />
        </div>
      </section>

      <footer className="flex w-full flex-col items-center border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 py-4 md:h-24 md:flex-row md:py-0">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-500" />
            <p className="text-muted-foreground text-sm">
              © 2025 Eventos Locais. Todos os direitos reservados.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-muted-foreground text-sm hover:text-emerald-500"
            >
              Política de Privacidade
            </Link>
            <Link
              href="#"
              className="text-muted-foreground text-sm hover:text-emerald-500"
            >
              Termos de Serviço
            </Link>
            <Link
              href="#"
              className="text-muted-foreground text-sm hover:text-emerald-500"
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
function CityFixStats() {
  const [erros, setErros] = React.useState(0)
  const [resolvidos, setResolvidos] = React.useState(0)

  React.useEffect(() => {
    const erroTarget = 1280 // valor ilustrativo
    const resolvidosTarget = 970 // valor ilustrativo
    const erroStep = Math.ceil(erroTarget / 120)
    const resolvidosStep = Math.ceil(resolvidosTarget / 120)
    const erroInterval = setInterval(() => {
      setErros((prev) => {
        if (prev + erroStep >= erroTarget) {
          clearInterval(erroInterval)
          return erroTarget
        }
        return prev + erroStep
      })
    }, 20)
    const resolvidosInterval = setInterval(() => {
      setResolvidos((prev) => {
        if (prev + resolvidosStep >= resolvidosTarget) {
          clearInterval(resolvidosInterval)
          return resolvidosTarget
        }
        return prev + resolvidosStep
      })
    }, 20)
    return () => {
      clearInterval(erroInterval)
      clearInterval(resolvidosInterval)
    }
  }, [])

  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-12 md:flex-row">
      <div className="flex min-w-[260px] flex-col items-center rounded-2xl border border-emerald-100 bg-emerald-50 p-10 shadow-lg">
        <span className="text-5xl font-extrabold text-emerald-700">
          {erros.toLocaleString("pt-BR")}
        </span>
        <span className="mt-2 text-lg font-semibold text-slate-700">
          erros reportados por dia
        </span>
        <span className="mt-2 text-emerald-500">
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
      <div className="flex min-w-[260px] flex-col items-center rounded-2xl border border-emerald-100 bg-emerald-50 p-10 shadow-lg">
        <span className="text-5xl font-extrabold text-emerald-700">
          {resolvidos.toLocaleString("pt-BR")}
        </span>
        <span className="mt-2 text-lg font-semibold text-slate-700">
          problemas resolvidos por dia
        </span>
        <span className="mt-2 text-emerald-500">
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
