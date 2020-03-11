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

/**
 *Send the given Post to given Feed
 *
 * @param {String} feed
 * @param {String} post
 * @param {String} postKey
 */
function sendPost(feed, post, postKey){
    post['id'] = postKey;
    redisClient.scard('likes:'+postKey.slice(5), (err, likeCount) =>{
        consoleError(err);
        post['likeCount'] = likeCount;
        redisClient.scard('dislikes:'+postKey.slice(5), (err, dislikeCount) =>{
            consoleError(err);
            post['dislikeCount'] = dislikeCount;
            redisClient.hgetall(post.userKey,(err,user)=>{
                consoleError(err);
                post['username'] = user.username;
                io.emit(feed,JSON.stringify(post));
            }) 
        });
    })
}

/**
 * Show Actual Post Id on start of server 
 */
redisClient.get('nextPostId', (error, result) => {
    consoleError(error);
    console.log('Current Post Id Counter: '+result);
});

/**
 * Show Actual Usser Id on start of server 
 */
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
     * @param user Register data from User
     */
    socket.on('register', user =>{
        redisClient.hexists('users', user.username,(err,result)=>{
            consoleError(err);
            if (result == 0) {
                redisClient.incr('nextUserId',(err, res) =>{
                    consoleError(err);
                    const userKey = 'user:'+res;
                    redisClient.hmset(userKey,user);
                    redisClient.hset('users',user.username, userKey);
                    io.emit('registered', userKey);
                });   
            }else {
                io.emit('registerFailed');
            }
        });     
    });

    /**
     * login user
     * @param user Login data from User
     */
    socket.on('login', user=>{
        redisClient.hget('users', user.username,(err,key)=>{
            consoleError(err);
            if (key==null){
                io.emit('loginFailed', 'userNotFound');
            }else{
                redisClient.hgetall(key,(err, checkUser)=>{
                    consoleError(err);
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
     * @param userKeys
     */
    socket.on('getUser', userKey =>{
        userId = userKey.slice(5);
        redisClient.hget(userKey,'username', (err,username) =>{
            consoleError(err);
            let sendUser = {}; 
            sendUser.username = username;
            io.emit('userData',JSON.stringify(sendUser));         
        });
    });


    /**
     * Send all Posts to Frontend 
     */
    socket.on('allPosts', ()=>{
        redisClient.keys('post:*',(err,posts)=>{
            consoleError(err);
            posts.sort((a, b)=>{ 
                return (a.slice(5) - b.slice(5) );
            });
            posts.forEach(postKey => {
                redisClient.hgetall(postKey,(err,post)=>{
                    consoleError(err);
                    sendPost('post',post, postKey);            
                });
            });
        });
    });

    /**
     * Send all Posts from User to Frontend 
     * @param userKeys
     */
    socket.on('personalPosts', (userKey)=>{
        redisClient.keys('post:*',(err,posts)=>{
            consoleError(err);
            posts.sort((a, b)=>{ 
                return (a.slice(5) - b.slice(5) );
            });
            /* console.log(posts); */
            posts.forEach(postKey => {
                redisClient.hgetall(postKey,(err,post)=>{
                    consoleError(err);
                    if (post.userKey == userKey) {
                        sendPost('personalPost',post, postKey);
                    }                
                });
            });
        });
    });

    /**
     * Send all Posts from Followed to Frontend 
     * @param userKeys
     */
    socket.on('timelinePosts', (userKey)=>{
        redisClient.keys('post:*',(err,posts)=>{
            consoleError(err);
            posts.sort((a, b)=>{ 
                return (a.slice(5) - b.slice(5) );
            });
            /* console.log(posts); */
            posts.forEach(postKey => {
                redisClient.hgetall(postKey,(err,post)=>{
                    consoleError(err);
                    const UserId = userKey.slice(5);
                    redisClient.smembers('following:'+UserId,(err,followings)=>{
                        consoleError(err);
                        followings.forEach(follower =>{
                            if (post.userKey == follower) {
                                sendPost('timelinePost',post, postKey);
                            }
                        });   
                    });               
                });
            });
        });
    });

    /**
     * Send all Follower from User to Frontend 
     * @param userKeys
     */
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

    /**
     * Send all Following from User to Frontend 
     * @param userKeys
     */
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
     * @param postAsJson  
     */
    socket.on('post', postAsJson => {
        const post = JSON.parse(postAsJson);
        redisClient.incr('nextPostId',(err, res) =>{
            consoleError(err);
            const postKey = 'post:'+res;
            redisClient.hmset(postKey,post);
            sendPost('post',post, postKey);
        });
        
    });

    /**
     * like a Post 
     * @param data PostID
     */
    socket.on('like', data =>{
        redisClient.sadd(('likes:'+data.postId.slice(5)), data.userKey);
    });

    /**
     * dislike a Post
     * @param data PostID 
     */
    socket.on('dislike', data =>{
        redisClient.sadd(('dislikes:'+data.postId.slice(5)), data.userKey);
    });

    /**
     * Follow a User
     * @param userKeys
     */
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

        redisClient.keys('post:*',(err,posts)=>{
            consoleError(err);
            posts.sort((a, b)=>{ 
                return (a.slice(5) - b.slice(5) );
            });
            posts.forEach(postKey => {
                redisClient.hgetall(postKey,(err,post)=>{
                    consoleError(err);
                    consoleError(err);
                    if (post.userKey == userKeys.followUser) {
                        sendPost('timelinePost',post, postKey);
                    }                      
                });
            });
        });
    });


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
