export type TempTypes =
  | 'startQuote'
  | 'endQuote'
  | 'seporateQuote'
  | 'paragraph'
  | 'breakline'
  | 'photo'
  | 'albums'
  | 'youtube'
  | 'text'
  | 'quote';

interface TokenHave {
  type: string;
}
interface TokenValue extends TokenHave {
  type: string;
  value: string | string[];
  entity?: string;
  entityId?: number;
  entityProperty?: any;
}
interface TokenQueueValue extends TokenValue {
  author?: string;
  value: string[];
}
class Subtitle implements TokenHave {
    title =  "";
    type = 'subtitle';
    parse(tv: TokenHave) {
      if(!this.isSubtitle(tv)) throw new Error('Subtitle token is not valid ' + tv.type);
      const reg = /#\s+(.+)/i.exec(tv.value as string);
      if(!reg) throw new Error('Subtitile is not valid: ' + tv.value);
      this.title = reg[1];
      return this;
    }
    isSubtitle(tv: TokenHave): tv is TokenValue {
      return tv.type === this.type;
    }
    get value() {
      return `<h2>${this.title}</h2>`;
    }
    toString() {
      return `# ${this.title}`;
    }
}
class PhotoToken implements TokenHave {
  id!: number;
  type = 'photo';
  parse(tv: TokenHave) {
    if (!this.isPhoto(tv)) throw new Error('Photo token is not valid');
    const reg = /foto(\d+)/i.exec(tv.value as string);
    if (!reg) throw new Error('Photo is not valid: ' + tv.value);
    this.id = +reg[1];
    return this;
  }
  isPhoto(tv: TokenHave): tv is TokenValue {
    return tv.type === this.type;
  }
  get value() {
    return `<app-photo id='${this.id}'></app-photo>`;
  }
  toString() {
    return `foto${this.id}`;
  }
}
class AlbumToken implements TokenHave {
  id!: number;
  count!: number;
  type = 'albums';
  parse(tv: TokenHave) {
    if (!this.isAlbums(tv)) throw new Error('Album token is not valid');
    const reg = /album(\d+)(_(\d+))?/i.exec(tv.value as string);
    if (!reg) throw new Error('Album is not valid: ' + tv.value);
    this.id = +reg[1];
    this.count = +reg[3] || 1;
    return this;
  }
  isAlbums(tv: TokenHave): tv is TokenValue {
    return tv.type === 'albums';
  }
  get value() {
    return `<app-album id='${this.id}' count='${this.count}'></app-album>`;
  }
  toString() {
    return `album${this.id}_${this.count}`;
  }
}
class YoutubeToken implements TokenHave {
  type = 'youtube';
  code!: string;
  parse(tv: TokenHave) {
    if (!this.isYoutube(tv)) throw new Error('Youtube token is not valid');
    const reg = /youtube_([A-Za-z0-9_\-]+)/i.exec(tv.value as string);
    if (!reg) throw new Error('Youtube is not valid: ' + tv.value);
    this.code = reg[1];
    return this;
  }
  isYoutube(tv: TokenHave): tv is TokenValue {
    return tv.type === 'youtube';
  }
  get value() {
    return `<app-youtube code='${this.code}'></app-youtube>`;
  }
  toString() {
    return `youtube_${this.code}`;
  }
}
class QuoteToken implements TokenHave {
  type = 'quote';
  text!: TextToken;
  author?: string;
  parse(tv: TokenHave) {
    if (!this.isYoutube(tv)) throw new Error('Quote token is not valid');
    this.text = new TextToken().parse({
      type: 'text',
      value: tv.value as string[],
    } as TokenHave);
    this.author = tv.author;
    return this;
  }
  isYoutube(tv: TokenHave): tv is TokenQueueValue {
    return tv.type === 'quote';
  }
  get value() {
    return `<app-quote-art author='${this.author}'>${this.text.value}</app-quote>`;
  }
  toString() {
    return `{${this.text}|${this.author}}`;
  }
}
class TextToken implements TokenHave {
  type = 'text';
  text!: string[];
  parse(tv: TokenHave) {
    if (!this.isText(tv)) throw new Error('Text is not valid');
    this.text = tv.value as string[];
    return this;
  }
  isText(tv: TokenHave): tv is TokenValue {
    return tv.type === 'text';
  }

  get value() {
    return `<p>${this.text.join('</p>\n</p>')}</p>`;
  }
  toString() {
    return this.text.join('\n');
  }
}
class BreaklineToken implements TokenHave {
  type = 'breakline';
  parse(tv: TokenHave) {
    if (tv.type != 'breakline') throw new Error('breakline is not valid');
    return this;
  }
  get value() {
    return `<hr/>`;
  }
  toString() {
    return '---';
  }
}

export class SerializeText {
  constructor(private text: string) {}
  public get() {
    this.makeCode();
    return this.text;
  }
  getSource() {
    return this.source;
  }
  private source?: TokenValue[];
  render() {
    let terms = this.getTerms();
    const nt = this.parseParagraphToText(terms);
    const nt2 = this.parseQuotes(nt);
    const nt3 = this.parsePhoto(nt2);
    const nt4 = this.parseAlbum(nt3);
    const nt5 = this.parseYoutube(nt4);
    const nt6 = this.parseTitle(nt5)
    const nt7 = this.parseBreakLine(nt6); 
    const nt8 = this.parseText(nt7);
    // this.parse(terms);
    // console.log(nt7.map(r =>r.toString()).join("\n"));
    // console.log((nt7 as any[]).map(r =>r.value).join("\n"));
    this.source = nt8 as any;
    return this;
  }
  private makeText() {
    this.text = this.source?.map((r) => r.toString()).join('\n') || '';
  }

  private makeCode() {
    this.text = this.source?.map((r) => r.value).join('\n') || '';
  }

  private getTerms() {
    return this.text
      .trim()
      .replace(/(\n)+/g, ' __EOL__ ')
      .split(
        /(\{|\}|\||__EOL__|\-\-\-|foto\d+|album\d+_\d+|album\d+|youtube_[A-Za-z0-9_\-]+)/gi
      )
      .map((r) => r.trim())
      .filter((r) => r && r != '__EOL__')
      .map((r) => this.tokenize(r));
  }
  /**
   * Объединяет параметры в блоки текста для удобства
   * @param terms
   * @returns
   */
  private parseParagraphToText(terms: TokenValue[]) {
    const nt: TokenValue[] = [];
    const last = () => nt[nt.length - 1];
    for (let i = 0; i < terms.length; i++) {
      if (terms[i]?.type != 'paragraph') {
        nt.push(terms[i]);
        continue;
      }
      if (terms[i].type == 'paragraph') {
        if (last()?.type != 'text') {
          nt.push({ type: 'text', value: [terms[i].value as string] });
          continue;
        }
        (last().value as string[]).push(terms[i].value as string);
      }
    }
    return nt;
  }
  private parseQuotes(terms: TokenValue[]): TokenValue[] {
    const nt: TokenValue[] = [];
    const last = () => nt[nt.length - 1];
    for (let i = 0; i < terms.length; i++) {
      if (terms[i]?.type != 'startQuote') {
        nt.push(terms[i]);
        continue;
      }
      const [quote, j] = this.parseQuote(terms, i);
      nt.push(new QuoteToken().parse(quote));
      i = j;
    }
    return nt;
  }
  private parseQuote(terms: TokenValue[], start: number): [TokenValue, number] {
    const quote = { type: 'quote', value: [''], author: '' };
    const error = (msg: string) => {
      throw new Error(msg);
    };
    const peek = () => terms[start];
    const next = () => terms[++start];
    const matchType = (type: TempTypes) => peek() && peek().type == type;
    const expectType = (type: TempTypes) =>
      (peek().type == type && next()) ||
      error(`Expect keyword ${type} instead got ${peek().type}`);

    quote.value = expectType('startQuote').value as string[];
    next();
    if (matchType('seporateQuote')) {
      quote.author = (expectType('seporateQuote').value as string[]).join(', ');
      next();
    }
    expectType('endQuote');
    start--;
    return [quote, start];
  }

  private parseTitle(terms: TokenHave[]): TokenHave[] {
    const nt: TokenValue[] = [];
    for (let i = 0; i < terms.length; i++) {
      if ( terms[i]?.type != 'subtitle') {
        nt.push(terms[i] as any);
        continue;
      }
      nt.push(new Subtitle().parse(terms[i]));
    }
    return nt;
  }
  private parsePhoto(terms: TokenValue[]): TokenHave[] {
    const nt: TokenValue[] = [];
    for (let i = 0; i < terms.length; i++) {
      if (terms[i]?.type != 'photo') {
        nt.push(terms[i]);
        continue;
      }
      nt.push(new PhotoToken().parse(terms[i]));
    }
    return nt;
  }
  private parseAlbum(terms: TokenHave[]): TokenHave[] {
    const nt: TokenHave[] = [];
    for (let i = 0; i < terms.length; i++) {
      if (terms[i]?.type != 'albums') {
        nt.push(terms[i]);
        continue;
      }
      nt.push(new AlbumToken().parse(terms[i]));
    }
    return nt;
  }
  private parseYoutube(terms: TokenHave[]): TokenHave[] {
    const nt: TokenHave[] = [];
    for (let i = 0; i < terms.length; i++) {
      if (terms[i]?.type != 'youtube') {
        nt.push(terms[i]);
        continue;
      }
      nt.push(new YoutubeToken().parse(terms[i]));
    }
    return nt;
  }
  private parseBreakLine(terms: TokenHave[]): TokenHave[] {
    const nt: TokenHave[] = [];
    for (let i = 0; i < terms.length; i++) {
      if (terms[i]?.type != 'breakline') {
        nt.push(terms[i]);
        continue;
      }
      nt.push(new BreaklineToken().parse(terms[i]));
    }
    return nt;
  }
  private parseText(terms: TokenHave[]): TokenHave[] {
    const nt: TokenHave[] = [];
    for (let i = 0; i < terms.length; i++) {
      if (terms[i]?.type != 'text') {
        nt.push(terms[i]);
        continue;
      }
      nt.push(new TextToken().parse(terms[i]));
    }
    return nt;
  }

  private templates = {
    photo: /(foto\d+)/i,
    albums: /album\d+(_\d+)?/i,
    youtube: /(youtube_[A-Za-z0-9_\-]+)/i,
    startQuote: /(\{)/,
    endQuote: /(\})/,
    seporateQuote: /(\|)/,
    breakline: /(\-\-\-)/,
    subtitle: /#\s*.+/,
    paragraph: /.+/,
  };

  private tokenize(lex: string) {
    for (let [type, reg] of Object.entries(this.templates)) {
      if (reg.test(lex)) {
        return { type, value: lex };
      }
    }
    throw new Error('Unrecognize lexema');
  }

  private parse(terms: TokenValue[]) {
    let pointer = 0;
    const error = (msg: string) => {
      throw new Error(msg);
    };
    const peek = () => terms[pointer];
    const next = () => terms[++pointer];
    const match = (token: string) => peek() && peek().value == token;
    const expect = (token: string) =>
      (peek().value == token && next()) ||
      error(`Expect keyword ${token} instead got ${peek().value}`);
    const expectType = (type: TempTypes) =>
      (peek().type == type && next()) ||
      error(`Expect keyword ${type} instead got ${peek().type}`);
  }

  private debug(terms: any[]) {
    return terms.reduce((acc, cur, index, arr) => {
      acc += index.toString().padStart(2, '0') + ' | ' + cur + '\n';
      return acc;
    }, '');
  }

  private rializeArticleOld() {
    this.text = this.text.replace(/foto(\d+)/gi, this.getPhoto);
    this.replaceDoubleEOL();
    this.text = this.text.replace(/album(\d+)_(\d+)/g, this.createAlbum);
    this.replaceDoubleEOL();
    this.text = this.text.replace(
      /youtube_([A-Za-z0-9_\-]+)/g,
      this.getYoutube
    );
    this.replaceDoubleEOL();
    this.text = this.text.replace(/{(.+?)}/g, this.createQuote);
    this.replaceDoubleEOL();
    this.text = this.text.replace(/(\n)/gi, '</p>\n<p>');
    this.text = `<p>${this.text}</p>`;
  }
  private replaceDoubleEOL() {
    this.text = this.text.replace(/(\n{2,})/gi, '\n');
  }
  private getPhoto(s: any, p: any, id: string) {
    return `\n<app-photo id='${id}'></app-photo>\n`;
  }
  private getYoutube(s: any, p: any, code: string) {
    return `\n<app-youtube-art code="${code}"></app-youtube-art>\n`;
  }
  private createQuote(s: any, p: any, message: string, p2: any) {
    return `\n<app-quote-art>${message}</app-quote-art>\n`;
  }
  private createAlbum(s: any, p: any, id: string, count: string) {
    return `\n<app-album  id="'${id}'" count="'${count}'"></app-album>\n`;
  }
}

export class SerializeFixText {
  private text: string;
  constructor(text: string) {
    this.text = text;
    this.rializeArticle();
  }
  public get() {
    return this.text;
  }
  private rializeArticle() {
    // console.log(this.text);
    // console.log("flag --------------------------------------");
    this.text = this.text.replace(
      /(<p>|<span>|[\s\&nbsp;]){0,4}[\s\&nbsp;]*quiz(\d+)[\s\&nbsp;]*(<\/p>|<\/span>|[\s\&nbsp;]*){0,4}/gi,
      this.getQuiz
    );
    this.text = this.text.replace(
      /(<p>|<span>|[\s\&nbsp;]){0,4}[\s\&nbsp;]*foto(\d+)[\s\&nbsp;]*(<\/p>|<\/span>|[\s\&nbsp;]*){0,4}/gi,
      this.getPhoto
    );
    this.text = this.text.replace(
      /(<p>|<span>|[\s\&nbsp;]){0,4}[\s\&nbsp;]*album(\d+)_(\d+)[\s\&nbsp;]*(<\/p>|<\/span>|[\s\&nbsp;]){0,4}/g,
      this.createAlbum
    );
    this.text = this.text.replace(
      /(<p>|<span>|[\s\&nbsp;]){0,4}[\s\&nbsp;]*youtube_([A-Za-z0-9_\-]+)[\s\&nbsp;]*(<\/p>|<\/span>|[\s\&nbsp;]){0,4}/g,
      this.getYoutube
    );
    this.text = this.text.replace(
      /(<p>|<span>|[\s\&nbsp;]){0,4}[\s\&nbsp;]*{(.+)}[\s\&nbsp;]*(<\/p>|<\/span>|[\s\&nbsp;]){0,4}/g,
      this.createQuote
    );
    this.text = this.text.replace(
      /(<p>|<span>|[\s\&nbsp;]){0,4}[\s\&nbsp;]*podcast([0-9_\-]+):([a-f0-9]+)[\s\&nbsp;]*(<\/p>|<\/span>|[\s\&nbsp;]){0,4}/gi,
      this.getPodcast
    );
    this.text = this.text.replace(/<p>/gi, "<p lang='ru'>");
    //  console.log(this.text);
  }
  private getQuiz(s: any, p: any, id: number) {
    return `<app-quiz id='${id}'></app-quiz>`;
  }
  private getPhoto(s: any, p: any, id: number) {
    return `<app-photo id='${id}'></app-photo>`;
  }
  private getYoutube(s: any, p: any, code: string) {
    return `<app-youtube-art code="${code}"></app-youtube-art>`;
  }
  private createQuote(s: any, p: any, message: string, p2: string) {
    return `<app-quote-art>${message}</app-quote-art>`;
  }
  private getPodcast(s: any, p: any, code: string, hash: string) {
    return `<app-podcast code="${code}" hash="${hash}"></app-podcast>`;
  }
  private createAlbum(s: any, p: any, id: string, count: string) {
    return `<app-album  id="'${id}'" count="'${count}'"></app-album>`;
  }
}
