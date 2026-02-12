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
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="w-full max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Package size={20} weight="bold" className="text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">NextCargo</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onLoginClick}>
              Login
            </Button>
            <Button size="sm" onClick={onRegisterClick}>
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-12 sm:py-20">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          {/* Promo Banner */}
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            <span className="text-lg">🎉</span>
            <span>First order — <strong>50% OFF!</strong></span>
          </div>
          
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">
            Poland → Azerbaijan Delivery
          </p>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight">
            Fast & Reliable Cargo Delivery Service
          </h1>
          
          <p className="text-sm sm:text-base text-muted-foreground">
            Shop from your favorite Polish online stores — Allegro, Amazon.pl, IKEA and more. 
            We'll deliver your packages safely to Azerbaijan with real-time tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button 
              className="w-full sm:w-auto h-11 px-6" 
              onClick={onRegisterClick}
            >
              Get Started
              <ArrowRight size={16} className="ml-2" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto h-11 px-6" 
              onClick={onLoginClick}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
              How It Works
            </h2>
            <p className="text-sm text-muted-foreground">
              Simple 3-step process to get your packages from Poland to Azerbaijan
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
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
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon size={18} className="text-muted-foreground" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">Step {item.step}</span>
                  </div>
                  <h3 className="text-base font-medium mb-1">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
              Why Choose NextCargo?
            </h2>
            <p className="text-sm text-muted-foreground">
              We provide the best cargo delivery experience
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {[
              {
                icon: Clock,
                title: 'Fast Delivery',
                description: '7-14 days'
              },
              {
                icon: ShieldCheck,
                title: 'Safe & Secure',
                description: 'Insured'
              },
              {
                icon: MapPin,
                title: 'Tracking',
                description: 'Real-time'
              },
              {
                icon: Phone,
                title: 'Support',
                description: '24/7'
              }
            ].map((feature) => (
              <Card key={feature.title} className="border shadow-sm text-center p-4">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                  <feature.icon size={20} className="text-muted-foreground" />
                </div>
                <h3 className="text-sm font-medium mb-0.5">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="w-full max-w-7xl mx-auto px-4">
          <Card className="max-w-lg mx-auto border shadow-sm">
            <CardContent className="p-6 sm:p-8 text-center space-y-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto">
                <Package size={24} weight="bold" className="text-primary-foreground" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold">
                Ready to Start Shipping?
              </h2>
              <p className="text-sm text-muted-foreground">
                Join thousands of customers who trust NextCargo. Registration is free.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <Button 
                  className="w-full sm:w-auto h-10 px-6" 
                  onClick={onRegisterClick}
                >
                  Create Free Account
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full sm:w-auto"
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
      <footer className="border-t py-8">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Package size={18} weight="bold" className="text-primary-foreground" />
              </div>
              <div>
                <span className="font-semibold text-sm">NextCargo</span>
                <p className="text-xs text-muted-foreground">Poland → Azerbaijan</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-xs">
              <a 
                href="mailto:support@nextcargo.eu" 
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <Envelope size={14} />
                support@nextcargo.eu
              </a>
              <a 
                href="tel:+48576925110" 
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <Phone size={14} />
                +48 576 925 110
              </a>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t text-center text-xs text-muted-foreground">
            © 2026 NextCargo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
