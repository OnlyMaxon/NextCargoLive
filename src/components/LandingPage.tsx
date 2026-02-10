import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Package, 
  Truck, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Phone,
  Envelope,
  ArrowRight,
  CheckCircle,
  Globe,
  Sparkle,
  RocketLaunch,
  Star
} from '@phosphor-icons/react'

interface LandingPageProps {
  onLoginClick: () => void
  onRegisterClick: () => void
}

export function LandingPage({ onLoginClick, onRegisterClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 gradient-bg rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <Package size={24} weight="bold" className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight gradient-text">NextCargo</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onLoginClick} className="font-medium hover:bg-primary/10">
              Login
            </Button>
            <Button onClick={onRegisterClick} className="gradient-bg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5">
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur text-primary px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-primary/10 border border-primary/20">
            <Sparkle size={18} weight="fill" className="text-amber-500" />
            Poland → Azerbaijan Delivery
            <Sparkle size={18} weight="fill" className="text-amber-500" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Fast & Reliable Cargo{' '}
            <br className="hidden sm:block" />
            <span className="gradient-text">Delivery Service</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Shop from your favorite Polish online stores — Allegro, Amazon.pl, IKEA and more. 
            We'll deliver your packages safely to Azerbaijan with{' '}
            <span className="font-semibold text-foreground">real-time tracking</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button 
              size="lg" 
              className="w-full sm:w-auto h-14 px-8 text-lg gradient-bg shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1 group" 
              onClick={onRegisterClick}
            >
              <RocketLaunch size={22} weight="bold" className="mr-2 group-hover:animate-bounce" />
              Get Started Free
              <ArrowRight size={20} weight="bold" className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto h-14 px-8 text-lg border-2 hover:bg-primary/5 transition-all duration-300" 
              onClick={onLoginClick}
            >
              Sign In
            </Button>
          </div>
          
          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} weight="fill" className="text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-medium">1000+ Happy Customers</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck size={18} weight="fill" className="text-green-500" />
              Insured Delivery
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Globe size={16} weight="bold" />
              Simple Process
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple 3-step process to get your packages from Poland to Azerbaijan
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: 1,
                icon: Package,
                title: 'Shop Online',
                description: 'Order from any Polish online store and use our warehouse address in Warsaw.'
              },
              {
                step: 2,
                icon: Truck,
                title: 'We Ship It',
                description: 'Once your package arrives, we consolidate and ship it directly to Azerbaijan.'
              },
              {
                step: 3,
                icon: CheckCircle,
                title: 'Receive Package',
                description: 'Track your shipment in real-time and receive it at your doorstep.'
              }
            ].map((item, index) => (
              <Card 
                key={item.step} 
                className="relative overflow-hidden group hover-lift bg-white/70 backdrop-blur border-white/50 shadow-xl shadow-primary/5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 right-4 w-12 h-12 gradient-bg rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/25">
                  {item.step}
                </div>
                <CardContent className="relative pt-8 pb-8 px-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <item.icon size={32} weight="duotone" className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight size={24} weight="bold" className="text-primary/30" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Star size={16} weight="fill" />
              Premium Features
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Why Choose <span className="gradient-text">NextCargo</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide the best cargo delivery experience with premium features
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Clock,
                title: 'Fast Delivery',
                description: '7-14 days delivery time from Poland to Azerbaijan',
                color: 'from-amber-500/20 to-orange-500/20',
                iconColor: 'text-amber-500'
              },
              {
                icon: ShieldCheck,
                title: 'Safe & Secure',
                description: 'Your packages are insured and handled with care',
                color: 'from-green-500/20 to-emerald-500/20',
                iconColor: 'text-green-500'
              },
              {
                icon: MapPin,
                title: 'Real-time Tracking',
                description: 'Track your shipment status at every step',
                color: 'from-blue-500/20 to-cyan-500/20',
                iconColor: 'text-blue-500'
              },
              {
                icon: Phone,
                title: '24/7 Support',
                description: 'Our support team is always ready to help',
                color: 'from-purple-500/20 to-pink-500/20',
                iconColor: 'text-purple-500'
              }
            ].map((feature) => (
              <Card 
                key={feature.title}
                className="group hover-lift text-center p-6 bg-white/70 backdrop-blur border-white/50 shadow-lg shadow-primary/5 overflow-hidden relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon size={32} weight="duotone" className={feature.iconColor} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto overflow-hidden border-0 shadow-2xl">
            <div className="animated-gradient p-[2px] rounded-xl">
              <div className="bg-background rounded-xl p-8 sm:p-12">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-primary/30 pulse-glow">
                    <Package size={40} weight="bold" className="text-white" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    Ready to Start <span className="gradient-text">Shipping</span>?
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                    Join thousands of customers who trust NextCargo for their Poland to Azerbaijan deliveries.
                    Registration is <span className="font-semibold text-foreground">free</span> and takes less than a minute.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto h-14 px-10 text-lg gradient-bg shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1" 
                      onClick={onRegisterClick}
                    >
                      Create Free Account
                      <ArrowRight size={20} weight="bold" className="ml-2" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="ghost" 
                      className="w-full sm:w-auto h-14 px-8 text-lg hover:bg-primary/10" 
                      onClick={onLoginClick}
                    >
                      Sign In →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 gradient-bg rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <Package size={24} weight="bold" className="text-white" />
              </div>
              <div>
                <span className="text-lg font-bold gradient-text">NextCargo</span>
                <p className="text-sm text-muted-foreground">Poland → Azerbaijan Delivery</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <a 
                href="mailto:support@nextcargo.eu" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Envelope size={18} className="text-primary" />
                </div>
                support@nextcargo.eu
              </a>
              <a 
                href="tel:+48576925110" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Phone size={18} className="text-primary" />
                </div>
                +48 576 925 110
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2026 NextCargo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
