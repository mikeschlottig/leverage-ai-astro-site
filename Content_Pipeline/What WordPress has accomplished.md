This post is also available in [日本語](https://blog.cloudflare.com/ja-jp/emdash-wordpress) and [한국어](https://blog.cloudflare.com/ko-kr/emdash-wordpress).

![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/5VnjnsSUePsv89JB4JiwI/1d69cc5560e220b4e9445aa21b939d83/EmDash-big.png)

The cost of building software has drastically decreased. We recently [<u>rebuilt Next.js in one week</u>](https://blog.cloudflare.com/vinext/) using AI coding agents. But for the past two months our agents have been working on an even more ambitious project: rebuilding the WordPress open source project from the ground up.

WordPress powers [<u>over 40% of the Internet</u>](https://w3techs.com/technologies/details/cm-wordpress). It is a massive success that has enabled anyone to be a publisher, and created a global community of WordPress developers. But the WordPress open source project will be 24 years old this year. Hosting a website has changed dramatically during that time. When WordPress was born, AWS EC2 didn’t exist. In the intervening years, that task has gone from renting virtual private servers, to uploading a JavaScript bundle to a globally distributed network at virtually no cost. It’s time to upgrade the most popular CMS on the Internet to take advantage of this change.

Our name for this new CMS is EmDash. We think of it as the spiritual successor to WordPress. It’s written entirely in TypeScript. It is serverless, but you can run it on your own hardware or any platform you choose. Plugins are securely sandboxed and can run in their own [<u>isolate</u>](https://developers.cloudflare.com/workers/reference/how-workers-works/), via [<u>Dynamic Workers</u>](https://developers.cloudflare.com/workers/runtime-apis/bindings/worker-loader/), solving the fundamental security problem with the WordPress plugin architecture. And under the hood, EmDash is powered by [<u>Astro</u>](https://astro.build/), the fastest web framework for content-driven websites.

EmDash is fully open source, MIT licensed, and [<u>available on GitHub</u>](https://github.com/emdash-cms/emdash). While EmDash aims to be compatible with WordPress functionality, no WordPress code was used to create EmDash. That allows us to license the open source project under the more permissive MIT license. We hope that allows more developers to adapt, extend, and participate in EmDash’s development.

You can deploy the EmDash v0.1.0 preview to your own Cloudflare account, or to any Node.js server today as part of our early developer beta:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/emdash-cms/templates/tree/main/blog-cloudflare)

Or you can try out the admin interface here in the [<u>EmDash Playground</u>](https://emdashcms.com/):

![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/50n8mewREzoxOFq2jDzpT9/6a38dbfbaeec2d21040137e574a935ad/CleanShot_2026-04-01_at_07.45.29_2x.png)

### What WordPress has accomplished

[](https://blog.cloudflare.com/emdash-wordpress/#what-wordpress-has-accomplished)

The story of WordPress is a triumph of open source that enabled publishing at a scale never before seen. Few projects have had the same recognisable impact on the generation raised on the Internet. The contributors to WordPress’s core, and its many thousands of plugin and theme developers have built a platform that democratised publishing for millions; many lives and livelihoods being transformed by this ubiquitous software.

There will always be a place for WordPress, but there is also a lot more space for the world of content publishing to grow. A decade ago, people picking up a keyboard universally learned to publish their blogs with WordPress. Today it’s just as likely that person picks up Astro, or another TypeScript framework to learn and build with. The ecosystem needs an option that empowers a wide audience, in the same way it needed WordPress 23 years ago. 

EmDash is committed to building on what WordPress created: an open source publishing stack that anyone can install and use at little cost, while fixing the core problems that WordPress cannot solve. 

### Solving the WordPress plugin security crisis

[](https://blog.cloudflare.com/emdash-wordpress/#solving-the-wordpress-plugin-security-crisis)

WordPress’ plugin architecture is fundamentally insecure. [<u>96% of security issues</u>](https://patchstack.com/whitepaper/state-of-wordpress-security-in-2025/) for WordPress sites originate in plugins. In 2025, more high severity vulnerabilities [<u>were found in the WordPress ecosystem</u>](https://patchstack.com/whitepaper/state-of-wordpress-security-in-2026/) than the previous two years combined.

Why, after over two decades, is WordPress plugin security so problematic?

A WordPress plugin is a PHP script that hooks directly into WordPress to add or modify functionality. There is no isolation: a WordPress plugin has direct access to the WordPress site’s database and filesystem. When you install a WordPress plugin, you are trusting it with access to nearly everything, and trusting it to handle every malicious input or edge case perfectly.

EmDash solves this. In EmDash, each plugin runs in its own isolated sandbox: a [<u>Dynamic Worker</u>](https://developers.cloudflare.com/dynamic-workers/). Rather than giving direct access to underlying data, EmDash provides the plugin with [<u>capabilities via bindings</u>](https://blog.cloudflare.com/workers-environment-live-object-bindings/), based on what the plugin explicitly declares that it needs in its manifest. This security model has a strict guarantee: an EmDash plugin can only perform the actions explicitly declared in its manifest. You can know and trust upfront, before installing a plugin, exactly what you are granting it permission to do, similar to going through an OAuth flow and granting a 3rd party app a specific set of scoped permissions.

![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/4JDq2oEgwONHL8uUJsrof2/fb2ae5fcacd5371aaab575c35ca2ce2e/image8.png)

For example, a plugin that sends an email after a content item gets saved looks like this:

```JavaScript
import { definePlugin } from "emdash";

export default () =>
  definePlugin({
    id: "notify-on-publish",
    version: "1.0.0",
    capabilities: ["read:content", "email:send"],
    hooks: {
      "content:afterSave": async (event, ctx) => {
        if (event.collection !== "posts" || event.content.status !==    "published") return;

        await ctx.email!.send({
          to: "editors@example.com",
          subject: `New post published: ${event.content.title}`,
          text: `"${event.content.title}" is now live.`,
         });

        ctx.log.info(`Notified editors about ${event.content.id}`);
      },
    },
  });
```

This plugin explicitly requests two capabilities: `content:afterSave` to hook into the content lifecycle, and `email:send` to access the `ctx.email` function. It is impossible for the plugin to do anything other than use these capabilities. It has no external network access. If it does need network access, it can specify the exact hostname it needs to talk to, as part of its definition, and be granted only the ability to communicate with a particular hostname.

And in all cases, because the plugin’s needs are declared statically, upfront, it can always be clear exactly what the plugin is asking for permission to be able to do, at install time. A platform or administrator could define rules for what plugins are or aren’t allowed to be installed by certain groups of users, based on what permissions they request, rather than an allowlist of approved or safe plugins.

### Solving plugin security means solving marketplace lock-in

[](https://blog.cloudflare.com/emdash-wordpress/#solving-plugin-security-means-solving-marketplace-lock-in)

WordPress plugin security is such a real risk that WordPress.org [<u>manually reviews and approves each plugin</u>](https://developer.wordpress.org/plugins/wordpress-org/plugin-developer-faq/#where-do-i-submit-my-plugin) in its marketplace. At the time of writing, that review queue is over 800 plugins long, and takes at least two weeks to traverse. The vulnerability surface area of WordPress plugins is so wide that in practice, all parties rely on marketplace reputation, ratings and reviews. And because WordPress plugins run in the same execution context as WordPress itself and are so deeply intertwined with WordPress code, some argue they must carry forward WordPress’ GPL license.

These realities combine to create a chilling effect on developers building plugins, and on platforms hosting WordPress sites.

Plugin security is the root of this problem. Marketplace businesses provide trust when parties otherwise cannot easily trust each other. In the case of the WordPress marketplace, the plugin security risk is so large and probable that many of your customers can only reasonably trust your plugin via the marketplace. But in order to be part of the marketplace your code must be licensed in a way that forces you to give it away for free everywhere other than that marketplace. You are locked in.

EmDash plugins have two important properties that mitigate this marketplace lock-in:

1. **Plugins can have any license**: they run independently of EmDash and share no code. It’s the plugin author’s choice.

2. **Plugin code runs independently in a secure sandbox**: a plugin can be provided to an EmDash site, and trusted, without the EmDash site ever seeing the code.

The first part is straightforward — as the plugin author, you choose what license you want. The same way you can when publishing to NPM, PyPi, Packagist or any other registry. It’s an open ecosystem for all, and up to the community, not the EmDash project, what license you use for plugins and themes.

The second part is where EmDash’s plugin architecture breaks free of the centralized marketplace.

Developers need to rely on a third party marketplace having vetted the plugin far less to be able to make decisions about whether to use or trust it. Consider the example plugin above that sends emails after content is saved; the plugin declares three things:

- It only runs on the `content:afterSave` hook

- It has the `read:content` capability

- It has the `email:send` capability

The plugin can have tens of thousands of lines of code in it, but unlike a WordPress plugin that has access to everything and can talk to the public Internet, the person adding the plugin knows exactly what access they are granting to it. The clearly defined boundaries allow you to make informed decisions about security risks and to zoom in on more specific risks that relate directly to the capabilities the plugin is given.

The more that both sites and platforms can trust the security model to provide constraints, the more that sites and platforms can trust plugins, and break free of centralized control of marketplaces and reputation. Put another way: if you trust that food safety is enforced in your city, you’ll be adventurous and try new places. If you can’t trust that there might be a staple in your soup, you’ll be consulting Google before every new place you try, and it’s harder for everyone to open new restaurants.

### Every EmDash site has x402 support built in — charge for access to content

[](https://blog.cloudflare.com/emdash-wordpress/#every-emdash-site-has-x402-support-built-in-charge-for-access-to-content)

The business model of the web [<u>is at risk</u>](https://blog.cloudflare.com/content-independence-day-no-ai-crawl-without-compensation/), particularly for content creators and publishers. The old way of making content widely accessible, allowing all clients free access in exchange for traffic, breaks when there is no human looking at a site to advertise to, and the client is instead their agent accessing the web on their behalf. Creators need ways to continue to make money in this new world of agents, and to build new kinds of websites that serve what people’s agents need and will pay for. Decades ago a new wave of creators created websites that became great businesses (often using WordPress to power them) and a similar opportunity exists today.

[<u>x402</u>](https://www.x402.org/) is an open, neutral standard for Internet-native payments. It lets anyone on the Internet easily charge, and any client pay on-demand, on a pay-per-use basis. A client, such as an agent, sends a HTTP request and receives a HTTP 402 Payment Required status code. In response, the client pays for access on-demand, and the server can let the client through to the requested content.

EmDash has built-in support for x402. This means anyone with an EmDash site can charge for access to their content without requiring subscriptions and with zero engineering work. All you need to do is configure which content should require payment, set how much to charge, and provide a Wallet address. The request/response flow ends up looking like this:

![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/3IKfYGHF6Pgi3jQf1ERRQC/48815ffec3e204f4f2c6f7a40f232a93/image4.png)

Every EmDash site has a built-in business model for the AI era.

### Solving scale-to-zero for WordPress hosting platforms

[](https://blog.cloudflare.com/emdash-wordpress/#solving-scale-to-zero-for-wordpress-hosting-platforms)

WordPress is not serverless: it requires provisioning and managing servers, scaling them up and down like a traditional web application. To maximize performance, and to be able to handle traffic spikes, there’s no avoiding the need to pre-provision instances and run some amount of idle compute, or share resources in ways that limit performance. This is particularly true for sites with content that must be server rendered and cannot be cached.

EmDash is different: it’s built to run on serverless platforms, and make the most out of the [<u>v8 isolate architecture</u>](https://developers.cloudflare.com/workers/reference/how-workers-works/) of Cloudflare’s open source runtime [<u>workerd</u>](https://github.com/cloudflare/workerd). On an incoming request, the Workers runtime instantly spins up an isolate to execute code and serve a response. It scales back down to zero if there are no requests. And it [<u>only bills for CPU time</u>](https://blog.cloudflare.com/workers-pricing-scale-to-zero/) (time spent doing actual work).

![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/3yIX0whveiJ7xQ9P20TeyA/84462e6ec58cab27fbd6bf1703efeabc/image7.png)

You can run EmDash anywhere, on any Node.js server — but on Cloudflare you can run millions of instances of EmDash using [<u>Cloudflare for Platforms</u>](https://developers.cloudflare.com/cloudflare-for-platforms/) that each instantly scale fully to zero or up to as many RPS as you need to handle, using the exact same network and runtime that the biggest websites in the world rely on.

Beyond cost optimizations and performance benefits, we’ve bet on this architecture at Cloudflare in part because we believe in having low cost and free tiers, and that everyone should be able to build websites that scale. We’re excited to help platforms extend the benefits of this architecture to their own customers, both big and small.

### Modern frontend theming and architecture via Astro

[](https://blog.cloudflare.com/emdash-wordpress/#modern-frontend-theming-and-architecture-via-astro)

EmDash is powered by Astro, the web framework for content-driven websites. To create an EmDash theme, you create an Astro project that includes:

- **Pages**: Astro routes for rendering content (homepage, blog posts, archives, etc.)

- **Layouts:** Shared HTML structure

- **Components:** Reusable UI elements (navigation, cards, footers)

- **Styles:** CSS or Tailwind configuration

- **A seed file:** JSON that tells the CMS what content types and fields to create

This makes creating themes familiar to frontend developers who are [<u>increasingly choosing Astro</u>](https://npm-stat.com/charts.html?package=astro&from=2024-01-01&to=2026-03-30), and to LLMs which are already trained on Astro.

WordPress themes, though incredibly flexible, operate with a lot of the same security risks as plugins, and the more popular and commonplace your theme, the more of a target it is. Themes run through integrating with `functions.php` which is an all-encompassing execution environment, enabling your theme to be both incredibly powerful and potentially dangerous. EmDash themes, as with dynamic plugins, turns this expectation on its head. Your theme can never perform database operations.

### An AI Native CMS — MCP, CLI, and Skills for EmDash

[](https://blog.cloudflare.com/emdash-wordpress/#an-ai-native-cms-mcp-cli-and-skills-for-emdash)

The least fun part about working with any CMS is doing the rote migration of content: finding and replacing strings, migrating custom fields from one format to another, renaming, reordering and moving things around. This is either boring repetitive work or requires one-off scripts and  “single-use” plugins and tools that are usually neither fun to write nor to use.

EmDash is designed to be managed programmatically by your AI agents. It provides the context and the tools that your agents need, including:

1. **Agent Skills:** Each EmDash instance includes [<u>Agent Skills</u>](https://agentskills.io/home) that describe to your agent the capabilities EmDash can provide to plugins, the hooks that can trigger plugins, [<u>guidance on how to structure a plugin</u>](https://github.com/emdash-cms/emdash/blob/main/skills/creating-plugins/SKILL.md), and even [<u>how to port legacy WordPress themes to EmDash natively</u>](https://github.com/emdash-cms/emdash/blob/main/skills/wordpress-theme-to-emdash/SKILL.md). When you give an agent an EmDash codebase, EmDash provides everything the agent needs to be able to customize your site in the way you need.

2. **EmDash CLI:** The [<u>EmDash CLI</u>](https://github.com/emdash-cms/emdash/blob/main/docs/src/content/docs/reference/cli.mdx) enables your agent to interact programmatically with your local or remote instance of EmDash. You can [<u>upload media</u>](https://github.com/emdash-cms/emdash/blob/main/docs/src/content/docs/reference/cli.mdx#media-upload-file), [<u>search for content</u>](https://github.com/emdash-cms/emdash/blob/main/docs/src/content/docs/reference/cli.mdx#emdash-search), [<u>create and manage schemas</u>](https://github.com/emdash-cms/emdash/blob/main/docs/src/content/docs/reference/cli.mdx#schema-create-collection), and do the same set of things you can do in the Admin UI.

3. **Built-in MCP Server:** Every EmDash instance provides its own remote Model Context Protocol (MCP) server, allowing you to do the same set of things you can do in the Admin UI.

### Pluggable authentication, with Passkeys by default

[](https://blog.cloudflare.com/emdash-wordpress/#pluggable-authentication-with-passkeys-by-default)

EmDash uses passkey-based authentication by default, meaning there are no passwords to leak and no brute-force vectors to defend against. User management includes familiar role-based access control out of the box: administrators, editors, authors, and contributors, each scoped strictly to the actions they need. Authentication is pluggable, so you can set EmDash up to work with your SSO provider, and automatically provision access based on IdP metadata.

### Import your WordPress sites to EmDash

[](https://blog.cloudflare.com/emdash-wordpress/#import-your-wordpress-sites-to-emdash)

You can import an existing WordPress site by either going to WordPress admin and exporting a WXR file, or by installing the [<u>EmDash Exporter plugin</u>](https://github.com/emdash-cms/wp-emdash/tree/main/plugins/emdash-exporter) on a WordPress site, which configures a secure endpoint that is only exposed to you, and protected by a WordPress Application Password you control. Migrating content takes just a few minutes, and automatically works to bring any attached media into EmDash’s media library.

![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/SUFaWUIoEFSN2z9rclKZW/28870489d502cff34e35ab3b59f19eae/image1.png)

Creating any custom content types on WordPress that are not a Post or a Page has meant installing heavy plugins like Advanced Custom Fields, and squeezing the result into a crowded WordPress posts table. EmDash does things differently: you can define a schema directly in the admin panel, which will create entirely new EmDash collections for you, separately ordered in the database. On import, you can use the same capabilities to take any custom post types from WordPress, and create an EmDash content type from it. 

For bespoke blocks, you can use the [<u>EmDash Block Kit Agent Skill</u>](https://github.com/emdash-cms/emdash/blob/main/skills/creating-plugins/references/block-kit.md) to instruct your agent of choice and build them for EmDash.

![](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/5xutdF9nvHYMYlN6XfqRGu/1db0e0d73327e926d606f92fdd7aabec/image3.png)

### Try it

[](https://blog.cloudflare.com/emdash-wordpress/#try-it)

EmDash is v0.1.0 preview, and we’d love you to try it, give feedback, and we welcome contributions to the [<u>EmDash GitHub repository</u>](https://github.com/emdash-cms/emdash/).

If you’re just playing around and want to first understand what’s possible — try out the admin interface in the [<u>EmDash Playground</u>](https://emdashcms.com/).

To create a new EmDash site locally, via the CLI, run:

`npm create emdash@latest`

Or you can do the same via the Cloudflare dashboard below:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/emdash-cms/templates/tree/main/blog-cloudflare)

We’re excited to see what you build, and if you're active in the WordPress community, as a hosting platform, a plugin or theme author, or otherwise — we’d love to hear from you. Email us at emdash@cloudflare.com, and tell us what you’d like to see from the EmDash project.

If you want to stay up to date with major EmDash developments, you can leave your email address [<u>here</u>](https://forms.gle/ofE1LYRYxkpAPqjE7).

Cloudflare's connectivity cloud protects [entire corporate networks](https://www.cloudflare.com/network-services/), helps customers build [Internet-scale applications efficiently](https://workers.cloudflare.com/), accelerates any [website or Internet application](https://www.cloudflare.com/performance/accelerate-internet-applications/), [wards off DDoS attacks](https://www.cloudflare.com/ddos/), keeps [hackers at bay](https://www.cloudflare.com/application-security/), and can help you on [your journey to Zero Trust](https://www.cloudflare.com/products/zero-trust/).  

Visit [1.1.1.1](https://one.one.one.one/) from any device to get started with our free app that makes your Internet faster and safer.  

To learn more about our mission to help build a better Internet, [start here](https://www.cloudflare.com/learning/what-is-cloudflare/). If you're looking for a new career direction, check out [our open positions](http://www.cloudflare.com/careers).
