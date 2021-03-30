declare module 'bdgamelivebaseapi/api/impl/base/Base' {
  import EventEmitter from 'eventemitter3';
  export default class Base extends EventEmitter<string> {
      private _stoped;
      private _uuid;
      constructor();
      get uuid(): number;
      emit(event: string, ...args: any[]): boolean;
      init(): void;
      start(): void;
      stop(): void;
      destroy(): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/base' {
  export { default as Base } from 'bdgamelivebaseapi/api/impl/base/Base';

}
declare module 'bdgamelivebaseapi/api/impl' {
  import { YY as YYInter } from 'bdgamelivebaseapi/api/interfaces';
  export default class YY {
      private static _impl?;
      static get impl(): YYInter;
      static destroy(): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/AppImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { App, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { IMain } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class AppImpl extends NRoot<IMain> implements App {
      constructor(log?: Log);
      showApp(): void;
      exitApp(): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/AudioImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { Audio, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { IAudio } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class AudioImpl extends NRoot<IAudio> implements Audio {
      constructor(log?: Log);
      setAudioConfig(profile: number, commutMode: number, scenarioMode: number): void;
      enumInputDevices(devices: Record<string, any>): Promise<Record<string, any>>;
      setInputtingDevice(id: Record<string, any>): Promise<Record<string, any>>;
      getInputtingDevice(id: Record<string, any>): Promise<Record<string, any>>;
      setInputtingVolume(volume: number): Promise<Record<string, any>>;
      getInputtingVolume(volume: number): Promise<Record<string, any>>;
      startInputDeviceTest(indicationInterval: number): Promise<Record<string, any>>;
      stopInputDeviceTest(): Promise<Record<string, any>>;
      enumOutputDevices(devices: Record<string, any>): Promise<Record<string, any>>;
      setOutputtingDevice(id: Record<string, any>): Promise<Record<string, any>>;
      getOutputtingDevice(id: Record<string, any>): Promise<Record<string, any>>;
      setOuttingVolume(volume: number): Promise<Record<string, any>>;
      getOuttingVolume(volume: number): Promise<Record<string, any>>;
      startOutputDeviceTest(indicationInterval: number, audioFileName: string): Promise<Record<string, any>>;
      stopOutputDeviceTest(): Promise<Record<string, any>>;
      enableMicEnhancement(enabled: boolean): Promise<Record<string, any>>;
      enableMicDenoise(enabled: boolean): Promise<Record<string, any>>;
      enableAEC(enabled: boolean): Promise<Record<string, any>>;
      enableAGC(enabled: boolean): Promise<Record<string, any>>;
      setInputSoftwareVolume(volume: number): Promise<Record<string, any>>;
      getInputSoftwareVolume(volume: number): Promise<Record<string, any>>;
      adjustPlaybackSignalVolume(volume: number): Promise<Record<string, any>>;
      getPlaybackSignalVolume(volume: number): Promise<Record<string, any>>;
      enableMicrophone(enbale: boolean): Promise<Record<string, any>>;
      getIsEnableMicrophone(enbale: boolean): Promise<Record<string, any>>;
      enableSpeaker(enbale: boolean): Promise<Record<string, any>>;
      getIsEnableSpeaker(enbale: boolean): Promise<Record<string, any>>;
      enableCaptureVolumeIndication(interval: number, moreThanThd: number, lessThanThd: number, smooth: number): Promise<Record<string, any>>;
      enableLoopbackRecording(enbale: boolean): Promise<any>;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/AuthImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { Auth, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { IAuth } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class AuthImpl extends NRoot<IAuth> implements Auth {
      constructor(log?: Log);
      setAccountInfo(strAccount: string, sha1: string, imStatus: number, isRemeberPassword: boolean, isAutoLogin: boolean, isNewInput: boolean): void;
      saveAccountInfo(): void;
      loginByAccount(strAccount: string, strPassword: string): void;
      loginByCredit(uid: string, credit: string): void;
      loginByThirdParty(source: string, third_sub_sys: string, credit: string): void;
      needBindPhone(val: boolean): void;
      login(): void;
      logout(): Promise<boolean>;
      switchAccount(): Promise<boolean>;
      lastAccount(): Promise<string>;
      accountList(): Promise<string>;
      getDeviceInfo(): Promise<string>;
      removeAccount(account: string): void;
      openUrl(url: string): void;
      setLogoUrl(url: string): void;
      getUDBTickect(): void;
      getToken(appid: string, encode: number): Promise<string>;
      getUDBTicketWithContext(context: string): void;
      getImStatus(): Promise<number>;
      setImStatus(imStatus: number): void;
      isLogined(): Promise<boolean>;
      myUid(): Promise<string>;
      refreshSmsCode(): void;
      refreshVerificationCode(): void;
      verifyCode(type: number, code: string): void;
      verifyDynamicToken(strategy: number, answer: string): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/BdAuthImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { BdAuth, FAST_LOGIN_TYPE, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { IBdAuth } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class BdAuthImpl extends NRoot<IBdAuth> implements BdAuth {
      constructor(log?: Log);
      autoLogin(): void;
      loginBySaveAccount(strAccount: string): void;
      loginByAccount(strAccount: string, strPassword: string): void;
      loginByThirdParty(source: string, third_sub_sys: string, credit: string): void;
      loginByMobile(strMobile: string, strCode: string): void;
      loginFast(type: FAST_LOGIN_TYPE): void;
      createQrCode(width: number, height: number): void;
      showQrCode(show: boolean): void;
      checkQrCode(): void;
      clearQrCode(): void;
      refreshSmsCode(strMobile: string): void;
      logout(): Promise<boolean>;
      getCurrentToken(): any;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/ChannelImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { Channel, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { IChannel } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class ChannelImpl extends NRoot<IChannel> implements Channel {
      constructor(log?: Log);
      joinChannel(sid: number, subSid: number, isYYChannel: boolean): void;
      leaveChannel(): void;
      getUserCount(): Promise<number>;
      getSubSid(): Promise<number>;
      getSid(): Promise<number>;
      getMyUid(): Promise<string>;
      sendMsgPublic(msg: string, fontname: string, size: number, color: number, isBold: boolean, isItalic: boolean, isUnderline: boolean, isStrikeout: boolean): void;
      sendMsgPrivate(msg: string, uid: number, fontname: string, size: number, color: number, isBold: boolean, isItalic: boolean, isUnderline: boolean, isStrikeout: boolean): void;
      enableVoice(uid: number, flag: boolean): void;
      enableText(uid: number, flag: boolean): void;
      kickOutUser(sid: number, uid: number, minutes: number, reason: string, kickOff: boolean): void;
      changeUserRole(uid: number, role: number, sid: number): void;
      changeChannelName(sid: number, name: string): void;
      changeChannelPassword(sid: number, password: string): void;
      changeChannelStyle(sid: number, channelStyle: number): void;
      changeMemberLimit(sid: number, limitcount: number): void;
      changeChannelTemplateId(sid: number, templateId: string): void;
      kickoff(now_from: number, froms: string): void;
      setTextStatus(sid: number, status: number): void;
      ignoreVoice(uid: number, isIgnore: boolean): void;
      ignoreText(uid: number, isIgnore: boolean): void;
      setVoiceList(uid: number, subsid: number, enable: boolean): void;
      getRealNickname(uid: number): Promise<string>;
      kickAllOutOf(sid: number, subsid: number): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/ComImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { Com, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { ICom } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class ComImpl extends NRoot<ICom> implements Com {
      constructor(log?: Log);
      print(type: string, log: string): void;
      setConfig(key: string, value: any, uid: string): void;
      getConfig(key: string, uid: string): Promise<any>;
      getConfigWithDefault(key: string, defaultValue: any, uid: string): Promise<any>;
      removeVar(key: string, uid: string): void;
      writeCacheFile(key: string, value: string, uid: string): void;
      readCacheFile(key: string, uid: string): Promise<string>;
      deleteCacheFile(key: string, uid: string): void;
      setGlobal(key: string, value: any): void;
      getGlobal(key: string): Promise<any>;
      getGlobalWithDefault(key: string, defaultValue: any): Promise<any>;
      removeGlobal(key: string): Promise<any>;
      openUrl(key: string): void;
      getAppVersion(): Promise<string>;
      subscribeCpuUsage(timeInterval: number): void;
      unSubscribeCpuUsage(): void;
      getFontFamily(): Promise<string[]>;
      getTextSize(family: string, fontSize: number, content: string): Promise<number[]>;
      submitFeedback(problem: string, contact: string, uid: string): Promise<boolean>;
      selectFileDialog(title: string, dir: string, filter: string, bSingle: boolean): Promise<string>;
      previewImage(path: string): void;
      openFolder(path: string): void;
      isFileExist(path: string): Promise<boolean>;
      test(): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/GameImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { Game, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { IGameCaptureHelper } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class GameImpl extends NRoot<IGameCaptureHelper> implements Game {
      constructor(log?: Log);
      getGamesStatus(): Promise<Record<string, any>>;
      gameWindowTitleKeyword(): Promise<string>;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/IpcImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { Ipc, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { IYYIPC } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class IpcImpl extends NRoot<IYYIPC> implements Ipc {
      constructor(log?: Log);
      sendMessageToWindow(windowId: number, message: string): void;
      broadcastMessageToWindows(message: string): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/LinkImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { Link, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { ILianMai } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class LianMaiImpl extends NRoot<ILianMai> implements Link {
      constructor(log?: Log);
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/LiveImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { Live, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { IHappyLive } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class LiveImpl extends NRoot<IHappyLive> implements Live {
      constructor(log?: Log);
      joinChannel(channelId: string, childId: string): void;
      leaveChannel(): void;
      initLive(myUid: string, appName: string, appVer: string, deviceId: string): void;
      uninitLive(): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/LiveSvcImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { LiveSvc, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { ISvcTransfer } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class LiveSvcImpl extends NRoot<ISvcTransfer> implements LiveSvc {
      constructor(log?: Log);
      initSvc(): void;
      parseProtocolData(nServiceId: number, data: string, size: number): Promise<number>;
      setPublishServiceId(nServiceId: number): void;
      setPublishServiceUseMobSvr(bUsed: boolean): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/LiveWrapImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { LiveWrap, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { IHappyLiveWrapper } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class LiveImpl extends NRoot<IHappyLiveWrapper> implements LiveWrap {
      constructor(log?: Log);
      startPushVideo(params: Record<string, any>): void;
      stopPushVideo(): void;
      startPushAudio(params: Record<string, any>): void;
      stopPushAudio(): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/LogImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { Log } from 'bdgamelivebaseapi/api/interfaces';
  import { ICom } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class LogImpl extends NRoot<ICom> implements Log {
      private _page;
      private _env;
      constructor();
      set page(val: string);
      get page(): string;
      set env(val: string);
      init(): void;
      debug(tag: string, content: string): void;
      info(tag: string, content: string): void;
      error(tag: string, content: string): void;
      log(tag: string, content: string): void;
      private print;
      private printSdkInfo;
      private static get LOG();
      private static get DEBUG();
      private static get INFO();
      private static get ERROR();
      private static get DEV();
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/NRoot' {
  import { Base } from 'bdgamelivebaseapi/api/impl/base';
  import { Log } from 'bdgamelivebaseapi/api/interfaces';
  import { ObjectAlias } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class NRoot<T extends ObjectAlias = ObjectAlias> extends Base {
      private _signals;
      private _root;
      private _debug?;
      constructor(root?: T, log?: Log);
      get root(): T | null;
      destroy(): void;
      on(event: string, fn: (...args: any[]) => void): this;
      off(event: string, fn: (...args: any[]) => void): this;
      protected reset(root?: T): void;
      protected debug(tag: string, content: string): void;
      protected info(tag: string, content: string): void;
      protected error(tag: string, content: string): void;
      protected callLog(api: string, content?: string): void;
      protected callError(): Promise<never>;
      private connect;
      private disconnect;
      private disconnectAll;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/NetworkImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { Network, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { INetworkSpeedTest } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class NetworkImpl extends NRoot<INetworkSpeedTest> implements Network {
      constructor(log?: Log);
      initWork(): void;
      uninitWork(): void;
      startWork(nBitrate: number, strTicket: string): void;
      stopWork(): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/PublishImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { Publish, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { ISinglePublish } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class PublishImpl extends NRoot<ISinglePublish> implements Publish {
      constructor(log?: Log);
      checkLivePermission(appdata: string): void;
      setAnchorLiveDesc(title: string, appdata: string): void;
      getAnchorLiveDesc(queryHistory: number, appdata: string): void;
      setLivingBzExtend(extend: string, appdata: string): void;
      updateRtCover(delaySeconds: string, appdata: string): void;
      startLive(publishType: number, channelTemplateId: number, forceEndExistLive: boolean, mediaType: number, title: string, token: string, extend: string, appdata: string): void;
      stopLive(appdata: string): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/ReporterImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { Reporter, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { IReporter } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class ReporterImpl extends NRoot<IReporter> implements Reporter {
      constructor(log?: Log);
      setProdInfo(appKey: string, prodID: string, version: string, from: string, uid: string): Promise<boolean>;
      deviceId(): Promise<string>;
      setReportDomain(domain: string): void;
      report(eventId: number, params: number): void;
      setReportUser(uid: string): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/RoomImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { Room, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { IRoom } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class RoomImpl extends NRoot<IRoom> implements Room {
      constructor(log?: Log);
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/RtmpImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { Rtmp, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { IRtmp } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class RtmpImpl extends NRoot<IRtmp> implements Rtmp {
      constructor(log?: Log);
      startService(port: number): Promise<boolean>;
      stopService(): void;
      getVideoSharedMemoryName(): Promise<string>;
      getAudioSharedMemoryName(): Promise<string>;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/SourceImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { Source, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { ISourceManager } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class SourceImpl extends NRoot<ISourceManager> implements Source {
      constructor(log?: Log);
      clear(): void;
      setOutputInfo(width: number, height: number, fps: number): void;
      startPushVideo(): Promise<string>;
      stopPushVideo(): void;
      addSource(id: string, type: string, infoMap: Record<string, any>): Promise<boolean>;
      updateSource(id: string, type: string, infoMap: Record<string, any>): void;
      removeSource(id: string): void;
      setSourceNormalRect(id: string, x: number, y: number, width: number, height: number): void;
      setSourceVisible(id: string, visible: boolean): void;
      setCameraPreview(id: string, visible: boolean): void;
      moveSourceUp(id: string): void;
      moveSourceDown(id: string): void;
      moveSourceToTop(id: string): void;
      moveSourceToBottom(id: string): void;
      getMonitors(thumbWidth: number, thumbHeight: number): Promise<Record<string, any>>;
      getWindows(): Promise<Record<string, any>>;
      getCamerDevices(): Promise<Record<string, any>[]>;
      getFontFamilyies(): Promise<string[]>;
      showAreaSelector(): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/StreamImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { Stream, Log, FEATURE_SUPPORT, EncCodecID } from 'bdgamelivebaseapi/api/interfaces';
  import { IMediaStream } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class StreamImpl extends NRoot<IMediaStream> implements Stream {
      constructor(log?: Log);
      updateToken(type: number, token: string): void;
      queryStreamInfoWithAvp(keys: string[]): void;
      startPublish(type: number): void;
      stopPublish(type: number): void;
      setPublishConfig(id: string): void;
      setCustomPublishConfig(playtype: number, width: number, height: number, fps: number, rate: number): void;
      setCustomVideoSource(bEnable: any, option: any): void;
      setCustomAudioSource(bEnable: any, option: any): void;
      checkFeatureSupport(type: FEATURE_SUPPORT): Promise<Record<string, any>>;
      setVideoEncoderID(type: EncCodecID): Promise<Record<string, any>>;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/SvcImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { Svc, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { ISvc2 } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class SvcImpl extends NRoot<ISvc2> implements Svc {
      constructor(log?: Log);
      createService(svcId: number): Promise<boolean>;
      closeService(svcId: number): Promise<boolean>;
      send(svcId: number, data: string): Promise<boolean>;
      joinGroup(svcId: number, top32: number, low64: number): Promise<boolean>;
      leaveGroup(svcId: number, top32: number, low64: number): Promise<boolean>;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/TrayImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { Tray, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { ITrayIcon } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class TrayImpl extends NRoot<ITrayIcon> implements Tray {
      constructor(log?: Log);
      show(): void;
      hide(): void;
      setIcon(pathFile: string): void;
      setToolTip(tip: string): void;
      getPopupPos(): Promise<Record<string, any>>;
      beginFlashIcon(): void;
      stopFlashIcon(): void;
      isFlashingIcon(): Promise<boolean>;
      private initTrayIcon;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/VideoImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { Video, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { IVideo } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class VideoImpl extends NRoot<IVideo> implements Video {
      constructor(log?: Log);
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/WinImpl' {
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  import { Win, Area, Log } from 'bdgamelivebaseapi/api/interfaces';
  import { IWin } from 'bdgamelivebaseapi/api/impl/native/windows';
  export default class WinImpl extends NRoot<IWin> implements Win {
      constructor(log?: Log);
      move(x: number, y: number): void;
      resize(w: number, h: number): void;
      setRect(x: number, y: number, w: number, h: number): void;
      setMinSize(w: number, h: number): void;
      maximize(): void;
      minimize(): void;
      restore(): void;
      moveCenter(): void;
      maximizeOrRestore(): void;
      show(): void;
      hide(): void;
      close(): void;
      activate(): void;
      closeOther(windowId: number): void;
      isVisible(): Promise<boolean>;
      winId(): Promise<number>;
      setNCBorderWidth(nBorder: number): void;
      setCaptionArea(captionRect: Area[]): void;
      addStyle(style: number): void;
      removeStyle(style: number): void;
      getWindowInfo(): Promise<Record<string, any>>;
      openBrowserWindow(param: Record<string, any>, ifNotExistThenCreateOsrBrowser: boolean): Promise<import("bdgamelivebaseapi/api/impl/native/windows").IWindowInfo>;
      openBrowserWindowInCurProcess(param: Record<string, any>): Promise<Record<string, any>>;
      ignoreSysClose(ignore: boolean): void;
      showColorPicker(): void;
      addChildWnd(hwnd: number, x: number, y: number): void;
      removeChildWnd(hwnd: number): void;
      setResizable(enable: boolean): void;
      setTopMost(enable: boolean): void;
      setFrameless(enable: boolean): void;
      setShowInTaskBar(enable: boolean): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native/YYImpl' {
  import { YY } from 'bdgamelivebaseapi/api/interfaces';
  import AudioImpl from 'bdgamelivebaseapi/api/impl/native/AudioImpl';
  import AuthImpl from 'bdgamelivebaseapi/api/impl/native/AuthImpl';
  import BdAuthImpl from 'bdgamelivebaseapi/api/impl/native/BdAuthImpl';
  import ChannelImpl from 'bdgamelivebaseapi/api/impl/native/ChannelImpl';
  import GameImpl from 'bdgamelivebaseapi/api/impl/native/GameImpl';
  import LinkImpl from 'bdgamelivebaseapi/api/impl/native/LinkImpl';
  import LiveImpl from 'bdgamelivebaseapi/api/impl/native/LiveImpl';
  import LiveWrapImpl from 'bdgamelivebaseapi/api/impl/native/LiveWrapImpl';
  import AppImpl from 'bdgamelivebaseapi/api/impl/native/AppImpl';
  import NetworkImpl from 'bdgamelivebaseapi/api/impl/native/NetworkImpl';
  import PublishImpl from 'bdgamelivebaseapi/api/impl/native/PublishImpl';
  import ReporterImpl from 'bdgamelivebaseapi/api/impl/native/ReporterImpl';
  import RoomImpl from 'bdgamelivebaseapi/api/impl/native/RoomImpl';
  import RtmpImpl from 'bdgamelivebaseapi/api/impl/native/RtmpImpl';
  import SourceImpl from 'bdgamelivebaseapi/api/impl/native/SourceImpl';
  import SvcImpl from 'bdgamelivebaseapi/api/impl/native/SvcImpl';
  import TrayImpl from 'bdgamelivebaseapi/api/impl/native/TrayImpl';
  import VideoImpl from 'bdgamelivebaseapi/api/impl/native/VideoImpl';
  import WinImpl from 'bdgamelivebaseapi/api/impl/native/WinImpl';
  import ComImpl from 'bdgamelivebaseapi/api/impl/native/ComImpl';
  import LogImpl from 'bdgamelivebaseapi/api/impl/native/LogImpl';
  import IpcImpl from 'bdgamelivebaseapi/api/impl/native/IpcImpl';
  import StreamImpl from 'bdgamelivebaseapi/api/impl/native/StreamImpl';
  import LiveSvcImpl from 'bdgamelivebaseapi/api/impl/native/LiveSvcImpl';
  import NRoot from 'bdgamelivebaseapi/api/impl/native/NRoot';
  export default class YYImpl extends NRoot implements YY {
      private _audio;
      private _auth;
      private _bdauth;
      private _channel;
      private _com;
      private _game;
      private _link;
      private _live;
      private _liveWrap;
      private _app;
      private _network;
      private _publish;
      private _reporter;
      private _room;
      private _rtmp;
      private _source;
      private _svc;
      private _tray;
      private _video;
      private _win;
      private _log;
      private _ipc;
      private _stream;
      private _liveSvc;
      constructor();
      get audio(): AudioImpl;
      get auth(): AuthImpl;
      get bdauth(): BdAuthImpl;
      get channel(): ChannelImpl;
      get com(): ComImpl;
      get game(): GameImpl;
      get link(): LinkImpl;
      get live(): LiveImpl;
      get liveWrap(): LiveWrapImpl;
      get app(): AppImpl;
      get network(): NetworkImpl;
      get publish(): PublishImpl;
      get reporter(): ReporterImpl;
      get room(): RoomImpl;
      get rtmp(): RtmpImpl;
      get source(): SourceImpl;
      get svc(): SvcImpl;
      get tray(): TrayImpl;
      get video(): VideoImpl;
      get win(): WinImpl;
      get log(): LogImpl;
      get ipc(): IpcImpl;
      get stream(): StreamImpl;
      get liveSvc(): LiveSvcImpl;
      init(): void;
      start(): void;
      stop(): void;
      destroy(): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/native' {
  export const isNative = true;
  export { default as NativeYY } from 'bdgamelivebaseapi/api/impl/native/YYImpl';

}
declare module 'bdgamelivebaseapi/api/impl/native/windows' {
  export type ObjectAlias = Record<string, any>;
  export interface Signal0 {
      (): void;
  }
  export interface Signal1<A> {
      (arg0: A): void;
  }
  export interface Signal2<A, B> {
      (arg0: A, arg1: B): void;
  }
  export interface Signal3<A, B, C> {
      (arg0: A, arg1: B, arg2: C): void;
  }
  export interface Signal4<A, B, C, D> {
      (arg0: A, arg1: B, arg2: C, arg3: D): void;
  }
  export interface Signal5<A, B, C, D, F> {
      (arg0: A, arg1: B, arg2: C, arg3: D, arg4: F): void;
  }
  export interface Signal6<A, B, C, D, F, G> {
      (arg0: A, arg1: B, arg2: C, arg3: D, arg4: F, arg5: G): void;
  }
  export interface Signal7<A, B, C, D, F, G, H> {
      (arg0: A, arg1: B, arg2: C, arg3: D, arg4: F, arg5: G, arg6: H): void;
  }
  export interface Signal8<A, B, C, D, F, G, H, I> {
      (arg0: A, arg1: B, arg2: C, arg3: D, arg4: F, arg5: G, arg6: H, arg7: I): void;
  }
  export interface Signal9<A, B, C, D, F, G, H, I, J> {
      (arg0: A, arg1: B, arg2: C, arg3: D, arg4: F, arg5: G, arg6: H, arg7: I, arg8: J): void;
  }
  export interface Rect {
      x: number;
      y: number;
      w: number;
      h: number;
  }
  export enum WinHints {
      DefaultHint = 0,
      FramelessHint = 1,
      ResizableHint = 2,
      InTaskbarHint = 4,
      ShadowHint = 8,
      TopMostHint = 16,
      LayeredHint = 32
  }
  export type Area = [number, number, number, number];
  export interface ConnectResult {
      disconnect: () => void;
  }
  export interface ConnectSignal {
      (signal: any, slot: any): ConnectResult;
  }
  export interface ITrayIcon extends ObjectAlias {
      show: () => void;
      hide: () => void;
      setIcon: (pathFile: string) => void;
      setToolTip: (tip: string) => void;
      getPopupPos: () => Promise<Record<string, any>>;
      beginFlashIcon: () => void;
      stopFlashIcon: () => void;
      isFlashingIcon: () => Promise<boolean>;
      onRightButtonClicked: Signal0;
      onLeftButtonClicked: Signal0;
      onLeftButtonDoubleClicked: Signal0;
      onHoverEnter: Signal0;
      onHoverLeave: Signal0;
  }
  export interface ICom extends ObjectAlias {
      print: (type: string, log: string) => void;
      trayIcon: () => Promise<ITrayIcon>;
      setConfig: (key: string, value: any, uid: string) => void;
      getConfig: (key: string, uid: string) => Promise<any>;
      getConfigWithDefault: (key: string, defaultValue: any, uid: string) => Promise<any>;
      removeVar: (key: string, uid: string) => void;
      writeCacheFile: (key: string, value: string, uid: string) => void;
      readCacheFile: (key: string, uid: string) => Promise<string>;
      deleteCacheFile: (key: string, uid: string) => void;
      setGlobal: (key: string, value: any) => void;
      getGlobal: (key: string) => Promise<any>;
      getGlobalWithDefault: (key: string, defaultValue: any) => Promise<any>;
      removeGlobal: (key: string) => Promise<any>;
      openUrl: (key: string) => void;
      getAppVersion: () => Promise<string>;
      subscribeCpuUsage: (timeInterval: number) => void;
      unSubscribeCpuUsage: () => void;
      onCpuUsageData: Signal1<number>;
      getFontFamily(): Promise<string[]>;
      getTextSize(family: string, fontSize: number, content: string): Promise<number[]>;
      submitFeedback: (problem: string, contact: string, uid: string) => Promise<boolean>;
      onConfigUpdated: Signal2<string, any>;
      onGlobalUpdated: Signal2<string, any>;
      selectFileDialog: (title: string, dir: string, filter: string, bSingle: boolean) => Promise<string>;
      previewImage: (path: string) => void;
      openFolder: (path: string) => void;
      isFileExist: (path: string) => Promise<boolean>;
      test: () => void;
  }
  export interface IYYIPC extends ObjectAlias {
      sendMessageToWindow: (windowId: number, message: string) => void;
      broadcastMessageToWindows: (message: string) => void;
      ipcMessageArrived: Signal2<number, string>;
      ipcBroadcastMessageArrived: Signal2<number, string>;
  }
  export interface OpenBrowseParam extends Record<string, any> {
      url: string;
      width?: number;
      height?: number;
      x?: number;
      y?: number;
      center?: boolean;
      visible?: boolean;
      windowId?: number;
      transparent?: boolean;
      topMost?: boolean;
      frameless?: boolean;
      showInTaskbar?: boolean;
      openOrCreateResult?: number;
      waitEventHandle?: number;
      waitThreadId?: number;
      parentHandle: number;
  }
  export interface IWindowInfo {
      windowId: number;
      windowHandle: number;
      cefId: number;
  }
  export interface IWin extends ObjectAlias {
      IPC: IYYIPC;
      move: (x: number, y: number) => void;
      resize: (w: number, h: number) => void;
      setRect: (x: number, y: number, w: number, h: number) => void;
      setMinSize: (w: number, h: number) => void;
      maximize: () => void;
      minimize: () => void;
      restore: () => void;
      moveCenter: () => void;
      maximizeOrRestore: () => void;
      show: () => void;
      hide: () => void;
      close: () => void;
      activate: () => void;
      closeOther: (windowId: number) => void;
      isVisible: () => Promise<boolean>;
      winId: () => Promise<number>;
      setNCBorderWidth: (nBorder: number) => void;
      setCaptionArea: (captionRect: Area[]) => void;
      addStyle: (style: number) => void;
      removeStyle: (style: number) => void;
      getWindowInfo: () => Promise<Record<string, any>>;
      openBrowserWindow: (param: Record<string, any>, ifNotExistThenCreateOsrBrowser: boolean) => Promise<IWindowInfo>;
      openBrowserWindowInCurProcess: (param: Record<string, any>) => Promise<Record<string, any>>;
      ignoreSysClose: (ignore: boolean) => void;
      showColorPicker: () => void;
      addChildWnd: (hwnd: number, x: number, y: number) => void;
      removeChildWnd: (hwnd: number) => void;
      setResizable: (enable: boolean) => void;
      setTopMost: (enable: boolean) => void;
      setFrameless: (enable: boolean) => void;
      setShowInTaskBar: (enable: boolean) => void;
      sigWindowSizeChange: Signal1<number>;
      sigWindowMaximined: Signal0;
      sigWindowRestored: Signal0;
      sigPickerColor: Signal1<string>;
  }
  export interface IMain extends ObjectAlias {
      showApp: () => void;
      exitApp: () => void;
      test: (text: string) => void;
      onTest: Signal1<Uint8Array>;
  }
  export interface ISvc1 extends ObjectAlias {
      openConnection: (nServiceId: number) => Promise<boolean>;
      closeConnection: (nServiceId: number) => Promise<boolean>;
      sendServiceData: (nServiceId: number, data: Uint8Array) => Promise<boolean>;
      serviceReady: Signal0;
      serviceStatusChanged: Signal2<number, number>;
      serviceDataArrived: Signal2<number, Uint8Array>;
  }
  export interface ISvcTran extends ObjectAlias {
      createService: (bBase64: boolean) => Promise<boolean>;
      closeService: () => Promise<boolean>;
      send: (data: Uint8Array) => Promise<boolean>;
      onSvcReady: Signal0;
      onSvcStatus: Signal1<number>;
      onSvcData: Signal1<Uint8Array>;
  }
  export interface ISvc extends ObjectAlias {
      instance: (svcId: number) => Promise<ISvcTran>;
      isStandby: () => Promise<boolean>;
  }
  export enum SVCTRANSPT_SEND_OPT {
      SVCTRANSPT_SEND_WITH_NONE = 0,
      SVCTRANSPT_SEND_WITH_SID = 1,
      SVCTRANSPT_SEND_WITH_SUBSID = 2
  }
  export interface ISvc2 extends ObjectAlias {
      createService: (svcId: number) => Promise<boolean>;
      closeService: (svcId: number) => Promise<boolean>;
      send: (svcId: number, data: string) => Promise<boolean>;
      joinGroup: (svcId: number, top32: number, low64: number) => Promise<boolean>;
      leaveGroup: (svcId: number, top32: number, low64: number) => Promise<boolean>;
      onReady: Signal1<number>;
      onClose: Signal1<number>;
      onStatus: Signal2<number, number>;
      onRecv: Signal2<number, Uint8Array>;
      onSvcData: Signal2<number, string>;
  }
  export enum LOGIN_LINK_STATES {
      LINK_INIT = 0,
      LINK_LBS = 1,
      EXCHANGE_PASSWORD = 2,
      LBS_ERROR = 3,
      LINK_AUTH = 4,
      LOGIN_SUCCESS = 5,
      LOGIN_RETRY = 6,
      PASSWD_ERROR = 7,
      SERVER_ERROR = 8,
      NET_BROKEN = 9,
      TIMEOUT = 10,
      KICKOFF = 11,
      LOGOUT = 12,
      UNKNOWN = 13,
      LOGIN_DC_READY = 14,
      PROTOCOL_OLD = 15,
      LINK_GETMAIL = 16,
      NON_EMAIL = 17,
      LBS_SHUTDOWN = 18,
      RELOGIN_SUCCESS = 19,
      SERVER_REDIRECT = 20,
      USER_NONEXIST = 21,
      UDB_NOTENABLE = 22,
      GLOBAL_BAN = 23,
      MUL_KICK = 24,
      LBS_EPROT = 25,
      IM_LOGIN_ERROR = 26,
      IM_LOGIN_SUCCESS = 27,
      IM_LOGOUT = 28,
      IM_LOGIN_NO_IMID = 29,
      IM_LOGIN_IMLINK_TIMEOUT = 30,
      IM_LOGIN_IMLBS_TIMEOUT = 31,
      IM_LOGIN_LOGINING = 32,
      IM_LOGIN_REQUEST_IMID_FAILED = 33,
      FREEZE_BAN = 34,
      IM_RELOGINED = 35,
      IM_LOGIN_START = 36,
      LINKD_CREDIT_ERROR = 37,
      REAL_CREDIT_ERROR = 38,
      REAL_LOGIN_FAIL = 8001,
      DYNAMIC_KEY_FAILED = 8002,
      NETWORK_RESUME = 8003,
      NETWORK_LOST = 8004,
      DYNAMIC_KEY_NORETURN = 8005,
      DYNAMIC_KEY_TIMEOUT = 8006,
      VERIFY_PIC_NORETURN = 8007,
      VERIFY_PIC_TIMEOUT = 8008,
      LINKD_CLOSED = 8009
  }
  export interface IAuth extends ObjectAlias {
      setAccountInfo: (strAccount: string, sha1: string, imStatus: number, isRemeberPassword: boolean, isAutoLogin: boolean, isNewInput: boolean) => void;
      saveAccountInfo: () => void;
      loginByAccount: (strAccount: string, strPassword: string) => void;
      loginByCredit: (uid: string, credit: string) => void;
      loginByThirdParty: (source: string, third_sub_sys: string, credit: string) => void;
      needBindPhone: (val: boolean) => void;
      login: () => void;
      logout: () => Promise<boolean>;
      switchAccount(): Promise<boolean>;
      lastAccount: () => Promise<string>;
      accountList: () => Promise<string>;
      getDeviceInfo: () => Promise<string>;
      removeAccount: (account: string) => void;
      openUrl: (url: string) => void;
      setLogoUrl: (url: string) => void;
      getUDBTickect: () => void;
      getToken: (appid: string, encode: number) => Promise<string>;
      getUDBTicketWithContext: (context: string) => void;
      getImStatus: () => Promise<number>;
      setImStatus: (imStatus: number) => void;
      isLogined: () => Promise<boolean>;
      myUid: () => Promise<string>;
      refreshSmsCode: () => void;
      refreshVerificationCode: () => void;
      verifyCode: (type: number, code: string) => void;
      verifyDynamicToken: (strategy: number, answer: string) => void;
      loginSuccess: Signal1<boolean>;
      loginError: Signal3<string, number, number>;
      reconnectError: Signal3<number, number, number>;
      toBeKicked: Signal2<number, string>;
      currentAccountHasLogined: Signal0;
      verificationCodeRefresh: Signal1<string>;
      SmsCodeRefresh: Signal1<string>;
      needVerificationCode: Signal8<number, number, string, string, string, string, number, number>;
      verifyCodeError: Signal8<number, number, string, string, string, string, number, number>;
      needDynamicToken: Signal3<string, string, string>;
      verifyDynamicTokenError: Signal3<number, string, string>;
      UDBLoginEvent: Signal1<string>;
      UDBSendSMSEvent: Signal1<string>;
      UDBRefreshPicEvent: Signal1<string>;
      UDBUpdateCreditEvent: Signal1<string>;
      udbTicketArrived: Signal2<string, string>;
  }
  export enum FAST_LOGIN_TYPE {
      WEIBO = 0,
      WEIXIN = 1,
      QQ = 2
  }
  export interface IBdAuth extends ObjectAlias {
      autoLogin: () => void;
      loginBySaveAccount: (strAccount: string) => void;
      loginByAccount: (strAccount: string, strPassword: string) => void;
      loginByThirdParty: (source: string, third_sub_sys: string, credit: string) => void;
      loginByMobile: (strMobile: string, strCode: string) => void;
      loginFast: (type: FAST_LOGIN_TYPE) => void;
      createQrCode: (width: number, height: number) => void;
      showQrCode: (show: boolean) => void;
      checkQrCode: () => void;
      clearQrCode: () => void;
      refreshSmsCode: (strMobile: string) => void;
      logout: () => Promise<boolean>;
      GetCurrentToken(): Promise<string>;
      loginSuccess: Signal1<boolean>;
      loginError: Signal3<string, number, number>;
      qrcodeRefresh: Signal1<number>;
  }
  export interface ISinglePublish extends ObjectAlias {
      checkLivePermission: (appdata: string) => void;
      setAnchorLiveDesc: (title: string, appdata: string) => void;
      getAnchorLiveDesc: (queryHistory: number, appdata: string) => void;
      setLivingBzExtend: (extend: string, appdata: string) => void;
      updateRtCover: (delaySeconds: string, appdata: string) => void;
      startLive: (publishType: number, channelTemplateId: number, forceEndExistLive: boolean, mediaType: number, title: string, token: string, extend: string, appdata: string) => void;
      stopLive: (appdata: string) => void;
      sig_onZTSdkEvent: Signal1<any>;
  }
  export interface ILianMai extends ObjectAlias {
      sig_onZTSdkEvent: Signal1<any>;
  }
  export interface IRoom extends ObjectAlias {
      sig_onZTSdkEvent: Signal1<any>;
  }
  export interface INetworkSpeedTest extends ObjectAlias {
      init: () => void;
      uninit: () => void;
      start: (nBitrate: number, strTicket: string) => void;
      stop: () => void;
      sig_onZTSdkEvent: Signal1<any>;
  }
  export interface ISvcTransfer extends ObjectAlias {
      init: () => void;
      parseProtocolData: (nServiceId: number, data: string, size: number) => Promise<number>;
      setPublishServiceId: (nServiceId: number) => void;
      setPublishServiceUseMobSvr: (bUsed: boolean) => void;
      sig_onZTSdkEvent: Signal1<any>;
  }
  export interface IVideo extends ObjectAlias {
      sig_onZTSdkEvent: Signal1<any>;
  }
  export interface IAudio extends ObjectAlias {
      setAudioConfig: (profile: number, commutMode: number, scenarioMode: number) => void;
      enumInputDevices: (devices: Record<string, any>) => Promise<Record<string, any>>;
      setInputtingDevice: (id: Record<string, any>) => Promise<Record<string, any>>;
      getInputtingDevice: (id: Record<string, any>) => Promise<Record<string, any>>;
      setInputtingVolume: (volume: number) => Promise<Record<string, any>>;
      getInputtingVolume: (volume: number) => Promise<Record<string, any>>;
      startInputDeviceTest: (indicationInterval: number) => Promise<Record<string, any>>;
      stopInputDeviceTest: () => Promise<Record<string, any>>;
      enumOutputDevices: (devices: Record<string, any>) => Promise<Record<string, any>>;
      setOutputtingDevice: (id: Record<string, any>) => Promise<Record<string, any>>;
      getOutputtingDevice: (id: Record<string, any>) => Promise<Record<string, any>>;
      setOuttingVolume: (volume: number) => Promise<Record<string, any>>;
      getOuttingVolume: (volume: number) => Promise<Record<string, any>>;
      startOutputDeviceTest: (indicationInterval: number, audioFileName: string) => Promise<Record<string, any>>;
      stopOutputDeviceTest: () => Promise<Record<string, any>>;
      enableMicEnhancement: (enabled: boolean) => Promise<Record<string, any>>;
      enableMicDenoise: (enabled: boolean) => Promise<Record<string, any>>;
      enableAEC: (enabled: boolean) => Promise<Record<string, any>>;
      enableAGC: (enabled: boolean) => Promise<Record<string, any>>;
      setInputSoftwareVolume: (volume: number) => Promise<Record<string, any>>;
      getInputSoftwareVolume: (volume: number) => Promise<Record<string, any>>;
      adjustPlaybackSignalVolume: (volume: number) => Promise<Record<string, any>>;
      getPlaybackSignalVolume: (volume: number) => Promise<Record<string, any>>;
      enableMicrophone: (anbale: boolean) => Promise<Record<string, any>>;
      getIsEnableMicrophone: (anbale: boolean) => Promise<Record<string, any>>;
      enableSpeaker: (anbale: boolean) => Promise<Record<string, any>>;
      getIsEnableSpeaker: (anbale: boolean) => Promise<Record<string, any>>;
      enableCaptureVolumeIndication: (interval: number, moreThanThd: number, lessThanThd: number, smooth: number) => Promise<Record<string, any>>;
      enableLoopbackRecording: (enbale: boolean) => Promise<any>;
      sig_onZTSdkEvent: Signal1<any>;
  }
  export enum FEATURE_SUPPORT {
      MAGAPI = 0,
      QSV_ENC_H264 = 1,
      QSV_ENC_H265 = 2,
      NV_ENC_H264 = 3,
      NV_ENC_H265 = 4,
      QSV_DEC_H264 = 5,
      QSV_DEC_H265 = 6,
      NV_DEC_H264 = 7,
      NV_DEC_H265 = 8,
      NO_SCALE_CAP = 9
  }
  export enum EncCodecID {
      ENC_CODEC_NONE = -1,
      ENC_CODEC_VP8 = 0,
      ENC_CODEC_VP9 = 1,
      ENC_CODEC_H264 = 2,
      ENC_CODEC_H265 = 3,
      ENC_CODEC_H264_INTEL_QUICKSYNC = 4,
      ENC_CODEC_H265_INTEL_QUICKSYNC = 5,
      ENC_CODEC_H264_NVIDIA_NVENC = 6,
      ENC_CODEC_H265_NVIDIA_NVENC = 7
  }
  export interface IMediaStream extends ObjectAlias {
      updateToken: (type: number, token: string) => void;
      queryStreamInfoWithAvp: (keys: string[]) => void;
      startPublish: (type: number) => void;
      stopPublish: (type: number) => void;
      setPublishConfig: (id: string) => void;
      setCustomPublishConfig: (playtype: number, width: number, height: number, fps: number, rate: number) => void;
      setCustomVideoSource: (bEnable: any, option: any) => void;
      setCustomAudioSource: (bEnable: any, option: any) => void;
      checkFeatureSupport: (type: FEATURE_SUPPORT) => Promise<Record<string, any>>;
      setVideoEncoderID: (type: EncCodecID) => Promise<Record<string, any>>;
      sig_onZTSdkEvent: Signal1<any>;
  }
  export interface IHappyLive extends ObjectAlias {
      joinChannel: (channelId: string, childId: string) => void;
      leaveChannel: () => void;
      init: (myUid: string, appName: string, appVer: string, deviceId: string) => void;
      uninit: () => void;
      sig_onZTSdkEvent: Signal1<any>;
      ISinglePublish: ISinglePublish;
      IServiceTransfer: ISvcTransfer;
      IRoom: IRoom;
      IVideo: IVideo;
      IAudio: IAudio;
      IMediaStream0: IMediaStream;
      ILianMai: ILianMai;
      INetworkSpeedTest: INetworkSpeedTest;
  }
  export interface IHappyLiveWrapper extends ObjectAlias {
      startPushVideo: (params: Record<string, any>) => void;
      stopPushVideo: () => void;
      startPushAudio: (params: Record<string, any>) => void;
      stopPushAudio: () => void;
  }
  export interface IChannel extends ObjectAlias {
      joinChannel: (sid: number, subSid: number, isYYChannel: boolean) => void;
      leaveChannel: () => void;
      getUserCount: () => Promise<number>;
      getSubSid: () => Promise<number>;
      getSid: () => Promise<number>;
      getMyUid: () => Promise<string>;
      sendMsgPublic: (msg: string, fontname: string, size: number, color: number, isBold: boolean, isItalic: boolean, isUnderline: boolean, isStrikeout: boolean) => void;
      sendMsgPrivate: (msg: string, uid: number, fontname: string, size: number, color: number, isBold: boolean, isItalic: boolean, isUnderline: boolean, isStrikeout: boolean) => void;
      enableVoice: (uid: number, flag: boolean) => void;
      enableText: (uid: number, flag: boolean) => void;
      kickOutUser: (sid: number, uid: number, minutes: number, reason: string, kickOff: boolean) => void;
      changeUserRole: (uid: number, role: number, sid: number) => void;
      changeChannelName: (sid: number, name: string) => void;
      changeChannelPassword: (sid: number, password: string) => void;
      changeChannelStyle: (sid: number, channelStyle: number) => void;
      changeMemberLimit: (sid: number, limitcount: number) => void;
      changeChannelTemplateId: (sid: number, templateId: string) => void;
      kickoff: (now_from: number, froms: string) => void;
      setTextStatus: (sid: number, status: number) => void;
      ignoreVoice: (uid: number, isIgnore: boolean) => void;
      ignoreText: (uid: number, isIgnore: boolean) => void;
      setVoiceList: (uid: number, subsid: number, enable: boolean) => void;
      getRealNickname: (uid: number) => Promise<string>;
      kickAllOutOf: (sid: number, subsid: number) => void;
      onChannelError: Signal3<number, number, number>;
      onChannelLeaved: Signal2<number, number>;
      onChannelJoined: Signal2<number, number>;
      onChannelJoinFailedByKickOut: Signal3<number, number, string>;
      onChannelJoinFailedByFrozen: Signal2<number, number>;
      onChannelFrozenWithTime: Signal3<number, number, number>;
      onAllChannelLoaded: Signal0;
      onOtherClientKick: Signal2<number, number>;
      onCheckKickoff: Signal2<number, string>;
      onAllUsersLoaded: Signal0;
      onUserRoleChanged: Signal5<number, number, number, number, number>;
      onKickOutChannel: Signal7<number, number, number, number, number, number, string>;
      onTextActive: Signal4<number, number, boolean, Map<string, any>>;
      onTextStatus: Signal3<number, number, number>;
      onChatPublic: Signal1<Record<string, any>>;
      onChatPrivate: Signal1<Record<string, any>>;
      onChatResult: Signal1<number>;
  }
  export interface IRtmp extends ObjectAlias {
      startService: (port: number) => Promise<boolean>;
      stopService: () => void;
      getVideoSharedMemoryName: () => Promise<string>;
      getAudioSharedMemoryName: () => Promise<string>;
      sigRtmpUrl: Signal2<string, string>;
      sigRtmpConnect: Signal3<string, string, string>;
      sigRtmpDisconnect: Signal1<string>;
      sigVideoInfo: Signal4<number, number, number, number>;
      sigAudioInfo: Signal3<number, number, number>;
  }
  export interface IGameCaptureHelper extends ObjectAlias {
      getGamesStatus: () => Promise<Record<string, any>>;
      gameWindowTitleKeyword: () => Promise<string>;
      signalGameStatusUpdate: Signal3<string, boolean, boolean>;
      sigGameRunningStatusUpdate: Signal3<string, string, boolean>;
  }
  export interface ISourceManager extends ObjectAlias {
      clear: () => void;
      setOutputInfo: (width: number, height: number, fps: number) => void;
      startPushVideo: () => Promise<string>;
      stopPushVideo: () => void;
      addSource: (id: string, type: string, infoMap: Record<string, any>) => Promise<boolean>;
      updateSource: (id: string, type: string, infoMap: Record<string, any>) => void;
      removeSource: (id: string) => void;
      setSourceNormalRect: (id: string, x: number, y: number, width: number, height: number) => void;
      setSourceVisible: (id: string, visible: boolean) => void;
      setCameraPreview: (id: string, visible: boolean) => void;
      moveSourceUp: (id: string) => void;
      moveSourceDown: (id: string) => void;
      moveSourceToTop: (id: string) => void;
      moveSourceToBottom: (id: string) => void;
      getMonitors: (thumbWidth: number, thumbHeight: number) => Promise<Record<string, any>>;
      getWindows: () => Promise<Record<string, any>>;
      getCamerDevices: () => Promise<Array<Record<string, any>>>;
      getFontFamilyies: () => Promise<Array<string>>;
      showAreaSelector: () => void;
      sigOutputChanged: Signal8<string, number, number, number, number, boolean, number, number>;
      sigFrameUpdated: Signal0;
      sigAreaSelected: Signal5<boolean, number, number, number, number>;
      sigSourceDeleted: Signal1<string>;
      sigSourceRectChanged: Signal7<string, number, number, number, number, number, number>;
  }
  export interface IReporter extends ObjectAlias {
      setProdInfo: (appKey: string, prodID: string, version: string, from: string, uid: string) => Promise<boolean>;
      deviceId: () => Promise<string>;
      setReportDomain: (domain: string) => void;
      report: (eventId: number, params: number) => void;
      setReportUser: (uid: string) => void;
  }
  export interface IYY extends ObjectAlias {
      Main: IMain;
      Svc: ISvc2;
      Auth: IAuth;
      BdAuth: IBdAuth;
      IHappyLive: IHappyLive;
      HappyLiveWrapper: IHappyLiveWrapper;
      Com: ICom;
      Channel: IChannel;
      Rtmp: IRtmp;
      GameCaptureHelper: IGameCaptureHelper;
      SourceManager: ISourceManager;
      Report: IReporter;
  }
  global {
      interface Window {
          Win: IWin;
          YY: IYY;
          connectSignal: ConnectSignal;
      }
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/AppImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { App } from 'bdgamelivebaseapi/api/interfaces';
  export default class AppImpl extends WRoot implements App {
      showApp(): void;
      exitApp(): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/AudioImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { Audio } from 'bdgamelivebaseapi/api/interfaces';
  export default class AudioImpl extends WRoot implements Audio {
      setAudioConfig(profile: number, commutMode: number, scenarioMode: number): void;
      enumInputDevices(devices: Record<string, any>): Promise<any>;
      setInputtingDevice(id: Record<string, any>): Promise<any>;
      getInputtingDevice(id: Record<string, any>): Promise<any>;
      setInputtingVolume(volume: number): Promise<any>;
      getInputtingVolume(volume: number): Promise<any>;
      startInputDeviceTest(indicationInterval: number): Promise<any>;
      stopInputDeviceTest(): Promise<any>;
      enumOutputDevices(devices: Record<string, any>): Promise<any>;
      setOutputtingDevice(id: Record<string, any>): Promise<any>;
      getOutputtingDevice(id: Record<string, any>): Promise<any>;
      setOuttingVolume(volume: number): Promise<any>;
      getOuttingVolume(volume: number): Promise<any>;
      startOutputDeviceTest(indicationInterval: number, audioFileName: string): Promise<any>;
      stopOutputDeviceTest(): Promise<any>;
      enableMicEnhancement(enabled: boolean): Promise<any>;
      enableMicDenoise(enabled: boolean): Promise<any>;
      enableAEC(enabled: boolean): Promise<any>;
      enableAGC(enabled: boolean): Promise<any>;
      setInputSoftwareVolume(volume: number): Promise<any>;
      getInputSoftwareVolume(volume: number): Promise<any>;
      adjustPlaybackSignalVolume(volume: number): Promise<any>;
      getPlaybackSignalVolume(volume: number): Promise<any>;
      enableMicrophone(anbale: boolean): Promise<any>;
      getIsEnableMicrophone(anbale: boolean): Promise<any>;
      enableSpeaker(anbale: boolean): Promise<any>;
      getIsEnableSpeaker(anbale: boolean): Promise<any>;
      enableCaptureVolumeIndication(interval: number, moreThanThd: number, lessThanThd: number, smooth: number): Promise<any>;
      enableLoopbackRecording(enbale: boolean): Promise<any>;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/AuthImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { Auth } from 'bdgamelivebaseapi/api/interfaces';
  export default class AuthImpl extends WRoot implements Auth {
      setAccountInfo(strAccount: string, sha1: string, imStatus: number, isRemeberPassword: boolean, isAutoLogin: boolean, isNewInput: boolean): void;
      saveAccountInfo(): void;
      loginByAccount(strAccount: string, strPassword: string): void;
      loginByCredit(uid: string, credit: string): void;
      loginByThirdParty(source: string, third_sub_sys: string, credit: string): void;
      needBindPhone(val: boolean): void;
      login(): void;
      logout(): Promise<any>;
      switchAccount(): Promise<any>;
      lastAccount(): Promise<any>;
      accountList(): Promise<any>;
      getDeviceInfo(): Promise<any>;
      removeAccount(account: string): void;
      openUrl(url: string): void;
      setLogoUrl(url: string): void;
      getUDBTickect(): void;
      getToken(appid: string, encode: number): Promise<any>;
      getUDBTicketWithContext(context: string): void;
      getImStatus(): Promise<number>;
      setImStatus(imStatus: number): void;
      isLogined(): Promise<any>;
      myUid(): Promise<any>;
      refreshSmsCode(): void;
      refreshVerificationCode(): void;
      verifyCode(type: number, code: string): void;
      verifyDynamicToken(strategy: number, answer: string): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/BdAuthImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { BdAuth, FAST_LOGIN_TYPE } from 'bdgamelivebaseapi/api/interfaces';
  export default class BdAuthImpl extends WRoot implements BdAuth {
      autoLogin(): void;
      loginBySaveAccount(strAccount: string): void;
      loginByAccount(strAccount: string, strPassword: string): void;
      loginByThirdParty(source: string, third_sub_sys: string, credit: string): void;
      loginByMobile(strMobile: string, strCode: string): void;
      loginFast(type: FAST_LOGIN_TYPE): void;
      createQrCode(width: number, height: number): void;
      showQrCode(show: boolean): void;
      checkQrCode(): void;
      clearQrCode(): void;
      refreshSmsCode(strMobile: string): void;
      logout(): Promise<boolean>;
      getCurrentToken(): Promise<string>;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/ChannelImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { Channel } from 'bdgamelivebaseapi/api/interfaces';
  export default class ChannelImpl extends WRoot implements Channel {
      joinChannel(sid: number, subSid: number, isYYChannel: boolean): void;
      leaveChannel(): void;
      getUserCount(): Promise<any>;
      getSubSid(): Promise<any>;
      getSid(): Promise<any>;
      getMyUid(): Promise<any>;
      sendMsgPublic(msg: string, fontname: string, size: number, color: number, isBold: boolean, isItalic: boolean, isUnderline: boolean, isStrikeout: boolean): void;
      sendMsgPrivate(msg: string, uid: number, fontname: string, size: number, color: number, isBold: boolean, isItalic: boolean, isUnderline: boolean, isStrikeout: boolean): void;
      enableVoice(uid: number, flag: boolean): void;
      enableText(uid: number, flag: boolean): void;
      kickOutUser(sid: number, uid: number, minutes: number, reason: string, kickOff: boolean): void;
      changeUserRole(uid: number, role: number, sid: number): void;
      changeChannelName(sid: number, name: string): void;
      changeChannelPassword(sid: number, password: string): void;
      changeChannelStyle(sid: number, channelStyle: number): void;
      changeMemberLimit(sid: number, limitcount: number): void;
      changeChannelTemplateId(sid: number, templateId: string): void;
      kickoff(now_from: number, froms: string): void;
      setTextStatus(sid: number, status: number): void;
      ignoreVoice(uid: number, isIgnore: boolean): void;
      ignoreText(uid: number, isIgnore: boolean): void;
      setVoiceList(uid: number, subsid: number, enable: boolean): void;
      getRealNickname(uid: number): Promise<any>;
      kickAllOutOf(sid: number, subsid: number): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/ComImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { Com } from 'bdgamelivebaseapi/api/interfaces';
  export default class ComImpl extends WRoot implements Com {
      print(type: string, log: string): void;
      setConfig(key: string, value: any, uid: string): void;
      getConfig(key: string, uid: string): Promise<any>;
      getConfigWithDefault(key: string, defaultValue: any, uid: string): Promise<any>;
      removeVar(key: string, uid: string): void;
      writeCacheFile(key: string, value: string, uid: string): void;
      readCacheFile(key: string, uid: string): Promise<any>;
      deleteCacheFile(key: string, uid: string): void;
      setGlobal(key: string, value: any): void;
      getGlobal(key: string): Promise<any>;
      getGlobalWithDefault(key: string, defaultValue: any): Promise<any>;
      removeGlobal(key: string): Promise<any>;
      openUrl(key: string): void;
      getAppVersion(): Promise<any>;
      subscribeCpuUsage(timeInterval: number): void;
      unSubscribeCpuUsage(): void;
      getFontFamily(): Promise<any>;
      getTextSize(family: string, fontSize: number, content: string): Promise<any>;
      submitFeedback(problem: string, contact: string, uid: string): Promise<any>;
      selectFileDialog(title: string, dir: string, filter: string, bSingle: boolean): Promise<any>;
      previewImage(path: string): void;
      openFolder(path: string): void;
      isFileExist(path: string): Promise<any>;
      test(): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/GameImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { Game } from 'bdgamelivebaseapi/api/interfaces';
  export default class GameImpl extends WRoot implements Game {
      getGamesStatus(): Promise<any>;
      gameWindowTitleKeyword(): Promise<any>;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/IpcImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { Ipc } from 'bdgamelivebaseapi/api/interfaces';
  export default class IpcImpl extends WRoot implements Ipc {
      sendMessageToWindow(windowId: number, message: string): void;
      broadcastMessageToWindows(message: string): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/LinkImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { Link } from 'bdgamelivebaseapi/api/interfaces';
  export default class LinkImpl extends WRoot implements Link {
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/LiveImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { Live } from 'bdgamelivebaseapi/api/interfaces';
  export default class LiveImpl extends WRoot implements Live {
      joinChannel(channelId: string, childId: string): void;
      leaveChannel(): void;
      initLive(myUid: string, appName: string, appVer: string, deviceId: string): void;
      uninitLive(): void;
      startPushVideo(params: Record<string, any>): void;
      stopPushVideo(): void;
      startPushAudio(params: Record<string, any>): void;
      stopPushAudio(): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/LiveSvcImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { LiveSvc } from 'bdgamelivebaseapi/api/interfaces';
  export default class LiveSvcImpl extends WRoot implements LiveSvc {
      initSvc(): void;
      parseProtocolData(nServiceId: number, data: string, size: number): Promise<any>;
      setPublishServiceId(nServiceId: number): void;
      setPublishServiceUseMobSvr(bUsed: boolean): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/LiveWrapImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { LiveWrap } from 'bdgamelivebaseapi/api/interfaces';
  export default class LiveImpl extends WRoot implements LiveWrap {
      startPushVideo(params: Record<string, any>): void;
      stopPushVideo(): void;
      startPushAudio(params: Record<string, any>): void;
      stopPushAudio(): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/LogImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { Log } from 'bdgamelivebaseapi/api/interfaces';
  export default class LogImpl extends WRoot implements Log {
      private _page;
      private _env;
      constructor();
      set page(val: string);
      get page(): string;
      set env(val: string);
      debug(tag: string, content: string): void;
      info(tag: string, content: string): void;
      error(tag: string, content: string): void;
      log(tag: string, content: string): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/NetworkImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { Network } from 'bdgamelivebaseapi/api/interfaces';
  export default class NetworkImpl extends WRoot implements Network {
      initWork(): void;
      uninitWork(): void;
      startWork(nBitrate: number, strTicket: string): void;
      stopWork(): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/PublishImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { Publish } from 'bdgamelivebaseapi/api/interfaces';
  export default class PublishImpl extends WRoot implements Publish {
      checkLivePermission(appdata: string): void;
      setAnchorLiveDesc(title: string, appdata: string): void;
      getAnchorLiveDesc(queryHistory: number, appdata: string): void;
      setLivingBzExtend(extend: string, appdata: string): void;
      updateRtCover(delaySeconds: string, appdata: string): void;
      startLive(publishType: number, channelTemplateId: number, forceEndExistLive: boolean, mediaType: number, title: string, token: string, extend: string, appdata: string): void;
      stopLive(appdata: string): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/ReporterImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { Reporter } from 'bdgamelivebaseapi/api/interfaces';
  export default class ReporterImpl extends WRoot implements Reporter {
      setProdInfo(appKey: string, prodID: string, version: string, from: string, uid: string): Promise<any>;
      deviceId(): Promise<any>;
      setReportDomain(domain: string): void;
      report(eventId: number, params: number): void;
      setReportUser(uid: string): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/RoomImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { Room } from 'bdgamelivebaseapi/api/interfaces';
  export default class RoomImpl extends WRoot implements Room {
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/RtmpImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { Rtmp } from 'bdgamelivebaseapi/api/interfaces';
  export default class RtmpImpl extends WRoot implements Rtmp {
      startService(port: number): Promise<any>;
      stopService(): void;
      getVideoSharedMemoryName(): Promise<any>;
      getAudioSharedMemoryName(): Promise<any>;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/SourceImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { Source } from 'bdgamelivebaseapi/api/interfaces';
  export default class SourceImpl extends WRoot implements Source {
      clear(): void;
      setOutputInfo(width: number, height: number, fps: number): void;
      startPushVideo(): Promise<any>;
      stopPushVideo(): void;
      addSource(id: string, type: string, infoMap: Record<string, any>): Promise<any>;
      updateSource(id: string, type: string, infoMap: Record<string, any>): void;
      removeSource(id: string): void;
      setSourceNormalRect(id: string, x: number, y: number, width: number, height: number): void;
      setSourceVisible(id: string, visible: boolean): void;
      setCameraPreview(id: string, visible: boolean): void;
      moveSourceUp(id: string): void;
      moveSourceDown(id: string): void;
      moveSourceToTop(id: string): void;
      moveSourceToBottom(id: string): void;
      getMonitors(thumbWidth: number, thumbHeight: number): Promise<any>;
      getWindows(): Promise<any>;
      getCamerDevices(): Promise<any>;
      getFontFamilyies(): Promise<any>;
      showAreaSelector(): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/StreamImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { Stream, FEATURE_SUPPORT, EncCodecID } from 'bdgamelivebaseapi/api/interfaces';
  export default class StreamImpl extends WRoot implements Stream {
      updateToken(type: number, token: string): void;
      queryStreamInfoWithAvp(keys: string[]): void;
      startPublish(type: number): void;
      stopPublish(type: number): void;
      setPublishConfig(id: string): void;
      setCustomPublishConfig(playtype: number, width: number, height: number, fps: number, rate: number): void;
      setCustomVideoSource(bEnable: any, option: any): void;
      setCustomAudioSource(bEnable: any, option: any): void;
      checkFeatureSupport(type: FEATURE_SUPPORT): Promise<any>;
      setVideoEncoderID(type: EncCodecID): Promise<any>;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/SvcImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { Svc } from 'bdgamelivebaseapi/api/interfaces';
  export default class SvcImpl extends WRoot implements Svc {
      createService(svcId: number): Promise<any>;
      closeService(svcId: number): Promise<any>;
      send(svcId: number, data: string): Promise<any>;
      joinGroup(svcId: number, top32: number, low64: number): Promise<any>;
      leaveGroup(svcId: number, top32: number, low64: number): Promise<any>;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/TrayImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { Tray } from 'bdgamelivebaseapi/api/interfaces';
  export default class TrayImpl extends WRoot implements Tray {
      show(): void;
      hide(): void;
      setIcon(pathFile: string): void;
      setToolTip(tip: string): void;
      getPopupPos(): Promise<any>;
      beginFlashIcon(): void;
      stopFlashIcon(): void;
      isFlashingIcon(): Promise<any>;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/VideoImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { Video } from 'bdgamelivebaseapi/api/interfaces';
  export default class VideoImpl extends WRoot implements Video {
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/WRoot' {
  import { Base } from 'bdgamelivebaseapi/api/impl/base';
  import { Log } from 'bdgamelivebaseapi/api/interfaces';
  export default class WRoot extends Base {
      private _debug?;
      constructor(log?: Log);
      protected debug(tag: string, content: string): void;
      protected info(tag: string, content: string): void;
      protected error(tag: string, content: string): void;
      protected unImplementP(): Promise<any>;
      protected unImplement(): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/WinImpl' {
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  import { Win, Area } from 'bdgamelivebaseapi/api/interfaces';
  export default class WinImpl extends WRoot implements Win {
      move(x: number, y: number): void;
      resize(w: number, h: number): void;
      setRect(x: number, y: number, w: number, h: number): void;
      setMinSize(w: number, h: number): void;
      maximize(): void;
      minimize(): void;
      restore(): void;
      moveCenter(): void;
      maximizeOrRestore(): void;
      show(): void;
      hide(): void;
      close(): void;
      activate(): void;
      closeOther(windowId: number): void;
      isVisible(): Promise<any>;
      winId(): Promise<any>;
      setNCBorderWidth(nBorder: number): void;
      setCaptionArea(captionRect: Area[]): void;
      addStyle(style: number): void;
      removeStyle(style: number): void;
      getWindowInfo(): Promise<any>;
      openBrowserWindow(param: Record<string, any>, ifNotExistThenCreateOsrBrowser: boolean): Promise<any>;
      openBrowserWindowInCurProcess(param: Record<string, any>): Promise<any>;
      ignoreSysClose(ignore: boolean): void;
      showColorPicker(): void;
      addChildWnd(hwnd: number, x: number, y: number): void;
      removeChildWnd(hwnd: number): void;
      setResizable(enable: boolean): void;
      setTopMost(enable: boolean): void;
      setFrameless(enable: boolean): void;
      setShowInTaskBar(enable: boolean): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web/YYImpl' {
  import { YY } from 'bdgamelivebaseapi/api/interfaces';
  import AudioImpl from 'bdgamelivebaseapi/api/impl/web/AudioImpl';
  import AuthImpl from 'bdgamelivebaseapi/api/impl/web/AuthImpl';
  import BdAuthImpl from 'bdgamelivebaseapi/api/impl/web/BdAuthImpl';
  import ChannelImpl from 'bdgamelivebaseapi/api/impl/web/ChannelImpl';
  import GameImpl from 'bdgamelivebaseapi/api/impl/web/GameImpl';
  import LiveImpl from 'bdgamelivebaseapi/api/impl/web/LiveImpl';
  import LiveWrapImpl from 'bdgamelivebaseapi/api/impl/web/LiveWrapImpl';
  import AppImpl from 'bdgamelivebaseapi/api/impl/web/AppImpl';
  import NetworkImpl from 'bdgamelivebaseapi/api/impl/web/NetworkImpl';
  import PublishImpl from 'bdgamelivebaseapi/api/impl/web/PublishImpl';
  import ReporterImpl from 'bdgamelivebaseapi/api/impl/web/ReporterImpl';
  import RoomImpl from 'bdgamelivebaseapi/api/impl/web/RoomImpl';
  import RtmpImpl from 'bdgamelivebaseapi/api/impl/web/RtmpImpl';
  import SourceImpl from 'bdgamelivebaseapi/api/impl/web/SourceImpl';
  import SvcImpl from 'bdgamelivebaseapi/api/impl/web/SvcImpl';
  import TrayImpl from 'bdgamelivebaseapi/api/impl/web/TrayImpl';
  import VideoImpl from 'bdgamelivebaseapi/api/impl/web/VideoImpl';
  import WinImpl from 'bdgamelivebaseapi/api/impl/web/WinImpl';
  import ComImpl from 'bdgamelivebaseapi/api/impl/web/ComImpl';
  import LogImpl from 'bdgamelivebaseapi/api/impl/web/LogImpl';
  import LinkImpl from 'bdgamelivebaseapi/api/impl/web/LinkImpl';
  import IpcImpl from 'bdgamelivebaseapi/api/impl/web/IpcImpl';
  import StreamImpl from 'bdgamelivebaseapi/api/impl/web/StreamImpl';
  import LiveSvcImpl from 'bdgamelivebaseapi/api/impl/web/LiveSvcImpl';
  import WRoot from 'bdgamelivebaseapi/api/impl/web/WRoot';
  export default class YYImpl extends WRoot implements YY {
      private _audio;
      private _auth;
      private _bdauth;
      private _channel;
      private _com;
      private _game;
      private _link;
      private _live;
      private _liveWrap;
      private _app;
      private _network;
      private _publish;
      private _reporter;
      private _room;
      private _rtmp;
      private _source;
      private _svc;
      private _tray;
      private _video;
      private _win;
      private _log;
      private _ipc;
      private _stream;
      private _liveSvc;
      constructor();
      get audio(): AudioImpl;
      get auth(): AuthImpl;
      get bdauth(): BdAuthImpl;
      get channel(): ChannelImpl;
      get com(): ComImpl;
      get game(): GameImpl;
      get link(): LinkImpl;
      get live(): LiveImpl;
      get liveWrap(): LiveWrapImpl;
      get app(): AppImpl;
      get network(): NetworkImpl;
      get publish(): PublishImpl;
      get reporter(): ReporterImpl;
      get room(): RoomImpl;
      get rtmp(): RtmpImpl;
      get source(): SourceImpl;
      get svc(): SvcImpl;
      get tray(): TrayImpl;
      get video(): VideoImpl;
      get win(): WinImpl;
      get log(): LogImpl;
      get ipc(): IpcImpl;
      get stream(): StreamImpl;
      get liveSvc(): LiveSvcImpl;
      init(): void;
      start(): void;
      stop(): void;
      destroy(): void;
  }

}
declare module 'bdgamelivebaseapi/api/impl/web' {
  export { default as WebYY } from 'bdgamelivebaseapi/api/impl/web/YYImpl';

}
declare module 'bdgamelivebaseapi/api' {
  export * from 'bdgamelivebaseapi/api/interfaces';
  export { default as YY } from 'bdgamelivebaseapi/api/impl';

}
declare module 'bdgamelivebaseapi/api/interfaces/App' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class App extends Emitter {
      abstract showApp: () => void;
      abstract exitApp: () => void;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Audio' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class Audio extends Emitter {
      abstract setAudioConfig: (profile: number, commutMode: number, scenarioMode: number) => void;
      abstract enumInputDevices: (devices: Record<string, any>) => Promise<Record<string, any>>;
      abstract setInputtingDevice: (id: Record<string, any>) => Promise<Record<string, any>>;
      abstract getInputtingDevice: (id: Record<string, any>) => Promise<Record<string, any>>;
      abstract setInputtingVolume: (volume: number) => Promise<Record<string, any>>;
      abstract getInputtingVolume: (volume: number) => Promise<Record<string, any>>;
      abstract startInputDeviceTest: (indicationInterval: number) => Promise<Record<string, any>>;
      abstract stopInputDeviceTest: () => Promise<Record<string, any>>;
      abstract enumOutputDevices: (devices: Record<string, any>) => Promise<Record<string, any>>;
      abstract setOutputtingDevice: (id: Record<string, any>) => Promise<Record<string, any>>;
      abstract getOutputtingDevice: (id: Record<string, any>) => Promise<Record<string, any>>;
      abstract setOuttingVolume: (volume: number) => Promise<Record<string, any>>;
      abstract getOuttingVolume: (volume: number) => Promise<Record<string, any>>;
      abstract startOutputDeviceTest: (indicationInterval: number, audioFileName: string) => Promise<Record<string, any>>;
      abstract stopOutputDeviceTest: () => Promise<Record<string, any>>;
      abstract enableMicEnhancement: (enabled: boolean) => Promise<Record<string, any>>;
      abstract enableMicDenoise: (enabled: boolean) => Promise<Record<string, any>>;
      abstract enableAEC: (enabled: boolean) => Promise<Record<string, any>>;
      abstract enableAGC: (enabled: boolean) => Promise<Record<string, any>>;
      abstract setInputSoftwareVolume: (volume: number) => Promise<Record<string, any>>;
      abstract getInputSoftwareVolume: (volume: number) => Promise<Record<string, any>>;
      abstract adjustPlaybackSignalVolume: (volume: number) => Promise<Record<string, any>>;
      abstract getPlaybackSignalVolume: (volume: number) => Promise<Record<string, any>>;
      abstract enableMicrophone: (anbale: boolean) => Promise<Record<string, any>>;
      abstract getIsEnableMicrophone: (anbale: boolean) => Promise<Record<string, any>>;
      abstract enableSpeaker: (anbale: boolean) => Promise<Record<string, any>>;
      abstract getIsEnableSpeaker: (anbale: boolean) => Promise<Record<string, any>>;
      abstract enableCaptureVolumeIndication: (interval: number, moreThanThd: number, lessThanThd: number, smooth: number) => Promise<Record<string, any>>;
      abstract enableLoopbackRecording: (enbale: boolean) => Promise<any>;
      static get sig_onZTSdkEvent(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Auth' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class Auth extends Emitter {
      abstract setAccountInfo: (strAccount: string, sha1: string, imStatus: number, isRemeberPassword: boolean, isAutoLogin: boolean, isNewInput: boolean) => void;
      abstract saveAccountInfo: () => void;
      abstract loginByAccount: (strAccount: string, strPassword: string) => void;
      abstract loginByCredit: (uid: string, credit: string) => void;
      abstract loginByThirdParty: (source: string, third_sub_sys: string, credit: string) => void;
      abstract needBindPhone: (val: boolean) => void;
      abstract login: () => void;
      abstract logout: () => Promise<boolean>;
      abstract switchAccount(): Promise<boolean>;
      abstract lastAccount: () => Promise<string>;
      abstract accountList: () => Promise<string>;
      abstract getDeviceInfo: () => Promise<string>;
      abstract removeAccount: (account: string) => void;
      abstract openUrl: (url: string) => void;
      abstract setLogoUrl: (url: string) => void;
      abstract getUDBTickect: () => void;
      abstract getToken: (appid: string, encode: number) => Promise<string>;
      abstract getUDBTicketWithContext: (context: string) => void;
      abstract getImStatus: () => Promise<number>;
      abstract setImStatus: (imStatus: number) => void;
      abstract isLogined: () => Promise<boolean>;
      abstract myUid: () => Promise<string>;
      abstract refreshSmsCode: () => void;
      abstract refreshVerificationCode: () => void;
      abstract verifyCode: (type: number, code: string) => void;
      abstract verifyDynamicToken: (strategy: number, answer: string) => void;
      static get loginSuccess(): string;
      static get loginError(): string;
      static get reconnectError(): string;
      static get toBeKicked(): string;
      static get currentAccountHasLogined(): string;
      static get verificationCodeRefresh(): string;
      static get SmsCodeRefresh(): string;
      static get needVerificationCode(): string;
      static get verifyCodeError(): string;
      static get needDynamicToken(): string;
      static get verifyDynamicTokenError(): string;
      static get UDBLoginEvent(): string;
      static get UDBSendSMSEvent(): string;
      static get UDBRefreshPicEvent(): string;
      static get UDBUpdateCreditEvent(): string;
      static get udbTicketArrived(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/BdAuth' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export enum FAST_LOGIN_TYPE {
      WEIBO = 0,
      WEIXIN = 1,
      QQ = 2
  }
  export abstract class BdAuth extends Emitter {
      abstract autoLogin: () => void;
      abstract loginBySaveAccount: (strAccount: string) => void;
      abstract loginByAccount: (strAccount: string, strPassword: string) => void;
      abstract loginByThirdParty: (source: string, third_sub_sys: string, credit: string) => void;
      abstract loginByMobile: (strMobile: string, strCode: string) => void;
      abstract loginFast: (type: FAST_LOGIN_TYPE) => void;
      abstract createQrCode: (width: number, height: number) => void;
      abstract showQrCode: (show: boolean) => void;
      abstract checkQrCode: () => void;
      abstract clearQrCode: () => void;
      abstract refreshSmsCode: (strMobile: string) => void;
      abstract logout: () => Promise<boolean>;
      abstract getCurrentToken: () => Promise<string>;
      static get loginSuccess(): string;
      static get loginError(): string;
      static get qrcodeRefresh(): string;
      static get verifyCodeRefresh(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Channel' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class Channel extends Emitter {
      abstract joinChannel: (sid: number, subSid: number, isYYChannel: boolean) => void;
      abstract leaveChannel: () => void;
      abstract getUserCount: () => Promise<number>;
      abstract getSubSid: () => Promise<number>;
      abstract getSid: () => Promise<number>;
      abstract getMyUid: () => Promise<string>;
      abstract sendMsgPublic: (msg: string, fontname: string, size: number, color: number, isBold: boolean, isItalic: boolean, isUnderline: boolean, isStrikeout: boolean) => void;
      abstract sendMsgPrivate: (msg: string, uid: number, fontname: string, size: number, color: number, isBold: boolean, isItalic: boolean, isUnderline: boolean, isStrikeout: boolean) => void;
      abstract enableVoice: (uid: number, flag: boolean) => void;
      abstract enableText: (uid: number, flag: boolean) => void;
      abstract kickOutUser: (sid: number, uid: number, minutes: number, reason: string, kickOff: boolean) => void;
      abstract changeUserRole: (uid: number, role: number, sid: number) => void;
      abstract changeChannelName: (sid: number, name: string) => void;
      abstract changeChannelPassword: (sid: number, password: string) => void;
      abstract changeChannelStyle: (sid: number, channelStyle: number) => void;
      abstract changeMemberLimit: (sid: number, limitcount: number) => void;
      abstract changeChannelTemplateId: (sid: number, templateId: string) => void;
      abstract kickoff: (now_from: number, froms: string) => void;
      abstract setTextStatus: (sid: number, status: number) => void;
      abstract ignoreVoice: (uid: number, isIgnore: boolean) => void;
      abstract ignoreText: (uid: number, isIgnore: boolean) => void;
      abstract setVoiceList: (uid: number, subsid: number, enable: boolean) => void;
      abstract getRealNickname: (uid: number) => Promise<string>;
      abstract kickAllOutOf: (sid: number, subsid: number) => void;
      static get onChannelError(): string;
      static get onChannelLeaved(): string;
      static get onChannelJoined(): string;
      static get onChannelJoinFailedByKickOut(): string;
      static get onChannelJoinFailedByFrozen(): string;
      static get onChannelFrozenWithTime(): string;
      static get onAllChannelLoaded(): string;
      static get onOtherClientKick(): string;
      static get onCheckKickoff(): string;
      static get onAllUsersLoaded(): string;
      static get onUserRoleChanged(): string;
      static get onKickOutChannel(): string;
      static get onTextActive(): string;
      static get onTextStatus(): string;
      static get onChatPublic(): string;
      static get onChatPrivate(): string;
      static get onChatResult(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Com' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class Com extends Emitter {
      abstract print: (type: string, log: string) => void;
      abstract setConfig: (key: string, value: any, uid: string) => void;
      abstract getConfig: (key: string, uid: string) => Promise<any>;
      abstract getConfigWithDefault: (key: string, defaultValue: any, uid: string) => Promise<any>;
      abstract removeVar: (key: string, uid: string) => void;
      abstract writeCacheFile: (key: string, value: string, uid: string) => void;
      abstract readCacheFile: (key: string, uid: string) => Promise<string>;
      abstract deleteCacheFile: (key: string, uid: string) => void;
      abstract setGlobal: (key: string, value: any) => void;
      abstract getGlobal: (key: string) => Promise<any>;
      abstract getGlobalWithDefault: (key: string, defaultValue: any) => Promise<any>;
      abstract removeGlobal: (key: string) => Promise<any>;
      abstract openUrl: (key: string) => void;
      abstract getAppVersion: () => Promise<string>;
      abstract subscribeCpuUsage: (timeInterval: number) => void;
      abstract unSubscribeCpuUsage: () => void;
      abstract getFontFamily: () => Promise<string[]>;
      abstract getTextSize: (family: string, fontSize: number, content: string) => Promise<number[]>;
      abstract submitFeedback: (problem: string, contact: string, uid: string) => Promise<boolean>;
      abstract selectFileDialog: (title: string, dir: string, filter: string, bSingle: boolean) => Promise<string>;
      abstract previewImage: (path: string) => void;
      abstract openFolder: (path: string) => void;
      abstract isFileExist: (path: string) => Promise<boolean>;
      abstract test: () => void;
      static get onCpuUsageData(): string;
      static get onConfigUpdated(): string;
      static get onGlobalUpdated(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Emitter' {
  export default abstract class Emitter {
      abstract on: (event: string, fn: (...args: any[]) => void) => this;
      abstract off: (event: string, fn: (...args: any[]) => void) => this;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Game' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class Game extends Emitter {
      abstract getGamesStatus: () => Promise<Record<string, any>>;
      abstract gameWindowTitleKeyword: () => Promise<string>;
      static get onnalGameStatusUpdate(): string;
      static get onGameRunningStatusUpdate(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Ipc' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class Ipc extends Emitter {
      abstract sendMessageToWindow: (windowId: number, message: string) => void;
      abstract broadcastMessageToWindows: (message: string) => void;
      static get ipcMessageArrived(): string;
      static get ipcBroadcastMessageArrived(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Link' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class Link extends Emitter {
      static get sig_onZTSdkEvent(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Live' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class Live extends Emitter {
      abstract joinChannel: (channelId: string, childId: string) => void;
      abstract leaveChannel: () => void;
      abstract initLive: (myUid: string, appName: string, appVer: string, deviceId: string) => void;
      abstract uninitLive: () => void;
      static get sig_onZTSdkEvent(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/LiveSvc' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class LiveSvc extends Emitter {
      abstract initSvc: () => void;
      abstract parseProtocolData: (nServiceId: number, data: string, size: number) => Promise<number>;
      abstract setPublishServiceId: (nServiceId: number) => void;
      abstract setPublishServiceUseMobSvr: (bUsed: boolean) => void;
      static get sig_onZTSdkEvent(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/LiveWrap' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class LiveWrap extends Emitter {
      abstract startPushVideo: (params: Record<string, any>) => void;
      abstract stopPushVideo: () => void;
      abstract startPushAudio: (params: Record<string, any>) => void;
      abstract stopPushAudio: () => void;
      static get sig_onZTSdkEvent(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Log' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class Log extends Emitter {
      abstract set page(val: string);
      abstract get page(): string;
      abstract set env(val: string);
      abstract debug: (tag: string, content: string) => void;
      abstract info: (tag: string, content: string) => void;
      abstract error: (tag: string, content: string) => void;
      abstract log: (tag: string, content: string) => void;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Network' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class Network extends Emitter {
      abstract initWork: () => void;
      abstract uninitWork: () => void;
      abstract startWork: (nBitrate: number, strTicket: string) => void;
      abstract stopWork: () => void;
      static get sig_onZTSdkEvent(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Publish' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class Publish extends Emitter {
      abstract checkLivePermission: (appdata: string) => void;
      abstract setAnchorLiveDesc: (title: string, appdata: string) => void;
      abstract getAnchorLiveDesc: (queryHistory: number, appdata: string) => void;
      abstract setLivingBzExtend: (extend: string, appdata: string) => void;
      abstract updateRtCover: (delaySeconds: string, appdata: string) => void;
      abstract startLive: (publishType: number, channelTemplateId: number, forceEndExistLive: boolean, mediaType: number, title: string, token: string, extend: string, appdata: string) => void;
      abstract stopLive: (appdata: string) => void;
      static get sig_onZTSdkEvent(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Reporter' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class Reporter extends Emitter {
      abstract setProdInfo: (appKey: string, prodID: string, version: string, from: string, uid: string) => Promise<boolean>;
      abstract deviceId: () => Promise<string>;
      abstract setReportDomain: (domain: string) => void;
      abstract report: (eventId: number, params: number) => void;
      abstract setReportUser: (uid: string) => void;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Room' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class Room extends Emitter {
      static get sig_onZTSdkEvent(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Rtmp' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class Rtmp extends Emitter {
      abstract startService: (port: number) => Promise<boolean>;
      abstract stopService: () => void;
      abstract getVideoSharedMemoryName: () => Promise<string>;
      abstract getAudioSharedMemoryName: () => Promise<string>;
      static get sigRtmpUrl(): string;
      static get sigRtmpConnect(): string;
      static get sigRtmpDisconnect(): string;
      static get sigVideoInfo(): string;
      static get sigAudioInfo(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Source' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class Source extends Emitter {
      abstract clear: () => void;
      abstract setOutputInfo: (width: number, height: number, fps: number) => void;
      abstract startPushVideo: () => Promise<string>;
      abstract stopPushVideo: () => void;
      abstract addSource: (id: string, type: string, infoMap: Record<string, any>) => Promise<boolean>;
      abstract updateSource: (id: string, type: string, infoMap: Record<string, any>) => void;
      abstract removeSource: (id: string) => void;
      abstract setSourceNormalRect: (id: string, x: number, y: number, width: number, height: number) => void;
      abstract setSourceVisible: (id: string, visible: boolean) => void;
      abstract setCameraPreview: (id: string, visible: boolean) => void;
      abstract moveSourceUp: (id: string) => void;
      abstract moveSourceDown: (id: string) => void;
      abstract moveSourceToTop: (id: string) => void;
      abstract moveSourceToBottom: (id: string) => void;
      abstract getMonitors: (thumbWidth: number, thumbHeight: number) => Promise<Record<string, any>>;
      abstract getWindows: () => Promise<Record<string, any>>;
      abstract getCamerDevices: () => Promise<Array<Record<string, any>>>;
      abstract getFontFamilyies: () => Promise<Array<string>>;
      abstract showAreaSelector: () => void;
      static get sigOutputChanged(): string;
      static get sigFrameUpdated(): string;
      static get sigAreaSelected(): string;
      static get sigSourceDeleted(): string;
      static get sigSourceRectChanged(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Stream' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export enum FEATURE_SUPPORT {
      MAGAPI = 0,
      QSV_ENC_H264 = 1,
      QSV_ENC_H265 = 2,
      NV_ENC_H264 = 3,
      NV_ENC_H265 = 4,
      QSV_DEC_H264 = 5,
      QSV_DEC_H265 = 6,
      NV_DEC_H264 = 7,
      NV_DEC_H265 = 8,
      NO_SCALE_CAP = 9
  }
  export enum EncCodecID {
      ENC_CODEC_NONE = -1,
      ENC_CODEC_VP8 = 0,
      ENC_CODEC_VP9 = 1,
      ENC_CODEC_H264 = 2,
      ENC_CODEC_H265 = 3,
      ENC_CODEC_H264_INTEL_QUICKSYNC = 4,
      ENC_CODEC_H265_INTEL_QUICKSYNC = 5,
      ENC_CODEC_H264_NVIDIA_NVENC = 6,
      ENC_CODEC_H265_NVIDIA_NVENC = 7
  }
  export abstract class Stream extends Emitter {
      abstract updateToken: (type: number, token: string) => void;
      abstract queryStreamInfoWithAvp: (keys: string[]) => void;
      abstract startPublish: (type: number) => void;
      abstract stopPublish: (type: number) => void;
      abstract setPublishConfig: (id: string) => void;
      abstract setCustomPublishConfig: (playtype: number, width: number, height: number, fps: number, rate: number) => void;
      abstract setCustomVideoSource: (bEnable: any, option: any) => void;
      abstract setCustomAudioSource: (bEnable: any, option: any) => void;
      abstract checkFeatureSupport: (type: FEATURE_SUPPORT) => Promise<Record<string, any>>;
      abstract setVideoEncoderID: (type: EncCodecID) => Promise<Record<string, any>>;
      static get sig_onZTSdkEvent(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Svc' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class Svc extends Emitter {
      abstract createService: (svcId: number) => Promise<boolean>;
      abstract closeService: (svcId: number) => Promise<boolean>;
      abstract send: (svcId: number, data: string) => Promise<boolean>;
      abstract joinGroup: (svcId: number, top32: number, low64: number) => Promise<boolean>;
      abstract leaveGroup: (svcId: number, top32: number, low64: number) => Promise<boolean>;
      static get onReady(): string;
      static get onClose(): string;
      static get onStatus(): string;
      static get onRecv(): string;
      static get onSvcData(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Tray' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class Tray extends Emitter {
      abstract show: () => void;
      abstract hide: () => void;
      abstract setIcon: (pathFile: string) => void;
      abstract setToolTip: (tip: string) => void;
      abstract getPopupPos: () => Promise<Record<string, any>>;
      abstract beginFlashIcon: () => void;
      abstract stopFlashIcon: () => void;
      abstract isFlashingIcon: () => Promise<boolean>;
      static get onRightButtonClicked(): string;
      static get onLeftButtonClicked(): string;
      static get onLeftButtonDoubleClicked(): string;
      static get onHoverEnter(): string;
      static get onHoverLeave(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Video' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class Video extends Emitter {
      static get sig_onZTSdkEvent(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/Win' {
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export interface OpenBrowseParam extends Record<string, any> {
      url: string;
      width?: number;
      height?: number;
      x?: number;
      y?: number;
      center?: boolean;
      visible?: boolean;
      windowId?: number;
      transparent?: boolean;
      topMost?: boolean;
      frameless?: boolean;
      showInTaskbar?: boolean;
      openOrCreateResult?: number;
      waitEventHandle?: number;
      waitThreadId?: number;
      parentHandle: number;
  }
  export interface WindowInfo {
      windowId: number;
      windowHandle: number;
      cefId: number;
  }
  export type Area = [number, number, number, number];
  export abstract class Win extends Emitter {
      abstract move: (x: number, y: number) => void;
      abstract resize: (w: number, h: number) => void;
      abstract setRect: (x: number, y: number, w: number, h: number) => void;
      abstract setMinSize: (w: number, h: number) => void;
      abstract maximize: () => void;
      abstract minimize: () => void;
      abstract restore: () => void;
      abstract moveCenter: () => void;
      abstract maximizeOrRestore: () => void;
      abstract show: () => void;
      abstract hide: () => void;
      abstract close: () => void;
      abstract activate: () => void;
      abstract closeOther: (windowId: number) => void;
      abstract isVisible: () => Promise<boolean>;
      abstract winId: () => Promise<number>;
      abstract setNCBorderWidth: (nBorder: number) => void;
      abstract setCaptionArea: (captionRect: Area[]) => void;
      abstract addStyle: (style: number) => void;
      abstract removeStyle: (style: number) => void;
      abstract getWindowInfo: () => Promise<Record<string, any>>;
      abstract openBrowserWindow: (param: Record<string, any>, ifNotExistThenCreateOsrBrowser: boolean) => Promise<WindowInfo>;
      abstract openBrowserWindowInCurProcess: (param: Record<string, any>) => Promise<Record<string, any>>;
      abstract ignoreSysClose: (ignore: boolean) => void;
      abstract showColorPicker: () => void;
      abstract addChildWnd: (hwnd: number, x: number, y: number) => void;
      abstract removeChildWnd: (hwnd: number) => void;
      abstract setResizable: (enable: boolean) => void;
      abstract setTopMost: (enable: boolean) => void;
      abstract setFrameless: (enable: boolean) => void;
      abstract setShowInTaskBar: (enable: boolean) => void;
      static get sigWindowSizeChange(): string;
      static get sigWindowMaximined(): string;
      static get sigWindowRestored(): string;
      static get sigPickerColor(): string;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces/YY' {
  import { Audio } from 'bdgamelivebaseapi/api/interfaces/Audio';
  import { Auth } from 'bdgamelivebaseapi/api/interfaces/Auth';
  import { BdAuth } from 'bdgamelivebaseapi/api/interfaces/BdAuth';
  import { Channel } from 'bdgamelivebaseapi/api/interfaces/Channel';
  import { Com } from 'bdgamelivebaseapi/api/interfaces/Com';
  import { Game } from 'bdgamelivebaseapi/api/interfaces/Game';
  import { Link } from 'bdgamelivebaseapi/api/interfaces/Link';
  import { Live } from 'bdgamelivebaseapi/api/interfaces/Live';
  import { App } from 'bdgamelivebaseapi/api/interfaces/App';
  import { Network } from 'bdgamelivebaseapi/api/interfaces/Network';
  import { Publish } from 'bdgamelivebaseapi/api/interfaces/Publish';
  import { Reporter } from 'bdgamelivebaseapi/api/interfaces/Reporter';
  import { Room } from 'bdgamelivebaseapi/api/interfaces/Room';
  import { Rtmp } from 'bdgamelivebaseapi/api/interfaces/Rtmp';
  import { Source } from 'bdgamelivebaseapi/api/interfaces/Source';
  import { Svc } from 'bdgamelivebaseapi/api/interfaces/Svc';
  import { LiveSvc } from 'bdgamelivebaseapi/api/interfaces/LiveSvc';
  import { Tray } from 'bdgamelivebaseapi/api/interfaces/Tray';
  import { Video } from 'bdgamelivebaseapi/api/interfaces/Video';
  import { Win } from 'bdgamelivebaseapi/api/interfaces/Win';
  import { Log } from 'bdgamelivebaseapi/api/interfaces/Log';
  import { Ipc } from 'bdgamelivebaseapi/api/interfaces/Ipc';
  import { LiveWrap } from 'bdgamelivebaseapi/api/interfaces/LiveWrap';
  import { Stream } from 'bdgamelivebaseapi/api/interfaces/Stream';
  import Emitter from 'bdgamelivebaseapi/api/interfaces/Emitter';
  export abstract class YY extends Emitter {
      abstract init: () => void;
      abstract start: () => void;
      abstract stop: () => void;
      abstract destroy: () => void;
      abstract get audio(): Audio;
      abstract get auth(): Auth;
      abstract get bdauth(): BdAuth;
      abstract get channel(): Channel;
      abstract get com(): Com;
      abstract get game(): Game;
      abstract get link(): Link;
      abstract get live(): Live;
      abstract get liveWrap(): LiveWrap;
      abstract get app(): App;
      abstract get network(): Network;
      abstract get publish(): Publish;
      abstract get reporter(): Reporter;
      abstract get room(): Room;
      abstract get rtmp(): Rtmp;
      abstract get source(): Source;
      abstract get svc(): Svc;
      abstract get tray(): Tray;
      abstract get video(): Video;
      abstract get win(): Win;
      abstract get log(): Log;
      abstract get ipc(): Ipc;
      abstract get stream(): Stream;
      abstract get liveSvc(): LiveSvc;
  }

}
declare module 'bdgamelivebaseapi/api/interfaces' {
  export * from 'bdgamelivebaseapi/api/interfaces/App';
  export * from 'bdgamelivebaseapi/api/interfaces/Audio';
  export * from 'bdgamelivebaseapi/api/interfaces/Auth';
  export * from 'bdgamelivebaseapi/api/interfaces/BdAuth';
  export * from 'bdgamelivebaseapi/api/interfaces/Channel';
  export * from 'bdgamelivebaseapi/api/interfaces/Com';
  export * from 'bdgamelivebaseapi/api/interfaces/Game';
  export * from 'bdgamelivebaseapi/api/interfaces/Link';
  export * from 'bdgamelivebaseapi/api/interfaces/Live';
  export * from 'bdgamelivebaseapi/api/interfaces/LiveWrap';
  export * from 'bdgamelivebaseapi/api/interfaces/Network';
  export * from 'bdgamelivebaseapi/api/interfaces/Publish';
  export * from 'bdgamelivebaseapi/api/interfaces/Reporter';
  export * from 'bdgamelivebaseapi/api/interfaces/Room';
  export * from 'bdgamelivebaseapi/api/interfaces/Rtmp';
  export * from 'bdgamelivebaseapi/api/interfaces/Source';
  export * from 'bdgamelivebaseapi/api/interfaces/Stream';
  export * from 'bdgamelivebaseapi/api/interfaces/Svc';
  export * from 'bdgamelivebaseapi/api/interfaces/LiveSvc';
  export * from 'bdgamelivebaseapi/api/interfaces/Tray';
  export * from 'bdgamelivebaseapi/api/interfaces/Video';
  export * from 'bdgamelivebaseapi/api/interfaces/Win';
  export * from 'bdgamelivebaseapi/api/interfaces/Log';
  export * from 'bdgamelivebaseapi/api/interfaces/Ipc';
  export * from 'bdgamelivebaseapi/api/interfaces/YY';

}
declare module 'bdgamelivebaseapi/configs' {
  const _default: {
      riskHost: string;
  };
  export default _default;

}
declare module 'bdgamelivebaseapi' {
  export * from 'bdgamelivebaseapi/api';
  export * from 'bdgamelivebaseapi/configs';

}
declare module 'bdgamelivebaseapi' {
  import main = require('bdgamelivebaseapi/index.ts');
  export = main;
}