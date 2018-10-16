Page({
  onTap:function(){
    // wx.navigateTo({
    //   url: 'pages/post/post',
    // })

    // wx.redirectTo({
    //   url: '../post/post',
    // })

    wx.switchTab({
      url: "../post/post"
    });
  }
})