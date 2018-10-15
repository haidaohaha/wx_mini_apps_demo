Page({
  onTap:function(){
    // wx.navigateTo({
    //   url: '../post/post',
    // })

    wx.redirectTo({
      url: '../post/post',
    })
  }
})