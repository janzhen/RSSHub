module.exports = {
    'guitarworld.com': {
        _name: 'Guitar World',
        '.': [
            {
                title: '最新文章',
                docs: 'https://docs.rsshub.app/social-media.html#guitarworld',
                source: ['/:category'],
                target: '/guitarworld/articles/:category',
            },
        ],
    },
};
