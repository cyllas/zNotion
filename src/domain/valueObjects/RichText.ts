/**
 * Value Object para texto rico do Notion
 * Encapsula a lógica de formatação e validação de texto rico
 */
export interface RichTextAnnotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}

export interface RichTextContent {
  content: string;
  link: string | null;
}

export class RichText {
  private constructor(
    private readonly type: string,
    private readonly text: RichTextContent,
    private readonly annotations?: RichTextAnnotations,
    private readonly plainText?: string,
    private readonly href?: string | null
  ) {}

  static create(
    type: string,
    text: RichTextContent,
    annotations?: RichTextAnnotations,
    plainText?: string,
    href?: string | null
  ): RichText {
    return new RichText(type, text, annotations, plainText, href);
  }

  static createFromText(content: string): RichText {
    return new RichText(
      'text',
      { content, link: null },
      {
        bold: false,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
        color: 'default'
      }
    );
  }

  getType(): string {
    return this.type;
  }

  getText(): RichTextContent {
    return this.text;
  }

  getAnnotations(): RichTextAnnotations | undefined {
    return this.annotations;
  }

  getPlainText(): string {
    return this.plainText || this.text.content;
  }

  getHref(): string | null | undefined {
    return this.href;
  }

  toJSON() {
    return {
      type: this.type,
      text: this.text,
      annotations: this.annotations,
      plain_text: this.plainText,
      href: this.href
    };
  }
}
