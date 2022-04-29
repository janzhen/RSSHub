const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const category = ctx.params.category;
    const res = await got({
        method: 'get',
        url: `https://www.guitarworld.com/${category}`,
    });
    const data = res.data;
    const $ = cheerio.load(data); // 使用 cheerio 加载返回的 HTML
    const list = $('div.listingResult:not(.sponsored-post)');

    const out = await Promise.all(
        list.map(async (index, article) => {
            article = $(article)
            const link = article.find('a.article-link').attr('href')

            const description = await ctx.cache.tryGet(link, async () => {
                const result = await got.get(link)

                const $ = cheerio.load(result.data)

                return $('#article-body').html()
            });

            const item = {
                title: article.find('.article-name').first().text(),
                description,
                pubDate: new Date(article.find('p.byline > time').attr('datetime')).toUTCString(),
                link,
            };
            return item
        })
    );

    ctx.state.data = {
        title: `Guitar world ${category}`,
        link: `https://www.guitarworld.com/${category}`,
        description: 'Guitar world latest article',
        item: out,
    };
};
