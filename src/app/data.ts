import * as t from "./types";

export const embeds: t.Embed[] = [
  {
    ID: "blogging",
    name: "Blogging",
    description:
      "Turn you static site into a dynamic blog with a few widgets. Lists posts, get a single post and edit them.",
    available: true,
    background: `linear-gradient(
        137deg,
        rgba(233, 69, 77, 1) 0%,
        rgba(202, 60, 145, 1) 35%,
        rgba(255, 253, 76, 1) 100%
      )`,
  },
  {
    ID: "subscribe",
    name: "Subscribe",
    description:
      "Put this widget on your site and start building your mailing list right now!",
    available: false,
  },
  {
    ID: "custom-form",
    name: "Custom form",
    description:
      "Create custom forms that accept any kind of field or data and get them saved!",
    available: false,
  },
  {
    ID: "comments",
    name: "Comments",
    description: "Put a simple comments section on any content of your liking.",
    available: false,
  },
  {
    ID: "feeds",
    name: "Feeds",
    description:
      "Embed your Wordpress or Medium blog posts on your static site. Edit on Wordpress, display on yours!",
    available: false,
  },
  {
    ID: "contact",
    name: "Contact",
    description:
      "Get an email immediately when submits this form so you never miss out on leads.",
    available: false,
  },
];
