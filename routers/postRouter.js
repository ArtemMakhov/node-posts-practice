const express = require('express');
const Joi = require('joi');
const router = express.Router();


let posts = [
    { id: '1', topic: 'test 1', text: 'test text 1' },
    { id: '2', topic: 'test 2', text: 'test text 2' },
    { id: '3', topic: 'test 3 ',text: 'test text 3' },
];

// GET /api/posts => [...posts]
router.get('/', (req, res) => {
    res.json({ posts,status: 'success' });
});

// GET /api/posts/<123> => {post with id 123}
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const [post] = posts.filter(item => item.id === id);
    if (!post) {
        return res.status(400).json({ post, status: `failure, no post wth id ${id}` });
    }
    res.json({ post,status: 'success' });
});

// POST /api/posts => [newPost,...posts]
router.post('/', (req, res) => {
    const schema = Joi.object({
        topic: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        text: Joi.string()
            .alphanum()
            .min(10)
            .max(400)
            .required(),
    })
    
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
        return res.status(400).json({ status: validationResult.error.details });
    }
    
    const { topic, text } = req.body;
        
    posts.push({
        id: new Date().getTime().toString(),
        topic,
        text,
    });
    res.json({ status: 'success'});
});

// PUT /api/posts/123 => [changedPost, ...posts]
router.put('/:id', (req, res) => {
        const schema = Joi.object({
        topic: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        text: Joi.string()
            .alphanum()
            .min(10)
            .max(400)
            .required(),
    })
    
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
        return res.status(400).json({ status: validationResult.error.details });
    }
    
    const { topic, text } = req.body; 
    
    posts.forEach(post => {
        if (post.id === req.params.id) {
            post.topic = topic;
            post.text = text;
        }
    });

    res.json({ status: 'success'});
});

// DELETE /api/posts/123 => [posts without post with id 123]
router.delete('/:id', (req, res) => {
    posts = posts.filter(item => item.id !== req.params.id);
    res.json({ status: 'success'});
});

module.exports = { postsRouter: router };