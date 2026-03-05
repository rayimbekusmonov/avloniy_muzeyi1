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
            if (!editorRef.current) return

            quillRef.current = new Quill(editorRef.current, {
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

            quillRef.current.on('text-change', () => {
                onChange(quillRef.current.root.innerHTML)
            })

            if (value) {
                quillRef.current.root.innerHTML = value
            }
        })
    }, [])

    return (
        <div style={{
            background: '#fff',
            borderRadius: '8px',
            border: '1px solid rgba(27,58,107,0.2)',
            overflow: 'hidden',
        }}>
            <div ref={editorRef} style={{ minHeight: '300px', fontSize: '15px', lineHeight: '1.7' }} />
            <style>{`
                .ql-toolbar {
                    border: none !important;
                    border-bottom: 1px solid rgba(27,58,107,0.15) !important;
                    background: #f8f9fc;
                    flex-wrap: wrap;
                    padding: 8px !important;
                }
                .ql-container {
                    border: none !important;
                    font-size: 15px !important;
                    font-family: inherit !important;
                }
                .ql-editor {
                    min-height: 300px;
                    padding: 16px !important;
                    line-height: 1.8 !important;
                }
                .ql-editor.ql-blank::before {
                    color: #aaa !important;
                    font-style: normal !important;
                }
                .ql-editor h1 { font-size: 2em; font-weight: 700; margin: 16px 0 8px; }
                .ql-editor h2 { font-size: 1.5em; font-weight: 600; margin: 14px 0 6px; }
                .ql-editor h3 { font-size: 1.2em; font-weight: 600; margin: 12px 0 4px; }
                .ql-editor blockquote {
                    border-left: 4px solid #C9A84C;
                    padding-left: 16px;
                    color: #555;
                    font-style: italic;
                    margin: 16px 0;
                }
                .ql-editor code, .ql-editor pre {
                    background: #f4f4f4;
                    border-radius: 4px;
                    padding: 2px 6px;
                    font-family: monospace;
                }
            `}</style>
        </div>
    )
}