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
    const list = $('div.listingResult');
    ctx.state.data = {
        title: `Guitar world ${category}`,
        link: `https://www.guitarworld.com/${category}`,
        description: 'Guitar world latest article',
        item:
            list &&
            list
                .map((index, item) => {
                    item = $(item);
                    return {
                        title: item.find('.article-name').first().text(),
                        description: item.find('.synopsis').first().text(),
                        link: item.find('a.article-link').attr('href'),
                    };
                })
                .get(),
    };
};
