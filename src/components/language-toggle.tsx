import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
      title={`Switch to ${language === 'en' ? 'French' : 'English'}`}
      className="font-bold whitespace-nowrap"
    >
      {language.toUpperCase()}
    </Button>
  )
}