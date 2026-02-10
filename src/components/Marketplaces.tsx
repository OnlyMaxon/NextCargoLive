import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MARKETPLACES } from '@/lib/constants'
import { ArrowSquareOut, Sparkle, ShoppingCart, Globe } from '@phosphor-icons/react'

export function Marketplaces() {
  const handleOpenMarketplace = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-muted-foreground">Marketplaces</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-border via-transparent to-transparent" />
      </div>

      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
        <CardContent className="relative py-5 px-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
              <ShoppingCart size={24} weight="bold" className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 mb-1">Shop from Poland 🇵🇱</h3>
              <p className="text-sm text-amber-700 leading-relaxed">
                Order from these Polish marketplaces and use our warehouse address. We'll handle the delivery to Azerbaijan! 🇦🇿
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {MARKETPLACES.map((marketplace, index) => (
          <Card 
            key={marketplace.id} 
            className="hover-lift bg-white/80 backdrop-blur border-white/50 shadow-lg shadow-primary/5 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="text-5xl sm:text-6xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">{marketplace.logo}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg sm:text-xl font-bold">{marketplace.name}</CardTitle>
                      {index === 0 && (
                        <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                          <Sparkle size={12} weight="fill" />
                          Popular
                        </span>
                      )}
                    </div>
                    <CardDescription className="text-xs sm:text-sm mt-2 leading-relaxed">
                      {marketplace.description}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <Button
                className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold gradient-bg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 group"
                onClick={() => handleOpenMarketplace(marketplace.url)}
              >
                <Globe size={20} weight="bold" className="mr-2" />
                Visit {marketplace.name}
                <ArrowSquareOut size={18} weight="bold" className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
