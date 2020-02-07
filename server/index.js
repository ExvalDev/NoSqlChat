const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const redis = require('redis');

// Create new redis database client -> if you need other connection options, please specify here
const redisClient = redis.createClient();

/**
 *Function to print out errors
 *
 * @param {*} err
 * @returns
 */
function consoleError(err){
    if (err) {
        console.error(err);
        return;
    }
}

//actual Post Id
redisClient.get('nextPostId', (error, result) => {
    consoleError(error);
    console.log('Current Post Id Counter: '+result);
});

//actual User Id
redisClient.get('nextUserId', (error, result) => {
    consoleError(error);
    console.log('Current User Id Counter: '+result);
});

app.get('/', (req, res) => {
    res.send('It works!');
});


io.on('connection', socket => {
    console.log('a user connected');

    /**
     * register user 
     */
    socket.on('register', user =>{
        redisClient.hexists('users', user.username,(err,result)=>{
            if (result == 0) {
                redisClient.incr('nextUserId',(err, res) =>{
                    consoleError(err);
                    const userKey = 'user:'+res;
                    console.log(userKey);
                    redisClient.hmset(userKey,user);
                    redisClient.hset('users',user.username, userKey);
                    redisClient.hgetall('users',(err,result)=>{
                        console.log(result);
                    });
                    /* user['id'] = userKey;
                    io.emit('user', JSON.stringify(user)); */
                });   
            }else {
                console.log('username bereits vorhanden');
            }
        });     
    });

    // send all posts
    socket.on('allPosts', ()=>{
        redisClient.keys('post:*',(err,posts)=>{
            consoleError(err);
            posts.forEach(postKey => {
                redisClient.hgetall(postKey,(err,post)=>{
                    post['id'] = postKey;
                    io.emit('post',JSON.stringify(post));
                    console.log(post);
                });
            });
        });
    });
    
    socket.on('post', postAsJson => {
        const post = JSON.parse(postAsJson);
        console.log(post);
        
        redisClient.incr('nextPostId',(err, res) =>{
            consoleError(err);
            const postKey = 'post:'+res;
            console.log(postKey);
            redisClient.hmset(postKey,post);
            post['id'] = postKey;
            io.emit('post', JSON.stringify(post));
        });
        
    });

    //like a post
    socket.on('like', postId =>{
        console.log(postId);
        redisClient.hincrby(postId,'likeCount',1);
        /* redisClient.hgetall(postId,(err,post)=>{
            consoleError(err);
            post['id'] = postId;
            io.emit('post',JSON.stringify(post));
        }); */
    });


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
