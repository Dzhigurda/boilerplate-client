export class SerializeCode {
  constructor(private dom: HTMLElement) {}
  public get() {
    const art = this.dom;
    let text = '';
    for (let i = 0; i < art.childNodes.length; i++) {
      let node: Node = art.childNodes.item(i);
      let NodeName = node.nodeName.toLocaleLowerCase();
      if (NodeName == 'p') {
        text += `<p>${this.getCleanText(node)}</p>${'\n'}`;
      } else if (NodeName == '#text') {
        text += `<p>${node.textContent}</p>${'\n'}`;
      } else if (NodeName == 'app-quote-art') {
        text += `<p>${QuoteArtComponent.parse(node)}</p>${'\n'}`;
      } else if (NodeName == 'app-photo') {
        text += `<p>${PhotoComponent.parse(node)}</p>${'\n'}`;
      } else if (NodeName == 'app-quiz') {
        text += `<p>${QuizComponent.parse(node)}</p>${'\n'}`;
      } else if (NodeName == 'app-album') {
        text += `<p>${AlbumComponent.parse(node)}</p>${'\n'}`;
      } else if (NodeName == 'app-youtube-art') {
        text += `<p>${YoutubeArtComponent.parse(node)}</p>${'\n'}`;
      } else if (NodeName == 'app-podcast') {
        text += `<p>${PodcastComponent.parse(node)}</p>${'\n'}`;
      } else if (NodeName == '#text') {
        text += `<p>${node.textContent}</p>${'\n'}`;
      } else if (NodeName == 'br') {
        text += `<br/>${'\n'}`;
      } else if (NodeName == 'hr') {
        text += `<hr/>${'\n'}`;
      } else {
        text += `<p>${this.getCleanText(node)}</p>${'\n'}`;
      }
    }

    text = text.replace(/(<p>[\n\s]+<\/p>)/gi, '').trim();
    console.log(text);
    return text;
  }

  getCleanText(html: Node): string {
    var text = '';
    for (let i = 0; i < html.childNodes.length; i++) {
      let node: Node = html.childNodes.item(i);
      let NodeName = node.nodeName.toLocaleLowerCase();
      if (NodeName == 'i') {
        text += `<i>${this.getCleanText(node)}</i>`;
      } else if (NodeName == 'b') {
        text += `<b>${this.getCleanText(node)}</b>`;
      } else if (NodeName == 'u') {
        text += `<u>${this.getCleanText(node)}</u>`;
      } else if (NodeName == 'a') {
        if (node instanceof HTMLElement)
          text += `<a href='${node.getAttribute(
            'href'
          )}' target='_blank'>${this.getCleanText(node)}</a>`;
      } else if (NodeName == 'strong') {
        text += `<strong>${this.getCleanText(node)}</strong>`;
      } else if (NodeName == 'br') {
        text += `<br />`;
      } else if (NodeName == 'br') {
        text += `<hr />`;
      } else text += node.textContent;
    }
    return text;
  }
}
