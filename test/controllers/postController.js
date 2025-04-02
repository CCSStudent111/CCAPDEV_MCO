const postModel = require('../models/postModel');
const commentModel = require('../models/commentModel');
const userModel = require('../models/userModel');
const tempuserhehe = require('../models/tempuserhehe');

//get post
async function viewallPost(req, res) {
    try {
        const posts = await postModel.viewallPost();
        // Get the current user or use a default
        const currentUser = tempuserhehe.getcurrentUser() || {
            username: 'Guest',
            email: 'guest@example.com',
            joinDate: new Date().toLocaleDateString(),
            posts: 0,
            comments: 0
        };
        
        res.render('index', { 
            title: 'Forum Home', 
            posts: posts,
            user: currentUser 
        });
    } catch (error) {
        console.error('Error getting the posts:', error);
        res.status(500).send('Error loading the posts');
    }
}

//get a single post (w/ comments)
async function getpostID(req, res) {
    try {
        const postId = req.params.id;
        const post = await postModel.getpostID(postId);
        
        if (!post) {
            return res.status(404).send('Post not found.');
        }
        
        const comments = await commentModel.getcommentbyID(postId);
        
        // Get the current user or use a default
        const currentUser = tempuserhehe.getcurrentUser() || {
            username: 'Guest',
            email: 'guest@example.com',
            joinDate: new Date().toLocaleDateString(),
            posts: 0,
            comments: 0
        };
        
        res.render('post', { 
            title: post.title, 
            post: post,
            comments: comments,
            user: currentUser 
        });
    } catch (error) {
        console.error('Error getting post:', error);
        res.status(500).send('Error loading post');
    }
}

// Create a new post
async function createPost(req, res) {
    try {
        const { title, content, category, tags } = req.body;
        
        // Get the current user or redirect to login
        const currentUser = tempuserhehe.getcurrentUser();
        if (!currentUser) {
            return res.redirect('/login');
        }

        const Post = await postModel.createPost({
            title,
            content,
            author: currentUser.username,
            category,
            tags
        });
        
        // Increment user's post count
        await userModel.updateUser(currentUser.username, {
            posts: currentUser.posts + 1
        });
        currentUser.posts += 1;
        
        res.redirect('/');
    } catch (error) {
        console.error('error creating the post:', error);
        res.status(500).send('error creating the post');
    }
}

//update post
async function updatePost(req, res) {
    try {
        const postId = req.params.id;
        const { title, content, tags } = req.body;
        
        // Get the current user
        const currentUser = tempuserhehe.getcurrentUser();
        if (!currentUser) {
            return res.redirect('/login');
        }
        
        // Get the post to check ownership
        const post = await postModel.getpostID(postId);
        if (post.author !== currentUser.username) {
            return res.status(403).send('You are not authorized to edit this post');
        }
        
        await postModel.updatePost(postId, {
            title,
            content,
            tags
        });
        
        res.redirect('/post/' + postId);
    } catch (error) {
        console.error('Error updating the post:', error);
        res.status(500).send('Error updating the post.');
    }
}

// delete post
async function deletePost(req, res) {
    try {
        const postId = req.params.id;
        
        // Get the current user
        const currentUser = tempuserhehe.getcurrentUser();
        if (!currentUser) {
            return res.redirect('/login');
        }
        
        // Get the post to check ownership
        const post = await postModel.getpostID(postId);
        if (post.author !== currentUser.username) {
            return res.status(403).send('You are not authorized to delete this post');
        }
        
        await postModel.deletePost(postId);
        
        // Decrement user's post count
        await userModel.updateUser(currentUser.username, {
            posts: Math.max(0, currentUser.posts - 1)
        });
        currentUser.posts = Math.max(0, currentUser.posts - 1);
        
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting the post:', error);
        res.status(500).send('Error deleting the post.');
    }
}

//like post
async function likePost(req, res) {
    try {
        const postId = req.params.id;
        await postModel.likePost(postId);
        res.json({ success: true });
    } catch (error) {
        console.error('Error liking the post:', error);
        res.status(500).json({ success: false, error: 'Error liking the post.' });
    }
}

//dislike post
async function dislikePost(req, res) {
    try {
        const postId = req.params.id;
        await postModel.dislikePost(postId);
        res.json({ success: true });
    } catch (error) {
        console.error('Error disliking post:', error);
        res.status(500).json({ success: false, error: 'Error disliking the post.' });
    }
}

async function editPost(req, res) {
    try {
        const postId = req.params.id;
        const post = await postModel.getpostID(postId);
        
        if (!post) {
            return res.status(404).send('Post not found');
        }
        
        // Get the current user
        const currentUser = tempuserhehe.getcurrentUser();
        if (!currentUser) {
            return res.redirect('/login');
        }
        
        // Check ownership
        if (post.author !== currentUser.username) {
            return res.status(403).send('You are not authorized to edit this post');
        }
        
        res.render('editPost', { 
            title: 'Edit Post', 
            post: post,
            user: currentUser 
        });
    } catch (error) {
        console.error('Error getting the post for editing:', error);
        res.status(500).send('Error loading the post for editing.');
    }
}

module.exports = {
    viewallPost,
    getpostID,
    createPost,
    updatePost,
    deletePost,
    likePost,
    dislikePost,
    editPost
};