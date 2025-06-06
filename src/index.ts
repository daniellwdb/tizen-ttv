import TwitchEmoticons from "@mkody/twitch-emoticons";
const { EmoteFetcher, EmoteParser } = TwitchEmoticons;

async function main() {
  const fetcher = new EmoteFetcher();

  const parser = new EmoteParser(fetcher, {
    template: '<img class="emote" alt="{name}" src="{link}">',
    match: /(\w+)+?/g,
  });

  // TODO: Dynamically get channel ID
  await fetcher.fetchSevenTVEmotes(53268737, "avif");

  const chatContainer = document.querySelector<HTMLDivElement>(".css-175oi2r")!;

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      record.addedNodes.forEach((addedNode) => {
        const firstChild = addedNode.childNodes[0];

        if (firstChild) {
          const originalMessage =
            firstChild.childNodes[firstChild.childNodes.length - 1]!;
          const parsedMessage = parser.parse(originalMessage.textContent!);
          originalMessage.textContent = parsedMessage;
        }
      });
    }
  });

  observer.observe(chatContainer, { childList: true, subtree: true });
}

main();
