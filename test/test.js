const parser = require('../lib/index')

describe('parser', function () {
  it.skip('should able to parse WXML', function () {
    parser(`
    <view class="container" wx:if="{{canIUse}}">
    </view>
    `.trim())
  })

  it.skip('should able to parse WXML', function () {
    parser(`
      <view class="container">
        <view class="userinfo">
          <button wx:if="{{!hasUserInfo && canIUse}}"> 获取头像昵称 </button>
        </view>
      </view>
    `.trim())
  })

  it('should able to parse WXML', function () {
    parser(`
      <view class="container">
        <view class="userinfo">
          <button wx:if="{{!hasUserInfo && canIUse}}"> 获取头像昵称 </button>
          <block wx:else>
            <image src="{{userInfo.avatarUrl}}" background-size="cover"></image>
            <text class="userinfo-nickname">{{userInfo.nickName}}</text>
          </block>
        </view>
      </view>
    `.trim())
  })
})