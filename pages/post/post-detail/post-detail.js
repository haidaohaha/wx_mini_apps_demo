// pages/post/post-detail/post-detail.js
const app = getApp()
const dataList = require('../../../data/posts-data.js')
const backgroundAudioManager = wx.getBackgroundAudioManager();

Page({
  data: {
    collected: false
  },
  onLoad: function(options) {
    const postId = options.id;
    const postData = dataList.postList[postId];
    this.data.currentPostId = postId;
    let postsCollected = wx.getStorageSync('post_collected');
    let postCollected = false;
    if (postsCollected) {
      postCollected = postsCollected[postId] || false;
    } else {
      postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('post_collected', postsCollected)
    }

    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId ===
      postId) {
      this.setData({
        isMusic: true
      })
    }
    this.setData({
      ...this.data,
      ...postData,
      collected: postCollected,
    });

    this.setMusicMonitor();
  },

  setMusicMonitor: function () {
    //点击播放图标和总控开关都会触发这个函数
    var that = this;
    wx.onBackgroundAudioPlay(function (event) {
      var pages = getCurrentPages();
      var currentPage = pages[pages.length - 1];
      if (currentPage.data.currentPostId === that.data.currentPostId) {
        // 打开多个post-detail页面后，每个页面不会关闭，只会隐藏。通过页面栈拿到到
        // 当前页面的postid，只处理当前页面的音乐播放。
        if (app.globalData.g_currentMusicPostId == that.data.currentPostId) {
          // 播放当前页面音乐才改变图标
          that.setData({
            isMusic: true
          })
        }
        // if(app.globalData.g_currentMusicPostId == that.data.currentPostId )
        // app.globalData.g_currentMusicPostId = that.data.currentPostId;
      }
      app.globalData.g_isPlayingMusic = true;

    });
    wx.onBackgroundAudioPause(function () {
      var pages = getCurrentPages();
      var currentPage = pages[pages.length - 1];
      if (currentPage.data.currentPostId === that.data.currentPostId) {
        if (app.globalData.g_currentMusicPostId == that.data.currentPostId) {
          that.setData({
            isMusic: false
          })
        }
      }
      app.globalData.g_isPlayingMusic = false;
      // app.globalData.g_currentMusicPostId = null;
    });
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      // app.globalData.g_currentMusicPostId = null;
    });
  },

  onCollectTap: function(event) {
    let postsCollected = wx.getStorageSync('post_collected');
    let postCollected = postsCollected[this.data.postId];
    postCollected = !postCollected;
    postsCollected[this.data.postId] = postCollected;
    wx.setStorageSync('post_collected', postsCollected);
    this.setData({
      collected: postCollected
    })

    wx.showToast({
      title: postCollected ? '已收藏' : '已取消',
      icon: 'success',
    })
  },

  onShareTap: function(event) {
    const itemList = [
      '分享给朋友？',
      '分享到朋友圈？',
      '分享到QQ？',
      '分享到微博？',
    ];
    wx.showActionSheet({
      itemList: itemList,
      success: function(res) {
        wx.showModal({
          title: itemList[res.tapIndex],
          content: '内容' + itemList[res.tapIndex],
          confirmText: '确定分享',
          cancelText: '取消',
          success: function(res) {
            wx.showToast({
              title: '操作成功',
              icon: 'success',
            })
          }
        })
      }
    })
  },

  onMusicTap: function(event) {
    const that = this
    const currentPostId = this.data.currentPostId;
    const {
      music = {}
    } = dataList.postList[currentPostId];
    const dataUrl = music.url;

    if (this.data.isMusic) {
      wx.stopBackgroundAudio({
        dataUrl,
        title: music.title,
        coverImgUrl: music.coverImg,
        success() {
          that.setData({
            isMusic: false
          })
        }
      })
      app.globalData.g_isPlayingMusic = false;
    } else {
      wx.playBackgroundAudio({
        dataUrl,
        title: music.title,
        coverImgUrl: music.coverImg,
        success() {
          that.setData({
            isMusic: true
          })
        }
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = currentPostId;
    }

  }
})