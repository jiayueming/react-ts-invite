// /* tslint:disable */
// /**
//  * Created by demain on 2017/11/10.
//  * 函数描述：webView调用JS事件
//  * jsBridge.registerHandler(method, callBack(response));
//  * @param method {string} 方法名
//  * @return {Object} 回调
//  */
// let temp: any = window
// // const WebViewJavascriptBridge: any
// let uniqueId = 0
// const JsBridge = {
//   jsBridge: function (funcName:any, data?:any, callback?:any) {
//     if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) { //ios
//       JsBridge.setupWebViewJavascriptBridge(function (bridge:any) {
//         bridge.callHandler(funcName, data, callback)
//       });
//     } else if (navigator.userAgent.match(/android/i)) {
//       JsBridge.connectWebViewJavascriptBridge(function (bridge:any) {
//         if (uniqueId === 1) {
//           bridge.init(function (message:string, responseCallback:any) {
//             responseCallback(data)
//           });
//         }
//         if (temp.WebViewJavascriptBridge) {
//             temp.WebViewJavascriptBridge.callHandler(
//             funcName
//             , data
//             , callback
//           );
//         } else {
//           bridge.callHandler(funcName, data, callback)
//         }
//         bridge.registerHandler("XNPB_GetRequest_Message", function (data:any, responseCallback:any) {
//           // let responseData = "我接受到了安卓的调用";
//         });
//       });
//     }
//   },
//   setupWebViewJavascriptBridge: function (callback:any) {
//     if (temp.WebViewJavascriptBridge) {
//       return callback(WebViewJavascriptBridge)
//     }
//     if (temp.WVJBCallbacks) {
//       return temp.WVJBCallbacks.push(callback)
//     }
//     temp.WVJBCallbacks = [callback];
//     var WVJBIframe = document.createElement('iframe')
//     WVJBIframe.style.display = 'none';
//     WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
//     document.documentElement.appendChild(WVJBIframe)
//     setTimeout(function () {
//       document.documentElement.removeChild(WVJBIframe)
//     }, 100)
//   }
//   ,
//   connectWebViewJavascriptBridge: function (callback:any) {
//     uniqueId++;
//     if (temp.WebViewJavascriptBridge) {
//       callback(WebViewJavascriptBridge)
//     } else {
//       document.addEventListener(
//         'WebViewJavascriptBridgeReady'
//         , function () {
//           callback(WebViewJavascriptBridge)
//         }, false)
//     }
//   }
// }

// export default JsBridge


/**
 * Created by demain on 2017/11/10.
 * 函数描述：webView调用JS事件
 * jsBridge.registerHandler(method, callBack(response));
 * @param method {string} 方法名
 * @return {Object} 回调
 */
let uniqueId = 0
const JsBridge = {
  connectWebViewJavascriptBridge: function (callback) {
    uniqueId++;
    if (window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge)
    } else {
      document.addEventListener(
        'WebViewJavascriptBridgeReady'
        , function () {
          callback(WebViewJavascriptBridge)
        }, false)
    }
  },
  jsBridge: function (funcName, data, callback) {
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) { //ios
      JsBridge.setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler(funcName, data, callback)
      });
    } else if (navigator.userAgent.match(/android/i)) {
      JsBridge.connectWebViewJavascriptBridge(function (bridge) {
        if (uniqueId === 1) {
          bridge.init(function (message, responseCallback) {
            responseCallback(data)
          });
        }
        if (window.WebViewJavascriptBridge) {
          window.WebViewJavascriptBridge.callHandler(
            funcName
            , data
            , callback
          );
        } else {
          bridge.callHandler(funcName, data, callback)
        }
        bridge.registerHandler("XNPB_GetRequest_Message", function () {
          let responseData = "我接受到了安卓的调用";
        });
      });
    }
  },
  setupWebViewJavascriptBridge: function (callback) {
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge)
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback)
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe')
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
    document.documentElement.appendChild(WVJBIframe)
    setTimeout(function () {
      document.documentElement.removeChild(WVJBIframe)
    }, 100)
  }
}

export default JsBridge