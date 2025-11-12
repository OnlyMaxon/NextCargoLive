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
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Polish Marketplaces</h2>
        <p className="text-muted-foreground mt-1">Shop online and ship to our warehouse</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Order from these Polish marketplaces and use our warehouse address. We'll handle the delivery to Azerbaijan!
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MARKETPLACES.map((marketplace) => (
          <Card key={marketplace.id} className="hover:shadow-md transition-all">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{marketplace.logo}</div>
                  <div>
                    <CardTitle className="text-lg">{marketplace.name}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {marketplace.description}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => handleOpenMarketplace(marketplace.url)}
              >
                <ArrowSquareOut size={20} weight="bold" className="mr-2" />
                Visit {marketplace.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50 border-2 border-dashed">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="font-semibold">Our Warehouse Address in Poland:</p>
            <div className="text-sm space-y-1 text-muted-foreground">
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
