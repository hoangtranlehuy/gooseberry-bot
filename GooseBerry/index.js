const dotenv = require("dotenv");
const { MezonClient } = require("mezon-sdk");
const { getImageLink, getLinkFromNewsString, randomIndex } = require("./src/helper/helper");
const NewsCategory = require("./src/sampleData/category");

dotenv.config();

async function fetchRssAsJson(rssUrl) {
  const apiUrl = rssUrl ?? `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fvnexpress.net%2Frss%2Ftin-moi-nhat.rss`;

  try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
          return null;
      }

      const jsonData = await response.json();
      console.log(jsonData.status);
      return jsonData;
  } catch (error) {
      console.error('Error fetching RSS:', error);
      return null;
  }
}

async function main() {
  const client = new MezonClient(process.env.MEZON_APP_TOKEN);

  await client.authenticate();

  client.on("channel_message", async (event) => {
    if (event?.content?.t === "*news help") {
      client.sendMessage(
        event?.clan_id,
        event?.channel_id,
        2,
        event?.is_public,
        { t: ```*news thethao, congnghe, khoahoc, xe, giaoduc, suckhoe, phapluat, doisong, phim```},
        [],
        [],
        [
          {
            message_id: '',
            message_ref_id: event.message_id,
            ref_type: 0,
            message_sender_id: event.sender_id,
            message_sender_username: event.username,
            mesages_sender_avatar: event.avatar,
            message_sender_clan_nick: event.clan_nick,
            message_sender_display_name: event.display_name,
            content: JSON.stringify(event.content),
            has_attachment: false,
          },
        ]
      );
    }
    if (event?.content?.t.startsWith("*news")) {
      const rssUrl = getLinkFromNewsString(event?.content?.t,NewsCategory);
      if (rssUrl === null) {
        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          { t: ```*news thethao, congnghe, khoahoc, xe, giaoduc, suckhoe, phapluat, doisong, phim```},
          [],
          [],
          [
            {
              message_id: '',
              message_ref_id: event.message_id,
              ref_type: 0,
              message_sender_id: event.sender_id,
              message_sender_username: event.username,
              mesages_sender_avatar: event.avatar,
              message_sender_clan_nick: event.clan_nick,
              message_sender_display_name: event.display_name,
              content: JSON.stringify(event.content),
              has_attachment: false,
            },
          ]
        );
      }
      const NewsList = await fetchRssAsJson(rssUrl);
      if (NewsList?.status === "ok") {
        const lk = [];
        const randomIndexx = randomIndex(10);
        const title = NewsList?.items?.[randomIndexx].title.toUpperCase();
        const link = NewsList?.items?.[randomIndexx].link
        lk.push({"s":title.length,"e":title.length + link.length + 1});
        const url = getImageLink(NewsList?.items?.[randomIndexx].description);
        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          { lk: lk, t: `${title}\n${link}` },
          [],
          [
            {
              filename: 'none', 
              filetype: 'image/png',
              height: 200,
              width: 200,
              size: 40000,
              url: url
            }
          ],
          [
            {
              message_id: '',
              message_ref_id: event.message_id,
              ref_type: 0,
              message_sender_id: event.sender_id,
              message_sender_username: event.username,
              mesages_sender_avatar: event.avatar,
              message_sender_clan_nick: event.clan_nick,
              message_sender_display_name: event.display_name,
              content: JSON.stringify(event.content),
              has_attachment: true,
            },
          ]
        );
      } else if (NewsList === null) {
        client.sendMessage(
          event?.clan_id,
          event?.channel_id,
          2,
          event?.is_public,
          { t: "Thế giới quá yên bình, chả có gì để xem cả. Tại sao bạn không ra ngoài chạm cỏ và hít thở ít không khí trong lành?" },
          [],
          [],
          [
            {
              message_id: '',
              message_ref_id: event.message_id,
              ref_type: 0,
              message_sender_id: event.sender_id,
              message_sender_username: event.username,
              mesages_sender_avatar: event.avatar,
              message_sender_clan_nick: event.clan_nick,
              message_sender_display_name: event.display_name,
              content: JSON.stringify(event.content),
              has_attachment: false,
            },
          ]
        );
      }
    }
  });
}

main()
  .then(() => {
    console.log("bot start!");
  })
  .catch((error) => {
    console.error(error);
  });