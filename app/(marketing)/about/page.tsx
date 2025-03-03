import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users2, Calendar, Utensils } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Dishyy | Making Food Parties Simple & Delightful',
  description:
    'Learn how Dishyy revolutionizes the way friends organize and enjoy food parties. Our platform makes it easy to plan, coordinate, and celebrate memorable gatherings.',
  openGraph: {
    title: 'About Dishyy | Making Food Parties Simple & Delightful',
    description:
      'Learn how Dishyy revolutionizes the way friends organize and enjoy food parties. Our platform makes it easy to plan, coordinate, and celebrate memorable gatherings.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-6 lg:px-8 py-10">
      <div className="relative overflow-hidden bg-background">
        {/* Decorative Elements */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        {/* Hero Section */}
        <div className="relative text-center">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />
          <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-8 animate-fade-in">
            Our Story
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl bg-clip-text  bg-gradient-to-r from-primary to-primary/80">
            Building the Future of Food Gatherings
          </h1>
          <div className="mt-6 flex flex-col gap-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
            <p>
              Founded in 2024, Dishyy emerged from a simple observation: while
              food brings people together, organizing food parties often keeps
              them apart. We set out to change that.
            </p>
            <p>
              What started as a solution for a group of friends has grown into a
              platform that helps thousands of people create memorable food
              gatherings, strengthen connections, and celebrate life's moments
              together.
            </p>
          </div>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/sign-up">
              <Button size="lg" className="group">
                Join Our Community
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold leading-6 text-muted-foreground hover:text-primary transition-colors"
            >
              Get in touch <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-24">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 bg-card/50 backdrop-blur-sm rounded-2xl p-8 border shadow-lg">
            <div className="text-center p-4 space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                  <path d="m12 6 4 4-4 4-4-4 4-4Z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Our Vision</h3>
              <p className="text-sm text-muted-foreground">
                To make every food gathering an effortless celebration of
                connection and community
              </p>
            </div>
            <div className="text-center p-4 space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Our Values</h3>
              <p className="text-sm text-muted-foreground">
                Simplicity, community, and the joy of shared experiences guide
                everything we do
              </p>
            </div>
            <div className="text-center p-4 space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Our Promise</h3>
              <p className="text-sm text-muted-foreground">
                To continuously innovate and improve how people come together
                over food
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {/* <div className="mt-24">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 bg-card/50 backdrop-blur-sm rounded-2xl p-8 border shadow-lg">
            <div className="text-center p-4 space-y-2">
              <p className="text-4xl font-bold text-primary">5000+</p>
              <p className="text-sm text-muted-foreground">Happy Users</p>
            </div>
            <div className="text-center p-4 space-y-2">
              <p className="text-4xl font-bold text-primary">10k+</p>
              <p className="text-sm text-muted-foreground">Parties Organized</p>
            </div>
            <div className="text-center p-4 space-y-2">
              <p className="text-4xl font-bold text-primary">50k+</p>
              <p className="text-sm text-muted-foreground">Dishes Shared</p>
            </div>
          </div>
        </div> */}

        {/* Mission Section */}
        <div className="mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-x-2 text-sm text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Our Mission
              </div>
              <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-secondary">
                Revolutionizing Food Party Planning
              </h2>
              <p className="text-lg text-muted-foreground">
                We're on a mission to make organizing food parties effortless
                and enjoyable. Whether it's a potluck dinner, a barbecue, or a
                holiday feast, Dishyy provides the tools you need to coordinate
                seamlessly with your friends and family.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/sign-up">
                  <Button size="lg" className="group">
                    Start Planning Your Party
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary rounded-2xl opacity-10 blur-2xl" />
              <div className="relative h-[400px] rounded-2xl overflow-hidden ring-1 ring-white/10">
                <Image
                  src="/images/about-hero.jpg"
                  alt="Friends enjoying a dinner party"
                  fill
                  className="object-cover transition-transform hover:scale-105 duration-700"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Why Choose Dishyy?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-card/50 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Easy Planning</h3>
              <p className="text-muted-foreground">
                Create and manage your food parties with just a few clicks. Our
                intuitive interface makes party planning a breeze.
              </p>
            </div>
            <div className="group p-8 rounded-2xl bg-card/50 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Coordination</h3>
              <p className="text-muted-foreground">
                Keep track of who's bringing what, dietary preferences, and
                RSVPs all in one place. No more duplicate dishes or confusion.
              </p>
            </div>
            <div className="group p-8 rounded-2xl bg-card/50 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Utensils className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Memorable Experiences
              </h3>
              <p className="text-muted-foreground">
                Focus on creating memories with your loved ones while we handle
                the organizational details.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-24">
          <div className="text-center relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative">
              <span className="bg-background px-6 text-sm text-muted-foreground">
                THE TEAM
              </span>
            </div>
            <h2 className="mt-8 text-3xl font-bold tracking-tight mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Meet the Passionate Minds Behind Dishyy
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're a passionate team of food lovers and tech enthusiasts who
              believe in the power of shared meals to bring communities
              together. Our diverse backgrounds in technology, design, and
              hospitality help us create the best possible experience for our
              users.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-10 blur-2xl" />
            <div className="relative text-center bg-card/50 backdrop-blur-sm rounded-2xl p-12 border shadow-lg">
              <h2 className="text-3xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Ready to Host Your Next Party?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of hosts who are already using Dishyy to create
                memorable food gatherings.
              </p>
              <Link href="/sign-up">
                <Button size="lg" variant="default" className="group">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Element */}
        <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>
    </div>
  );
}
