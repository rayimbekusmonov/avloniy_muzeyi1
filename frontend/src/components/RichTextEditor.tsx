'use client'
import 'quill/dist/quill.snow.css'
import { useEffect, useRef, useCallback } from 'react'

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const editorRef = useRef<HTMLDivElement>(null)
    const quillRef = useRef<any>(null)
    const onChangeRef = useRef(onChange)

    // onChange ni ref da saqlash — stale closure oldini olish
    useEffect(() => {
        onChangeRef.current = onChange
    }, [onChange])

    useEffect(() => {
        if (typeof window === 'undefined') return

        let quill: any = null

        import('quill').then(({ default: Quill }) => {
            if (!editorRef.current) return

            // Agar allaqachon Quill yaratilgan bo'lsa, qayta yaratmaymiz
            if (quillRef.current) return

            quill = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder: placeholder || 'Matn kiriting...',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, 4, false] }],
                        [{ font: [] }],
                        [{ size: ['small', false, 'large', 'huge'] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ color: [] }, { background: [] }],
                        [{ align: [] }],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        [{ indent: '-1' }, { indent: '+1' }],
                        ['blockquote', 'code-block'],
                        ['link', 'image', 'video'],
                        ['clean'],
                    ],
                },
            })

            quillRef.current = quill

            quill.on('text-change', () => {
                onChangeRef.current(quill.root.innerHTML)
            })

            if (value) {
                quill.root.innerHTML = value
            }
        })

        // Cleanup — Quill instance ni tozalash
        return () => {
            if (quillRef.current) {
                quillRef.current.off('text-change')
                quillRef.current = null
            }
            // DOM ni tozalash
            if (editorRef.current) {
                const toolbar = containerRef.current?.querySelector('.ql-toolbar')
                if (toolbar) toolbar.remove()
            }
        }
    }, []) // Bo'sh dependency — faqat mount/unmount da ishlaydi

    return (
        <div ref={containerRef} style={{
            background: 'var(--bg-input)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
        }}>
            <div ref={editorRef} style={{ minHeight: '300px', fontSize: '15px', lineHeight: '1.7' }} />
            <style>{`
                .ql-toolbar {
                    border: none !important;
                    border-bottom: 1px solid var(--border-color) !important;
                    background: var(--bg-secondary) !important;
                    flex-wrap: wrap;
                    padding: 8px !important;
                }
                .ql-toolbar button, .ql-toolbar .ql-picker {
                    color: var(--text-main) !important;
                }
                .ql-stroke {
                    stroke: var(--text-main) !important;
                }
                .ql-fill {
                    fill: var(--text-main) !important;
                }
                .ql-picker-options {
                    background-color: var(--bg-card) !important;
                    border-color: var(--border-color) !important;
                    color: var(--text-main) !important;
                }
                .ql-container {
                    border: none !important;
                    font-size: 15px !important;
                    font-family: inherit !important;
                    color: var(--text-main) !important;
                }
                .ql-editor {
                    min-height: 300px;
                    padding: 16px !important;
                    line-height: 1.8 !important;
                    color: var(--text-main) !important;
                }
                .ql-editor.ql-blank::before {
                    color: var(--text-muted) !important;
                    font-style: normal !important;
                }
                .ql-editor h1, .ql-editor h2, .ql-editor h3 {
                    color: var(--text-heading) !important;
                }
                .ql-editor blockquote {
                    border-left: 4px solid var(--gold) !important;
                    padding-left: 16px;
                    color: var(--text-muted) !important;
                    font-style: italic;
                    margin: 16px 0;
                }
                .ql-editor code, .ql-editor pre {
                    background: var(--bg-secondary) !important;
                    color: var(--text-main) !important;
                    border-radius: 4px;
                    padding: 2px 6px;
                    font-family: monospace;
                }
            `}</style>
        </div>
    )
}
