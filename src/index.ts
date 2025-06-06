import { parseEmotes } from "emotettv";

const TWITCH_CLIENT_ID = "ue6666qo983tsx6so1t0vnawi233wa";
const TWITCH_API = "https://gql.twitch.tv/gql";

function observeUrlChange() {
  let oldHref = document.location.href;

  const body = document.querySelector("body")!;

  const observer = new MutationObserver(() => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;
      main();
    }
  });

  observer.observe(body, { childList: true, subtree: true });
}

window.addEventListener("load", () => observeUrlChange());

async function main() {
  const chatContainer = document.querySelector<HTMLDivElement>(".css-175oi2r")!;

  const useChannelSubscriptionPolling_SubscriptionQuery = `
    query useChannelSubscriptionPolling_SubscriptionQuery(
      $login: String
    ) {
      user(login: $login) {
        ...useChannelSubscriptionPolling_subscription
        id
        __typename
      }
    }

    fragment useChannelSubscriptionPolling_subscription on User {
      login
      self {
        subscriptionBenefit {
          id
          __typename
        }
      }
    }
  `;

  const response = await fetch(TWITCH_API, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Client-Id": TWITCH_CLIENT_ID,
    },
    body: JSON.stringify({
      query: useChannelSubscriptionPolling_SubscriptionQuery,
      variables: {
        login: new URL(document.URL).pathname.replace("/", ""),
      },
    }),
  });

  const { data } = await response.json();

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      record.addedNodes.forEach(async (addedNode) => {
        const firstChild = addedNode.childNodes[0];

        if (!firstChild) {
          return;
        }

        const originalMessage =
          firstChild.childNodes[firstChild.childNodes.length - 1];

        if (originalMessage instanceof HTMLSpanElement) {
          const parsedMessage = await parseEmotes(
            originalMessage.textContent!,
            undefined,
            {
              channelId: data.user.id,
              providers: {
                twitch: true,
                bttv: true,
                ffz: false,
                seventv: true,
              },
            }
          );

          originalMessage.innerHTML = parsedMessage.toHTML();
        }
      });
    }
  });

  observer.observe(chatContainer, { childList: true, subtree: true });
}
