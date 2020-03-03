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
    console.log('a user connected '+ socket.id);

    /**
     * register user 
     */
    socket.on('register', user =>{
        redisClient.hexists('users', user.username,(err,result)=>{
            if (result == 0) {
                redisClient.incr('nextUserId',(err, res) =>{
                    consoleError(err);
                    const userKey = 'user:'+res;
                    /* console.log(userKey); */
                    redisClient.hmset(userKey,user);
                    redisClient.hset('users',user.username, userKey);
                    /* redisClient.hgetall('users',(err,result)=>{
                        console.log(result);
                    }); */
                    
                    io.emit('registered', userKey);
                });   
            }else {
                io.emit('registerFailed');
            }
        });     
    });

    /**
     * login user 
     */
    socket.on('login', user=>{
        redisClient.hget('users', user.username,(err,key)=>{
            if (err){
                io.emit('loginFailed', 'userNotFound');
            }else{
                console.log(key);
                redisClient.hgetall(key,(err, checkUser)=>{
                    if(checkUser.password == user.password){
                        io.emit('loginDone',key);
                    }else{
                        io.emit('loginFailed', 'wrongPassword');
                    }
                }); 
            }
        });
    });

    /**
     * Get userData for Frontend 
     */
    socket.on('getUser', userKey =>{
        userId = userKey.slice(5);
        redisClient.hget(userKey,'username', (err,username) =>{
            let sendUser = {}; 
            sendUser.username = username;
            io.emit('userData',JSON.stringify(sendUser));         
        });
    });


    // send all posts
    socket.on('allPosts', ()=>{
        redisClient.keys('post:*',(err,posts)=>{
            consoleError(err);
            posts.sort((a, b)=>{ 
                return (a.slice(5) - b.slice(5) );
            });
            posts.forEach(postKey => {
                redisClient.hgetall(postKey,(err,post)=>{
                    post['id'] = postKey;
                    redisClient.scard('likes:'+postKey.slice(5), (err, likeCount) =>{
                        post['likeCount'] = likeCount;
                        redisClient.hgetall(post.userKey,(err,user)=>{
                            post['username'] = user.username;
                            io.emit('post',JSON.stringify(post));
                            /* console.log(post); */
                        })    
                    })                
                });
            });
        });
    });

    // send posts from user
    socket.on('personalPosts', (userKey)=>{
        redisClient.keys('post:*',(err,posts)=>{
            consoleError(err);
            /* console.log(posts); */
            posts.forEach(postKey => {
                redisClient.hgetall(postKey,(err,post)=>{
                    post['id'] = postKey;
                    redisClient.scard('likes:'+postKey.slice(5), (err, likeCount) =>{
                        post['likeCount'] = likeCount;

                        if (post.userKey == userKey) {
                            redisClient.hgetall(post.userKey,(err,user)=>{
                                post['username'] = user.username;
                                io.emit('post',JSON.stringify(post));
                                /* console.log(post); */
                            });
                        }     
                    });                
                });
            });
        });
    });

    socket.on('getFollower', (userKey)=>{
        const UserId = userKey.slice(5);
        redisClient.smembers('follower:'+UserId,(err,followers)=>{
            consoleError(err);
            followers.forEach(follower =>{
                var submitFollower = {};
                submitFollower['userKey'] = follower;
                redisClient.hget(follower,'username',(err,username) =>{
                    consoleError(err);
                    submitFollower['username'] = username;
                    io.emit('follower',JSON.stringify(submitFollower));
                })
            })
        })
    })

    socket.on('getFollowing', (userKey)=>{
        const UserId = userKey.slice(5);
        redisClient.smembers('following:'+UserId,(err,followings)=>{
            consoleError(err);
            followings.forEach(following =>{
                var submitFollowing = {};
                submitFollowing['userKey'] = following;
                redisClient.hget(following,'username',(err,username) =>{
                    consoleError(err);
                    submitFollowing['username'] = username;
                    io.emit('following',JSON.stringify(submitFollowing));
                })
            })
        })
    })
    
    /**
     * post an new Post 
     */
    socket.on('post', postAsJson => {
        const post = JSON.parse(postAsJson);
        console.log(post);
        
        redisClient.incr('nextPostId',(err, res) =>{
            consoleError(err);
            const postKey = 'post:'+res;
            console.log(postKey);
            redisClient.hmset(postKey,post);
            post['id'] = postKey;
            redisClient.scard('likes:'+postKey.slice(5), (err, likeCount) =>{
                post['likeCount'] = likeCount;
                redisClient.hgetall(post.userKey,(err,user)=>{
                    post['username'] = user.username;
                    io.emit('post',JSON.stringify(post));
                    console.log(post);
                })    
            })
        });
        
    });

    //like a post
    socket.on('like', data =>{
        redisClient.sadd(('likes:'+data.postId.slice(5)), data.userKey);
    });

    socket.on('follow', (userKeys)=>{
        const followUserId = userKeys.followUser.slice(5);
        const followingUserId = userKeys.followingUser.slice(5);
        
        redisClient.sadd('follower:' + followUserId, userKeys.followingUser);
        redisClient.sadd('following:' + followingUserId, userKeys.followUser);

        var submitFollowing = {};
        submitFollowing['userKey'] = userKeys.followUser;
        redisClient.hget(userKeys.followUser,'username',(err,username) =>{
            consoleError(err);
            submitFollowing['username'] = username;
            io.emit('following',JSON.stringify(submitFollowing));
        })

        

    });


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
