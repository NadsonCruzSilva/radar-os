import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui'
import { generateProjectMarkdown } from '@/lib/ai-export'
import { useApp } from '@/context/AppContext'
import { toast } from 'sonner'

interface ExportAIDialogProps {
  open: boolean
  onClose: () => void
}

export function ExportAIDialog({ open, onClose }: ExportAIDialogProps) {
  const data = useApp()
  const [copied, setCopied] = useState(false)

  if (!open) return null

  const markdownContent = generateProjectMarkdown({
    etapas: data.etapas,
    artigos: data.artigos,
    itensEscopo: data.itensEscopo,
    decisoes: data.decisoes,
    artefatos: data.artefatos,
  })

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdownContent)
      setCopied(true)
      toast.success('Resumo copiado com sucesso! Cole no ChatGPT, Claude ou Gemini.')
      setTimeout(() => setCopied(false), 2500)
    } catch {
      toast.error('Não foi possível copiar automaticamente. Selecione e copie o texto abaixo.')
    }
  }

  function handleDownload() {
    try {
      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `radar-os-relatorio-tcc-${new Date().toISOString().split('T')[0]}.md`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('Arquivo .md baixado com sucesso!')
    } catch {
      toast.error('Erro ao baixar arquivo.')
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--color-ink)] text-[var(--color-surface)] flex items-center justify-center text-sm font-mono font-bold">
                ✦
              </div>
              <div>
                <h3 className="font-mono text-sm sm:text-base font-bold text-[var(--color-ink)] uppercase tracking-wide">
                  Exportar Contexto para IA
                </h3>
                <p className="text-xs text-[var(--color-ink-muted)]">
                  Relatório completo estruturado em Markdown com prompt pronto para feedback de banca
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-border)]/50 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Quick Instructions & Actions */}
          <div className="px-4 sm:px-6 py-3.5 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-[var(--color-ink-muted)] flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-[var(--color-done)]" />
              Inclui dados atualizados de etapas, artigos, escopo MVP e riscos.
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="text-xs"
              >
                Baixar .md
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCopy}
                className="text-xs min-w-[120px]"
              >
                {copied ? '✓ Copiado!' : '✦ Copiar Texto'}
              </Button>
            </div>
          </div>

          {/* Markdown Content Preview */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[var(--color-bg)] font-mono text-xs text-[var(--color-ink)] leading-relaxed select-all">
            <pre className="whitespace-pre-wrap break-words font-mono text-[11px] sm:text-xs text-[var(--color-ink)]">
              {markdownContent}
            </pre>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between">
            <span className="text-[11px] text-[var(--color-ink-muted)] font-mono">
              Compatível com ChatGPT, Claude, Gemini, DeepSeek e Perplexity
            </span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
