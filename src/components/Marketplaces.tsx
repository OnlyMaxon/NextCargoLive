import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MARKETPLACES } from '@/lib/constants'
import { ArrowSquareOut, ShoppingCart } from '@phosphor-icons/react'

export function Marketplaces() {
  const handleOpenMarketplace = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <h2 className="text-sm font-medium text-muted-foreground">Marketplaces</h2>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Card className="border shadow-sm">
        <CardContent className="py-4 px-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <ShoppingCart size={20} weight="bold" className="text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Shop from Poland 🇵🇱</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Order from these marketplaces and use our warehouse address. We'll handle the delivery to Azerbaijan!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3">
        {MARKETPLACES.map((marketplace) => (
          <Card 
            key={marketplace.id} 
            className="border shadow-sm"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-4xl flex-shrink-0">{marketplace.logo}</div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base font-semibold">{marketplace.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {marketplace.description}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full h-10 text-sm"
                onClick={() => handleOpenMarketplace(marketplace.url)}
              >
                Visit {marketplace.name}
                <ArrowSquareOut size={16} className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
