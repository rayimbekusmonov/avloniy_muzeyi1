'use client'
import 'quill/dist/quill.snow.css'
import { useEffect, useRef } from 'react'

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const quillRef = useRef<any>(null)

    useEffect(() => {
        if (typeof window === 'undefined' || quillRef.current) return

        import('quill').then(({ default: Quill }) => {
            import('quill/dist/quill.snow.css')
            
            if (!editorRef.current) return
            
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder: placeholder || 'Matn kiriting...',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link'],
                        ['clean'],
                    ],
                },
            })

            quillRef.current.on('text-change', () => {
                onChange(quillRef.current.root.innerHTML)
            })

            if (value) {
                quillRef.current.root.innerHTML = value
            }
        })
    }, [])

    return (
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid rgba(27,58,107,0.2)' }}>
            <div ref={editorRef} style={{ minHeight: '200px', fontSize: '15px' }} />
        </div>
    )
}
