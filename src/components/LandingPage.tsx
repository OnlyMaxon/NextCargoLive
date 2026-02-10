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
  CheckCircle
} from '@phosphor-icons/react'

interface LandingPageProps {
  onLoginClick: () => void
  onRegisterClick: () => void
}

export function LandingPage({ onLoginClick, onRegisterClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Package size={22} weight="bold" className="text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">NextCargo</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onLoginClick}>
              Login
            </Button>
            <Button onClick={onRegisterClick}>
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-sm font-medium text-muted-foreground">
            Poland → Azerbaijan Delivery
          </p>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
            Fast & Reliable Cargo Delivery Service
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Shop from your favorite Polish online stores — Allegro, Amazon.pl, IKEA and more. 
            We'll deliver your packages safely to Azerbaijan with real-time tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto h-12 px-6" 
              onClick={onRegisterClick}
            >
              Get Started
              <ArrowRight size={18} className="ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto h-12 px-6" 
              onClick={onLoginClick}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Simple 3-step process to get your packages from Poland to Azerbaijan
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
            ].map((item) => (
              <Card key={item.step} className="border shadow-sm">
                <CardContent className="pt-6 pb-6 px-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <item.icon size={22} className="text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Step {item.step}</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
              Why Choose NextCargo?
            </h2>
            <p className="text-muted-foreground">
              We provide the best cargo delivery experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {[
              {
                icon: Clock,
                title: 'Fast Delivery',
                description: '7-14 days delivery time'
              },
              {
                icon: ShieldCheck,
                title: 'Safe & Secure',
                description: 'Insured packages'
              },
              {
                icon: MapPin,
                title: 'Real-time Tracking',
                description: 'Track every step'
              },
              {
                icon: Phone,
                title: '24/7 Support',
                description: 'Always ready to help'
              }
            ].map((feature) => (
              <Card key={feature.title} className="border shadow-sm text-center p-5">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon size={24} className="text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto border shadow-sm">
            <CardContent className="p-8 sm:p-10 text-center space-y-5">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto">
                <Package size={28} weight="bold" className="text-primary-foreground" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold">
                Ready to Start Shipping?
              </h2>
              <p className="text-muted-foreground">
                Join thousands of customers who trust NextCargo for their Poland to Azerbaijan deliveries.
                Registration is free and takes less than a minute.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto h-12 px-8" 
                  onClick={onRegisterClick}
                >
                  Create Free Account
                </Button>
                <Button 
                  size="lg" 
                  variant="ghost" 
                  onClick={onLoginClick}
                >
                  Sign In →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Package size={22} weight="bold" className="text-primary-foreground" />
              </div>
              <div>
                <span className="font-semibold">NextCargo</span>
                <p className="text-sm text-muted-foreground">Poland → Azerbaijan</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <a 
                href="mailto:support@nextcargo.eu" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Envelope size={16} />
                support@nextcargo.eu
              </a>
              <a 
                href="tel:+48576925110" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Phone size={16} />
                +48 576 925 110
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            © 2026 NextCargo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
