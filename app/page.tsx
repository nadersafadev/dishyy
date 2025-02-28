import { auth, currentUser } from '@clerk/nextjs/server';
import { SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import {
  UtensilsCrossed,
  Users,
  CalendarDays,
  ArrowRight,
  Heart,
  ListChecks,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';

// Types for features and steps
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default async function Home() {
  const { userId } = await auth();
  const user = await currentUser();
  const isAuthenticated = !!userId;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {isAuthenticated ? (
          // Authenticated view
          <div className="container h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="w-full max-w-2xl rounded-xl border border-border/50 bg-white/60 backdrop-blur-md shadow-lg p-8 sm:p-12 text-center space-y-8">
              <div className="flex justify-center">
                <Logo size="xl" variant="dark" />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                  Welcome back, {user?.firstName || 'there'}!
                </h1>
                <p className="text-xl text-muted-foreground">
                  Ready to create or join a dish party?
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/parties"
                  className="btn-primary px-6 py-3 rounded-lg font-medium w-full sm:w-auto"
                >
                  Go to Parties
                </Link>
                <SignOutButton>
                  <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium border border-input hover:bg-accent hover:text-accent-foreground hover-transition w-full sm:w-auto">
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </div>
          </div>
        ) : (
          // Landing page view
          <div>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
              {/* Background layers */}
              <div className="absolute inset-0">
                {/* Main background image */}
                <img
                  src="https://res.cloudinary.com/daqvjcynu/image/upload/c_fill,g_auto,h_1080,w_1920,q_90/v1740631770/food_eqfknk.jpg"
                  alt="Organized table of delicious food"
                  className="w-full h-full object-cover opacity-80"
                  style={{ objectPosition: '50% 35%' }}
                />
                {/* Overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/50" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
                <div className="absolute inset-0 backdrop-blur-[2px]" />

                {/* Animated grain effect */}
                <div className='absolute inset-0 opacity-[0.03] bg-[url("/noise.png")] bg-repeat animate-grain' />

                {/* Accent circles */}
                <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl opacity-0 animate-fade-in-delay-2 motion-safe:animate-pulse" />
                <div className="absolute bottom-1/3 left-1/4 w-[250px] h-[250px] bg-primary/10 rounded-full blur-3xl opacity-0 animate-fade-in-delay-2 motion-safe:animate-pulse motion-safe:delay-1000" />
              </div>

              {/* Content */}
              <div className="container relative z-10 py-12">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                  <div className="flex justify-center transform scale-125 opacity-0 animate-fade-in">
                    <Logo size="xl" variant="light" />
                  </div>
                  <div className="space-y-6">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white opacity-0 animate-fade-up-delay-1">
                      Make Party Planning{' '}
                      <span className="relative z-10 bg-gradient-to-r from-primary via-primary to-primary-600 bg-clip-text text-transparent">
                        Deliciously Simple
                      </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-zinc-200 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-up-delay-2">
                      Coordinate dishes, track contributions, and organize
                      potlucks with ease. No more duplicate dishes or missing
                      essentials.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 opacity-0 animate-fade-up-delay-3">
                    <Button
                      asChild
                      size="lg"
                      className="text-lg px-8 h-12 bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-primary/25 transition-all duration-200 rounded-xl"
                    >
                      <Link href="/sign-up">Get Started Free</Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 h-12 border-zinc-700 text-white hover:bg-white/5 transition-all duration-200 rounded-xl bg-transparent"
                    >
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-8 opacity-0 animate-fade-up-delay-3">
                    <div className="text-center p-3 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 shadow-lg">
                      <div className="text-3xl font-bold text-primary mb-1">
                        <span className="tabular-nums">1000</span>+
                      </div>
                      <div className="text-sm text-zinc-300 font-medium">
                        Active Parties
                      </div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 shadow-lg">
                      <div className="text-3xl font-bold text-primary mb-1">
                        <span className="tabular-nums">5000</span>+
                      </div>
                      <div className="text-sm text-zinc-300 font-medium">
                        Happy Hosts
                      </div>
                    </div>
                    <div className="text-center hidden md:block p-3 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 shadow-lg">
                      <div className="text-3xl font-bold text-primary mb-1">
                        <span className="tabular-nums">20</span>K+
                      </div>
                      <div className="text-sm text-zinc-300 font-medium">
                        Dishes Shared
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scroll indicator */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-5 h-8 border-2 border-zinc-600 rounded-full flex items-start justify-center p-1.5">
                  <div className="w-1 h-2 bg-zinc-600 rounded-full" />
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-32 relative overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-zinc-100 border-y border-border/40">
              <div className="absolute inset-0 [background-image:linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] [background-size:64px_64px] opacity-[0.05]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_0px,#00000005,transparent)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_0%_100%,#00000005,transparent)]" />
              <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center mb-20">
                  <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary inline-block mb-4">
                    Why Choose Us
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Why Choose Dishyy?
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    The smart way to organize food for your gatherings. From
                    casual potlucks to elaborate dinner parties, we've got you
                    covered.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
                  {features.map((feature, index) => (
                    <div
                      key={feature.title}
                      className="group bg-white backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border/50 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative">
                        <div className="h-16 w-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 shadow-sm">
                          <div className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300">
                            {feature.icon}
                          </div>
                        </div>
                        <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section className="py-32 relative overflow-hidden bg-gradient-to-b from-background via-zinc-50/50 to-background border-y border-border/40">
              <div className="absolute inset-0 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_0%,#00000008,transparent)]" />
              <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center mb-20">
                  <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary inline-block mb-4">
                    Simple Steps
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80">
                    How It Works
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Get your party organized in three simple steps
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                  {steps.map((step, index) => (
                    <div
                      key={step.title}
                      className="text-center relative group"
                    >
                      {index < steps.length - 1 && (
                        <div className="hidden md:block absolute top-12 left-[60%] w-[calc(100%-4rem)] h-[2px] bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
                      )}
                      <div className="relative">
                        <div className="relative h-24 w-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl rotate-45 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-90 transition-all duration-500 shadow-lg">
                          <div className="absolute inset-[1px] bg-white rounded-[1.4rem] flex items-center justify-center">
                            <div className="-rotate-45 group-hover:rotate-[-90deg] transition-all duration-500">
                              <div className="h-10 w-10 text-primary">
                                {step.icon}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4 relative">
                          <div className="absolute -inset-x-6 -inset-y-4 bg-white/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm" />
                          <h3 className="relative text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                            {step.title}
                          </h3>
                          <p className="relative text-muted-foreground text-lg max-w-sm mx-auto leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden bg-gradient-to-br from-primary/[0.03] via-white to-primary/[0.02]">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#00000008,transparent)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_0%_800px,#00000008,transparent)]" />
                <div className="absolute inset-0 [background-image:linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.05]" />
              </div>
              <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-3xl mx-auto text-center space-y-10">
                  <div className="space-y-6">
                    <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary inline-block">
                      Get Started Today
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold ">
                      Ready to Plan Your Next Party?
                    </h2>
                    <p className="text-xl text-muted-foreground">
                      Join thousands of hosts who make party planning a breeze
                      with Dishyy
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      asChild
                      size="lg"
                      className="text-lg px-12 h-14 bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <Link href="/sign-up">
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <Footer />
          </div>
        )}
      </main>
    </div>
  );
}

// Features data
const features: Feature[] = [
  {
    icon: <UtensilsCrossed className="h-6 w-6 text-primary" />,
    title: 'Smart Dish Planning',
    description:
      'Calculate exact quantities needed based on guest count. No more guessing how much food to prepare.',
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: 'Easy Coordination',
    description:
      "Let guests sign up for dishes they'll bring. Track contributions and avoid duplicate dishes effortlessly.",
  },
  {
    icon: <CalendarDays className="h-6 w-6 text-primary" />,
    title: 'Event Management',
    description:
      'Create and manage multiple events. Keep track of RSVPs and dietary preferences all in one place.',
  },
];

// Steps data
const steps: Step[] = [
  {
    icon: <CalendarDays className="h-8 w-8 text-primary" />,
    title: 'Create Your Event',
    description: 'Set up your party details, date, and number of guests',
  },
  {
    icon: <ListChecks className="h-8 w-8 text-primary" />,
    title: 'Plan the Menu',
    description: 'Add dishes and specify quantities needed per person',
  },
  {
    icon: <Heart className="h-8 w-8 text-primary" />,
    title: 'Share & Enjoy',
    description: 'Invite guests and let them choose what to bring',
  },
];
