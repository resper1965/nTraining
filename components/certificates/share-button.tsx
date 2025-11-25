'use client'

import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'

interface ShareCertificateButtonProps {
  verificationCode: string
}

export function ShareCertificateButton({ verificationCode }: ShareCertificateButtonProps) {
  const handleShare = async () => {
    const url = `${window.location.origin}/certificates/verify/${verificationCode}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu Certificado',
          text: 'Confira meu certificado de conclusão de curso',
          url,
        })
      } catch (error) {
        // User cancelled or error occurred
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        alert('Link copiado para a área de transferência!')
      } catch (error) {
        console.error('Error copying to clipboard:', error)
      }
    }
  }

  return (
    <Button variant="outline" onClick={handleShare}>
      <Share2 className="h-4 w-4 mr-2" />
      Compartilhar
    </Button>
  )
}

