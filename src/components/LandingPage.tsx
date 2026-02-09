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
  Globe
} from '@phosphor-icons/react'

interface LandingPageProps {
  onLoginClick: () => void
  onRegisterClick: () => void
}

export function LandingPage({ onLoginClick, onRegisterClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Package size={24} weight="bold" className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">NextCargo</span>
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
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Globe size={18} weight="bold" />
            Poland → Azerbaijan Delivery
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Fast & Reliable Cargo Delivery from{' '}
            <span className="text-primary">Poland</span> to{' '}
            <span className="text-primary">Azerbaijan</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Shop from your favorite Polish online stores — Allegro, Amazon.pl, IKEA and more. 
            We'll deliver your packages safely to Azerbaijan with real-time tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg" onClick={onRegisterClick}>
              Get Started Free
              <ArrowRight size={20} weight="bold" className="ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg" onClick={onLoginClick}>
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple 3-step process to get your packages from Poland to Azerbaijan
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                1
              </div>
              <CardContent className="pt-8 pb-6 px-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Package size={32} weight="duotone" className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Shop Online</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Order from any Polish online store and use our warehouse address in Warsaw as your delivery address.
                </p>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                2
              </div>
              <CardContent className="pt-8 pb-6 px-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Truck size={32} weight="duotone" className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">We Ship It</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Once your package arrives at our warehouse, we consolidate and ship it directly to Azerbaijan.
                </p>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                3
              </div>
              <CardContent className="pt-8 pb-6 px-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <CheckCircle size={32} weight="duotone" className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Receive Package</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track your shipment in real-time and receive it at your doorstep in Azerbaijan.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Why Choose NextCargo?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide the best cargo delivery experience with premium features
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock size={28} weight="duotone" className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">7-14 days delivery time from Poland to Azerbaijan</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={28} weight="duotone" className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Safe & Secure</h3>
              <p className="text-sm text-muted-foreground">Your packages are insured and handled with care</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin size={28} weight="duotone" className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Real-time Tracking</h3>
              <p className="text-sm text-muted-foreground">Track your shipment status at every step</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone size={28} weight="duotone" className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">Our support team is always ready to help you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Warehouse Address */}
      <section className="bg-primary text-primary-foreground py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Our Warehouse in Poland</h2>
            <p className="text-lg opacity-90 mb-8">
              Use this address when shopping from Polish online stores
            </p>
            
            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-6 sm:p-8">
                <div className="text-left space-y-2 font-mono text-base sm:text-lg">
                  <p className="font-semibold">NextCargo Logistics</p>
                  <p>ul. Składowa 12</p>
                  <p>01-142 Warszawa, Poland</p>
                  <p className="pt-2">Tel: +48 22 123 4567</p>
                </div>
              </CardContent>
            </Card>
            
            <p className="mt-6 text-sm opacity-75">
              Add your FIN code to the address (e.g., "NextCargo - ABC1234") so we can identify your packages
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Ready to Start Shipping?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of customers who trust NextCargo for their Poland to Azerbaijan deliveries.
              Registration is free and takes less than a minute.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg" onClick={onRegisterClick}>
                Create Free Account
                <ArrowRight size={20} weight="bold" className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg" onClick={onLoginClick}>
                Already have an account? Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Package size={24} weight="bold" className="text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-bold">NextCargo</span>
                <p className="text-sm text-muted-foreground">Poland → Azerbaijan Delivery</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="mailto:support@nextcargo.eu" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Envelope size={18} />
                support@nextcargo.eu
              </a>
              <a href="tel:+48221234567" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone size={18} />
                +48 22 123 4567
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
