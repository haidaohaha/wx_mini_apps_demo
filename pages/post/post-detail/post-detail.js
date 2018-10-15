// pages/post/post-detail/post-detail.js
const dataList = require('../../../data/posts-data.js')

Page({
  data: {

  },
  onLoad: function(options) {
    const postId = options.id;
    const postData = dataList.postList[postId];
    this.setData({
      ...this.data,
      ...postData
    });

    let postsCollected = wx.getStorageSync('post_collected');
    let postCollected = false;
    if (postsCollected) {
      postCollected = postsCollected[postId];
    } else {
      postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('post_collected', postsCollected)
    }
    this.setData({
      collected: postCollected
    })
  },

  onCollectTap: function(el) {
    let postsCollected = wx.getStorageSync('post_collected');
    let postCollected = postsCollected[this.data.postId];
    postCollected = !postCollected;
    postsCollected[this.data.postId] = postCollected;
    wx.setStorageSync('post_collected', postsCollected);
    this.setData({
      collected: postCollected
    })
  }

})