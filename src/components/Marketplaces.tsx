import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MARKETPLACES } from '@/lib/constants'
import { ArrowSquareOut, ShoppingCart } from '@phosphor-icons/react'
import { useTranslation, translations } from '@/lib/i18n'

const txt = translations.marketplaces
const navTxt = translations.nav

export function Marketplaces() {
  const { language } = useTranslation()

  const handleOpenMarketplace = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <h2 className="text-xs font-medium text-muted-foreground">{navTxt.apps[language]}</h2>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Card className="border shadow-sm">
        <CardContent className="py-3 px-3">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <ShoppingCart size={16} weight="bold" className="text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm mb-0.5">{txt.title[language]} 🇵🇱</h3>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {txt.subtitle[language]}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-2">
        {MARKETPLACES.map((marketplace) => (
          <Card 
            key={marketplace.id} 
            className="border shadow-sm"
          >
            <CardHeader className="pb-2 pt-3 px-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="text-3xl flex-shrink-0">{marketplace.logo}</div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm font-semibold">{marketplace.name}</CardTitle>
                    <CardDescription className="text-[10px] mt-0.5 line-clamp-2">
                      {marketplace.description}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3 px-3">
              <Button
                variant="outline"
                className="w-full h-8 text-xs"
                onClick={() => handleOpenMarketplace(marketplace.url)}
              >
                {txt.visitStore[language]} {marketplace.name}
                <ArrowSquareOut size={14} className="ml-1.5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
