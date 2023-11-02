import { initialTweetsData } from "./data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'


document.addEventListener("click", function(e){
    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.comment){
        handleCommentClick(e.target.dataset.comment)
    }
    else if(e.target.id === "post-btn"){
        handlePostBtnClick()
    }
    else if(e.target.dataset.commentPostBtn){
        handleCommentPostBtnClick(e.target.dataset.commentPostBtn)
    }
    else if(e.target.dataset.deleteTweet){
        hadleDeleteTweetClick(e.target.dataset.deleteTweet)
    }
    else if(e.target.dataset.deleteComment){
        handleDeleteCommentClick(e.target.dataset.deleteComment, e.target.dataset.tweetId)
    }
})


function handleLikeClick(tweetId) 
{
    const targetTweet = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    if(!targetTweet.isLiked)
    {
        targetTweet.likes++
    }
    else
    {
        targetTweet.likes--
    }
    targetTweet.isLiked = !targetTweet.isLiked
    render()
}

function handleRetweetClick(tweetId)
{
    const targetTweet = tweetsData.filter(function(tweet){
        return (tweet.uuid === tweetId)
    })[0]
    if(!targetTweet.isRetweeted) {
        targetTweet.retweets++
    }
    else {
        targetTweet.retweets--
    }
    targetTweet.isRetweeted = !targetTweet.isRetweeted
    render()
}

function handleCommentClick(tweetId)
{
    document.getElementById(`comments-container-${tweetId}`).classList.toggle("display-none")
}

function handlePostBtnClick()
{
    const postText = document.getElementById("post-text")
    if(postText.value)
    {
        const newTweet = {
            handle: `@HelloWorld`,
            profilePic: `./images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: `${postText.value}`,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            isOp: true,
            uuid: uuidv4()
        }
        tweetsData.unshift(newTweet)
        postText.value = ""
        render()
    }
}

function handleCommentPostBtnClick(tweetId)
{
    let targetTweet = tweetsData.filter(function(tweet){
        return (tweet.uuid === tweetId)
    })[0]
    const newComment = {
        handle: `@HelloWorld`,
        profilePic: `./images/scrimbalogo.png`,
        tweetText: document.getElementById(`comment-post-${tweetId}`).value,
        isOp: true,
        uuid: uuidv4()
    }
    targetTweet.replies.unshift(newComment)
    render()
}

function hadleDeleteTweetClick(tweetId)
{
    tweetsData.forEach(function(tweet, index){
        if(tweet.uuid === tweetId){
            tweetsData.splice(index, 1)
        }
    })
    render()
}

function handleDeleteCommentClick(commentId, tweetId)
{
    let targetRepliesArray = tweetsData.filter(function(tweet){
        return (tweet.uuid === tweetId)
    })[0].replies
    
    targetRepliesArray.forEach(function(reply, index){
        if(reply.uuid === commentId){
            targetRepliesArray.splice(index, 1)
        }
    })
    render()
}

function getFeedHtmlString() 
{
    
    let feedHtmlString = ``
    tweetsData.forEach(function(tweet)
    {
        let likeIconClass = ``
        let retweetIconClass = ``
        let deleteTweetIcon = ``
        if(tweet.isLiked){
            likeIconClass = `liked-icon`
        }
        if(tweet.isRetweeted){
            retweetIconClass = `retweeted-icon`
        }
        if(tweet.isOp){
            deleteTweetIcon = `<span><i class="fa-regular fa-trash-can" data-delete-tweet="${tweet.uuid}"></i></span>`
        }
        feedHtmlString += `
        <div class="tweet border-bottom">
            <div>
                <img src=${tweet.profilePic}>
            </div>
            <div class="flex-last-child">
                <h4>${tweet.handle} ${deleteTweetIcon}</h4>
                <p>${tweet.tweetText}</p>
                <div class="tweet-btn-container">
                    <div>
                        <i class="fa-regular fa-comment" data-comment="${tweet.uuid}"></i>
                        &nbsp ${tweet.replies.length}
                    </div>
                    <div>
                        <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                        &nbsp ${tweet.retweets}
                    </div>
                    <div class>
                        <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                        &nbsp ${tweet.likes}
                    </div>
                </div>
                <div class="comments-container display-none" id="comments-container-${tweet.uuid}">
                    <div class="comment-post-container">
                        <textarea placeholder="Post your reply" id="comment-post-${tweet.uuid}"></textarea>
                        <button data-comment-post-btn="${tweet.uuid}">Post</button>
                    </div>
                    ${getCommentHtmlString(tweet)}
                </div>
            </div>
        </div>
        `
    })
    return feedHtmlString
}

function getCommentHtmlString(tweet) 
{
    let commentHtmlString = ``
    if(tweet.replies.length > 0)
    {
        tweet.replies.forEach(function(reply){
            let deleteCommentIcon = ``
            if(reply.isOp){
                deleteCommentIcon = `<span><i class="fa-regular fa-trash-can" data-tweet-id="${tweet.uuid}" data-delete-comment="${reply.uuid}"></i></span>`
            }
            commentHtmlString += `
            <div class="inner-comment border-bottom">
                <div>
                    <img src=${reply.profilePic}>
                </div>
                <div class="flex-last-child">
                    <h4>${reply.handle} ${deleteCommentIcon}</h4>
                    <p>${reply.tweetText}</p>
                </div>
            </div>
            `
        })
    }
    return commentHtmlString
}


function render(){
    updateLocalStorage()
    const feed = document.getElementById("feed")
    feed.innerHTML = getFeedHtmlString()
}

function updateLocalStorage()
{
    localStorage.setItem("localTweetsData", JSON.stringify(tweetsData))
}

function initializeApp()
{
    if( !localStorage.getItem("localTweetsData") )
    {
        tweetsData = initialTweetsData
        localStorage.setItem("localTweetsData", JSON.stringify(tweetsData))
    }
    else
    {
        tweetsData = JSON.parse(localStorage.getItem("localTweetsData"))
    }
}



let tweetsData
initializeApp()
render()