import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MARKETPLACES } from '@/lib/constants'
import { ArrowSquareOut, Info } from '@phosphor-icons/react'

export function Marketplaces() {
  const handleOpenMarketplace = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Polish Marketplaces</h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">Shop online and ship to our warehouse</p>
      </div>

      <Alert className="text-base">
        <Info className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
        <AlertDescription className="text-sm sm:text-base leading-relaxed">
          Order from these Polish marketplaces and use our warehouse address. We'll handle the delivery to Azerbaijan!
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-4">
        {MARKETPLACES.map((marketplace) => (
          <Card key={marketplace.id} className="hover:shadow-md transition-all active:scale-[0.98]">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-4xl sm:text-5xl flex-shrink-0">{marketplace.logo}</div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg">{marketplace.name}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1.5 leading-relaxed">
                      {marketplace.description}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full h-11 sm:h-12 text-sm sm:text-base"
                onClick={() => handleOpenMarketplace(marketplace.url)}
              >
                <ArrowSquareOut size={20} weight="bold" className="mr-2 sm:w-[22px] sm:h-[22px]" />
                Visit {marketplace.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50 border-2 border-dashed">
        <CardContent className="pt-5 sm:pt-6">
          <div className="text-center space-y-3">
            <p className="font-semibold text-sm sm:text-base">Our Warehouse Address in Poland:</p>
            <div className="text-sm sm:text-base space-y-1.5 text-muted-foreground">
              <p className="font-mono">Cargo Tracker Logistics</p>
              <p className="font-mono">ul. Składowa 12</p>
              <p className="font-mono">01-142 Warszawa, Poland</p>
              <p className="font-mono">Tel: +48 22 123 4567</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
