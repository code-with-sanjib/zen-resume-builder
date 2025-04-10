
import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Button } from './button'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Link as LinkIcon 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  height?: number
}

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = 'Start typing...',
  className,
  height = 200
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none focus:outline-none min-h-[100px] p-3 rounded-md border border-input bg-background',
          className
        ),
        style: `height: ${height}px; overflow-y: auto`,
        placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    // Update editor content when value prop changes externally
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [editor, value])

  if (!editor) {
    return null
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
  
    // cancelled
    if (url === null) {
      return
    }
  
    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
  
    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  // Create a reusable function for determining button active state
  const isActive = (type: string) => {
    if (editor.isActive(type)) {
      return 'bg-muted'
    }
    return ''
  }

  return (
    <div className="rich-text-editor">
      <div className="border border-input bg-background rounded-t-md border-b-0 p-1 flex flex-wrap gap-1">
        <Button
          size="sm"
          variant="ghost"
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={isActive('bold')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={isActive('italic')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          type="button"
          onClick={() => editor.chain().focus().toggleMark('underline').run()}
          className={isActive('underline')}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={isActive('strike')}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={isActive('bulletList')}
          aria-label="Unordered list"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={isActive('orderedList')}
          aria-label="Ordered list"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          type="button"
          onClick={setLink}
          className={isActive('link')}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} className="rounded-t-none rounded-b-md" />
    </div>
  )
}

export { RichTextEditor }
