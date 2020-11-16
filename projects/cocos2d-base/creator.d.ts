
/** !#en
The main namespace of Cocos2d-JS, all engine core classes, functions, properties and constants are defined in this namespace.
!#zh
Cocos 引擎的主要命名空间，引擎代码中所有的类，函数，属性和常量都在这个命名空间中定义。 */
declare namespace cc {	
	/** The current version of Cocos2d being used.<br/>
	Please DO NOT remove this String, it is an important flag for bug tracking.<br/>
	If you post a bug to forum, please attach this flag. */
	export var ENGINE_VERSION: string;	
	/**
	!#en
	Creates the speed action which changes the speed of an action, making it take longer (speed > 1)
	or less (speed < 1) time. <br/>
	Useful to simulate 'slow motion' or 'fast forward' effect.
	!#zh 修改目标动作的速率。
	@param action action
	@param speed speed
	
	@example 
	```js
	// change the target action speed;
	var action = cc.scaleTo(0.2, 1, 0.6);
	var newAction = cc.speed(action, 0.5);
	``` 
	*/
	export function speed(action: ActionInterval, speed: number): Action;	
	/**
	!#en Create a follow action which makes its target follows another node.
	!#zh 追踪目标节点的位置。
	@param followedNode followedNode
	@param rect rect
	
	@example 
	```js
	// example
	// creates the action with a set boundary
	var followAction = cc.follow(targetNode, cc.rect(0, 0, screenWidth * 2 - 100, screenHeight));
	node.runAction(followAction);
	
	// creates the action with no boundary set
	var followAction = cc.follow(targetNode);
	node.runAction(followAction);
	``` 
	*/
	export function follow(followedNode: Node, rect: Rect): Action;	
	/**
	Points setter
	@param points points 
	*/
	export function setPoints(points: any[]): void;	
	/**
	!#en Creates an action with a Cardinal Spline array of points and tension.
	!#zh 按基数样条曲线轨迹移动到目标位置。
	@param duration duration
	@param points array of control points
	@param tension tension
	
	@example 
	```js
	//create a cc.CardinalSplineTo
	var action1 = cc.cardinalSplineTo(3, array, 0);
	``` 
	*/
	export function cardinalSplineTo(duration: number, points: any[], tension: number): ActionInterval;	
	/**
	update position of target
	@param newPos newPos 
	*/
	export function updatePosition(newPos: Vec2): void;	
	/**
	!#en Creates an action with a Cardinal Spline array of points and tension.
	!#zh 按基数样条曲线轨迹移动指定的距离。
	@param duration duration
	@param points points
	@param tension tension 
	*/
	export function cardinalSplineBy(duration: number, points: any[], tension: number): ActionInterval;	
	/**
	!#en Creates an action with a Cardinal Spline array of points and tension.
	!#zh 按 Catmull Rom 样条曲线轨迹移动到目标位置。
	@param dt dt
	@param points points
	
	@example 
	```js
	var action1 = cc.catmullRomTo(3, array);
	``` 
	*/
	export function catmullRomTo(dt: number, points: any[]): ActionInterval;	
	/**
	!#en Creates an action with a Cardinal Spline array of points and tension.
	!#zh 按 Catmull Rom 样条曲线轨迹移动指定的距离。
	@param dt dt
	@param points points
	
	@example 
	```js
	var action1 = cc.catmullRomBy(3, array);
	``` 
	*/
	export function catmullRomBy(dt: number, points: any[]): ActionInterval;	
	/**
	!#en
	Creates the action easing object with the rate parameter. <br />
	From slow to fast.
	!#zh 创建 easeIn 缓动对象，由慢到快。
	@param rate rate
	
	@example 
	```js
	action.easing(cc.easeIn(3.0));
	``` 
	*/
	export function easeIn(rate: number): any;	
	/**
	!#en
	Creates the action easing object with the rate parameter. <br />
	From fast to slow.
	!#zh 创建 easeOut 缓动对象，由快到慢。
	@param rate rate
	
	@example 
	```js
	action.easing(cc.easeOut(3.0));
	``` 
	*/
	export function easeOut(rate: number): any;	
	/**
	!#en
	Creates the action easing object with the rate parameter. <br />
	Slow to fast then to slow.
	!#zh 创建 easeInOut 缓动对象，慢到快，然后慢。
	@param rate rate
	
	@example 
	```js
	action.easing(cc.easeInOut(3.0));
	``` 
	*/
	export function easeInOut(rate: number): any;	
	/**
	!#en
	Creates the action easing object with the rate parameter. <br />
	Reference easeInExpo: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeExponentialIn 缓动对象。<br />
	EaseExponentialIn 是按指数函数缓动进入的动作。<br />
	参考 easeInExpo：http://www.zhihu.com/question/21981571/answer/19925418
	
	@example 
	```js
	action.easing(cc.easeExponentialIn());
	``` 
	*/
	export function easeExponentialIn(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Reference easeOutExpo: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeExponentialOut 缓动对象。<br />
	EaseExponentialOut 是按指数函数缓动退出的动作。<br />
	参考 easeOutExpo：http://www.zhihu.com/question/21981571/answer/19925418
	
	@example 
	```js
	action.easing(cc.easeExponentialOut());
	``` 
	*/
	export function easeExponentialOut(): any;	
	/**
	!#en
	Creates an EaseExponentialInOut action easing object. <br />
	Reference easeInOutExpo: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeExponentialInOut 缓动对象。<br />
	EaseExponentialInOut 是按指数函数缓动进入并退出的动作。<br />
	参考 easeInOutExpo：http://www.zhihu.com/question/21981571/answer/19925418
	
	@example 
	```js
	action.easing(cc.easeExponentialInOut());
	``` 
	*/
	export function easeExponentialInOut(): any;	
	/**
	!#en
	Creates an EaseSineIn action. <br />
	Reference easeInSine: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 EaseSineIn 缓动对象。<br />
	EaseSineIn 是按正弦函数缓动进入的动作。<br />
	参考 easeInSine：http://www.zhihu.com/question/21981571/answer/19925418
	
	@example 
	```js
	action.easing(cc.easeSineIn());
	``` 
	*/
	export function easeSineIn(): any;	
	/**
	!#en
	Creates an EaseSineOut action easing object. <br />
	Reference easeOutSine: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 EaseSineOut 缓动对象。<br />
	EaseSineIn 是按正弦函数缓动退出的动作。<br />
	参考 easeOutSine：http://www.zhihu.com/question/21981571/answer/19925418
	
	@example 
	```js
	action.easing(cc.easeSineOut());
	``` 
	*/
	export function easeSineOut(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Reference easeInOutSine: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeSineInOut 缓动对象。<br />
	EaseSineIn 是按正弦函数缓动进入并退出的动作。<br />
	参考 easeInOutSine：http://www.zhihu.com/question/21981571/answer/19925418
	
	@example 
	```js
	action.easing(cc.easeSineInOut());
	``` 
	*/
	export function easeSineInOut(): any;	
	/**
	!#en
	Creates the action easing object with the period in radians (default is 0.3). <br />
	Reference easeInElastic: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeElasticIn 缓动对象。<br />
	EaseElasticIn 是按弹性曲线缓动进入的动作。<br />
	参数 easeInElastic：http://www.zhihu.com/question/21981571/answer/19925418
	@param period period
	
	@example 
	```js
	// example
	action.easing(cc.easeElasticIn(3.0));
	``` 
	*/
	export function easeElasticIn(period: number): any;	
	/**
	!#en
	Creates the action easing object with the period in radians (default is 0.3). <br />
	Reference easeOutElastic: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeElasticOut 缓动对象。<br />
	EaseElasticOut 是按弹性曲线缓动退出的动作。<br />
	参考 easeOutElastic：http://www.zhihu.com/question/21981571/answer/19925418
	@param period period
	
	@example 
	```js
	// example
	action.easing(cc.easeElasticOut(3.0));
	``` 
	*/
	export function easeElasticOut(period: number): any;	
	/**
	!#en
	Creates the action easing object with the period in radians (default is 0.3). <br />
	Reference easeInOutElastic: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeElasticInOut 缓动对象。<br />
	EaseElasticInOut 是按弹性曲线缓动进入并退出的动作。<br />
	参考 easeInOutElastic：http://www.zhihu.com/question/21981571/answer/19925418
	@param period period
	
	@example 
	```js
	// example
	action.easing(cc.easeElasticInOut(3.0));
	``` 
	*/
	export function easeElasticInOut(period: number): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Eased bounce effect at the beginning.
	!#zh
	创建 easeBounceIn 缓动对象。<br />
	EaseBounceIn 是按弹跳动作缓动进入的动作。
	
	@example 
	```js
	// example
	action.easing(cc.easeBounceIn());
	``` 
	*/
	export function easeBounceIn(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Eased bounce effect at the ending.
	!#zh
	创建 easeBounceOut 缓动对象。<br />
	EaseBounceOut 是按弹跳动作缓动退出的动作。
	
	@example 
	```js
	// example
	action.easing(cc.easeBounceOut());
	``` 
	*/
	export function easeBounceOut(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Eased bounce effect at the begining and ending.
	!#zh
	创建 easeBounceInOut 缓动对象。<br />
	EaseBounceInOut 是按弹跳动作缓动进入并退出的动作。
	
	@example 
	```js
	// example
	action.easing(cc.easeBounceInOut());
	``` 
	*/
	export function easeBounceInOut(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	In the opposite direction to move slowly, and then accelerated to the right direction.
	!#zh
	创建 easeBackIn 缓动对象。<br />
	easeBackIn 是在相反的方向缓慢移动，然后加速到正确的方向。<br />
	
	@example 
	```js
	// example
	action.easing(cc.easeBackIn());
	``` 
	*/
	export function easeBackIn(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Fast moving more than the finish, and then slowly back to the finish.
	!#zh
	创建 easeBackOut 缓动对象。<br />
	easeBackOut 快速移动超出目标，然后慢慢回到目标点。
	
	@example 
	```js
	// example
	action.easing(cc.easeBackOut());
	``` 
	*/
	export function easeBackOut(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Begining of cc.EaseBackIn. Ending of cc.EaseBackOut.
	!#zh
	创建 easeBackInOut 缓动对象。<br />
	
	@example 
	```js
	// example
	action.easing(cc.easeBackInOut());
	``` 
	*/
	export function easeBackInOut(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Into the 4 reference point. <br />
	To calculate the motion curve.
	!#zh
	创建 easeBezierAction 缓动对象。<br />
	EaseBezierAction 是按贝塞尔曲线缓动的动作。
	@param p0 The first bezier parameter
	@param p1 The second bezier parameter
	@param p2 The third bezier parameter
	@param p3 The fourth bezier parameter
	
	@example 
	```js
	// example
	action.easing(cc.easeBezierAction(0.5, 0.5, 1.0, 1.0));
	``` 
	*/
	export function easeBezierAction(p0: number, p1: number, p2: number, p3: number): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Reference easeInQuad: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeQuadraticActionIn 缓动对象。<br />
	EaseQuadraticIn是按二次函数缓动进入的动作。<br />
	参考 easeInQuad：http://www.zhihu.com/question/21981571/answer/19925418
	
	@example 
	```js
	//example
	action.easing(cc.easeQuadraticActionIn());
	``` 
	*/
	export function easeQuadraticActionIn(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Reference easeOutQuad: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeQuadraticActionOut 缓动对象。<br />
	EaseQuadraticOut 是按二次函数缓动退出的动作。<br />
	参考 easeOutQuad：http://www.zhihu.com/question/21981571/answer/19925418
	
	@example 
	```js
	//example
	action.easing(cc.easeQuadraticActionOut());
	``` 
	*/
	export function easeQuadraticActionOut(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Reference easeInOutQuad: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeQuadraticActionInOut 缓动对象。<br />
	EaseQuadraticInOut 是按二次函数缓动进入并退出的动作。<br />
	参考 easeInOutQuad：http://www.zhihu.com/question/21981571/answer/19925418
	
	@example 
	```js
	//example
	action.easing(cc.easeQuadraticActionInOut());
	``` 
	*/
	export function easeQuadraticActionInOut(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Reference easeIntQuart: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeQuarticActionIn 缓动对象。<br />
	EaseQuarticIn 是按四次函数缓动进入的动作。<br />
	参考 easeIntQuart：http://www.zhihu.com/question/21981571/answer/19925418
	
	@example 
	```js
	//example
	action.easing(cc.easeQuarticActionIn());
	``` 
	*/
	export function easeQuarticActionIn(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Reference easeOutQuart: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeQuarticActionOut 缓动对象。<br />
	EaseQuarticOut 是按四次函数缓动退出的动作。<br />
	参考 easeOutQuart：http://www.zhihu.com/question/21981571/answer/19925418
	
	@example 
	```js
	//example
	action.easing(cc.QuarticActionOut());
	``` 
	*/
	export function easeQuarticActionOut(): any;	
	/**
	!#en
	Creates the action easing object.  <br />
	Reference easeInOutQuart: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeQuarticActionInOut 缓动对象。<br />
	EaseQuarticInOut 是按四次函数缓动进入并退出的动作。<br />
	参考 easeInOutQuart：http://www.zhihu.com/question/21981571/answer/19925418 
	*/
	export function easeQuarticActionInOut(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Reference easeInQuint: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeQuinticActionIn 缓动对象。<br />
	EaseQuinticIn 是按五次函数缓动进的动作。<br />
	参考 easeInQuint：http://www.zhihu.com/question/21981571/answer/19925418
	
	@example 
	```js
	//example
	action.easing(cc.easeQuinticActionIn());
	``` 
	*/
	export function easeQuinticActionIn(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Reference easeOutQuint: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeQuinticActionOut 缓动对象。<br />
	EaseQuinticOut 是按五次函数缓动退出的动作
	参考 easeOutQuint：http://www.zhihu.com/question/21981571/answer/19925418
	
	@example 
	```js
	//example
	action.easing(cc.easeQuadraticActionOut());
	``` 
	*/
	export function easeQuinticActionOut(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Reference easeInOutQuint: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeQuinticActionInOut 缓动对象。<br />
	EaseQuinticInOut是按五次函数缓动进入并退出的动作。<br />
	参考 easeInOutQuint：http://www.zhihu.com/question/21981571/answer/19925418
	
	@example 
	```js
	//example
	action.easing(cc.easeQuinticActionInOut());
	``` 
	*/
	export function easeQuinticActionInOut(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Reference easeInCirc: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeCircleActionIn 缓动对象。<br />
	EaseCircleIn是按圆形曲线缓动进入的动作。<br />
	参考 easeInCirc：http://www.zhihu.com/question/21981571/answer/19925418
	
	@example 
	```js
	//example
	action.easing(cc.easeCircleActionIn());
	``` 
	*/
	export function easeCircleActionIn(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Reference easeOutCirc: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeCircleActionOut 缓动对象。<br />
	EaseCircleOut是按圆形曲线缓动退出的动作。<br />
	参考 easeOutCirc：http://www.zhihu.com/question/21981571/answer/19925418
	
	@example 
	```js
	//example
	actioneasing(cc.easeCircleActionOut());
	``` 
	*/
	export function easeCircleActionOut(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Reference easeInOutCirc: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeCircleActionInOut 缓动对象。<br />
	EaseCircleInOut 是按圆形曲线缓动进入并退出的动作。<br />
	参考 easeInOutCirc：http://www.zhihu.com/question/21981571/answer/19925418
	
	@example 
	```js
	//example
	action.easing(cc.easeCircleActionInOut());
	``` 
	*/
	export function easeCircleActionInOut(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Reference easeInCubic: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeCubicActionIn 缓动对象。<br />
	EaseCubicIn 是按三次函数缓动进入的动作。<br />
	参考 easeInCubic：http://www.zhihu.com/question/21981571/answer/19925418
	
	@example 
	```js
	//example
	action.easing(cc.easeCubicActionIn());
	``` 
	*/
	export function easeCubicActionIn(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Reference easeOutCubic: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeCubicActionOut 缓动对象。<br />
	EaseCubicOut 是按三次函数缓动退出的动作。<br />
	参考 easeOutCubic：http://www.zhihu.com/question/21981571/answer/19925418
	
	@example 
	```js
	//example
	action.easing(cc.easeCubicActionOut());
	``` 
	*/
	export function easeCubicActionOut(): any;	
	/**
	!#en
	Creates the action easing object. <br />
	Reference easeInOutCubic: <br />
	http://www.zhihu.com/question/21981571/answer/19925418
	!#zh
	创建 easeCubicActionInOut 缓动对象。<br />
	EaseCubicInOut是按三次函数缓动进入并退出的动作。<br />
	参考 easeInOutCubic：http://www.zhihu.com/question/21981571/answer/19925418 
	*/
	export function easeCubicActionInOut(): any;	
	/**
	!#en Show the Node.
	!#zh 立即显示。
	
	@example 
	```js
	// example
	var showAction = cc.show();
	``` 
	*/
	export function show(): ActionInstant;	
	/**
	!#en Hide the node.
	!#zh 立即隐藏。
	
	@example 
	```js
	// example
	var hideAction = cc.hide();
	``` 
	*/
	export function hide(): ActionInstant;	
	/**
	!#en Toggles the visibility of a node.
	!#zh 显隐状态切换。
	
	@example 
	```js
	// example
	var toggleVisibilityAction = cc.toggleVisibility();
	``` 
	*/
	export function toggleVisibility(): ActionInstant;	
	/**
	!#en Create a RemoveSelf object with a flag indicate whether the target should be cleaned up while removing.
	!#zh 从父节点移除自身。
	@param isNeedCleanUp  isNeedCleanUp 
	
	@example 
	```js
	// example
	var removeSelfAction = cc.removeSelf();
	``` 
	*/
	export function removeSelf(isNeedCleanUp ?: boolean): ActionInstant;	
	/**
	!#en Destroy self
	!#zh 创建一个销毁自身的动作。
	
	@example 
	```js
	var destroySelfAction = cc.destroySelf();
	``` 
	*/
	export function destroySelf(): ActionInstant;	
	/**
	!#en Create a FlipX action to flip or unflip the target.
	!#zh X轴翻转。
	@param flip Indicate whether the target should be flipped or not
	
	@example 
	```js
	var flipXAction = cc.flipX(true);
	``` 
	*/
	export function flipX(flip: boolean): ActionInstant;	
	/**
	!#en Create a FlipY action to flip or unflip the target.
	!#zh Y轴翻转。
	@param flip flip
	
	@example 
	```js
	var flipYAction = cc.flipY(true);
	``` 
	*/
	export function flipY(flip: boolean): ActionInstant;	
	/**
	!#en Creates a Place action with a position.
	!#zh 放置在目标位置。
	@param pos pos
	@param y y
	
	@example 
	```js
	// example
	var placeAction = cc.place(cc.v2(200, 200));
	var placeAction = cc.place(200, 200);
	``` 
	*/
	export function place(pos: Vec2|number, y?: number): ActionInstant;	
	/**
	!#en Creates the action with the callback.
	!#zh 执行回调函数。
	@param selector selector
	@param selectorTarget selectorTarget
	@param data data for function, it accepts all data types.
	
	@example 
	```js
	// example
	// CallFunc without data
	var finish = cc.callFunc(this.removeSprite, this);
	
	// CallFunc with data
	var finish = cc.callFunc(this.removeFromParentAndCleanup, this._grossini,  true);
	``` 
	*/
	export function callFunc(selector: Function, selectorTarget?: any, data?: any): ActionInstant;	
	/**
	!#en
	Helper constructor to create an array of sequenceable actions
	The created action will run actions sequentially, one after another.
	!#zh 顺序执行动作，创建的动作将按顺序依次运行。
	@param actionOrActionArray actionOrActionArray
	@param tempArray tempArray
	
	@example 
	```js
	// example
	// create sequence with actions
	var seq = cc.sequence(act1, act2);
	
	// create sequence with array
	var seq = cc.sequence(actArray);
	``` 
	*/
	export function sequence(actionOrActionArray: FiniteTimeAction|FiniteTimeAction[], ...tempArray: FiniteTimeAction[]): ActionInterval;	
	/**
	!#en Creates a Repeat action. Times is an unsigned integer between 1 and pow(2,30)
	!#zh 重复动作，可以按一定次数重复一个动，如果想永远重复一个动作请使用 repeatForever 动作来完成。
	@param action action
	@param times times
	
	@example 
	```js
	// example
	var rep = cc.repeat(cc.sequence(jump2, jump1), 5);
	``` 
	*/
	export function repeat(action: FiniteTimeAction, times: number): ActionInterval;	
	/**
	!#en Create a acton which repeat forever, as it runs forever, it can't be added into cc.sequence and cc.spawn.
	!#zh 永远地重复一个动作，有限次数内重复一个动作请使用 repeat 动作，由于这个动作不会停止，所以不能被添加到 cc.sequence 或 cc.spawn 中。
	@param action action
	
	@example 
	```js
	// example
	var repeat = cc.repeatForever(cc.rotateBy(1.0, 360));
	``` 
	*/
	export function repeatForever(action: FiniteTimeAction): ActionInterval;	
	/**
	!#en Create a spawn action which runs several actions in parallel.
	!#zh 同步执行动作，同步执行一组动作。
	@param actionOrActionArray actionOrActionArray
	@param tempArray tempArray
	
	@example 
	```js
	// example
	var action = cc.spawn(cc.jumpBy(2, cc.v2(300, 0), 50, 4), cc.rotateBy(2, 720));
	todo:It should be the direct use new
	``` 
	*/
	export function spawn(actionOrActionArray: FiniteTimeAction|FiniteTimeAction[], ...tempArray: FiniteTimeAction[]): FiniteTimeAction;	
	/**
	!#en
	Rotates a Node object to a certain angle by modifying its angle property. <br/>
	The direction will be decided by the shortest angle.
	!#zh 旋转到目标角度，通过逐帧修改它的 angle 属性，旋转方向将由最短的角度决定。
	@param duration duration in seconds
	@param dstAngle dstAngle in degrees.
	
	@example 
	```js
	// example
	var rotateTo = cc.rotateTo(2, 61.0);
	``` 
	*/
	export function rotateTo(duration: number, dstAngle: number): ActionInterval;	
	/**
	!#en
	Rotates a Node object clockwise a number of degrees by modifying its angle property.
	Relative to its properties to modify.
	!#zh 旋转指定的角度。
	@param duration duration in seconds
	@param deltaAngle deltaAngle in degrees
	
	@example 
	```js
	// example
	var actionBy = cc.rotateBy(2, 360);
	``` 
	*/
	export function rotateBy(duration: number, deltaAngle: number): ActionInterval;	
	/**
	!#en
	Moves a Node object x,y pixels by modifying its position property.                                  <br/>
	x and y are relative to the position of the object.                                                     <br/>
	Several MoveBy actions can be concurrently called, and the resulting                                  <br/>
	movement will be the sum of individual movements.
	!#zh 移动指定的距离。
	@param duration duration in seconds
	@param deltaPos deltaPos
	@param deltaY deltaY
	
	@example 
	```js
	// example
	var actionTo = cc.moveBy(2, cc.v2(windowSize.width - 40, windowSize.height - 40));
	``` 
	*/
	export function moveBy(duration: number, deltaPos: Vec2|number, deltaY?: number): ActionInterval;	
	/**
	!#en
	Moves a Node object to the position x,y. x and y are absolute coordinates by modifying its position property. <br/>
	Several MoveTo actions can be concurrently called, and the resulting                                            <br/>
	movement will be the sum of individual movements.
	!#zh 移动到目标位置。
	@param duration duration in seconds
	@param position position
	@param y y
	
	@example 
	```js
	// example
	var actionBy = cc.moveTo(2, cc.v2(80, 80));
	``` 
	*/
	export function moveTo(duration: number, position: Vec2|number, y?: number): ActionInterval;	
	/**
	!#en
	Create a action which skews a Node object to given angles by modifying its skewX and skewY properties.
	Changes to the specified value.
	!#zh 偏斜到目标角度。
	@param t time in seconds
	@param sx sx
	@param sy sy
	
	@example 
	```js
	// example
	var actionTo = cc.skewTo(2, 37.2, -37.2);
	``` 
	*/
	export function skewTo(t: number, sx: number, sy: number): ActionInterval;	
	/**
	!#en
	Skews a Node object by skewX and skewY degrees. <br />
	Relative to its property modification.
	!#zh 偏斜指定的角度。
	@param t time in seconds
	@param sx sx skew in degrees for X axis
	@param sy sy skew in degrees for Y axis
	
	@example 
	```js
	// example
	var actionBy = cc.skewBy(2, 0, -90);
	``` 
	*/
	export function skewBy(t: number, sx: number, sy: number): ActionInterval;	
	/**
	!#en
	Moves a Node object simulating a parabolic jump movement by modifying it's position property.
	Relative to its movement.
	!#zh 用跳跃的方式移动指定的距离。
	@param duration duration
	@param position position
	@param y y
	@param height height
	@param jumps jumps
	
	@example 
	```js
	// example
	var actionBy = cc.jumpBy(2, cc.v2(300, 0), 50, 4);
	var actionBy = cc.jumpBy(2, 300, 0, 50, 4);
	``` 
	*/
	export function jumpBy(duration: number, position: Vec2|number, y?: number, height?: number, jumps?: number): ActionInterval;	
	/**
	!#en
	Moves a Node object to a parabolic position simulating a jump movement by modifying its position property. <br />
	Jump to the specified location.
	!#zh 用跳跃的方式移动到目标位置。
	@param duration duration
	@param position position
	@param y y
	@param height height
	@param jumps jumps
	
	@example 
	```js
	// example
	var actionTo = cc.jumpTo(2, cc.v2(300, 300), 50, 4);
	var actionTo = cc.jumpTo(2, 300, 300, 50, 4);
	``` 
	*/
	export function jumpTo(duration: number, position: Vec2|number, y?: number, height?: number, jumps?: number): ActionInterval;	
	/**
	!#en
	An action that moves the target with a cubic Bezier curve by a certain distance.
	Relative to its movement.
	!#zh 按贝赛尔曲线轨迹移动指定的距离。
	@param t time in seconds
	@param c Array of points
	
	@example 
	```js
	// example
	var bezier = [cc.v2(0, windowSize.height / 2), cc.v2(300, -windowSize.height / 2), cc.v2(300, 100)];
	var bezierForward = cc.bezierBy(3, bezier);
	``` 
	*/
	export function bezierBy(t: number, c: Vec2[]): ActionInterval;	
	/**
	!#en An action that moves the target with a cubic Bezier curve to a destination point.
	!#zh 按贝赛尔曲线轨迹移动到目标位置。
	@param t t
	@param c Array of points
	
	@example 
	```js
	// example
	var bezier = [cc.v2(0, windowSize.height / 2), cc.v2(300, -windowSize.height / 2), cc.v2(300, 100)];
	var bezierTo = cc.bezierTo(2, bezier);
	``` 
	*/
	export function bezierTo(t: number, c: Vec2[]): ActionInterval;	
	/**
	!#en Scales a Node object to a zoom factor by modifying it's scale property.
	!#zh 将节点大小缩放到指定的倍数。
	@param duration duration
	@param sx scale parameter in X
	@param sy scale parameter in Y, if Null equal to sx
	
	@example 
	```js
	// example
	// It scales to 0.5 in both X and Y.
	var actionTo = cc.scaleTo(2, 0.5);
	
	// It scales to 0.5 in x and 2 in Y
	var actionTo = cc.scaleTo(2, 0.5, 2);
	``` 
	*/
	export function scaleTo(duration: number, sx: number, sy?: number): ActionInterval;	
	/**
	!#en
	Scales a Node object a zoom factor by modifying it's scale property.
	Relative to its changes.
	!#zh 按指定的倍数缩放节点大小。
	@param duration duration in seconds
	@param sx sx  scale parameter in X
	@param sy sy scale parameter in Y, if Null equal to sx
	
	@example 
	```js
	// example without sy, it scales by 2 both in X and Y
	var actionBy = cc.scaleBy(2, 2);
	
	//example with sy, it scales by 0.25 in X and 4.5 in Y
	var actionBy2 = cc.scaleBy(2, 0.25, 4.5);
	``` 
	*/
	export function scaleBy(duration: number, sx: number, sy?: number|void): ActionInterval;	
	/**
	!#en Blinks a Node object by modifying it's visible property.
	!#zh 闪烁（基于透明度）。
	@param duration duration in seconds
	@param blinks blinks in times
	
	@example 
	```js
	// example
	var action = cc.blink(2, 10);
	``` 
	*/
	export function blink(duration: number, blinks: number): ActionInterval;	
	/**
	!#en
	Fades an object that implements the cc.RGBAProtocol protocol.
	It modifies the opacity from the current value to a custom one.
	!#zh 修改透明度到指定值。
	@param duration duration
	@param opacity 0-255, 0 is transparent
	
	@example 
	```js
	// example
	var action = cc.fadeTo(1.0, 0);
	``` 
	*/
	export function fadeTo(duration: number, opacity: number): ActionInterval;	
	/**
	!#en Fades In an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from 0 to 255.
	!#zh 渐显效果。
	@param duration duration in seconds
	
	@example 
	```js
	//example
	var action = cc.fadeIn(1.0);
	``` 
	*/
	export function fadeIn(duration: number): ActionInterval;	
	/**
	!#en Fades Out an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from 255 to 0.
	!#zh 渐隐效果。
	@param d duration in seconds
	
	@example 
	```js
	// example
	var action = cc.fadeOut(1.0);
	``` 
	*/
	export function fadeOut(d: number): ActionInterval;	
	/**
	!#en Tints a Node that implements the cc.NodeRGB protocol from current tint to a custom one.
	!#zh 修改颜色到指定值。
	@param duration duration
	@param red 0-255
	@param green 0-255
	@param blue 0-255
	
	@example 
	```js
	// example
	var action = cc.tintTo(2, 255, 0, 255);
	``` 
	*/
	export function tintTo(duration: number, red: number, green: number, blue: number): ActionInterval;	
	/**
	!#en
	Tints a Node that implements the cc.NodeRGB protocol from current tint to a custom one.
	Relative to their own color change.
	!#zh 按照指定的增量修改颜色。
	@param duration duration in seconds
	@param deltaRed deltaRed
	@param deltaGreen deltaGreen
	@param deltaBlue deltaBlue
	
	@example 
	```js
	// example
	var action = cc.tintBy(2, -127, -255, -127);
	``` 
	*/
	export function tintBy(duration: number, deltaRed: number, deltaGreen: number, deltaBlue: number): ActionInterval;	
	/**
	!#en Delays the action a certain amount of seconds.
	!#zh 延迟指定的时间量。
	@param d duration in seconds
	
	@example 
	```js
	// example
	var delay = cc.delayTime(1);
	``` 
	*/
	export function delayTime(d: number): ActionInterval;	
	/**
	!#en Executes an action in reverse order, from time=duration to time=0.
	!#zh 反转目标动作的时间轴。
	@param action action
	
	@example 
	```js
	// example
	 var reverse = cc.reverseTime(this);
	``` 
	*/
	export function reverseTime(action: FiniteTimeAction): ActionInterval;	
	/**
	!#en Create an action with the specified action and forced target.
	!#zh 用已有动作和一个新的目标节点创建动作。
	@param target target
	@param action action 
	*/
	export function targetedAction(target: Node, action: FiniteTimeAction): ActionInterval;	
	/**
	
	@param target the target to animate 
	*/
	export function tween<T> (target?: Object) : Tween<T>;	
	/** !#en This is a Easing instance.
	!#zh 这是一个 Easing 类实例。 */
	export var easing: Easing;	
	/**
	!#en
	Outputs an error message to the Cocos Creator Console (editor) or Web Console (runtime).<br/>
	- In Cocos Creator, error is red.<br/>
	- In Chrome, error have a red icon along with red message text.<br/>
	!#zh
	输出错误消息到 Cocos Creator 编辑器的 Console 或运行时页面端的 Console 中。<br/>
	- 在 Cocos Creator 中，错误信息显示是红色的。<br/>
	- 在 Chrome 中，错误信息有红色的图标以及红色的消息文本。<br/>
	@param msg A JavaScript string containing zero or more substitution strings.
	@param subst JavaScript objects with which to replace substitution strings within msg. This gives you additional control over the format of the output. 
	*/
	export function error(msg: any, ...subst: any[]): void;	
	/**
	!#en
	Outputs a warning message to the Cocos Creator Console (editor) or Web Console (runtime).
	- In Cocos Creator, warning is yellow.
	- In Chrome, warning have a yellow warning icon with the message text.
	!#zh
	输出警告消息到 Cocos Creator 编辑器的 Console 或运行时 Web 端的 Console 中。<br/>
	- 在 Cocos Creator 中，警告信息显示是黄色的。<br/>
	- 在 Chrome 中，警告信息有着黄色的图标以及黄色的消息文本。<br/>
	@param msg A JavaScript string containing zero or more substitution strings.
	@param subst JavaScript objects with which to replace substitution strings within msg. This gives you additional control over the format of the output. 
	*/
	export function warn(msg: any, ...subst: any[]): void;	
	/**
	!#en Outputs a message to the Cocos Creator Console (editor) or Web Console (runtime).
	!#zh 输出一条消息到 Cocos Creator 编辑器的 Console 或运行时 Web 端的 Console 中。
	@param msg A JavaScript string containing zero or more substitution strings.
	@param subst JavaScript objects with which to replace substitution strings within msg. This gives you additional control over the format of the output. 
	*/
	export function log(msg: string|any, ...subst: any[]): void;	
	/** !#en Director
	!#zh 导演类。 */
	export var director: Director;	
	/** !#en This is a Game instance.
	!#zh 这是一个 Game 类的实例，包含游戏主体信息并负责驱动游戏的游戏对象。。 */
	export var game: Game;	
	/**
	!#en
	Rotates a Node object to a certain angle by modifying its quternion property. <br/>
	The direction will be decided by the shortest angle.
	!#zh 旋转到目标角度，通过逐帧修改它的 quternion 属性，旋转方向将由最短的角度决定。
	@param duration duration in seconds
	@param dstAngleX dstAngleX in degrees.
	@param dstAngleY dstAngleY in degrees.
	@param dstAngleZ dstAngleZ in degrees.
	
	@example 
	```js
	// example
	var rotate3DTo = cc.rotate3DTo(2, cc.v3(0, 180, 0));
	``` 
	*/
	export function rotate3DTo(duration: number, dstAngleX: number|Vec3|Quat, dstAngleY?: number, dstAngleZ?: number): ActionInterval;	
	/**
	!#en
	Rotates a Node object counter clockwise a number of degrees by modifying its quaternion property.
	Relative to its properties to modify.
	!#zh 旋转指定的 3D 角度。
	@param duration duration in seconds
	@param deltaAngleX deltaAngleX in degrees
	@param deltaAngleY deltaAngleY in degrees
	@param deltaAngleZ deltaAngleZ in degrees
	
	@example 
	```js
	// example
	var actionBy = cc.rotate3DBy(2, cc.v3(0, 360, 0));
	``` 
	*/
	export function rotate3DBy(duration: number, deltaAngleX: number|Vec3, deltaAngleY?: number, deltaAngleZ?: number): ActionInterval;	
	/** !#en The System event singleton for global usage
	!#zh 系统事件单例，方便全局使用 */
	export var systemEvent: SystemEvent;	
	/** The offset of the range. */
	export var offset: number;	
	/** The length of the range. */
	export var length: number;	
	/** The data range of this bundle.
	This range of data is essentially mapped to a GPU vertex buffer. */
	export var data: BufferRange;	
	/** The attribute formats. */
	export var formats: VertexFormat;	
	/** The vertex bundle that the primitive use. */
	export var vertexBundleIndices: number[];	
	/** The data range of the primitive.
	This range of data is essentially mapped to a GPU indices buffer. */
	export var data: BufferRange;	
	/** The type of this primitive's indices. */
	export var indexUnit: number;	
	/** The primitive's topology. */
	export var topology: number;	
	/**
	Finds a node by hierarchy path, the path is case-sensitive.
	It will traverse the hierarchy by splitting the path using '/' character.
	This function will still returns the node even if it is inactive.
	It is recommended to not use this function every frame instead cache the result at startup.
	@param path path
	@param referenceNode referenceNode 
	*/
	export function find(path: string, referenceNode?: Node): Node;	
	/**
	!#en Defines a CCClass using the given specification, please see [Class](/docs/editors_and_tools/creator-chapters/scripting/class.html) for details.
	!#zh 定义一个 CCClass，传入参数必须是一个包含类型参数的字面量对象，具体用法请查阅[类型定义](/docs/creator/scripting/class.html)。
	@param options options
	
	@example 
	```js
	// define base class
	var Node = cc.Class();
	
	// define sub class
	var Sprite = cc.Class({
	name: 'Sprite',
	extends: Node,
	
	ctor: function () {
	this.url = "";
	this.id = 0;
	},
	
	statics: {
	// define static members
	count: 0,
	getBounds: function (spriteList) {
	// compute bounds...
	}
	},
	
	properties {
	width: {
	default: 128,
	type: cc.Integer,
	tooltip: 'The width of sprite'
	},
	height: 128,
	size: {
	get: function () {
	return cc.v2(this.width, this.height);
	}
	}
	},
	
	load: function () {
	// load this.url...
	};
	});
	
	// instantiate
	
	var obj = new Sprite();
	obj.url = 'sprite.png';
	obj.load();
	``` 
	*/
	export function Class(options?: {name?: string; extends?: Function; ctor?: Function; __ctor__?: Function; properties?: any; statics?: any; mixins?: Function[]; editor?: {executeInEditMode?: boolean; requireComponent?: Function; menu?: string; executionOrder?: number; disallowMultiple?: boolean; playOnFocus?: boolean; inspector?: string; icon?: string; help?: string; }; update?: Function; lateUpdate?: Function; onLoad?: Function; start?: Function; onEnable?: Function; onDisable?: Function; onDestroy?: Function; onFocusInEditor?: Function; onLostFocusInEditor?: Function; resetInEditor?: Function; onRestore?: Function; _getLocalBounds?: Function; }): Function;	
	/**
	!#en
	Define an enum type. <br/>
	If a enum item has a value of -1, it will be given an Integer number according to it's order in the list.<br/>
	Otherwise it will use the value specified by user who writes the enum definition.
	
	!#zh
	定义一个枚举类型。<br/>
	用户可以把枚举值设为任意的整数，如果设为 -1，系统将会分配为上一个枚举值 + 1。
	@param obj a JavaScript literal object containing enum names and values, or a TypeScript enum type
	
	@example 
	```js
	// JavaScript:
	
	var WrapMode = cc.Enum({
	    Repeat: -1,
	    Clamp: -1
	});
	
	// Texture.WrapMode.Repeat == 0
	// Texture.WrapMode.Clamp == 1
	// Texture.WrapMode[0] == "Repeat"
	// Texture.WrapMode[1] == "Clamp"
	
	var FlagType = cc.Enum({
	    Flag1: 1,
	    Flag2: 2,
	    Flag3: 4,
	    Flag4: 8,
	});
	
	var AtlasSizeList = cc.Enum({
	    128: 128,
	    256: 256,
	    512: 512,
	    1024: 1024,
	});
	
	// TypeScript:
	
	// If used in TypeScript, just define a TypeScript enum:
	enum Direction {
	    Up,
	    Down,
	    Left,
	    Right
	}
	
	// If you need to inspect the enum in Properties panel, you can call cc.Enum:
	const {ccclass, property} = cc._decorator;
	
	@ccclass
	class NewScript extends cc.Component {
	    @property({
	        type: cc.Enum(Direction)    // call cc.Enum
	    })
	    direction: Direction = Direction.Up;
	}
	
	``` 
	*/
	export function Enum<T>(obj: T): T;	
	/**
	
	@param touches touches 
	*/
	export function handleTouchesBegin(touches: any[]): void;	
	/**
	
	@param touches touches 
	*/
	export function handleTouchesMove(touches: any[]): void;	
	/**
	
	@param touches touches 
	*/
	export function handleTouchesEnd(touches: any[]): void;	
	/**
	
	@param touches touches 
	*/
	export function handleTouchesCancel(touches: any[]): void;	
	/**
	
	@param touches touches 
	*/
	export function getSetOfTouchesEndOrCancel(touches: any[]): any[];	
	/**
	
	@param touch touch 
	*/
	export function getPreTouch(touch: Touch): Touch;	
	/**
	
	@param touch touch 
	*/
	export function setPreTouch(touch: Touch): void;	
	/**
	
	@param tx tx
	@param ty ty
	@param pos pos 
	*/
	export function getTouchByXY(tx: number, ty: number, pos: Vec2): Touch;	
	/**
	
	@param location location
	@param pos pos
	@param eventType eventType 
	*/
	export function getMouseEvent(location: Vec2, pos: Vec2, eventType: number): Event.EventMouse;	
	/**
	
	@param event event
	@param pos pos 
	*/
	export function getPointByEvent(event: Touch, pos: Vec2): Vec2;	
	/**
	
	@param event event
	@param pos pos 
	*/
	export function getTouchesByEvent(event: Touch, pos: Vec2): any[];	
	/**
	
	@param element element 
	*/
	export function registerSystemEvent(element: HTMLElement): void;	
	/**
	
	@param dt dt 
	*/
	export function update(dt: number): void;	
	/**
	!#en
	Checks whether the object is non-nil and not yet destroyed.<br>
	When an object's `destroy` is called, it is actually destroyed after the end of this frame.
	So `isValid` will return false from the next frame, while `isValid` in the current frame will still be true.
	If you want to determine whether the current frame has called `destroy`, use `cc.isValid(obj, true)`,
	but this is often caused by a particular logical requirements, which is not normally required.
	
	!#zh
	检查该对象是否不为 null 并且尚未销毁。<br>
	当一个对象的 `destroy` 调用以后，会在这一帧结束后才真正销毁。因此从下一帧开始 `isValid` 就会返回 false，而当前帧内 `isValid` 仍然会是 true。如果希望判断当前帧是否调用过 `destroy`，请使用 `cc.isValid(obj, true)`，不过这往往是特殊的业务需求引起的，通常情况下不需要这样。
	@param value value
	@param strictMode If true, Object called destroy() in this frame will also treated as invalid.
	
	@example 
	```js
	var node = new cc.Node();
	cc.log(cc.isValid(node));    // true
	node.destroy();
	cc.log(cc.isValid(node));    // true, still valid in this frame
	// after a frame...
	cc.log(cc.isValid(node));    // false, destroyed in the end of last frame
	``` 
	*/
	export function isValid(value: any, strictMode?: boolean): boolean;	
	/** !#en cc.view is the shared view object.
	!#zh cc.view 是全局的视图对象。 */
	export var view: View;	
	/** !#en cc.winSize is the alias object for the size of the current game window.
	!#zh cc.winSize 为当前的游戏窗口的大小。 */
	export var winSize: Size;	
	/** Specify that the input value must be integer in Inspector.
	Also used to indicates that the elements in array should be type integer. */
	export var Integer: string;	
	/** Indicates that the elements in array should be type double. */
	export var Float: string;	
	/** Indicates that the elements in array should be type boolean. */
	export var Boolean: string;	
	/** Indicates that the elements in array should be type string. */
	export var String: string;	
	/**
	!#en Deserialize json to cc.Asset
	!#zh 将 JSON 反序列化为对象实例。
	
	当指定了 target 选项时，如果 target 引用的其它 asset 的 uuid 不变，则不会改变 target 对 asset 的引用，
	也不会将 uuid 保存到 result 对象中。
	@param data the serialized cc.Asset json string or json object.
	@param details additional loading result
	@param options options 
	*/
	export function deserialize(data: string|any, details?: Details, options?: any): any;	
	/**
	!#en Clones the object `original` and returns the clone, or instantiate a node from the Prefab.
	!#zh 克隆指定的任意类型的对象，或者从 Prefab 实例化出新节点。
	
	（Instantiate 时，function 和 dom 等非可序列化对象会直接保留原有引用，Asset 会直接进行浅拷贝，可序列化类型会进行深拷贝。）
	@param original An existing object that you want to make a copy of.
	
	@example 
	```js
	// instantiate node from prefab
	var scene = cc.director.getScene();
	var node = cc.instantiate(prefabAsset);
	node.parent = scene;
	// clone node
	var scene = cc.director.getScene();
	var node = cc.instantiate(targetNode);
	node.parent = scene;
	``` 
	*/
	export function instantiate(original: Prefab): Node;
	export function instantiate<T>(original: T): T;	
	/**
	!#en
	The convenience method to create a new {{#crossLink "Color/Color:method"}}cc.Color{{/crossLink}}
	Alpha channel is optional. Default value is 255.
	
	!#zh
	通过该方法来创建一个新的 {{#crossLink "Color/Color:method"}}cc.Color{{/crossLink}} 对象。
	Alpha 通道是可选的。默认值是 255。
	@param r r
	@param g g
	@param b b
	@param a a
	
	@example 
	```js
	-----------------------
	// 1. All channels seperately as parameters
	var color1 = new cc.Color(255, 255, 255, 255);
	// 2. Convert a hex string to a color
	var color2 = new cc.Color("#000000");
	// 3. An color object as parameter
	var color3 = new cc.Color({r: 255, g: 255, b: 255, a: 255});
	
	``` 
	*/
	export function color(r?: number, g?: number, b?: number, a?: number): Color;	
	/** Identity  of Mat3 */
	export var IDENTITY: Mat3;	
	/**
	!#zh 矩阵转数组
	!#en Matrix transpose array
	@param ofs 数组内的起始偏移量 
	*/
	export function toArray <Out extends IWritableArrayLike<number>> (out: Out, mat: IMat3Like, ofs = 0);	
	/**
	!#zh 数组转矩阵
	!#en Transfer matrix array
	@param ofs 数组起始偏移量 
	*/
	export function fromArray <Out extends IMat3Like> (out: Out, arr: IWritableArrayLike<number>, ofs = 0);	
	/** !#en Matrix Data
	!#zh 矩阵数据 */
	export var m: Float64Array|Float32Array;	
	export function constructor (m00: number | Float32Array = 1, m01 = 0, m02 = 0, m03 = 0, m04 = 1, m05 = 0, m06 = 0, m07 = 0, m08 = 1);	
	/**
	!#en The convenience method to create a new {{#crossLink "Mat4"}}cc.Mat4{{/crossLink}}.
	!#zh 通过该简便的函数进行创建 {{#crossLink "Mat4"}}cc.Mat4{{/crossLink}} 对象。
	@param m00 Component in column 0, row 0 position (index 0)
	@param m01 Component in column 0, row 1 position (index 1)
	@param m02 Component in column 0, row 2 position (index 2)
	@param m03 Component in column 0, row 3 position (index 3)
	@param m10 Component in column 1, row 0 position (index 4)
	@param m11 Component in column 1, row 1 position (index 5)
	@param m12 Component in column 1, row 2 position (index 6)
	@param m13 Component in column 1, row 3 position (index 7)
	@param m20 Component in column 2, row 0 position (index 8)
	@param m21 Component in column 2, row 1 position (index 9)
	@param m22 Component in column 2, row 2 position (index 10)
	@param m23 Component in column 2, row 3 position (index 11)
	@param m30 Component in column 3, row 0 position (index 12)
	@param m31 Component in column 3, row 1 position (index 13)
	@param m32 Component in column 3, row 2 position (index 14)
	@param m33 Component in column 3, row 3 position (index 15) 
	*/
	export function mat4(m00?: number, m01?: number, m02?: number, m03?: number, m10?: number, m11?: number, m12?: number, m13?: number, m20?: number, m21?: number, m22?: number, m23?: number, m30?: number, m31?: number, m32?: number, m33?: number): Mat4;	
	/**
	!#en The convenience method to create a new {{#crossLink "Quat"}}cc.Quat{{/crossLink}}.
	!#zh 通过该简便的函数进行创建 {{#crossLink "Quat"}}cc.Quat{{/crossLink}} 对象。
	@param x x
	@param y y
	@param z z
	@param w w 
	*/
	export function quat(x?: number|any, y?: number, z?: number, w?: number): Quat;	
	/**
	!#en
	The convenience method to create a new Rect.
	see {{#crossLink "Rect/Rect:method"}}cc.Rect{{/crossLink}}
	!#zh
	该方法用来快速创建一个新的矩形。{{#crossLink "Rect/Rect:method"}}cc.Rect{{/crossLink}}
	@param x x
	@param y y
	@param w w
	@param h h
	
	@example 
	```js
	var a = new cc.Rect(0 , 0, 10, 0);
	``` 
	*/
	export function rect(x?: number, y?: number, w?: number, h?: number): Rect;	
	/**
	!#en
	Helper function that creates a cc.Size.<br/>
	Please use cc.p or cc.v2 instead, it will soon replace cc.Size.
	!#zh
	创建一个 cc.Size 对象的帮助函数。<br/>
	注意：可以使用 cc.p 或者是 cc.v2 代替，它们将很快取代 cc.Size。
	@param w width or a size object
	@param h height
	
	@example 
	```js
	var size1 = cc.size();
	var size2 = cc.size(100,100);
	var size3 = cc.size(size2);
	var size4 = cc.size({width: 100, height: 100});
	
	``` 
	*/
	export function size(w: number|Size, h?: number): Size;	
	export var EPSILON: number;	
	/**
	Clamps a value between a minimum float and maximum float value.
	@param val val
	@param min min
	@param max max 
	*/
	export function clamp(val: number, min: number, max: number): number;	
	/**
	Clamps a value between 0 and 1.
	@param val val 
	*/
	export function clamp01(val: number): number;	
	/**
	
	@param from from
	@param to to
	@param ratio the interpolation coefficient 
	*/
	export function lerp(from: number, to: number, ratio: number): number;	
	export function random(): void;	
	/**
	Returns a floating-point random number between min (inclusive) and max (exclusive).
	@param min min
	@param max max 
	*/
	export function randomRange(min: number, max: number): number;	
	/**
	Returns a random integer between min (inclusive) and max (exclusive).
	@param min min
	@param max max 
	*/
	export function randomRangeInt(min: number, max: number): number;	
	/**
	Linear congruential generator using Hull-Dobell Theorem.
	@param seed the random seed 
	*/
	export function pseudoRandom(seed: number): number;	
	/**
	Returns a floating-point pseudo-random number between min (inclusive) and max (exclusive).
	@param seed seed
	@param min min
	@param max max 
	*/
	export function pseudoRandomRange(seed: number, min: number, max: number): number;	
	/**
	Returns a pseudo-random integer between min (inclusive) and max (exclusive).
	@param seed seed
	@param min min
	@param max max 
	*/
	export function pseudoRandomRangeInt(seed: number, min: number, max: number): number;	
	/**
	Returns the next power of two for the value
	@param val val 
	*/
	export function nextPow2(val: number): number;	
	/**
	Returns float remainder for t / length
	@param t time start at 0
	@param length time of one cycle 
	*/
	export function repeat(t: number, length: number): number;	
	/**
	Returns time wrapped in ping-pong mode
	@param t time start at 0
	@param length time of one cycle 
	*/
	export function repeat(t: number, length: number): number;	
	/**
	Returns ratio of a value within a given range
	@param from start value
	@param to end value
	@param value given value 
	*/
	export function repeat(from: number, to: number, value: number): number;	
	/**
	Returns -1, 0, +1 depending on sign of x.
	@param v v 
	*/
	export function sign(v: number): void;	
	/**
	!#en The convenience method to create a new {{#crossLink "Vec2"}}cc.Vec2{{/crossLink}}.
	!#zh 通过该简便的函数进行创建 {{#crossLink "Vec2"}}cc.Vec2{{/crossLink}} 对象。
	@param x x
	@param y y
	
	@example 
	```js
	var v1 = cc.v2();
	var v2 = cc.v2(0, 0);
	var v3 = cc.v2(v2);
	var v4 = cc.v2({x: 100, y: 100});
	``` 
	*/
	export function v2(x?: number|any, y?: number): Vec2;	
	/**
	!#en The convenience method to create a new {{#crossLink "Vec3"}}cc.Vec3{{/crossLink}}.
	!#zh 通过该简便的函数进行创建 {{#crossLink "Vec3"}}cc.Vec3{{/crossLink}} 对象。
	@param x x
	@param y y
	@param z z
	
	@example 
	```js
	var v1 = cc.v3();
	var v2 = cc.v3(0, 0, 0);
	var v3 = cc.v3(v2);
	var v4 = cc.v3({x: 100, y: 100, z: 0});
	``` 
	*/
	export function v3(x?: number|any, y?: number, z?: number): Vec3;	
	export var dynamicAtlasManager: DynamicAtlasManager;	
	/** !#en The matrix storage */
	export var matrix: any[];	
	/**
	!#en Get an element
	@param i i
	@param j j 
	*/
	export function get(i: number, j: number): number;	
	/**
	!#en Set an element
	@param i i
	@param j j
	@param value value 
	*/
	export function set(i: number, j: number, value: boolean): void;	
	/**
	!#en Sets all elements to zero 
	*/
	export function reset(): void;	
	/** !#en
	 cc.NodePool is the cache pool designed for node type.<br/>
	 It can helps you to improve your game performance for objects which need frequent release and recreate operations<br/>
	
	It's recommended to create cc.NodePool instances by node type, the type corresponds to node type in game design, not the class,
	for example, a prefab is a specific node type. <br/>
	When you create a node pool, you can pass a Component which contains `unuse`, `reuse` functions to control the content of node.<br/>
	
	Some common use case is :<br/>
	     1. Bullets in game (die very soon, massive creation and recreation, no side effect on other objects)<br/>
	     2. Blocks in candy crash (massive creation and recreation)<br/>
	     etc...
	!#zh
	cc.NodePool 是用于管理节点对象的对象缓存池。<br/>
	它可以帮助您提高游戏性能，适用于优化对象的反复创建和销毁<br/>
	以前 cocos2d-x 中的 cc.pool 和新的节点事件注册系统不兼容，因此请使用 cc.NodePool 来代替。
	
	新的 NodePool 需要实例化之后才能使用，每种不同的节点对象池需要一个不同的对象池实例，这里的种类对应于游戏中的节点设计，一个 prefab 相当于一个种类的节点。<br/>
	在创建缓冲池时，可以传入一个包含 unuse, reuse 函数的组件类型用于节点的回收和复用逻辑。<br/>
	
	一些常见的用例是：<br/>
	     1.在游戏中的子弹（死亡很快，频繁创建，对其他对象无副作用）<br/>
	     2.糖果粉碎传奇中的木块（频繁创建）。
	     等等.... */
	export class NodePool {		
		/**
		!#en
		Constructor for creating a pool for a specific node template (usually a prefab). You can pass a component (type or name) argument for handling event for reusing and recycling node.
		!#zh
		使用构造函数来创建一个节点专用的对象池，您可以传递一个组件类型或名称，用于处理节点回收和复用时的事件逻辑。
		@param poolHandlerComp !#en The constructor or the class name of the component to control the unuse/reuse logic. !#zh 处理节点回收和复用事件逻辑的组件类型或名称。
		
		@example 
		```js
		properties: {
		   template: cc.Prefab
		 },
		 onLoad () {
		// MyTemplateHandler is a component with 'unuse' and 'reuse' to handle events when node is reused or recycled.
		   this.myPool = new cc.NodePool('MyTemplateHandler');
		 }
		``` 
		*/
		constructor(poolHandlerComp?: {prototype: Component}|string);		
		/** !#en The pool handler component, it could be the class name or the constructor.
		!#zh 缓冲池处理组件，用于节点的回收和复用逻辑，这个属性可以是组件类名或组件的构造函数。 */
		poolHandlerComp: Function|string;		
		/**
		!#en The current available size in the pool
		!#zh 获取当前缓冲池的可用对象数量 
		*/
		size(): number;		
		/**
		!#en Destroy all cached nodes in the pool
		!#zh 销毁对象池中缓存的所有节点 
		*/
		clear(): void;		
		/**
		!#en Put a new Node into the pool.
		It will automatically remove the node from its parent without cleanup.
		It will also invoke unuse method of the poolHandlerComp if exist.
		!#zh 向缓冲池中存入一个不再需要的节点对象。
		这个函数会自动将目标节点从父节点上移除，但是不会进行 cleanup 操作。
		这个函数会调用 poolHandlerComp 的 unuse 函数，如果组件和函数都存在的话。
		@param obj obj
		
		@example 
		```js
		let myNode = cc.instantiate(this.template);
		  this.myPool.put(myNode);
		``` 
		*/
		put(obj: Node): void;		
		/**
		!#en Get a obj from pool, if no available object in pool, null will be returned.
		This function will invoke the reuse function of poolHandlerComp if exist.
		!#zh 获取对象池中的对象，如果对象池没有可用对象，则返回空。
		这个函数会调用 poolHandlerComp 的 reuse 函数，如果组件和函数都存在的话。
		@param params !#en Params to pass to 'reuse' method in poolHandlerComp !#zh 向 poolHandlerComp 中的 'reuse' 函数传递的参数
		
		@example 
		```js
		let newNode = this.myPool.get();
		``` 
		*/
		get(...params: any[]): Node;	
	}	
	/** !#en Base class cc.Action for action classes.
	!#zh Action 类是所有动作类型的基类。 */
	export class Action {		
		/**
		!#en
		to copy object with deep copy.
		returns a clone of action.
		!#zh 返回一个克隆的动作。 
		*/
		clone(): Action;		
		/**
		!#en
		return true if the action has finished.
		!#zh 如果动作已完成就返回 true。 
		*/
		isDone(): boolean;		
		/**
		!#en get the target.
		!#zh 获取当前目标节点。 
		*/
		getTarget(): Node;		
		/**
		!#en The action will modify the target properties.
		!#zh 设置目标节点。
		@param target target 
		*/
		setTarget(target: Node): void;		
		/**
		!#en get the original target.
		!#zh 获取原始目标节点。 
		*/
		getOriginalTarget(): Node;		
		/**
		!#en get tag number.
		!#zh 获取用于识别动作的标签。 
		*/
		getTag(): number;		
		/**
		!#en set tag number.
		!#zh 设置标签，用于识别动作。
		@param tag tag 
		*/
		setTag(tag: number): void;		
		/** !#en Default Action tag.
		!#zh 默认动作标签。 */
		static TAG_INVALID: number;	
	}	
	/** !#en
	Base class actions that do have a finite time duration. <br/>
	Possible actions: <br/>
	- An action with a duration of 0 seconds. <br/>
	- An action with a duration of 35.5 seconds.
	
	Infinite time actions are valid
	!#zh 有限时间动作，这种动作拥有时长 duration 属性。 */
	export class FiniteTimeAction extends Action {		
		/**
		!#en get duration of the action. (seconds).
		!#zh 获取动作以秒为单位的持续时间。 
		*/
		getDuration(): number;		
		/**
		!#en set duration of the action. (seconds).
		!#zh 设置动作以秒为单位的持续时间。
		@param duration duration 
		*/
		setDuration(duration: number): void;		
		/**
		!#en
		Returns a reversed action. <br />
		For example: <br />
		- The action will be x coordinates of 0 move to 100. <br />
		- The reversed action will be x of 100 move to 0.
		- Will be rewritten
		!#zh 返回一个新的动作，执行与原动作完全相反的动作。 
		*/
		reverse(): void;		
		/**
		!#en
		to copy object with deep copy.
		returns a clone of action.
		!#zh 返回一个克隆的动作。 
		*/
		clone(): FiniteTimeAction;	
	}	
	/** !#en Instant actions are immediate actions. They don't have a duration like the ActionInterval actions.
	!#zh 即时动作，这种动作立即就会执行，继承自 FiniteTimeAction。 */
	export class ActionInstant extends FiniteTimeAction {	
	}	
	/** !#en
	<p> An interval action is an action that takes place within a certain period of time. <br/>
	It has an start time, and a finish time. The finish time is the parameter<br/>
	duration plus the start time.</p>
	
	<p>These CCActionInterval actions have some interesting properties, like:<br/>
	- They can run normally (default)  <br/>
	- They can run reversed with the reverse method   <br/>
	- They can run with the time altered with the Accelerate, AccelDeccel and Speed actions. </p>
	
	<p>For example, you can simulate a Ping Pong effect running the action normally and<br/>
	then running it again in Reverse mode. </p>
	!#zh 时间间隔动作，这种动作在已定时间内完成，继承 FiniteTimeAction。 */
	export class ActionInterval extends FiniteTimeAction {		
		/**
		!#en Implementation of ease motion.
		!#zh 缓动运动。
		@param easeObj easeObj
		
		@example 
		```js
		action.easing(cc.easeIn(3.0));
		``` 
		*/
		easing(easeObj: any): ActionInterval;		
		/**
		!#en
		Repeats an action a number of times.
		To repeat an action forever use the CCRepeatForever action.
		!#zh 重复动作可以按一定次数重复一个动作，使用 RepeatForever 动作来永远重复一个动作。
		@param times times 
		*/
		repeat(times: number): ActionInterval;		
		/**
		!#en
		Repeats an action for ever.  <br/>
		To repeat the an action for a limited number of times use the Repeat action. <br/>
		!#zh 永远地重复一个动作，有限次数内重复一个动作请使用 Repeat 动作。 
		*/
		repeatForever(): ActionInterval;	
	}	
	/** !#en
	cc.ActionManager is a class that can manage actions.<br/>
	Normally you won't need to use this class directly. 99% of the cases you will use the CCNode interface,
	which uses this class's singleton object.
	But there are some cases where you might need to use this class. <br/>
	Examples:<br/>
	- When you want to run an action where the target is different from a CCNode.<br/>
	- When you want to pause / resume the actions<br/>
	!#zh
	cc.ActionManager 是可以管理动作的单例类。<br/>
	通常你并不需要直接使用这个类，99%的情况您将使用 CCNode 的接口。<br/>
	但也有一些情况下，您可能需要使用这个类。 <br/>
	例如：
	 - 当你想要运行一个动作，但目标不是 CCNode 类型时。 <br/>
	 - 当你想要暂停/恢复动作时。 <br/> */
	export class ActionManager {		
		/**
		!#en
		Adds an action with a target.<br/>
		If the target is already present, then the action will be added to the existing target.
		If the target is not present, a new instance of this target will be created either paused or not, and the action will be added to the newly created target.
		When the target is paused, the queued actions won't be 'ticked'.
		!#zh
		增加一个动作，同时还需要提供动作的目标对象，目标对象是否暂停作为参数。<br/>
		如果目标已存在，动作将会被直接添加到现有的节点中。<br/>
		如果目标不存在，将为这一目标创建一个新的实例，并将动作添加进去。<br/>
		当目标状态的 paused 为 true，动作将不会被执行
		@param action action
		@param target target
		@param paused paused 
		*/
		addAction(action: Action, target: Node, paused: boolean): void;		
		/**
		!#en Removes all actions from all the targets.
		!#zh 移除所有对象的所有动作。 
		*/
		removeAllActions(): void;		
		/**
		!#en
		Removes all actions from a certain target. <br/>
		All the actions that belongs to the target will be removed.
		!#zh
		移除指定对象上的所有动作。<br/>
		属于该目标的所有的动作将被删除。
		@param target target
		@param forceDelete forceDelete 
		*/
		removeAllActionsFromTarget(target: Node, forceDelete: boolean): void;		
		/**
		!#en Removes an action given an action reference.
		!#zh 移除指定的动作。
		@param action action 
		*/
		removeAction(action: Action): void;		
		/**
		!#en Removes an action given its tag and the target.
		!#zh 删除指定对象下特定标签的一个动作，将删除首个匹配到的动作。
		@param tag tag
		@param target target 
		*/
		removeActionByTag(tag: number, target?: Node): void;		
		/**
		!#en Gets an action given its tag an a target.
		!#zh 通过目标对象和标签获取一个动作。
		@param tag tag
		@param target target 
		*/
		getActionByTag(tag: number, target: Node): Action;		
		/**
		!#en
		Returns the numbers of actions that are running in a certain target. <br/>
		Composable actions are counted as 1 action. <br/>
		Example: <br/>
		- If you are running 1 Sequence of 7 actions, it will return 1. <br/>
		- If you are running 7 Sequences of 2 actions, it will return 7.
		!#zh
		返回指定对象下所有正在运行的动作数量。 <br/>
		组合动作被算作一个动作。<br/>
		例如：<br/>
		 - 如果您正在运行 7 个动作组成的序列动作（Sequence），这个函数将返回 1。<br/>
		 - 如果你正在运行 2 个序列动作（Sequence）和 5 个普通动作，这个函数将返回 7。<br/>
		@param target target 
		*/
		getNumberOfRunningActionsInTarget(target: Node): number;		
		/**
		!#en Pauses the target: all running actions and newly added actions will be paused.
		!#zh 暂停指定对象：所有正在运行的动作和新添加的动作都将会暂停。
		@param target target 
		*/
		pauseTarget(target: Node): void;		
		/**
		!#en Resumes the target. All queued actions will be resumed.
		!#zh 让指定目标恢复运行。在执行序列中所有被暂停的动作将重新恢复运行。
		@param target target 
		*/
		resumeTarget(target: Node): void;		
		/**
		!#en Pauses all running actions, returning a list of targets whose actions were paused.
		!#zh 暂停所有正在运行的动作，返回一个包含了那些动作被暂停了的目标对象的列表。 
		*/
		pauseAllRunningActions(): any[];		
		/**
		!#en Resume a set of targets (convenience function to reverse a pauseAllRunningActions or pauseTargets call).
		!#zh 让一组指定对象恢复运行（用来逆转 pauseAllRunningActions 效果的便捷函数）。
		@param targetsToResume targetsToResume 
		*/
		resumeTargets(targetsToResume: any[]): void;		
		/**
		!#en Pause a set of targets.
		!#zh 暂停一组指定对象。
		@param targetsToPause targetsToPause 
		*/
		pauseTargets(targetsToPause: any[]): void;		
		/**
		!#en
		purges the shared action manager. It releases the retained instance. <br/>
		because it uses this, so it can not be static.
		!#zh
		清除共用的动作管理器。它释放了持有的实例。 <br/>
		因为它使用 this，因此它不能是静态的。 
		*/
		purgeSharedManager(): void;		
		/**
		!#en The ActionManager update。
		!#zh ActionManager 主循环。
		@param dt delta time in seconds 
		*/
		update(dt: number): void;	
	}	
	/** !#en
	Tween provide a simple and flexible way to create action.
	Tween's api is more flexible than cc.Action:
	 - Support creating an action sequence in chained api,
	 - Support animate any objects' any properties, not limited to node's properties.
	   By contrast, cc.Action needs to create a new action class to support new node property.
	 - Support working with cc.Action,
	 - Support easing and progress function.
	!#zh
	Tween 提供了一个简单灵活的方法来创建 action。
	相对于 Cocos 传统的 cc.Action，cc.Tween 在创建动画上要灵活非常多：
	 - 支持以链式结构的方式创建一个动画序列。
	 - 支持对任意对象的任意属性进行缓动，不再局限于节点上的属性，而 cc.Action 添加一个属性的支持时还需要添加一个新的 action 类型。
	 - 支持与 cc.Action 混用
	 - 支持设置 {{#crossLink "Easing"}}{{/crossLink}} 或者 progress 函数 */
	export class Tween {		
		/**
		
		@param target target 
		*/
		constructor(target?: any);		
		/**
		!#en Stop all tweens
		!#zh 停止所有缓动 
		*/
		static stopAll(): void;		
		/**
		!#en Stop all tweens by tag
		!#zh 停止所有指定标签的缓动
		@param tag tag 
		*/
		static stopAllByTag(tag: number): void;		
		/**
		!#en Stop all tweens by target
		!#zh 停止所有指定对象的缓动
		@param target target 
		*/
		static stopAllByTarget(target: any): void;		
		/**
		!#en
		Insert an action or tween to this sequence
		!#zh
		插入一个 action 或者 tween 到队列中
		@param other other 
		*/
		then(other: Action|Tween): Tween;		
		/**
		!#en
		Set tween target
		!#zh
		设置 tween 的 target
		@param target target 
		*/
		target(target: any): Tween;		
		/**
		!#en
		Start this tween
		!#zh
		运行当前 tween 
		*/
		start(): Tween;		
		/**
		!#en
		Stop this tween
		!#zh
		停止当前 tween 
		*/
		stop(): Tween;		
		/**
		!#en Sets tween tag
		!#zh 设置缓动的标签
		@param tag tag 
		*/
		tag(tag: number): Tween;		
		/**
		!#en
		Clone a tween
		!#zh
		克隆当前 tween
		@param target target 
		*/
		clone(target?: any): Tween;		
		/**
		!#en
		Integrate all previous actions to an action.
		!#zh
		将之前所有的 action 整合为一个 action。 
		*/
		union(): Tween;		
		/**
		!#en Sets target's position property according to the bezier curve.
		!#zh 按照贝塞尔路径设置目标的 position 属性。
		@param duration duration
		@param c1 c1
		@param c2 c2
		@param to to 
		*/
		bezierTo(duration: number, c1: Vec2, c2: Vec2, to: Vec2): Tween;		
		/**
		!#en Sets target's position property according to the bezier curve.
		!#zh 按照贝塞尔路径设置目标的 position 属性。
		@param duration duration
		@param c1 c1
		@param c2 c2
		@param to to 
		*/
		bezierBy(duration: number, c1: Vec2, c2: Vec2, to: Vec2): Tween;		
		/**
		!#en Flips target's scaleX
		!#zh 翻转目标的 scaleX 属性 
		*/
		flipX(): Tween;		
		/**
		!#en Flips target's scaleY
		!#zh 翻转目标的 scaleY 属性 
		*/
		flipY(): Tween;		
		/**
		!#en Blinks target by set target's opacity property
		!#zh 通过设置目标的 opacity 属性达到闪烁效果
		@param duration duration
		@param times times
		@param opts opts 
		*/
		blink(duration: number, times: number, opts?: {progress?: Function; easing?: Function|string; }): Tween;		
		/**
		!#en
		Add an action which calculate with absolute value
		!#zh
		添加一个对属性进行绝对值计算的 action
		@param duration duration
		@param props {scale: 2, position: cc.v3(100, 100, 100)}
		@param opts opts 
		*/
		to <OPTS extends Partial<{progress: Function, easing: Function|String}>> (duration: number, props: ConstructorType<T>, opts?: OPTS) : Tween;		
		/**
		!#en
		Add an action which calculate with relative value
		!#zh
		添加一个对属性进行相对值计算的 action
		@param duration duration
		@param props {scale: 2, position: cc.v3(100, 100, 100)}
		@param opts opts 
		*/
		by <OPTS extends Partial<{progress: Function, easing: Function|String}>> (duration: number, props: ConstructorType<T>, opts?: OPTS) : Tween;		
		/**
		!#en
		Directly set target properties
		!#zh
		直接设置 target 的属性
		@param props props 
		*/
		set (props: ConstructorType<T>) : Tween;		
		/**
		!#en
		Add an delay action
		!#zh
		添加一个延时 action
		@param duration duration 
		*/
		delay(duration: number): Tween;		
		/**
		!#en
		Add an callback action
		!#zh
		添加一个回调 action
		@param callback callback 
		*/
		call(callback: Function): Tween;		
		/**
		!#en
		Add an hide action
		!#zh
		添加一个隐藏 action 
		*/
		hide(): Tween;		
		/**
		!#en
		Add an show action
		!#zh
		添加一个显示 action 
		*/
		show(): Tween;		
		/**
		!#en
		Add an removeSelf action
		!#zh
		添加一个移除自己 action 
		*/
		removeSelf(): Tween;		
		/**
		!#en
		Add an sequence action
		!#zh
		添加一个队列 action
		@param action action
		@param actions actions 
		*/
		sequence(action: Action|Tween, ...actions: (Action|Tween)[]): Tween;		
		/**
		!#en
		Add an parallel action
		!#zh
		添加一个并行 action
		@param action action
		@param actions actions 
		*/
		parallel(action: Action|Tween, ...actions: (Action|Tween)[]): Tween;		
		/**
		!#en
		Add an repeat action.
		This action will integrate before actions to a sequence action as their parameters.
		!#zh
		添加一个重复 action，这个 action 会将前一个动作作为他的参数。
		@param repeatTimes repeatTimes
		@param action action 
		*/
		repeat(repeatTimes: number, action?: Action|Tween): Tween;		
		/**
		!#en
		Add an repeat forever action
		This action will integrate before actions to a sequence action as their parameters.
		!#zh
		添加一个永久重复 action，这个 action 会将前一个动作作为他的参数。
		@param action action 
		*/
		repeatForever(action?: Action|Tween): Tween;		
		/**
		!#en
		Add an reverse time action.
		This action will integrate before actions to a sequence action as their parameters.
		!#zh
		添加一个倒置时间 action，这个 action 会将前一个动作作为他的参数。
		@param action action 
		*/
		reverseTime(action?: Action|Tween): Tween;	
	}	
	/** !#en Class for animation data handling.
	!#zh 动画剪辑，用于存储动画数据。 */
	export class AnimationClip extends Asset {		
		/** !#en Duration of this animation.
		!#zh 动画的持续时间。 */
		duration: number;		
		/** !#en FrameRate of this animation.
		!#zh 动画的帧速率。 */
		sample: number;		
		/** !#en Speed of this animation.
		!#zh 动画的播放速度。 */
		speed: number;		
		/** !#en WrapMode of this animation.
		!#zh 动画的循环模式。 */
		wrapMode: WrapMode;		
		/** !#en Curve data.
		!#zh 曲线数据。 */
		curveData: any;		
		/** !#en Event data.
		!#zh 事件数据。 */
		events: {frame: number, func: string, params: string[]}[];		
		/**
		!#en Crate clip with a set of sprite frames
		!#zh 使用一组序列帧图片来创建动画剪辑
		@param spriteFrames spriteFrames
		@param sample sample
		
		@example 
		```js
		var clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 10);
		``` 
		*/
		static createWithSpriteFrames(spriteFrames: SpriteFrame[], sample: number): AnimationClip;	
	}	
	/** !#en
	The AnimationState gives full control over animation playback process.
	In most cases the Animation Component is sufficient and easier to use. Use the AnimationState if you need full control.
	!#zh
	AnimationState 完全控制动画播放过程。<br/>
	大多数情况下 动画组件 是足够和易于使用的。如果您需要更多的动画控制接口，请使用 AnimationState。 */
	export class AnimationState extends Playable {		
		/**
		
		@param clip clip
		@param name name 
		*/
		constructor(clip: AnimationClip, name?: string);		
		/** !#en The curves list.
		!#zh 曲线列表。 */
		curves: any[];		
		/** !#en The start delay which represents the number of seconds from an animation's start time to the start of
		the active interval.
		!#zh 延迟多少秒播放。 */
		delay: number;		
		/** !#en The animation's iteration count property.
		
		A real number greater than or equal to zero (including positive infinity) representing the number of times
		to repeat the animation node.
		
		Values less than zero and NaN values are treated as the value 1.0 for the purpose of timing model
		calculations.
		
		!#zh 迭代次数，指动画播放多少次后结束, normalize time。 如 2.5（2次半） */
		repeatCount: number;		
		/** !#en The iteration duration of this animation in seconds. (length)
		!#zh 单次动画的持续时间，秒。 */
		duration: number;		
		/** !#en The animation's playback speed. 1 is normal playback speed.
		!#zh 播放速率。 */
		speed: number;		
		/** !#en
		Wrapping mode of the playing animation.
		Notice : dynamic change wrapMode will reset time and repeatCount property
		!#zh
		动画循环方式。
		需要注意的是，动态修改 wrapMode 时，会重置 time 以及 repeatCount */
		wrapMode: WrapMode;		
		/** !#en The current time of this animation in seconds.
		!#zh 动画当前的时间，秒。 */
		time: number;		
		/** !#en The clip that is being played by this animation state.
		!#zh 此动画状态正在播放的剪辑。 */
		clip: AnimationClip;		
		/** !#en The name of the playing animation.
		!#zh 动画的名字 */
		name: string;	
	}	
	/** !#en
	This class provide easing methods for {{#crossLink "tween"}}{{/crossLink}} class.<br>
	Demonstratio: https://easings.net/
	!#zh
	缓动函数类，为 {{#crossLink "Tween"}}{{/crossLink}} 提供缓动效果函数。<br>
	函数效果演示： https://easings.net/ */
	export class Easing {		
		/**
		!#en Easing in with quadratic formula. From slow to fast.
		!#zh 平方曲线缓入函数。运动由慢到快。
		@param t The current time as a percentage of the total time. 
		*/
		quadIn(t: number): number;		
		/**
		!#en Easing out with quadratic formula. From fast to slow.
		!#zh 平方曲线缓出函数。运动由快到慢。
		@param t The current time as a percentage of the total time. 
		*/
		quadOut(t: number): number;		
		/**
		!#en Easing in and out with quadratic formula. From slow to fast, then back to slow.
		!#zh 平方曲线缓入缓出函数。运动由慢到快再到慢。
		@param t The current time as a percentage of the total time. 
		*/
		quadInOut(t: number): number;		
		/**
		!#en Easing in with cubic formula. From slow to fast.
		!#zh 立方曲线缓入函数。运动由慢到快。
		@param t The current time as a percentage of the total time. 
		*/
		cubicIn(t: number): number;		
		/**
		!#en Easing out with cubic formula. From slow to fast.
		!#zh 立方曲线缓出函数。运动由快到慢。
		@param t The current time as a percentage of the total time. 
		*/
		cubicOut(t: number): number;		
		/**
		!#en Easing in and out with cubic formula. From slow to fast, then back to slow.
		!#zh 立方曲线缓入缓出函数。运动由慢到快再到慢。
		@param t The current time as a percentage of the total time. 
		*/
		cubicInOut(t: number): number;		
		/**
		!#en Easing in with quartic formula. From slow to fast.
		!#zh 四次方曲线缓入函数。运动由慢到快。
		@param t The current time as a percentage of the total time. 
		*/
		quartIn(t: number): number;		
		/**
		!#en Easing out with quartic formula. From fast to slow.
		!#zh 四次方曲线缓出函数。运动由快到慢。
		@param t The current time as a percentage of the total time. 
		*/
		quartOut(t: number): number;		
		/**
		!#en Easing in and out with quartic formula. From slow to fast, then back to slow.
		!#zh 四次方曲线缓入缓出函数。运动由慢到快再到慢。
		@param t The current time as a percentage of the total time. 
		*/
		quartInOut(t: number): number;		
		/**
		!#en Easing in with quintic formula. From slow to fast.
		!#zh 五次方曲线缓入函数。运动由慢到快。
		@param t The current time as a percentage of the total time. 
		*/
		quintIn(t: number): number;		
		/**
		!#en Easing out with quintic formula. From fast to slow.
		!#zh 五次方曲线缓出函数。运动由快到慢。
		@param t The current time as a percentage of the total time. 
		*/
		quintOut(t: number): number;		
		/**
		!#en Easing in and out with quintic formula. From slow to fast, then back to slow.
		!#zh 五次方曲线缓入缓出函数。运动由慢到快再到慢。
		@param t The current time as a percentage of the total time. 
		*/
		quintInOut(t: number): number;		
		/**
		!#en Easing in and out with sine formula. From slow to fast.
		!#zh 正弦曲线缓入函数。运动由慢到快。
		@param t The current time as a percentage of the total time. 
		*/
		sineIn(t: number): number;		
		/**
		!#en Easing in and out with sine formula. From fast to slow.
		!#zh 正弦曲线缓出函数。运动由快到慢。
		@param t The current time as a percentage of the total time. 
		*/
		sineOut(t: number): number;		
		/**
		!#en Easing in and out with sine formula. From slow to fast, then back to slow.
		!#zh 正弦曲线缓入缓出函数。运动由慢到快再到慢。
		@param t The current time as a percentage of the total time. 
		*/
		sineInOut(t: number): number;		
		/**
		!#en Easing in and out with exponential formula. From slow to fast.
		!#zh 指数曲线缓入函数。运动由慢到快。
		@param t The current time as a percentage of the total time. 
		*/
		expoIn(t: number): number;		
		/**
		!#en Easing in and out with exponential formula. From fast to slow.
		!#zh 指数曲线缓出函数。运动由快到慢。
		@param t The current time as a percentage of the total time. 
		*/
		expoOut(t: number): number;		
		/**
		!#en Easing in and out with exponential formula. From slow to fast.
		!#zh 指数曲线缓入和缓出函数。运动由慢到很快再到慢。
		@param t The current time as a percentage of the total time, then back to slow. 
		*/
		expoInOut(t: number): number;		
		/**
		!#en Easing in and out with circular formula. From slow to fast.
		!#zh 循环公式缓入函数。运动由慢到快。
		@param t The current time as a percentage of the total time. 
		*/
		circIn(t: number): number;		
		/**
		!#en Easing in and out with circular formula. From fast to slow.
		!#zh 循环公式缓出函数。运动由快到慢。
		@param t The current time as a percentage of the total time. 
		*/
		circOut(t: number): number;		
		/**
		!#en Easing in and out with circular formula. From slow to fast.
		!#zh 指数曲线缓入缓出函数。运动由慢到很快再到慢。
		@param t The current time as a percentage of the total time, then back to slow. 
		*/
		circInOut(t: number): number;		
		/**
		!#en Easing in action with a spring oscillating effect.
		!#zh 弹簧回震效果的缓入函数。
		@param t The current time as a percentage of the total time. 
		*/
		elasticIn(t: number): number;		
		/**
		!#en Easing out action with a spring oscillating effect.
		!#zh 弹簧回震效果的缓出函数。
		@param t The current time as a percentage of the total time. 
		*/
		elasticOut(t: number): number;		
		/**
		!#en Easing in and out action with a spring oscillating effect.
		!#zh 弹簧回震效果的缓入缓出函数。
		@param t The current time as a percentage of the total time. 
		*/
		elasticInOut(t: number): number;		
		/**
		!#en Easing in action with "back up" behavior.
		!#zh 回退效果的缓入函数。
		@param t The current time as a percentage of the total time. 
		*/
		backIn(t: number): number;		
		/**
		!#en Easing out action with "back up" behavior.
		!#zh 回退效果的缓出函数。
		@param t The current time as a percentage of the total time. 
		*/
		backOut(t: number): number;		
		/**
		!#en Easing in and out action with "back up" behavior.
		!#zh 回退效果的缓入缓出函数。
		@param t The current time as a percentage of the total time. 
		*/
		backInOut(t: number): number;		
		/**
		!#en Easing in action with bouncing effect.
		!#zh 弹跳效果的缓入函数。
		@param t The current time as a percentage of the total time. 
		*/
		bounceIn(t: number): number;		
		/**
		!#en Easing out action with bouncing effect.
		!#zh 弹跳效果的缓出函数。
		@param t The current time as a percentage of the total time. 
		*/
		bounceOut(t: number): number;		
		/**
		!#en Easing in and out action with bouncing effect.
		!#zh 弹跳效果的缓入缓出函数。
		@param t The current time as a percentage of the total time. 
		*/
		bounceInOut(t: number): number;		
		/**
		!#en Target will run action with smooth effect.
		!#zh 平滑效果函数。
		@param t The current time as a percentage of the total time. 
		*/
		smooth(t: number): number;		
		/**
		!#en Target will run action with fade effect.
		!#zh 渐褪效果函数。
		@param t The current time as a percentage of the total time. 
		*/
		fade(t: number): number;	
	}	
	/** undefined */
	export class Playable {		
		/** !#en Is playing or paused in play mode?
		!#zh 当前是否正在播放。 */
		isPlaying: boolean;		
		/** !#en Is currently paused? This can be true even if in edit mode(isPlaying == false).
		!#zh 当前是否正在暂停 */
		isPaused: boolean;		
		/**
		!#en Play this animation.
		!#zh 播放动画。 
		*/
		play(): void;		
		/**
		!#en Stop this animation.
		!#zh 停止动画播放。 
		*/
		stop(): void;		
		/**
		!#en Pause this animation.
		!#zh 暂停动画。 
		*/
		pause(): void;		
		/**
		!#en Resume this animation.
		!#zh 重新播放动画。 
		*/
		resume(): void;		
		/**
		!#en Perform a single frame step.
		!#zh 执行一帧动画。 
		*/
		step(): void;	
	}	
	/** !#en Specifies how time is treated when it is outside of the keyframe range of an Animation.
	!#zh 动画使用的循环模式。 */
	export enum WrapMode {		
		Default = 0,
		Normal = 0,
		Reverse = 0,
		Loop = 0,
		LoopReverse = 0,
		PingPong = 0,
		PingPongReverse = 0,	
	}	
	/** cc.TMXLayerInfo contains the information about the layers like:
	- Layer name
	- Layer size
	- Layer opacity at creation time (it can be modified at runtime)
	- Whether the layer is visible (if it's not visible, then the CocosNode won't be created)
	This information is obtained from the TMX file. */
	export class TMXLayerInfo {		
		/** Properties of the layer info. */
		properties: any;	
	}	
	/** cc.TMXImageLayerInfo contains the information about the image layers.
	This information is obtained from the TMX file. */
	export class TMXImageLayerInfo {	
	}	
	/** <p>cc.TMXObjectGroupInfo contains the information about the object group like:
	- group name
	- group size
	- group opacity at creation time (it can be modified at runtime)
	- Whether the group is visible
	
	This information is obtained from the TMX file.</p> */
	export class TMXObjectGroupInfo {		
		/** Properties of the ObjectGroup info. */
		properties: any[];	
	}	
	/** <p>cc.TMXTilesetInfo contains the information about the tilesets like: <br />
	- Tileset name<br />
	- Tileset spacing<br />
	- Tileset margin<br />
	- size of the tiles<br />
	- Image used for the tiles<br />
	- Image size<br />
	
	This information is obtained from the TMX file. </p> */
	export class TMXTilesetInfo {		
		/** Tileset name */
		name: string;		
		/** First grid */
		firstGid: number;		
		/** Spacing */
		spacing: number;		
		/** Margin */
		margin: number;		
		/** Texture containing the tiles (should be sprite sheet / texture atlas) */
		sourceImage: any;		
		/** Size in pixels of the image */
		imageSize: Size;	
	}	
	/** <p>cc.TMXMapInfo contains the information about the map like: <br/>
	- Map orientation (hexagonal, isometric or orthogonal)<br/>
	- Tile size<br/>
	- Map size</p>
	
	<p>And it also contains: <br/>
	- Layers (an array of TMXLayerInfo objects)<br/>
	- Tilesets (an array of TMXTilesetInfo objects) <br/>
	- ObjectGroups (an array of TMXObjectGroupInfo objects) </p>
	
	<p>This information is obtained from the TMX file. </p> */
	export class TMXMapInfo {		
		/** Properties of the map info. */
		properties: any[];		
		/** Map orientation. */
		orientation: number;		
		/** Parent element. */
		parentElement: any;		
		/** Parent GID. */
		parentGID: number;		
		/** Layer attributes. */
		layerAttrs: any;		
		/** Is reading storing characters stream. */
		storingCharacters: boolean;		
		/** Current string stored from characters stream. */
		currentString: string;		
		/** Width of the map */
		mapWidth: number;		
		/** Height of the map */
		mapHeight: number;		
		/** Width of a tile */
		tileWidth: number;		
		/** Height of a tile */
		tileHeight: number;		
		static ATTRIB_NONE: number;		
		static ATTRIB_BASE64: number;		
		static ATTRIB_GZIP: number;		
		static ATTRIB_ZLIB: number;	
	}	
	/** !#en Render the TMX layer.
	!#zh 渲染 TMX layer。 */
	export class TiledLayer extends Component {		
		/**
		!#en enable or disable culling
		!#zh 开启或关闭裁剪。
		@param value value 
		*/
		enableCulling(value: any): void;		
		/**
		!#en Adds user's node into layer.
		!#zh 添加用户节点。
		@param node node 
		*/
		addUserNode(node: Node): boolean;		
		/**
		!#en Removes user's node.
		!#zh 移除用户节点。
		@param node node 
		*/
		removeUserNode(node: Node): boolean;		
		/**
		!#en Destroy user's node.
		!#zh 销毁用户节点。
		@param node node 
		*/
		destroyUserNode(node: Node): void;		
		/**
		!#en Gets the layer name.
		!#zh 获取层的名称。
		
		@example 
		```js
		let layerName = tiledLayer.getLayerName();
		cc.log(layerName);
		``` 
		*/
		getLayerName(): string;		
		/**
		!#en Set the layer name.
		!#zh 设置层的名称
		@param layerName layerName
		
		@example 
		```js
		tiledLayer.setLayerName("New Layer");
		``` 
		*/
		SetLayerName(layerName: string): void;		
		/**
		!#en Return the value for the specific property name.
		!#zh 获取指定属性名的值。
		@param propertyName propertyName
		
		@example 
		```js
		let property = tiledLayer.getProperty("info");
		cc.log(property);
		``` 
		*/
		getProperty(propertyName: string): any;		
		/**
		!#en Returns the position in pixels of a given tile coordinate.
		!#zh 获取指定 tile 的像素坐标。
		@param pos position or x
		@param y y
		
		@example 
		```js
		let pos = tiledLayer.getPositionAt(cc.v2(0, 0));
		cc.log("Pos: " + pos);
		let pos = tiledLayer.getPositionAt(0, 0);
		cc.log("Pos: " + pos);
		``` 
		*/
		getPositionAt(pos: Vec2|number, y?: number): Vec2;		
		/**
		!#en
		Sets the tile gid (gid = tile global id) at a given tile coordinate.<br />
		The Tile GID can be obtained by using the method "tileGIDAt" or by using the TMX editor . Tileset Mgr +1.<br />
		If a tile is already placed at that position, then it will be removed.
		!#zh
		设置给定坐标的 tile 的 gid (gid = tile 全局 id)，
		tile 的 GID 可以使用方法 “tileGIDAt” 来获得。<br />
		如果一个 tile 已经放在那个位置，那么它将被删除。
		@param gid gid
		@param posOrX position or x
		@param flagsOrY flags or y
		@param flags flags
		
		@example 
		```js
		tiledLayer.setTileGIDAt(1001, 10, 10, 1)
		``` 
		*/
		setTileGIDAt(gid: number, posOrX: Vec2|number, flagsOrY: number, flags?: number): void;		
		/**
		!#en
		Returns the tile gid at a given tile coordinate. <br />
		if it returns 0, it means that the tile is empty. <br />
		!#zh
		通过给定的 tile 坐标、flags（可选）返回 tile 的 GID. <br />
		如果它返回 0，则表示该 tile 为空。<br />
		@param pos or x
		@param y y
		
		@example 
		```js
		let tileGid = tiledLayer.getTileGIDAt(0, 0);
		``` 
		*/
		getTileGIDAt(pos: Vec2|number, y?: number): number;		
		/**
		!#en Layer orientation, which is the same as the map orientation.
		!#zh 获取 Layer 方向(同地图方向)。
		
		@example 
		```js
		let orientation = tiledLayer.getLayerOrientation();
		cc.log("Layer Orientation: " + orientation);
		``` 
		*/
		getLayerOrientation(): number;		
		/**
		!#en properties from the layer. They can be added using Tiled.
		!#zh 获取 layer 的属性，可以使用 Tiled 编辑器添加属性。
		
		@example 
		```js
		let properties = tiledLayer.getProperties();
		cc.log("Properties: " + properties);
		``` 
		*/
		getProperties(): any;		
		/**
		!#en
		Get the TiledTile with the tile coordinate.<br/>
		If there is no tile in the specified coordinate and forceCreate parameter is true, <br/>
		then will create a new TiledTile at the coordinate.
		The renderer will render the tile with the rotation, scale, position and color property of the TiledTile.
		!#zh
		通过指定的 tile 坐标获取对应的 TiledTile。 <br/>
		如果指定的坐标没有 tile，并且设置了 forceCreate 那么将会在指定的坐标创建一个新的 TiledTile 。<br/>
		在渲染这个 tile 的时候，将会使用 TiledTile 的节点的旋转、缩放、位移、颜色属性。<br/>
		@param x x
		@param y y
		@param forceCreate forceCreate
		
		@example 
		```js
		let tile = tiledLayer.getTiledTileAt(100, 100, true);
		cc.log(tile);
		``` 
		*/
		getTiledTileAt(x: number, y: number, forceCreate: boolean): TiledTile;		
		/**
		!#en
		Change tile to TiledTile at the specified coordinate.
		!#zh
		将指定的 tile 坐标替换为指定的 TiledTile。
		@param x x
		@param y y
		@param tiledTile tiledTile 
		*/
		setTiledTileAt(x: number, y: number, tiledTile: TiledTile): TiledTile;		
		/**
		!#en Return texture.
		!#zh 获取纹理。
		@param index The index of textures 
		*/
		getTexture(index: any): Texture2D;		
		/**
		!#en Return texture.
		!#zh 获取纹理。 
		*/
		getTextures(): Texture2D;		
		/**
		!#en Set the texture.
		!#zh 设置纹理。
		@param texture texture 
		*/
		setTexture(texture: Texture2D): void;		
		/**
		!#en Set the texture.
		!#zh 设置纹理。
		@param textures textures 
		*/
		setTexture(textures: Texture2D): void;		
		/**
		!#en Gets layer size.
		!#zh 获得层大小。
		
		@example 
		```js
		let size = tiledLayer.getLayerSize();
		cc.log("layer size: " + size);
		``` 
		*/
		getLayerSize(): Size;		
		/**
		!#en Size of the map's tile (could be different from the tile's size).
		!#zh 获取 tile 的大小( tile 的大小可能会有所不同)。
		
		@example 
		```js
		let mapTileSize = tiledLayer.getMapTileSize();
		cc.log("MapTile size: " + mapTileSize);
		``` 
		*/
		getMapTileSize(): Size;		
		/**
		!#en Gets Tile set first information for the layer.
		!#zh 获取 layer 索引位置为0的 Tileset 信息。
		@param index The index of tilesets 
		*/
		getTileSet(index: any): TMXTilesetInfo;		
		/**
		!#en Gets tile set all information for the layer.
		!#zh 获取 layer 所有的 Tileset 信息。 
		*/
		getTileSet(): TMXTilesetInfo;		
		/**
		!#en Sets tile set information for the layer.
		!#zh 设置 layer 的 tileset 信息。
		@param tileset tileset 
		*/
		setTileSet(tileset: TMXTilesetInfo): void;		
		/**
		!#en Sets Tile set information for the layer.
		!#zh 设置 layer 的 Tileset 信息。
		@param tilesets tilesets 
		*/
		setTileSets(tilesets: TMXTilesetInfo): void;	
	}	
	/** !#en Renders a TMX Tile Map in the scene.
	!#zh 在场景中渲染一个 tmx 格式的 Tile Map。 */
	export class TiledMap extends Component {		
		/** !#en The TiledMap Asset.
		!#zh TiledMap 资源。 */
		tmxAsset: TiledMapAsset;		
		/**
		!#en Gets the map size.
		!#zh 获取地图大小。
		
		@example 
		```js
		let mapSize = tiledMap.getMapSize();
		cc.log("Map Size: " + mapSize);
		``` 
		*/
		getMapSize(): Size;		
		/**
		!#en Gets the tile size.
		!#zh 获取地图背景中 tile 元素的大小。
		
		@example 
		```js
		let tileSize = tiledMap.getTileSize();
		cc.log("Tile Size: " + tileSize);
		``` 
		*/
		getTileSize(): Size;		
		/**
		!#en map orientation.
		!#zh 获取地图方向。
		
		@example 
		```js
		let mapOrientation = tiledMap.getMapOrientation();
		cc.log("Map Orientation: " + mapOrientation);
		``` 
		*/
		getMapOrientation(): number;		
		/**
		!#en object groups.
		!#zh 获取所有的对象层。
		
		@example 
		```js
		let objGroups = titledMap.getObjectGroups();
		for (let i = 0; i < objGroups.length; ++i) {
		    cc.log("obj: " + objGroups[i]);
		}
		``` 
		*/
		getObjectGroups(): TiledObjectGroup[];		
		/**
		!#en Return the TMXObjectGroup for the specific group.
		!#zh 获取指定的 TMXObjectGroup。
		@param groupName groupName
		
		@example 
		```js
		let group = titledMap.getObjectGroup("Players");
		cc.log("ObjectGroup: " + group);
		``` 
		*/
		getObjectGroup(groupName: string): TiledObjectGroup;		
		/**
		!#en enable or disable culling
		!#zh 开启或关闭裁剪。
		@param value value 
		*/
		enableCulling(value: any): void;		
		/**
		!#en Gets the map properties.
		!#zh 获取地图的属性。
		
		@example 
		```js
		let properties = titledMap.getProperties();
		for (let i = 0; i < properties.length; ++i) {
		    cc.log("Properties: " + properties[i]);
		}
		``` 
		*/
		getProperties(): any[];		
		/**
		!#en Return All layers array.
		!#zh 返回包含所有 layer 的数组。
		
		@example 
		```js
		let layers = titledMap.getLayers();
		for (let i = 0; i < layers.length; ++i) {
		    cc.log("Layers: " + layers[i]);
		}
		``` 
		*/
		getLayers(): TiledLayer[];		
		/**
		!#en return the cc.TiledLayer for the specific layer.
		!#zh 获取指定名称的 layer。
		@param layerName layerName
		
		@example 
		```js
		let layer = titledMap.getLayer("Player");
		cc.log(layer);
		``` 
		*/
		getLayer(layerName: string): TiledLayer;		
		/**
		!#en Return the value for the specific property name.
		!#zh 通过属性名称，获取指定的属性。
		@param propertyName propertyName
		
		@example 
		```js
		let property = titledMap.getProperty("info");
		cc.log("Property: " + property);
		``` 
		*/
		getProperty(propertyName: string): string;		
		/**
		!#en Return properties dictionary for tile GID.
		!#zh 通过 GID ，获取指定的属性。
		@param GID GID
		
		@example 
		```js
		let properties = titledMap.getPropertiesForGID(GID);
		cc.log("Properties: " + properties);
		``` 
		*/
		getPropertiesForGID(GID: number): any;	
	}	
	/** !#en Renders the TMX object group.
	!#zh 渲染 tmx object group。 */
	export class TiledObjectGroup extends Component {		
		/**
		!#en Offset position of child objects.
		!#zh 获取子对象的偏移位置。
		
		@example 
		```js
		let offset = tMXObjectGroup.getPositionOffset();
		``` 
		*/
		getPositionOffset(): Vec2;		
		/**
		!#en List of properties stored in a dictionary.
		!#zh 以映射的形式获取属性列表。
		
		@example 
		```js
		let offset = tMXObjectGroup.getProperties();
		``` 
		*/
		getProperties(): any;		
		/**
		!#en Gets the Group name.
		!#zh 获取组名称。
		
		@example 
		```js
		let groupName = tMXObjectGroup.getGroupName;
		``` 
		*/
		getGroupName(): string;		
		/**
		!#en
		Return the object for the specific object name. <br />
		It will return the 1st object found on the array for the given name.
		!#zh 获取指定的对象。
		@param objectName objectName
		
		@example 
		```js
		let object = tMXObjectGroup.getObject("Group");
		``` 
		*/
		getObject(objectName: string): any;		
		/**
		!#en Gets the objects.
		!#zh 获取对象数组。
		
		@example 
		```js
		let objects = tMXObjectGroup.getObjects();
		``` 
		*/
		getObjects(): any[];	
	}	
	/** Class for tiled map asset handling. */
	export class TiledMapAsset extends Asset {		
		textures: Texture2D[];		
		textureNames: string[];		
		textureSizes: Size[];		
		imageLayerTextures: Texture2D[];		
		imageLayerTextureNames: string[];	
	}	
	/** !#en TiledTile can control the specified map tile.
	It will apply the node rotation, scale, translate to the map tile.
	You can change the TiledTile's gid to change the map tile's style.
	!#zh TiledTile 可以单独对某一个地图块进行操作。
	他会将节点的旋转，缩放，平移操作应用在这个地图块上，并可以通过更换当前地图块的 gid 来更换地图块的显示样式。 */
	export class TiledTile extends Component {		
		/** !#en Specify the TiledTile horizontal coordinate，use map tile as the unit.
		!#zh 指定 TiledTile 的横向坐标，以地图块为单位 */
		x: number;		
		/** !#en Specify the TiledTile vertical coordinate，use map tile as the unit.
		!#zh 指定 TiledTile 的纵向坐标，以地图块为单位 */
		y: number;		
		/** !#en Specify the TiledTile gid.
		!#zh 指定 TiledTile 的 gid 值 */
		gid: number;	
	}	
	/** !#en cc.audioEngine is the singleton object, it provide simple audio APIs.
	!#zh
	cc.audioengine是单例对象。<br/>
	主要用来播放音频，播放的时候会返回一个 audioID，之后都可以通过这个 audioID 来操作这个音频对象。<br/>
	不使用的时候，请使用 cc.audioEngine.uncache(filePath); 进行资源释放 <br/>
	注意：<br/>
	在 Android 系统浏览器上，不同浏览器，不同版本的效果不尽相同。<br/>
	比如说：大多数浏览器都需要用户物理交互才可以开始播放音效，有一些不支持 WebAudio，<br/>
	有一些不支持多音轨播放。总之如果对音乐依赖比较强，请做尽可能多的测试。 */
	export class audioEngine {		
		/**
		!#en Play audio.
		!#zh 播放音频
		@param clip The audio clip to play.
		@param loop Whether the music loop or not.
		@param volume Volume size.
		
		@example 
		```js
		cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
		    var audioID = cc.audioEngine.play(clip, false, 0.5);
		});
		``` 
		*/
		static play(clip: AudioClip, loop: boolean, volume: number): number;		
		/**
		!#en Set audio loop.
		!#zh 设置音频是否循环。
		@param audioID audio id.
		@param loop Whether cycle.
		
		@example 
		```js
		cc.audioEngine.setLoop(id, true);
		``` 
		*/
		static setLoop(audioID: number, loop: boolean): void;		
		/**
		!#en Get audio cycle state.
		!#zh 获取音频的循环状态。
		@param audioID audio id.
		
		@example 
		```js
		cc.audioEngine.isLoop(id);
		``` 
		*/
		static isLoop(audioID: number): boolean;		
		/**
		!#en Set the volume of audio.
		!#zh 设置音量（0.0 ~ 1.0）。
		@param audioID audio id.
		@param volume Volume must be in 0.0~1.0 .
		
		@example 
		```js
		cc.audioEngine.setVolume(id, 0.5);
		``` 
		*/
		static setVolume(audioID: number, volume: number): void;		
		/**
		!#en The volume of the music max value is 1.0,the min value is 0.0 .
		!#zh 获取音量（0.0 ~ 1.0）。
		@param audioID audio id.
		
		@example 
		```js
		var volume = cc.audioEngine.getVolume(id);
		``` 
		*/
		static getVolume(audioID: number): number;		
		/**
		!#en Set current time
		!#zh 设置当前的音频时间。
		@param audioID audio id.
		@param sec current time.
		
		@example 
		```js
		cc.audioEngine.setCurrentTime(id, 2);
		``` 
		*/
		static setCurrentTime(audioID: number, sec: number): boolean;		
		/**
		!#en Get current time
		!#zh 获取当前的音频播放时间。
		@param audioID audio id.
		
		@example 
		```js
		var time = cc.audioEngine.getCurrentTime(id);
		``` 
		*/
		static getCurrentTime(audioID: number): number;		
		/**
		!#en Get audio duration
		!#zh 获取音频总时长。
		@param audioID audio id.
		
		@example 
		```js
		var time = cc.audioEngine.getDuration(id);
		``` 
		*/
		static getDuration(audioID: number): number;		
		/**
		!#en Get audio state
		!#zh 获取音频状态。
		@param audioID audio id.
		
		@example 
		```js
		var state = cc.audioEngine.getState(id);
		``` 
		*/
		static getState(audioID: number): audioEngine.AudioState;		
		/**
		!#en Set Audio finish callback
		!#zh 设置一个音频结束后的回调
		@param audioID audio id.
		@param callback loaded callback.
		
		@example 
		```js
		cc.audioEngine.setFinishCallback(id, function () {});
		``` 
		*/
		static setFinishCallback(audioID: number, callback: Function): void;		
		/**
		!#en Pause playing audio.
		!#zh 暂停正在播放音频。
		@param audioID The return value of function play.
		
		@example 
		```js
		cc.audioEngine.pause(audioID);
		``` 
		*/
		static pause(audioID: number): void;		
		/**
		!#en Pause all playing audio
		!#zh 暂停现在正在播放的所有音频。
		
		@example 
		```js
		cc.audioEngine.pauseAll();
		``` 
		*/
		static pauseAll(): void;		
		/**
		!#en Resume playing audio.
		!#zh 恢复播放指定的音频。
		@param audioID The return value of function play.
		
		@example 
		```js
		cc.audioEngine.resume(audioID);
		``` 
		*/
		static resume(audioID: number): void;		
		/**
		!#en Resume all playing audio.
		!#zh 恢复播放所有之前暂停的所有音频。
		
		@example 
		```js
		cc.audioEngine.resumeAll();
		``` 
		*/
		static resumeAll(): void;		
		/**
		!#en Stop playing audio.
		!#zh 停止播放指定音频。
		@param audioID The return value of function play.
		
		@example 
		```js
		cc.audioEngine.stop(audioID);
		``` 
		*/
		static stop(audioID: number): void;		
		/**
		!#en Stop all playing audio.
		!#zh 停止正在播放的所有音频。
		
		@example 
		```js
		cc.audioEngine.stopAll();
		``` 
		*/
		static stopAll(): void;		
		/**
		!#en Set up an audio can generate a few examples.
		!#zh 设置一个音频可以设置几个实例
		@param num a number of instances to be created from within an audio
		
		@example 
		```js
		cc.audioEngine.setMaxAudioInstance(20);
		``` 
		*/
		static setMaxAudioInstance(num: number): void;		
		/**
		!#en Getting audio can produce several examples.
		!#zh 获取一个音频可以设置几个实例
		
		@example 
		```js
		cc.audioEngine.getMaxAudioInstance();
		``` 
		*/
		static getMaxAudioInstance(): number;		
		/**
		!#en Unload the preloaded audio from internal buffer.
		!#zh 卸载预加载的音频。
		@param clip clip
		
		@example 
		```js
		cc.audioEngine.uncache(filePath);
		``` 
		*/
		static uncache(clip: AudioClip): void;		
		/**
		!#en Unload all audio from internal buffer.
		!#zh 卸载所有音频。
		
		@example 
		```js
		cc.audioEngine.uncacheAll();
		``` 
		*/
		static uncacheAll(): void;		
		/**
		!#en Preload audio file.
		!#zh 预加载一个音频
		@param filePath The file path of an audio.
		@param callback The callback of an audio.
		
		@example 
		```js
		cc.audioEngine.preload(path);
		``` 
		*/
		static preload(filePath: string, callback?: Function): void;		
		/**
		!#en Set a size, the unit is KB. Over this size is directly resolved into DOM nodes.
		!#zh 设置一个以 KB 为单位的尺寸，大于这个尺寸的音频在加载的时候会强制使用 dom 方式加载
		@param kb The file path of an audio.
		
		@example 
		```js
		cc.audioEngine.setMaxWebAudioSize(300);
		``` 
		*/
		static setMaxWebAudioSize(kb: number): void;		
		/**
		!#en Play background music
		!#zh 播放背景音乐
		@param clip The audio clip to play.
		@param loop Whether the music loop or not.
		
		@example 
		```js
		cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
		    var audioID = cc.audioEngine.playMusic(clip, false);
		});
		``` 
		*/
		static playMusic(clip: AudioClip, loop: boolean): number;		
		/**
		!#en Stop background music.
		!#zh 停止播放背景音乐。
		
		@example 
		```js
		cc.audioEngine.stopMusic();
		``` 
		*/
		static stopMusic(): void;		
		/**
		!#en Pause the background music.
		!#zh 暂停播放背景音乐。
		
		@example 
		```js
		cc.audioEngine.pauseMusic();
		``` 
		*/
		static pauseMusic(): void;		
		/**
		!#en Resume playing background music.
		!#zh 恢复播放背景音乐。
		
		@example 
		```js
		cc.audioEngine.resumeMusic();
		``` 
		*/
		static resumeMusic(): void;		
		/**
		!#en Get the volume(0.0 ~ 1.0).
		!#zh 获取音量（0.0 ~ 1.0）。
		
		@example 
		```js
		var volume = cc.audioEngine.getMusicVolume();
		``` 
		*/
		static getMusicVolume(): number;		
		/**
		!#en Set the background music volume.
		!#zh 设置背景音乐音量（0.0 ~ 1.0）。
		@param volume Volume must be in 0.0~1.0.
		
		@example 
		```js
		cc.audioEngine.setMusicVolume(0.5);
		``` 
		*/
		static setMusicVolume(volume: number): void;		
		/**
		!#en Background music playing state
		!#zh 背景音乐是否正在播放
		
		@example 
		```js
		cc.audioEngine.isMusicPlaying();
		``` 
		*/
		static isMusicPlaying(): boolean;		
		/**
		!#en Play effect audio.
		!#zh 播放音效
		@param clip The audio clip to play.
		@param loop Whether the music loop or not.
		
		@example 
		```js
		cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
		    var audioID = cc.audioEngine.playEffect(clip, false);
		});
		``` 
		*/
		static playEffect(clip: AudioClip, loop: boolean): number;		
		/**
		!#en Set the volume of effect audio.
		!#zh 设置音效音量（0.0 ~ 1.0）。
		@param volume Volume must be in 0.0~1.0.
		
		@example 
		```js
		cc.audioEngine.setEffectsVolume(0.5);
		``` 
		*/
		static setEffectsVolume(volume: number): void;		
		/**
		!#en The volume of the effect audio max value is 1.0,the min value is 0.0 .
		!#zh 获取音效音量（0.0 ~ 1.0）。
		
		@example 
		```js
		var volume = cc.audioEngine.getEffectsVolume();
		``` 
		*/
		static getEffectsVolume(): number;		
		/**
		!#en Pause effect audio.
		!#zh 暂停播放音效。
		@param audioID audio id.
		
		@example 
		```js
		cc.audioEngine.pauseEffect(audioID);
		``` 
		*/
		static pauseEffect(audioID: number): void;		
		/**
		!#en Stop playing all the sound effects.
		!#zh 暂停播放所有音效。
		
		@example 
		```js
		cc.audioEngine.pauseAllEffects();
		``` 
		*/
		static pauseAllEffects(): void;		
		/**
		!#en Resume effect audio.
		!#zh 恢复播放音效音频。
		@param audioID The return value of function play.
		
		@example 
		```js
		cc.audioEngine.resumeEffect(audioID);
		``` 
		*/
		static resumeEffect(audioID: number): void;		
		/**
		!#en Resume all effect audio.
		!#zh 恢复播放所有之前暂停的音效。
		
		@example 
		```js
		cc.audioEngine.resumeAllEffects();
		``` 
		*/
		static resumeAllEffects(): void;		
		/**
		!#en Stop playing the effect audio.
		!#zh 停止播放音效。
		@param audioID audio id.
		
		@example 
		```js
		cc.audioEngine.stopEffect(id);
		``` 
		*/
		static stopEffect(audioID: number): void;		
		/**
		!#en Stop playing all the effects.
		!#zh 停止播放所有音效。
		
		@example 
		```js
		cc.audioEngine.stopAllEffects();
		``` 
		*/
		static stopAllEffects(): void;	
	}	
	/** !#en An object to boot the game.
	!#zh 包含游戏主体信息并负责驱动游戏的游戏对象。 */
	export class debug {		
		/**
		!#en Gets error message with the error id and possible parameters.
		!#zh 通过 error id 和必要的参数来获取错误信息。
		@param errorId errorId
		@param param param 
		*/
		static getError(errorId: string, param?: any): string;		
		/**
		!#en Returns whether or not to display the FPS informations.
		!#zh 是否显示 FPS 信息。 
		*/
		static isDisplayStats(): boolean;		
		/**
		!#en Sets whether display the FPS on the bottom-left corner.
		!#zh 设置是否在左下角显示 FPS。
		@param displayStats displayStats 
		*/
		static setDisplayStats(displayStats: boolean): void;	
	}	
	/** !#en
	<p>
	   ATTENTION: USE cc.director INSTEAD OF cc.Director.<br/>
	   cc.director is a singleton object which manage your game's logic flow.<br/>
	   Since the cc.director is a singleton, you don't need to call any constructor or create functions,<br/>
	   the standard way to use it is by calling:<br/>
	     - cc.director.methodName(); <br/>
	
	   It creates and handle the main Window and manages how and when to execute the Scenes.<br/>
	   <br/>
	   The cc.director is also responsible for:<br/>
	     - initializing the OpenGL context<br/>
	     - setting the OpenGL pixel format (default on is RGB565)<br/>
	     - setting the OpenGL buffer depth (default on is 0-bit)<br/>
	     - setting the color for clear screen (default one is BLACK)<br/>
	     - setting the projection (default one is 3D)<br/>
	     - setting the orientation (default one is Portrait)<br/>
	     <br/>
	   <br/>
	   The cc.director also sets the default OpenGL context:<br/>
	     - GL_TEXTURE_2D is enabled<br/>
	     - GL_VERTEX_ARRAY is enabled<br/>
	     - GL_COLOR_ARRAY is enabled<br/>
	     - GL_TEXTURE_COORD_ARRAY is enabled<br/>
	</p>
	<p>
	  cc.director also synchronizes timers with the refresh rate of the display.<br/>
	  Features and Limitations:<br/>
	     - Scheduled timers & drawing are synchronizes with the refresh rate of the display<br/>
	     - Only supports animation intervals of 1/60 1/30 & 1/15<br/>
	</p>
	
	!#zh
	<p>
	    注意：用 cc.director 代替 cc.Director。<br/>
	    cc.director 一个管理你的游戏的逻辑流程的单例对象。<br/>
	    由于 cc.director 是一个单例，你不需要调用任何构造函数或创建函数，<br/>
	    使用它的标准方法是通过调用：<br/>
	      - cc.director.methodName();
	    <br/>
	    它创建和处理主窗口并且管理什么时候执行场景。<br/>
	    <br/>
	    cc.director 还负责：<br/>
	     - 初始化 OpenGL 环境。<br/>
	     - 设置OpenGL像素格式。(默认是 RGB565)<br/>
	     - 设置OpenGL缓冲区深度 (默认是 0-bit)<br/>
	     - 设置空白场景的颜色 (默认是 黑色)<br/>
	     - 设置投影 (默认是 3D)<br/>
	     - 设置方向 (默认是 Portrait)<br/>
	   <br/>
	   cc.director 设置了 OpenGL 默认环境 <br/>
	     - GL_TEXTURE_2D   启用。<br/>
	     - GL_VERTEX_ARRAY 启用。<br/>
	     - GL_COLOR_ARRAY  启用。<br/>
	     - GL_TEXTURE_COORD_ARRAY 启用。<br/>
	</p>
	<p>
	  cc.director 也同步定时器与显示器的刷新速率。
	  <br/>
	  特点和局限性: <br/>
	     - 将计时器 & 渲染与显示器的刷新频率同步。<br/>
	     - 只支持动画的间隔 1/60 1/30 & 1/15。<br/>
	</p> */
	export class Director extends EventTarget {		
		/**
		!#en
		Converts a view coordinate to an WebGL coordinate<br/>
		Useful to convert (multi) touches coordinates to the current layout (portrait or landscape)<br/>
		Implementation can be found in CCDirectorWebGL.
		!#zh 将触摸点的屏幕坐标转换为 WebGL View 下的坐标。
		@param uiPoint uiPoint 
		*/
		convertToGL(uiPoint: Vec2): Vec2;		
		/**
		!#en
		Converts an OpenGL coordinate to a view coordinate<br/>
		Useful to convert node points to window points for calls such as glScissor<br/>
		Implementation can be found in CCDirectorWebGL.
		!#zh 将触摸点的 WebGL View 坐标转换为屏幕坐标。
		@param glPoint glPoint 
		*/
		convertToUI(glPoint: Vec2): Vec2;		
		/**
		End the life of director in the next frame 
		*/
		end(): void;		
		/**
		!#en
		Returns the size of the WebGL view in points.<br/>
		It takes into account any possible rotation (device orientation) of the window.
		!#zh 获取视图的大小，以点为单位。 
		*/
		getWinSize(): Size;		
		/**
		!#en
		Returns the size of the OpenGL view in pixels.<br/>
		It takes into account any possible rotation (device orientation) of the window.<br/>
		On Mac winSize and winSizeInPixels return the same value.
		(The pixel here refers to the resource resolution. If you want to get the physics resolution of device, you need to use cc.view.getFrameSize())
		!#zh
		获取视图大小，以像素为单位（这里的像素指的是资源分辨率。
		如果要获取屏幕物理分辨率，需要用 cc.view.getFrameSize()） 
		*/
		getWinSizeInPixels(): Size;		
		/**
		!#en Pause the director's ticker, only involve the game logic execution.
		It won't pause the rendering process nor the event manager.
		If you want to pause the entier game including rendering, audio and event,
		please use {{#crossLink "Game.pause"}}cc.game.pause{{/crossLink}}
		!#zh 暂停正在运行的场景，该暂停只会停止游戏逻辑执行，但是不会停止渲染和 UI 响应。
		如果想要更彻底得暂停游戏，包含渲染，音频和事件，请使用 {{#crossLink "Game.pause"}}cc.game.pause{{/crossLink}}。 
		*/
		pause(): void;		
		/**
		!#en
		Run a scene. Replaces the running scene with a new one or enter the first scene.<br/>
		The new scene will be launched immediately.
		!#zh 立刻切换指定场景。
		@param scene The need run scene.
		@param onBeforeLoadScene The function invoked at the scene before loading.
		@param onLaunched The function invoked at the scene after launch. 
		*/
		runSceneImmediate(scene: Scene, onBeforeLoadScene?: Function, onLaunched?: Function): void;		
		/**
		!#en Loads the scene by its name.
		!#zh 通过场景名称进行加载场景。
		@param sceneName The name of the scene to load.
		@param onLaunched callback, will be called after scene launched. 
		*/
		loadScene(sceneName: string, onLaunched?: Function): boolean;		
		/**
		!#en
		Preloads the scene to reduces loading time. You can call this method at any time you want.
		After calling this method, you still need to launch the scene by `cc.director.loadScene`.
		It will be totally fine to call `cc.director.loadScene` at any time even if the preloading is not
		yet finished, the scene will be launched after loaded automatically.
		!#zh 预加载场景，你可以在任何时候调用这个方法。
		调用完后，你仍然需要通过 `cc.director.loadScene` 来启动场景，因为这个方法不会执行场景加载操作。
		就算预加载还没完成，你也可以直接调用 `cc.director.loadScene`，加载完成后场景就会启动。
		@param sceneName The name of the scene to preload.
		@param onProgress callback, will be called when the load progression change.
		@param onLoaded callback, will be called after scene loaded. 
		*/
		preloadScene(sceneName: string, onProgress?: (completedCount: number, totalCount: number, item: any) => void, onLoaded?: (error: Error, asset: SceneAsset) => void): void;		
		/**
		!#en Resume game logic execution after pause, if the current scene is not paused, nothing will happen.
		!#zh 恢复暂停场景的游戏逻辑，如果当前场景没有暂停将没任何事情发生。 
		*/
		resume(): void;		
		/**
		!#en
		Enables or disables WebGL depth test.<br/>
		Implementation can be found in CCDirectorCanvas.js/CCDirectorWebGL.js
		!#zh 启用/禁用深度测试（在 Canvas 渲染模式下不会生效）。
		@param on on 
		*/
		setDepthTest(on: boolean): void;		
		/**
		!#en
		Set color for clear screen.<br/>
		(Implementation can be found in CCDirectorCanvas.js/CCDirectorWebGL.js)
		!#zh
		设置场景的默认擦除颜色。<br/>
		支持全透明，但不支持透明度为中间值。要支持全透明需手工开启 cc.macro.ENABLE_TRANSPARENT_CANVAS。
		@param clearColor clearColor 
		*/
		setClearColor(clearColor: Color): void;		
		/**
		!#en Returns current logic Scene.
		!#zh 获取当前逻辑场景。
		
		@example 
		```js
		// This will help you to get the Canvas node in scene
		 cc.director.getScene().getChildByName('Canvas');
		``` 
		*/
		getScene(): Scene;		
		/**
		!#en Returns the FPS value. Please use {{#crossLink "Game.setFrameRate"}}cc.game.setFrameRate{{/crossLink}} to control animation interval.
		!#zh 获取单位帧执行时间。请使用 {{#crossLink "Game.setFrameRate"}}cc.game.setFrameRate{{/crossLink}} 来控制游戏帧率。 
		*/
		getAnimationInterval(): number;		
		/**
		Sets animation interval, this doesn't control the main loop.
		To control the game's frame rate overall, please use {{#crossLink "Game.setFrameRate"}}cc.game.setFrameRate{{/crossLink}}
		@param value The animation interval desired. 
		*/
		setAnimationInterval(value: number): void;		
		/**
		!#en Returns the delta time since last frame.
		!#zh 获取上一帧的增量时间。 
		*/
		getDeltaTime(): number;		
		/**
		!#en Returns the total passed time since game start, unit: ms
		!#zh 获取从游戏开始到现在总共经过的时间，单位为 ms 
		*/
		getTotalTime(): number;		
		/**
		!#en Returns how many frames were called since the director started.
		!#zh 获取 director 启动以来游戏运行的总帧数。 
		*/
		getTotalFrames(): number;		
		/**
		!#en Returns whether or not the Director is paused.
		!#zh 是否处于暂停状态。 
		*/
		isPaused(): boolean;		
		/**
		!#en Returns the cc.Scheduler associated with this director.
		!#zh 获取和 director 相关联的 cc.Scheduler。 
		*/
		getScheduler(): Scheduler;		
		/**
		!#en Sets the cc.Scheduler associated with this director.
		!#zh 设置和 director 相关联的 cc.Scheduler。
		@param scheduler scheduler 
		*/
		setScheduler(scheduler: Scheduler): void;		
		/**
		!#en Returns the cc.ActionManager associated with this director.
		!#zh 获取和 director 相关联的 cc.ActionManager（动作管理器）。 
		*/
		getActionManager(): ActionManager;		
		/**
		!#en Sets the cc.ActionManager associated with this director.
		!#zh 设置和 director 相关联的 cc.ActionManager（动作管理器）。
		@param actionManager actionManager 
		*/
		setActionManager(actionManager: ActionManager): void;		
		/**
		!#en Returns the cc.CollisionManager associated with this director.
		!#zh 获取和 director 相关联的 cc.CollisionManager （碰撞管理器）。 
		*/
		getCollisionManager(): CollisionManager;		
		/**
		!#en Returns the cc.PhysicsManager associated with this director.
		!#zh 返回与 director 相关联的 cc.PhysicsManager （物理管理器）。 
		*/
		getPhysicsManager(): PhysicsManager;		
		/**
		!#en Returns the cc.Physics3DManager associated with this director.
		!#zh 返回与 director 相关联的 cc.Physics3DManager （物理管理器）。 
		*/
		getPhysics3DManager(): Physics3DManager;		
		/** !#en The event projection changed of cc.Director. This event will not get triggered since v2.0
		!#zh cc.Director 投影变化的事件。从 v2.0 开始这个事件不会再被触发 */
		static EVENT_PROJECTION_CHANGED: string;		
		/** !#en The event which will be triggered before loading a new scene.
		!#zh 加载新场景之前所触发的事件。 */
		static EVENT_BEFORE_SCENE_LOADING: string;		
		/** !#en The event which will be triggered before launching a new scene.
		!#zh 运行新场景之前所触发的事件。 */
		static EVENT_BEFORE_SCENE_LAUNCH: string;		
		/** !#en The event which will be triggered after launching a new scene.
		!#zh 运行新场景之后所触发的事件。 */
		static EVENT_AFTER_SCENE_LAUNCH: string;		
		/** !#en The event which will be triggered at the beginning of every frame.
		!#zh 每个帧的开始时所触发的事件。 */
		static EVENT_BEFORE_UPDATE: string;		
		/** !#en The event which will be triggered after engine and components update logic.
		!#zh 将在引擎和组件 “update” 逻辑之后所触发的事件。 */
		static EVENT_AFTER_UPDATE: string;		
		/** !#en The event is deprecated since v2.0, please use cc.Director.EVENT_BEFORE_DRAW instead
		!#zh 这个事件从 v2.0 开始被废弃，请直接使用 cc.Director.EVENT_BEFORE_DRAW */
		static EVENT_BEFORE_VISIT: string;		
		/** !#en The event is deprecated since v2.0, please use cc.Director.EVENT_BEFORE_DRAW instead
		!#zh 这个事件从 v2.0 开始被废弃，请直接使用 cc.Director.EVENT_BEFORE_DRAW */
		static EVENT_AFTER_VISIT: string;		
		/** !#en The event which will be triggered before the rendering process.
		!#zh 渲染过程之前所触发的事件。 */
		static EVENT_BEFORE_DRAW: string;		
		/** !#en The event which will be triggered after the rendering process.
		!#zh 渲染过程之后所触发的事件。 */
		static EVENT_AFTER_DRAW: string;		
		/** Constant for 2D projection (orthogonal projection) */
		static PROJECTION_2D: number;		
		/** Constant for 3D projection with a fovy=60, znear=0.5f and zfar=1500. */
		static PROJECTION_3D: number;		
		/** Constant for custom projection, if cc.Director's projection set to it, it calls "updateProjection" on the projection delegate. */
		static PROJECTION_CUSTOM: number;		
		/** Constant for default projection of cc.Director, default projection is 2D projection */
		static PROJECTION_DEFAULT: number;	
	}	
	/** !#en An object to boot the game.
	!#zh 包含游戏主体信息并负责驱动游戏的游戏对象。 */
	export class Game extends EventTarget {		
		/** !#en Event triggered when game hide to background.
		Please note that this event is not 100% guaranteed to be fired on Web platform,
		on native platforms, it corresponds to enter background event, os status bar or notification center may not trigger this event.
		!#zh 游戏进入后台时触发的事件。
		请注意，在 WEB 平台，这个事件不一定会 100% 触发，这完全取决于浏览器的回调行为。
		在原生平台，它对应的是应用被切换到后台事件，下拉菜单和上拉状态栏等不一定会触发这个事件，这取决于系统行为。 */
		EVENT_HIDE: string;		
		/** !#en Event triggered when game back to foreground
		Please note that this event is not 100% guaranteed to be fired on Web platform,
		on native platforms, it corresponds to enter foreground event.
		!#zh 游戏进入前台运行时触发的事件。
		请注意，在 WEB 平台，这个事件不一定会 100% 触发，这完全取决于浏览器的回调行为。
		在原生平台，它对应的是应用被切换到前台事件。 */
		EVENT_SHOW: string;		
		/** !#en Event triggered when game restart
		!#zh 调用restart后，触发事件。 */
		EVENT_RESTART: string;		
		/** Event triggered after game inited, at this point all engine objects and game scripts are loaded */
		EVENT_GAME_INITED: string;		
		/** Event triggered after engine inited, at this point you will be able to use all engine classes.
		It was defined as EVENT_RENDERER_INITED in cocos creator v1.x and renamed in v2.0 */
		EVENT_ENGINE_INITED: string;		
		/** Web Canvas 2d API as renderer backend */
		RENDER_TYPE_CANVAS: number;		
		/** WebGL API as renderer backend */
		RENDER_TYPE_WEBGL: number;		
		/** OpenGL API as renderer backend */
		RENDER_TYPE_OPENGL: number;		
		/** !#en The outer frame of the game canvas, parent of game container.
		!#zh 游戏画布的外框，container 的父容器。 */
		frame: any;		
		/** !#en The container of game canvas.
		!#zh 游戏画布的容器。 */
		container: HTMLDivElement;		
		/** !#en The canvas of the game.
		!#zh 游戏的画布。 */
		canvas: HTMLCanvasElement;		
		/** !#en The renderer backend of the game.
		!#zh 游戏的渲染器类型。 */
		renderType: number;		
		/** !#en
		The current game configuration, including:<br/>
		1. debugMode<br/>
		     "debugMode" possible values :<br/>
		     0 - No message will be printed.                                                      <br/>
		     1 - cc.error, cc.assert, cc.warn, cc.log will print in console.                      <br/>
		     2 - cc.error, cc.assert, cc.warn will print in console.                              <br/>
		     3 - cc.error, cc.assert will print in console.                                       <br/>
		     4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.<br/>
		     5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.        <br/>
		     6 - cc.error, cc.assert will print on canvas, available only on web.                 <br/>
		2. showFPS<br/>
		     Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.<br/>
		3. exposeClassName<br/>
		     Expose class name to chrome debug tools, the class intantiate performance is a little bit slower when exposed.<br/>
		4. frameRate<br/>
		     "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.<br/>
		5. id<br/>
		     "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.<br/>
		6. renderMode<br/>
		     "renderMode" sets the renderer type, only useful on web :<br/>
		     0 - Automatically chosen by engine<br/>
		     1 - Forced to use canvas renderer<br/>
		     2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers<br/>
		7. scenes<br/>
		     "scenes" include available scenes in the current bundle.<br/>
		<br/>
		Please DO NOT modify this object directly, it won't have any effect.<br/>
		!#zh
		当前的游戏配置，包括：                                                                  <br/>
		1. debugMode（debug 模式，但是在浏览器中这个选项会被忽略）                                <br/>
		     "debugMode" 各种设置选项的意义。                                                   <br/>
		         0 - 没有消息被打印出来。                                                       <br/>
		         1 - cc.error，cc.assert，cc.warn，cc.log 将打印在 console 中。                  <br/>
		         2 - cc.error，cc.assert，cc.warn 将打印在 console 中。                          <br/>
		         3 - cc.error，cc.assert 将打印在 console 中。                                   <br/>
		         4 - cc.error，cc.assert，cc.warn，cc.log 将打印在 canvas 中（仅适用于 web 端）。 <br/>
		         5 - cc.error，cc.assert，cc.warn 将打印在 canvas 中（仅适用于 web 端）。         <br/>
		         6 - cc.error，cc.assert 将打印在 canvas 中（仅适用于 web 端）。                  <br/>
		2. showFPS（显示 FPS）                                                            <br/>
		     当 showFPS 为 true 的时候界面的左下角将显示 fps 的信息，否则被隐藏。              <br/>
		3. exposeClassName                                                           <br/>
		     暴露类名让 Chrome DevTools 可以识别，如果开启会稍稍降低类的创建过程的性能，但对对象构造没有影响。 <br/>
		4. frameRate (帧率)                                                              <br/>
		     “frameRate” 设置想要的帧率你的游戏，但真正的FPS取决于你的游戏实现和运行环境。      <br/>
		5. id                                                                            <br/>
		     "gameCanvas" Web 页面上的 Canvas Element ID，仅适用于 web 端。                         <br/>
		6. renderMode（渲染模式）                                                         <br/>
		     “renderMode” 设置渲染器类型，仅适用于 web 端：                              <br/>
		         0 - 通过引擎自动选择。                                                     <br/>
		         1 - 强制使用 canvas 渲染。
		         2 - 强制使用 WebGL 渲染，但是在部分 Android 浏览器中这个选项会被忽略。     <br/>
		7. scenes                                                                         <br/>
		     “scenes” 当前包中可用场景。                                                   <br/>
		<br/>
		注意：请不要直接修改这个对象，它不会有任何效果。 */
		config: any;		
		/**
		!#en Callback when the scripts of engine have been load.
		!#zh 当引擎完成启动后的回调函数。 
		*/
		onStart(): void;		
		/**
		!#en Set frame rate of game.
		!#zh 设置游戏帧率。
		@param frameRate frameRate 
		*/
		setFrameRate(frameRate: number): void;		
		/**
		!#en Get frame rate set for the game, it doesn't represent the real frame rate.
		!#zh 获取设置的游戏帧率（不等同于实际帧率）。 
		*/
		getFrameRate(): number;		
		/**
		!#en Run the game frame by frame.
		!#zh 执行一帧游戏循环。 
		*/
		step(): void;		
		/**
		!#en Pause the game main loop. This will pause:
		game logic execution, rendering process, event manager, background music and all audio effects.
		This is different with cc.director.pause which only pause the game logic execution.
		!#zh 暂停游戏主循环。包含：游戏逻辑，渲染，事件处理，背景音乐和所有音效。这点和只暂停游戏逻辑的 cc.director.pause 不同。 
		*/
		pause(): void;		
		/**
		!#en Resume the game from pause. This will resume:
		game logic execution, rendering process, event manager, background music and all audio effects.
		!#zh 恢复游戏主循环。包含：游戏逻辑，渲染，事件处理，背景音乐和所有音效。 
		*/
		resume(): void;		
		/**
		!#en Check whether the game is paused.
		!#zh 判断游戏是否暂停。 
		*/
		isPaused(): boolean;		
		/**
		!#en Restart game.
		!#zh 重新开始游戏 
		*/
		restart(): void;		
		/**
		!#en End game, it will close the game window
		!#zh 退出游戏 
		*/
		end(): void;		
		/**
		!#en
		Register an callback of a specific event type on the game object.
		This type of event should be triggered via `emit`.
		!#zh
		注册 game 的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null 
		*/
		on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T;		
		/**
		!#en
		Register an callback of a specific event type on the game object,
		the callback will remove itself after the first time it is triggered.
		!#zh
		注册 game 的特定事件类型回调，回调会在第一时间被触发后删除自身。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null 
		*/
		once(type: string, callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void, target?: any): void;		
		/**
		!#en Prepare game.
		!#zh 准备引擎，请不要直接调用这个函数。
		@param cb cb 
		*/
		prepare(cb: Function): void;		
		/**
		!#en Run game with configuration object and onStart function.
		!#zh 运行游戏，并且指定引擎配置和 onStart 的回调。
		@param config Pass configuration object or onStart function
		@param onStart function to be executed after game initialized 
		*/
		run(config: any, onStart: Function): void;		
		/**
		!#en
		Add a persistent root node to the game, the persistent node won't be destroyed during scene transition.<br/>
		The target node must be placed in the root level of hierarchy, otherwise this API won't have any effect.
		!#zh
		声明常驻根节点，该节点不会被在场景切换中被销毁。<br/>
		目标节点必须位于为层级的根节点，否则无效。
		@param node The node to be made persistent 
		*/
		addPersistRootNode(node: Node): void;		
		/**
		!#en Remove a persistent root node.
		!#zh 取消常驻根节点。
		@param node The node to be removed from persistent node list 
		*/
		removePersistRootNode(node: Node): void;		
		/**
		!#en Check whether the node is a persistent root node.
		!#zh 检查节点是否是常驻根节点。
		@param node The node to be checked 
		*/
		isPersistRootNode(node: Node): boolean;	
	}	
	/** !#en
	Class of all entities in Cocos Creator scenes.<br/>
	For events supported by Node, please refer to {{#crossLink "Node.EventType"}}{{/crossLink}}
	!#zh
	Cocos Creator 场景中的所有节点类。<br/>
	支持的节点事件，请参阅 {{#crossLink "Node.EventType"}}{{/crossLink}}。 */
	export class Node extends _BaseNode {		
		/** !#en
		Group index of node.<br/>
		Which Group this node belongs to will resolve that this node's collision components can collide with which other collision componentns.<br/>
		!#zh
		节点的分组索引。<br/>
		节点的分组将关系到节点的碰撞组件可以与哪些碰撞组件相碰撞。<br/> */
		groupIndex: number;		
		/** !#en
		Group of node.<br/>
		Which Group this node belongs to will resolve that this node's collision components can collide with which other collision componentns.<br/>
		!#zh
		节点的分组。<br/>
		节点的分组将关系到节点的碰撞组件可以与哪些碰撞组件相碰撞。<br/> */
		group: string;		
		/** !#en The position (x, y) of the node in its parent's coordinates.
		!#zh 节点在父节点坐标系中的位置（x, y）。 */
		position: Vec3;		
		/** !#en x axis position of node.
		!#zh 节点 X 轴坐标。 */
		x: number;		
		/** !#en y axis position of node.
		!#zh 节点 Y 轴坐标。 */
		y: number;		
		/** !#en z axis position of node.
		!#zh 节点 Z 轴坐标。 */
		z: number;		
		/** !#en Rotation of node.
		!#zh 该节点旋转角度。 */
		rotation: number;		
		/** !#en
		Angle of node, the positive value is anti-clockwise direction.
		!#zh
		该节点的旋转角度，正值为逆时针方向。 */
		angle: number;		
		/** !#en The rotation as Euler angles in degrees, used in 3D node.
		!#zh 该节点的欧拉角度，用于 3D 节点。 */
		eulerAngles: Vec3;		
		/** !#en Rotation on x axis.
		!#zh 该节点 X 轴旋转角度。 */
		rotationX: number;		
		/** !#en Rotation on y axis.
		!#zh 该节点 Y 轴旋转角度。 */
		rotationY: number;		
		/** !#en The local scale relative to the parent.
		!#zh 节点相对父节点的缩放。 */
		scale: number;		
		/** !#en Scale on x axis.
		!#zh 节点 X 轴缩放。 */
		scaleX: number;		
		/** !#en Scale on y axis.
		!#zh 节点 Y 轴缩放。 */
		scaleY: number;		
		/** !#en Scale on z axis.
		!#zh 节点 Z 轴缩放。 */
		scaleZ: number;		
		/** !#en Skew x
		!#zh 该节点 X 轴倾斜角度。 */
		skewX: number;		
		/** !#en Skew y
		!#zh 该节点 Y 轴倾斜角度。 */
		skewY: number;		
		/** !#en Opacity of node, default value is 255.
		!#zh 节点透明度，默认值为 255。 */
		opacity: number;		
		/** !#en Color of node, default value is white: (255, 255, 255).
		!#zh 节点颜色。默认为白色，数值为：（255，255，255）。 */
		color: Color;		
		/** !#en Anchor point's position on x axis.
		!#zh 节点 X 轴锚点位置。 */
		anchorX: number;		
		/** !#en Anchor point's position on y axis.
		!#zh 节点 Y 轴锚点位置。 */
		anchorY: number;		
		/** !#en Width of node.
		!#zh 节点宽度。 */
		width: number;		
		/** !#en Height of node.
		!#zh 节点高度。 */
		height: number;		
		/** !#en zIndex is the 'key' used to sort the node relative to its siblings.<br/>
		The value of zIndex should be in the range between cc.macro.MIN_ZINDEX and cc.macro.MAX_ZINDEX.<br/>
		The Node's parent will sort all its children based on the zIndex value and the arrival order.<br/>
		Nodes with greater zIndex will be sorted after nodes with smaller zIndex.<br/>
		If two nodes have the same zIndex, then the node that was added first to the children's array will be in front of the other node in the array.<br/>
		Node's order in children list will affect its rendering order. Parent is always rendering before all children.
		!#zh zIndex 是用来对节点进行排序的关键属性，它决定一个节点在兄弟节点之间的位置。<br/>
		zIndex 的取值应该介于 cc.macro.MIN_ZINDEX 和 cc.macro.MAX_ZINDEX 之间
		父节点主要根据节点的 zIndex 和添加次序来排序，拥有更高 zIndex 的节点将被排在后面，如果两个节点的 zIndex 一致，先添加的节点会稳定排在另一个节点之前。<br/>
		节点在 children 中的顺序决定了其渲染顺序。父节点永远在所有子节点之前被渲染 */
		zIndex: number;		
		/** !#en
		Switch 2D/3D node. The 2D nodes will run faster.
		!#zh
		切换 2D/3D 节点，2D 节点会有更高的运行效率 */
		is3DNode: boolean;		
		/** !#en Returns a normalized vector representing the up direction (Y axis) of the node in world space.
		!#zh 获取节点正上方（y 轴）面对的方向，返回值为世界坐标系下的归一化向量 */
		up: Vec3;		
		/** !#en Returns a normalized vector representing the right direction (X axis) of the node in world space.
		!#zh 获取节点正右方（x 轴）面对的方向，返回值为世界坐标系下的归一化向量 */
		right: Vec3;		
		/** !#en Returns a normalized vector representing the forward direction (Z axis) of the node in world space.
		!#zh 获取节点正前方（z 轴）面对的方向，返回值为世界坐标系下的归一化向量 */
		forward: Vec3;		
		/**
		
		@param name name 
		*/
		constructor(name?: string);		
		/**
		!#en
		Register a callback of a specific event type on Node.<br/>
		Use this method to register touch or mouse event permit propagation based on scene graph,<br/>
		These kinds of event are triggered with dispatchEvent, the dispatch process has three steps:<br/>
		1. Capturing phase: dispatch in capture targets (`_getCapturingTargets`), e.g. parents in node tree, from root to the real target<br/>
		2. At target phase: dispatch to the listeners of the real target<br/>
		3. Bubbling phase: dispatch in bubble targets (`_getBubblingTargets`), e.g. parents in node tree, from the real target to root<br/>
		In any moment of the dispatching process, it can be stopped via `event.stopPropagation()` or `event.stopPropagationImmidiate()`.<br/>
		It's the recommended way to register touch/mouse event for Node,<br/>
		please do not use cc.eventManager directly for Node.<br/>
		You can also register custom event and use `emit` to trigger custom event on Node.<br/>
		For such events, there won't be capturing and bubbling phase, your event will be dispatched directly to its listeners registered on the same node.<br/>
		You can also pass event callback parameters with `emit` by passing parameters after `type`.
		!#zh
		在节点上注册指定类型的回调函数，也可以设置 target 用于绑定响应函数的 this 对象。<br/>
		鼠标或触摸事件会被系统调用 dispatchEvent 方法触发，触发的过程包含三个阶段：<br/>
		1. 捕获阶段：派发事件给捕获目标（通过 `_getCapturingTargets` 获取），比如，节点树中注册了捕获阶段的父节点，从根节点开始派发直到目标节点。<br/>
		2. 目标阶段：派发给目标节点的监听器。<br/>
		3. 冒泡阶段：派发事件给冒泡目标（通过 `_getBubblingTargets` 获取），比如，节点树中注册了冒泡阶段的父节点，从目标节点开始派发直到根节点。<br/>
		同时您可以将事件派发到父节点或者通过调用 stopPropagation 拦截它。<br/>
		推荐使用这种方式来监听节点上的触摸或鼠标事件，请不要在节点上直接使用 cc.eventManager。<br/>
		你也可以注册自定义事件到节点上，并通过 emit 方法触发此类事件，对于这类事件，不会发生捕获冒泡阶段，只会直接派发给注册在该节点上的监听器<br/>
		你可以通过在 emit 方法调用时在 type 之后传递额外的参数作为事件回调的参数列表
		@param type A string representing the event type to listen for.<br>See {{#crossLink "Node/EventTyupe/POSITION_CHANGED"}}Node Events{{/crossLink}} for all builtin events.
		@param callback The callback that will be invoked when the event is dispatched. The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		@param useCapture When set to true, the listener will be triggered at capturing phase which is ahead of the final target emit, otherwise it will be triggered during bubbling phase.
		
		@example 
		```js
		this.node.on(cc.Node.EventType.TOUCH_START, this.memberFunction, this);  // if "this" is component and the "memberFunction" declared in CCClass.
		node.on(cc.Node.EventType.TOUCH_START, callback, this);
		node.on(cc.Node.EventType.TOUCH_MOVE, callback, this);
		node.on(cc.Node.EventType.TOUCH_END, callback, this);
		node.on(cc.Node.EventType.TOUCH_CANCEL, callback, this);
		node.on(cc.Node.EventType.ANCHOR_CHANGED, callback);
		node.on(cc.Node.EventType.COLOR_CHANGED, callback);
		``` 
		*/
		on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T;		
		/**
		!#en
		Register an callback of a specific event type on the Node,
		the callback will remove itself after the first time it is triggered.
		!#zh
		注册节点的特定事件类型回调，回调会在第一时间被触发后删除自身。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		
		@example 
		```js
		node.once(cc.Node.EventType.ANCHOR_CHANGED, callback);
		``` 
		*/
		once<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T;		
		/**
		!#en
		Removes the callback previously registered with the same type, callback, target and or useCapture.
		This method is merely an alias to removeEventListener.
		!#zh 删除之前与同类型，回调，目标或 useCapture 注册的回调。
		@param type A string representing the event type being removed.
		@param callback The callback to remove.
		@param target The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
		@param useCapture When set to true, the listener will be triggered at capturing phase which is ahead of the final target emit, otherwise it will be triggered during bubbling phase.
		
		@example 
		```js
		this.node.off(cc.Node.EventType.TOUCH_START, this.memberFunction, this);
		node.off(cc.Node.EventType.TOUCH_START, callback, this.node);
		node.off(cc.Node.EventType.ANCHOR_CHANGED, callback, this);
		``` 
		*/
		off(type: string, callback?: Function, target?: any, useCapture?: boolean): void;		
		/**
		!#en Removes all callbacks previously registered with the same target.
		!#zh 移除目标上的所有注册事件。
		@param target The target to be searched for all related callbacks
		
		@example 
		```js
		node.targetOff(target);
		``` 
		*/
		targetOff(target: any): void;		
		/**
		!#en Checks whether the EventTarget object has any callback registered for a specific type of event.
		!#zh 检查事件目标对象是否有为特定类型的事件注册的回调。
		@param type The type of event. 
		*/
		hasEventListener(type: string): boolean;		
		/**
		!#en
		Trigger an event directly with the event name and necessary arguments.
		!#zh
		通过事件名发送自定义事件
		@param type event type
		@param arg1 First argument in callback
		@param arg2 Second argument in callback
		@param arg3 Third argument in callback
		@param arg4 Fourth argument in callback
		@param arg5 Fifth argument in callback
		
		@example 
		```js
		eventTarget.emit('fire', event);
		eventTarget.emit('fire', message, emitter);
		``` 
		*/
		emit(type: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): void;		
		/**
		!#en
		Dispatches an event into the event flow.
		The event target is the EventTarget object upon which the dispatchEvent() method is called.
		!#zh 分发事件到事件流中。
		@param event The Event object that is dispatched into the event flow 
		*/
		dispatchEvent(event: Event): void;		
		/**
		!#en Pause node related system events registered with the current Node. Node system events includes touch and mouse events.
		If recursive is set to true, then this API will pause the node system events for the node and all nodes in its sub node tree.
		Reference: http://docs.cocos2d-x.org/editors_and_tools/creator-chapters/scripting/internal-events/
		!#zh 暂停当前节点上注册的所有节点系统事件，节点系统事件包含触摸和鼠标事件。
		如果传递 recursive 为 true，那么这个 API 将暂停本节点和它的子树上所有节点的节点系统事件。
		参考：https://www.cocos.com/docs/creator/scripting/internal-events.html
		@param recursive Whether to pause node system events on the sub node tree.
		
		@example 
		```js
		node.pauseSystemEvents(true);
		``` 
		*/
		pauseSystemEvents(recursive: boolean): void;		
		/**
		!#en Resume node related system events registered with the current Node. Node system events includes touch and mouse events.
		If recursive is set to true, then this API will resume the node system events for the node and all nodes in its sub node tree.
		Reference: http://docs.cocos2d-x.org/editors_and_tools/creator-chapters/scripting/internal-events/
		!#zh 恢复当前节点上注册的所有节点系统事件，节点系统事件包含触摸和鼠标事件。
		如果传递 recursive 为 true，那么这个 API 将恢复本节点和它的子树上所有节点的节点系统事件。
		参考：https://www.cocos.com/docs/creator/scripting/internal-events.html
		@param recursive Whether to resume node system events on the sub node tree.
		
		@example 
		```js
		node.resumeSystemEvents(true);
		``` 
		*/
		resumeSystemEvents(recursive: boolean): void;		
		/**
		!#en
		Executes an action, and returns the action that is executed.<br/>
		The node becomes the action's target. Refer to cc.Action's getTarget() <br/>
		Calling runAction while the node is not active won't have any effect. <br/>
		Note：You shouldn't modify the action after runAction, that won't take any effect.<br/>
		if you want to modify, when you define action plus.
		!#zh
		执行并返回该执行的动作。该节点将会变成动作的目标。<br/>
		调用 runAction 时，节点自身处于不激活状态将不会有任何效果。<br/>
		注意：你不应该修改 runAction 后的动作，将无法发挥作用，如果想进行修改，请在定义 action 时加入。
		@param action action
		
		@example 
		```js
		var action = cc.scaleTo(0.2, 1, 0.6);
		node.runAction(action);
		node.runAction(action).repeatForever(); // fail
		node.runAction(action.repeatForever()); // right
		``` 
		*/
		runAction(action: Action): Action;		
		/**
		!#en Pause all actions running on the current node. Equals to `cc.director.getActionManager().pauseTarget(node)`.
		!#zh 暂停本节点上所有正在运行的动作。和 `cc.director.getActionManager().pauseTarget(node);` 等价。
		
		@example 
		```js
		node.pauseAllActions();
		``` 
		*/
		pauseAllActions(): void;		
		/**
		!#en Resume all paused actions on the current node. Equals to `cc.director.getActionManager().resumeTarget(node)`.
		!#zh 恢复运行本节点上所有暂停的动作。和 `cc.director.getActionManager().resumeTarget(node);` 等价。
		
		@example 
		```js
		node.resumeAllActions();
		``` 
		*/
		resumeAllActions(): void;		
		/**
		!#en Stops and removes all actions from the running action list .
		!#zh 停止并且移除所有正在运行的动作列表。
		
		@example 
		```js
		node.stopAllActions();
		``` 
		*/
		stopAllActions(): void;		
		/**
		!#en Stops and removes an action from the running action list.
		!#zh 停止并移除指定的动作。
		@param action An action object to be removed.
		
		@example 
		```js
		var action = cc.scaleTo(0.2, 1, 0.6);
		node.stopAction(action);
		``` 
		*/
		stopAction(action: Action): void;		
		/**
		!#en Removes an action from the running action list by its tag.
		!#zh 停止并且移除指定标签的动作。
		@param tag A tag that indicates the action to be removed.
		
		@example 
		```js
		node.stopActionByTag(1);
		``` 
		*/
		stopActionByTag(tag: number): void;		
		/**
		!#en Returns an action from the running action list by its tag.
		!#zh 通过标签获取指定动作。
		@param tag tag
		
		@example 
		```js
		var action = node.getActionByTag(1);
		``` 
		*/
		getActionByTag(tag: number): Action;		
		/**
		!#en
		Returns the numbers of actions that are running plus the ones that are schedule to run (actions in actionsToAdd and actions arrays).<br/>
		   Composable actions are counted as 1 action. Example:<br/>
		   If you are running 1 Sequence of 7 actions, it will return 1. <br/>
		   If you are running 7 Sequences of 2 actions, it will return 7.</p>
		!#zh
		获取运行着的动作加上正在调度运行的动作的总数。<br/>
		例如：<br/>
		- 如果你正在运行 7 个动作中的 1 个 Sequence，它将返回 1。<br/>
		- 如果你正在运行 2 个动作中的 7 个 Sequence，它将返回 7。<br/>
		
		@example 
		```js
		var count = node.getNumberOfRunningActions();
		cc.log("Running Action Count: " + count);
		``` 
		*/
		getNumberOfRunningActions(): number;		
		/**
		!#en
		Returns a copy of the position (x, y, z) of the node in its parent's coordinates.
		You can pass a cc.Vec2 or cc.Vec3 as the argument to receive the return values.
		!#zh
		获取节点在父节点坐标系中的位置（x, y, z）。
		你可以传一个 cc.Vec2 或者 cc.Vec3 作为参数来接收返回值。
		@param out The return value to receive position
		
		@example 
		```js
		cc.log("Node Position: " + node.getPosition());
		``` 
		*/
		getPosition(out?: Vec2|Vec3): Vec2;		
		/**
		!#en
		Sets the position (x, y, z) of the node in its parent's coordinates.<br/>
		Usually we use cc.v2(x, y) to compose cc.Vec2 object,<br/>
		and passing two numbers (x, y) is more efficient than passing cc.Vec2 object.
		For 3D node we can use cc.v3(x, y, z) to compose cc.Vec3 object,<br/>
		and passing three numbers (x, y, z) is more efficient than passing cc.Vec3 object.
		!#zh
		设置节点在父节点坐标系中的位置。<br/>
		可以通过下面的方式设置坐标点：<br/>
		1. 传入 2 个数值 x, y。<br/>
		2. 传入 cc.v2(x, y) 类型为 cc.Vec2 的对象。
		3. 对于 3D 节点可以传入 3 个数值 x, y, z。<br/>
		4. 对于 3D 节点可以传入 cc.v3(x, y, z) 类型为 cc.Vec3 的对象。
		@param newPosOrX X coordinate for position or the position (x, y, z) of the node in coordinates
		@param y Y coordinate for position
		@param z Z coordinate for position 
		*/
		setPosition(newPosOrX: Vec2|Vec3|number, y?: number, z?: number): void;		
		/**
		!#en
		Returns the scale factor of the node.
		Need pass a cc.Vec2 or cc.Vec3 as the argument to receive the return values.
		!#zh 获取节点的缩放，需要传一个 cc.Vec2 或者 cc.Vec3 作为参数来接收返回值。
		@param out out
		
		@example 
		```js
		cc.log("Node Scale: " + node.getScale(cc.v3()));
		``` 
		*/
		getScale(out: Vec2|Vec3): Vec2;		
		/**
		!#en
		Sets the scale of axis in local coordinates of the node.
		You can operate 2 axis in 2D node, and 3 axis in 3D node.
		!#zh
		设置节点在本地坐标系中坐标轴上的缩放比例。
		2D 节点可以操作两个坐标轴，而 3D 节点可以操作三个坐标轴。
		@param x scaleX or scale object
		@param y y
		@param z z
		
		@example 
		```js
		node.setScale(cc.v2(2, 2));
		node.setScale(cc.v3(2, 2, 2)); // for 3D node
		node.setScale(2);
		``` 
		*/
		setScale(x: number|Vec2|Vec3, y?: number, z?: number): void;		
		/**
		!#en
		Get rotation of node (in quaternion).
		Need pass a cc.Quat as the argument to receive the return values.
		!#zh
		获取该节点的 quaternion 旋转角度，需要传一个 cc.Quat 作为参数来接收返回值。
		@param out out 
		*/
		getRotation(out: Quat): Quat;		
		/**
		!#en Set rotation of node (in quaternion).
		!#zh 设置该节点的 quaternion 旋转角度。
		@param quat Quaternion object represents the rotation or the x value of quaternion
		@param y y value of quternion
		@param z z value of quternion
		@param w w value of quternion 
		*/
		setRotation(quat: Quat|number, y?: number, z?: number, w?: number): void;		
		/**
		!#en
		Returns a copy the untransformed size of the node. <br/>
		The contentSize remains the same no matter the node is scaled or rotated.<br/>
		All nodes has a size. Layer and Scene has the same size of the screen by default. <br/>
		!#zh 获取节点自身大小，不受该节点是否被缩放或者旋转的影响。
		
		@example 
		```js
		cc.log("Content Size: " + node.getContentSize());
		``` 
		*/
		getContentSize(): Size;		
		/**
		!#en
		Sets the untransformed size of the node.<br/>
		The contentSize remains the same no matter the node is scaled or rotated.<br/>
		All nodes has a size. Layer and Scene has the same size of the screen.
		!#zh 设置节点原始大小，不受该节点是否被缩放或者旋转的影响。
		@param size The untransformed size of the node or The untransformed size's width of the node.
		@param height The untransformed size's height of the node.
		
		@example 
		```js
		node.setContentSize(cc.size(100, 100));
		node.setContentSize(100, 100);
		``` 
		*/
		setContentSize(size: Size|number, height?: number): void;		
		/**
		!#en
		Returns a copy of the anchor point.<br/>
		Anchor point is the point around which all transformations and positioning manipulations take place.<br/>
		It's like a pin in the node where it is "attached" to its parent. <br/>
		The anchorPoint is normalized, like a percentage. (0,0) means the bottom-left corner and (1,1) means the top-right corner. <br/>
		But you can use values higher than (1,1) and lower than (0,0) too.  <br/>
		The default anchor point is (0.5,0.5), so it starts at the center of the node.
		!#zh
		获取节点锚点，用百分比表示。<br/>
		锚点应用于所有变换和坐标点的操作，它就像在节点上连接其父节点的大头针。<br/>
		锚点是标准化的，就像百分比一样。(0，0) 表示左下角，(1，1) 表示右上角。<br/>
		但是你可以使用比（1，1）更高的值或者比（0，0）更低的值。<br/>
		默认的锚点是（0.5，0.5），因此它开始于节点的中心位置。<br/>
		注意：Creator 中的锚点仅用于定位所在的节点，子节点的定位不受影响。
		
		@example 
		```js
		cc.log("Node AnchorPoint: " + node.getAnchorPoint());
		``` 
		*/
		getAnchorPoint(): Vec2;		
		/**
		!#en
		Sets the anchor point in percent. <br/>
		anchor point is the point around which all transformations and positioning manipulations take place. <br/>
		It's like a pin in the node where it is "attached" to its parent. <br/>
		The anchorPoint is normalized, like a percentage. (0,0) means the bottom-left corner and (1,1) means the top-right corner.<br/>
		But you can use values higher than (1,1) and lower than (0,0) too.<br/>
		The default anchor point is (0.5,0.5), so it starts at the center of the node.
		!#zh
		设置锚点的百分比。<br/>
		锚点应用于所有变换和坐标点的操作，它就像在节点上连接其父节点的大头针。<br/>
		锚点是标准化的，就像百分比一样。(0，0) 表示左下角，(1，1) 表示右上角。<br/>
		但是你可以使用比（1，1）更高的值或者比（0，0）更低的值。<br/>
		默认的锚点是（0.5，0.5），因此它开始于节点的中心位置。<br/>
		注意：Creator 中的锚点仅用于定位所在的节点，子节点的定位不受影响。
		@param point The anchor point of node or The x axis anchor of node.
		@param y The y axis anchor of node.
		
		@example 
		```js
		node.setAnchorPoint(cc.v2(1, 1));
		node.setAnchorPoint(1, 1);
		``` 
		*/
		setAnchorPoint(point: Vec2|number, y?: number): void;		
		/**
		!#en Set rotation by lookAt target point, normally used by Camera Node
		!#zh 通过观察目标来设置 rotation，一般用于 Camera Node 上
		@param pos pos
		@param up default is (0,1,0) 
		*/
		lookAt(pos: Vec3, up?: Vec3): void;		
		/**
		!#en
		Get the local transform matrix (4x4), based on parent node coordinates
		!#zh 返回局部空间坐标系的矩阵，基于父节点坐标系。
		@param out The matrix object to be filled with data
		
		@example 
		```js
		let mat4 = cc.mat4();
		node.getLocalMatrix(mat4);
		``` 
		*/
		getLocalMatrix(out: Mat4): Mat4;		
		/**
		!#en
		Get the world transform matrix (4x4)
		!#zh 返回世界空间坐标系的矩阵。
		@param out The matrix object to be filled with data
		
		@example 
		```js
		let mat4 = cc.mat4();
		node.getWorldMatrix(mat4);
		``` 
		*/
		getWorldMatrix(out: Mat4): Mat4;		
		/**
		!#en
		Converts a Point to node (local) space coordinates.
		!#zh
		将一个点转换到节点 (局部) 空间坐标系。
		@param worldPoint worldPoint
		@param out out
		
		@example 
		```js
		var newVec2 = node.convertToNodeSpaceAR(cc.v2(100, 100));
		var newVec3 = node.convertToNodeSpaceAR(cc.v3(100, 100, 100));
		``` 
		*/
		convertToNodeSpaceAR<T extends cc.Vec2 | cc.Vec3>(worldPoint: T, out?: T): T;		
		/**
		!#en
		Converts a Point in node coordinates to world space coordinates.
		!#zh
		将节点坐标系下的一个点转换到世界空间坐标系。
		@param nodePoint nodePoint
		@param out out
		
		@example 
		```js
		var newVec2 = node.convertToWorldSpaceAR(cc.v2(100, 100));
		var newVec3 = node.convertToWorldSpaceAR(cc.v3(100, 100, 100));
		``` 
		*/
		convertToWorldSpaceAR<T extends cc.Vec2 | cc.Vec3>(nodePoint: T, out?: T): T;		
		/**
		!#en Converts a Point to node (local) space coordinates then add the anchor point position.
		So the return position will be related to the left bottom corner of the node's bounding box.
		This equals to the API behavior of cocos2d-x, you probably want to use convertToNodeSpaceAR instead
		!#zh 将一个点转换到节点 (局部) 坐标系，并加上锚点的坐标。<br/>
		也就是说返回的坐标是相对于节点包围盒左下角的坐标。<br/>
		这个 API 的设计是为了和 cocos2d-x 中行为一致，更多情况下你可能需要使用 convertToNodeSpaceAR。
		@param worldPoint worldPoint
		
		@example 
		```js
		var newVec2 = node.convertToNodeSpace(cc.v2(100, 100));
		``` 
		*/
		convertToNodeSpace(worldPoint: Vec2): Vec2;		
		/**
		!#en Converts a Point related to the left bottom corner of the node's bounding box to world space coordinates.
		This equals to the API behavior of cocos2d-x, you probably want to use convertToWorldSpaceAR instead
		!#zh 将一个相对于节点左下角的坐标位置转换到世界空间坐标系。
		这个 API 的设计是为了和 cocos2d-x 中行为一致，更多情况下你可能需要使用 convertToWorldSpaceAR
		@param nodePoint nodePoint
		
		@example 
		```js
		var newVec2 = node.convertToWorldSpace(cc.v2(100, 100));
		``` 
		*/
		convertToWorldSpace(nodePoint: Vec2): Vec2;		
		/**
		!#en
		Returns the matrix that transform the node's (local) space coordinates into the parent's space coordinates.<br/>
		The matrix is in Pixels.
		!#zh 返回这个将节点（局部）的空间坐标系转换成父节点的空间坐标系的矩阵。这个矩阵以像素为单位。
		@param out The affine transform object to be filled with data
		
		@example 
		```js
		let affineTransform = cc.AffineTransform.create();
		node.getNodeToParentTransform(affineTransform);
		``` 
		*/
		getNodeToParentTransform(out?: AffineTransform): AffineTransform;		
		/**
		!#en
		Returns the matrix that transform the node's (local) space coordinates into the parent's space coordinates.<br/>
		The matrix is in Pixels.<br/>
		This method is AR (Anchor Relative).
		!#zh
		返回这个将节点（局部）的空间坐标系转换成父节点的空间坐标系的矩阵。<br/>
		这个矩阵以像素为单位。<br/>
		该方法基于节点坐标。
		@param out The affine transform object to be filled with data
		
		@example 
		```js
		let affineTransform = cc.AffineTransform.create();
		node.getNodeToParentTransformAR(affineTransform);
		``` 
		*/
		getNodeToParentTransformAR(out?: AffineTransform): AffineTransform;		
		/**
		!#en Returns the world affine transform matrix. The matrix is in Pixels.
		!#zh 返回节点到世界坐标系的仿射变换矩阵。矩阵单位是像素。
		@param out The affine transform object to be filled with data
		
		@example 
		```js
		let affineTransform = cc.AffineTransform.create();
		node.getNodeToWorldTransform(affineTransform);
		``` 
		*/
		getNodeToWorldTransform(out?: AffineTransform): AffineTransform;		
		/**
		!#en
		Returns the world affine transform matrix. The matrix is in Pixels.<br/>
		This method is AR (Anchor Relative).
		!#zh
		返回节点到世界坐标仿射变换矩阵。矩阵单位是像素。<br/>
		该方法基于节点坐标。
		@param out The affine transform object to be filled with data
		
		@example 
		```js
		let affineTransform = cc.AffineTransform.create();
		node.getNodeToWorldTransformAR(affineTransform);
		``` 
		*/
		getNodeToWorldTransformAR(out?: AffineTransform): AffineTransform;		
		/**
		!#en
		Returns the matrix that transform parent's space coordinates to the node's (local) space coordinates.<br/>
		The matrix is in Pixels. The returned transform is readonly and cannot be changed.
		!#zh
		返回将父节点的坐标系转换成节点（局部）的空间坐标系的矩阵。<br/>
		该矩阵以像素为单位。返回的矩阵是只读的，不能更改。
		@param out The affine transform object to be filled with data
		
		@example 
		```js
		let affineTransform = cc.AffineTransform.create();
		node.getParentToNodeTransform(affineTransform);
		``` 
		*/
		getParentToNodeTransform(out?: AffineTransform): AffineTransform;		
		/**
		!#en Returns the inverse world affine transform matrix. The matrix is in Pixels.
		!#en 返回世界坐标系到节点坐标系的逆矩阵。
		@param out The affine transform object to be filled with data
		
		@example 
		```js
		let affineTransform = cc.AffineTransform.create();
		node.getWorldToNodeTransform(affineTransform);
		``` 
		*/
		getWorldToNodeTransform(out?: AffineTransform): AffineTransform;		
		/**
		!#en convenience methods which take a cc.Touch instead of cc.Vec2.
		!#zh 将触摸点转换成本地坐标系中位置。
		@param touch The touch object
		
		@example 
		```js
		var newVec2 = node.convertTouchToNodeSpace(touch);
		``` 
		*/
		convertTouchToNodeSpace(touch: Touch): Vec2;		
		/**
		!#en converts a cc.Touch (world coordinates) into a local coordinate. This method is AR (Anchor Relative).
		!#zh 转换一个 cc.Touch（世界坐标）到一个局部坐标，该方法基于节点坐标。
		@param touch The touch object
		
		@example 
		```js
		var newVec2 = node.convertTouchToNodeSpaceAR(touch);
		``` 
		*/
		convertTouchToNodeSpaceAR(touch: Touch): Vec2;		
		/**
		!#en
		Returns a "local" axis aligned bounding box of the node. <br/>
		The returned box is relative only to its parent.
		!#zh 返回父节坐标系下的轴向对齐的包围盒。
		
		@example 
		```js
		var boundingBox = node.getBoundingBox();
		``` 
		*/
		getBoundingBox(): Rect;		
		/**
		!#en
		Returns a "world" axis aligned bounding box of the node.<br/>
		The bounding box contains self and active children's world bounding box.
		!#zh
		返回节点在世界坐标系下的对齐轴向的包围盒（AABB）。<br/>
		该边框包含自身和已激活的子节点的世界边框。
		
		@example 
		```js
		var newRect = node.getBoundingBoxToWorld();
		``` 
		*/
		getBoundingBoxToWorld(): Rect;		
		/**
		!#en
		Adds a child to the node with z order and name.
		!#zh
		添加子节点，并且可以修改该节点的 局部 Z 顺序和名字。
		@param child A child node
		@param zIndex Z order for drawing priority. Please refer to zIndex property
		@param name A name to identify the node easily. Please refer to name property
		
		@example 
		```js
		node.addChild(newNode, 1, "node");
		``` 
		*/
		addChild(child: Node, zIndex?: number, name?: string): void;		
		/**
		!#en Stops all running actions and schedulers.
		!#zh 停止所有正在播放的动作和计时器。
		
		@example 
		```js
		node.cleanup();
		``` 
		*/
		cleanup(): void;		
		/**
		!#en Sorts the children array depends on children's zIndex and arrivalOrder,
		normally you won't need to invoke this function.
		!#zh 根据子节点的 zIndex 和 arrivalOrder 进行排序，正常情况下开发者不需要手动调用这个函数。 
		*/
		sortAllChildren(): void;		
		/**
		!#en
		Returns the displayed opacity of Node,
		the difference between displayed opacity and opacity is that displayed opacity is calculated based on opacity and parent node's opacity when cascade opacity enabled.
		!#zh
		获取节点显示透明度，
		显示透明度和透明度之间的不同之处在于当启用级连透明度时，
		显示透明度是基于自身透明度和父节点透明度计算的。 
		*/
		getDisplayedOpacity(): number;		
		/**
		!#en
		Returns the displayed color of Node,
		the difference between displayed color and color is that displayed color is calculated based on color and parent node's color when cascade color enabled.
		!#zh
		获取节点的显示颜色，
		显示颜色和颜色之间的不同之处在于当启用级连颜色时，
		显示颜色是基于自身颜色和父节点颜色计算的。 
		*/
		getDisplayedColor(): Color;		
		/** !#en Cascade opacity is removed from v2.0
		Indicate whether node's opacity value affect its child nodes, default value is true.
		!#zh 透明度级联功能从 v2.0 开始已移除
		节点的不透明度值是否影响其子节点，默认值为 true。 */
		cascadeOpacity: boolean;		
		/**
		!#en Cascade opacity is removed from v2.0
		Returns whether node's opacity value affect its child nodes.
		!#zh 透明度级联功能从 v2.0 开始已移除
		返回节点的不透明度值是否影响其子节点。 
		*/
		isCascadeOpacityEnabled(): boolean;		
		/**
		!#en Cascade opacity is removed from v2.0
		Enable or disable cascade opacity, if cascade enabled, child nodes' opacity will be the multiplication of parent opacity and its own opacity.
		!#zh 透明度级联功能从 v2.0 开始已移除
		启用或禁用级连不透明度，如果级连启用，子节点的不透明度将是父不透明度乘上它自己的不透明度。
		@param cascadeOpacityEnabled cascadeOpacityEnabled 
		*/
		setCascadeOpacityEnabled(cascadeOpacityEnabled: boolean): void;		
		/**
		!#en Opacity modify RGB have been removed since v2.0
		Set whether color should be changed with the opacity value,
		useless in ccsg.Node, but this function is override in some class to have such behavior.
		!#zh 透明度影响颜色配置已经被废弃
		设置更改透明度时是否修改RGB值，
		@param opacityValue opacityValue 
		*/
		setOpacityModifyRGB(opacityValue: boolean): void;		
		/**
		!#en Opacity modify RGB have been removed since v2.0
		Get whether color should be changed with the opacity value.
		!#zh 透明度影响颜色配置已经被废弃
		获取更改透明度时是否修改RGB值。 
		*/
		isOpacityModifyRGB(): boolean;	
	}	
	/** !#en
	Class of private entities in Cocos Creator scenes.<br/>
	The PrivateNode is hidden in editor, and completely transparent to users.<br/>
	It's normally used as Node's private content created by components in parent node.<br/>
	So in theory private nodes are not children, they are part of the parent node.<br/>
	Private node have two important characteristics:<br/>
	1. It has the minimum z index and cannot be modified, because they can't be displayed over real children.<br/>
	2. The positioning of private nodes is also special, they will consider the left bottom corner of the parent node's bounding box as the origin of local coordinates.<br/>
	   In this way, they can be easily kept inside the bounding box.<br/>
	Currently, it's used by RichText component and TileMap component.
	!#zh
	Cocos Creator 场景中的私有节点类。<br/>
	私有节点在编辑器中不可见，对用户透明。<br/>
	通常私有节点是被一些特殊的组件创建出来作为父节点的一部分而存在的，理论上来说，它们不是子节点，而是父节点的组成部分。<br/>
	私有节点有两个非常重要的特性：<br/>
	1. 它有着最小的渲染排序的 Z 轴深度，并且无法被更改，因为它们不能被显示在其他正常子节点之上。<br/>
	2. 它的定位也是特殊的，对于私有节点来说，父节点包围盒的左下角是它的局部坐标系原点，这个原点相当于父节点的位置减去它锚点的偏移。这样私有节点可以比较容易被控制在包围盒之中。<br/>
	目前在引擎中，RichText 和 TileMap 都有可能生成私有节点。 */
	export class PrivateNode extends Node {		
		/**
		
		@param name name 
		*/
		constructor(name?: string);	
	}	
	/** !#en
	cc.Scene is a subclass of cc.Node that is used only as an abstract concept.<br/>
	cc.Scene and cc.Node are almost identical with the difference that users can not modify cc.Scene manually.
	!#zh
	cc.Scene 是 cc.Node 的子类，仅作为一个抽象的概念。<br/>
	cc.Scene 和 cc.Node 有点不同，用户不应直接修改 cc.Scene。 */
	export class Scene extends Node {		
		/** !#en Indicates whether all (directly or indirectly) static referenced assets of this scene are releasable by default after scene unloading.
		!#zh 指示该场景中直接或间接静态引用到的所有资源是否默认在场景切换后自动释放。 */
		autoReleaseAssets: boolean;	
	}	
	/** !#en
	Scheduler is responsible of triggering the scheduled callbacks.<br/>
	You should not use NSTimer. Instead use this class.<br/>
	<br/>
	There are 2 different types of callbacks (selectors):<br/>
	    - update callback: the 'update' callback will be called every frame. You can customize the priority.<br/>
	    - custom callback: A custom callback will be called every frame, or with a custom interval of time<br/>
	<br/>
	The 'custom selectors' should be avoided when possible. It is faster,
	and consumes less memory to use the 'update callback'. *
	!#zh
	Scheduler 是负责触发回调函数的类。<br/>
	通常情况下，建议使用 cc.director.getScheduler() 来获取系统定时器。<br/>
	有两种不同类型的定时器：<br/>
	    - update 定时器：每一帧都会触发。您可以自定义优先级。<br/>
	    - 自定义定时器：自定义定时器可以每一帧或者自定义的时间间隔触发。<br/>
	如果希望每帧都触发，应该使用 update 定时器，使用 update 定时器更快，而且消耗更少的内存。 */
	export class Scheduler {		
		/**
		!#en This method should be called for any target which needs to schedule tasks, and this method should be called before any scheduler API usage.
		This method will add a `_id` property if it doesn't exist.
		!#zh 任何需要用 Scheduler 管理任务的对象主体都应该调用这个方法，并且应该在调用任何 Scheduler API 之前调用这个方法。
		这个方法会给对象添加一个 `_id` 属性，如果这个属性不存在的话。
		@param target target 
		*/
		enableForTarget(target: any): void;		
		/**
		!#en
		Modifies the time of all scheduled callbacks.<br/>
		You can use this property to create a 'slow motion' or 'fast forward' effect.<br/>
		Default is 1.0. To create a 'slow motion' effect, use values below 1.0.<br/>
		To create a 'fast forward' effect, use values higher than 1.0.<br/>
		Note：It will affect EVERY scheduled selector / action.
		!#zh
		设置时间间隔的缩放比例。<br/>
		您可以使用这个方法来创建一个 “slow motion（慢动作）” 或 “fast forward（快进）” 的效果。<br/>
		默认是 1.0。要创建一个 “slow motion（慢动作）” 效果,使用值低于 1.0。<br/>
		要使用 “fast forward（快进）” 效果，使用值大于 1.0。<br/>
		注意：它影响该 Scheduler 下管理的所有定时器。
		@param timeScale timeScale 
		*/
		setTimeScale(timeScale: number): void;		
		/**
		!#en Returns time scale of scheduler.
		!#zh 获取时间间隔的缩放比例。 
		*/
		getTimeScale(): number;		
		/**
		!#en 'update' the scheduler. (You should NEVER call this method, unless you know what you are doing.)
		!#zh update 调度函数。(不应该直接调用这个方法，除非完全了解这么做的结果)
		@param dt delta time 
		*/
		update(dt: number): void;		
		/**
		!#en
		<p>
		  The scheduled method will be called every 'interval' seconds.<br/>
		  If paused is YES, then it won't be called until it is resumed.<br/>
		  If 'interval' is 0, it will be called every frame, but if so, it recommended to use 'scheduleUpdateForTarget:' instead.<br/>
		  If the callback function is already scheduled, then only the interval parameter will be updated without re-scheduling it again.<br/>
		  repeat let the action be repeated repeat + 1 times, use cc.macro.REPEAT_FOREVER to let the action run continuously<br/>
		  delay is the amount of time the action will wait before it'll start<br/>
		</p>
		!#zh
		指定回调函数，调用对象等信息来添加一个新的定时器。<br/>
		如果 paused 值为 true，那么直到 resume 被调用才开始计时。<br/>
		当时间间隔达到指定值时，设置的回调函数将会被调用。<br/>
		如果 interval 值为 0，那么回调函数每一帧都会被调用，但如果是这样，
		建议使用 scheduleUpdateForTarget 代替。<br/>
		如果回调函数已经被定时器使用，那么只会更新之前定时器的时间间隔参数，不会设置新的定时器。<br/>
		repeat 值可以让定时器触发 repeat + 1 次，使用 cc.macro.REPEAT_FOREVER
		可以让定时器一直循环触发。<br/>
		delay 值指定延迟时间，定时器会在延迟指定的时间之后开始计时。
		@param callback callback
		@param target target
		@param interval interval
		@param repeat repeat
		@param delay delay
		@param paused paused
		
		@example 
		```js
		//register a schedule to scheduler
		cc.director.getScheduler().schedule(callback, this, interval, !this._isRunning);
		
		``` 
		*/
		schedule(callback: Function, target: any, interval: number, repeat: number, delay: number, paused?: boolean): void;
		schedule(callback: Function, target: any, interval: number, paused?: boolean): void;		
		/**
		!#en
		Schedules the update callback for a given target,
		During every frame after schedule started, the "update" function of target will be invoked.
		!#zh
		使用指定的优先级为指定的对象设置 update 定时器。
		update 定时器每一帧都会被触发，触发时自动调用指定对象的 "update" 函数。
		优先级的值越低，定时器被触发的越早。
		@param target target
		@param priority priority
		@param paused paused 
		*/
		scheduleUpdate(target: any, priority: number, paused: boolean): void;		
		/**
		!#en
		Unschedules a callback for a callback and a given target.
		If you want to unschedule the "update", use `unscheduleUpdate()`
		!#zh
		取消指定对象定时器。
		如果需要取消 update 定时器，请使用 unscheduleUpdate()。
		@param callback The callback to be unscheduled
		@param target The target bound to the callback. 
		*/
		unschedule(callback: Function, target: any): void;		
		/**
		!#en Unschedules the update callback for a given target.
		!#zh 取消指定对象的 update 定时器。
		@param target The target to be unscheduled. 
		*/
		unscheduleUpdate(target: any): void;		
		/**
		!#en
		Unschedules all scheduled callbacks for a given target.
		This also includes the "update" callback.
		!#zh 取消指定对象的所有定时器，包括 update 定时器。
		@param target The target to be unscheduled. 
		*/
		unscheduleAllForTarget(target: any): void;		
		/**
		!#en
		Unschedules all scheduled callbacks from all targets including the system callbacks.<br/>
		You should NEVER call this method, unless you know what you are doing.
		!#zh
		取消所有对象的所有定时器，包括系统定时器。<br/>
		不用调用此函数，除非你确定你在做什么。 
		*/
		unscheduleAll(): void;		
		/**
		!#en
		Unschedules all callbacks from all targets with a minimum priority.<br/>
		You should only call this with `PRIORITY_NON_SYSTEM_MIN` or higher.
		!#zh
		取消所有优先级的值大于指定优先级的定时器。<br/>
		你应该只取消优先级的值大于 PRIORITY_NON_SYSTEM_MIN 的定时器。
		@param minPriority The minimum priority of selector to be unscheduled. Which means, all selectors which
		       priority is higher than minPriority will be unscheduled. 
		*/
		unscheduleAllWithMinPriority(minPriority: number): void;		
		/**
		!#en Checks whether a callback for a given target is scheduled.
		!#zh 检查指定的回调函数和回调对象组合是否存在定时器。
		@param callback The callback to check.
		@param target The target of the callback. 
		*/
		isScheduled(callback: Function, target: any): boolean;		
		/**
		!#en
		Pause all selectors from all targets.<br/>
		You should NEVER call this method, unless you know what you are doing.
		!#zh
		暂停所有对象的所有定时器。<br/>
		不要调用这个方法，除非你知道你正在做什么。 
		*/
		pauseAllTargets(): void;		
		/**
		!#en
		Pause all selectors from all targets with a minimum priority. <br/>
		You should only call this with kCCPriorityNonSystemMin or higher.
		!#zh
		暂停所有优先级的值大于指定优先级的定时器。<br/>
		你应该只暂停优先级的值大于 PRIORITY_NON_SYSTEM_MIN 的定时器。
		@param minPriority minPriority 
		*/
		pauseAllTargetsWithMinPriority(minPriority: number): void;		
		/**
		!#en
		Resume selectors on a set of targets.<br/>
		This can be useful for undoing a call to pauseAllCallbacks.
		!#zh
		恢复指定数组中所有对象的定时器。<br/>
		这个函数是 pauseAllCallbacks 的逆操作。
		@param targetsToResume targetsToResume 
		*/
		resumeTargets(targetsToResume: any[]): void;		
		/**
		!#en
		Pauses the target.<br/>
		All scheduled selectors/update for a given target won't be 'ticked' until the target is resumed.<br/>
		If the target is not present, nothing happens.
		!#zh
		暂停指定对象的定时器。<br/>
		指定对象的所有定时器都会被暂停。<br/>
		如果指定的对象没有定时器，什么也不会发生。
		@param target target 
		*/
		pauseTarget(target: any): void;		
		/**
		!#en
		Resumes the target.<br/>
		The 'target' will be unpaused, so all schedule selectors/update will be 'ticked' again.<br/>
		If the target is not present, nothing happens.
		!#zh
		恢复指定对象的所有定时器。<br/>
		指定对象的所有定时器将继续工作。<br/>
		如果指定的对象没有定时器，什么也不会发生。
		@param target target 
		*/
		resumeTarget(target: any): void;		
		/**
		!#en Returns whether or not the target is paused.
		!#zh 返回指定对象的定时器是否暂停了。
		@param target target 
		*/
		isTargetPaused(target: any): boolean;		
		/** !#en Priority level reserved for system services.
		!#zh 系统服务的优先级。 */
		static PRIORITY_SYSTEM: number;		
		/** !#en Minimum priority level for user scheduling.
		!#zh 用户调度最低优先级。 */
		static PRIORITY_NON_SYSTEM: number;	
	}	
	/** Class for particle asset handling. */
	export class ParticleAsset extends Asset {	
	}	
	/** Particle System base class. <br/>
	Attributes of a Particle System:<br/>
	 - emmision rate of the particles<br/>
	 - Gravity Mode (Mode A): <br/>
	 - gravity <br/>
	 - direction <br/>
	 - speed +-  variance <br/>
	 - tangential acceleration +- variance<br/>
	 - radial acceleration +- variance<br/>
	 - Radius Mode (Mode B):      <br/>
	 - startRadius +- variance    <br/>
	 - endRadius +- variance      <br/>
	 - rotate +- variance         <br/>
	 - Properties common to all modes: <br/>
	 - life +- life variance      <br/>
	 - start spin +- variance     <br/>
	 - end spin +- variance       <br/>
	 - start size +- variance     <br/>
	 - end size +- variance       <br/>
	 - start color +- variance    <br/>
	 - end color +- variance      <br/>
	 - life +- variance           <br/>
	 - blending function          <br/>
	 - texture                    <br/>
	<br/>
	cocos2d also supports particles generated by Particle Designer (http://particledesigner.71squared.com/).<br/>
	'Radius Mode' in Particle Designer uses a fixed emit rate of 30 hz. Since that can't be guarateed in cocos2d,  <br/>
	cocos2d uses a another approach, but the results are almost identical.<br/>
	cocos2d supports all the variables used by Particle Designer plus a bit more:  <br/>
	 - spinning particles (supported when using ParticleSystem)       <br/>
	 - tangential acceleration (Gravity mode)                               <br/>
	 - radial acceleration (Gravity mode)                                   <br/>
	 - radius direction (Radius mode) (Particle Designer supports outwards to inwards direction only) <br/>
	It is possible to customize any of the above mentioned properties in runtime. Example:   <br/> */
	export class ParticleSystem extends RenderComponent implements BlendFunc {		
		/** !#en Play particle in edit mode.
		!#zh 在编辑器模式下预览粒子，启用后选中粒子时，粒子将自动播放。 */
		preview: boolean;		
		/** !#en
		If set custom to true, then use custom properties insteadof read particle file.
		!#zh 是否自定义粒子属性。 */
		custom: boolean;		
		/** !#en The plist file.
		!#zh plist 格式的粒子配置文件。 */
		file: ParticleAsset;		
		/** !#en SpriteFrame used for particles display
		!#zh 用于粒子呈现的 SpriteFrame */
		spriteFrame: SpriteFrame;		
		/** !#en Texture of Particle System, readonly, please use spriteFrame to setup new texture。
		!#zh 粒子贴图，只读属性，请使用 spriteFrame 属性来替换贴图。 */
		texture: string;		
		/** !#en Current quantity of particles that are being simulated.
		!#zh 当前播放的粒子数量。 */
		particleCount: number;		
		/** !#en Indicate whether the system simulation have stopped.
		!#zh 指示粒子播放是否完毕。 */
		stopped: boolean;		
		/** !#en If set to true, the particle system will automatically start playing on onLoad.
		!#zh 如果设置为 true 运行时会自动发射粒子。 */
		playOnLoad: boolean;		
		/** !#en Indicate whether the owner node will be auto-removed when it has no particles left.
		!#zh 粒子播放完毕后自动销毁所在的节点。 */
		autoRemoveOnFinish: boolean;		
		/** !#en Indicate whether the particle system is activated.
		!#zh 是否激活粒子。 */
		active: boolean;		
		/** !#en Maximum particles of the system.
		!#zh 粒子最大数量。 */
		totalParticles: number;		
		/** !#en How many seconds the emitter wil run. -1 means 'forever'.
		!#zh 发射器生存时间，单位秒，-1表示持续发射。 */
		duration: number;		
		/** !#en Emission rate of the particles.
		!#zh 每秒发射的粒子数目。 */
		emissionRate: number;		
		/** !#en Life of each particle setter.
		!#zh 粒子的运行时间。 */
		life: number;		
		/** !#en Variation of life.
		!#zh 粒子的运行时间变化范围。 */
		lifeVar: number;		
		/** !#en Start color of each particle.
		!#zh 粒子初始颜色。 */
		startColor: Color;		
		/** !#en Variation of the start color.
		!#zh 粒子初始颜色变化范围。 */
		startColorVar: Color;		
		/** !#en Ending color of each particle.
		!#zh 粒子结束颜色。 */
		endColor: Color;		
		/** !#en Variation of the end color.
		!#zh 粒子结束颜色变化范围。 */
		endColorVar: Color;		
		/** !#en Angle of each particle setter.
		!#zh 粒子角度。 */
		angle: number;		
		/** !#en Variation of angle of each particle setter.
		!#zh 粒子角度变化范围。 */
		angleVar: number;		
		/** !#en Start size in pixels of each particle.
		!#zh 粒子的初始大小。 */
		startSize: number;		
		/** !#en Variation of start size in pixels.
		!#zh 粒子初始大小的变化范围。 */
		startSizeVar: number;		
		/** !#en End size in pixels of each particle.
		!#zh 粒子结束时的大小。 */
		endSize: number;		
		/** !#en Variation of end size in pixels.
		!#zh 粒子结束大小的变化范围。 */
		endSizeVar: number;		
		/** !#en Start angle of each particle.
		!#zh 粒子开始自旋角度。 */
		startSpin: number;		
		/** !#en Variation of start angle.
		!#zh 粒子开始自旋角度变化范围。 */
		startSpinVar: number;		
		/** !#en End angle of each particle.
		!#zh 粒子结束自旋角度。 */
		endSpin: number;		
		/** !#en Variation of end angle.
		!#zh 粒子结束自旋角度变化范围。 */
		endSpinVar: number;		
		/** !#en Source position of the emitter.
		!#zh 发射器位置。 */
		sourcePos: Vec2;		
		/** !#en Variation of source position.
		!#zh 发射器位置的变化范围。（横向和纵向） */
		posVar: Vec2;		
		/** !#en Particles movement type.
		!#zh 粒子位置类型。 */
		positionType: ParticleSystem.PositionType;		
		/** !#en Particles emitter modes.
		!#zh 发射器类型。 */
		emitterMode: ParticleSystem.EmitterMode;		
		/** !#en Gravity of the emitter.
		!#zh 重力。 */
		gravity: Vec2;		
		/** !#en Speed of the emitter.
		!#zh 速度。 */
		speed: number;		
		/** !#en Variation of the speed.
		!#zh 速度变化范围。 */
		speedVar: number;		
		/** !#en Tangential acceleration of each particle. Only available in 'Gravity' mode.
		!#zh 每个粒子的切向加速度，即垂直于重力方向的加速度，只有在重力模式下可用。 */
		tangentialAccel: number;		
		/** !#en Variation of the tangential acceleration.
		!#zh 每个粒子的切向加速度变化范围。 */
		tangentialAccelVar: number;		
		/** !#en Acceleration of each particle. Only available in 'Gravity' mode.
		!#zh 粒子径向加速度，即平行于重力方向的加速度，只有在重力模式下可用。 */
		radialAccel: number;		
		/** !#en Variation of the radial acceleration.
		!#zh 粒子径向加速度变化范围。 */
		radialAccelVar: number;		
		/** !#en Indicate whether the rotation of each particle equals to its direction. Only available in 'Gravity' mode.
		!#zh 每个粒子的旋转是否等于其方向，只有在重力模式下可用。 */
		rotationIsDir: boolean;		
		/** !#en Starting radius of the particles. Only available in 'Radius' mode.
		!#zh 初始半径，表示粒子出生时相对发射器的距离，只有在半径模式下可用。 */
		startRadius: number;		
		/** !#en Variation of the starting radius.
		!#zh 初始半径变化范围。 */
		startRadiusVar: number;		
		/** !#en Ending radius of the particles. Only available in 'Radius' mode.
		!#zh 结束半径，只有在半径模式下可用。 */
		endRadius: number;		
		/** !#en Variation of the ending radius.
		!#zh 结束半径变化范围。 */
		endRadiusVar: number;		
		/** !#en Number of degress to rotate a particle around the source pos per second. Only available in 'Radius' mode.
		!#zh 粒子每秒围绕起始点的旋转角度，只有在半径模式下可用。 */
		rotatePerS: number;		
		/** !#en Variation of the degress to rotate a particle around the source pos per second.
		!#zh 粒子每秒围绕起始点的旋转角度变化范围。 */
		rotatePerSVar: number;		
		/** !#en The Particle emitter lives forever.
		!#zh 表示发射器永久存在 */
		static DURATION_INFINITY: number;		
		/** !#en The starting size of the particle is equal to the ending size.
		!#zh 表示粒子的起始大小等于结束大小。 */
		static START_SIZE_EQUAL_TO_END_SIZE: number;		
		/** !#en The starting radius of the particle is equal to the ending radius.
		!#zh 表示粒子的起始半径等于结束半径。 */
		static START_RADIUS_EQUAL_TO_END_RADIUS: number;		
		/**
		!#en Stop emitting particles. Running particles will continue to run until they die.
		!#zh 停止发射器发射粒子，发射出去的粒子将继续运行，直至粒子生命结束。
		
		@example 
		```js
		// stop particle system.
		myParticleSystem.stopSystem();
		``` 
		*/
		stopSystem(): void;		
		/**
		!#en Kill all living particles.
		!#zh 杀死所有存在的粒子，然后重新启动粒子发射器。
		
		@example 
		```js
		// play particle system.
		myParticleSystem.resetSystem();
		``` 
		*/
		resetSystem(): void;		
		/**
		!#en Whether or not the system is full.
		!#zh 发射器中粒子是否大于等于设置的总粒子数量。 
		*/
		isFull(): boolean;		
		/**
		!#en Sets a new texture with a rect. The rect is in texture position and size.
		Please use spriteFrame property instead, this function is deprecated since v1.9
		!#zh 设置一张新贴图和关联的矩形。
		请直接设置 spriteFrame 属性，这个函数从 v1.9 版本开始已经被废弃
		@param texture texture
		@param rect rect 
		*/
		setTextureWithRect(texture: Texture2D, rect: Rect): void;		
		/** !#en specify the source Blend Factor, this will generate a custom material object, please pay attention to the memory cost.
		!#zh 指定原图的混合模式，这会克隆一个新的材质对象，注意这带来的开销 */
		srcBlendFactor: macro.BlendFactor;		
		/** !#en specify the destination Blend Factor.
		!#zh 指定目标的混合模式 */
		dstBlendFactor: macro.BlendFactor;	
	}	
	/** !#en cc.VideoPlayer is a component for playing videos, you can use it for showing videos in your game. Because different platforms have different authorization, API and control methods for VideoPlayer component. And have not yet formed a unified standard, only Web, iOS, and Android platforms are currently supported.
	!#zh Video 组件，用于在游戏中播放视频。由于不同平台对于 VideoPlayer 组件的授权、API、控制方式都不同，还没有形成统一的标准，所以目前只支持 Web、iOS 和 Android 平台。 */
	export class VideoPlayer extends Component {		
		/** !#en The resource type of videoplayer, REMOTE for remote url and LOCAL for local file path.
		!#zh 视频来源：REMOTE 表示远程视频 URL，LOCAL 表示本地视频地址。 */
		resourceType: VideoPlayer.ResourceType;		
		/** !#en The remote URL of video.
		!#zh 远程视频的 URL */
		remoteURL: string;		
		/** !#en The local video full path.
		!#zh 本地视频的 URL */
		clip: string;		
		/** !#en The current playback time of the now playing item in seconds, you could also change the start playback time.
		!#zh 指定视频从什么时间点开始播放，单位是秒，也可以用来获取当前视频播放的时间进度。 */
		currentTime: number;		
		/** !#en The volume of the video.
		!#zh 视频的音量（0.0 ~ 1.0） */
		volume: number;		
		/** !#en Mutes the VideoPlayer. Mute sets the volume=0, Un-Mute restore the original volume.
		!#zh 是否静音视频。静音时设置音量为 0，取消静音是恢复原来的音量。 */
		mute: boolean;		
		/** !#en Whether keep the aspect ration of the original video.
		!#zh 是否保持视频原来的宽高比 */
		keepAspectRatio: boolean;		
		/** !#en Whether play video in fullscreen mode.
		!#zh 是否全屏播放视频 */
		isFullscreen: boolean;		
		/** !#en Always below the game view (only useful on Web. Note: The specific effects are not guaranteed to be consistent, depending on whether each browser supports or restricts).
		!#zh 永远在游戏视图最底层（这个属性只有在 Web 平台上有效果。注意：具体效果无法保证一致，跟各个浏览器是否支持与限制有关） */
		stayOnBottom: boolean;		
		/** !#en the video player's callback, it will be triggered when certain event occurs, like: playing, paused, stopped and completed.
		!#zh 视频播放回调函数，该回调函数会在特定情况被触发，比如播放中，暂时，停止和完成播放。 */
		videoPlayerEvent: Component.EventHandler[];		
		/**
		!#en If a video is paused, call this method could resume playing. If a video is stopped, call this method to play from scratch.
		!#zh 如果视频被暂停播放了，调用这个接口可以继续播放。如果视频被停止播放了，调用这个接口可以从头开始播放。 
		*/
		play(): void;		
		/**
		!#en If a video is paused, call this method to resume playing.
		!#zh 如果一个视频播放被暂停播放了，调用这个接口可以继续播放。 
		*/
		resume(): void;		
		/**
		!#en If a video is playing, call this method to pause playing.
		!#zh 如果一个视频正在播放，调用这个接口可以暂停播放。 
		*/
		pause(): void;		
		/**
		!#en If a video is playing, call this method to stop playing immediately.
		!#zh 如果一个视频正在播放，调用这个接口可以立马停止播放。 
		*/
		stop(): void;		
		/**
		!#en Gets the duration of the video
		!#zh 获取视频文件的播放总时长 
		*/
		getDuration(): number;		
		/**
		!#en Determine whether video is playing or not.
		!#zh 判断当前视频是否处于播放状态 
		*/
		isPlaying(): boolean;		
		/**
		!#en if you don't need the VideoPlayer and it isn't in any running Scene, you should
		call the destroy method on this component or the associated node explicitly.
		Otherwise, the created DOM element won't be removed from web page.
		!#zh
		如果你不再使用 VideoPlayer，并且组件未添加到场景中，那么你必须手动对组件或所在节点调用 destroy。
		这样才能移除网页上的 DOM 节点，避免 Web 平台内存泄露。
		
		@example 
		```js
		videoplayer.node.parent = null;  // or  videoplayer.node.removeFromParent(false);
		// when you don't need videoplayer anymore
		videoplayer.node.destroy();
		``` 
		*/
		destroy(): boolean;	
	}	
	/** !#en cc.WebView is a component for display web pages in the game. Because different platforms have different authorization, API and control methods for WebView component. And have not yet formed a unified standard, only Web, iOS, and Android platforms are currently supported.
	!#zh WebView 组件，用于在游戏中显示网页。由于不同平台对于 WebView 组件的授权、API、控制方式都不同，还没有形成统一的标准，所以目前只支持 Web、iOS 和 Android 平台。 */
	export class WebView extends Component {		
		/** !#en A given URL to be loaded by the WebView, it should have a http or https prefix.
		!#zh 指定 WebView 加载的网址，它应该是一个 http 或者 https 开头的字符串 */
		url: string;		
		/** !#en The webview's event callback , it will be triggered when certain webview event occurs.
		!#zh WebView 的回调事件，当网页加载过程中，加载完成后或者加载出错时都会回调此函数 */
		webviewLoadedEvents: Component.EventHandler[];		
		/**
		!#en
		Set javascript interface scheme (see also setOnJSCallback). <br/>
		Note: Supports only on the Android and iOS. For HTML5, please refer to the official documentation.<br/>
		Please refer to the official documentation for more details.
		!#zh
		设置 JavaScript 接口方案（与 'setOnJSCallback' 配套使用）。<br/>
		注意：只支持 Android 和 iOS ，Web 端用法请前往官方文档查看。<br/>
		详情请参阅官方文档
		@param scheme scheme 
		*/
		setJavascriptInterfaceScheme(scheme: string): void;		
		/**
		!#en
		This callback called when load URL that start with javascript
		interface scheme (see also setJavascriptInterfaceScheme). <br/>
		Note: Supports only on the Android and iOS. For HTML5, please refer to the official documentation.<br/>
		Please refer to the official documentation for more details.
		!#zh
		当加载 URL 以 JavaScript 接口方案开始时调用这个回调函数。<br/>
		注意：只支持 Android 和 iOS，Web 端用法请前往官方文档查看。
		详情请参阅官方文档
		@param callback callback 
		*/
		setOnJSCallback(callback: Function): void;		
		/**
		!#en
		Evaluates JavaScript in the context of the currently displayed page. <br/>
		Please refer to the official document for more details <br/>
		Note: Cross domain issues need to be resolved by yourself <br/>
		!#zh
		执行 WebView 内部页面脚本（详情请参阅官方文档） <br/>
		注意：需要自行解决跨域问题
		@param str str 
		*/
		evaluateJS(str: string): void;		
		/**
		!#en if you don't need the WebView and it isn't in any running Scene, you should
		call the destroy method on this component or the associated node explicitly.
		Otherwise, the created DOM element won't be removed from web page.
		!#zh
		如果你不再使用 WebView，并且组件未添加到场景中，那么你必须手动对组件或所在节点调用 destroy。
		这样才能移除网页上的 DOM 节点，避免 Web 平台内存泄露。
		
		@example 
		```js
		webview.node.parent = null;  // or  webview.node.removeFromParent(false);
		// when you don't need webview anymore
		webview.node.destroy();
		``` 
		*/
		destroy(): boolean;	
	}	
	/** !#en
	Camera is usefull when making reel game or other games which need scroll screen.
	Using camera will be more efficient than moving node to scroll screen.
	Camera
	!#zh
	摄像机在制作卷轴或是其他需要移动屏幕的游戏时比较有用，使用摄像机将会比移动节点来移动屏幕更加高效。 */
	export class Camera extends Component {		
		/** !#en
		The camera zoom ratio, only support 2D camera.
		!#zh
		摄像机缩放比率, 只支持 2D camera。 */
		zoomRatio: number;		
		/** !#en
		Field of view. The width of the Camera’s view angle, measured in degrees along the local Y axis.
		!#zh
		决定摄像机视角的宽度，当摄像机处于透视投影模式下这个属性才会生效。 */
		fov: number;		
		/** !#en
		The viewport size of the Camera when set to orthographic projection.
		!#zh
		摄像机在正交投影模式下的视窗大小。 */
		orthoSize: number;		
		/** !#en
		The near clipping plane.
		!#zh
		摄像机的近剪裁面。 */
		nearClip: number;		
		/** !#en
		The far clipping plane.
		!#zh
		摄像机的远剪裁面。 */
		farClip: number;		
		/** !#en
		Is the camera orthographic (true) or perspective (false)?
		!#zh
		设置摄像机的投影模式是正交还是透视模式。 */
		ortho: boolean;		
		/** !#en
		Four values (0 ~ 1) that indicate where on the screen this camera view will be drawn.
		!#zh
		决定摄像机绘制在屏幕上哪个位置，值为（0 ~ 1）。 */
		rect: Rect;		
		/** !#en
		This is used to render parts of the scene selectively.
		!#zh
		决定摄像机会渲染场景的哪一部分。 */
		cullingMask: number;		
		/** !#en
		Determining what to clear when camera rendering.
		!#zh
		决定摄像机渲染时会清除哪些状态。 */
		clearFlags: Camera.ClearFlags;		
		/** !#en
		The color with which the screen will be cleared.
		!#zh
		摄像机用于清除屏幕的背景色。 */
		backgroundColor: Color;		
		/** !#en
		Camera's depth in the camera rendering order.
		!#zh
		摄像机深度，用于决定摄像机的渲染顺序。 */
		depth: number;		
		/** !#en
		Destination render texture.
		Usually cameras render directly to screen, but for some effects it is useful to make a camera render into a texture.
		!#zh
		摄像机渲染的目标 RenderTexture。
		一般摄像机会直接渲染到屏幕上，但是有一些效果可以使用摄像机渲染到 RenderTexture 上再对 RenderTexture 进行处理来实现。 */
		targetTexture: RenderTexture;		
		/** !#en
		Sets the camera's render stages.
		!#zh
		设置摄像机渲染的阶段 */
		renderStages: number;		
		/** !#en Whether auto align camera viewport to screen
		!#zh 是否自动将摄像机的视口对准屏幕 */
		alignWithScreen: boolean;		
		/** !#en
		The first enabled camera.
		!#zh
		第一个被激活的摄像机。 */
		static main: Camera;		
		/** !#en
		All enabled cameras.
		!#zh
		激活的所有摄像机。 */
		static cameras: Camera[];		
		/**
		!#en
		Get the first camera which the node belong to.
		!#zh
		获取节点所在的第一个摄像机。
		@param node node 
		*/
		static findCamera(node: Node): Camera;		
		/**
		!#en
		Get the screen to world matrix, only support 2D camera which alignWithScreen is true.
		!#zh
		获取屏幕坐标系到世界坐标系的矩阵，只适用于 alignWithScreen 为 true 的 2D 摄像机。
		@param out the matrix to receive the result 
		*/
		getScreenToWorldMatrix2D(out: Mat4): Mat4;		
		/**
		!#en
		Get the world to camera matrix, only support 2D camera which alignWithScreen is true.
		!#zh
		获取世界坐标系到摄像机坐标系的矩阵，只适用于 alignWithScreen 为 true 的 2D 摄像机。
		@param out the matrix to receive the result 
		*/
		getWorldToScreenMatrix2D(out: Mat4): Mat4;		
		/**
		!#en
		Convert point from screen to world.
		!#zh
		将坐标从屏幕坐标系转换到世界坐标系。
		@param screenPosition screenPosition
		@param out out 
		*/
		getScreenToWorldPoint(screenPosition: Vec3|Vec2, out?: Vec3|Vec2): Vec3;		
		/**
		!#en
		Convert point from world to screen.
		!#zh
		将坐标从世界坐标系转化到屏幕坐标系。
		@param worldPosition worldPosition
		@param out out 
		*/
		getWorldToScreenPoint(worldPosition: Vec3|Vec2, out?: Vec3|Vec2): Vec3;		
		/**
		!#en
		Get a ray from screen position
		!#zh
		从屏幕坐标获取一条射线
		@param screenPos screenPos 
		*/
		getRay(screenPos: Vec2): geomUtils.Ray;		
		/**
		!#en
		Check whether the node is in the camera.
		!#zh
		检测节点是否被此摄像机影响
		@param node the node which need to check 
		*/
		containsNode(node: Node): boolean;		
		/**
		!#en
		Render the camera manually.
		!#zh
		手动渲染摄像机。
		@param root root 
		*/
		render(root: Node): void;		
		/**
		!#en
		Returns the matrix that transform the node's (local) space coordinates into the camera's space coordinates.
		!#zh
		返回一个将节点坐标系转换到摄像机坐标系下的矩阵
		@param node the node which should transform 
		*/
		getNodeToCameraTransform(node: Node): AffineTransform;		
		/**
		!#en
		Conver a camera coordinates point to world coordinates.
		!#zh
		将一个摄像机坐标系下的点转换到世界坐标系下。
		@param point the point which should transform
		@param out the point to receive the result 
		*/
		getCameraToWorldPoint(point: Vec2, out?: Vec2): Vec2;		
		/**
		!#en
		Conver a world coordinates point to camera coordinates.
		!#zh
		将一个世界坐标系下的点转换到摄像机坐标系下。
		@param point point
		@param out the point to receive the result 
		*/
		getWorldToCameraPoint(point: Vec2, out?: Vec2): Vec2;		
		/**
		!#en
		Get the camera to world matrix
		!#zh
		获取摄像机坐标系到世界坐标系的矩阵
		@param out the matrix to receive the result 
		*/
		getCameraToWorldMatrix(out: Mat4): Mat4;		
		/**
		!#en
		Get the world to camera matrix
		!#zh
		获取世界坐标系到摄像机坐标系的矩阵
		@param out the matrix to receive the result 
		*/
		getWorldToCameraMatrix(out: Mat4): Mat4;	
	}	
	/** !#en Box Collider.
	!#zh 包围盒碰撞组件 */
	export class BoxCollider extends Collider implements Collider.Box {		
		/** !#en Position offset
		!#zh 位置偏移量 */
		offset: Vec2;		
		/** !#en Box size
		!#zh 包围盒大小 */
		size: Size;	
	}	
	/** !#en Circle Collider.
	!#zh 圆形碰撞组件 */
	export class CircleCollider extends Collider implements Collider.Circle {		
		/** !#en Position offset
		!#zh 位置偏移量 */
		offset: Vec2;		
		/** !#en Circle radius
		!#zh 圆形半径 */
		radius: number;	
	}	
	/** !#en Collider component base class.
	!#zh 碰撞组件基类 */
	export class Collider extends Component {		
		/** !#en Tag. If a node has several collider components, you can judge which type of collider is collided according to the tag.
		!#zh 标签。当一个节点上有多个碰撞组件时，在发生碰撞后，可以使用此标签来判断是节点上的哪个碰撞组件被碰撞了。 */
		tag: number;	
	}	
	/** !#en
	A simple collision manager class.
	It will calculate whether the collider collides other colliders, if collides then call the callbacks.
	!#zh
	一个简单的碰撞组件管理类，用于处理节点之间的碰撞组件是否产生了碰撞，并调用相应回调函数。 */
	export class CollisionManager implements EventTarget {		
		/** !#en
		!#zh
		是否开启碰撞管理，默认为不开启 */
		enabled: boolean;		
		/** !#en
		!#zh
		是否绘制碰撞组件的包围盒，默认为不绘制 */
		enabledDrawBoundingBox: boolean;		
		/** !#en
		!#zh
		是否绘制碰撞组件的形状，默认为不绘制 */
		enabledDebugDraw: boolean;		
		/**
		!#en Checks whether the EventTarget object has any callback registered for a specific type of event.
		!#zh 检查事件目标对象是否有为特定类型的事件注册的回调。
		@param type The type of event. 
		*/
		hasEventListener(type: string): boolean;		
		/**
		!#en
		Register an callback of a specific event type on the EventTarget.
		This type of event should be triggered via `emit`.
		!#zh
		注册事件目标的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		
		@example 
		```js
		eventTarget.on('fire', function () {
		    cc.log("fire in the hole");
		}, node);
		``` 
		*/
		on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T;		
		/**
		!#en
		Removes the listeners previously registered with the same type, callback, target and or useCapture,
		if only type is passed as parameter, all listeners registered with that type will be removed.
		!#zh
		删除之前用同类型，回调，目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
		@param type A string representing the event type being removed.
		@param callback The callback to remove.
		@param target The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
		
		@example 
		```js
		// register fire eventListener
		var callback = eventTarget.on('fire', function () {
		    cc.log("fire in the hole");
		}, target);
		// remove fire event listener
		eventTarget.off('fire', callback, target);
		// remove all fire event listeners
		eventTarget.off('fire');
		``` 
		*/
		off(type: string, callback?: Function, target?: any): void;		
		/**
		!#en Removes all callbacks previously registered with the same target (passed as parameter).
		This is not for removing all listeners in the current event target,
		and this is not for removing all listeners the target parameter have registered.
		It's only for removing all listeners (callback and target couple) registered on the current event target by the target parameter.
		!#zh 在当前 EventTarget 上删除指定目标（target 参数）注册的所有事件监听器。
		这个函数无法删除当前 EventTarget 的所有事件监听器，也无法删除 target 参数所注册的所有事件监听器。
		这个函数只能删除 target 参数在当前 EventTarget 上注册的所有事件监听器。
		@param target The target to be searched for all related listeners 
		*/
		targetOff(target: any): void;		
		/**
		!#en
		Register an callback of a specific event type on the EventTarget,
		the callback will remove itself after the first time it is triggered.
		!#zh
		注册事件目标的特定事件类型回调，回调会在第一时间被触发后删除自身。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		
		@example 
		```js
		eventTarget.once('fire', function () {
		    cc.log("this is the callback and will be invoked only once");
		}, node);
		``` 
		*/
		once(type: string, callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void, target?: any): void;		
		/**
		!#en
		Send an event with the event object.
		!#zh
		通过事件对象派发事件
		@param event event 
		*/
		dispatchEvent(event: Event): void;	
	}	
	/** !#en Intersection helper class
	!#zh 辅助类，用于测试形状与形状是否相交 */
	export class Intersection {		
		/**
		!#en Test line and line
		!#zh 测试线段与线段是否相交
		@param a1 The start point of the first line
		@param a2 The end point of the first line
		@param b1 The start point of the second line
		@param b2 The end point of the second line 
		*/
		static lineLine(a1: Vec2, a2: Vec2, b1: Vec2, b2: Vec2): boolean;		
		/**
		!#en Test line and rect
		!#zh 测试线段与矩形是否相交
		@param a1 The start point of the line
		@param a2 The end point of the line
		@param b The rect 
		*/
		static lineRect(a1: Vec2, a2: Vec2, b: Rect): boolean;		
		/**
		!#en Test line and polygon
		!#zh 测试线段与多边形是否相交
		@param a1 The start point of the line
		@param a2 The end point of the line
		@param b The polygon, a set of points 
		*/
		static linePolygon(a1: Vec2, a2: Vec2, b: Vec2[]): boolean;		
		/**
		!#en Test rect and rect
		!#zh 测试矩形与矩形是否相交
		@param a The first rect
		@param b The second rect 
		*/
		static rectRect(a: Rect, b: Rect): boolean;		
		/**
		!#en Test rect and polygon
		!#zh 测试矩形与多边形是否相交
		@param a The rect
		@param b The polygon, a set of points 
		*/
		static rectPolygon(a: Rect, b: Vec2[]): boolean;		
		/**
		!#en Test polygon and polygon
		!#zh 测试多边形与多边形是否相交
		@param a The first polygon, a set of points
		@param b The second polygon, a set of points 
		*/
		static polygonPolygon(a: Vec2[], b: Vec2[]): boolean;		
		/**
		!#en Test circle and circle
		!#zh 测试圆形与圆形是否相交
		@param a Object contains position and radius
		@param b Object contains position and radius 
		*/
		static circleCircle(a: {position: Vec2, radius: number}, b: {position: Vec2, radius: number}): boolean;		
		/**
		!#en Test polygon and circle
		!#zh 测试矩形与圆形是否相交
		@param polygon The Polygon, a set of points
		@param circle Object contains position and radius 
		*/
		static polygonCircle(polygon: Vec2[], circle: {position: Vec2, radius: number}): boolean;		
		/**
		!#en Test whether the point is in the polygon
		!#zh 测试一个点是否在一个多边形中
		@param point The point
		@param polygon The polygon, a set of points 
		*/
		static pointInPolygon(point: Vec2, polygon: Vec2[]): boolean;		
		/**
		!#en Calculate the distance of point to line.
		!#zh 计算点到直线的距离。如果这是一条线段并且垂足不在线段内，则会计算点到线段端点的距离。
		@param point The point
		@param start The start point of line
		@param end The end point of line
		@param isSegment whether this line is a segment 
		*/
		static pointLineDistance(point: Vec2, start: Vec2, end: Vec2, isSegment: boolean): number;	
	}	
	/** !#en Polygon Collider.
	!#zh 多边形碰撞组件 */
	export class PolygonCollider extends Collider implements Collider.Polygon {		
		/** !#en Position offset
		!#zh 位置偏移量 */
		offset: Vec2;		
		/** !#en Polygon points
		!#zh 多边形顶点数组 */
		points: Vec2[];	
	}	
	/** !#en The Light Component
	
	!#zh 光源组件 */
	export class Light extends Component {	
	}	
	/** !#en
	Base class for handling assets used in Creator.<br/>
	
	You may want to override:<br/>
	- createNode<br/>
	- getset functions of _nativeAsset<br/>
	- cc.Object._serialize<br/>
	- cc.Object._deserialize<br/>
	!#zh
	Creator 中的资源基类。<br/>
	
	您可能需要重写：<br/>
	- createNode <br/>
	- _nativeAsset 的 getset 方法<br/>
	- cc.Object._serialize<br/>
	- cc.Object._deserialize<br/> */
	export class Asset extends RawAsset {		
		/** !#en
		Whether the asset is loaded or not
		!#zh
		该资源是否已经成功加载 */
		loaded: boolean;		
		/** !#en
		Points to the true url of this asset's native object, only valid when asset is loaded and asyncLoadAsset is not enabled.
		The difference between nativeUrl and url is that the latter is final path, there is no needs to transform url by md5 and subpackage.
		Besides, url may points to temporary path or cached path on mini game platform which has cache mechanism (WeChat etc).
		If you want to make use of the native file on those platforms, you should use url instead of nativeUrl.
		
		!#zh
		资源的原生文件的真实url，只在资源被加载后以及没有启用延迟加载时才有效。 nativeUrl 与 url 的区别在于，url 是资源最终路径，所以 url 不需要再经过 md5 以及子包的路径转换，
		另外某些带缓存机制的小游戏平台（微信等）上url可能会指向临时文件路径或者缓存路径，如果你需要在这些平台上使用资源的原生文件，请使用url，避免使用nativeUrl */
		url: string;		
		/** !#en
		Returns the url of this asset's native object, if none it will returns an empty string.
		!#zh
		返回该资源对应的目标平台资源的 URL，如果没有将返回一个空字符串。 */
		nativeUrl: string;		
		/** !#en Indicates whether its dependent raw assets can support deferred load if the owner scene (or prefab) is marked as `asyncLoadAssets`.
		!#zh 当场景或 Prefab 被标记为 `asyncLoadAssets`，禁止延迟加载该资源所依赖的其它 RawAsset。 */
		static preventDeferredLoadDependents: boolean;		
		/** !#en Indicates whether its native object should be preloaded from native url.
		!#zh 禁止预加载原生对象。 */
		static preventPreloadNativeObject: boolean;		
		/**
		Returns the asset's url.
		
		The `Asset` object overrides the `toString()` method of the `Object` object.
		For `Asset` objects, the toString() method returns a string representation of the object.
		JavaScript calls the toString() method automatically when an asset is to be represented as a text value or when a texture is referred to in a string concatenation. 
		*/
		toString(): string;		
		/**
		!#en
		Create a new node using this asset in the scene.<br/>
		If this type of asset dont have its corresponding node type, this method should be null.
		!#zh
		使用该资源在场景中创建一个新节点。<br/>
		如果这类资源没有相应的节点类型，该方法应该是空的。
		@param callback callback 
		*/
		createNode(callback: (error: string, node: any) => void): void;	
	}	
	/** !#en Class for audio data handling.
	!#zh 音频资源类。 */
	export class AudioClip extends Asset implements EventTarget {		
		/**
		!#en Checks whether the EventTarget object has any callback registered for a specific type of event.
		!#zh 检查事件目标对象是否有为特定类型的事件注册的回调。
		@param type The type of event. 
		*/
		hasEventListener(type: string): boolean;		
		/**
		!#en
		Register an callback of a specific event type on the EventTarget.
		This type of event should be triggered via `emit`.
		!#zh
		注册事件目标的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		
		@example 
		```js
		eventTarget.on('fire', function () {
		    cc.log("fire in the hole");
		}, node);
		``` 
		*/
		on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T;		
		/**
		!#en
		Removes the listeners previously registered with the same type, callback, target and or useCapture,
		if only type is passed as parameter, all listeners registered with that type will be removed.
		!#zh
		删除之前用同类型，回调，目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
		@param type A string representing the event type being removed.
		@param callback The callback to remove.
		@param target The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
		
		@example 
		```js
		// register fire eventListener
		var callback = eventTarget.on('fire', function () {
		    cc.log("fire in the hole");
		}, target);
		// remove fire event listener
		eventTarget.off('fire', callback, target);
		// remove all fire event listeners
		eventTarget.off('fire');
		``` 
		*/
		off(type: string, callback?: Function, target?: any): void;		
		/**
		!#en Removes all callbacks previously registered with the same target (passed as parameter).
		This is not for removing all listeners in the current event target,
		and this is not for removing all listeners the target parameter have registered.
		It's only for removing all listeners (callback and target couple) registered on the current event target by the target parameter.
		!#zh 在当前 EventTarget 上删除指定目标（target 参数）注册的所有事件监听器。
		这个函数无法删除当前 EventTarget 的所有事件监听器，也无法删除 target 参数所注册的所有事件监听器。
		这个函数只能删除 target 参数在当前 EventTarget 上注册的所有事件监听器。
		@param target The target to be searched for all related listeners 
		*/
		targetOff(target: any): void;		
		/**
		!#en
		Register an callback of a specific event type on the EventTarget,
		the callback will remove itself after the first time it is triggered.
		!#zh
		注册事件目标的特定事件类型回调，回调会在第一时间被触发后删除自身。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		
		@example 
		```js
		eventTarget.once('fire', function () {
		    cc.log("this is the callback and will be invoked only once");
		}, node);
		``` 
		*/
		once(type: string, callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void, target?: any): void;		
		/**
		!#en
		Send an event with the event object.
		!#zh
		通过事件对象派发事件
		@param event event 
		*/
		dispatchEvent(event: Event): void;	
	}	
	/** !#en Class for BitmapFont handling.
	!#zh 位图字体资源类。 */
	export class BitmapFont extends Font {	
	}	
	/** undefined */
	export class BufferAsset extends Asset {	
	}	
	/** !#en
	Class for JSON file. When the JSON file is loaded, this object is returned.
	The parsed JSON object can be accessed through the `json` attribute in it.<br>
	If you want to get the original JSON text, you should modify the extname to `.txt`
	so that it is loaded as a `TextAsset` instead of a `JsonAsset`.
	
	!#zh
	JSON 资源类。JSON 文件加载后，将会返回该对象。可以通过其中的 `json` 属性访问解析后的 JSON 对象。<br>
	如果你想要获得 JSON 的原始文本，那么应该修改源文件的后缀为 `.txt`，这样就会加载为一个 `TextAsset` 而不是 `JsonAsset`。 */
	export class JsonAsset extends Asset {		
		/** The loaded JSON object. */
		json: any;	
	}	
	/** !#en Class for Font handling.
	!#zh 字体资源类。 */
	export class Font extends Asset {	
	}	
	/** !#en Class for LabelAtlas handling.
	!#zh 艺术数字字体资源类。 */
	export class LabelAtlas extends BitmapFont {	
	}	
	/** !#en Class for prefab handling.
	!#zh 预制资源类。 */
	export class Prefab extends Asset {		
		/** the main cc.Node in the prefab */
		data: Node;		
		/** !#zh
		设置实例化这个 prefab 时所用的优化策略。根据使用情况设置为合适的值，能优化该 prefab 实例化所用的时间。
		!#en
		Indicates the optimization policy for instantiating this prefab.
		Set to a suitable value based on usage, can optimize the time it takes to instantiate this prefab. */
		optimizationPolicy: Prefab.OptimizationPolicy;		
		/** !#en Indicates the raw assets of this prefab can be load after prefab loaded.
		!#zh 指示该 Prefab 依赖的资源可否在 Prefab 加载后再延迟加载。 */
		asyncLoadAssets: boolean;		
		readonly: boolean;		
		/**
		Dynamically translation prefab data into minimized code.<br/>
		This method will be called automatically before the first time the prefab being instantiated,
		but you can re-call to refresh the create function once you modified the original prefab data in script. 
		*/
		compileCreateFunction(): void;	
	}	
	/** !#en
	The base class for registering asset types.
	!#zh
	注册用的资源基类。 */
	export class RawAsset extends Object {	
	}	
	/** Render textures are textures that can be rendered to. */
	export class RenderTexture extends Texture2D {		
		/**
		!#en
		Init the render texture with size.
		!#zh
		初始化 render texture
		@param width width
		@param height height
		@param depthStencilFormat depthStencilFormat 
		*/
		initWithSize(width?: number, height?: number, depthStencilFormat?: number): void;		
		/**
		!#en
		Get pixels from render texture, the pixels data stores in a RGBA Uint8Array.
		It will return a new (width * height * 4) length Uint8Array by default。
		You can specify a data to store the pixels to reuse the data,
		you and can specify other params to specify the texture region to read.
		!#zh
		从 render texture 读取像素数据，数据类型为 RGBA 格式的 Uint8Array 数组。
		默认每次调用此函数会生成一个大小为 （长 x 高 x 4） 的 Uint8Array。
		你可以通过传入 data 来接收像素数据，也可以通过传参来指定需要读取的区域的像素。
		@param data data
		@param x x
		@param y y
		@param w w
		@param h h 
		*/
		readPixels(data?: Uint8Array, x?: number, y?: number, w?: number, h?: number): Uint8Array;	
	}	
	/** !#en Class for scene handling.
	!#zh 场景资源类。 */
	export class SceneAsset extends Asset {		
		scene: Scene;		
		/** !#en Indicates the raw assets of this scene can be load after scene launched.
		!#zh 指示该场景依赖的资源可否在场景切换后再延迟加载。 */
		asyncLoadAssets: boolean;	
	}	
	/** !#en Class for script handling.
	!#zh Script 资源类。 */
	export class _Script extends Asset {	
	}	
	/** !#en Class for JavaScript handling.
	!#zh JavaScript 资源类。 */
	export class _JavaScript extends Asset {	
	}	
	/** !#en Class for coffeescript handling.
	!#zh CoffeeScript 资源类。 */
	export class CoffeeScript extends Asset {	
	}	
	/** !#en Class for TypeScript handling.
	!#zh TypeScript 资源类。 */
	export class TypeScript extends Asset {	
	}	
	/** !#en Class for sprite atlas handling.
	!#zh 精灵图集资源类。 */
	export class SpriteAtlas extends Asset {		
		/**
		Returns the texture of the sprite atlas 
		*/
		getTexture(): Texture2D;		
		/**
		Returns the sprite frame correspond to the given key in sprite atlas.
		@param key key 
		*/
		getSpriteFrame(key: string): SpriteFrame;		
		/**
		Returns the sprite frames in sprite atlas. 
		*/
		getSpriteFrames(): SpriteFrame[];	
	}	
	/** !#en
	A cc.SpriteFrame has:<br/>
	 - texture: A cc.Texture2D that will be used by render components<br/>
	 - rectangle: A rectangle of the texture
	
	!#zh
	一个 SpriteFrame 包含：<br/>
	 - 纹理：会被渲染组件使用的 Texture2D 对象。<br/>
	 - 矩形：在纹理中的矩形区域。 */
	export class SpriteFrame extends Asset implements EventTarget {		
		/** !#en Top border of the sprite
		!#zh sprite 的顶部边框 */
		insetTop: number;		
		/** !#en Bottom border of the sprite
		!#zh sprite 的底部边框 */
		insetBottom: number;		
		/** !#en Left border of the sprite
		!#zh sprite 的左边边框 */
		insetLeft: number;		
		/** !#en Right border of the sprite
		!#zh sprite 的左边边框 */
		insetRight: number;		
		/**
		!#en
		Constructor of SpriteFrame class.
		!#zh
		SpriteFrame 类的构造函数。
		@param filename filename
		@param rect rect
		@param rotated Whether the frame is rotated in the texture
		@param offset The offset of the frame in the texture
		@param originalSize The size of the frame in the texture 
		*/
		constructor(filename?: string|Texture2D, rect?: Rect, rotated?: boolean, offset?: Vec2, originalSize?: Size);		
		/**
		!#en Returns whether the texture have been loaded
		!#zh 返回是否已加载纹理 
		*/
		textureLoaded(): boolean;		
		/**
		!#en Returns whether the sprite frame is rotated in the texture.
		!#zh 获取 SpriteFrame 是否旋转 
		*/
		isRotated(): boolean;		
		/**
		!#en Set whether the sprite frame is rotated in the texture.
		!#zh 设置 SpriteFrame 是否旋转
		@param bRotated bRotated 
		*/
		setRotated(bRotated: boolean): void;		
		/**
		!#en Returns whether the sprite frame is flip x axis in the texture.
		!#zh 获取 SpriteFrame 是否反转 x 轴 
		*/
		isFlipX(): boolean;		
		/**
		!#en Returns whether the sprite frame is flip y axis in the texture.
		!#zh 获取 SpriteFrame 是否反转 y 轴 
		*/
		isFlipY(): boolean;		
		/**
		!#en Set whether the sprite frame is flip x axis in the texture.
		!#zh 设置 SpriteFrame 是否翻转 x 轴
		@param flipX flipX 
		*/
		setFlipX(flipX: boolean): void;		
		/**
		!#en Set whether the sprite frame is flip y axis in the texture.
		!#zh 设置 SpriteFrame 是否翻转 y 轴
		@param flipY flipY 
		*/
		setFlipY(flipY: boolean): void;		
		/**
		!#en Returns the rect of the sprite frame in the texture.
		!#zh 获取 SpriteFrame 的纹理矩形区域 
		*/
		getRect(): Rect;		
		/**
		!#en Sets the rect of the sprite frame in the texture.
		!#zh 设置 SpriteFrame 的纹理矩形区域
		@param rect rect 
		*/
		setRect(rect: Rect): void;		
		/**
		!#en Returns the original size of the trimmed image.
		!#zh 获取修剪前的原始大小 
		*/
		getOriginalSize(): Size;		
		/**
		!#en Sets the original size of the trimmed image.
		!#zh 设置修剪前的原始大小
		@param size size 
		*/
		setOriginalSize(size: Size): void;		
		/**
		!#en Returns the texture of the frame.
		!#zh 获取使用的纹理实例 
		*/
		getTexture(): Texture2D;		
		/**
		!#en Returns the offset of the frame in the texture.
		!#zh 获取偏移量 
		*/
		getOffset(): Vec2;		
		/**
		!#en Sets the offset of the frame in the texture.
		!#zh 设置偏移量
		@param offsets offsets 
		*/
		setOffset(offsets: Vec2): void;		
		/**
		!#en Clone the sprite frame.
		!#zh 克隆 SpriteFrame 
		*/
		clone(): SpriteFrame;		
		/**
		!#en Set SpriteFrame with Texture, rect, rotated, offset and originalSize.<br/>
		!#zh 通过 Texture，rect，rotated，offset 和 originalSize 设置 SpriteFrame。
		@param textureOrTextureFile textureOrTextureFile
		@param rect rect
		@param rotated rotated
		@param offset offset
		@param originalSize originalSize 
		*/
		setTexture(textureOrTextureFile: string|Texture2D, rect?: Rect, rotated?: boolean, offset?: Vec2, originalSize?: Size): boolean;		
		/**
		!#en If a loading scene (or prefab) is marked as `asyncLoadAssets`, all the textures of the SpriteFrame which
		associated by user's custom Components in the scene, will not preload automatically.
		These textures will be load when Sprite component is going to render the SpriteFrames.
		You can call this method if you want to load the texture early.
		!#zh 当加载中的场景或 Prefab 被标记为 `asyncLoadAssets` 时，用户在场景中由自定义组件关联到的所有 SpriteFrame 的贴图都不会被提前加载。
		只有当 Sprite 组件要渲染这些 SpriteFrame 时，才会检查贴图是否加载。如果你希望加载过程提前，你可以手工调用这个方法。
		
		@example 
		```js
		if (spriteFrame.textureLoaded()) {
		    this._onSpriteFrameLoaded();
		}
		else {
		    spriteFrame.once('load', this._onSpriteFrameLoaded, this);
		    spriteFrame.ensureLoadTexture();
		}
		``` 
		*/
		ensureLoadTexture(): void;		
		/**
		!#en
		If you do not need to use the SpriteFrame temporarily, you can call this method so that its texture could be garbage collected. Then when you need to render the SpriteFrame, you should call `ensureLoadTexture` manually to reload texture.
		!#zh
		当你暂时不再使用这个 SpriteFrame 时，可以调用这个方法来保证引用的贴图对象能被 GC。然后当你要渲染 SpriteFrame 时，你需要手动调用 `ensureLoadTexture` 来重新加载贴图。 
		*/
		clearTexture(): void;		
		/**
		!#en Checks whether the EventTarget object has any callback registered for a specific type of event.
		!#zh 检查事件目标对象是否有为特定类型的事件注册的回调。
		@param type The type of event. 
		*/
		hasEventListener(type: string): boolean;		
		/**
		!#en
		Register an callback of a specific event type on the EventTarget.
		This type of event should be triggered via `emit`.
		!#zh
		注册事件目标的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		
		@example 
		```js
		eventTarget.on('fire', function () {
		    cc.log("fire in the hole");
		}, node);
		``` 
		*/
		on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T;		
		/**
		!#en
		Removes the listeners previously registered with the same type, callback, target and or useCapture,
		if only type is passed as parameter, all listeners registered with that type will be removed.
		!#zh
		删除之前用同类型，回调，目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
		@param type A string representing the event type being removed.
		@param callback The callback to remove.
		@param target The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
		
		@example 
		```js
		// register fire eventListener
		var callback = eventTarget.on('fire', function () {
		    cc.log("fire in the hole");
		}, target);
		// remove fire event listener
		eventTarget.off('fire', callback, target);
		// remove all fire event listeners
		eventTarget.off('fire');
		``` 
		*/
		off(type: string, callback?: Function, target?: any): void;		
		/**
		!#en Removes all callbacks previously registered with the same target (passed as parameter).
		This is not for removing all listeners in the current event target,
		and this is not for removing all listeners the target parameter have registered.
		It's only for removing all listeners (callback and target couple) registered on the current event target by the target parameter.
		!#zh 在当前 EventTarget 上删除指定目标（target 参数）注册的所有事件监听器。
		这个函数无法删除当前 EventTarget 的所有事件监听器，也无法删除 target 参数所注册的所有事件监听器。
		这个函数只能删除 target 参数在当前 EventTarget 上注册的所有事件监听器。
		@param target The target to be searched for all related listeners 
		*/
		targetOff(target: any): void;		
		/**
		!#en
		Register an callback of a specific event type on the EventTarget,
		the callback will remove itself after the first time it is triggered.
		!#zh
		注册事件目标的特定事件类型回调，回调会在第一时间被触发后删除自身。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		
		@example 
		```js
		eventTarget.once('fire', function () {
		    cc.log("this is the callback and will be invoked only once");
		}, node);
		``` 
		*/
		once(type: string, callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void, target?: any): void;		
		/**
		!#en
		Send an event with the event object.
		!#zh
		通过事件对象派发事件
		@param event event 
		*/
		dispatchEvent(event: Event): void;	
	}	
	/** !#en Class for TTFFont handling.
	!#zh TTF 字体资源类。 */
	export class TTFFont extends Font {	
	}	
	/** !#en Class for text file.
	!#zh 文本资源类。 */
	export class TextAsset extends Asset {		
		/** The text contents of the resource. */
		text: string;	
	}	
	/** This class allows to easily create OpenGL or Canvas 2D textures from images or raw data. */
	export class Texture2D extends Asset implements EventTarget {		
		/** !#en Sets whether generate mipmaps for the texture
		!#zh 是否为纹理设置生成 mipmaps。 */
		genMipmaps: boolean;		
		/** !#en
		Sets whether texture can be packed into texture atlas.
		If need use texture uv in custom Effect, please sets packable to false.
		!#zh
		设置纹理是否允许参与合图。
		如果需要在自定义 Effect 中使用纹理 UV，需要禁止该选项。 */
		packable: boolean;		
		/** !#en
		Whether the texture is loaded or not
		!#zh
		贴图是否已经成功加载 */
		loaded: boolean;		
		/** !#en
		Texture width in pixel
		!#zh
		贴图像素宽度 */
		width: number;		
		/** !#en
		Texture height in pixel
		!#zh
		贴图像素高度 */
		height: number;		
		/**
		!#en
		Get renderer texture implementation object
		extended from render.Texture2D
		!#zh  返回渲染器内部贴图对象 
		*/
		getImpl(): void;		
		/**
		Update texture options, not available in Canvas render mode.
		image, format, premultiplyAlpha can not be updated in native.
		@param options options 
		*/
		update(options: {image: DOMImageElement; genMipmaps: boolean; format: Texture2D.PixelFormat; minFilter: Texture2D.Filter; magFilter: Texture2D.Filter; wrapS: WrapMode; wrapT: WrapMode; premultiplyAlpha: boolean; }): void;		
		/**
		!#en
		Init with HTML element.
		!#zh 用 HTML Image 或 Canvas 对象初始化贴图。
		@param element element
		
		@example 
		```js
		var img = new Image();
		img.src = dataURL;
		texture.initWithElement(img);
		``` 
		*/
		initWithElement(element: HTMLImageElement|HTMLCanvasElement): void;		
		/**
		!#en
		Intializes with a texture2d with data in Uint8Array.
		!#zh 使用一个存储在 Unit8Array 中的图像数据（raw data）初始化数据。
		@param data data
		@param pixelFormat pixelFormat
		@param pixelsWidth pixelsWidth
		@param pixelsHeight pixelsHeight 
		*/
		initWithData(data: DataView, pixelFormat: number, pixelsWidth: number, pixelsHeight: number): boolean;		
		/**
		!#en
		HTMLElement Object getter, available only on web.<br/>
		Note: texture is packed into texture atlas by default<br/>
		you should set texture.packable as false before getting Html element object.
		!#zh 获取当前贴图对应的 HTML Image 或 Canvas 对象，只在 Web 平台下有效。<br/>
		注意：<br/>
		texture 默认参与动态合图，如果需要获取到正确的 Html 元素对象，需要先设置 texture.packable 为 false 
		*/
		getHtmlElementObj(): HTMLImageElement;		
		/**
		!#en
		Destory this texture and immediately release its video memory. (Inherit from cc.Object.destroy)<br>
		After destroy, this object is not usable any more.
		You can use cc.isValid(obj) to check whether the object is destroyed before accessing it.
		!#zh
		销毁该贴图，并立即释放它对应的显存。（继承自 cc.Object.destroy）<br/>
		销毁后，该对象不再可用。您可以在访问对象之前使用 cc.isValid(obj) 来检查对象是否已被销毁。 
		*/
		destroy(): boolean;		
		/**
		!#en
		Pixel format of the texture.
		!#zh 获取纹理的像素格式。 
		*/
		getPixelFormat(): number;		
		/**
		!#en
		Whether or not the texture has their Alpha premultiplied.
		!#zh 检查纹理在上传 GPU 时预乘选项是否开启。 
		*/
		hasPremultipliedAlpha(): boolean;		
		/**
		!#en
		Handler of texture loaded event.
		Since v2.0, you don't need to invoke this function, it will be invoked automatically after texture loaded.
		!#zh 贴图加载事件处理器。v2.0 之后你将不在需要手动执行这个函数，它会在贴图加载成功之后自动执行。
		@param premultiplied premultiplied 
		*/
		handleLoadedTexture(premultiplied?: boolean): void;		
		/**
		!#en
		Description of cc.Texture2D.
		!#zh cc.Texture2D 描述。 
		*/
		description(): string;		
		/**
		!#en
		Release texture, please use destroy instead.
		!#zh 释放纹理，请使用 destroy 替代。 
		*/
		releaseTexture(): void;		
		/**
		!#en Sets the wrap s and wrap t options. <br/>
		If the texture size is NPOT (non power of 2), then in can only use gl.CLAMP_TO_EDGE in gl.TEXTURE_WRAP_{S,T}.
		!#zh 设置纹理包装模式。
		若纹理贴图尺寸是 NPOT（non power of 2），则只能使用 Texture2D.WrapMode.CLAMP_TO_EDGE。
		@param wrapS wrapS
		@param wrapT wrapT 
		*/
		setTexParameters(wrapS: Texture2D.WrapMode, wrapT: Texture2D.WrapMode): void;		
		/**
		!#en Sets the minFilter and magFilter options
		!#zh 设置纹理贴图缩小和放大过滤器算法选项。
		@param minFilter minFilter
		@param magFilter magFilter 
		*/
		setFilters(minFilter: Texture2D.Filter, magFilter: Texture2D.Filter): void;		
		/**
		!#en
		Sets the flipY options
		!#zh 设置贴图的纵向翻转选项。
		@param flipY flipY 
		*/
		setFlipY(flipY: boolean): void;		
		/**
		!#en
		Sets the premultiply alpha options
		!#zh 设置贴图的预乘选项。
		@param premultiply premultiply 
		*/
		setPremultiplyAlpha(premultiply: boolean): void;		
		/**
		!#en Checks whether the EventTarget object has any callback registered for a specific type of event.
		!#zh 检查事件目标对象是否有为特定类型的事件注册的回调。
		@param type The type of event. 
		*/
		hasEventListener(type: string): boolean;		
		/**
		!#en
		Register an callback of a specific event type on the EventTarget.
		This type of event should be triggered via `emit`.
		!#zh
		注册事件目标的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		
		@example 
		```js
		eventTarget.on('fire', function () {
		    cc.log("fire in the hole");
		}, node);
		``` 
		*/
		on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T;		
		/**
		!#en
		Removes the listeners previously registered with the same type, callback, target and or useCapture,
		if only type is passed as parameter, all listeners registered with that type will be removed.
		!#zh
		删除之前用同类型，回调，目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
		@param type A string representing the event type being removed.
		@param callback The callback to remove.
		@param target The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
		
		@example 
		```js
		// register fire eventListener
		var callback = eventTarget.on('fire', function () {
		    cc.log("fire in the hole");
		}, target);
		// remove fire event listener
		eventTarget.off('fire', callback, target);
		// remove all fire event listeners
		eventTarget.off('fire');
		``` 
		*/
		off(type: string, callback?: Function, target?: any): void;		
		/**
		!#en Removes all callbacks previously registered with the same target (passed as parameter).
		This is not for removing all listeners in the current event target,
		and this is not for removing all listeners the target parameter have registered.
		It's only for removing all listeners (callback and target couple) registered on the current event target by the target parameter.
		!#zh 在当前 EventTarget 上删除指定目标（target 参数）注册的所有事件监听器。
		这个函数无法删除当前 EventTarget 的所有事件监听器，也无法删除 target 参数所注册的所有事件监听器。
		这个函数只能删除 target 参数在当前 EventTarget 上注册的所有事件监听器。
		@param target The target to be searched for all related listeners 
		*/
		targetOff(target: any): void;		
		/**
		!#en
		Register an callback of a specific event type on the EventTarget,
		the callback will remove itself after the first time it is triggered.
		!#zh
		注册事件目标的特定事件类型回调，回调会在第一时间被触发后删除自身。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		
		@example 
		```js
		eventTarget.once('fire', function () {
		    cc.log("this is the callback and will be invoked only once");
		}, node);
		``` 
		*/
		once(type: string, callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void, target?: any): void;		
		/**
		!#en
		Send an event with the event object.
		!#zh
		通过事件对象派发事件
		@param event event 
		*/
		dispatchEvent(event: Event): void;	
	}	
	/** !#en
	EventTarget is an object to which an event is dispatched when something has occurred.
	Entity are the most common event targets, but other objects can be event targets too.
	
	Event targets are an important part of the Fireball event model.
	The event target serves as the focal point for how events flow through the scene graph.
	When an event such as a mouse click or a keypress occurs, Fireball dispatches an event object
	into the event flow from the root of the hierarchy. The event object then makes its way through
	the scene graph until it reaches the event target, at which point it begins its return trip through
	the scene graph. This round-trip journey to the event target is conceptually divided into three phases:
	- The capture phase comprises the journey from the root to the last node before the event target's node
	- The target phase comprises only the event target node
	- The bubbling phase comprises any subsequent nodes encountered on the return trip to the root of the tree
	See also: http://www.w3.org/TR/DOM-Level-3-Events/#event-flow
	
	Event targets can implement the following methods:
	 - _getCapturingTargets
	 - _getBubblingTargets
	
	!#zh
	事件目标是事件触发时，分派的事件对象，Node 是最常见的事件目标，
	但是其他对象也可以是事件目标。<br/> */
	export class EventTarget extends CallbacksInvoker {		
		/**
		!#en Checks whether the EventTarget object has any callback registered for a specific type of event.
		!#zh 检查事件目标对象是否有为特定类型的事件注册的回调。
		@param type The type of event. 
		*/
		hasEventListener(type: string): boolean;		
		/**
		!#en
		Register an callback of a specific event type on the EventTarget.
		This type of event should be triggered via `emit`.
		!#zh
		注册事件目标的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		
		@example 
		```js
		eventTarget.on('fire', function () {
		    cc.log("fire in the hole");
		}, node);
		``` 
		*/
		on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T;		
		/**
		!#en
		Removes the listeners previously registered with the same type, callback, target and or useCapture,
		if only type is passed as parameter, all listeners registered with that type will be removed.
		!#zh
		删除之前用同类型，回调，目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
		@param type A string representing the event type being removed.
		@param callback The callback to remove.
		@param target The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
		
		@example 
		```js
		// register fire eventListener
		var callback = eventTarget.on('fire', function () {
		    cc.log("fire in the hole");
		}, target);
		// remove fire event listener
		eventTarget.off('fire', callback, target);
		// remove all fire event listeners
		eventTarget.off('fire');
		``` 
		*/
		off(type: string, callback?: Function, target?: any): void;		
		/**
		!#en Removes all callbacks previously registered with the same target (passed as parameter).
		This is not for removing all listeners in the current event target,
		and this is not for removing all listeners the target parameter have registered.
		It's only for removing all listeners (callback and target couple) registered on the current event target by the target parameter.
		!#zh 在当前 EventTarget 上删除指定目标（target 参数）注册的所有事件监听器。
		这个函数无法删除当前 EventTarget 的所有事件监听器，也无法删除 target 参数所注册的所有事件监听器。
		这个函数只能删除 target 参数在当前 EventTarget 上注册的所有事件监听器。
		@param target The target to be searched for all related listeners 
		*/
		targetOff(target: any): void;		
		/**
		!#en
		Register an callback of a specific event type on the EventTarget,
		the callback will remove itself after the first time it is triggered.
		!#zh
		注册事件目标的特定事件类型回调，回调会在第一时间被触发后删除自身。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		
		@example 
		```js
		eventTarget.once('fire', function () {
		    cc.log("this is the callback and will be invoked only once");
		}, node);
		``` 
		*/
		once(type: string, callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void, target?: any): void;		
		/**
		!#en
		Send an event with the event object.
		!#zh
		通过事件对象派发事件
		@param event event 
		*/
		dispatchEvent(event: Event): void;	
	}	
	/** !#en Base class of all kinds of events.
	!#zh 包含事件相关信息的对象。 */
	export class Event {		
		/**
		
		@param type The name of the event (case-sensitive), e.g. "click", "fire", or "submit"
		@param bubbles A boolean indicating whether the event bubbles up through the tree or not 
		*/
		constructor(type: string, bubbles: boolean);		
		/** !#en The name of the event (case-sensitive), e.g. "click", "fire", or "submit".
		!#zh 事件类型。 */
		type: string;		
		/** !#en Indicate whether the event bubbles up through the tree or not.
		!#zh 表示该事件是否进行冒泡。 */
		bubbles: boolean;		
		/** !#en A reference to the target to which the event was originally dispatched.
		!#zh 最初事件触发的目标 */
		target: any;		
		/** !#en A reference to the currently registered target for the event.
		!#zh 当前目标 */
		currentTarget: any;		
		/** !#en
		Indicates which phase of the event flow is currently being evaluated.
		Returns an integer value represented by 4 constants:
		 - Event.NONE = 0
		 - Event.CAPTURING_PHASE = 1
		 - Event.AT_TARGET = 2
		 - Event.BUBBLING_PHASE = 3
		The phases are explained in the [section 3.1, Event dispatch and DOM event flow]
		(http://www.w3.org/TR/DOM-Level-3-Events/#event-flow), of the DOM Level 3 Events specification.
		!#zh 事件阶段 */
		eventPhase: number;		
		/**
		!#en Reset the event for being stored in the object pool.
		!#zh 重置对象池中存储的事件。 
		*/
		unuse(): string;		
		/**
		!#en Reuse the event for being used again by the object pool.
		!#zh 用于对象池再次使用的事件。 
		*/
		reuse(): string;		
		/**
		!#en Stops propagation for current event.
		!#zh 停止传递当前事件。 
		*/
		stopPropagation(): void;		
		/**
		!#en Stops propagation for current event immediately,
		the event won't even be dispatched to the listeners attached in the current target.
		!#zh 立即停止当前事件的传递，事件甚至不会被分派到所连接的当前目标。 
		*/
		stopPropagationImmediate(): void;		
		/**
		!#en Checks whether the event has been stopped.
		!#zh 检查该事件是否已经停止传递. 
		*/
		isStopped(): boolean;		
		/**
		!#en
		<p>
		    Gets current target of the event                                                            <br/>
		    note: It only be available when the event listener is associated with node.                <br/>
		         It returns 0 when the listener is associated with fixed priority.
		</p>
		!#zh 获取当前目标节点 
		*/
		getCurrentTarget(): Node;		
		/**
		!#en Gets the event type.
		!#zh 获取事件类型 
		*/
		getType(): string;		
		/** !#en Code for event without type.
		!#zh 没有类型的事件 */
		static NO_TYPE: string;		
		/** !#en The type code of Touch event.
		!#zh 触摸事件类型 */
		static TOUCH: string;		
		/** !#en The type code of Mouse event.
		!#zh 鼠标事件类型 */
		static MOUSE: string;		
		/** !#en The type code of Keyboard event.
		!#zh 键盘事件类型 */
		static KEYBOARD: string;		
		/** !#en The type code of Acceleration event.
		!#zh 加速器事件类型 */
		static ACCELERATION: string;		
		/** !#en Events not currently dispatched are in this phase
		!#zh 尚未派发事件阶段 */
		static NONE: number;		
		/** !#en
		The capturing phase comprises the journey from the root to the last node before the event target's node
		see http://www.w3.org/TR/DOM-Level-3-Events/#event-flow
		!#zh 捕获阶段，包括事件目标节点之前从根节点到最后一个节点的过程。 */
		static CAPTURING_PHASE: number;		
		/** !#en
		The target phase comprises only the event target node
		see http://www.w3.org/TR/DOM-Level-3-Events/#event-flow
		!#zh 目标阶段仅包括事件目标节点。 */
		static AT_TARGET: number;		
		/** !#en
		The bubbling phase comprises any subsequent nodes encountered on the return trip to the root of the hierarchy
		see http://www.w3.org/TR/DOM-Level-3-Events/#event-flow
		!#zh 冒泡阶段， 包括回程遇到到层次根节点的任何后续节点。 */
		static BUBBLING_PHASE: number;	
	}	
	/** !#en
	The System event, it currently supports keyboard events and accelerometer events.<br>
	You can get the SystemEvent instance with cc.systemEvent.<br>
	!#zh
	系统事件，它目前支持按键事件和重力感应事件。<br>
	你可以通过 cc.systemEvent 获取到 SystemEvent 的实例。<br> */
	export class SystemEvent extends EventTarget {		
		/**
		!#en whether enable accelerometer event
		!#zh 是否启用加速度计事件
		@param isEnable isEnable 
		*/
		setAccelerometerEnabled(isEnable: boolean): void;		
		/**
		!#en set accelerometer interval value
		!#zh 设置加速度计间隔值
		@param interval interval 
		*/
		setAccelerometerInterval(interval: number): void;	
	}	
	/** !#en The touch event class
	!#zh 封装了触摸相关的信息。 */
	export class Touch {		
		/**
		!#en Returns the current touch location in OpenGL coordinates.、
		!#zh 获取当前触点位置。 
		*/
		getLocation(): Vec2;		
		/**
		!#en Returns X axis location value.
		!#zh 获取当前触点 X 轴位置。 
		*/
		getLocationX(): number;		
		/**
		!#en Returns Y axis location value.
		!#zh 获取当前触点 Y 轴位置。 
		*/
		getLocationY(): number;		
		/**
		!#en Returns the previous touch location in OpenGL coordinates.
		!#zh 获取触点在上一次事件时的位置对象，对象包含 x 和 y 属性。 
		*/
		getPreviousLocation(): Vec2;		
		/**
		!#en Returns the start touch location in OpenGL coordinates.
		!#zh 获取触点落下时的位置对象，对象包含 x 和 y 属性。 
		*/
		getStartLocation(): Vec2;		
		/**
		!#en Returns the delta distance from the previous touche to the current one in screen coordinates.
		!#zh 获取触点距离上一次事件移动的距离对象，对象包含 x 和 y 属性。 
		*/
		getDelta(): Vec2;		
		/**
		!#en Returns the current touch location in screen coordinates.
		!#zh 获取当前事件在游戏窗口内的坐标位置对象，对象包含 x 和 y 属性。 
		*/
		getLocationInView(): Vec2;		
		/**
		!#en Returns the previous touch location in screen coordinates.
		!#zh 获取触点在上一次事件时在游戏窗口中的位置对象，对象包含 x 和 y 属性。 
		*/
		getPreviousLocationInView(): Vec2;		
		/**
		!#en Returns the start touch location in screen coordinates.
		!#zh 获取触点落下时在游戏窗口中的位置对象，对象包含 x 和 y 属性。 
		*/
		getStartLocationInView(): Vec2;		
		/**
		!#en Returns the id of cc.Touch.
		!#zh 触点的标识 ID，可以用来在多点触摸中跟踪触点。 
		*/
		getID(): number;		
		/**
		!#en Sets information to touch.
		!#zh 设置触摸相关的信息。用于监控触摸事件。
		@param id id
		@param x x
		@param y y 
		*/
		setTouchInfo(id: number, x: number, y: number): void;	
	}	
	/** undefined */
	export class Graphics extends RenderComponent {		
		/** !#en
		Current line width.
		!#zh
		当前线条宽度 */
		lineWidth: number;		
		/** !#en
		lineJoin determines how two connecting segments (of lines, arcs or curves) with non-zero lengths in a shape are joined together.
		!#zh
		lineJoin 用来设置2个长度不为0的相连部分（线段，圆弧，曲线）如何连接在一起的属性。 */
		lineJoin: Graphics.LineJoin;		
		/** !#en
		lineCap determines how the end points of every line are drawn.
		!#zh
		lineCap 指定如何绘制每一条线段末端。 */
		lineCap: Graphics.LineCap;		
		/** !#en
		stroke color
		!#zh
		线段颜色 */
		strokeColor: Color;		
		/** !#en
		fill color
		!#zh
		填充颜色 */
		fillColor: Color;		
		/** !#en
		Sets the miter limit ratio
		!#zh
		设置斜接面限制比例 */
		miterLimit: number;		
		/**
		!#en Move path start point to (x,y).
		!#zh 移动路径起点到坐标(x, y)
		@param x The x axis of the coordinate for the end point.
		@param y The y axis of the coordinate for the end point. 
		*/
		moveTo(x?: number, y?: number): void;		
		/**
		!#en Adds a straight line to the path
		!#zh 绘制直线路径
		@param x The x axis of the coordinate for the end point.
		@param y The y axis of the coordinate for the end point. 
		*/
		lineTo(x?: number, y?: number): void;		
		/**
		!#en Adds a cubic Bézier curve to the path
		!#zh 绘制三次贝赛尔曲线路径
		@param c1x The x axis of the coordinate for the first control point.
		@param c1y The y axis of the coordinate for first control point.
		@param c2x The x axis of the coordinate for the second control point.
		@param c2y The y axis of the coordinate for the second control point.
		@param x The x axis of the coordinate for the end point.
		@param y The y axis of the coordinate for the end point. 
		*/
		bezierCurveTo(c1x?: number, c1y?: number, c2x?: number, c2y?: number, x?: number, y?: number): void;		
		/**
		!#en Adds a quadratic Bézier curve to the path
		!#zh 绘制二次贝赛尔曲线路径
		@param cx The x axis of the coordinate for the control point.
		@param cy The y axis of the coordinate for the control point.
		@param x The x axis of the coordinate for the end point.
		@param y The y axis of the coordinate for the end point. 
		*/
		quadraticCurveTo(cx?: number, cy?: number, x?: number, y?: number): void;		
		/**
		!#en Adds an arc to the path which is centered at (cx, cy) position with radius r starting at startAngle and ending at endAngle going in the given direction by counterclockwise (defaulting to false).
		!#zh 绘制圆弧路径。圆弧路径的圆心在 (cx, cy) 位置，半径为 r ，根据 counterclockwise （默认为false）指定的方向从 startAngle 开始绘制，到 endAngle 结束。
		@param cx The x axis of the coordinate for the center point.
		@param cy The y axis of the coordinate for the center point.
		@param r The arc's radius.
		@param startAngle The angle at which the arc starts, measured clockwise from the positive x axis and expressed in radians.
		@param endAngle The angle at which the arc ends, measured clockwise from the positive x axis and expressed in radians.
		@param counterclockwise An optional Boolean which, if true, causes the arc to be drawn counter-clockwise between the two angles. By default it is drawn clockwise. 
		*/
		arc(cx?: number, cy?: number, r?: number, startAngle?: number, endAngle?: number, counterclockwise?: boolean): void;		
		/**
		!#en Adds an ellipse to the path.
		!#zh 绘制椭圆路径。
		@param cx The x axis of the coordinate for the center point.
		@param cy The y axis of the coordinate for the center point.
		@param rx The ellipse's x-axis radius.
		@param ry The ellipse's y-axis radius. 
		*/
		ellipse(cx?: number, cy?: number, rx?: number, ry?: number): void;		
		/**
		!#en Adds an circle to the path.
		!#zh 绘制圆形路径。
		@param cx The x axis of the coordinate for the center point.
		@param cy The y axis of the coordinate for the center point.
		@param r The circle's radius. 
		*/
		circle(cx?: number, cy?: number, r?: number): void;		
		/**
		!#en Adds an rectangle to the path.
		!#zh 绘制矩形路径。
		@param x The x axis of the coordinate for the rectangle starting point.
		@param y The y axis of the coordinate for the rectangle starting point.
		@param w The rectangle's width.
		@param h The rectangle's height. 
		*/
		rect(x?: number, y?: number, w?: number, h?: number): void;		
		/**
		!#en Adds an round corner rectangle to the path.
		!#zh 绘制圆角矩形路径。
		@param x The x axis of the coordinate for the rectangle starting point.
		@param y The y axis of the coordinate for the rectangle starting point.
		@param w The rectangles width.
		@param h The rectangle's height.
		@param r The radius of the rectangle. 
		*/
		roundRect(x?: number, y?: number, w?: number, h?: number, r?: number): void;		
		/**
		!#en Draws a filled rectangle.
		!#zh 绘制填充矩形。
		@param x The x axis of the coordinate for the rectangle starting point.
		@param y The y axis of the coordinate for the rectangle starting point.
		@param w The rectangle's width.
		@param h The rectangle's height. 
		*/
		fillRect(x?: number, y?: number, w?: number, h?: number): void;		
		/**
		!#en Erasing any previously drawn content.
		!#zh 擦除之前绘制的所有内容的方法。
		@param clean Whether to clean the graphics inner cache. 
		*/
		clear(clean?: boolean): void;		
		/**
		!#en Causes the point of the pen to move back to the start of the current path. It tries to add a straight line from the current point to the start.
		!#zh 将笔点返回到当前路径起始点的。它尝试从当前点到起始点绘制一条直线。 
		*/
		close(): void;		
		/**
		!#en Strokes the current or given path with the current stroke style.
		!#zh 根据当前的画线样式，绘制当前或已经存在的路径。 
		*/
		stroke(): void;		
		/**
		!#en Fills the current or given path with the current fill style.
		!#zh 根据当前的画线样式，填充当前或已经存在的路径。 
		*/
		fill(): void;	
	}	
	/** !#en Mesh Asset.
	!#zh 网格资源。 */
	export class Mesh extends Asset implements EventTarget {		
		/** !#en Get ir set the sub meshes.
		!#zh 设置或者获取子网格。 */
		subMeshes: InputAssembler[];		
		/**
		!#en
		Init vertex buffer according to the vertex format.
		!#zh
		根据顶点格式初始化顶点内存。
		@param vertexFormat vertex format
		@param vertexCount how much vertex should be create in this buffer.
		@param dynamic whether or not to use dynamic buffer.
		@param index index 
		*/
		init(vertexFormat: gfx.VertexFormat, vertexCount: number, dynamic?: boolean, index?: boolean): void;		
		/**
		!#en
		Set the vertex values.
		!#zh
		设置顶点数据
		@param name the attribute name, e.g. gfx.ATTR_POSITION
		@param values the vertex values 
		*/
		setVertices(name: string, values: Vec2[]|Vec3[]|Color[]|number[]|Uint8Array|Float32Array): void;		
		/**
		!#en
		Set the sub mesh indices.
		!#zh
		设置子网格索引。
		@param indices the sub mesh indices.
		@param index sub mesh index.
		@param dynamic whether or not to use dynamic buffer. 
		*/
		setIndices(indices: number[]|Uint16Array|Uint8Array, index?: number, dynamic?: boolean): void;		
		/**
		!#en
		Set the sub mesh primitive type.
		!#zh
		设置子网格绘制线条的方式。
		@param type type
		@param index index 
		*/
		setPrimitiveType(type: number, index: number): void;		
		/**
		!#en
		Clear the buffer data.
		!#zh
		清除网格创建的内存数据。 
		*/
		clear(): void;		
		/**
		!#en Set mesh bounding box
		!#zh 设置网格的包围盒
		@param min min
		@param max max 
		*/
		setBoundingBox(min: Vec3, max: Vec3): void;		
		/**
		!#en Read the specified attributes of the subgrid into the target buffer.
		!#zh 读取子网格的指定属性到目标缓冲区中。
		@param primitiveIndex The subgrid index.
		@param attributeName attribute name.
		@param buffer The target buffer.
		@param stride The byte interval between adjacent attributes in the target buffer.
		@param offset The offset of the first attribute in the target buffer. 
		*/
		copyAttribute(primitiveIndex: number, attributeName: string, buffer: ArrayBuffer, stride: number, offset: number): boolean;		
		/**
		!#en Read the index data of the subgrid into the target array.
		!#zh 读取子网格的索引数据到目标数组中。
		@param primitiveIndex The subgrid index.
		@param outputArray The target array. 
		*/
		copyIndices(primitiveIndex: number, outputArray: DataView): boolean;		
		/**
		!#en Checks whether the EventTarget object has any callback registered for a specific type of event.
		!#zh 检查事件目标对象是否有为特定类型的事件注册的回调。
		@param type The type of event. 
		*/
		hasEventListener(type: string): boolean;		
		/**
		!#en
		Register an callback of a specific event type on the EventTarget.
		This type of event should be triggered via `emit`.
		!#zh
		注册事件目标的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		
		@example 
		```js
		eventTarget.on('fire', function () {
		    cc.log("fire in the hole");
		}, node);
		``` 
		*/
		on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T;		
		/**
		!#en
		Removes the listeners previously registered with the same type, callback, target and or useCapture,
		if only type is passed as parameter, all listeners registered with that type will be removed.
		!#zh
		删除之前用同类型，回调，目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
		@param type A string representing the event type being removed.
		@param callback The callback to remove.
		@param target The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
		
		@example 
		```js
		// register fire eventListener
		var callback = eventTarget.on('fire', function () {
		    cc.log("fire in the hole");
		}, target);
		// remove fire event listener
		eventTarget.off('fire', callback, target);
		// remove all fire event listeners
		eventTarget.off('fire');
		``` 
		*/
		off(type: string, callback?: Function, target?: any): void;		
		/**
		!#en Removes all callbacks previously registered with the same target (passed as parameter).
		This is not for removing all listeners in the current event target,
		and this is not for removing all listeners the target parameter have registered.
		It's only for removing all listeners (callback and target couple) registered on the current event target by the target parameter.
		!#zh 在当前 EventTarget 上删除指定目标（target 参数）注册的所有事件监听器。
		这个函数无法删除当前 EventTarget 的所有事件监听器，也无法删除 target 参数所注册的所有事件监听器。
		这个函数只能删除 target 参数在当前 EventTarget 上注册的所有事件监听器。
		@param target The target to be searched for all related listeners 
		*/
		targetOff(target: any): void;		
		/**
		!#en
		Register an callback of a specific event type on the EventTarget,
		the callback will remove itself after the first time it is triggered.
		!#zh
		注册事件目标的特定事件类型回调，回调会在第一时间被触发后删除自身。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		
		@example 
		```js
		eventTarget.once('fire', function () {
		    cc.log("this is the callback and will be invoked only once");
		}, node);
		``` 
		*/
		once(type: string, callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void, target?: any): void;		
		/**
		!#en
		Send an event with the event object.
		!#zh
		通过事件对象派发事件
		@param event event 
		*/
		dispatchEvent(event: Event): void;	
	}	
	/** !#en
	Mesh Renderer Component
	!#zh
	网格渲染组件 */
	export class MeshRenderer extends RenderComponent {		
		/** !#en
		The mesh which the renderer uses.
		!#zh
		设置使用的网格 */
		mesh: Mesh;		
		/** !#en
		Whether the mesh should receive shadows.
		!#zh
		网格是否接受光源投射的阴影 */
		receiveShadows: boolean;		
		/** !#en
		Shadow Casting Mode
		!#zh
		网格投射阴影的模式 */
		shadowCastingMode: MeshRenderer.ShadowCastingMode;		
		/** !#en
		Enable auto merge mesh, only support when mesh's VertexFormat, PrimitiveType, materials are all the same
		!#zh
		开启自动合并 mesh 功能，只有在网格的 顶点格式，PrimitiveType, 使用的材质 都一致的情况下才会有效 */
		enableAutoBatch: boolean;	
	}	
	/** !#en The animation component is used to play back animations.
	
	Animation provide several events to register：
	 - play : Emit when begin playing animation
	 - stop : Emit when stop playing animation
	 - pause : Emit when pause animation
	 - resume : Emit when resume animation
	 - lastframe : If animation repeat count is larger than 1, emit when animation play to the last frame
	 - finished : Emit when finish playing animation
	
	!#zh Animation 组件用于播放动画。
	
	Animation 提供了一系列可注册的事件：
	 - play : 开始播放时
	 - stop : 停止播放时
	 - pause : 暂停播放时
	 - resume : 恢复播放时
	 - lastframe : 假如动画循环次数大于 1，当动画播放到最后一帧时
	 - finished : 动画播放完成时 */
	export class Animation extends Component implements EventTarget {		
		/** !#en Animation will play the default clip when start game.
		!#zh 在勾选自动播放或调用 play() 时默认播放的动画剪辑。 */
		defaultClip: AnimationClip;		
		/** !#en Current played clip.
		!#zh 当前播放的动画剪辑。 */
		currentClip: AnimationClip;		
		/** !#en Whether the animation should auto play the default clip when start game.
		!#zh 是否在运行游戏后自动播放默认动画剪辑。 */
		playOnLoad: boolean;		
		/**
		!#en Get all the clips used in this animation.
		!#zh 获取动画组件上的所有动画剪辑。 
		*/
		getClips(): AnimationClip[];		
		/**
		!#en Plays an animation and stop other animations.
		!#zh 播放指定的动画，并且停止当前正在播放动画。如果没有指定动画，则播放默认动画。
		@param name The name of animation to play. If no name is supplied then the default animation will be played.
		@param startTime play an animation from startTime
		
		@example 
		```js
		var animCtrl = this.node.getComponent(cc.Animation);
		animCtrl.play("linear");
		``` 
		*/
		play(name?: string, startTime?: number): AnimationState;		
		/**
		!#en
		Plays an additive animation, it will not stop other animations.
		If there are other animations playing, then will play several animations at the same time.
		!#zh 播放指定的动画（将不会停止当前播放的动画）。如果没有指定动画，则播放默认动画。
		@param name The name of animation to play. If no name is supplied then the default animation will be played.
		@param startTime play an animation from startTime
		
		@example 
		```js
		// linear_1 and linear_2 at the same time playing.
		var animCtrl = this.node.getComponent(cc.Animation);
		animCtrl.playAdditive("linear_1");
		animCtrl.playAdditive("linear_2");
		``` 
		*/
		playAdditive(name?: string, startTime?: number): AnimationState;		
		/**
		!#en Stops an animation named name. If no name is supplied then stops all playing animations that were started with this Animation. <br/>
		Stopping an animation also Rewinds it to the Start.
		!#zh 停止指定的动画。如果没有指定名字，则停止当前正在播放的动画。
		@param name The animation to stop, if not supplied then stops all playing animations. 
		*/
		stop(name?: string): void;		
		/**
		!#en Pauses an animation named name. If no name is supplied then pauses all playing animations that were started with this Animation.
		!#zh 暂停当前或者指定的动画。如果没有指定名字，则暂停当前正在播放的动画。
		@param name The animation to pauses, if not supplied then pauses all playing animations. 
		*/
		pause(name?: string): void;		
		/**
		!#en Resumes an animation named name. If no name is supplied then resumes all paused animations that were started with this Animation.
		!#zh 重新播放指定的动画，如果没有指定名字，则重新播放当前正在播放的动画。
		@param name The animation to resumes, if not supplied then resumes all paused animations. 
		*/
		resume(name?: string): void;		
		/**
		!#en Make an animation named name go to the specified time. If no name is supplied then make all animations go to the specified time.
		!#zh 设置指定动画的播放时间。如果没有指定名字，则设置当前播放动画的播放时间。
		@param time The time to go to
		@param name Specified animation name, if not supplied then make all animations go to the time. 
		*/
		setCurrentTime(time?: number, name?: string): void;		
		/**
		!#en Returns the animation state named name. If no animation with the specified name, the function will return null.
		!#zh 获取当前或者指定的动画状态，如果未找到指定动画剪辑则返回 null。
		@param name name 
		*/
		getAnimationState(name: string): AnimationState;		
		/**
		!#en Adds a clip to the animation with name newName. If a clip with that name already exists it will be replaced with the new clip.
		!#zh 添加动画剪辑，并且可以重新设置该动画剪辑的名称。
		@param clip the clip to add
		@param newName newName 
		*/
		addClip(clip: AnimationClip, newName?: string): AnimationState;		
		/**
		!#en
		Remove clip from the animation list. This will remove the clip and any animation states based on it.
		If there are animation states depand on the clip are playing or clip is defaultClip, it will not delete the clip.
		But if force is true, then will always remove the clip and any animation states based on it. If clip is defaultClip, defaultClip will be reset to null
		!#zh
		从动画列表中移除指定的动画剪辑，<br/>
		如果依赖于 clip 的 AnimationState 正在播放或者 clip 是 defaultClip 的话，默认是不会删除 clip 的。
		但是如果 force 参数为 true，则会强制停止该动画，然后移除该动画剪辑和相关的动画。这时候如果 clip 是 defaultClip，defaultClip 将会被重置为 null。
		@param clip clip
		@param force If force is true, then will always remove the clip and any animation states based on it. 
		*/
		removeClip(clip: AnimationClip, force?: boolean): void;		
		/**
		!#en
		Samples animations at the current state.<br/>
		This is useful when you explicitly want to set up some animation state, and sample it once.
		!#zh 对指定或当前动画进行采样。你可以手动将动画设置到某一个状态，然后采样一次。
		@param name name 
		*/
		sample(name: string): void;		
		/**
		!#en
		Register animation event callback.
		The event arguments will provide the AnimationState which emit the event.
		When play an animation, will auto register the event callback to the AnimationState, and unregister the event callback from the AnimationState when animation stopped.
		!#zh
		注册动画事件回调。
		回调的事件里将会附上发送事件的 AnimationState。
		当播放一个动画时，会自动将事件注册到对应的 AnimationState 上，停止播放时会将事件从这个 AnimationState 上取消注册。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param state state
		@param target The target (this object) to invoke the callback, can be null
		@param useCapture When set to true, the capture argument prevents callback
		                             from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE.
		                             When false, callback will NOT be invoked when event's eventPhase attribute value is CAPTURING_PHASE.
		                             Either way, callback will be invoked when event's eventPhase attribute value is AT_TARGET.
		
		@example 
		```js
		onPlay: function (type, state) {
		    // callback
		}
		
		// register event to all animation
		animation.on('play', this.onPlay, this);
		``` 
		*/
		on(type: string, callback: (event: Event.EventCustom) => void, target?: any, useCapture?: boolean): (event: Event.EventCustom) => void;
		on<T>(type: string, callback: (event: T) => void, target?: any, useCapture?: boolean): (event: T) => void;		
		/**
		!#en
		Unregister animation event callback.
		!#zh
		取消注册动画事件回调。
		@param type A string representing the event type being removed.
		@param callback The callback to remove.
		@param target The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
		@param useCapture Specifies whether the callback being removed was registered as a capturing callback or not.
		                             If not specified, useCapture defaults to false. If a callback was registered twice,
		                             one with capture and one without, each must be removed separately. Removal of a capturing callback
		                             does not affect a non-capturing version of the same listener, and vice versa.
		
		@example 
		```js
		// unregister event to all animation
		animation.off('play', this.onPlay, this);
		``` 
		*/
		off(type: string, callback?: Function, target?: any, useCapture?: boolean): void;		
		/**
		!#en Checks whether the EventTarget object has any callback registered for a specific type of event.
		!#zh 检查事件目标对象是否有为特定类型的事件注册的回调。
		@param type The type of event. 
		*/
		hasEventListener(type: string): boolean;		
		/**
		!#en Removes all callbacks previously registered with the same target (passed as parameter).
		This is not for removing all listeners in the current event target,
		and this is not for removing all listeners the target parameter have registered.
		It's only for removing all listeners (callback and target couple) registered on the current event target by the target parameter.
		!#zh 在当前 EventTarget 上删除指定目标（target 参数）注册的所有事件监听器。
		这个函数无法删除当前 EventTarget 的所有事件监听器，也无法删除 target 参数所注册的所有事件监听器。
		这个函数只能删除 target 参数在当前 EventTarget 上注册的所有事件监听器。
		@param target The target to be searched for all related listeners 
		*/
		targetOff(target: any): void;		
		/**
		!#en
		Register an callback of a specific event type on the EventTarget,
		the callback will remove itself after the first time it is triggered.
		!#zh
		注册事件目标的特定事件类型回调，回调会在第一时间被触发后删除自身。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		
		@example 
		```js
		eventTarget.once('fire', function () {
		    cc.log("this is the callback and will be invoked only once");
		}, node);
		``` 
		*/
		once(type: string, callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void, target?: any): void;		
		/**
		!#en
		Send an event with the event object.
		!#zh
		通过事件对象派发事件
		@param event event 
		*/
		dispatchEvent(event: Event): void;	
	}	
	/** !#en Audio Source.
	!#zh 音频源组件，能对音频剪辑。 */
	export class AudioSource extends Component {		
		/** !#en
		Is the audio source playing (Read Only). <br/>
		Note: isPlaying is not supported for Native platforms.
		!#zh
		该音频剪辑是否正播放（只读）。<br/>
		注意：Native 平台暂时不支持 isPlaying。 */
		isPlaying: boolean;		
		/** !#en The clip of the audio source to play.
		!#zh 要播放的音频剪辑。 */
		clip: AudioClip;		
		/** !#en The volume of the audio source.
		!#zh 音频源的音量（0.0 ~ 1.0）。 */
		volume: number;		
		/** !#en Is the audio source mute?
		!#zh 是否静音音频源。Mute 是设置音量为 0，取消静音是恢复原来的音量。 */
		mute: boolean;		
		/** !#en Is the audio source looping?
		!#zh 音频源是否循环播放？ */
		loop: boolean;		
		/** !#en If set to true, the audio source will automatically start playing on onEnable.
		!#zh 如果设置为 true，音频源将在 onEnable 时自动播放。 */
		playOnLoad: boolean;		
		/**
		!#en Plays the clip.
		!#zh 播放音频剪辑。 
		*/
		play(): void;		
		/**
		!#en Stops the clip.
		!#zh 停止当前音频剪辑。 
		*/
		stop(): void;		
		/**
		!#en Pause the clip.
		!#zh 暂停当前音频剪辑。 
		*/
		pause(): void;		
		/**
		!#en Resume the clip.
		!#zh 恢复播放。 
		*/
		resume(): void;		
		/**
		!#en Rewind playing music.
		!#zh 从头开始播放。 
		*/
		rewind(): void;		
		/**
		!#en Get current time
		!#zh 获取当前的播放时间 
		*/
		getCurrentTime(): number;		
		/**
		!#en Set current time
		!#zh 设置当前的播放时间
		@param time time 
		*/
		setCurrentTime(time: number): number;		
		/**
		!#en Get audio duration
		!#zh 获取当前音频的长度 
		*/
		getDuration(): number;	
	}	
	/** !#en
	This component will block all input events (mouse and touch) within the bounding box of the node, preventing the input from penetrating into the underlying node, typically for the background of the top UI.<br>
	This component does not have any API interface and can be added directly to the scene to take effect.
	!#zh
	该组件将拦截所属节点 bounding box 内的所有输入事件（鼠标和触摸），防止输入穿透到下层节点，一般用于上层 UI 的背景。<br>
	该组件没有任何 API 接口，直接添加到场景即可生效。 */
	export class BlockInputEvents extends Component {	
	}	
	/** !#en
	Button has 4 Transition types<br/>
	When Button state changed:<br/>
	 If Transition type is Button.Transition.NONE, Button will do nothing<br/>
	 If Transition type is Button.Transition.COLOR, Button will change target's color<br/>
	 If Transition type is Button.Transition.SPRITE, Button will change target Sprite's sprite<br/>
	 If Transition type is Button.Transition.SCALE, Button will change target node's scale<br/>
	
	Button will trigger 5 events:<br/>
	 Button.EVENT_TOUCH_DOWN<br/>
	 Button.EVENT_TOUCH_UP<br/>
	 Button.EVENT_HOVER_IN<br/>
	 Button.EVENT_HOVER_MOVE<br/>
	 Button.EVENT_HOVER_OUT<br/>
	 User can get the current clicked node with 'event.target' from event object which is passed as parameter in the callback function of click event.
	
	!#zh
	按钮组件。可以被按下，或者点击。
	
	按钮可以通过修改 Transition 来设置按钮状态过渡的方式：
	
	  - Button.Transition.NONE   // 不做任何过渡
	  - Button.Transition.COLOR  // 进行颜色之间过渡
	  - Button.Transition.SPRITE // 进行精灵之间过渡
	  - Button.Transition.SCALE // 进行缩放过渡
	
	按钮可以绑定事件（但是必须要在按钮的 Node 上才能绑定事件）：<br/>
	以下事件可以在全平台上都触发：
	
	  - cc.Node.EventType.TOUCH_START  // 按下时事件
	  - cc.Node.EventType.TOUCH_Move   // 按住移动后事件
	  - cc.Node.EventType.TOUCH_END    // 按下后松开后事件
	  - cc.Node.EventType.TOUCH_CANCEL // 按下取消事件
	
	以下事件只在 PC 平台上触发：
	
	  - cc.Node.EventType.MOUSE_DOWN  // 鼠标按下时事件
	  - cc.Node.EventType.MOUSE_MOVE  // 鼠标按住移动后事件
	  - cc.Node.EventType.MOUSE_ENTER // 鼠标进入目标事件
	  - cc.Node.EventType.MOUSE_LEAVE // 鼠标离开目标事件
	  - cc.Node.EventType.MOUSE_UP    // 鼠标松开事件
	  - cc.Node.EventType.MOUSE_WHEEL // 鼠标滚轮事件
	
	用户可以通过获取 __点击事件__ 回调函数的参数 event 的 target 属性获取当前点击对象。 */
	export class Button extends Component implements GraySpriteState {		
		/** !#en
		Whether the Button is disabled.
		If true, the Button will trigger event and do transition.
		!#zh
		按钮事件是否被响应，如果为 false，则按钮将被禁用。 */
		interactable: boolean;		
		/** !#en When this flag is true, Button target sprite will turn gray when interactable is false.
		!#zh 如果这个标记为 true，当 button 的 interactable 属性为 false 的时候，会使用内置 shader 让 button 的 target 节点的 sprite 组件变灰 */
		enableAutoGrayEffect: boolean;		
		/** !#en Transition type
		!#zh 按钮状态改变时过渡方式。 */
		transition: Button.Transition;		
		/** !#en Normal state color.
		!#zh 普通状态下按钮所显示的颜色。 */
		normalColor: Color;		
		/** !#en Pressed state color
		!#zh 按下状态时按钮所显示的颜色。 */
		pressedColor: Color;		
		/** !#en Hover state color
		!#zh 悬停状态下按钮所显示的颜色。 */
		hoverColor: Color;		
		/** !#en Disabled state color
		!#zh 禁用状态下按钮所显示的颜色。 */
		disabledColor: Color;		
		/** !#en Color and Scale transition duration
		!#zh 颜色过渡和缩放过渡时所需时间 */
		duration: number;		
		/** !#en  When user press the button, the button will zoom to a scale.
		The final scale of the button  equals (button original scale * zoomScale)
		!#zh 当用户点击按钮后，按钮会缩放到一个值，这个值等于 Button 原始 scale * zoomScale */
		zoomScale: number;		
		/** !#en Normal state sprite
		!#zh 普通状态下按钮所显示的 Sprite 。 */
		normalSprite: SpriteFrame;		
		/** !#en Pressed state sprite
		!#zh 按下状态时按钮所显示的 Sprite 。 */
		pressedSprite: SpriteFrame;		
		/** !#en Hover state sprite
		!#zh 悬停状态下按钮所显示的 Sprite 。 */
		hoverSprite: SpriteFrame;		
		/** !#en Disabled state sprite
		!#zh 禁用状态下按钮所显示的 Sprite 。 */
		disabledSprite: SpriteFrame;		
		/** !#en
		Transition target.
		When Button state changed:
		 If Transition type is Button.Transition.NONE, Button will do nothing
		 If Transition type is Button.Transition.COLOR, Button will change target's color
		 If Transition type is Button.Transition.SPRITE, Button will change target Sprite's sprite
		!#zh
		需要过渡的目标。
		当前按钮状态改变规则：
		-如果 Transition type 选择 Button.Transition.NONE，按钮不做任何过渡。
		-如果 Transition type 选择 Button.Transition.COLOR，按钮会对目标颜色进行颜色之间的过渡。
		-如果 Transition type 选择 Button.Transition.Sprite，按钮会对目标 Sprite 进行 Sprite 之间的过渡。 */
		target: Node;		
		/** !#en If Button is clicked, it will trigger event's handler
		!#zh 按钮的点击事件列表。 */
		clickEvents: Component.EventHandler[];		
		/** !#en The normal material.
		!#zh 正常状态的材质。 */
		normalMaterial: Material;		
		/** !#en The gray material.
		!#zh 置灰状态的材质。 */
		grayMaterial: Material;	
	}	
	/** !#zh: 作为 UI 根节点，为所有子节点提供视窗四边的位置信息以供对齐，另外提供屏幕适配策略接口，方便从编辑器设置。
	注：由于本节点的尺寸会跟随屏幕拉伸，所以 anchorPoint 只支持 (0.5, 0.5)，否则适配不同屏幕时坐标会有偏差。 */
	export class Canvas extends Component {		
		/** !#en Current active canvas, the scene should only have one active canvas at the same time.
		!#zh 当前激活的画布组件，场景同一时间只能有一个激活的画布。 */
		static instance: Canvas;		
		/** !#en The desigin resolution for current scene.
		!#zh 当前场景设计分辨率。 */
		designResolution: Size;		
		/** !#en TODO
		!#zh: 是否优先将设计分辨率高度撑满视图高度。 */
		fitHeight: boolean;		
		/** !#en TODO
		!#zh: 是否优先将设计分辨率宽度撑满视图宽度。 */
		fitWidth: boolean;	
	}	
	/** !#en
	Base class for everything attached to Node(Entity).<br/>
	<br/>
	NOTE: Not allowed to use construction parameters for Component's subclasses,
	      because Component is created by the engine.
	!#zh
	所有附加到节点的基类。<br/>
	<br/>
	注意：不允许使用组件的子类构造参数，因为组件是由引擎创建的。 */
	export class Component extends Object {		
		/** !#en The node this component is attached to. A component is always attached to a node.
		!#zh 该组件被附加到的节点。组件总会附加到一个节点。 */
		node: Node;		
		/** !#en The uuid for editor.
		!#zh 组件的 uuid，用于编辑器。 */
		uuid: string;		
		/** !#en indicates whether this component is enabled or not.
		!#zh 表示该组件自身是否启用。 */
		enabled: boolean;		
		/** !#en indicates whether this component is enabled and its node is also active in the hierarchy.
		!#zh 表示该组件是否被启用并且所在的节点也处于激活状态。 */
		enabledInHierarchy: boolean;		
		/** !#en Returns a value which used to indicate the onLoad get called or not.
		!#zh 返回一个值用来判断 onLoad 是否被调用过，不等于 0 时调用过，等于 0 时未调用。 */
		_isOnLoadCalled: number;		
		/**
		!#en Update is called every frame, if the Component is enabled.<br/>
		This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
		!#zh 如果该组件启用，则每帧调用 update。<br/>
		该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
		@param dt the delta time in seconds it took to complete the last frame 
		*/
		protected update(dt: number): void;		
		/**
		!#en LateUpdate is called every frame, if the Component is enabled.<br/>
		This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
		!#zh 如果该组件启用，则每帧调用 LateUpdate。<br/>
		该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
		@param dt the delta time in seconds it took to complete the last frame 
		*/
		protected lateUpdate(dt: number): void;		
		/**
		!#en
		When attaching to an active node or its node first activated.
		onLoad is always called before any start functions, this allows you to order initialization of scripts.<br/>
		This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
		!#zh
		当附加到一个激活的节点上或者其节点第一次激活时候调用。onLoad 总是会在任何 start 方法调用前执行，这能用于安排脚本的初始化顺序。<br/>
		该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。 
		*/
		protected onLoad(): void;		
		/**
		!#en
		Called before all scripts' update if the Component is enabled the first time.
		Usually used to initialize some logic which need to be called after all components' `onload` methods called.<br/>
		This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
		!#zh
		如果该组件第一次启用，则在所有组件的 update 之前调用。通常用于需要在所有组件的 onLoad 初始化完毕后执行的逻辑。<br/>
		该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。 
		*/
		protected start(): void;		
		/**
		!#en Called when this component becomes enabled and its node is active.<br/>
		This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
		!#zh 当该组件被启用，并且它的节点也激活时。<br/>
		该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。 
		*/
		protected onEnable(): void;		
		/**
		!#en Called when this component becomes disabled or its node becomes inactive.<br/>
		This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
		!#zh 当该组件被禁用或节点变为无效时调用。<br/>
		该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。 
		*/
		protected onDisable(): void;		
		/**
		!#en Called when this component will be destroyed.<br/>
		This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
		!#zh 当该组件被销毁时调用<br/>
		该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。 
		*/
		protected onDestroy(): void;		
		protected onFocusInEditor(): void;		
		protected onLostFocusInEditor(): void;		
		/**
		!#en Called to initialize the component or node’s properties when adding the component the first time or when the Reset command is used. This function is only called in editor.
		!#zh 用来初始化组件或节点的一些属性，当该组件被第一次添加到节点上或用户点击了它的 Reset 菜单时调用。这个回调只会在编辑器下调用。 
		*/
		protected resetInEditor(): void;		
		/**
		!#en Adds a component class to the node. You can also add component to node by passing in the name of the script.
		!#zh 向节点添加一个组件类，你还可以通过传入脚本的名称来添加组件。
		@param typeOrClassName the constructor or the class name of the component to add
		
		@example 
		```js
		var sprite = node.addComponent(cc.Sprite);
		var test = node.addComponent("Test");
		``` 
		*/
		addComponent<T extends Component>(type: {new(): T}): T;
		addComponent(className: string): any;		
		/**
		!#en
		Returns the component of supplied type if the node has one attached, null if it doesn't.<br/>
		You can also get component in the node by passing in the name of the script.
		!#zh
		获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。<br/>
		传入参数也可以是脚本的名称。
		@param typeOrClassName typeOrClassName
		
		@example 
		```js
		// get sprite component.
		var sprite = node.getComponent(cc.Sprite);
		// get custom test calss.
		var test = node.getComponent("Test");
		``` 
		*/
		getComponent<T extends Component>(type: {prototype: T}): T;
		getComponent(className: string): any;		
		/**
		!#en Returns all components of supplied Type in the node.
		!#zh 返回节点上指定类型的所有组件。
		@param typeOrClassName typeOrClassName
		
		@example 
		```js
		var sprites = node.getComponents(cc.Sprite);
		var tests = node.getComponents("Test");
		``` 
		*/
		getComponents<T extends Component>(type: {prototype: T}): T[];
		getComponents(className: string): any[];		
		/**
		!#en Returns the component of supplied type in any of its children using depth first search.
		!#zh 递归查找所有子节点中第一个匹配指定类型的组件。
		@param typeOrClassName typeOrClassName
		
		@example 
		```js
		var sprite = node.getComponentInChildren(cc.Sprite);
		var Test = node.getComponentInChildren("Test");
		``` 
		*/
		getComponentInChildren<T extends Component>(type: {prototype: T}): T;
		getComponentInChildren(className: string): any;		
		/**
		!#en Returns the components of supplied type in self or any of its children using depth first search.
		!#zh 递归查找自身或所有子节点中指定类型的组件
		@param typeOrClassName typeOrClassName
		
		@example 
		```js
		var sprites = node.getComponentsInChildren(cc.Sprite);
		var tests = node.getComponentsInChildren("Test");
		``` 
		*/
		getComponentsInChildren<T extends Component>(type: {prototype: T}): T[];
		getComponentsInChildren(className: string): any[];		
		/**
		!#en
		If the component's bounding box is different from the node's, you can implement this method to supply
		a custom axis aligned bounding box (AABB), so the editor's scene view can perform hit test properly.
		!#zh
		如果组件的包围盒与节点不同，您可以实现该方法以提供自定义的轴向对齐的包围盒（AABB），
		以便编辑器的场景视图可以正确地执行点选测试。
		@param out_rect the Rect to receive the bounding box 
		*/
		_getLocalBounds(out_rect: Rect): void;		
		/**
		!#en
		onRestore is called after the user clicks the Reset item in the Inspector's context menu or performs
		an undo operation on this component.<br/>
		<br/>
		If the component contains the "internal state", short for "temporary member variables which not included<br/>
		in its CCClass properties", then you may need to implement this function.<br/>
		<br/>
		The editor will call the getset accessors of your component to record/restore the component's state<br/>
		for undo/redo operation. However, in extreme cases, it may not works well. Then you should implement<br/>
		this function to manually synchronize your component's "internal states" with its public properties.<br/>
		Once you implement this function, all the getset accessors of your component will not be called when<br/>
		the user performs an undo/redo operation. Which means that only the properties with default value<br/>
		will be recorded or restored by editor.<br/>
		<br/>
		Similarly, the editor may failed to reset your component correctly in extreme cases. Then if you need<br/>
		to support the reset menu, you should manually synchronize your component's "internal states" with its<br/>
		properties in this function. Once you implement this function, all the getset accessors of your component<br/>
		will not be called during reset operation. Which means that only the properties with default value<br/>
		will be reset by editor.
		
		This function is only called in editor mode.
		!#zh
		onRestore 是用户在检查器菜单点击 Reset 时，对此组件执行撤消操作后调用的。<br/>
		<br/>
		如果组件包含了“内部状态”（不在 CCClass 属性中定义的临时成员变量），那么你可能需要实现该方法。<br/>
		<br/>
		编辑器执行撤销/重做操作时，将调用组件的 get set 来录制和还原组件的状态。
		然而，在极端的情况下，它可能无法良好运作。<br/>
		那么你就应该实现这个方法，手动根据组件的属性同步“内部状态”。
		一旦你实现这个方法，当用户撤销或重做时，组件的所有 get set 都不会再被调用。
		这意味着仅仅指定了默认值的属性将被编辑器记录和还原。<br/>
		<br/>
		同样的，编辑可能无法在极端情况下正确地重置您的组件。<br/>
		于是如果你需要支持组件重置菜单，你需要在该方法中手工同步组件属性到“内部状态”。<br/>
		一旦你实现这个方法，组件的所有 get set 都不会在重置操作时被调用。
		这意味着仅仅指定了默认值的属性将被编辑器重置。
		<br/>
		此方法仅在编辑器下会被调用。 
		*/
		onRestore(): void;		
		/**
		!#en
		Schedules a custom selector.<br/>
		If the selector is already scheduled, then the interval parameter will be updated without scheduling it again.
		!#zh
		调度一个自定义的回调函数。<br/>
		如果回调函数已调度，那么将不会重复调度它，只会更新时间间隔参数。
		@param callback The callback function
		@param interval Tick interval in seconds. 0 means tick every frame.
		@param repeat The selector will be executed (repeat + 1) times, you can use cc.macro.REPEAT_FOREVER for tick infinitely.
		@param delay The amount of time that the first tick will wait before execution. Unit: s
		
		@example 
		```js
		var timeCallback = function (dt) {
		  cc.log("time: " + dt);
		}
		this.schedule(timeCallback, 1);
		``` 
		*/
		schedule(callback: Function, interval?: number, repeat?: number, delay?: number): void;		
		/**
		!#en Schedules a callback function that runs only once, with a delay of 0 or larger.
		!#zh 调度一个只运行一次的回调函数，可以指定 0 让回调函数在下一帧立即执行或者在一定的延时之后执行。
		@param callback A function wrapped as a selector
		@param delay The amount of time that the first tick will wait before execution. Unit: s
		
		@example 
		```js
		var timeCallback = function (dt) {
		  cc.log("time: " + dt);
		}
		this.scheduleOnce(timeCallback, 2);
		``` 
		*/
		scheduleOnce(callback: Function, delay?: number): void;		
		/**
		!#en Unschedules a custom callback function.
		!#zh 取消调度一个自定义的回调函数。
		@param callback_fn A function wrapped as a selector
		
		@example 
		```js
		this.unschedule(_callback);
		``` 
		*/
		unschedule(callback_fn: Function): void;		
		/**
		!#en
		unschedule all scheduled callback functions: custom callback functions, and the 'update' callback function.<br/>
		Actions are not affected by this method.
		!#zh 取消调度所有已调度的回调函数：定制的回调函数以及 'update' 回调函数。动作不受此方法影响。
		
		@example 
		```js
		this.unscheduleAllCallbacks();
		``` 
		*/
		unscheduleAllCallbacks(): void;	
	}	
	/** !#en The Label Component.
	!#zh 文字标签组件 */
	export class Label extends RenderComponent {		
		/** !#en Content string of label.
		!#zh 标签显示的文本内容。 */
		string: string;		
		/** !#en Horizontal Alignment of label.
		!#zh 文本内容的水平对齐方式。 */
		horizontalAlign: Label.HorizontalAlign;		
		/** !#en Vertical Alignment of label.
		!#zh 文本内容的垂直对齐方式。 */
		verticalAlign: Label.VerticalAlign;		
		/** !#en The actual rendering font size in shrink mode
		!#zh SHRINK 模式下面文本实际渲染的字体大小 */
		actualFontSize: number;		
		/** !#en Font size of label.
		!#zh 文本字体大小。 */
		fontSize: number;		
		/** !#en Font family of label, only take effect when useSystemFont property is true.
		!#zh 文本字体名称, 只在 useSystemFont 属性为 true 的时候生效。 */
		fontFamily: string;		
		/** !#en Line Height of label.
		!#zh 文本行高。 */
		lineHeight: number;		
		/** !#en Overflow of label.
		!#zh 文字显示超出范围时的处理方式。 */
		overflow: Label.Overflow;		
		/** !#en Whether auto wrap label when string width is large than label width.
		!#zh 是否自动换行。 */
		enableWrapText: boolean;		
		/** !#en The font of label.
		!#zh 文本字体。 */
		font: Font;		
		/** !#en Whether use system font name or not.
		!#zh 是否使用系统字体。 */
		useSystemFont: boolean;		
		/** !#en The spacing of the x axis between characters, only take Effect when using bitmap fonts.
		!#zh 文字之间 x 轴的间距，仅在使用位图字体时生效。 */
		spacingX: number;		
		/** !#en The cache mode of label. This mode only supports system fonts.
		!#zh 文本缓存模式, 该模式只支持系统字体。 */
		cacheMode: Label.CacheMode;		
		/** !#en Whether enable bold.
		!#zh 是否启用黑体。 */
		enableBold: boolean;		
		/** !#en Whether enable italic.
		!#zh 是否启用黑体。 */
		enableItalic: boolean;		
		/** !#en Whether enable underline.
		!#zh 是否启用下划线。 */
		enableUnderline: boolean;		
		/** !#en The height of underline.
		!#zh 下划线高度。 */
		underlineHeight: number;		
		/**
		!#zh 需要保证当前场景中没有使用CHAR缓存的Label才可以清除，否则已渲染的文字没有重新绘制会不显示
		!#en It can be cleared that need to ensure there is not use the CHAR cache in the current scene. Otherwise, the rendered text will not be displayed without repainting. 
		*/
		static clearCharCache(): void;	
	}	
	/** !#en Outline effect used to change the display, only for system fonts or TTF fonts
	!#zh 描边效果组件,用于字体描边,只能用于系统字体 */
	export class LabelOutline extends Component {		
		/** !#en outline color
		!#zh 改变描边的颜色 */
		color: Color;		
		/** !#en Change the outline width
		!#zh 改变描边的宽度 */
		width: number;	
	}	
	/** !#en Shadow effect for Label component, only for system fonts or TTF fonts
	!#zh 用于给 Label 组件添加阴影效果，只能用于系统字体或 ttf 字体 */
	export class LabelShadow extends Component {		
		/** !#en The shadow color
		!#zh 阴影的颜色 */
		color: Color;		
		/** !#en Offset between font and shadow
		!#zh 字体与阴影的偏移 */
		offset: Vec2;		
		/** !#en A non-negative float specifying the level of shadow blur
		!#zh 阴影的模糊程度 */
		blur: number;	
	}	
	/** !#en
	The Layout is a container component, use it to arrange child elements easily.<br>
	Note：<br>
	1.Scaling and rotation of child nodes are not considered.<br>
	2.After setting the Layout, the results need to be updated until the next frame,
	unless you manually call {{#crossLink "Layout/updateLayout:method"}}{{/crossLink}}。
	!#zh
	Layout 组件相当于一个容器，能自动对它的所有子节点进行统一排版。<br>
	注意：<br>
	1.不会考虑子节点的缩放和旋转。<br>
	2.对 Layout 设置后结果需要到下一帧才会更新，除非你设置完以后手动调用 {{#crossLink "Layout/updateLayout:method"}}{{/crossLink}}。 */
	export class Layout extends Component {		
		/** !#en The layout type.
		!#zh 布局类型 */
		type: Layout.Type;		
		/** !#en
		The are three resize modes for Layout.
		None, resize Container and resize children.
		!#zh 缩放模式 */
		resizeMode: Layout.ResizeMode;		
		/** !#en The cell size for grid layout.
		!#zh 每个格子的大小，只有布局类型为 GRID 的时候才有效。 */
		cellSize: Size;		
		/** !#en
		The start axis for grid layout. If you choose horizontal, then children will layout horizontally at first,
		and then break line on demand. Choose vertical if you want to layout vertically at first .
		!#zh 起始轴方向类型，可进行水平和垂直布局排列，只有布局类型为 GRID 的时候才有效。 */
		startAxis: Layout.AxisDirection;		
		/** !#en The left padding of layout, it only effect the layout in one direction.
		!#zh 容器内左边距，只会在一个布局方向上生效。 */
		paddingLeft: number;		
		/** !#en The right padding of layout, it only effect the layout in one direction.
		!#zh 容器内右边距，只会在一个布局方向上生效。 */
		paddingRight: number;		
		/** !#en The top padding of layout, it only effect the layout in one direction.
		!#zh 容器内上边距，只会在一个布局方向上生效。 */
		paddingTop: number;		
		/** !#en The bottom padding of layout, it only effect the layout in one direction.
		!#zh 容器内下边距，只会在一个布局方向上生效。 */
		paddingBottom: number;		
		/** !#en The distance in x-axis between each element in layout.
		!#zh 子节点之间的水平间距。 */
		spacingX: number;		
		/** !#en The distance in y-axis between each element in layout.
		!#zh 子节点之间的垂直间距。 */
		spacingY: number;		
		/** !#en
		Only take effect in Vertical layout mode.
		This option changes the start element's positioning.
		!#zh 垂直排列子节点的方向。 */
		verticalDirection: Layout.VerticalDirection;		
		/** !#en
		Only take effect in Horizontal layout mode.
		This option changes the start element's positioning.
		!#zh 水平排列子节点的方向。 */
		horizontalDirection: Layout.HorizontalDirection;		
		/** !#en Adjust the layout if the children scaled.
		!#zh 子节点缩放比例是否影响布局。 */
		affectedByScale: boolean;		
		/**
		!#en Perform the layout update
		!#zh 立即执行更新布局
		
		@example 
		```js
		layout.type = cc.Layout.HORIZONTAL;
		layout.node.addChild(childNode);
		cc.log(childNode.x); // not yet changed
		layout.updateLayout();
		cc.log(childNode.x); // changed
		``` 
		*/
		updateLayout(): void;	
	}	
	/** !#en The Mask Component
	!#zh 遮罩组件 */
	export class Mask extends RenderComponent {		
		/** !#en The mask type.
		!#zh 遮罩类型 */
		type: Mask.Type;		
		/** !#en The mask image
		!#zh 遮罩所需要的贴图 */
		spriteFrame: SpriteFrame;		
		/** !#en
		The alpha threshold.(Not supported Canvas Mode) <br/>
		The content is drawn only where the stencil have pixel with alpha greater than the alphaThreshold. <br/>
		Should be a float between 0 and 1. <br/>
		This default to 0.1.
		When it's set to 1, the stencil will discard all pixels, nothing will be shown.
		!#zh
		Alpha 阈值（不支持 Canvas 模式）<br/>
		只有当模板的像素的 alpha 大于等于 alphaThreshold 时，才会绘制内容。<br/>
		该数值 0 ~ 1 之间的浮点数，默认值为 0.1
		当被设置为 1 时，会丢弃所有蒙版像素，所以不会显示任何内容 */
		alphaThreshold: number;		
		/** !#en Reverse mask (Not supported Canvas Mode)
		!#zh 反向遮罩（不支持 Canvas 模式） */
		inverted: boolean;		
		/** TODO: remove segments, not supported by graphics
		!#en The segements for ellipse mask.
		!#zh 椭圆遮罩的曲线细分数 */
		segements: number;	
	}	
	/** !#en
	cc.MotionStreak manages a Ribbon based on it's motion in absolute space.                 <br/>
	You construct it with a fadeTime, minimum segment size, texture path, texture            <br/>
	length and color. The fadeTime controls how long it takes each vertex in                 <br/>
	the streak to fade out, the minimum segment size it how many pixels the                  <br/>
	streak will move before adding a new ribbon segment, and the texture                     <br/>
	length is the how many pixels the texture is stretched across. The texture               <br/>
	is vertically aligned along the streak segment.
	!#zh 运动轨迹，用于游戏对象的运动轨迹上实现拖尾渐隐效果。 */
	export class MotionStreak extends Component implements BlendFunc {		
		/** !#en
		!#zh 在编辑器模式下预览拖尾效果。 */
		preview: boolean;		
		/** !#en The fade time to fade.
		!#zh 拖尾的渐隐时间，以秒为单位。 */
		fadeTime: number;		
		/** !#en The minimum segment size.
		!#zh 拖尾之间最小距离。 */
		minSeg: number;		
		/** !#en The stroke's width.
		!#zh 拖尾的宽度。 */
		stroke: number;		
		/** !#en The texture of the MotionStreak.
		!#zh 拖尾的贴图。 */
		texture: Texture2D;		
		/** !#en The color of the MotionStreak.
		!#zh 拖尾的颜色 */
		color: Color;		
		/** !#en The fast Mode.
		!#zh 是否启用了快速模式。当启用快速模式，新的点会被更快地添加，但精度较低。 */
		fastMode: boolean;		
		/**
		!#en Remove all living segments of the ribbon.
		!#zh 删除当前所有的拖尾片段。
		
		@example 
		```js
		// Remove all living segments of the ribbon.
		myMotionStreak.reset();
		``` 
		*/
		reset(): void;		
		/** !#en specify the source Blend Factor, this will generate a custom material object, please pay attention to the memory cost.
		!#zh 指定原图的混合模式，这会克隆一个新的材质对象，注意这带来的开销 */
		srcBlendFactor: macro.BlendFactor;		
		/** !#en specify the destination Blend Factor.
		!#zh 指定目标的混合模式 */
		dstBlendFactor: macro.BlendFactor;	
	}	
	/** !#en The PageView control
	!#zh 页面视图组件 */
	export class PageView extends ScrollView {		
		/** !#en Specify the size type of each page in PageView.
		!#zh 页面视图中每个页面大小类型 */
		sizeMode: PageView.SizeMode;		
		/** !#en The page view direction
		!#zh 页面视图滚动类型 */
		direction: PageView.Direction;		
		/** !#en
		The scroll threshold value, when drag exceeds this value,
		release the next page will automatically scroll, less than the restore
		!#zh 滚动临界值，默认单位百分比，当拖拽超出该数值时，松开会自动滚动下一页，小于时则还原。 */
		scrollThreshold: number;		
		/** !#en
		Auto page turning velocity threshold. When users swipe the PageView quickly,
		it will calculate a velocity based on the scroll distance and time,
		if the calculated velocity is larger than the threshold, then it will trigger page turning.
		!#zh
		快速滑动翻页临界值。
		当用户快速滑动时，会根据滑动开始和结束的距离与时间计算出一个速度值，
		该值与此临界值相比较，如果大于临界值，则进行自动翻页。 */
		autoPageTurningThreshold: number;		
		/** !#en Change the PageTurning event timing of PageView.
		!#zh 设置 PageView PageTurning 事件的发送时机。 */
		pageTurningEventTiming: number;		
		/** !#en The Page View Indicator
		!#zh 页面视图指示器组件 */
		indicator: PageViewIndicator;		
		/** !#en The time required to turn over a page. unit: second
		!#zh 每个页面翻页时所需时间。单位：秒 */
		pageTurningSpeed: number;		
		/** !#en PageView events callback
		!#zh 滚动视图的事件回调函数 */
		pageEvents: Component.EventHandler[];		
		/**
		!#en Returns current page index
		!#zh 返回当前页面索引 
		*/
		getCurrentPageIndex(): number;		
		/**
		!#en Set current page index
		!#zh 设置当前页面索引
		@param index index 
		*/
		setCurrentPageIndex(index: number): void;		
		/**
		!#en Returns all pages of pageview
		!#zh 返回视图中的所有页面 
		*/
		getPages(): Node[];		
		/**
		!#en At the end of the current page view to insert a new view
		!#zh 在当前页面视图的尾部插入一个新视图
		@param page page 
		*/
		addPage(page: Node): void;		
		/**
		!#en Inserts a page in the specified location
		!#zh 将页面插入指定位置中
		@param page page
		@param index index 
		*/
		insertPage(page: Node, index: number): void;		
		/**
		!#en Removes a page from PageView.
		!#zh 移除指定页面
		@param page page 
		*/
		removePage(page: Node): void;		
		/**
		!#en Removes a page at index of PageView.
		!#zh 移除指定下标的页面
		@param index index 
		*/
		removePageAtIndex(index: number): void;		
		/**
		!#en Removes all pages from PageView
		!#zh 移除所有页面 
		*/
		removeAllPages(): void;		
		/**
		!#en Scroll PageView to index.
		!#zh 滚动到指定页面
		@param idx index of page.
		@param timeInSecond scrolling time 
		*/
		scrollToPage(idx: number, timeInSecond: number): void;	
	}	
	/** !#en The Page View Indicator Component
	!#zh 页面视图每页标记组件 */
	export class PageViewIndicator extends Component {		
		/** !#en The spriteFrame for each element.
		!#zh 每个页面标记显示的图片 */
		spriteFrame: SpriteFrame;		
		/** !#en The location direction of PageViewIndicator.
		!#zh 页面标记摆放方向 */
		direction: PageViewIndicator.Direction;		
		/** !#en The cellSize for each element.
		!#zh 每个页面标记的大小 */
		cellSize: Size;		
		/** !#en The distance between each element.
		!#zh 每个页面标记之间的边距 */
		spacing: number;		
		/**
		!#en Set Page View
		!#zh 设置页面视图
		@param target target 
		*/
		setPageView(target: PageView): void;	
	}	
	/** !#en
	Visual indicator of progress in some operation.
	Displays a bar to the user representing how far the operation has progressed.
	!#zh
	进度条组件，可用于显示加载资源时的进度。 */
	export class ProgressBar extends Component {		
		/** !#en The targeted Sprite which will be changed progressively.
		!#zh 用来显示进度条比例的 Sprite 对象。 */
		barSprite: Sprite;		
		/** !#en The progress mode, there are two modes supported now: horizontal and vertical.
		!#zh 进度条的模式 */
		mode: ProgressBar.Mode;		
		/** !#en The total width or height of the bar sprite.
		!#zh 进度条实际的总长度 */
		totalLength: number;		
		/** !#en The current progress of the bar sprite. The valid value is between 0-1.
		!#zh 当前进度值，该数值的区间是 0-1 之间。 */
		progress: number;		
		/** !#en Whether reverse the progress direction of the bar sprite.
		!#zh 进度条是否进行反方向变化。 */
		reverse: boolean;	
	}	
	/** !#en
	Base class for components which supports rendering features.
	!#zh
	所有支持渲染的组件的基类 */
	export class RenderComponent extends Component {		
		/** !#en The materials used by this render component.
		!#zh 渲染组件使用的材质。 */
		sharedMaterials: Material[];		
		/**
		!#en Get the material by index.
		!#zh 根据指定索引获取材质
		@param index index 
		*/
		getMaterial(index: number): MaterialVariant;		
		/**
		!#en Gets all the materials.
		!#zh 获取所有材质。 
		*/
		getMaterials(): MaterialVariant[];		
		/**
		!#en Set the material by index.
		!#zh 根据指定索引设置材质
		@param index index
		@param material material 
		*/
		setMaterial(index: number, material: Material): Material;	
	}	
	/** !#en The RichText Component.
	!#zh 富文本组件 */
	export class RichText extends Component {		
		/** !#en Content string of RichText.
		!#zh 富文本显示的文本内容。 */
		string: string;		
		/** !#en Horizontal Alignment of each line in RichText.
		!#zh 文本内容的水平对齐方式。 */
		horizontalAlign: macro.TextAlignment;		
		/** !#en Font size of RichText.
		!#zh 富文本字体大小。 */
		fontSize: number;		
		/** !#en Custom System font of RichText
		!#zh 富文本定制系统字体 */
		fontFamily: string;		
		/** !#en Custom TTF font of RichText
		!#zh  富文本定制字体 */
		font: TTFFont;		
		/** !#en Whether use system font name or not.
		!#zh 是否使用系统字体。 */
		useSystemFont: boolean;		
		/** !#en The cache mode of label. This mode only supports system fonts.
		!#zh 文本缓存模式, 该模式只支持系统字体。 */
		cacheMode: Label.CacheMode;		
		/** !#en The maximize width of the RichText
		!#zh 富文本的最大宽度 */
		maxWidth: number;		
		/** !#en Line Height of RichText.
		!#zh 富文本行高。 */
		lineHeight: number;		
		/** !#en The image atlas for the img tag. For each src value in the img tag, there should be a valid spriteFrame in the image atlas.
		!#zh 对于 img 标签里面的 src 属性名称，都需要在 imageAtlas 里面找到一个有效的 spriteFrame，否则 img tag 会判定为无效。 */
		imageAtlas: SpriteAtlas;		
		/** !#en
		Once checked, the RichText will block all input events (mouse and touch) within
		the bounding box of the node, preventing the input from penetrating into the underlying node.
		!#zh
		选中此选项后，RichText 将阻止节点边界框中的所有输入事件（鼠标和触摸），从而防止输入事件穿透到底层节点。 */
		handleTouchEvent: boolean;	
	}	
	/** !#en
	The Scrollbar control allows the user to scroll an image or other view that is too large to see completely
	!#zh 滚动条组件 */
	export class Scrollbar extends Component {		
		/** !#en The "handle" part of the scrollbar.
		!#zh 作为当前滚动区域位置显示的滑块 Sprite。 */
		handle: Sprite;		
		/** !#en The direction of scrollbar.
		!#zh ScrollBar 的滚动方向。 */
		direction: Scrollbar.Direction;		
		/** !#en Whether enable auto hide or not.
		!#zh 是否在没有滚动动作时自动隐藏 ScrollBar。 */
		enableAutoHide: boolean;		
		/** !#en
		The time to hide scrollbar when scroll finished.
		Note: This value is only useful when enableAutoHide is true.
		!#zh
		没有滚动动作后经过多久会自动隐藏。
		注意：只要当 “enableAutoHide” 为 true 时，才有效。 */
		autoHideTime: number;	
	}	
	/** !#en
	Layout container for a view hierarchy that can be scrolled by the user,
	allowing it to be larger than the physical display.
	
	!#zh
	滚动视图组件 */
	export class ScrollView extends Component {		
		/** !#en This is a reference to the UI element to be scrolled.
		!#zh 可滚动展示内容的节点。 */
		content: Node;		
		/** !#en Enable horizontal scroll.
		!#zh 是否开启水平滚动。 */
		horizontal: boolean;		
		/** !#en Enable vertical scroll.
		!#zh 是否开启垂直滚动。 */
		vertical: boolean;		
		/** !#en When inertia is set, the content will continue to move when touch ended.
		!#zh 是否开启滚动惯性。 */
		inertia: boolean;		
		/** !#en
		It determines how quickly the content stop moving. A value of 1 will stop the movement immediately.
		A value of 0 will never stop the movement until it reaches to the boundary of scrollview.
		!#zh
		开启惯性后，在用户停止触摸后滚动多快停止，0表示永不停止，1表示立刻停止。 */
		brake: number;		
		/** !#en When elastic is set, the content will be bounce back when move out of boundary.
		!#zh 是否允许滚动内容超过边界，并在停止触摸后回弹。 */
		elastic: boolean;		
		/** !#en The elapse time of bouncing back. A value of 0 will bounce back immediately.
		!#zh 回弹持续的时间，0 表示将立即反弹。 */
		bounceDuration: number;		
		/** !#en The horizontal scrollbar reference.
		!#zh 水平滚动的 ScrollBar。 */
		horizontalScrollBar: Scrollbar;		
		/** !#en The vertical scrollbar reference.
		!#zh 垂直滚动的 ScrollBar。 */
		verticalScrollBar: Scrollbar;		
		/** !#en Scrollview events callback
		!#zh 滚动视图的事件回调函数 */
		scrollEvents: Component.EventHandler[];		
		/** !#en If cancelInnerEvents is set to true, the scroll behavior will cancel touch events on inner content nodes
		It's set to true by default.
		!#zh 如果这个属性被设置为 true，那么滚动行为会取消子节点上注册的触摸事件，默认被设置为 true。
		注意，子节点上的 touchstart 事件仍然会触发，触点移动距离非常短的情况下 touchmove 和 touchend 也不会受影响。 */
		cancelInnerEvents: boolean;		
		/**
		!#en Scroll the content to the bottom boundary of ScrollView.
		!#zh 视图内容将在规定时间内滚动到视图底部。
		@param timeInSecond Scroll time in second, if you don't pass timeInSecond,
		the content will jump to the bottom boundary immediately.
		@param attenuated Whether the scroll acceleration attenuated, default is true.
		
		@example 
		```js
		// Scroll to the bottom of the view.
		scrollView.scrollToBottom(0.1);
		``` 
		*/
		scrollToBottom(timeInSecond?: number, attenuated?: boolean): void;		
		/**
		!#en Scroll the content to the top boundary of ScrollView.
		!#zh 视图内容将在规定时间内滚动到视图顶部。
		@param timeInSecond Scroll time in second, if you don't pass timeInSecond,
		the content will jump to the top boundary immediately.
		@param attenuated Whether the scroll acceleration attenuated, default is true.
		
		@example 
		```js
		// Scroll to the top of the view.
		scrollView.scrollToTop(0.1);
		``` 
		*/
		scrollToTop(timeInSecond?: number, attenuated?: boolean): void;		
		/**
		!#en Scroll the content to the left boundary of ScrollView.
		!#zh 视图内容将在规定时间内滚动到视图左边。
		@param timeInSecond Scroll time in second, if you don't pass timeInSecond,
		the content will jump to the left boundary immediately.
		@param attenuated Whether the scroll acceleration attenuated, default is true.
		
		@example 
		```js
		// Scroll to the left of the view.
		scrollView.scrollToLeft(0.1);
		``` 
		*/
		scrollToLeft(timeInSecond?: number, attenuated?: boolean): void;		
		/**
		!#en Scroll the content to the right boundary of ScrollView.
		!#zh 视图内容将在规定时间内滚动到视图右边。
		@param timeInSecond Scroll time in second, if you don't pass timeInSecond,
		the content will jump to the right boundary immediately.
		@param attenuated Whether the scroll acceleration attenuated, default is true.
		
		@example 
		```js
		// Scroll to the right of the view.
		scrollView.scrollToRight(0.1);
		``` 
		*/
		scrollToRight(timeInSecond?: number, attenuated?: boolean): void;		
		/**
		!#en Scroll the content to the top left boundary of ScrollView.
		!#zh 视图内容将在规定时间内滚动到视图左上角。
		@param timeInSecond Scroll time in second, if you don't pass timeInSecond,
		the content will jump to the top left boundary immediately.
		@param attenuated Whether the scroll acceleration attenuated, default is true.
		
		@example 
		```js
		// Scroll to the upper left corner of the view.
		scrollView.scrollToTopLeft(0.1);
		``` 
		*/
		scrollToTopLeft(timeInSecond?: number, attenuated?: boolean): void;		
		/**
		!#en Scroll the content to the top right boundary of ScrollView.
		!#zh 视图内容将在规定时间内滚动到视图右上角。
		@param timeInSecond Scroll time in second, if you don't pass timeInSecond,
		the content will jump to the top right boundary immediately.
		@param attenuated Whether the scroll acceleration attenuated, default is true.
		
		@example 
		```js
		// Scroll to the top right corner of the view.
		scrollView.scrollToTopRight(0.1);
		``` 
		*/
		scrollToTopRight(timeInSecond?: number, attenuated?: boolean): void;		
		/**
		!#en Scroll the content to the bottom left boundary of ScrollView.
		!#zh 视图内容将在规定时间内滚动到视图左下角。
		@param timeInSecond Scroll time in second, if you don't pass timeInSecond,
		the content will jump to the bottom left boundary immediately.
		@param attenuated Whether the scroll acceleration attenuated, default is true.
		
		@example 
		```js
		// Scroll to the lower left corner of the view.
		scrollView.scrollToBottomLeft(0.1);
		``` 
		*/
		scrollToBottomLeft(timeInSecond?: number, attenuated?: boolean): void;		
		/**
		!#en Scroll the content to the bottom right boundary of ScrollView.
		!#zh 视图内容将在规定时间内滚动到视图右下角。
		@param timeInSecond Scroll time in second, if you don't pass timeInSecond,
		the content will jump to the bottom right boundary immediately.
		@param attenuated Whether the scroll acceleration attenuated, default is true.
		
		@example 
		```js
		// Scroll to the lower right corner of the view.
		scrollView.scrollToBottomRight(0.1);
		``` 
		*/
		scrollToBottomRight(timeInSecond?: number, attenuated?: boolean): void;		
		/**
		!#en Scroll with an offset related to the ScrollView's top left origin, if timeInSecond is omitted, then it will jump to the
		      specific offset immediately.
		!#zh 视图内容在规定时间内将滚动到 ScrollView 相对左上角原点的偏移位置, 如果 timeInSecond参数不传，则立即滚动到指定偏移位置。
		@param offset A Vec2, the value of which each axis between 0 and maxScrollOffset
		@param timeInSecond Scroll time in second, if you don't pass timeInSecond,
		the content will jump to the specific offset of ScrollView immediately.
		@param attenuated Whether the scroll acceleration attenuated, default is true.
		
		@example 
		```js
		// Scroll to middle position in 0.1 second in x-axis
		let maxScrollOffset = this.getMaxScrollOffset();
		scrollView.scrollToOffset(cc.v2(maxScrollOffset.x / 2, 0), 0.1);
		``` 
		*/
		scrollToOffset(offset: Vec2, timeInSecond?: number, attenuated?: boolean): void;		
		/**
		!#en  Get the positive offset value corresponds to the content's top left boundary.
		!#zh  获取滚动视图相对于左上角原点的当前滚动偏移 
		*/
		getScrollOffset(): Vec2;		
		/**
		!#en Get the maximize available  scroll offset
		!#zh 获取滚动视图最大可以滚动的偏移量 
		*/
		getMaxScrollOffset(): Vec2;		
		/**
		!#en Scroll the content to the horizontal percent position of ScrollView.
		!#zh 视图内容在规定时间内将滚动到 ScrollView 水平方向的百分比位置上。
		@param percent A value between 0 and 1.
		@param timeInSecond Scroll time in second, if you don't pass timeInSecond,
		the content will jump to the horizontal percent position of ScrollView immediately.
		@param attenuated Whether the scroll acceleration attenuated, default is true.
		
		@example 
		```js
		// Scroll to middle position.
		scrollView.scrollToBottomRight(0.5, 0.1);
		``` 
		*/
		scrollToPercentHorizontal(percent: number, timeInSecond?: number, attenuated?: boolean): void;		
		/**
		!#en Scroll the content to the percent position of ScrollView in any direction.
		!#zh 视图内容在规定时间内进行垂直方向和水平方向的滚动，并且滚动到指定百分比位置上。
		@param anchor A point which will be clamp between cc.v2(0,0) and cc.v2(1,1).
		@param timeInSecond Scroll time in second, if you don't pass timeInSecond,
		the content will jump to the percent position of ScrollView immediately.
		@param attenuated Whether the scroll acceleration attenuated, default is true.
		
		@example 
		```js
		// Vertical scroll to the bottom of the view.
		scrollView.scrollTo(cc.v2(0, 1), 0.1);
		
		// Horizontal scroll to view right.
		scrollView.scrollTo(cc.v2(1, 0), 0.1);
		``` 
		*/
		scrollTo(anchor: Vec2, timeInSecond?: number, attenuated?: boolean): void;		
		/**
		!#en Scroll the content to the vertical percent position of ScrollView.
		!#zh 视图内容在规定时间内滚动到 ScrollView 垂直方向的百分比位置上。
		@param percent A value between 0 and 1.
		@param timeInSecond Scroll time in second, if you don't pass timeInSecond,
		the content will jump to the vertical percent position of ScrollView immediately.
		@param attenuated Whether the scroll acceleration attenuated, default is true.
		// Scroll to middle position.
		scrollView.scrollToPercentVertical(0.5, 0.1); 
		*/
		scrollToPercentVertical(percent: number, timeInSecond?: number, attenuated?: boolean): void;		
		/**
		!#en  Stop auto scroll immediately
		!#zh  停止自动滚动, 调用此 API 可以让 Scrollview 立即停止滚动 
		*/
		stopAutoScroll(): void;		
		/**
		!#en Modify the content position.
		!#zh 设置当前视图内容的坐标点。
		@param position The position in content's parent space. 
		*/
		setContentPosition(position: Vec2): void;		
		/**
		!#en Query the content's position in its parent space.
		!#zh 获取当前视图内容的坐标点。 
		*/
		getContentPosition(): Vec2;		
		/**
		!#en Query whether the user is currently dragging the ScrollView to scroll it
		!#zh 用户是否在拖拽当前滚动视图 
		*/
		isScrolling(): boolean;		
		/**
		!#en Query whether the ScrollView is currently scrolling because of a bounceback or inertia slowdown.
		!#zh 当前滚动视图是否在惯性滚动 
		*/
		isAutoScrolling(): boolean;	
	}	
	/** !#en The Slider Control
	!#zh 滑动器组件 */
	export class Slider extends Component {		
		/** !#en The "handle" part of the slider
		!#zh 滑动器滑块按钮部件 */
		handle: Button;		
		/** !#en The slider direction
		!#zh 滑动器方向 */
		direction: Slider.Direction;		
		/** !#en The current progress of the slider. The valid value is between 0-1
		!#zh 当前进度值，该数值的区间是 0-1 之间 */
		progress: number;		
		/** !#en The slider slide events' callback array
		!#zh 滑动器组件滑动事件回调函数数组 */
		slideEvents: Component.EventHandler[];	
	}	
	/** !#en Renders a sprite in the scene.
	!#zh 该组件用于在场景中渲染精灵。 */
	export class Sprite extends RenderComponent implements BlendFunc {		
		/** !#en The sprite frame of the sprite.
		!#zh 精灵的精灵帧 */
		spriteFrame: SpriteFrame;		
		/** !#en The sprite render type.
		!#zh 精灵渲染类型 */
		type: Sprite.Type;		
		/** !#en
		The fill type, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
		!#zh
		精灵填充类型，仅渲染类型设置为 cc.Sprite.Type.FILLED 时有效。 */
		fillType: Sprite.FillType;		
		/** !#en
		The fill Center, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
		!#zh
		填充中心点，仅渲染类型设置为 cc.Sprite.Type.FILLED 时有效。 */
		fillCenter: Vec2;		
		/** !#en
		The fill Start, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
		!#zh
		填充起始点，仅渲染类型设置为 cc.Sprite.Type.FILLED 时有效。 */
		fillStart: number;		
		/** !#en
		The fill Range, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
		!#zh
		填充范围，仅渲染类型设置为 cc.Sprite.Type.FILLED 时有效。 */
		fillRange: number;		
		/** !#en specify the frame is trimmed or not.
		!#zh 是否使用裁剪模式 */
		trim: boolean;		
		/** !#en specify the size tracing mode.
		!#zh 精灵尺寸调整模式 */
		sizeMode: Sprite.SizeMode;		
		/**
		Change the state of sprite.
		@param state NORMAL or GRAY State. 
		*/
		setState(state: Sprite.State): void;		
		/**
		Gets the current state. 
		*/
		getState(): Sprite.State;		
		/** !#en specify the source Blend Factor, this will generate a custom material object, please pay attention to the memory cost.
		!#zh 指定原图的混合模式，这会克隆一个新的材质对象，注意这带来的开销 */
		srcBlendFactor: macro.BlendFactor;		
		/** !#en specify the destination Blend Factor.
		!#zh 指定目标的混合模式 */
		dstBlendFactor: macro.BlendFactor;	
	}	
	/** !#en The toggle component is a CheckBox, when it used together with a ToggleGroup, it
	could be treated as a RadioButton.
	!#zh Toggle 是一个 CheckBox，当它和 ToggleGroup 一起使用的时候，可以变成 RadioButton。 */
	export class Toggle extends Button implements GraySpriteState {		
		/** !#en When this value is true, the check mark component will be enabled, otherwise
		the check mark component will be disabled.
		!#zh 如果这个设置为 true，则 check mark 组件会处于 enabled 状态，否则处于 disabled 状态。 */
		isChecked: boolean;		
		/** !#en The toggle group which the toggle belongs to, when it is null, the toggle is a CheckBox.
		Otherwise, the toggle is a RadioButton.
		!#zh Toggle 所属的 ToggleGroup，这个属性是可选的。如果这个属性为 null，则 Toggle 是一个 CheckBox，
		否则，Toggle 是一个 RadioButton。 */
		toggleGroup: ToggleGroup;		
		/** !#en The image used for the checkmark.
		!#zh Toggle 处于选中状态时显示的图片 */
		checkMark: Sprite;		
		/** !#en If Toggle is clicked, it will trigger event's handler
		!#zh Toggle 按钮的点击事件列表。 */
		checkEvents: Component.EventHandler[];		
		/**
		!#en Make the toggle button checked.
		!#zh 使 toggle 按钮处于选中状态 
		*/
		check(): void;		
		/**
		!#en Make the toggle button unchecked.
		!#zh 使 toggle 按钮处于未选中状态 
		*/
		uncheck(): void;		
		/** !#en The normal material.
		!#zh 正常状态的材质。 */
		normalMaterial: Material;		
		/** !#en The gray material.
		!#zh 置灰状态的材质。 */
		grayMaterial: Material;	
	}	
	/** !#en ToggleContainer is not a visiable UI component but a way to modify the behavior of a set of Toggles. <br/>
	Toggles that belong to the same group could only have one of them to be switched on at a time.<br/>
	Note: All the first layer child node containing the toggle component will auto be added to the container
	!#zh ToggleContainer 不是一个可见的 UI 组件，它可以用来修改一组 Toggle 组件的行为。<br/>
	当一组 Toggle 属于同一个 ToggleContainer 的时候，任何时候只能有一个 Toggle 处于选中状态。<br/>
	注意：所有包含 Toggle 组件的一级子节点都会自动被添加到该容器中 */
	export class ToggleContainer extends Component {		
		/** !#en If this setting is true, a toggle could be switched off and on when pressed.
		If it is false, it will make sure there is always only one toggle could be switched on
		and the already switched on toggle can't be switched off.
		!#zh 如果这个设置为 true， 那么 toggle 按钮在被点击的时候可以反复地被选中和未选中。 */
		allowSwitchOff: boolean;		
		/** !#en If Toggle is clicked, it will trigger event's handler
		!#zh Toggle 按钮的点击事件列表。 */
		checkEvents: Component.EventHandler[];		
		/** !#en Read only property, return the toggle items array reference managed by ToggleContainer.
		!#zh 只读属性，返回 ToggleContainer 管理的 toggle 数组引用 */
		toggleItems: Toggle[];	
	}	
	/** !#en ToggleGroup is not a visiable UI component but a way to modify the behavior of a set of Toggles.
	Toggles that belong to the same group could only have one of them to be switched on at a time.
	!#zh ToggleGroup 不是一个可见的 UI 组件，它可以用来修改一组 Toggle  组件的行为。当一组 Toggle 属于同一个 ToggleGroup 的时候，
	任何时候只能有一个 Toggle 处于选中状态。 */
	export class ToggleGroup extends Component {		
		/** !#en If this setting is true, a toggle could be switched off and on when pressed.
		If it is false, it will make sure there is always only one toggle could be switched on
		and the already switched on toggle can't be switched off.
		!#zh 如果这个设置为 true， 那么 toggle 按钮在被点击的时候可以反复地被选中和未选中。 */
		allowSwitchOff: boolean;		
		/** !#en Read only property, return the toggle items array reference managed by toggleGroup.
		!#zh 只读属性，返回 toggleGroup 管理的 toggle 数组引用 */
		toggleItems: any[];	
	}	
	/** !#en
	Handling touch events in a ViewGroup takes special care,
	because it's common for a ViewGroup to have children that are targets for different touch events than the ViewGroup itself.
	To make sure that each view correctly receives the touch events intended for it,
	ViewGroup should register capture phase event and handle the event propagation properly.
	Please refer to Scrollview for more  information.
	
	!#zh
	ViewGroup的事件处理比较特殊，因为 ViewGroup 里面的子节点关心的事件跟 ViewGroup 本身可能不一样。
	为了让子节点能够正确地处理事件，ViewGroup 需要注册 capture 阶段的事件，并且合理地处理 ViewGroup 之间的事件传递。
	请参考 ScrollView 的实现来获取更多信息。 */
	export class ViewGroup extends Component {	
	}	
	/** !#en
	Stores and manipulate the anchoring based on its parent.
	Widget are used for GUI but can also be used for other things.
	Widget will adjust current node's position and size automatically, but the results after adjustment can not be obtained until the next frame unless you call {{#crossLink "Widget/updateAlignment:method"}}{{/crossLink}} manually.
	!#zh
	Widget 组件，用于设置和适配其相对于父节点的边距，Widget 通常被用于 UI 界面，也可以用于其他地方。
	Widget 会自动调整当前节点的坐标和宽高，不过目前调整后的结果要到下一帧才能在脚本里获取到，除非你先手动调用 {{#crossLink "Widget/updateAlignment:method"}}{{/crossLink}}。 */
	export class Widget extends Component {		
		/** !#en Specifies an alignment target that can only be one of the parent nodes of the current node.
		The default value is null, and when null, indicates the current parent.
		!#zh 指定一个对齐目标，只能是当前节点的其中一个父节点，默认为空，为空时表示当前父节点。 */
		target: Node;		
		/** !#en Whether to align the top.
		!#zh 是否对齐上边。 */
		isAlignTop: boolean;		
		/** !#en
		Vertically aligns the midpoint, This will open the other vertical alignment options cancel.
		!#zh
		是否垂直方向对齐中点，开启此项会将垂直方向其他对齐选项取消。 */
		isAlignVerticalCenter: boolean;		
		/** !#en Whether to align the bottom.
		!#zh 是否对齐下边。 */
		isAlignBottom: boolean;		
		/** !#en Whether to align the left.
		!#zh 是否对齐左边 */
		isAlignLeft: boolean;		
		/** !#en
		Horizontal aligns the midpoint. This will open the other horizontal alignment options canceled.
		!#zh
		是否水平方向对齐中点，开启此选项会将水平方向其他对齐选项取消。 */
		isAlignHorizontalCenter: boolean;		
		/** !#en Whether to align the right.
		!#zh 是否对齐右边。 */
		isAlignRight: boolean;		
		/** !#en
		Whether the stretched horizontally, when enable the left and right alignment will be stretched horizontally,
		the width setting is invalid (read only).
		!#zh
		当前是否水平拉伸。当同时启用左右对齐时，节点将会被水平拉伸，此时节点的宽度只读。 */
		isStretchWidth: boolean;		
		/** !#en
		Whether the stretched vertically, when enable the left and right alignment will be stretched vertically,
		then height setting is invalid (read only)
		!#zh
		当前是否垂直拉伸。当同时启用上下对齐时，节点将会被垂直拉伸，此时节点的高度只读。 */
		isStretchHeight: boolean;		
		/** !#en
		The margins between the top of this node and the top of parent node,
		the value can be negative, Only available in 'isAlignTop' open.
		!#zh
		本节点顶边和父节点顶边的距离，可填写负值，只有在 isAlignTop 开启时才有作用。 */
		top: number;		
		/** !#en
		The margins between the bottom of this node and the bottom of parent node,
		the value can be negative, Only available in 'isAlignBottom' open.
		!#zh
		本节点底边和父节点底边的距离，可填写负值，只有在 isAlignBottom 开启时才有作用。 */
		bottom: number;		
		/** !#en
		The margins between the left of this node and the left of parent node,
		the value can be negative, Only available in 'isAlignLeft' open.
		!#zh
		本节点左边和父节点左边的距离，可填写负值，只有在 isAlignLeft 开启时才有作用。 */
		left: number;		
		/** !#en
		The margins between the right of this node and the right of parent node,
		the value can be negative, Only available in 'isAlignRight' open.
		!#zh
		本节点右边和父节点右边的距离，可填写负值，只有在 isAlignRight 开启时才有作用。 */
		right: number;		
		/** !#en
		Horizontal aligns the midpoint offset value,
		the value can be negative, Only available in 'isAlignHorizontalCenter' open.
		!#zh 水平居中的偏移值，可填写负值，只有在 isAlignHorizontalCenter 开启时才有作用。 */
		horizontalCenter: number;		
		/** !#en
		Vertical aligns the midpoint offset value,
		the value can be negative, Only available in 'isAlignVerticalCenter' open.
		!#zh 垂直居中的偏移值，可填写负值，只有在 isAlignVerticalCenter 开启时才有作用。 */
		verticalCenter: number;		
		/** !#en If true, horizontalCenter is pixel margin, otherwise is percentage (0 - 1) margin.
		!#zh 如果为 true，"horizontalCenter" 将会以像素作为偏移值，反之为百分比（0 到 1）。 */
		isAbsoluteHorizontalCenter: boolean;		
		/** !#en If true, verticalCenter is pixel margin, otherwise is percentage (0 - 1) margin.
		!#zh 如果为 true，"verticalCenter" 将会以像素作为偏移值，反之为百分比（0 到 1）。 */
		isAbsoluteVerticalCenter: boolean;		
		/** !#en
		If true, top is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's height.
		!#zh
		如果为 true，"top" 将会以像素作为边距，否则将会以相对父物体高度的百分比（0 到 1）作为边距。 */
		isAbsoluteTop: boolean;		
		/** !#en
		If true, bottom is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's height.
		!#zh
		如果为 true，"bottom" 将会以像素作为边距，否则将会以相对父物体高度的百分比（0 到 1）作为边距。 */
		isAbsoluteBottom: boolean;		
		/** !#en
		If true, left is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's width.
		!#zh
		如果为 true，"left" 将会以像素作为边距，否则将会以相对父物体宽度的百分比（0 到 1）作为边距。 */
		isAbsoluteLeft: boolean;		
		/** !#en
		If true, right is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's width.
		!#zh
		如果为 true，"right" 将会以像素作为边距，否则将会以相对父物体宽度的百分比（0 到 1）作为边距。 */
		isAbsoluteRight: boolean;		
		/** !#en Specifies the alignment mode of the Widget, which determines when the widget should refresh.
		!#zh 指定 Widget 的对齐模式，用于决定 Widget 应该何时刷新。 */
		alignMode: Widget.AlignMode;		
		/**
		!#en
		Immediately perform the widget alignment. You need to manually call this method only if
		you need to get the latest results after the alignment before the end of current frame.
		!#zh
		立刻执行 widget 对齐操作。这个接口一般不需要手工调用。
		只有当你需要在当前帧结束前获得 widget 对齐后的最新结果时才需要手动调用这个方法。
		
		@example 
		```js
		widget.top = 10;       // change top margin
		cc.log(widget.node.y); // not yet changed
		widget.updateAlignment();
		cc.log(widget.node.y); // changed
		``` 
		*/
		updateAlignment(): void;		
		/** !#en
		When turned on, it will only be aligned once at the end of the onEnable frame,
		then immediately disables the current component.
		This will allow the script or animation to continue controlling the current node.
		Note: It will still be aligned at the frame when onEnable is called.
		!#zh
		开启后仅会在 onEnable 的当帧结束时对齐一次，然后立刻禁用当前组件。
		这样便于脚本或动画继续控制当前节点。
		注意：onEnable 时所在的那一帧仍然会进行对齐。 */
		isAlignOnce: boolean;	
	}	
	/** !#en SwanSubContextView is a view component which controls open data context viewport in WeChat game platform.<br/>
	The component's node size decide the viewport of the sub context content in main context,
	the entire sub context texture will be scaled to the node's bounding box area.<br/>
	This component provides multiple important features:<br/>
	1. Sub context could use its own resolution size and policy.<br/>
	2. Sub context could be minized to smallest size it needed.<br/>
	3. Resolution of sub context content could be increased.<br/>
	4. User touch input is transformed to the correct viewport.<br/>
	5. Texture update is handled by this component. User don't need to worry.<br/>
	One important thing to be noted, whenever the node's bounding box change,
	you need to manually reset the viewport of sub context using updateSubContextViewport.
	!#zh SwanSubContextView 可以用来控制百度小游戏平台开放数据域在主域中的视窗的位置。<br/>
	这个组件的节点尺寸决定了开放数据域内容在主域中的尺寸，整个开放数据域会被缩放到节点的包围盒范围内。<br/>
	在这个组件的控制下，用户可以更自由得控制开放数据域：<br/>
	1. 子域中可以使用独立的设计分辨率和适配模式<br/>
	2. 子域区域尺寸可以缩小到只容纳内容即可<br/>
	3. 子域的分辨率也可以被放大，以便获得更清晰的显示效果<br/>
	4. 用户输入坐标会被自动转换到正确的子域视窗中<br/>
	5. 子域内容贴图的更新由组件负责，用户不需要处理<br/>
	唯一需要注意的是，当子域节点的包围盒发生改变时，开发者需要使用 `updateSubContextViewport` 来手动更新子域视窗。 */
	export class SwanSubContextView extends Component {		
		/**
		!#en Update the sub context viewport manually, it should be called whenever the node's bounding box changes.
		!#zh 更新开放数据域相对于主域的 viewport，这个函数应该在节点包围盒改变时手动调用。 
		*/
		updateSubContextViewport(): void;	
	}	
	/** !#en WXSubContextView is a view component which controls open data context viewport in WeChat game platform.<br/>
	The component's node size decide the viewport of the sub context content in main context,
	the entire sub context texture will be scaled to the node's bounding box area.<br/>
	This component provides multiple important features:<br/>
	1. Sub context could use its own resolution size and policy.<br/>
	2. Sub context could be minized to smallest size it needed.<br/>
	3. Resolution of sub context content could be increased.<br/>
	4. User touch input is transformed to the correct viewport.<br/>
	5. Texture update is handled by this component. User don't need to worry.<br/>
	One important thing to be noted, whenever the node's bounding box change,
	you need to manually reset the viewport of sub context using updateSubContextViewport.
	!#zh WXSubContextView 可以用来控制微信小游戏平台开放数据域在主域中的视窗的位置。<br/>
	这个组件的节点尺寸决定了开放数据域内容在主域中的尺寸，整个开放数据域会被缩放到节点的包围盒范围内。<br/>
	在这个组件的控制下，用户可以更自由得控制开放数据域：<br/>
	1. 子域中可以使用独立的设计分辨率和适配模式<br/>
	2. 子域区域尺寸可以缩小到只容纳内容即可<br/>
	3. 子域的分辨率也可以被放大，以便获得更清晰的显示效果<br/>
	4. 用户输入坐标会被自动转换到正确的子域视窗中<br/>
	5. 子域内容贴图的更新由组件负责，用户不需要处理<br/>
	唯一需要注意的是，当子域节点的包围盒发生改变时，开发者需要使用 `updateSubContextViewport` 来手动更新子域视窗。 */
	export class WXSubContextView extends Component {		
		/**
		!#en Reset open data context size and viewport
		!#zh 重置开放数据域的尺寸和视窗 
		*/
		reset(): void;		
		/**
		!#en Update the sub context viewport manually, it should be called whenever the node's bounding box changes.
		!#zh 更新开放数据域相对于主域的 viewport，这个函数应该在节点包围盒改变时手动调用。 
		*/
		updateSubContextViewport(): void;	
	}	
	/** undefined */
	export class WorldManifold {		
		/** !#en
		world contact point (point of intersection)
		!#zh
		碰撞点集合 */
		points: Vec2[];		
		/** !#en
		world vector pointing from A to B
		!#zh
		世界坐标系下由 A 指向 B 的向量 */
		normal: Vec2;	
	}	
	/** !#en
	A manifold point is a contact point belonging to a contact manifold.
	It holds details related to the geometry and dynamics of the contact points.
	Note: the impulses are used for internal caching and may not
	provide reliable contact forces, especially for high speed collisions.
	!#zh
	ManifoldPoint 是接触信息中的接触点信息。它拥有关于几何和接触点的详细信息。
	注意：信息中的冲量用于系统内部缓存，提供的接触力可能不是很准确，特别是高速移动中的碰撞信息。 */
	export class ManifoldPoint {		
		/** !#en
		The local point usage depends on the manifold type:
		-e_circles: the local center of circleB
		-e_faceA: the local center of circleB or the clip point of polygonB
		-e_faceB: the clip point of polygonA
		!#zh
		本地坐标点的用途取决于 manifold 的类型
		- e_circles: circleB 的本地中心点
		- e_faceA: circleB 的本地中心点 或者是 polygonB 的截取点
		- e_faceB: polygonB 的截取点 */
		localPoint: Vec2;		
		/** !#en
		Normal impulse.
		!#zh
		法线冲量。 */
		normalImpulse: number;		
		/** !#en
		Tangent impulse.
		!#zh
		切线冲量。 */
		tangentImpulse: number;	
	}	
	/** undefined */
	export class Manifold {		
		/** !#en
		Manifold type :  0: e_circles, 1: e_faceA, 2: e_faceB
		!#zh
		Manifold 类型 :  0: e_circles, 1: e_faceA, 2: e_faceB */
		type: number;		
		/** !#en
		The local point usage depends on the manifold type:
		-e_circles: the local center of circleA
		-e_faceA: the center of faceA
		-e_faceB: the center of faceB
		!#zh
		用途取决于 manifold 类型
		-e_circles: circleA 的本地中心点
		-e_faceA: faceA 的本地中心点
		-e_faceB: faceB 的本地中心点 */
		localPoint: Vec2;		
		/** !#en
		-e_circles: not used
		-e_faceA: the normal on polygonA
		-e_faceB: the normal on polygonB
		!#zh
		-e_circles: 没被使用到
		-e_faceA: polygonA 的法向量
		-e_faceB: polygonB 的法向量 */
		localNormal: Vec2;		
		/** !#en
		the points of contact.
		!#zh
		接触点信息。 */
		points: ManifoldPoint[];	
	}	
	/** !#en
	Contact impulses for reporting.
	!#zh
	用于返回给回调的接触冲量。 */
	export class PhysicsImpulse {		
		/** !#en
		Normal impulses.
		!#zh
		法线方向的冲量 */
		normalImpulses: any;		
		/** !#en
		Tangent impulses
		!#zh
		切线方向的冲量 */
		tangentImpulses: any;	
	}	
	/** !#en
	PhysicsContact will be generated during begin and end collision as a parameter of the collision callback.
	Note that contacts will be reused for speed up cpu time, so do not cache anything in the contact.
	!#zh
	物理接触会在开始和结束碰撞之间生成，并作为参数传入到碰撞回调函数中。
	注意：传入的物理接触会被系统进行重用，所以不要在使用中缓存里面的任何信息。 */
	export class PhysicsContact {		
		/**
		!#en
		Get the world manifold.
		!#zh
		获取世界坐标系下的碰撞信息。 
		*/
		getWorldManifold(): WorldManifold;		
		/**
		!#en
		Get the manifold.
		!#zh
		获取本地（局部）坐标系下的碰撞信息。 
		*/
		getManifold(): Manifold;		
		/**
		!#en
		Get the impulses.
		Note: PhysicsImpulse can only used in onPostSolve callback.
		!#zh
		获取冲量信息
		注意：这个信息只有在 onPostSolve 回调中才能获取到 
		*/
		getImpulse(): PhysicsImpulse;		
		colliderA: Collider;		
		colliderB: Collider;		
		/** !#en
		If set disabled to true, the contact will be ignored until contact end.
		If you just want to disabled contact for current time step or sub-step, please use disabledOnce.
		!#zh
		如果 disabled 被设置为 true，那么直到接触结束此接触都将被忽略。
		如果只是希望在当前时间步或子步中忽略此接触，请使用 disabledOnce 。 */
		disabled: boolean;		
		/** !#en
		Disabled contact for current time step or sub-step.
		!#zh
		在当前时间步或子步中忽略此接触。 */
		disabledOnce: boolean;		
		/**
		!#en
		Is this contact touching?
		!#zh
		返回碰撞体是否已经接触到。 
		*/
		isTouching(): boolean;		
		/**
		!#en
		Set the desired tangent speed for a conveyor belt behavior.
		!#zh
		为传送带设置期望的切线速度
		@param tangentSpeed tangentSpeed 
		*/
		setTangentSpeed(tangentSpeed: number): void;		
		/**
		!#en
		Get the desired tangent speed.
		!#zh
		获取切线速度 
		*/
		getTangentSpeed(): number;		
		/**
		!#en
		Override the default friction mixture. You can call this in onPreSolve callback.
		!#zh
		覆盖默认的摩擦力系数。你可以在 onPreSolve 回调中调用此函数。
		@param friction friction 
		*/
		setFriction(friction: number): void;		
		/**
		!#en
		Get the friction.
		!#zh
		获取当前摩擦力系数 
		*/
		getFriction(): number;		
		/**
		!#en
		Reset the friction mixture to the default value.
		!#zh
		重置摩擦力系数到默认值 
		*/
		resetFriction(): void;		
		/**
		!#en
		Override the default restitution mixture. You can call this in onPreSolve callback.
		!#zh
		覆盖默认的恢复系数。你可以在 onPreSolve 回调中调用此函数。
		@param restitution restitution 
		*/
		setRestitution(restitution: number): void;		
		/**
		!#en
		Get the restitution.
		!#zh
		获取当前恢复系数 
		*/
		getRestitution(): number;		
		/**
		!#en
		Reset the restitution mixture to the default value.
		!#zh
		重置恢复系数到默认值 
		*/
		resetRestitution(): void;	
	}	
	/** !#en
	Physics manager uses box2d as the inner physics system, and hide most box2d implement details(creating rigidbody, synchronize rigidbody info to node).
	You can visit some common box2d function through physics manager(hit testing, raycast, debug info).
	Physics manager distributes the collision information to each collision callback when collision is produced.
	Note: You need first enable the collision listener in the rigidbody.
	!#zh
	物理系统将 box2d 作为内部物理系统，并且隐藏了大部分 box2d 实现细节（比如创建刚体，同步刚体信息到节点中等）。
	你可以通过物理系统访问一些 box2d 常用的功能，比如点击测试，射线测试，设置测试信息等。
	物理系统还管理碰撞信息的分发，她会在产生碰撞时，将碰撞信息分发到各个碰撞回调中。
	注意：你需要先在刚体中开启碰撞接听才会产生相应的碰撞回调。<br>
	支持的物理系统指定绘制信息事件，请参阅 {{#crossLink "PhysicsManager.DrawBits"}}{{/crossLink}} */
	export class PhysicsManager implements EventTarget {		
		/** !#en
		The ratio transform between physics unit and pixel unit, generally is 32.
		!#zh
		物理单位与像素单位互相转换的比率，一般是 32。 */
		static PTM_RATIO: number;		
		/** !#en
		The velocity iterations for the velocity constraint solver.
		!#zh
		速度更新迭代数 */
		static VELOCITY_ITERATIONS: number;		
		/** !#en
		The position Iterations for the position constraint solver.
		!#zh
		位置迭代更新数 */
		static POSITION_ITERATIONS: number;		
		/** !#en
		Specify the fixed time step.
		Need enabledAccumulator to make it work.
		!#zh
		指定固定的物理更新间隔时间，需要开启 enabledAccumulator 才有效。 */
		static FIXED_TIME_STEP: number;		
		/** !#en
		Specify the max accumulator time.
		Need enabledAccumulator to make it work.
		!#zh
		每次可用于更新物理系统的最大时间，需要开启 enabledAccumulator 才有效。 */
		static MAX_ACCUMULATOR: number;		
		/** !#en
		If enabled accumulator, then will call step function with the fixed time step FIXED_TIME_STEP.
		And if the update dt is bigger than the time step, then will call step function several times.
		If disabled accumulator, then will call step function with a time step calculated with the frame rate.
		!#zh
		如果开启此选项，那么将会以固定的间隔时间 FIXED_TIME_STEP 来更新物理引擎，如果一个 update 的间隔时间大于 FIXED_TIME_STEP，则会对物理引擎进行多次更新。
		如果关闭此选项，那么将会根据设定的 frame rate 计算出一个间隔时间来更新物理引擎。 */
		enabledAccumulator: boolean;		
		/**
		!#en
		Test which collider contains the given world point
		!#zh
		获取包含给定世界坐标系点的碰撞体
		@param point the world point 
		*/
		testPoint(point: Vec2): PhysicsCollider;		
		/**
		!#en
		Test which colliders intersect the given world rect
		!#zh
		获取与给定世界坐标系矩形相交的碰撞体
		@param rect the world rect 
		*/
		testAABB(rect: Rect): PhysicsCollider[];		
		/**
		!#en
		Raycast the world for all colliders in the path of the ray.
		The raycast ignores colliders that contain the starting point.
		!#zh
		检测哪些碰撞体在给定射线的路径上，射线检测将忽略包含起始点的碰撞体。
		@param p1 start point of the raycast
		@param p2 end point of the raycast
		@param type optional, default is RayCastType.Closest 
		*/
		rayCast(p1: Vec2, p2: Vec2, type: RayCastType): PhysicsRayCastResult[];		
		/** !#en
		Enabled the physics manager?
		!#zh
		指定是否启用物理系统？ */
		enabled: boolean;		
		/** !#en
		Debug draw flags.
		!#zh
		设置调试绘制标志 */
		debugDrawFlags: number;		
		/** !#en
		The physics world gravity.
		!#zh
		物理世界重力值 */
		gravity: Vec2;		
		/**
		!#en Checks whether the EventTarget object has any callback registered for a specific type of event.
		!#zh 检查事件目标对象是否有为特定类型的事件注册的回调。
		@param type The type of event. 
		*/
		hasEventListener(type: string): boolean;		
		/**
		!#en
		Register an callback of a specific event type on the EventTarget.
		This type of event should be triggered via `emit`.
		!#zh
		注册事件目标的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		
		@example 
		```js
		eventTarget.on('fire', function () {
		    cc.log("fire in the hole");
		}, node);
		``` 
		*/
		on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T;		
		/**
		!#en
		Removes the listeners previously registered with the same type, callback, target and or useCapture,
		if only type is passed as parameter, all listeners registered with that type will be removed.
		!#zh
		删除之前用同类型，回调，目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
		@param type A string representing the event type being removed.
		@param callback The callback to remove.
		@param target The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
		
		@example 
		```js
		// register fire eventListener
		var callback = eventTarget.on('fire', function () {
		    cc.log("fire in the hole");
		}, target);
		// remove fire event listener
		eventTarget.off('fire', callback, target);
		// remove all fire event listeners
		eventTarget.off('fire');
		``` 
		*/
		off(type: string, callback?: Function, target?: any): void;		
		/**
		!#en Removes all callbacks previously registered with the same target (passed as parameter).
		This is not for removing all listeners in the current event target,
		and this is not for removing all listeners the target parameter have registered.
		It's only for removing all listeners (callback and target couple) registered on the current event target by the target parameter.
		!#zh 在当前 EventTarget 上删除指定目标（target 参数）注册的所有事件监听器。
		这个函数无法删除当前 EventTarget 的所有事件监听器，也无法删除 target 参数所注册的所有事件监听器。
		这个函数只能删除 target 参数在当前 EventTarget 上注册的所有事件监听器。
		@param target The target to be searched for all related listeners 
		*/
		targetOff(target: any): void;		
		/**
		!#en
		Register an callback of a specific event type on the EventTarget,
		the callback will remove itself after the first time it is triggered.
		!#zh
		注册事件目标的特定事件类型回调，回调会在第一时间被触发后删除自身。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		
		@example 
		```js
		eventTarget.once('fire', function () {
		    cc.log("this is the callback and will be invoked only once");
		}, node);
		``` 
		*/
		once(type: string, callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void, target?: any): void;		
		/**
		!#en
		Send an event with the event object.
		!#zh
		通过事件对象派发事件
		@param event event 
		*/
		dispatchEvent(event: Event): void;	
	}	
	/** undefined */
	export class PhysicsRayCastResult {		
		/** !#en
		The PhysicsCollider which intersects with the raycast
		!#zh
		与射线相交的碰撞体 */
		collider: PhysicsCollider;		
		/** !#en
		The intersection point
		!#zh
		射线与碰撞体相交的点 */
		point: Vec2;		
		/** !#en
		The normal vector at the point of intersection
		!#zh
		射线与碰撞体相交的点的法向量 */
		normal: Vec2;		
		/** !#en
		The fraction of the raycast path at the point of intersection
		!#zh
		射线与碰撞体相交的点占射线长度的分数 */
		fraction: number;	
	}	
	/** !#en Enum for RigidBodyType.
	!#zh 刚体类型 */
	export enum RigidBodyType {		
		Static = 0,
		Kinematic = 0,
		Dynamic = 0,
		Animated = 0,	
	}	
	/** !#en Enum for RayCastType.
	!#zh 射线检测类型 */
	export enum RayCastType {		
		Closest = 0,
		Any = 0,
		AllClosest = 0,
		All = 0,	
	}	
	/** undefined */
	export class RigidBody extends Component {		
		/** !#en
		Should enabled contact listener?
		When a collision is trigger, the collision callback will only be called when enabled contact listener.
		!#zh
		是否启用接触接听器。
		当 collider 产生碰撞时，只有开启了接触接听器才会调用相应的回调函数 */
		enabledContactListener: boolean;		
		/**
		!#en
		Collision callback.
		Called when two collider begin to touch.
		!#zh
		碰撞回调。
		如果你的脚本中实现了这个函数，那么它将会在两个碰撞体开始接触时被调用。
		@param contact contact information
		@param selfCollider the collider belong to this rigidbody
		@param otherCollider the collider belong to another rigidbody 
		*/
		onBeginContact(contact: PhysicsContact, selfCollider: PhysicsCollider, otherCollider: PhysicsCollider): void;		
		/**
		!#en
		Collision callback.
		Called when two collider cease to touch.
		!#zh
		碰撞回调。
		如果你的脚本中实现了这个函数，那么它将会在两个碰撞体停止接触时被调用。
		@param contact contact information
		@param selfCollider the collider belong to this rigidbody
		@param otherCollider the collider belong to another rigidbody 
		*/
		onEndContact(contact: PhysicsContact, selfCollider: PhysicsCollider, otherCollider: PhysicsCollider): void;		
		/**
		!#en
		Collision callback.
		This is called when a contact is updated.
		This allows you to inspect a contact before it goes to the solver(e.g. disable contact).
		Note: this is called only for awake bodies.
		Note: this is called even when the number of contact points is zero.
		Note: this is not called for sensors.
		!#zh
		碰撞回调。
		如果你的脚本中实现了这个函数，那么它将会在接触更新时被调用。
		你可以在接触被处理前根据他包含的信息作出相应的处理，比如将这个接触禁用掉。
		注意：回调只会为醒着的刚体调用。
		注意：接触点为零的时候也有可能被调用。
		注意：感知体(sensor)的回调不会被调用。
		@param contact contact information
		@param selfCollider the collider belong to this rigidbody
		@param otherCollider the collider belong to another rigidbody 
		*/
		onPreSolve(contact: PhysicsContact, selfCollider: PhysicsCollider, otherCollider: PhysicsCollider): void;		
		/**
		!#en
		Collision callback.
		This is called after a contact is updated.
		You can get the impulses from the contact in this callback.
		!#zh
		碰撞回调。
		如果你的脚本中实现了这个函数，那么它将会在接触更新完后被调用。
		你可以在这个回调中从接触信息中获取到冲量信息。
		@param contact contact information
		@param selfCollider the collider belong to this rigidbody
		@param otherCollider the collider belong to another rigidbody 
		*/
		onPostSolve(contact: PhysicsContact, selfCollider: PhysicsCollider, otherCollider: PhysicsCollider): void;		
		/** !#en
		Is this a fast moving body that should be prevented from tunneling through
		other moving bodies?
		Note :
		- All bodies are prevented from tunneling through kinematic and static bodies. This setting is only considered on dynamic bodies.
		- You should use this flag sparingly since it increases processing time.
		!#zh
		这个刚体是否是一个快速移动的刚体，并且需要禁止穿过其他快速移动的刚体？
		需要注意的是 :
		 - 所有刚体都被禁止从 运动刚体 和 静态刚体 中穿过。此选项只关注于 动态刚体。
		 - 应该尽量少的使用此选项，因为它会增加程序处理时间。 */
		bullet: boolean;		
		/** !#en
		Rigidbody type : Static, Kinematic, Dynamic or Animated.
		!#zh
		刚体类型： Static, Kinematic, Dynamic or Animated. */
		type: RigidBodyType;		
		/** !#en
		Set this flag to false if this body should never fall asleep.
		Note that this increases CPU usage.
		!#zh
		如果此刚体永远都不应该进入睡眠，那么设置这个属性为 false。
		需要注意这将使 CPU 占用率提高。 */
		allowSleep: boolean;		
		/** !#en
		Scale the gravity applied to this body.
		!#zh
		缩放应用在此刚体上的重力值 */
		gravityScale: number;		
		/** !#en
		Linear damping is use to reduce the linear velocity.
		The damping parameter can be larger than 1, but the damping effect becomes sensitive to the
		time step when the damping parameter is large.
		!#zh
		Linear damping 用于衰减刚体的线性速度。衰减系数可以大于 1，但是当衰减系数比较大的时候，衰减的效果会变得比较敏感。 */
		linearDamping: number;		
		/** !#en
		Angular damping is use to reduce the angular velocity. The damping parameter
		can be larger than 1 but the damping effect becomes sensitive to the
		time step when the damping parameter is large.
		!#zh
		Angular damping 用于衰减刚体的角速度。衰减系数可以大于 1，但是当衰减系数比较大的时候，衰减的效果会变得比较敏感。 */
		angularDamping: number;		
		/** !#en
		The linear velocity of the body's origin in world co-ordinates.
		!#zh
		刚体在世界坐标下的线性速度 */
		linearVelocity: Vec2;		
		/** !#en
		The angular velocity of the body.
		!#zh
		刚体的角速度 */
		angularVelocity: number;		
		/** !#en
		Should this body be prevented from rotating?
		!#zh
		是否禁止此刚体进行旋转 */
		fixedRotation: boolean;		
		/** !#en
		Set the sleep state of the body. A sleeping body has very low CPU cost.(When the rigid body is hit, if the rigid body is in sleep state, it will be immediately awakened.)
		!#zh
		设置刚体的睡眠状态。 睡眠的刚体具有非常低的 CPU 成本。（当刚体被碰撞到时，如果刚体处于睡眠状态，它会立即被唤醒） */
		awake: boolean;		
		/** !#en
		Whether to wake up this rigid body during initialization
		!#zh
		是否在初始化时唤醒此刚体 */
		awakeOnLoad: boolean;		
		/** !#en
		Set the active state of the body. An inactive body is not
		simulated and cannot be collided with or woken up.
		If body is active, all fixtures will be added to the
		broad-phase.
		If body is inactive, all fixtures will be removed from
		the broad-phase and all contacts will be destroyed.
		Fixtures on an inactive body are implicitly inactive and will
		not participate in collisions, ray-casts, or queries.
		Joints connected to an inactive body are implicitly inactive.
		!#zh
		设置刚体的激活状态。一个非激活状态下的刚体是不会被模拟和碰撞的，不管它是否处于睡眠状态下。
		如果刚体处于激活状态下，所有夹具会被添加到 粗测阶段（broad-phase）。
		如果刚体处于非激活状态下，所有夹具会被从 粗测阶段（broad-phase）中移除。
		在非激活状态下的夹具不会参与到碰撞，射线，或者查找中
		链接到非激活状态下刚体的关节也是非激活的。 */
		active: boolean;		
		/**
		!#en
		Gets a local point relative to the body's origin given a world point.
		!#zh
		将一个给定的世界坐标系下的点转换为刚体本地坐标系下的点
		@param worldPoint a point in world coordinates.
		@param out optional, the receiving point 
		*/
		getLocalPoint(worldPoint: Vec2, out: Vec2): Vec2;		
		/**
		!#en
		Get the world coordinates of a point given the local coordinates.
		!#zh
		将一个给定的刚体本地坐标系下的点转换为世界坐标系下的点
		@param localPoint a point in local coordinates.
		@param out optional, the receiving point 
		*/
		getWorldPoint(localPoint: Vec2, out: Vec2): Vec2;		
		/**
		!#en
		Get the world coordinates of a vector given the local coordinates.
		!#zh
		将一个给定的世界坐标系下的向量转换为刚体本地坐标系下的向量
		@param localVector a vector in world coordinates.
		@param out optional, the receiving vector 
		*/
		getWorldVector(localVector: Vec2, out: Vec2): Vec2;		
		/**
		!#en
		Gets a local vector relative to the body's origin given a world vector.
		!#zh
		将一个给定的世界坐标系下的点转换为刚体本地坐标系下的点
		@param worldVector a vector in world coordinates.
		@param out optional, the receiving vector 
		*/
		getLocalVector(worldVector: Vec2, out: Vec2): Vec2;		
		/**
		!#en
		Get the world body origin position.
		!#zh
		获取刚体世界坐标系下的原点值
		@param out optional, the receiving point 
		*/
		getWorldPosition(out: Vec2): Vec2;		
		/**
		!#en
		Get the world body rotation angle.
		!#zh
		获取刚体世界坐标系下的旋转值。 
		*/
		getWorldRotation(): number;		
		/**
		!#en
		Get the local position of the center of mass.
		!#zh
		获取刚体本地坐标系下的质心 
		*/
		getLocalCenter(): Vec2;		
		/**
		!#en
		Get the world position of the center of mass.
		!#zh
		获取刚体世界坐标系下的质心 
		*/
		getWorldCenter(): Vec2;		
		/**
		!#en
		Get the world linear velocity of a world point attached to this body.
		!#zh
		获取刚体上指定点的线性速度
		@param worldPoint a point in world coordinates.
		@param out optional, the receiving point 
		*/
		getLinearVelocityFromWorldPoint(worldPoint: Vec2, out: Vec2): Vec2;		
		/**
		!#en
		Get total mass of the body.
		!#zh
		获取刚体的质量。 
		*/
		getMass(): number;		
		/**
		!#en
		Get the rotational inertia of the body about the local origin.
		!#zh
		获取刚体本地坐标系下原点的旋转惯性 
		*/
		getInertia(): number;		
		/**
		!#en
		Get all the joints connect to the rigidbody.
		!#zh
		获取链接到此刚体的所有关节 
		*/
		getJointList(): Joint[];		
		/**
		!#en
		Apply a force at a world point. If the force is not
		applied at the center of mass, it will generate a torque and
		affect the angular velocity.
		!#zh
		施加一个力到刚体上的一个点。如果力没有施加到刚体的质心上，还会产生一个扭矩并且影响到角速度。
		@param force the world force vector.
		@param point the world position.
		@param wake also wake up the body. 
		*/
		applyForce(force: Vec2, point: Vec2, wake: boolean): void;		
		/**
		!#en
		Apply a force to the center of mass.
		!#zh
		施加一个力到刚体上的质心上。
		@param force the world force vector.
		@param wake also wake up the body. 
		*/
		applyForceToCenter(force: Vec2, wake: boolean): void;		
		/**
		!#en
		Apply a torque. This affects the angular velocity.
		!#zh
		施加一个扭矩力，将影响刚体的角速度
		@param torque about the z-axis (out of the screen), usually in N-m.
		@param wake also wake up the body 
		*/
		applyTorque(torque: number, wake: boolean): void;		
		/**
		!#en
		Apply a impulse at a world point, This immediately modifies the velocity.
		If the impulse is not applied at the center of mass, it will generate a torque and
		affect the angular velocity.
		!#zh
		施加冲量到刚体上的一个点，将立即改变刚体的线性速度。
		如果冲量施加到的点不是刚体的质心，那么将产生一个扭矩并影响刚体的角速度。
		@param impulse the world impulse vector, usually in N-seconds or kg-m/s.
		@param point the world position
		@param wake alse wake up the body 
		*/
		applyLinearImpulse(impulse: Vec2, point: Vec2, wake: boolean): void;		
		/**
		!#en
		Apply an angular impulse.
		!#zh
		施加一个角速度冲量。
		@param impulse the angular impulse in units of kg*m*m/s
		@param wake also wake up the body 
		*/
		applyAngularImpulse(impulse: number, wake: boolean): void;		
		/**
		!#en
		Synchronize node's world position to box2d rigidbody's position.
		If enableAnimated is true and rigidbody's type is Animated type,
		will set linear velocity instead of directly set rigidbody's position.
		!#zh
		同步节点的世界坐标到 box2d 刚体的坐标上。
		如果 enableAnimated 是 true，并且刚体的类型是 Animated ，那么将设置刚体的线性速度来代替直接设置刚体的位置。
		@param enableAnimated enableAnimated 
		*/
		syncPosition(enableAnimated: boolean): void;		
		/**
		!#en
		Synchronize node's world angle to box2d rigidbody's angle.
		If enableAnimated is true and rigidbody's type is Animated type,
		will set angular velocity instead of directly set rigidbody's angle.
		!#zh
		同步节点的世界旋转角度值到 box2d 刚体的旋转值上。
		如果 enableAnimated 是 true，并且刚体的类型是 Animated ，那么将设置刚体的角速度来代替直接设置刚体的角度。
		@param enableAnimated enableAnimated 
		*/
		syncRotation(enableAnimated: boolean): void;	
	}	
	/** Loader for resource loading process. It's a singleton object. */
	export class loader extends Pipeline {		
		/** The asset loader in cc.loader's pipeline, it's by default the first pipe.
		It's used to identify an asset's type, and determine how to download it. */
		static assetLoader: any;		
		/** The md5 pipe in cc.loader's pipeline, it could be absent if the project isn't build with md5 option.
		It's used to modify the url to the real downloadable url with md5 suffix. */
		static md5Pipe: any;		
		/** The downloader in cc.loader's pipeline, it's by default the second pipe.
		It's used to download files with several handlers: pure text, image, script, audio, font, uuid.
		You can add your own download function with addDownloadHandlers */
		static downloader: any;		
		/** The loader in cc.loader's pipeline, it's by default the third pipe.
		It's used to parse downloaded content with several handlers: JSON, image, plist, fnt, uuid.
		You can add your own download function with addLoadHandlers */
		static loader: any;		
		/**
		Gets a new XMLHttpRequest instance. 
		*/
		static getXMLHttpRequest(): XMLHttpRequest;		
		/**
		Add custom supported types handler or modify existing type handler for download process.
		@param extMap Custom supported types with corresponded handler
		
		@example 
		```js
		cc.loader.addDownloadHandlers({
		     // This will match all url with `.scene` extension or all url with `scene` type
		     'scene' : function (url, callback) {}
		 });
		``` 
		*/
		static addDownloadHandlers(extMap: any): void;		
		/**
		Add custom supported types handler or modify existing type handler for load process.
		@param extMap Custom supported types with corresponded handler
		
		@example 
		```js
		cc.loader.addLoadHandlers({
		     // This will match all url with `.scene` extension or all url with `scene` type
		     'scene' : function (url, callback) {}
		 });
		``` 
		*/
		static addLoadHandlers(extMap: any): void;		
		/**
		Load resources with a progression callback and a complete callback.
		The progression callback is the same as Pipeline's {{#crossLink "LoadingItems/onProgress:method"}}onProgress{{/crossLink}}
		The complete callback is almost the same as Pipeline's {{#crossLink "LoadingItems/onComplete:method"}}onComplete{{/crossLink}}
		The only difference is when user pass a single url as resources, the complete callback will set its result directly as the second parameter.
		@param resources Url list in an array
		@param progressCallback Callback invoked when progression change
		@param completeCallback Callback invoked when all resources loaded
		
		@example 
		```js
		cc.loader.load('a.png', function (err, tex) {
		    cc.log('Result should be a texture: ' + (tex instanceof cc.Texture2D));
		});
		
		cc.loader.load('http://example.com/a.png', function (err, tex) {
		    cc.log('Should load a texture from external url: ' + (tex instanceof cc.Texture2D));
		});
		
		cc.loader.load({url: 'http://example.com/getImageREST?file=a.png', type: 'png'}, function (err, tex) {
		    cc.log('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
		});
		
		cc.loader.load(['a.png', 'b.json'], function (errors, results) {
		    if (errors) {
		        for (var i = 0; i < errors.length; i++) {
		            cc.log('Error url [' + errors[i] + ']: ' + results.getError(errors[i]));
		        }
		    }
		    var aTex = results.getContent('a.png');
		    var bJsonObj = results.getContent('b.json');
		});
		``` 
		*/
		static load(resources: string|string[]|{uuid?: string, url?: string, type?: string}, completeCallback?: Function): void;
		static load(resources: string|string[]|{uuid?: string, url?: string, type?: string}, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: Function|null): void;		
		/**
		Load resources from the "resources" folder inside the "assets" folder of your project.<br>
		<br>
		Note: All asset URLs in Creator use forward slashes, URLs using backslashes will not work.
		@param url Url of the target resource.
		                      The url is relative to the "resources" folder, extensions must be omitted.
		@param type Only asset of type will be loaded if this argument is supplied.
		@param progressCallback Callback invoked when progression change.
		@param completeCallback Callback invoked when the resource loaded.
		
		@example 
		```js
		// load the prefab (project/assets/resources/misc/character/cocos) from resources folder
		cc.loader.loadRes('misc/character/cocos', function (err, prefab) {
		    if (err) {
		        cc.error(err.message || err);
		        return;
		    }
		    cc.log('Result should be a prefab: ' + (prefab instanceof cc.Prefab));
		});
		
		// load the sprite frame of (project/assets/resources/imgs/cocos.png) from resources folder
		cc.loader.loadRes('imgs/cocos', cc.SpriteFrame, function (err, spriteFrame) {
		    if (err) {
		        cc.error(err.message || err);
		        return;
		    }
		    cc.log('Result should be a sprite frame: ' + (spriteFrame instanceof cc.SpriteFrame));
		});
		``` 
		*/
		static loadRes(url: string, type: typeof cc.Asset, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any) => void)|null): void;
		static loadRes(url: string, type: typeof cc.Asset, completeCallback: (error: Error, resource: any) => void): void;
		static loadRes(url: string, type: typeof cc.Asset): void;
		static loadRes(url: string, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any) => void)|null): void;
		static loadRes(url: string, completeCallback: (error: Error, resource: any) => void): void;
		static loadRes(url: string): void;		
		/**
		This method is like {{#crossLink "loader/loadRes:method"}}{{/crossLink}} except that it accepts array of url.
		@param urls Array of URLs of the target resource.
		                         The url is relative to the "resources" folder, extensions must be omitted.
		@param type Only asset of type will be loaded if this argument is supplied.
		@param progressCallback Callback invoked when progression change.
		@param completeCallback A callback which is called when all assets have been loaded, or an error occurs.
		
		@example 
		```js
		// load the SpriteFrames from resources folder
		var spriteFrames;
		var urls = ['misc/characters/character_01', 'misc/weapons/weapons_01'];
		cc.loader.loadResArray(urls, cc.SpriteFrame, function (err, assets) {
		    if (err) {
		        cc.error(err);
		        return;
		    }
		    spriteFrames = assets;
		    // ...
		});
		``` 
		*/
		static loadResArray(url: string[], type: typeof cc.Asset, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[]) => void)|null): void;
		static loadResArray(url: string[], type: typeof cc.Asset, completeCallback: (error: Error, resource: any[]) => void): void;
		static loadResArray(url: string[], type: typeof cc.Asset): void;
		static loadResArray(url: string[], progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[]) => void)|null): void;
		static loadResArray(url: string[], completeCallback: (error: Error, resource: any[]) => void): void;
		static loadResArray(url: string[]): void;
		static loadResArray(url: string[], type: typeof cc.Asset[]): void;		
		/**
		Load all assets in a folder inside the "assets/resources" folder of your project.<br>
		<br>
		Note: All asset URLs in Creator use forward slashes, URLs using backslashes will not work.
		@param url Url of the target folder.
		                      The url is relative to the "resources" folder, extensions must be omitted.
		@param type Only asset of type will be loaded if this argument is supplied.
		@param progressCallback Callback invoked when progression change.
		@param completeCallback A callback which is called when all assets have been loaded, or an error occurs.
		
		@example 
		```js
		// load the texture (resources/imgs/cocos.png) and the corresponding sprite frame
		cc.loader.loadResDir('imgs/cocos', function (err, assets) {
		    if (err) {
		        cc.error(err);
		        return;
		    }
		    var texture = assets[0];
		    var spriteFrame = assets[1];
		});
		
		// load all textures in "resources/imgs/"
		cc.loader.loadResDir('imgs', cc.Texture2D, function (err, textures) {
		    var texture1 = textures[0];
		    var texture2 = textures[1];
		});
		
		// load all JSONs in "resources/data/"
		cc.loader.loadResDir('data', function (err, objects, urls) {
		    var data = objects[0];
		    var url = urls[0];
		});
		``` 
		*/
		static loadResDir(url: string, type: typeof cc.Asset, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[], urls: string[]) => void)|null): void;
		static loadResDir(url: string, type: typeof cc.Asset, completeCallback: (error: Error, resource: any[], urls: string[]) => void): void;
		static loadResDir(url: string, type: typeof cc.Asset): void;
		static loadResDir(url: string, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[], urls: string[]) => void)|null): void;
		static loadResDir(url: string, completeCallback: (error: Error, resource: any[], urls: string[]) => void): void;
		static loadResDir(url: string): void;		
		/**
		Get resource data by id. <br>
		When you load resources with {{#crossLink "loader/load:method"}}{{/crossLink}} or {{#crossLink "loader/loadRes:method"}}{{/crossLink}},
		the url will be the unique identity of the resource.
		After loaded, you can acquire them by passing the url to this API.
		@param url url
		@param type Only asset of type will be returned if this argument is supplied. 
		*/
		static getRes(url: string, type?: Function): any;		
		/**
		!#en
		Get all resource dependencies of the loaded asset in an array, including itself.
		The owner parameter accept the following types: 1. The asset itself; 2. The resource url; 3. The asset's uuid.<br>
		The returned array stores the dependencies with their uuids, after retrieve dependencies,
		you can release them, access dependent assets by passing the uuid to {{#crossLink "loader/getRes:method"}}{{/crossLink}}, or other stuffs you want.<br>
		For release all dependencies of an asset, please refer to {{#crossLink "loader/release:method"}}{{/crossLink}}
		Here is some examples:
		!#zh
		获取某个已经加载好的资源的所有依赖资源，包含它自身，并保存在数组中返回。owner 参数接收以下几种类型：1. 资源 asset 对象；2. 资源目录下的 url；3. 资源的 uuid。<br>
		返回的数组将仅保存依赖资源的 uuid，获取这些 uuid 后，你可以从 loader 释放这些资源；通过 {{#crossLink "loader/getRes:method"}}{{/crossLink}} 获取某个资源或者进行其他你需要的操作。<br>
		想要释放一个资源及其依赖资源，可以参考 {{#crossLink "loader/release:method"}}{{/crossLink}}。下面是一些示例代码：
		@param owner The owner asset or the resource url or the asset's uuid
		
		@example 
		```js
		// Release all dependencies of a loaded prefab
		var deps = cc.loader.getDependsRecursively(prefab);
		cc.loader.release(deps);
		// Retrieve all dependent textures
		var deps = cc.loader.getDependsRecursively('prefabs/sample');
		var textures = [];
		for (var i = 0; i < deps.length; ++i) {
		    var item = cc.loader.getRes(deps[i]);
		    if (item instanceof cc.Texture2D) {
		        textures.push(item);
		    }
		}
		``` 
		*/
		static getDependsRecursively(owner: Asset|RawAsset|string): any[];		
		/**
		!#en
		Release the content of an asset or an array of assets by uuid.
		Start from v1.3, this method will not only remove the cache of the asset in loader, but also clean up its content.
		For example, if you release a texture, the texture asset and its gl texture data will be freed up.
		In complexe project, you can use this function with {{#crossLink "loader/getDependsRecursively:method"}}{{/crossLink}} to free up memory in critical circumstances.
		Notice, this method may cause the texture to be unusable, if there are still other nodes use the same texture, they may turn to black and report gl errors.
		If you only want to remove the cache of an asset, please use {{#crossLink "pipeline/removeItem:method"}}{{/crossLink}}
		!#zh
		通过 id（通常是资源 url）来释放一个资源或者一个资源数组。
		从 v1.3 开始，这个方法不仅会从 loader 中删除资源的缓存引用，还会清理它的资源内容。
		比如说，当你释放一个 texture 资源，这个 texture 和它的 gl 贴图数据都会被释放。
		在复杂项目中，我们建议你结合 {{#crossLink "loader/getDependsRecursively:method"}}{{/crossLink}} 来使用，便于在设备内存告急的情况下更快地释放不再需要的资源的内存。
		注意，这个函数可能会导致资源贴图或资源所依赖的贴图不可用，如果场景中存在节点仍然依赖同样的贴图，它们可能会变黑并报 GL 错误。
		如果你只想删除一个资源的缓存引用，请使用 {{#crossLink "pipeline/removeItem:method"}}{{/crossLink}}
		@param asset asset
		
		@example 
		```js
		// Release a texture which is no longer need
		cc.loader.release(texture);
		// Release all dependencies of a loaded prefab
		var deps = cc.loader.getDependsRecursively('prefabs/sample');
		cc.loader.release(deps);
		// If there is no instance of this prefab in the scene, the prefab and its dependencies like textures, sprite frames, etc, will be freed up.
		// If you have some other nodes share a texture in this prefab, you can skip it in two ways:
		// 1. Forbid auto release a texture before release
		cc.loader.setAutoRelease(texture2d, false);
		// 2. Remove it from the dependencies array
		var deps = cc.loader.getDependsRecursively('prefabs/sample');
		var index = deps.indexOf(texture2d._uuid);
		if (index !== -1)
		    deps.splice(index, 1);
		cc.loader.release(deps);
		``` 
		*/
		static release(asset: Asset|RawAsset|string|any[]): void;		
		/**
		!#en Release the asset by its object. Refer to {{#crossLink "loader/release:method"}}{{/crossLink}} for detailed informations.
		!#zh 通过资源对象自身来释放资源。详细信息请参考 {{#crossLink "loader/release:method"}}{{/crossLink}}
		@param asset asset 
		*/
		static releaseAsset(asset: Asset): void;		
		/**
		!#en Release the asset loaded by {{#crossLink "loader/loadRes:method"}}{{/crossLink}}. Refer to {{#crossLink "loader/release:method"}}{{/crossLink}} for detailed informations.
		!#zh 释放通过 {{#crossLink "loader/loadRes:method"}}{{/crossLink}} 加载的资源。详细信息请参考 {{#crossLink "loader/release:method"}}{{/crossLink}}
		@param url url
		@param type Only asset of type will be released if this argument is supplied. 
		*/
		static releaseRes(url: string, type?: Function): void;		
		/**
		!#en Release the all assets loaded by {{#crossLink "loader/loadResDir:method"}}{{/crossLink}}. Refer to {{#crossLink "loader/release:method"}}{{/crossLink}} for detailed informations.
		!#zh 释放通过 {{#crossLink "loader/loadResDir:method"}}{{/crossLink}} 加载的资源。详细信息请参考 {{#crossLink "loader/release:method"}}{{/crossLink}}
		@param url url
		@param type Only asset of type will be released if this argument is supplied. 
		*/
		static releaseResDir(url: string, type?: Function): void;		
		/**
		!#en Resource all assets. Refer to {{#crossLink "loader/release:method"}}{{/crossLink}} for detailed informations.
		!#zh 释放所有资源。详细信息请参考 {{#crossLink "loader/release:method"}}{{/crossLink}} 
		*/
		static releaseAll(): void;		
		/**
		!#en
		Indicates whether to release the asset when loading a new scene.<br>
		By default, when loading a new scene, all assets in the previous scene will be released or preserved
		according to whether the previous scene checked the "Auto Release Assets" option.
		On the other hand, assets dynamically loaded by using `cc.loader.loadRes` or `cc.loader.loadResDir`
		will not be affected by that option, remain not released by default.<br>
		Use this API to change the default behavior on a single asset, to force preserve or release specified asset when scene switching.<br>
		<br>
		See: {{#crossLink "loader/setAutoReleaseRecursively:method"}}cc.loader.setAutoReleaseRecursively{{/crossLink}}, {{#crossLink "loader/isAutoRelease:method"}}cc.loader.isAutoRelease{{/crossLink}}
		!#zh
		设置当场景切换时是否自动释放资源。<br>
		默认情况下，当加载新场景时，旧场景的资源根据旧场景是否勾选“Auto Release Assets”，将会被释放或者保留。
		而使用 `cc.loader.loadRes` 或 `cc.loader.loadResDir` 动态加载的资源，则不受场景设置的影响，默认不自动释放。<br>
		使用这个 API 可以在单个资源上改变这个默认行为，强制在切换场景时保留或者释放指定资源。<br>
		<br>
		参考：{{#crossLink "loader/setAutoReleaseRecursively:method"}}cc.loader.setAutoReleaseRecursively{{/crossLink}}，{{#crossLink "loader/isAutoRelease:method"}}cc.loader.isAutoRelease{{/crossLink}}
		@param assetOrUrlOrUuid asset object or the raw asset's url or uuid
		@param autoRelease indicates whether should release automatically
		
		@example 
		```js
		// auto release the texture event if "Auto Release Assets" disabled in current scene
		cc.loader.setAutoRelease(texture2d, true);
		// don't release the texture even if "Auto Release Assets" enabled in current scene
		cc.loader.setAutoRelease(texture2d, false);
		// first parameter can be url
		cc.loader.setAutoRelease(audioUrl, false);
		``` 
		*/
		static setAutoRelease(assetOrUrlOrUuid: Asset|string, autoRelease: boolean): void;		
		/**
		!#en
		Indicates whether to release the asset and its referenced other assets when loading a new scene.<br>
		By default, when loading a new scene, all assets in the previous scene will be released or preserved
		according to whether the previous scene checked the "Auto Release Assets" option.
		On the other hand, assets dynamically loaded by using `cc.loader.loadRes` or `cc.loader.loadResDir`
		will not be affected by that option, remain not released by default.<br>
		Use this API to change the default behavior on the specified asset and its recursively referenced assets, to force preserve or release specified asset when scene switching.<br>
		<br>
		See: {{#crossLink "loader/setAutoRelease:method"}}cc.loader.setAutoRelease{{/crossLink}}, {{#crossLink "loader/isAutoRelease:method"}}cc.loader.isAutoRelease{{/crossLink}}
		!#zh
		设置当场景切换时是否自动释放资源及资源引用的其它资源。<br>
		默认情况下，当加载新场景时，旧场景的资源根据旧场景是否勾选“Auto Release Assets”，将会被释放或者保留。
		而使用 `cc.loader.loadRes` 或 `cc.loader.loadResDir` 动态加载的资源，则不受场景设置的影响，默认不自动释放。<br>
		使用这个 API 可以在指定资源及资源递归引用到的所有资源上改变这个默认行为，强制在切换场景时保留或者释放指定资源。<br>
		<br>
		参考：{{#crossLink "loader/setAutoRelease:method"}}cc.loader.setAutoRelease{{/crossLink}}，{{#crossLink "loader/isAutoRelease:method"}}cc.loader.isAutoRelease{{/crossLink}}
		@param assetOrUrlOrUuid asset object or the raw asset's url or uuid
		@param autoRelease indicates whether should release automatically
		
		@example 
		```js
		// auto release the SpriteFrame and its Texture event if "Auto Release Assets" disabled in current scene
		cc.loader.setAutoReleaseRecursively(spriteFrame, true);
		// don't release the SpriteFrame and its Texture even if "Auto Release Assets" enabled in current scene
		cc.loader.setAutoReleaseRecursively(spriteFrame, false);
		// don't release the Prefab and all the referenced assets
		cc.loader.setAutoReleaseRecursively(prefab, false);
		``` 
		*/
		static setAutoReleaseRecursively(assetOrUrlOrUuid: Asset|string, autoRelease: boolean): void;		
		/**
		!#en
		Returns whether the asset is configured as auto released, despite how "Auto Release Assets" property is set on scene asset.<br>
		<br>
		See: {{#crossLink "loader/setAutoRelease:method"}}cc.loader.setAutoRelease{{/crossLink}}, {{#crossLink "loader/setAutoReleaseRecursively:method"}}cc.loader.setAutoReleaseRecursively{{/crossLink}}
		
		!#zh
		返回指定的资源是否有被设置为自动释放，不论场景的“Auto Release Assets”如何设置。<br>
		<br>
		参考：{{#crossLink "loader/setAutoRelease:method"}}cc.loader.setAutoRelease{{/crossLink}}，{{#crossLink "loader/setAutoReleaseRecursively:method"}}cc.loader.setAutoReleaseRecursively{{/crossLink}}
		@param assetOrUrl asset object or the raw asset's url 
		*/
		static isAutoRelease(assetOrUrl: Asset|string): boolean;	
	}	
	/** !#en
	LoadingItems is the queue of items which can flow them into the loading pipeline.<br/>
	Please don't construct it directly, use {{#crossLink "LoadingItems.create"}}cc.LoadingItems.create{{/crossLink}} instead, because we use an internal pool to recycle the queues.<br/>
	It hold a map of items, each entry in the map is a url to object key value pair.<br/>
	Each item always contains the following property:<br/>
	- id: The identification of the item, usually it's identical to url<br/>
	- url: The url <br/>
	- type: The type, it's the extension name of the url by default, could be specified manually too.<br/>
	- error: The error happened in pipeline will be stored in this property.<br/>
	- content: The content processed by the pipeline, the final result will also be stored in this property.<br/>
	- complete: The flag indicate whether the item is completed by the pipeline.<br/>
	- states: An object stores the states of each pipe the item go through, the state can be: Pipeline.ItemState.WORKING | Pipeline.ItemState.ERROR | Pipeline.ItemState.COMPLETE<br/>
	<br/>
	Item can hold other custom properties.<br/>
	Each LoadingItems object will be destroyed for recycle after onComplete callback<br/>
	So please don't hold its reference for later usage, you can copy properties in it though.
	!#zh
	LoadingItems 是一个加载对象队列，可以用来输送加载对象到加载管线中。<br/>
	请不要直接使用 new 构造这个类的对象，你可以使用 {{#crossLink "LoadingItems.create"}}cc.LoadingItems.create{{/crossLink}} 来创建一个新的加载队列，这样可以允许我们的内部对象池回收并重利用加载队列。
	它有一个 map 属性用来存放加载项，在 map 对象中以 url 为 key 值。<br/>
	每个对象都会包含下列属性：<br/>
	- id：该对象的标识，通常与 url 相同。<br/>
	- url：路径 <br/>
	- type: 类型，它这是默认的 URL 的扩展名，可以手动指定赋值。<br/>
	- error：pipeline 中发生的错误将被保存在这个属性中。<br/>
	- content: pipeline 中处理的临时结果，最终的结果也将被存储在这个属性中。<br/>
	- complete：该标志表明该对象是否通过 pipeline 完成。<br/>
	- states：该对象存储每个管道中对象经历的状态，状态可以是 Pipeline.ItemState.WORKING | Pipeline.ItemState.ERROR | Pipeline.ItemState.COMPLETE<br/>
	<br/>
	对象可容纳其他自定义属性。<br/>
	每个 LoadingItems 对象都会在 onComplete 回调之后被销毁，所以请不要持有它的引用并在结束回调之后依赖它的内容执行任何逻辑，有这种需求的话你可以提前复制它的内容。 */
	export class LoadingItems extends CallbacksInvoker {		
		/**
		!#en This is a callback which will be invoked while an item flow out the pipeline.
		You can pass the callback function in LoadingItems.create or set it later.
		!#zh 这个回调函数将在 item 加载结束后被调用。你可以在构造时传递这个回调函数或者是在构造之后直接设置。
		@param completedCount The number of the items that are already completed.
		@param totalCount The total number of the items.
		@param item The latest item which flow out the pipeline.
		
		@example 
		```js
		loadingItems.onProgress = function (completedCount, totalCount, item) {
		     var progress = (100 * completedCount / totalCount).toFixed(2);
		     cc.log(progress + '%');
		 }
		``` 
		*/
		onProgress(completedCount: number, totalCount: number, item: any): void;		
		/**
		!#en This is a callback which will be invoked while all items is completed,
		You can pass the callback function in LoadingItems.create or set it later.
		!#zh 该函数将在加载队列全部完成时被调用。你可以在构造时传递这个回调函数或者是在构造之后直接设置。
		@param errors All errored urls will be stored in this array, if no error happened, then it will be null
		@param items All items.
		
		@example 
		```js
		loadingItems.onComplete = function (errors, items) {
		     if (error)
		         cc.log('Completed with ' + errors.length + ' errors');
		     else
		         cc.log('Completed ' + items.totalCount + ' items');
		 }
		``` 
		*/
		onComplete(errors: any[], items: LoadingItems): void;		
		/** !#en The map of all items.
		!#zh 存储所有加载项的对象。 */
		map: any;		
		/** !#en The map of completed items.
		!#zh 存储已经完成的加载项。 */
		completed: any;		
		/** !#en Total count of all items.
		!#zh 所有加载项的总数。 */
		totalCount: number;		
		/** !#en Total count of completed items.
		!#zh 所有完成加载项的总数。 */
		completedCount: number;		
		/** !#en Activated or not.
		!#zh 是否启用。 */
		active: boolean;		
		/**
		!#en The constructor function of LoadingItems, this will use recycled LoadingItems in the internal pool if possible.
		You can pass onProgress and onComplete callbacks to visualize the loading process.
		!#zh LoadingItems 的构造函数，这种构造方式会重用内部对象缓冲池中的 LoadingItems 队列，以尽量避免对象创建。
		你可以传递 onProgress 和 onComplete 回调函数来获知加载进度信息。
		@param pipeline The pipeline to process the queue.
		@param urlList The items array.
		@param onProgress The progression callback, refer to {{#crossLink "LoadingItems.onProgress"}}{{/crossLink}}
		@param onComplete The completion callback, refer to {{#crossLink "LoadingItems.onComplete"}}{{/crossLink}}
		
		@example 
		```js
		cc.LoadingItems.create(cc.loader, ['a.png', 'b.plist'], function (completedCount, totalCount, item) {
		     var progress = (100 * completedCount / totalCount).toFixed(2);
		     cc.log(progress + '%');
		 }, function (errors, items) {
		     if (errors) {
		         for (var i = 0; i < errors.length; ++i) {
		             cc.log('Error url: ' + errors[i] + ', error: ' + items.getError(errors[i]));
		         }
		     }
		     else {
		         var result_a = items.getContent('a.png');
		         // ...
		     }
		 })
		``` 
		*/
		static create(pipeline: Pipeline, urlList: any[], onProgress: Function, onComplete: Function): LoadingItems;		
		/**
		!#en Retrieve the LoadingItems queue object for an item.
		!#zh 通过 item 对象获取它的 LoadingItems 队列。
		@param item The item to query 
		*/
		static getQueue(item: any): LoadingItems;		
		/**
		!#en Complete an item in the LoadingItems queue, please do not call this method unless you know what's happening.
		!#zh 通知 LoadingItems 队列一个 item 对象已完成，请不要调用这个函数，除非你知道自己在做什么。
		@param item The item which has completed 
		*/
		static itemComplete(item: any): void;		
		/**
		!#en Add urls to the LoadingItems queue.
		!#zh 向一个 LoadingItems 队列添加加载项。
		@param urlList The url list to be appended, the url can be object or string 
		*/
		append(urlList: any[]): any[];		
		/**
		!#en Complete a LoadingItems queue, please do not call this method unless you know what's happening.
		!#zh 完成一个 LoadingItems 队列，请不要调用这个函数，除非你知道自己在做什么。 
		*/
		allComplete(): void;		
		/**
		!#en Check whether all items are completed.
		!#zh 检查是否所有加载项都已经完成。 
		*/
		isCompleted(): boolean;		
		/**
		!#en Check whether an item is completed.
		!#zh 通过 id 检查指定加载项是否已经加载完成。
		@param id The item's id. 
		*/
		isItemCompleted(id: string): boolean;		
		/**
		!#en Check whether an item exists.
		!#zh 通过 id 检查加载项是否存在。
		@param id The item's id. 
		*/
		exists(id: string): boolean;		
		/**
		!#en Returns the content of an internal item.
		!#zh 通过 id 获取指定对象的内容。
		@param id The item's id. 
		*/
		getContent(id: string): any;		
		/**
		!#en Returns the error of an internal item.
		!#zh 通过 id 获取指定对象的错误信息。
		@param id The item's id. 
		*/
		getError(id: string): any;		
		/**
		!#en Add a listener for an item, the callback will be invoked when the item is completed.
		!#zh 监听加载项（通过 key 指定）的完成事件。
		@param key key
		@param callback can be null
		@param target can be null 
		*/
		addListener(key: string, callback: Function, target: any): boolean;		
		/**
		!#en
		Check if the specified key has any registered callback.
		If a callback is also specified, it will only return true if the callback is registered.
		!#zh
		检查指定的加载项是否有完成事件监听器。
		如果同时还指定了一个回调方法，并且回调有注册，它只会返回 true。
		@param key key
		@param callback callback
		@param target target 
		*/
		hasListener(key: string, callback?: Function, target?: any): boolean;		
		/**
		!#en
		Removes a listener.
		It will only remove when key, callback, target all match correctly.
		!#zh
		移除指定加载项已经注册的完成事件监听器。
		只会删除 key, callback, target 均匹配的监听器。
		@param key key
		@param callback callback
		@param target target 
		*/
		remove(key: string, callback: Function, target: any): boolean;		
		/**
		!#en
		Removes all callbacks registered in a certain event
		type or all callbacks registered with a certain target.
		!#zh 删除指定目标的所有完成事件监听器。
		@param key The event key to be removed or the target to be removed 
		*/
		removeAllListeners(key: string|any): void;		
		/**
		!#en Complete an item in the LoadingItems queue, please do not call this method unless you know what's happening.
		!#zh 通知 LoadingItems 队列一个 item 对象已完成，请不要调用这个函数，除非你知道自己在做什么。
		@param id The item url 
		*/
		itemComplete(id: string): void;		
		/**
		!#en Destroy the LoadingItems queue, the queue object won't be garbage collected, it will be recycled, so every after destroy is not reliable.
		!#zh 销毁一个 LoadingItems 队列，这个队列对象会被内部缓冲池回收，所以销毁后的所有内部信息都是不可依赖的。 
		*/
		destroy(): void;	
	}	
	/** !#en
	A pipeline describes a sequence of manipulations, each manipulation is called a pipe.<br/>
	It's designed for loading process. so items should be urls, and the url will be the identity of each item during the process.<br/>
	A list of items can flow in the pipeline and it will output the results of all pipes.<br/>
	They flow in the pipeline like water in tubes, they go through pipe by pipe separately.<br/>
	Finally all items will flow out the pipeline and the process is finished.
	
	!#zh
	pipeline 描述了一系列的操作，每个操作都被称为 pipe。<br/>
	它被设计来做加载过程的流程管理。所以 item 应该是 url，并且该 url 将是在处理中的每个 item 的身份标识。<br/>
	一个 item 列表可以在 pipeline 中流动，它将输出加载项经过所有 pipe 之后的结果。<br/>
	它们穿过 pipeline 就像水在管子里流动，将会按顺序流过每个 pipe。<br/>
	最后当所有加载项都流出 pipeline 时，整个加载流程就结束了。 */
	export class Pipeline {		
		/**
		!#en
		Constructor, pass an array of pipes to construct a new Pipeline,
		the pipes will be chained in the given order.<br/>
		A pipe is an object which must contain an `id` in string and a `handle` function,
		the id must be unique in the pipeline.<br/>
		It can also include `async` property to identify whether it's an asynchronous process.
		!#zh
		构造函数，通过一系列的 pipe 来构造一个新的 pipeline，pipes 将会在给定的顺序中被锁定。<br/>
		一个 pipe 就是一个对象，它包含了字符串类型的 ‘id’ 和 ‘handle’ 函数，在 pipeline 中 id 必须是唯一的。<br/>
		它还可以包括 ‘async’ 属性以确定它是否是一个异步过程。
		@param pipes pipes
		
		@example 
		```js
		var pipeline = new Pipeline([
		     {
		         id: 'Downloader',
		         handle: function (item, callback) {},
		         async: true
		     },
		     {id: 'Parser', handle: function (item) {}, async: false}
		 ]);
		``` 
		*/
		constructor(pipes: any[]);		
		/**
		!#en
		Insert a new pipe at the given index of the pipeline. <br/>
		A pipe must contain an `id` in string and a `handle` function, the id must be unique in the pipeline.
		!#zh
		在给定的索引位置插入一个新的 pipe。<br/>
		一个 pipe 必须包含一个字符串类型的 ‘id’ 和 ‘handle’ 函数，该 id 在 pipeline 必须是唯一标识。
		@param pipe The pipe to be inserted
		@param index The index to insert 
		*/
		insertPipe(pipe: any, index: number): void;		
		/**
		!#en
		Insert a pipe to the end of an existing pipe. The existing pipe must be a valid pipe in the pipeline.
		!#zh
		在当前 pipeline 的一个已知 pipe 后面插入一个新的 pipe。
		@param refPipe An existing pipe in the pipeline.
		@param newPipe The pipe to be inserted. 
		*/
		insertPipeAfter(refPipe: any, newPipe: any): void;		
		/**
		!#en
		Add a new pipe at the end of the pipeline. <br/>
		A pipe must contain an `id` in string and a `handle` function, the id must be unique in the pipeline.
		!#zh
		添加一个新的 pipe 到 pipeline 尾部。 <br/>
		该 pipe 必须包含一个字符串类型 ‘id’ 和 ‘handle’ 函数，该 id 在 pipeline 必须是唯一标识。
		@param pipe The pipe to be appended 
		*/
		appendPipe(pipe: any): void;		
		/**
		!#en
		Let new items flow into the pipeline. <br/>
		Each item can be a simple url string or an object,
		if it's an object, it must contain `id` property. <br/>
		You can specify its type by `type` property, by default, the type is the extension name in url. <br/>
		By adding a `skips` property including pipe ids, you can skip these pipe. <br/>
		The object can contain any supplementary property as you want. <br/>
		!#zh
		让新的 item 流入 pipeline 中。<br/>
		这里的每个 item 可以是一个简单字符串类型的 url 或者是一个对象,
		如果它是一个对象的话，他必须要包含 ‘id’ 属性。<br/>
		你也可以指定它的 ‘type’ 属性类型，默认情况下，该类型是 ‘url’ 的后缀名。<br/>
		也通过添加一个 包含 ‘skips’ 属性的 item 对象，你就可以跳过 skips 中包含的 pipe。<br/>
		该对象可以包含任何附加属性。
		@param items items
		
		@example 
		```js
		pipeline.flowIn([
		     'res/Background.png',
		     {
		         id: 'res/scene.json',
		         type: 'scene',
		         name: 'scene',
		         skips: ['Downloader']
		     }
		 ]);
		``` 
		*/
		flowIn(items: any[]): void;		
		/**
		!#en
		Copy the item states from one source item to all destination items. <br/>
		It's quite useful when a pipe generate new items from one source item,<br/>
		then you should flowIn these generated items into pipeline, <br/>
		but you probably want them to skip all pipes the source item already go through,<br/>
		you can achieve it with this API. <br/>
		<br/>
		For example, an unzip pipe will generate more items, but you won't want them to pass unzip or download pipe again.
		!#zh
		从一个源 item 向所有目标 item 复制它的 pipe 状态，用于避免重复通过部分 pipe。<br/>
		当一个源 item 生成了一系列新的 items 时很有用，<br/>
		你希望让这些新的依赖项进入 pipeline，但是又不希望它们通过源 item 已经经过的 pipe，<br/>
		但是你可能希望他们源 item 已经通过并跳过所有 pipes，<br/>
		这个时候就可以使用这个 API。
		@param srcItem The source item
		@param dstItems A single destination item or an array of destination items 
		*/
		copyItemStates(srcItem: any, dstItems: any[]|any): void;		
		/**
		!#en Returns an item in pipeline.
		!#zh 根据 id 获取一个 item
		@param id The id of the item 
		*/
		getItem(id: any): any;		
		/**
		!#en Removes an completed item in pipeline.
		It will only remove the cache in the pipeline or loader, its dependencies won't be released.
		cc.loader provided another method to completely cleanup the resource and its dependencies,
		please refer to {{#crossLink "loader/release:method"}}cc.loader.release{{/crossLink}}
		!#zh 移除指定的已完成 item。
		这将仅仅从 pipeline 或者 loader 中删除其缓存，并不会释放它所依赖的资源。
		cc.loader 中提供了另一种删除资源及其依赖的清理方法，请参考 {{#crossLink "loader/release:method"}}cc.loader.release{{/crossLink}}
		@param id The id of the item 
		*/
		removeItem(id: any): boolean;		
		/**
		!#en Clear the current pipeline, this function will clean up the items.
		!#zh 清空当前 pipeline，该函数将清理 items。 
		*/
		clear(): void;	
	}	
	/** !#en The module provides utilities for working with file and directory paths
	!#zh 用于处理文件与目录的路径的模块 */
	export class path {		
		/**
		!#en Join strings to be a path.
		!#zh 拼接字符串为 Path
		
		@example 
		```js
		------------------------------
		cc.path.join("a", "b.png");        //-->"a/b.png"
		cc.path.join("a", "b", "c.png");   //-->"a/b/c.png"
		cc.path.join("a", "b");            //-->"a/b"
		cc.path.join("a", "b", "/");       //-->"a/b/"
		cc.path.join("a", "b/", "/");      //-->"a/b/"
		
		``` 
		*/
		static join(): string;		
		/**
		!#en Get the ext name of a path including '.', like '.png'.
		!#zh 返回 Path 的扩展名，包括 '.'，例如 '.png'。
		@param pathStr pathStr
		
		@example 
		```js
		---------------------------
		cc.path.extname("a/b.png");		//-->".png"
		cc.path.extname("a/b.png?a=1&b=2");	//-->".png"
		cc.path.extname("a/b");			//-->null
		cc.path.extname("a/b?a=1&b=2");		//-->null
		
		``` 
		*/
		static extname(pathStr: string): any;		
		/**
		!#en Get the main name of a file name
		!#zh 获取文件名的主名称
		@param fileName fileName 
		*/
		static mainFileName(fileName: string): string;		
		/**
		!#en Get the file name of a file path.
		!#zh 获取文件路径的文件名。
		@param pathStr pathStr
		@param extname extname
		
		@example 
		```js
		---------------------------------
		cc.path.basename("a/b.png");			//-->"b.png"
		cc.path.basename("a/b.png?a=1&b=2");		//-->"b.png"
		cc.path.basename("a/b.png", ".png");		//-->"b"
		cc.path.basename("a/b.png?a=1&b=2", ".png");	//-->"b"
		cc.path.basename("a/b.png", ".txt");		//-->"b.png"
		
		``` 
		*/
		static basename(pathStr: string, extname?: string): any;		
		/**
		!#en Get dirname of a file path.
		!#zh 获取文件路径的目录名。
		@param pathStr pathStr
		
		@example 
		```js
		---------------------------------
		* unix
		cc.path.driname("a/b/c.png");		//-->"a/b"
		cc.path.driname("a/b/c.png?a=1&b=2");	//-->"a/b"
		cc.path.dirname("a/b/");		//-->"a/b"
		cc.path.dirname("c.png");		//-->""
		* windows
		cc.path.driname("a\\b\\c.png");		//-->"a\b"
		cc.path.driname("a\\b\\c.png?a=1&b=2");	//-->"a\b"
		
		``` 
		*/
		static dirname(pathStr: string): any;		
		/**
		!#en Change extname of a file path.
		!#zh 更改文件路径的扩展名。
		@param pathStr pathStr
		@param extname extname
		
		@example 
		```js
		---------------------------------
		cc.path.changeExtname("a/b.png", ".plist");		//-->"a/b.plist"
		cc.path.changeExtname("a/b.png?a=1&b=2", ".plist");	//-->"a/b.plist?a=1&b=2"
		
		``` 
		*/
		static changeExtname(pathStr: string, extname?: string): string;	
	}	
	/** !#en
	AffineTransform class represent an affine transform matrix. It's composed basically by translation, rotation, scale transformations.<br/>
	!#zh
	AffineTransform 类代表一个仿射变换矩阵。它基本上是由平移旋转，缩放转变所组成。<br/> */
	export class AffineTransform {		
		/**
		!#en Create a AffineTransform object with all contents in the matrix.
		!#zh 用在矩阵中的所有内容创建一个 AffineTransform 对象。
		@param a a
		@param b b
		@param c c
		@param d d
		@param tx tx
		@param ty ty 
		*/
		static create(a: number, b: number, c: number, d: number, tx: number, ty: number): AffineTransform;		
		/**
		!#en
		Create a identity transformation matrix: <br/>
		[ 1, 0, 0, <br/>
		  0, 1, 0 ]
		!#zh
		单位矩阵：<br/>
		[ 1, 0, 0, <br/>
		  0, 1, 0 ] 
		*/
		static identity(): AffineTransform;		
		/**
		!#en Clone a AffineTransform object from the specified transform.
		!#zh 克隆指定的 AffineTransform 对象。
		@param t t 
		*/
		static clone(t: AffineTransform): AffineTransform;		
		/**
		!#en
		Concatenate a transform matrix to another
		The results are reflected in the out affine transform
		out = t1 * t2
		This function is memory free, you should create the output affine transform by yourself and manage its memory.
		!#zh
		拼接两个矩阵，将结果保存到 out 矩阵。这个函数不创建任何内存，你需要先创建 AffineTransform 对象用来存储结果，并作为第一个参数传入函数。
		out = t1 * t2
		@param out Out object to store the concat result
		@param t1 The first transform object.
		@param t2 The transform object to concatenate. 
		*/
		static concat(out: AffineTransform, t1: AffineTransform, t2: AffineTransform): AffineTransform;		
		/**
		!#en Get the invert transform of an AffineTransform object.
		This function is memory free, you should create the output affine transform by yourself and manage its memory.
		!#zh 求逆矩阵。这个函数不创建任何内存，你需要先创建 AffineTransform 对象用来存储结果，并作为第一个参数传入函数。
		@param out out
		@param t t 
		*/
		static invert(out: AffineTransform, t: AffineTransform): AffineTransform;		
		/**
		!#en Get an AffineTransform object from a given matrix 4x4.
		This function is memory free, you should create the output affine transform by yourself and manage its memory.
		!#zh 从一个 4x4 Matrix 获取 AffineTransform 对象。这个函数不创建任何内存，你需要先创建 AffineTransform 对象用来存储结果，并作为第一个参数传入函数。
		@param out out
		@param mat mat 
		*/
		static invert(out: AffineTransform, mat: Mat4): AffineTransform;		
		/**
		!#en Apply the affine transformation on a point.
		This function is memory free, you should create the output Vec2 by yourself and manage its memory.
		!#zh 对一个点应用矩阵变换。这个函数不创建任何内存，你需要先创建一个 Vec2 对象用来存储结果，并作为第一个参数传入函数。
		@param out The output point to store the result
		@param point Point to apply transform or x.
		@param transOrY transform matrix or y.
		@param t transform matrix. 
		*/
		static transformVec2(out: Vec2, point: Vec2|number, transOrY: AffineTransform|number, t?: AffineTransform): Vec2;		
		/**
		!#en Apply the affine transformation on a size.
		This function is memory free, you should create the output Size by yourself and manage its memory.
		!#zh 应用仿射变换矩阵到 Size 上。这个函数不创建任何内存，你需要先创建一个 Size 对象用来存储结果，并作为第一个参数传入函数。
		@param out The output point to store the result
		@param size size
		@param t t 
		*/
		static transformSize(out: Size, size: Size, t: AffineTransform): Size;		
		/**
		!#en Apply the affine transformation on a rect.
		This function is memory free, you should create the output Rect by yourself and manage its memory.
		!#zh 应用仿射变换矩阵到 Rect 上。这个函数不创建任何内存，你需要先创建一个 Rect 对象用来存储结果，并作为第一个参数传入函数。
		@param out out
		@param rect rect
		@param anAffineTransform anAffineTransform 
		*/
		static transformRect(out: Rect, rect: Rect, anAffineTransform: AffineTransform): Rect;		
		/**
		!#en Apply the affine transformation on a rect, and truns to an Oriented Bounding Box.
		This function is memory free, you should create the output vectors by yourself and manage their memory.
		!#zh 应用仿射变换矩阵到 Rect 上, 并转换为有向包围盒。这个函数不创建任何内存，你需要先创建包围盒的四个 Vector 对象用来存储结果，并作为前四个参数传入函数。
		@param out_bl out_bl
		@param out_tl out_tl
		@param out_tr out_tr
		@param out_br out_br
		@param rect rect
		@param anAffineTransform anAffineTransform 
		*/
		static transformObb(out_bl: Vec2, out_tl: Vec2, out_tr: Vec2, out_br: Vec2, rect: Rect, anAffineTransform: AffineTransform): void;	
	}	
	/** A base node for CCNode, it will:
	- maintain scene hierarchy and active logic
	- notifications if some properties changed
	- define some interfaces shares between CCNode
	- define machanisms for Enity Component Systems
	- define prefab and serialize functions */
	export class _BaseNode extends Object implements EventTarget {		
		/** !#en Name of node.
		!#zh 该节点名称。 */
		name: string;		
		/** !#en The uuid for editor, will be stripped before building project.
		!#zh 主要用于编辑器的 uuid，在编辑器下可用于持久化存储，在项目构建之后将变成自增的 id。 */
		uuid: string;		
		/** !#en All children nodes.
		!#zh 节点的所有子节点。 */
		children: Node[];		
		/** !#en All children nodes.
		!#zh 节点的子节点数量。 */
		childrenCount: number;		
		/** !#en
		The local active state of this node.<br/>
		Note that a Node may be inactive because a parent is not active, even if this returns true.<br/>
		Use {{#crossLink "Node/activeInHierarchy:property"}}{{/crossLink}} if you want to check if the Node is actually treated as active in the scene.
		!#zh
		当前节点的自身激活状态。<br/>
		值得注意的是，一个节点的父节点如果不被激活，那么即使它自身设为激活，它仍然无法激活。<br/>
		如果你想检查节点在场景中实际的激活状态可以使用 {{#crossLink "Node/activeInHierarchy:property"}}{{/crossLink}}。 */
		active: boolean;		
		/** !#en Indicates whether this node is active in the scene.
		!#zh 表示此节点是否在场景中激活。 */
		activeInHierarchy: boolean;		
		/**
		
		@param name name 
		*/
		constructor(name?: string);		
		/** !#en The parent of the node.
		!#zh 该节点的父节点。 */
		parent: Node;		
		/**
		!#en Get parent of the node.
		!#zh 获取该节点的父节点。
		
		@example 
		```js
		var parent = this.node.getParent();
		``` 
		*/
		getParent(): Node;		
		/**
		!#en Set parent of the node.
		!#zh 设置该节点的父节点。
		@param value value
		
		@example 
		```js
		node.setParent(newNode);
		``` 
		*/
		setParent(value: Node): void;		
		/**
		!#en
		Properties configuration function <br/>
		All properties in attrs will be set to the node, <br/>
		when the setter of the node is available, <br/>
		the property will be set via setter function.<br/>
		!#zh 属性配置函数。在 attrs 的所有属性将被设置为节点属性。
		@param attrs Properties to be set to node
		
		@example 
		```js
		var attrs = { key: 0, num: 100 };
		node.attr(attrs);
		``` 
		*/
		attr(attrs: any): void;		
		/**
		!#en Returns a child from the container given its uuid.
		!#zh 通过 uuid 获取节点的子节点。
		@param uuid The uuid to find the child node.
		
		@example 
		```js
		var child = node.getChildByUuid(uuid);
		``` 
		*/
		getChildByUuid(uuid: string): Node;		
		/**
		!#en Returns a child from the container given its name.
		!#zh 通过名称获取节点的子节点。
		@param name A name to find the child node.
		
		@example 
		```js
		var child = node.getChildByName("Test Node");
		``` 
		*/
		getChildByName(name: string): Node;		
		/**
		!#en
		Inserts a child to the node at a specified index.
		!#zh
		插入子节点到指定位置
		@param child the child node to be inserted
		@param siblingIndex the sibling index to place the child in
		
		@example 
		```js
		node.insertChild(child, 2);
		``` 
		*/
		insertChild(child: Node, siblingIndex: number): void;		
		/**
		!#en Get the sibling index.
		!#zh 获取同级索引。
		
		@example 
		```js
		var index = node.getSiblingIndex();
		``` 
		*/
		getSiblingIndex(): number;		
		/**
		!#en Set the sibling index of this node.
		!#zh 设置节点同级索引。
		@param index index
		
		@example 
		```js
		node.setSiblingIndex(1);
		``` 
		*/
		setSiblingIndex(index: number): void;		
		/**
		!#en Walk though the sub children tree of the current node.
		Each node, including the current node, in the sub tree will be visited two times, before all children and after all children.
		This function call is not recursive, it's based on stack.
		Please don't walk any other node inside the walk process.
		!#zh 遍历该节点的子树里的所有节点并按规则执行回调函数。
		对子树中的所有节点，包含当前节点，会执行两次回调，prefunc 会在访问它的子节点之前调用，postfunc 会在访问所有子节点之后调用。
		这个函数的实现不是基于递归的，而是基于栈展开递归的方式。
		请不要在 walk 过程中对任何其他的节点嵌套执行 walk。
		@param prefunc The callback to process node when reach the node for the first time
		@param postfunc The callback to process node when re-visit the node after walked all children in its sub tree
		
		@example 
		```js
		node.walk(function (target) {
		    console.log('Walked through node ' + target.name + ' for the first time');
		}, function (target) {
		    console.log('Walked through node ' + target.name + ' after walked all children in its sub tree');
		});
		``` 
		*/
		walk(prefunc: (target: _BaseNode) => void, postfunc: (target: _BaseNode) => void): void;		
		/**
		!#en
		Remove itself from its parent node. If cleanup is `true`, then also remove all events and actions. <br/>
		If the cleanup parameter is not passed, it will force a cleanup, so it is recommended that you always pass in the `false` parameter when calling this API.<br/>
		If the node orphan, then nothing happens.
		!#zh
		从父节点中删除该节点。如果不传入 cleanup 参数或者传入 `true`，那么这个节点上所有绑定的事件、action 都会被删除。<br/>
		因此建议调用这个 API 时总是传入 `false` 参数。<br/>
		如果这个节点是一个孤节点，那么什么都不会发生。
		@param cleanup true if all actions and callbacks on this node should be removed, false otherwise.
		
		@example 
		```js
		node.removeFromParent();
		node.removeFromParent(false);
		``` 
		*/
		removeFromParent(cleanup?: boolean): void;		
		/**
		!#en
		Removes a child from the container. It will also cleanup all running actions depending on the cleanup parameter. </p>
		If the cleanup parameter is not passed, it will force a cleanup. <br/>
		"remove" logic MUST only be on this method  <br/>
		If a class wants to extend the 'removeChild' behavior it only needs <br/>
		to override this method.
		!#zh
		移除节点中指定的子节点，是否需要清理所有正在运行的行为取决于 cleanup 参数。<br/>
		如果 cleanup 参数不传入，默认为 true 表示清理。<br/>
		@param child The child node which will be removed.
		@param cleanup true if all running actions and callbacks on the child node will be cleanup, false otherwise.
		
		@example 
		```js
		node.removeChild(newNode);
		node.removeChild(newNode, false);
		``` 
		*/
		removeChild(child: Node, cleanup?: boolean): void;		
		/**
		!#en
		Removes all children from the container and do a cleanup all running actions depending on the cleanup parameter. <br/>
		If the cleanup parameter is not passed, it will force a cleanup.
		!#zh
		移除节点所有的子节点，是否需要清理所有正在运行的行为取决于 cleanup 参数。<br/>
		如果 cleanup 参数不传入，默认为 true 表示清理。
		@param cleanup true if all running actions on all children nodes should be cleanup, false otherwise.
		
		@example 
		```js
		node.removeAllChildren();
		node.removeAllChildren(false);
		``` 
		*/
		removeAllChildren(cleanup?: boolean): void;		
		/**
		!#en Is this node a child of the given node?
		!#zh 是否是指定节点的子节点？
		@param parent parent
		
		@example 
		```js
		node.isChildOf(newNode);
		``` 
		*/
		isChildOf(parent: Node): boolean;		
		/**
		!#en
		Returns the component of supplied type if the node has one attached, null if it doesn't.<br/>
		You can also get component in the node by passing in the name of the script.
		!#zh
		获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。<br/>
		传入参数也可以是脚本的名称。
		@param typeOrClassName typeOrClassName
		
		@example 
		```js
		// get sprite component
		var sprite = node.getComponent(cc.Sprite);
		// get custom test class
		var test = node.getComponent("Test");
		``` 
		*/
		getComponent<T extends Component>(type: {prototype: T}): T;
		getComponent(className: string): any;		
		/**
		!#en Returns all components of supplied type in the node.
		!#zh 返回节点上指定类型的所有组件。
		@param typeOrClassName typeOrClassName
		
		@example 
		```js
		var sprites = node.getComponents(cc.Sprite);
		var tests = node.getComponents("Test");
		``` 
		*/
		getComponents<T extends Component>(type: {prototype: T}): T[];
		getComponents(className: string): any[];		
		/**
		!#en Returns the component of supplied type in any of its children using depth first search.
		!#zh 递归查找所有子节点中第一个匹配指定类型的组件。
		@param typeOrClassName typeOrClassName
		
		@example 
		```js
		var sprite = node.getComponentInChildren(cc.Sprite);
		var Test = node.getComponentInChildren("Test");
		``` 
		*/
		getComponentInChildren<T extends Component>(type: {prototype: T}): T;
		getComponentInChildren(className: string): any;		
		/**
		!#en Returns all components of supplied type in self or any of its children.
		!#zh 递归查找自身或所有子节点中指定类型的组件
		@param typeOrClassName typeOrClassName
		
		@example 
		```js
		var sprites = node.getComponentsInChildren(cc.Sprite);
		var tests = node.getComponentsInChildren("Test");
		``` 
		*/
		getComponentsInChildren<T extends Component>(type: {prototype: T}): T[];
		getComponentsInChildren(className: string): any[];		
		/**
		!#en Adds a component class to the node. You can also add component to node by passing in the name of the script.
		!#zh 向节点添加一个指定类型的组件类，你还可以通过传入脚本的名称来添加组件。
		@param typeOrClassName The constructor or the class name of the component to add
		
		@example 
		```js
		var sprite = node.addComponent(cc.Sprite);
		var test = node.addComponent("Test");
		``` 
		*/
		addComponent<T extends Component>(type: {new(): T}): T;
		addComponent(className: string): any;		
		/**
		!#en
		Removes a component identified by the given name or removes the component object given.
		You can also use component.destroy() if you already have the reference.
		!#zh
		删除节点上的指定组件，传入参数可以是一个组件构造函数或组件名，也可以是已经获得的组件引用。
		如果你已经获得组件引用，你也可以直接调用 component.destroy()
		@param component The need remove component.
		
		@example 
		```js
		node.removeComponent(cc.Sprite);
		var Test = require("Test");
		node.removeComponent(Test);
		``` 
		*/
		removeComponent(component: string|Function|Component): void;		
		/**
		!#en
		Destroy all children from the node, and release all their own references to other objects.<br/>
		Actual destruct operation will delayed until before rendering.
		!#zh
		销毁所有子节点，并释放所有它们对其它对象的引用。<br/>
		实际销毁操作会延迟到当前帧渲染前执行。
		
		@example 
		```js
		node.destroyAllChildren();
		``` 
		*/
		destroyAllChildren(): void;		
		/**
		!#en Checks whether the EventTarget object has any callback registered for a specific type of event.
		!#zh 检查事件目标对象是否有为特定类型的事件注册的回调。
		@param type The type of event. 
		*/
		hasEventListener(type: string): boolean;		
		/**
		!#en
		Register an callback of a specific event type on the EventTarget.
		This type of event should be triggered via `emit`.
		!#zh
		注册事件目标的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		
		@example 
		```js
		eventTarget.on('fire', function () {
		    cc.log("fire in the hole");
		}, node);
		``` 
		*/
		on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T;		
		/**
		!#en
		Removes the listeners previously registered with the same type, callback, target and or useCapture,
		if only type is passed as parameter, all listeners registered with that type will be removed.
		!#zh
		删除之前用同类型，回调，目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
		@param type A string representing the event type being removed.
		@param callback The callback to remove.
		@param target The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
		
		@example 
		```js
		// register fire eventListener
		var callback = eventTarget.on('fire', function () {
		    cc.log("fire in the hole");
		}, target);
		// remove fire event listener
		eventTarget.off('fire', callback, target);
		// remove all fire event listeners
		eventTarget.off('fire');
		``` 
		*/
		off(type: string, callback?: Function, target?: any): void;		
		/**
		!#en Removes all callbacks previously registered with the same target (passed as parameter).
		This is not for removing all listeners in the current event target,
		and this is not for removing all listeners the target parameter have registered.
		It's only for removing all listeners (callback and target couple) registered on the current event target by the target parameter.
		!#zh 在当前 EventTarget 上删除指定目标（target 参数）注册的所有事件监听器。
		这个函数无法删除当前 EventTarget 的所有事件监听器，也无法删除 target 参数所注册的所有事件监听器。
		这个函数只能删除 target 参数在当前 EventTarget 上注册的所有事件监听器。
		@param target The target to be searched for all related listeners 
		*/
		targetOff(target: any): void;		
		/**
		!#en
		Register an callback of a specific event type on the EventTarget,
		the callback will remove itself after the first time it is triggered.
		!#zh
		注册事件目标的特定事件类型回调，回调会在第一时间被触发后删除自身。
		@param type A string representing the event type to listen for.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		
		@example 
		```js
		eventTarget.once('fire', function () {
		    cc.log("this is the callback and will be invoked only once");
		}, node);
		``` 
		*/
		once(type: string, callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void, target?: any): void;		
		/**
		!#en
		Send an event with the event object.
		!#zh
		通过事件对象派发事件
		@param event event 
		*/
		dispatchEvent(event: Event): void;	
	}	
	/** !#en
	Helper class for setting material blend function.
	!#zh
	设置材质混合模式的辅助类。 */
	export class BlendFunc {		
		/** !#en specify the source Blend Factor, this will generate a custom material object, please pay attention to the memory cost.
		!#zh 指定原图的混合模式，这会克隆一个新的材质对象，注意这带来的开销 */
		srcBlendFactor: macro.BlendFactor;		
		/** !#en specify the destination Blend Factor.
		!#zh 指定目标的混合模式 */
		dstBlendFactor: macro.BlendFactor;	
	}	
	/** An internal helper class for switching render component's material between normal sprite material and gray sprite material. */
	export class GraySpriteState {		
		/** !#en The normal material.
		!#zh 正常状态的材质。 */
		normalMaterial: Material;		
		/** !#en The gray material.
		!#zh 置灰状态的材质。 */
		grayMaterial: Material;	
	}	
	/** misc utilities */
	export class misc {		
		/**
		!#en Clamp a value between from and to.
		!#zh
		限定浮点数的最大最小值。<br/>
		数值大于 max_inclusive 则返回 max_inclusive。<br/>
		数值小于 min_inclusive 则返回 min_inclusive。<br/>
		否则返回自身。
		@param value value
		@param min_inclusive min_inclusive
		@param max_inclusive max_inclusive
		
		@example 
		```js
		var v1 = cc.misc.clampf(20, 0, 20); // 20;
		var v2 = cc.misc.clampf(-1, 0, 20); //  0;
		var v3 = cc.misc.clampf(10, 0, 20); // 10;
		``` 
		*/
		static clampf(value: number, min_inclusive: number, max_inclusive: number): number;		
		/**
		!#en Clamp a value between 0 and 1.
		!#zh 限定浮点数的取值范围为 0 ~ 1 之间。
		@param value value
		
		@example 
		```js
		var v1 = cc.misc.clamp01(20);  // 1;
		var v2 = cc.misc.clamp01(-1);  // 0;
		var v3 = cc.misc.clamp01(0.5); // 0.5;
		``` 
		*/
		static clamp01(value: number): number;		
		/**
		Linear interpolation between 2 numbers, the ratio sets how much it is biased to each end
		@param a number A
		@param b number B
		@param r ratio between 0 and 1
		
		@example 
		```js
		----
		lerp
		cc.misc.lerp(2,10,0.5)//returns 6
		cc.misc.lerp(2,10,0.2)//returns 3.6
		
		``` 
		*/
		static lerp(a: number, b: number, r: number): number;		
		/**
		converts degrees to radians
		@param angle angle 
		*/
		static degreesToRadians(angle: number): number;		
		/**
		converts radians to degrees
		@param angle angle 
		*/
		static radiansToDegrees(angle: number): number;	
	}	
	/** !#en the device accelerometer reports values for each axis in units of g-force.
	!#zh 设备重力传感器传递的各个轴的数据。 */
	export class constructor {		
		/**
		whether enable accelerometer event
		@param isEnable isEnable 
		*/
		setAccelerometerEnabled(isEnable: boolean): void;		
		/**
		set accelerometer interval value
		@param interval interval 
		*/
		setAccelerometerInterval(interval: number): void;	
	}	
	/** Predefined constants */
	export class macro {		
		/** PI / 180 */
		static RAD: number;		
		/** One degree */
		static DEG: number;		
		static REPEAT_FOREVER: number;		
		static FLT_EPSILON: number;		
		/** Minimum z index value for node */
		static MIN_ZINDEX: number;		
		/** Maximum z index value for node */
		static MAX_ZINDEX: number;		
		static ONE: number;		
		static ZERO: number;		
		static SRC_ALPHA: number;		
		static SRC_ALPHA_SATURATE: number;		
		static SRC_COLOR: number;		
		static DST_ALPHA: number;		
		static DST_COLOR: number;		
		static ONE_MINUS_SRC_ALPHA: number;		
		static ONE_MINUS_SRC_COLOR: number;		
		static ONE_MINUS_DST_ALPHA: number;		
		static ONE_MINUS_DST_COLOR: number;		
		static ONE_MINUS_CONSTANT_ALPHA: number;		
		static ONE_MINUS_CONSTANT_COLOR: number;		
		/** Oriented vertically */
		static ORIENTATION_PORTRAIT: number;		
		/** Oriented horizontally */
		static ORIENTATION_LANDSCAPE: number;		
		/** Oriented automatically */
		static ORIENTATION_AUTO: number;		
		/** <p>
		  If enabled, the texture coordinates will be calculated by using this formula: <br/>
		     - texCoord.left = (rect.x*2+1) / (texture.wide*2);                  <br/>
		     - texCoord.right = texCoord.left + (rect.width*2-2)/(texture.wide*2); <br/>
		                                                                                <br/>
		 The same for bottom and top.                                                   <br/>
		                                                                                <br/>
		 This formula prevents artifacts by using 99% of the texture.                   <br/>
		 The "correct" way to prevent artifacts is by expand the texture's border with the same color by 1 pixel<br/>
		                                                                                 <br/>
		 Affected component:                                                                 <br/>
		     - cc.TMXLayer                                                       <br/>
		                                                                                 <br/>
		 Enabled by default. To disabled set it to 0. <br/>
		 To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
		</p> */
		static FIX_ARTIFACTS_BY_STRECHING_TEXEL_TMX: number;		
		/** Position of the FPS (Default: 0,0 (bottom-left corner))<br/>
		To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h */
		static DIRECTOR_STATS_POSITION: Vec2;		
		/** <p>
		   If enabled, actions that alter the position property (eg: CCMoveBy, CCJumpBy, CCBezierBy, etc..) will be stacked.                  <br/>
		   If you run 2 or more 'position' actions at the same time on a node, then end position will be the sum of all the positions.        <br/>
		   If disabled, only the last run action will take effect.
		</p> */
		static ENABLE_STACKABLE_ACTIONS: number;		
		/** !#en
		The timeout to determine whether a touch is no longer active and should be removed.
		The reason to add this timeout is due to an issue in X5 browser core,
		when X5 is presented in wechat on Android, if a touch is glissed from the bottom up, and leave the page area,
		no touch cancel event is triggered, and the touch will be considered active forever.
		After multiple times of this action, our maximum touches number will be reached and all new touches will be ignored.
		So this new mechanism can remove the touch that should be inactive if it's not updated during the last 5000 milliseconds.
		Though it might remove a real touch if it's just not moving for the last 5 seconds which is not easy with the sensibility of mobile touch screen.
		You can modify this value to have a better behavior if you find it's not enough.
		!#zh
		用于甄别一个触点对象是否已经失效并且可以被移除的延时时长
		添加这个时长的原因是 X5 内核在微信浏览器中出现的一个 bug。
		在这个环境下，如果用户将一个触点从底向上移出页面区域，将不会触发任何 touch cancel 或 touch end 事件，而这个触点会被永远当作停留在页面上的有效触点。
		重复这样操作几次之后，屏幕上的触点数量将达到我们的事件系统所支持的最高触点数量，之后所有的触摸事件都将被忽略。
		所以这个新的机制可以在触点在一定时间内没有任何更新的情况下视为失效触点并从事件系统中移除。
		当然，这也可能移除一个真实的触点，如果用户的触点真的在一定时间段内完全没有移动（这在当前手机屏幕的灵敏度下会很难）。
		你可以修改这个值来获得你需要的效果，默认值是 5000 毫秒。 */
		static TOUCH_TIMEOUT: number;		
		/** !#en
		The maximum vertex count for a single batched draw call.
		!#zh
		最大可以被单次批处理渲染的顶点数量。 */
		static BATCH_VERTEX_COUNT: number;		
		/** !#en
		Whether or not enabled tiled map auto culling. If you set the TiledMap skew or rotation, then need to manually disable this, otherwise, the rendering will be wrong.
		!#zh
		是否开启瓦片地图的自动裁减功能。瓦片地图如果设置了 skew, rotation 或者采用了摄像机的话，需要手动关闭，否则渲染会出错。 */
		static ENABLE_TILEDMAP_CULLING: boolean;		
		/** !#en
		The max concurrent task number for the downloader
		!#zh
		下载任务的最大并发数限制，在安卓平台部分机型或版本上可能需要限制在较低的水平 */
		static DOWNLOAD_MAX_CONCURRENT: number;		
		/** !#en
		Boolean that indicates if the canvas contains an alpha channel, default sets to false for better performance.
		Though if you want to make your canvas background transparent and show other dom elements at the background,
		you can set it to true before `cc.game.run`.
		Web only.
		!#zh
		用于设置 Canvas 背景是否支持 alpha 通道，默认为 false，这样可以有更高的性能表现。
		如果你希望 Canvas 背景是透明的，并显示背后的其他 DOM 元素，你可以在 `cc.game.run` 之前将这个值设为 true。
		仅支持 Web */
		static ENABLE_TRANSPARENT_CANVAS: boolean;		
		/** !#en
		Boolean that indicates if the WebGL context is created with `antialias` option turned on, default value is false.
		Set it to true could make your game graphics slightly smoother, like texture hard edges when rotated.
		Whether to use this really depend on your game design and targeted platform,
		device with retina display usually have good detail on graphics with or without this option,
		you probably don't want antialias if your game style is pixel art based.
		Also, it could have great performance impact with some browser / device using software MSAA.
		You can set it to true before `cc.game.run`.
		Web only.
		!#zh
		用于设置在创建 WebGL Context 时是否开启抗锯齿选项，默认值是 false。
		将这个选项设置为 true 会让你的游戏画面稍稍平滑一些，比如旋转硬边贴图时的锯齿。是否开启这个选项很大程度上取决于你的游戏和面向的平台。
		在大多数拥有 retina 级别屏幕的设备上用户往往无法区分这个选项带来的变化；如果你的游戏选择像素艺术风格，你也多半不会想开启这个选项。
		同时，在少部分使用软件级别抗锯齿算法的设备或浏览器上，这个选项会对性能产生比较大的影响。
		你可以在 `cc.game.run` 之前设置这个值，否则它不会生效。
		仅支持 Web */
		static ENABLE_WEBGL_ANTIALIAS: boolean;		
		/** !#en
		Whether or not enable auto culling.
		This feature have been removed in v2.0 new renderer due to overall performance consumption.
		We have no plan currently to re-enable auto culling.
		If your game have more dynamic objects, we suggest to disable auto culling.
		If your game have more static objects, we suggest to enable auto culling.
		!#zh
		是否开启自动裁减功能，开启裁减功能将会把在屏幕外的物体从渲染队列中去除掉。
		这个功能在 v2.0 的新渲染器中被移除了，因为它在大多数游戏中所带来的损耗要高于性能的提升，目前我们没有计划重新支持自动裁剪。
		如果游戏中的动态物体比较多的话，建议将此选项关闭。
		如果游戏中的静态物体比较多的话，建议将此选项打开。 */
		static ENABLE_CULLING: boolean;		
		/** !#en
		Whether to clear the original image cache after uploaded a texture to GPU. If cleared, [Dynamic Atlas](https://docs.cocos.com/creator/manual/en/advanced-topics/dynamic-atlas.html) will not be supported.
		Normally you don't need to enable this option on the web platform, because Image object doesn't consume too much memory.
		But on WeChat Game platform, the current version cache decoded data in Image object, which has high memory usage.
		So we enabled this option by default on WeChat, so that we can release Image cache immediately after uploaded to GPU.
		!#zh
		是否在将贴图上传至 GPU 之后删除原始图片缓存，删除之后图片将无法进行 [动态合图](https://docs.cocos.com/creator/manual/zh/advanced-topics/dynamic-atlas.html)。
		在 Web 平台，你通常不需要开启这个选项，因为在 Web 平台 Image 对象所占用的内存很小。
		但是在微信小游戏平台的当前版本，Image 对象会缓存解码后的图片数据，它所占用的内存空间很大。
		所以我们在微信平台默认开启了这个选项，这样我们就可以在上传 GL 贴图之后立即释放 Image 对象的内存，避免过高的内存占用。 */
		static CLEANUP_IMAGE_CACHE: boolean;		
		/** !#en
		Whether or not show mesh wire frame.
		!#zh
		是否显示网格的线框。 */
		static SHOW_MESH_WIREFRAME: boolean;		
		/** !#en
		Whether or not show mesh normal.
		!#zh
		是否显示网格的法线。 */
		static SHOW_MESH_NORMAL: boolean;		
		/** !#en
		Whether to enable multi-touch.
		!#zh
		是否开启多点触摸 */
		static ENABLE_MULTI_TOUCH: boolean;		
		/** !#en
		The image format supported by the engine defaults, and the supported formats may differ in different build platforms and device types.
		Currently all platform and device support ['.webp', '.jpg', '.jpeg', '.bmp', '.png'], The iOS mobile platform also supports the PVR format。
		!#zh
		引擎默认支持的图片格式，支持的格式可能在不同的构建平台和设备类型上有所差别。
		目前所有平台和设备支持的格式有 ['.webp', '.jpg', '.jpeg', '.bmp', '.png']. 另外 Ios 手机平台还额外支持了 PVR 格式。 */
		static SUPPORT_TEXTURE_FORMATS: string[];	
	}	
	/** undefined */
	export enum VerticalTextAlignment {		
		TOP = 0,
		CENTER = 0,
		BOTTOM = 0,	
	}	
	/** The base class of most of all the objects in Fireball. */
	export class Object {		
		/** !#en The name of the object.
		!#zh 该对象的名称。 */
		name: string;		
		/** !#en
		Indicates whether the object is not yet destroyed. (It will not be available after being destroyed)<br>
		When an object's `destroy` is called, it is actually destroyed after the end of this frame.
		So `isValid` will return false from the next frame, while `isValid` in the current frame will still be true.
		If you want to determine whether the current frame has called `destroy`, use `cc.isValid(obj, true)`,
		but this is often caused by a particular logical requirements, which is not normally required.
		
		!#zh
		表示该对象是否可用（被 destroy 后将不可用）。<br>
		当一个对象的 `destroy` 调用以后，会在这一帧结束后才真正销毁。因此从下一帧开始 `isValid` 就会返回 false，而当前帧内 `isValid` 仍然会是 true。如果希望判断当前帧是否调用过 `destroy`，请使用 `cc.isValid(obj, true)`，不过这往往是特殊的业务需求引起的，通常情况下不需要这样。 */
		isValid: boolean;		
		/**
		!#en
		Destroy this Object, and release all its own references to other objects.<br/>
		Actual object destruction will delayed until before rendering.
		From the next frame, this object is not usable any more.
		You can use cc.isValid(obj) to check whether the object is destroyed before accessing it.
		!#zh
		销毁该对象，并释放所有它对其它对象的引用。<br/>
		实际销毁操作会延迟到当前帧渲染前执行。从下一帧开始，该对象将不再可用。
		您可以在访问对象之前使用 cc.isValid(obj) 来检查对象是否已被销毁。
		
		@example 
		```js
		obj.destroy();
		``` 
		*/
		destroy(): boolean;	
	}	
	/** Bit mask that controls object states. */
	export enum Flags {		
		DontSave = 0,
		EditorOnly = 0,
		HideInHierarchy = 0,	
	}	
	/** The fullscreen API provides an easy way for web content to be presented using the user's entire screen.
	It's invalid on safari, QQbrowser and android browser */
	export class screen {		
		/**
		initialize 
		*/
		init(): void;		
		/**
		return true if it's full now. 
		*/
		fullScreen(): boolean;		
		/**
		change the screen to full mode.
		@param element element
		@param onFullScreenChange onFullScreenChange
		@param onFullScreenError onFullScreenError 
		*/
		requestFullScreen(element: Element, onFullScreenChange: Function, onFullScreenError: Function): void;		
		/**
		exit the full mode. 
		*/
		exitFullScreen(): boolean;		
		/**
		Automatically request full screen with a touch/click event
		@param element element
		@param onFullScreenChange onFullScreenChange 
		*/
		autoFullScreen(element: Element, onFullScreenChange: Function): void;	
	}	
	/** System variables */
	export class sys {		
		/** English language code */
		static LANGUAGE_ENGLISH: string;		
		/** Chinese language code */
		static LANGUAGE_CHINESE: string;		
		/** French language code */
		static LANGUAGE_FRENCH: string;		
		/** Italian language code */
		static LANGUAGE_ITALIAN: string;		
		/** German language code */
		static LANGUAGE_GERMAN: string;		
		/** Spanish language code */
		static LANGUAGE_SPANISH: string;		
		/** Spanish language code */
		static LANGUAGE_DUTCH: string;		
		/** Russian language code */
		static LANGUAGE_RUSSIAN: string;		
		/** Korean language code */
		static LANGUAGE_KOREAN: string;		
		/** Japanese language code */
		static LANGUAGE_JAPANESE: string;		
		/** Hungarian language code */
		static LANGUAGE_HUNGARIAN: string;		
		/** Portuguese language code */
		static LANGUAGE_PORTUGUESE: string;		
		/** Arabic language code */
		static LANGUAGE_ARABIC: string;		
		/** Norwegian language code */
		static LANGUAGE_NORWEGIAN: string;		
		/** Polish language code */
		static LANGUAGE_POLISH: string;		
		/** Turkish language code */
		static LANGUAGE_TURKISH: string;		
		/** Ukrainian language code */
		static LANGUAGE_UKRAINIAN: string;		
		/** Romanian language code */
		static LANGUAGE_ROMANIAN: string;		
		/** Bulgarian language code */
		static LANGUAGE_BULGARIAN: string;		
		/** Unknown language code */
		static LANGUAGE_UNKNOWN: string;		
		static OS_IOS: string;		
		static OS_ANDROID: string;		
		static OS_WINDOWS: string;		
		static OS_MARMALADE: string;		
		static OS_LINUX: string;		
		static OS_BADA: string;		
		static OS_BLACKBERRY: string;		
		static OS_OSX: string;		
		static OS_WP8: string;		
		static OS_WINRT: string;		
		static OS_UNKNOWN: string;		
		static UNKNOWN: number;		
		static WIN32: number;		
		static LINUX: number;		
		static MACOS: number;		
		static ANDROID: number;		
		static IPHONE: number;		
		static IPAD: number;		
		static BLACKBERRY: number;		
		static NACL: number;		
		static EMSCRIPTEN: number;		
		static TIZEN: number;		
		static WINRT: number;		
		static WP8: number;		
		static MOBILE_BROWSER: number;		
		static DESKTOP_BROWSER: number;		
		/** Indicates whether executes in editor's window process (Electron's renderer context) */
		static EDITOR_PAGE: number;		
		/** Indicates whether executes in editor's main process (Electron's browser context) */
		static EDITOR_CORE: number;		
		static WECHAT_GAME: number;		
		static QQ_PLAY: number;		
		static FB_PLAYABLE_ADS: number;		
		static BAIDU_GAME: number;		
		static VIVO_GAME: number;		
		static OPPO_GAME: number;		
		static HUAWEI_GAME: number;		
		static XIAOMI_GAME: number;		
		static JKW_GAME: number;		
		static ALIPAY_GAME: number;		
		static WECHAT_GAME_SUB: number;		
		static BAIDU_GAME_SUB: number;		
		static QTT_GAME: number;		
		/** BROWSER_TYPE_WECHAT */
		static BROWSER_TYPE_WECHAT: string;		
		/** BROWSER_TYPE_WECHAT_GAME */
		static BROWSER_TYPE_WECHAT_GAME: string;		
		/** BROWSER_TYPE_WECHAT_GAME_SUB */
		static BROWSER_TYPE_WECHAT_GAME_SUB: string;		
		/** BROWSER_TYPE_BAIDU_GAME */
		static BROWSER_TYPE_BAIDU_GAME: string;		
		/** BROWSER_TYPE_BAIDU_GAME_SUB */
		static BROWSER_TYPE_BAIDU_GAME_SUB: string;		
		/** BROWSER_TYPE_XIAOMI_GAME */
		static BROWSER_TYPE_XIAOMI_GAME: string;		
		/** BROWSER_TYPE_ALIPAY_GAME */
		static BROWSER_TYPE_ALIPAY_GAME: string;		
		/** BROWSER_TYPE_QQ_PLAY */
		static BROWSER_TYPE_QQ_PLAY: string;		
		static BROWSER_TYPE_ANDROID: string;		
		static BROWSER_TYPE_IE: string;		
		static BROWSER_TYPE_EDGE: string;		
		static BROWSER_TYPE_QQ: string;		
		static BROWSER_TYPE_MOBILE_QQ: string;		
		static BROWSER_TYPE_UC: string;		
		/** uc third party integration. */
		static BROWSER_TYPE_UCBS: string;		
		static BROWSER_TYPE_360: string;		
		static BROWSER_TYPE_BAIDU_APP: string;		
		static BROWSER_TYPE_BAIDU: string;		
		static BROWSER_TYPE_MAXTHON: string;		
		static BROWSER_TYPE_OPERA: string;		
		static BROWSER_TYPE_OUPENG: string;		
		static BROWSER_TYPE_MIUI: string;		
		static BROWSER_TYPE_FIREFOX: string;		
		static BROWSER_TYPE_SAFARI: string;		
		static BROWSER_TYPE_CHROME: string;		
		static BROWSER_TYPE_LIEBAO: string;		
		static BROWSER_TYPE_QZONE: string;		
		static BROWSER_TYPE_SOUGOU: string;		
		static BROWSER_TYPE_UNKNOWN: string;		
		/** Is native ? This is set to be true in jsb auto. */
		static isNative: boolean;		
		/** Is web browser ? */
		static isBrowser: boolean;		
		/**
		Is webgl extension support?
		@param name name 
		*/
		static glExtension(name: any): void;		
		/**
		Get max joint matrix size for skinned mesh renderer. 
		*/
		static getMaxJointMatrixSize(): void;		
		/** Indicate whether system is mobile system */
		static isMobile: boolean;		
		/** Indicate the running platform */
		static platform: number;		
		/** Get current language iso 639-1 code.
		Examples of valid language codes include "zh-tw", "en", "en-us", "fr", "fr-fr", "es-es", etc.
		The actual value totally depends on results provided by destination platform. */
		static languageCode: string;		
		/** Indicate the current language of the running system */
		static language: string;		
		/** Indicate the running os name */
		static os: string;		
		/** Indicate the running os version */
		static osVersion: string;		
		/** Indicate the running os main version */
		static osMainVersion: number;		
		/** Indicate the running browser type */
		static browserType: string;		
		/** Indicate the running browser version */
		static browserVersion: string;		
		/** Indicate the real pixel resolution of the whole game window */
		static windowPixelResolution: Size;		
		/** cc.sys.localStorage is a local storage component. */
		static localStorage: any;		
		/** The capabilities of the current platform */
		static capabilities: any;		
		/**
		!#en
		Get the network type of current device, return cc.sys.NetworkType.LAN if failure.
		!#zh
		获取当前设备的网络类型, 如果网络类型无法获取，默认将返回 cc.sys.NetworkType.LAN 
		*/
		static getNetworkType(): sys.NetworkType;		
		/**
		!#en
		Get the battery level of current device, return 1.0 if failure.
		!#zh
		获取当前设备的电池电量，如果电量无法获取，默认将返回 1 
		*/
		static getBatteryLevel(): number;		
		/**
		Forces the garbage collection, only available in JSB 
		*/
		static garbageCollect(): void;		
		/**
		Restart the JS VM, only available in JSB 
		*/
		static restartVM(): void;		
		/**
		!#en
		Return the safe area rect. <br/>
		only available on the iOS native platform, otherwise it will return a rect with design resolution size.
		!#zh
		返回手机屏幕安全区域，目前仅在 iOS 原生平台有效。其它平台将默认返回设计分辨率尺寸。 
		*/
		static getSafeAreaRect(): Rect;		
		/**
		Check whether an object is valid,
		In web engine, it will return true if the object exist
		In native engine, it will return true if the JS object and the correspond native object are both valid
		@param obj obj 
		*/
		static isObjectValid(obj: any): boolean;		
		/**
		Dump system informations 
		*/
		static dump(): void;		
		/**
		Open a url in browser
		@param url url 
		*/
		static openURL(url: string): void;		
		/**
		Get the number of milliseconds elapsed since 1 January 1970 00:00:00 UTC. 
		*/
		static now(): number;	
	}	
	/** cc.view is the singleton object which represents the game window.<br/>
	It's main task include: <br/>
	 - Apply the design resolution policy<br/>
	 - Provide interaction with the window, like resize event on web, retina display support, etc...<br/>
	 - Manage the game view port which can be different with the window<br/>
	 - Manage the content scale and translation<br/>
	<br/>
	Since the cc.view is a singleton, you don't need to call any constructor or create functions,<br/>
	the standard way to use it is by calling:<br/>
	 - cc.view.methodName(); <br/> */
	export class View extends EventTarget {		
		/**
		!#en
		Sets view's target-densitydpi for android mobile browser. it can be set to:           <br/>
		  1. cc.macro.DENSITYDPI_DEVICE, value is "device-dpi"                                      <br/>
		  2. cc.macro.DENSITYDPI_HIGH, value is "high-dpi"  (default value)                         <br/>
		  3. cc.macro.DENSITYDPI_MEDIUM, value is "medium-dpi" (browser's default value)            <br/>
		  4. cc.macro.DENSITYDPI_LOW, value is "low-dpi"                                            <br/>
		  5. Custom value, e.g: "480"                                                         <br/>
		!#zh 设置目标内容的每英寸像素点密度。
		@param densityDPI densityDPI 
		*/
		setTargetDensityDPI(densityDPI: string): void;		
		/**
		!#en
		Returns the current target-densitydpi value of cc.view.
		!#zh 获取目标内容的每英寸像素点密度。 
		*/
		getTargetDensityDPI(): string;		
		/**
		!#en
		Sets whether resize canvas automatically when browser's size changed.<br/>
		Useful only on web.
		!#zh 设置当发现浏览器的尺寸改变时，是否自动调整 canvas 尺寸大小。
		仅在 Web 模式下有效。
		@param enabled Whether enable automatic resize with browser's resize event 
		*/
		resizeWithBrowserSize(enabled: boolean): void;		
		/**
		!#en
		Sets the callback function for cc.view's resize action,<br/>
		this callback will be invoked before applying resolution policy, <br/>
		so you can do any additional modifications within the callback.<br/>
		Useful only on web.
		!#zh 设置 cc.view 调整视窗尺寸行为的回调函数，
		这个回调函数会在应用适配模式之前被调用，
		因此你可以在这个回调函数内添加任意附加改变，
		仅在 Web 平台下有效。
		@param callback The callback function 
		*/
		setResizeCallback(callback: Function|void): void;		
		/**
		!#en
		Sets the orientation of the game, it can be landscape, portrait or auto.
		When set it to landscape or portrait, and screen w/h ratio doesn't fit,
		cc.view will automatically rotate the game canvas using CSS.
		Note that this function doesn't have any effect in native,
		in native, you need to set the application orientation in native project settings
		!#zh 设置游戏屏幕朝向，它能够是横版，竖版或自动。
		当设置为横版或竖版，并且屏幕的宽高比例不匹配时，
		cc.view 会自动用 CSS 旋转游戏场景的 canvas，
		这个方法不会对 native 部分产生任何影响，对于 native 而言，你需要在应用设置中的设置排版。
		@param orientation Possible values: cc.macro.ORIENTATION_LANDSCAPE | cc.macro.ORIENTATION_PORTRAIT | cc.macro.ORIENTATION_AUTO 
		*/
		setOrientation(orientation: number): void;		
		/**
		!#en
		Sets whether the engine modify the "viewport" meta in your web page.<br/>
		It's enabled by default, we strongly suggest you not to disable it.<br/>
		And even when it's enabled, you can still set your own "viewport" meta, it won't be overridden<br/>
		Only useful on web
		!#zh 设置引擎是否调整 viewport meta 来配合屏幕适配。
		默认设置为启动，我们强烈建议你不要将它设置为关闭。
		即使当它启动时，你仍然能够设置你的 viewport meta，它不会被覆盖。
		仅在 Web 模式下有效
		@param enabled Enable automatic modification to "viewport" meta 
		*/
		adjustViewportMeta(enabled: boolean): void;		
		/**
		!#en
		Retina support is enabled by default for Apple device but disabled for other devices,<br/>
		it takes effect only when you called setDesignResolutionPolicy<br/>
		Only useful on web
		!#zh 对于 Apple 这种支持 Retina 显示的设备上默认进行优化而其他类型设备默认不进行优化，
		它仅会在你调用 setDesignResolutionPolicy 方法时有影响。
		仅在 Web 模式下有效。
		@param enabled Enable or disable retina display 
		*/
		enableRetina(enabled: boolean): void;		
		/**
		!#en
		Check whether retina display is enabled.<br/>
		Only useful on web
		!#zh 检查是否对 Retina 显示设备进行优化。
		仅在 Web 模式下有效。 
		*/
		isRetinaEnabled(): boolean;		
		/**
		!#en Whether to Enable on anti-alias
		!#zh 控制抗锯齿是否开启
		@param enabled Enable or not anti-alias 
		*/
		enableAntiAlias(enabled: boolean): void;		
		/**
		!#en Returns whether the current enable on anti-alias
		!#zh 返回当前是否抗锯齿 
		*/
		isAntiAliasEnabled(): boolean;		
		/**
		!#en
		If enabled, the application will try automatically to enter full screen mode on mobile devices<br/>
		You can pass true as parameter to enable it and disable it by passing false.<br/>
		Only useful on web
		!#zh 启动时，移动端游戏会在移动端自动尝试进入全屏模式。
		你能够传入 true 为参数去启动它，用 false 参数来关闭它。
		@param enabled Enable or disable auto full screen on mobile devices 
		*/
		enableAutoFullScreen(enabled: boolean): void;		
		/**
		!#en
		Check whether auto full screen is enabled.<br/>
		Only useful on web
		!#zh 检查自动进入全屏模式是否启动。
		仅在 Web 模式下有效。 
		*/
		isAutoFullScreenEnabled(): boolean;		
		/**
		!#en
		Returns the canvas size of the view.<br/>
		On native platforms, it returns the screen size since the view is a fullscreen view.<br/>
		On web, it returns the size of the canvas element.
		!#zh 返回视图中 canvas 的尺寸。
		在 native 平台下，它返回全屏视图下屏幕的尺寸。
		在 Web 平台下，它返回 canvas 元素尺寸。 
		*/
		getCanvasSize(): Size;		
		/**
		!#en
		Returns the frame size of the view.<br/>
		On native platforms, it returns the screen size since the view is a fullscreen view.<br/>
		On web, it returns the size of the canvas's outer DOM element.
		!#zh 返回视图中边框尺寸。
		在 native 平台下，它返回全屏视图下屏幕的尺寸。
		在 web 平台下，它返回 canvas 元素的外层 DOM 元素尺寸。 
		*/
		getFrameSize(): Size;		
		/**
		!#en
		On native, it sets the frame size of view.<br/>
		On web, it sets the size of the canvas's outer DOM element.
		!#zh 在 native 平台下，设置视图框架尺寸。
		在 web 平台下，设置 canvas 外层 DOM 元素尺寸。
		@param width width
		@param height height 
		*/
		setFrameSize(width: number, height: number): void;		
		/**
		!#en
		Returns the visible area size of the view port.
		!#zh 返回视图窗口可见区域尺寸。 
		*/
		getVisibleSize(): Size;		
		/**
		!#en
		Returns the visible area size of the view port.
		!#zh 返回视图窗口可见区域像素尺寸。 
		*/
		getVisibleSizeInPixel(): Size;		
		/**
		!#en
		Returns the visible origin of the view port.
		!#zh 返回视图窗口可见区域原点。 
		*/
		getVisibleOrigin(): Vec2;		
		/**
		!#en
		Returns the visible origin of the view port.
		!#zh 返回视图窗口可见区域像素原点。 
		*/
		getVisibleOriginInPixel(): Vec2;		
		/**
		!#en
		Returns the current resolution policy
		!#zh 返回当前分辨率方案 
		*/
		getResolutionPolicy(): ResolutionPolicy;		
		/**
		!#en
		Sets the current resolution policy
		!#zh 设置当前分辨率模式
		@param resolutionPolicy resolutionPolicy 
		*/
		setResolutionPolicy(resolutionPolicy: ResolutionPolicy|number): void;		
		/**
		!#en
		Sets the resolution policy with designed view size in points.<br/>
		The resolution policy include: <br/>
		[1] ResolutionExactFit       Fill screen by stretch-to-fit: if the design resolution ratio of width to height is different from the screen resolution ratio, your game view will be stretched.<br/>
		[2] ResolutionNoBorder       Full screen without black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two areas of your game view will be cut.<br/>
		[3] ResolutionShowAll        Full screen with black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two black borders will be shown.<br/>
		[4] ResolutionFixedHeight    Scale the content's height to screen's height and proportionally scale its width<br/>
		[5] ResolutionFixedWidth     Scale the content's width to screen's width and proportionally scale its height<br/>
		[cc.ResolutionPolicy]        [Web only feature] Custom resolution policy, constructed by cc.ResolutionPolicy<br/>
		!#zh 通过设置设计分辨率和匹配模式来进行游戏画面的屏幕适配。
		@param width Design resolution width.
		@param height Design resolution height.
		@param resolutionPolicy The resolution policy desired 
		*/
		setDesignResolutionSize(width: number, height: number, resolutionPolicy: ResolutionPolicy|number): void;		
		/**
		!#en
		Returns the designed size for the view.
		Default resolution size is the same as 'getFrameSize'.
		!#zh 返回视图的设计分辨率。
		默认下分辨率尺寸同 `getFrameSize` 方法相同 
		*/
		getDesignResolutionSize(): Size;		
		/**
		!#en
		Sets the container to desired pixel resolution and fit the game content to it.
		This function is very useful for adaptation in mobile browsers.
		In some HD android devices, the resolution is very high, but its browser performance may not be very good.
		In this case, enabling retina display is very costy and not suggested, and if retina is disabled, the image may be blurry.
		But this API can be helpful to set a desired pixel resolution which is in between.
		This API will do the following:
		    1. Set viewport's width to the desired width in pixel
		    2. Set body width to the exact pixel resolution
		    3. The resolution policy will be reset with designed view size in points.
		!#zh 设置容器（container）需要的像素分辨率并且适配相应分辨率的游戏内容。
		@param width Design resolution width.
		@param height Design resolution height.
		@param resolutionPolicy The resolution policy desired 
		*/
		setRealPixelResolution(width: number, height: number, resolutionPolicy: ResolutionPolicy|number): void;		
		/**
		!#en
		Sets view port rectangle with points.
		!#zh 用设计分辨率下的点尺寸来设置视窗。
		@param x x
		@param y y
		@param w width
		@param h height 
		*/
		setViewportInPoints(x: number, y: number, w: number, h: number): void;		
		/**
		!#en
		Sets Scissor rectangle with points.
		!#zh 用设计分辨率下的点的尺寸来设置 scissor 剪裁区域。
		@param x x
		@param y y
		@param w w
		@param h h 
		*/
		setScissorInPoints(x: number, y: number, w: number, h: number): void;		
		/**
		!#en
		Returns whether GL_SCISSOR_TEST is enable
		!#zh 检查 scissor 是否生效。 
		*/
		isScissorEnabled(): boolean;		
		/**
		!#en
		Returns the current scissor rectangle
		!#zh 返回当前的 scissor 剪裁区域。 
		*/
		getScissorRect(): Rect;		
		/**
		!#en
		Returns the view port rectangle.
		!#zh 返回视窗剪裁区域。 
		*/
		getViewportRect(): Rect;		
		/**
		!#en
		Returns scale factor of the horizontal direction (X axis).
		!#zh 返回横轴的缩放比，这个缩放比是将画布像素分辨率放到设计分辨率的比例。 
		*/
		getScaleX(): number;		
		/**
		!#en
		Returns scale factor of the vertical direction (Y axis).
		!#zh 返回纵轴的缩放比，这个缩放比是将画布像素分辨率缩放到设计分辨率的比例。 
		*/
		getScaleY(): number;		
		/**
		!#en
		Returns device pixel ratio for retina display.
		!#zh 返回设备或浏览器像素比例。 
		*/
		getDevicePixelRatio(): number;		
		/**
		!#en
		Returns the real location in view for a translation based on a related position
		!#zh 将屏幕坐标转换为游戏视图下的坐标。
		@param tx The X axis translation
		@param ty The Y axis translation
		@param relatedPos The related position object including "left", "top", "width", "height" informations 
		*/
		convertToLocationInView(tx: number, ty: number, relatedPos: any): Vec2;	
	}	
	/** <p>cc.game.containerStrategy class is the root strategy class of container's scale strategy,
	it controls the behavior of how to scale the cc.game.container and cc.game.canvas object</p> */
	export class ContainerStrategy {		
		/**
		!#en
		Manipulation before appling the strategy
		!#zh 在应用策略之前的操作
		@param view The target view 
		*/
		preApply(view: View): void;		
		/**
		!#en
		Function to apply this strategy
		!#zh 策略应用方法
		@param view view
		@param designedResolution designedResolution 
		*/
		apply(view: View, designedResolution: Size): void;		
		/**
		!#en
		Manipulation after applying the strategy
		!#zh 策略调用之后的操作
		@param view The target view 
		*/
		postApply(view: View): void;	
	}	
	/** <p>cc.ContentStrategy class is the root strategy class of content's scale strategy,
	it controls the behavior of how to scale the scene and setup the viewport for the game</p> */
	export class ContentStrategy {		
		/**
		!#en
		Manipulation before applying the strategy
		!#zh 策略应用前的操作
		@param view The target view 
		*/
		preApply(view: View): void;		
		/**
		!#en Function to apply this strategy
		The return value is {scale: [scaleX, scaleY], viewport: {cc.Rect}},
		The target view can then apply these value to itself, it's preferred not to modify directly its private variables
		!#zh 调用策略方法
		@param view view
		@param designedResolution designedResolution 
		*/
		apply(view: View, designedResolution: Size): any;		
		/**
		!#en
		Manipulation after applying the strategy
		!#zh 策略调用之后的操作
		@param view The target view 
		*/
		postApply(view: View): void;	
	}	
	/** undefined */
	export class EqualToFrame extends ContainerStrategy {	
	}	
	/** undefined */
	export class ProportionalToFrame extends ContainerStrategy {	
	}	
	/** undefined */
	export class EqualToWindow extends EqualToFrame {	
	}	
	/** undefined */
	export class ProportionalToWindow extends ProportionalToFrame {	
	}	
	/** undefined */
	export class OriginalContainer extends ContainerStrategy {	
	}	
	/** <p>cc.ResolutionPolicy class is the root strategy class of scale strategy,
	its main task is to maintain the compatibility with Cocos2d-x</p> */
	export class ResolutionPolicy {		
		/**
		
		@param containerStg The container strategy
		@param contentStg The content strategy 
		*/
		constructor(containerStg: ContainerStrategy, contentStg: ContentStrategy);		
		/**
		!#en Manipulation before applying the resolution policy
		!#zh 策略应用前的操作
		@param view The target view 
		*/
		preApply(view: View): void;		
		/**
		!#en Function to apply this resolution policy
		The return value is {scale: [scaleX, scaleY], viewport: {cc.Rect}},
		The target view can then apply these value to itself, it's preferred not to modify directly its private variables
		!#zh 调用策略方法
		@param view The target view
		@param designedResolution The user defined design resolution 
		*/
		apply(view: View, designedResolution: Size): any;		
		/**
		!#en Manipulation after appyling the strategy
		!#zh 策略应用之后的操作
		@param view The target view 
		*/
		postApply(view: View): void;		
		/**
		!#en
		Setup the container's scale strategy
		!#zh 设置容器的适配策略
		@param containerStg containerStg 
		*/
		setContainerStrategy(containerStg: ContainerStrategy): void;		
		/**
		!#en
		Setup the content's scale strategy
		!#zh 设置内容的适配策略
		@param contentStg contentStg 
		*/
		setContentStrategy(contentStg: ContentStrategy): void;		
		/** The entire application is visible in the specified area without trying to preserve the original aspect ratio.<br/>
		Distortion can occur, and the application may appear stretched or compressed. */
		static EXACT_FIT: number;		
		/** The entire application fills the specified area, without distortion but possibly with some cropping,<br/>
		while maintaining the original aspect ratio of the application. */
		static NO_BORDER: number;		
		/** The entire application is visible in the specified area without distortion while maintaining the original<br/>
		aspect ratio of the application. Borders can appear on two sides of the application. */
		static SHOW_ALL: number;		
		/** The application takes the height of the design resolution size and modifies the width of the internal<br/>
		canvas so that it fits the aspect ratio of the device<br/>
		no distortion will occur however you must make sure your application works on different<br/>
		aspect ratios */
		static FIXED_HEIGHT: number;		
		/** The application takes the width of the design resolution size and modifies the height of the internal<br/>
		canvas so that it fits the aspect ratio of the device<br/>
		no distortion will occur however you must make sure your application works on different<br/>
		aspect ratios */
		static FIXED_WIDTH: number;		
		/** Unknow policy */
		static UNKNOWN: number;	
	}	
	/** cc.visibleRect is a singleton object which defines the actual visible rect of the current view,
	it should represent the same rect as cc.view.getViewportRect() */
	export class visibleRect {		
		/**
		initialize
		@param visibleRect visibleRect 
		*/
		static init(visibleRect: Rect): void;		
		/** Top left coordinate of the screen related to the game scene. */
		static topLeft: Vec2;		
		/** Top right coordinate of the screen related to the game scene. */
		static topRight: Vec2;		
		/** Top center coordinate of the screen related to the game scene. */
		static top: Vec2;		
		/** Bottom left coordinate of the screen related to the game scene. */
		static bottomLeft: Vec2;		
		/** Bottom right coordinate of the screen related to the game scene. */
		static bottomRight: Vec2;		
		/** Bottom center coordinate of the screen related to the game scene. */
		static bottom: Vec2;		
		/** Center coordinate of the screen related to the game scene. */
		static center: Vec2;		
		/** Left center coordinate of the screen related to the game scene. */
		static left: Vec2;		
		/** Right center coordinate of the screen related to the game scene. */
		static right: Vec2;		
		/** Width of the screen. */
		static width: number;		
		/** Height of the screen. */
		static height: number;	
	}	
	/** !#en The callbacks invoker to handle and invoke callbacks by key.
	!#zh CallbacksInvoker 用来根据 Key 管理并调用回调方法。 */
	export class CallbacksInvoker {		
		/**
		!#zh
		 检查指定事件是否已注册回调。
		!#en
		 Check if the specified key has any registered callback. If a callback is also specified,
		 it will only return true if the callback is registered.
		@param key key
		@param callback callback
		@param target target 
		*/
		hasEventListener(key: string, callback?: Function, target?: any): boolean;		
		/**
		!#zh
		移除在特定事件类型中注册的所有回调或在某个目标中注册的所有回调。
		
		!#en
		Removes all callbacks registered in a certain event type or all callbacks registered with a certain target
		@param keyOrTarget The event key to be removed or the target to be removed 
		*/
		removeAll(keyOrTarget: string|any): void;		
		/**
		!#zh
		删除之前与同类型，回调，目标注册的回调。
		@param key key
		@param callback callback
		@param target target 
		*/
		off(key: string, callback: Function, target?: any): void;		
		/**
		!#en
		Trigger an event directly with the event name and necessary arguments.
		!#zh
		通过事件名发送自定义事件
		@param key event type
		@param arg1 First argument
		@param arg2 Second argument
		@param arg3 Third argument
		@param arg4 Fourth argument
		@param arg5 Fifth argument
		
		@example 
		```js
		eventTarget.emit('fire', event);
		eventTarget.emit('fire', message, emitter);
		``` 
		*/
		emit(key: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): void;	
	}	
	/** !#en Contains information collected during deserialization
	!#zh 包含反序列化时的一些信息 */
	export class Details {		
		/** list of the depends assets' uuid */
		uuidList: string[];		
		/** the obj list whose field needs to load asset by uuid */
		uuidObjList: any[];		
		/** the corresponding field name which referenced to the asset */
		uuidPropList: string[];		
		reset(): void;		
		/**
		
		@param obj obj
		@param propName propName
		@param uuid uuid 
		*/
		push(obj: any, propName: string, uuid: string): void;	
	}	
	/** undefined */
	export class url {		
		/**
		Returns the url of raw assets, you will only need this if the raw asset is inside the "resources" folder.
		@param url url
		
		@example 
		```js
		---
		var url = cc.url.raw("textures/myTexture.png");
		console.log(url);   // "resources/raw/textures/myTexture.png"
		
		``` 
		*/
		static raw(url: string): string;	
	}	
	/** !#en The renderer object which provide access to render system APIs,
	detailed APIs will be available progressively.
	!#zh 提供基础渲染接口的渲染器对象，渲染层的基础接口将逐步开放给用户 */
	export class renderer {		
		/** !#en The render engine is available only after cc.game.EVENT_ENGINE_INITED event.<br/>
		Normally it will be inited as the webgl render engine, but in wechat open context domain,
		it will be inited as the canvas render engine. Canvas render engine is no longer available for other use case since v2.0.
		!#zh 基础渲染引擎对象只在 cc.game.EVENT_ENGINE_INITED 事件触发后才可获取。<br/>
		大多数情况下，它都会是 WebGL 渲染引擎实例，但是在微信开放数据域当中，它会是 Canvas 渲染引擎实例。请注意，从 2.0 开始，我们在其他平台和环境下都废弃了 Canvas 渲染器。 */
		static renderEngine: any;		
		/** !#en The total draw call count in last rendered frame.
		!#zh 上一次渲染帧所提交的渲染批次总数。 */
		static drawCalls: number;	
	}	
	/** !#en
	Representation of RGBA colors.
	
	Each color component is a floating point value with a range from 0 to 255.
	
	You can also use the convenience method {{#crossLink "cc/color:method"}}cc.color{{/crossLink}} to create a new Color.
	
	!#zh
	cc.Color 用于表示颜色。
	
	它包含 RGBA 四个以浮点数保存的颜色分量，每个的值都在 0 到 255 之间。
	
	您也可以通过使用 {{#crossLink "cc/color:method"}}cc.color{{/crossLink}} 的便捷方法来创建一个新的 Color。 */
	export class Color extends ValueType {		
		/** !#en Solid white, RGBA is [255, 255, 255, 255].
		!#zh 纯白色，RGBA 是 [255, 255, 255, 255]。 */
		static WHITE: Color;		
		/** !#en Solid black, RGBA is [0, 0, 0, 255].
		!#zh 纯黑色，RGBA 是 [0, 0, 0, 255]。 */
		static BLACK: Color;		
		/** !#en Transparent, RGBA is [0, 0, 0, 0].
		!#zh 透明，RGBA 是 [0, 0, 0, 0]。 */
		static TRANSPARENT: Color;		
		/** !#en Grey, RGBA is [127.5, 127.5, 127.5].
		!#zh 灰色，RGBA 是 [127.5, 127.5, 127.5]。 */
		static GRAY: Color;		
		/** !#en Solid red, RGBA is [255, 0, 0].
		!#zh 纯红色，RGBA 是 [255, 0, 0]。 */
		static RED: Color;		
		/** !#en Solid green, RGBA is [0, 255, 0].
		!#zh 纯绿色，RGBA 是 [0, 255, 0]。 */
		static GREEN: Color;		
		/** !#en Solid blue, RGBA is [0, 0, 255].
		!#zh 纯蓝色，RGBA 是 [0, 0, 255]。 */
		static BLUE: Color;		
		/** !#en Yellow, RGBA is [255, 235, 4].
		!#zh 黄色，RGBA 是 [255, 235, 4]。 */
		static YELLOW: Color;		
		/** !#en Orange, RGBA is [255, 127, 0].
		!#zh 橙色，RGBA 是 [255, 127, 0]。 */
		static ORANGE: Color;		
		/** !#en Cyan, RGBA is [0, 255, 255].
		!#zh 青色，RGBA 是 [0, 255, 255]。 */
		static CYAN: Color;		
		/** !#en Magenta, RGBA is [255, 0, 255].
		!#zh 洋红色（品红色），RGBA 是 [255, 0, 255]。 */
		static MAGENTA: Color;		
		/**
		Copy content of a color into another. 
		*/
		static copy (out: Color, a: Color): Color;		
		/**
		Clone a new color. 
		*/
		static clone (a: Color): Color;		
		/**
		Set the components of a color to the given values. 
		*/
		static set (out: Color, r = 255, g = 255, b = 255, a = 255): Color;		
		/**
		Converts the hexadecimal formal color into rgb formal. 
		*/
		static fromHex (out: Color, hex: number): Color;		
		/**
		Add components of two colors, respectively. 
		*/
		static add (out: Color, a: Color, b: Color): Color;		
		/**
		Subtract components of color b from components of color a, respectively. 
		*/
		static subtract (out: Color, a: Color, b: Color): Color;		
		/**
		Multiply components of two colors, respectively. 
		*/
		static multiply (out: Color, a: Color, b: Color): Color;		
		/**
		Divide components of color a by components of color b, respectively. 
		*/
		static divide (out: Color, a: Color, b: Color): Color;		
		/**
		Scales a color by a number. 
		*/
		static scale (out: Color, a: Color, b: number): Color;		
		/**
		Performs a linear interpolation between two colors. 
		*/
		static lerp (out: Color, a: Color, b: Color, t: number): Color;		
		/**
		!#zh 颜色转数组
		!#en Turn an array of colors
		@param ofs 数组起始偏移量 
		*/
		static toArray <Out extends IWritableArrayLike<number>> (out: Out, a: IColorLike, ofs = 0);		
		/**
		!#zh 数组转颜色
		!#en An array of colors turn
		@param ofs 数组起始偏移量 
		*/
		static fromArray <Out extends IColorLike> (arr: IWritableArrayLike<number>, out: Out, ofs = 0);		
		/**
		
		@param r red component of the color, default value is 0.
		@param g green component of the color, defualt value is 0.
		@param b blue component of the color, default value is 0.
		@param a alpha component of the color, default value is 255. 
		*/
		constructor(r?: number, g?: number, b?: number, a?: number);		
		/**
		!#en Clone a new color from the current color.
		!#zh 克隆当前颜色。
		
		@example 
		```js
		var color = new cc.Color();
		var newColor = color.clone();// Color {r: 0, g: 0, b: 0, a: 255}
		``` 
		*/
		clone(): Color;		
		/**
		!#en TODO
		!#zh 判断两个颜色是否相等。
		@param other other
		
		@example 
		```js
		var color1 = cc.Color.WHITE;
		var color2 = new cc.Color(255, 255, 255);
		cc.log(color1.equals(color2)); // true;
		color2 = cc.Color.RED;
		cc.log(color2.equals(color1)); // false;
		``` 
		*/
		equals(other: Color): boolean;		
		/**
		!#en TODO
		!#zh 线性插值
		@param to to
		@param ratio the interpolation coefficient.
		@param out optional, the receiving vector.
		
		@example 
		```js
		// Converts a white color to a black one trough time.
		update: function (dt) {
		    var color = this.node.color;
		    if (color.equals(cc.Color.BLACK)) {
		        return;
		    }
		    this.ratio += dt * 0.1;
		    this.node.color = cc.Color.WHITE.lerp(cc.Color.BLACK, ratio);
		}
		
		``` 
		*/
		lerp(to: Color, ratio: number, out?: Color): Color;		
		/**
		!#en TODO
		!#zh 转换为方便阅读的字符串。
		
		@example 
		```js
		var color = cc.Color.WHITE;
		color.toString(); // "rgba(255, 255, 255, 255)"
		``` 
		*/
		toString(): string;		
		/** !#en Get or set red channel value
		!#zh 获取或者设置红色通道 */
		r: number;		
		/** !#en Get or set green channel value
		!#zh 获取或者设置绿色通道 */
		g: number;		
		/** !#en Get or set blue channel value
		!#zh 获取或者设置蓝色通道 */
		b: number;		
		/** !#en Get or set alpha channel value
		!#zh 获取或者设置透明通道 */
		a: number;		
		/**
		!#en Gets red channel value
		!#zh 获取当前颜色的红色值。 
		*/
		getR(): number;		
		/**
		!#en Sets red value and return the current color object
		!#zh 设置当前的红色值，并返回当前对象。
		@param red the new Red component.
		
		@example 
		```js
		var color = new cc.Color();
		color.setR(255); // Color {r: 255, g: 0, b: 0, a: 255}
		``` 
		*/
		setR(red: number): Color;		
		/**
		!#en Gets green channel value
		!#zh 获取当前颜色的绿色值。 
		*/
		getG(): number;		
		/**
		!#en Sets green value and return the current color object
		!#zh 设置当前的绿色值，并返回当前对象。
		@param green the new Green component.
		
		@example 
		```js
		var color = new cc.Color();
		color.setG(255); // Color {r: 0, g: 255, b: 0, a: 255}
		``` 
		*/
		setG(green: number): Color;		
		/**
		!#en Gets blue channel value
		!#zh 获取当前颜色的蓝色值。 
		*/
		getB(): number;		
		/**
		!#en Sets blue value and return the current color object
		!#zh 设置当前的蓝色值，并返回当前对象。
		@param blue the new Blue component.
		
		@example 
		```js
		var color = new cc.Color();
		color.setB(255); // Color {r: 0, g: 0, b: 255, a: 255}
		``` 
		*/
		setB(blue: number): Color;		
		/**
		!#en Gets alpha channel value
		!#zh 获取当前颜色的透明度值。 
		*/
		getA(): number;		
		/**
		!#en Sets alpha value and return the current color object
		!#zh 设置当前的透明度，并返回当前对象。
		@param alpha the new Alpha component.
		
		@example 
		```js
		var color = new cc.Color();
		color.setA(0); // Color {r: 0, g: 0, b: 0, a: 0}
		``` 
		*/
		setA(alpha: number): Color;		
		/**
		!#en Convert color to css format.
		!#zh 转换为 CSS 格式。
		@param opt "rgba", "rgb", "#rgb" or "#rrggbb".
		
		@example 
		```js
		var color = cc.Color.BLACK;
		color.toCSS();          // "rgba(0,0,0,1.00)";
		color.toCSS("rgba");    // "rgba(0,0,0,1.00)";
		color.toCSS("rgb");     // "rgba(0,0,0)";
		color.toCSS("#rgb");    // "#000";
		color.toCSS("#rrggbb"); // "#000000";
		``` 
		*/
		toCSS(opt?: string): string;		
		/**
		!#en Read hex string and store color data into the current color object, the hex string must be formated as rgba or rgb.
		!#zh 读取 16 进制颜色。
		@param hexString hexString
		
		@example 
		```js
		var color = cc.Color.BLACK;
		color.fromHEX("#FFFF33"); // Color {r: 255, g: 255, b: 51, a: 255};
		``` 
		*/
		fromHEX(hexString: string): Color;		
		/**
		!#en convert Color to HEX color string.
		e.g.  cc.color(255,6,255)  to : "#ff06ff"
		!#zh 转换为 16 进制。
		@param fmt "#rgb", "#rrggbb" or "#rrggbbaa".
		
		@example 
		```js
		var color = cc.Color.BLACK;
		color.toHEX("#rgb");     // "000";
		color.toHEX("#rrggbb");  // "000000";
		``` 
		*/
		toHEX(fmt: string): string;		
		/**
		!#en Convert to 24bit rgb value.
		!#zh 转换为 24bit 的 RGB 值。
		
		@example 
		```js
		var color = cc.Color.YELLOW;
		color.toRGBValue(); // 16771844;
		``` 
		*/
		toRGBValue(): number;		
		/**
		!#en Read HSV model color and convert to RGB color
		!#zh 读取 HSV（色彩模型）格式。
		@param h h
		@param s s
		@param v v
		
		@example 
		```js
		var color = cc.Color.YELLOW;
		color.fromHSV(0, 0, 1); // Color {r: 255, g: 255, b: 255, a: 255};
		``` 
		*/
		fromHSV(h: number, s: number, v: number): Color;		
		/**
		!#en Transform to HSV model color
		!#zh 转换为 HSV（色彩模型）格式。
		
		@example 
		```js
		var color = cc.Color.YELLOW;
		color.toHSV(); // Object {h: 0.1533864541832669, s: 0.9843137254901961, v: 1};
		``` 
		*/
		toHSV(): any;		
		/**
		!#en Set the color
		!#zh 设置颜色
		@param color color 
		*/
		set (color: Color): Color;		
		/**
		!#en Multiplies the current color by the specified color
		!#zh 将当前颜色乘以与指定颜色
		@param other other 
		*/
		multiply(other: Color): Color;	
	}	
	/** !#en Representation of 4*4 matrix.
	!#zh 表示 4*4 矩阵 */
	export class Mat4 extends ValueType {		
		/**
		!#en Multiply the current matrix with another one
		!#zh 将当前矩阵与指定矩阵相乘
		@param other the second operand
		@param out the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created 
		*/
		mul(other: Mat4, out?: Mat4): Mat4;		
		/**
		!#en Multiply each element of the matrix by a scalar.
		!#zh 将矩阵的每一个元素都乘以指定的缩放值。
		@param number amount to scale the matrix's elements by
		@param out the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created 
		*/
		mulScalar(number: number, out?: Mat4): Mat4;		
		/**
		!#en Subtracts the current matrix with another one
		!#zh 将当前矩阵与指定的矩阵相减
		@param other the second operand
		@param out the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created 
		*/
		sub(other: Mat4, out?: Mat4): Mat4;		
		/** Identity  of Mat4 */
		static IDENTITY: Mat4;		
		/**
		!#zh 获得指定矩阵的拷贝
		!#en Copy of the specified matrix to obtain 
		*/
		static clone<Out extends IMat4Like> (a: Out);		
		/**
		!#zh 复制目标矩阵
		!#en Copy the target matrix 
		*/
		static copy<Out extends IMat4Like> (out: Out, a: Out);		
		/**
		!#zh 将目标赋值为单位矩阵
		!#en The target of an assignment is the identity matrix 
		*/
		static identity<Out extends IMat4Like> (out: Out);		
		/**
		!#zh 转置矩阵
		!#en Transposed matrix 
		*/
		static transpose<Out extends IMat4Like> (out: Out, a: Out);		
		/**
		!#zh 矩阵求逆
		!#en Matrix inversion 
		*/
		static invert<Out extends IMat4Like> (out: Out, a: Out);		
		/**
		!#zh 矩阵行列式
		!#en Matrix determinant 
		*/
		static determinant<Out extends IMat4Like> (a: Out): number;		
		/**
		!#zh 矩阵乘法
		!#en Matrix Multiplication 
		*/
		static multiply<Out extends IMat4Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 在给定矩阵变换基础上加入变换
		!#en Was added in a given transformation matrix transformation on the basis of 
		*/
		static transform<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike);		
		/**
		!#zh 在给定矩阵变换基础上加入新位移变换
		!#en Add new displacement transducer in a matrix transformation on the basis of a given 
		*/
		static translate<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike);		
		/**
		!#zh 在给定矩阵变换基础上加入新缩放变换
		!#en Add new scaling transformation in a given matrix transformation on the basis of 
		*/
		static scale<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike);		
		/**
		!#zh 在给定矩阵变换基础上加入新旋转变换
		!#en Add a new rotational transform matrix transformation on the basis of a given
		@param rad 旋转角度
		@param axis 旋转轴 
		*/
		static rotate<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, rad: number, axis: VecLike);		
		/**
		!#zh 在给定矩阵变换基础上加入绕 X 轴的旋转变换
		!#en Add rotational transformation around the X axis at a given matrix transformation on the basis of
		@param rad 旋转角度 
		*/
		static rotateX<Out extends IMat4Like> (out: Out, a: Out, rad: number);		
		/**
		!#zh 在给定矩阵变换基础上加入绕 Y 轴的旋转变换
		!#en Add about the Y axis rotation transformation in a given matrix transformation on the basis of
		@param rad 旋转角度 
		*/
		static rotateY<Out extends IMat4Like> (out: Out, a: Out, rad: number);		
		/**
		!#zh 在给定矩阵变换基础上加入绕 Z 轴的旋转变换
		!#en Added about the Z axis at a given rotational transformation matrix transformation on the basis of
		@param rad 旋转角度 
		*/
		static rotateZ<Out extends IMat4Like> (out: Out, a: Out, rad: number);		
		/**
		!#zh 计算位移矩阵
		!#en Displacement matrix calculation 
		*/
		static fromTranslation<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, v: VecLike);		
		/**
		!#zh 计算缩放矩阵
		!#en Scaling matrix calculation 
		*/
		static fromScaling<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, v: VecLike);		
		/**
		!#zh 计算旋转矩阵
		!#en Calculates the rotation matrix 
		*/
		static fromRotation<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, rad: number, axis: VecLike);		
		/**
		!#zh 计算绕 X 轴的旋转矩阵
		!#en Calculating rotation matrix about the X axis 
		*/
		static fromXRotation<Out extends IMat4Like> (out: Out, rad: number);		
		/**
		!#zh 计算绕 Y 轴的旋转矩阵
		!#en Calculating rotation matrix about the Y axis 
		*/
		static fromYRotation<Out extends IMat4Like> (out: Out, rad: number);		
		/**
		!#zh 计算绕 Z 轴的旋转矩阵
		!#en Calculating rotation matrix about the Z axis 
		*/
		static fromZRotation<Out extends IMat4Like> (out: Out, rad: number);		
		/**
		!#zh 根据旋转和位移信息计算矩阵
		!#en The rotation and displacement information calculating matrix 
		*/
		static fromRT<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike);		
		/**
		!#zh 提取矩阵的位移信息, 默认矩阵中的变换以 S->R->T 的顺序应用
		!#en Extracting displacement information of the matrix, the matrix transform to the default sequential application S-> R-> T is 
		*/
		static getTranslation<Out extends IMat4Like, VecLike extends IVec3Like> (out: VecLike, mat: Out);		
		/**
		!#zh 提取矩阵的缩放信息, 默认矩阵中的变换以 S->R->T 的顺序应用
		!#en Scaling information extraction matrix, the matrix transform to the default sequential application S-> R-> T is 
		*/
		static getScaling<Out extends IMat4Like, VecLike extends IVec3Like> (out: VecLike, mat: Out);		
		/**
		!#zh 提取矩阵的旋转信息, 默认输入矩阵不含有缩放信息，如考虑缩放应使用 `toRTS` 函数。
		!#en Rotation information extraction matrix, the matrix containing no default input scaling information, such as the use of `toRTS` should consider the scaling function. 
		*/
		static getRotation<Out extends IMat4Like> (out: Quat, mat: Out);		
		/**
		!#zh 提取旋转、位移、缩放信息， 默认矩阵中的变换以 S->R->T 的顺序应用
		!#en Extracting rotational displacement, zoom information, the default matrix transformation in order S-> R-> T applications 
		*/
		static toRTS<Out extends IMat4Like, VecLike extends IVec3Like> (mat: Out, q: Quat, v: VecLike, s: VecLike);		
		/**
		!#zh 根据旋转、位移、缩放信息计算矩阵，以 S->R->T 的顺序应用
		!#en The rotary displacement, the scaling matrix calculation information, the order S-> R-> T applications 
		*/
		static fromRTS<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike, s: VecLike);		
		/**
		!#zh 根据指定的旋转、位移、缩放及变换中心信息计算矩阵，以 S->R->T 的顺序应用
		!#en According to the specified rotation, displacement, and scale conversion matrix calculation information center, order S-> R-> T applications
		@param q 旋转值
		@param v 位移值
		@param s 缩放值
		@param o 指定变换中心 
		*/
		static fromRTSOrigin<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike, s: VecLike, o: VecLike);		
		/**
		!#zh 根据指定的旋转信息计算矩阵
		!#en The rotation matrix calculation information specified 
		*/
		static fromQuat<Out extends IMat4Like> (out: Out, q: Quat);		
		/**
		!#zh 根据指定的视锥体信息计算矩阵
		!#en The matrix calculation information specified frustum
		@param left 左平面距离
		@param right 右平面距离
		@param bottom 下平面距离
		@param top 上平面距离
		@param near 近平面距离
		@param far 远平面距离 
		*/
		static frustum<Out extends IMat4Like> (out: Out, left: number, right: number, bottom: number, top: number, near: number, far: number);		
		/**
		!#zh 计算透视投影矩阵
		!#en Perspective projection matrix calculation
		@param fovy 纵向视角高度
		@param aspect 长宽比
		@param near 近平面距离
		@param far 远平面距离 
		*/
		static perspective<Out extends IMat4Like> (out: Out, fovy: number, aspect: number, near: number, far: number);		
		/**
		!#zh 计算正交投影矩阵
		!#en Computing orthogonal projection matrix
		@param left 左平面距离
		@param right 右平面距离
		@param bottom 下平面距离
		@param top 上平面距离
		@param near 近平面距离
		@param far 远平面距离 
		*/
		static ortho<Out extends IMat4Like> (out: Out, left: number, right: number, bottom: number, top: number, near: number, far: number);		
		/**
		!#zh 根据视点计算矩阵，注意 `eye - center` 不能为零向量或与 `up` 向量平行
		!#en `Up` parallel vector or vector center` not be zero - the matrix calculation according to the viewpoint, note` eye
		@param eye 当前位置
		@param center 目标视点
		@param up 视口上方向 
		*/
		static lookAt<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, eye: VecLike, center: VecLike, up: VecLike);		
		/**
		!#zh 计算逆转置矩阵
		!#en Reversal matrix calculation 
		*/
		static inverseTranspose<Out extends IMat4Like> (out: Out, a: Out);		
		/**
		!#zh 逐元素矩阵加法
		!#en Element by element matrix addition 
		*/
		static add<Out extends IMat4Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 逐元素矩阵减法
		!#en Matrix element by element subtraction 
		*/
		static subtract<Out extends IMat4Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 矩阵标量乘法
		!#en Matrix scalar multiplication 
		*/
		static multiplyScalar<Out extends IMat4Like> (out: Out, a: Out, b: number);		
		/**
		!#zh 逐元素矩阵标量乘加: A + B * scale
		!#en Elements of the matrix by the scalar multiplication and addition: A + B * scale 
		*/
		static multiplyScalarAndAdd<Out extends IMat4Like> (out: Out, a: Out, b: Out, scale: number);		
		/**
		!#zh 矩阵等价判断
		!#en Analyzing the equivalent matrix 
		*/
		static strictEquals<Out extends IMat4Like> (a: Out, b: Out);		
		/**
		!#zh 排除浮点数误差的矩阵近似等价判断
		!#en Negative floating point error is approximately equivalent to determining a matrix 
		*/
		static equals<Out extends IMat4Like> (a: Out, b: Out, epsilon = EPSILON);		
		/**
		!#zh 矩阵转数组
		!#en Matrix transpose array
		@param ofs 数组内的起始偏移量 
		*/
		static toArray <Out extends IWritableArrayLike<number>> (out: Out, mat: IMat4Like, ofs = 0);		
		/**
		!#zh 数组转矩阵
		!#en Transfer matrix array
		@param ofs 数组起始偏移量 
		*/
		static fromArray <Out extends IMat4Like> (out: Out, arr: IWritableArrayLike<number>, ofs = 0);		
		/** !#en Matrix Data
		!#zh 矩阵数据 */
		m: Float64Array|Float32Array;		
		/**
		!#en
		Constructor
		see {{#crossLink "cc/mat4:method"}}cc.mat4{{/crossLink}}
		!#zh
		构造函数，可查看 {{#crossLink "cc/mat4:method"}}cc.mat4{{/crossLink}} 
		*/
		constructor ( m00: number = 1, m01: number = 0, m02: number = 0, m03: number = 0, m10: number = 0, m11: number = 1, m12: number = 0, m13: number = 0, m20: number = 0, m21: number = 0, m22: number = 1, m23: number = 0, m30: number = 0, m31: number = 0, m32: number = 0, m33: number = 1);		
		/**
		!#en clone a Mat4 object
		!#zh 克隆一个 Mat4 对象 
		*/
		clone(): Mat4;		
		/**
		!#en Sets the matrix with another one's value
		!#zh 用另一个矩阵设置这个矩阵的值。
		@param srcObj srcObj 
		*/
		set(srcObj: Mat4): Mat4;		
		/**
		!#en Check whether two matrix equal
		!#zh 当前的矩阵是否与指定的矩阵相等。
		@param other other 
		*/
		equals(other: Mat4): boolean;		
		/**
		!#en Check whether two matrix equal with default degree of variance.
		!#zh
		近似判断两个矩阵是否相等。<br/>
		判断 2 个矩阵是否在默认误差范围之内，如果在则返回 true，反之则返回 false。
		@param other other 
		*/
		fuzzyEquals(other: Mat4): boolean;		
		/**
		!#en Transform to string with matrix informations
		!#zh 转换为方便阅读的字符串。 
		*/
		toString(): string;		
		/**
		Set the matrix to the identity matrix 
		*/
		identity(): Mat4;		
		/**
		Transpose the values of a mat4
		@param out the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created. 
		*/
		transpose(out?: Mat4): Mat4;		
		/**
		Inverts a mat4
		@param out the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created. 
		*/
		invert(out?: Mat4): Mat4;		
		/**
		Calculates the adjugate of a mat4
		@param out the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created. 
		*/
		adjoint(out?: Mat4): Mat4;		
		/**
		Calculates the determinant of a mat4 
		*/
		determinant(): number;		
		/**
		Adds two Mat4
		@param other the second operand
		@param out the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created. 
		*/
		add(other: Mat4, out?: Mat4): Mat4;		
		/**
		Subtracts the current matrix with another one
		@param other the second operand 
		*/
		subtract(other: Mat4): Mat4;		
		/**
		Subtracts the current matrix with another one
		@param other the second operand 
		*/
		multiply(other: Mat4): Mat4;		
		/**
		Multiply each element of the matrix by a scalar.
		@param number amount to scale the matrix's elements by 
		*/
		multiplyScalar(number: number): Mat4;		
		/**
		Translate a mat4 by the given vector
		@param v vector to translate by
		@param out the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created 
		*/
		translate(v: Vec3, out?: Mat4): Mat4;		
		/**
		Scales the mat4 by the dimensions in the given vec3
		@param v vector to scale by
		@param out the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created 
		*/
		scale(v: Vec3, out?: Mat4): Mat4;		
		/**
		Rotates a mat4 by the given angle around the given axis
		@param rad the angle to rotate the matrix by
		@param axis the axis to rotate around
		@param out the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created 
		*/
		rotate(rad: number, axis: Vec3, out?: Mat4): Mat4;		
		/**
		Returns the translation vector component of a transformation matrix.
		@param out Vector to receive translation component, if not provided, a new vec3 will be created 
		*/
		getTranslation(out: Vec3): Vec3;		
		/**
		Returns the scale factor component of a transformation matrix
		@param out Vector to receive scale component, if not provided, a new vec3 will be created 
		*/
		getScale(out: Vec3): Vec3;		
		/**
		Returns the rotation factor component of a transformation matrix
		@param out Vector to receive rotation component, if not provided, a new quaternion object will be created 
		*/
		getRotation(out: Quat): Quat;		
		/**
		Restore the matrix values from a quaternion rotation, vector translation and vector scale
		@param q Rotation quaternion
		@param v Translation vector
		@param s Scaling vector 
		*/
		fromRTS(q: Quat, v: Vec3, s: Vec3): Mat4;		
		/**
		Restore the matrix values from a quaternion rotation
		@param q Rotation quaternion 
		*/
		fromQuat(q: Quat): Mat4;	
	}	
	/** !#en Representation of 2D vectors and points.
	!#zh 表示 2D 向量和坐标 */
	export class Quat extends ValueType {		
		/**
		!#en
		Constructor
		see {{#crossLink "cc/quat:method"}}cc.quat{{/crossLink}}
		!#zh
		构造函数，可查看 {{#crossLink "cc/quat:method"}}cc.quat{{/crossLink}}
		@param x x
		@param y y
		@param z z
		@param w w 
		*/
		constructor(x?: number, y?: number, z?: number, w?: number);		
		/**
		!#en Calculate the multiply result between this quaternion and another one
		!#zh 计算四元数乘积的结果
		@param other other
		@param out out 
		*/
		mul(other: Quat, out?: Quat): Quat;		
		/**
		!#zh 获得指定四元数的拷贝
		!#en Obtaining copy specified quaternion 
		*/
		static clone<Out extends IQuatLike> (a: Out);		
		/**
		!#zh 复制目标四元数
		!#en Copy quaternion target 
		*/
		static copy<Out extends IQuatLike, QuatLike extends IQuatLike> (out: Out, a: QuatLike);		
		/**
		!#zh 设置四元数值
		!#en Provided Quaternion Value 
		*/
		static set<Out extends IQuatLike> (out: Out, x: number, y: number, z: number, w: number);		
		/**
		!#zh 将目标赋值为单位四元数
		!#en The target of an assignment as a unit quaternion 
		*/
		static identity<Out extends IQuatLike> (out: Out);		
		/**
		!#zh 设置四元数为两向量间的最短路径旋转，默认两向量都已归一化
		!#en Set quaternion rotation is the shortest path between two vectors, the default two vectors are normalized 
		*/
		static rotationTo<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, a: VecLike, b: VecLike);		
		/**
		!#zh 获取四元数的旋转轴和旋转弧度
		!#en Get the rotary shaft and the arc of rotation quaternion
		@param outAxis 旋转轴输出
		@param q 源四元数 
		*/
		static getAxisAngle<Out extends IQuatLike, VecLike extends IVec3Like> (outAxis: VecLike, q: Out);		
		/**
		!#zh 四元数乘法
		!#en Quaternion multiplication 
		*/
		static multiply<Out extends IQuatLike, QuatLike_1 extends IQuatLike, QuatLike_2 extends IQuatLike> (out: Out, a: QuatLike_1, b: QuatLike_2);		
		/**
		!#zh 四元数标量乘法
		!#en Quaternion scalar multiplication 
		*/
		static multiplyScalar<Out extends IQuatLike> (out: Out, a: Out, b: number);		
		/**
		!#zh 四元数乘加：A + B * scale
		!#en Quaternion multiplication and addition: A + B * scale 
		*/
		static scaleAndAdd<Out extends IQuatLike> (out: Out, a: Out, b: Out, scale: number);		
		/**
		!#zh 绕 X 轴旋转指定四元数
		!#en About the X axis specified quaternion
		@param rad 旋转弧度 
		*/
		static rotateX<Out extends IQuatLike> (out: Out, a: Out, rad: number);		
		/**
		!#zh 绕 Y 轴旋转指定四元数
		!#en Rotation about the Y axis designated quaternion
		@param rad 旋转弧度 
		*/
		static rotateY<Out extends IQuatLike> (out: Out, a: Out, rad: number);		
		/**
		!#zh 绕 Z 轴旋转指定四元数
		!#en Around the Z axis specified quaternion
		@param rad 旋转弧度 
		*/
		static rotateZ<Out extends IQuatLike> (out: Out, a: Out, rad: number);		
		/**
		!#zh 绕世界空间下指定轴旋转四元数
		!#en Space around the world at a given axis of rotation quaternion
		@param axis 旋转轴，默认已归一化
		@param rad 旋转弧度 
		*/
		static rotateAround<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, rot: Out, axis: VecLike, rad: number);		
		/**
		!#zh 绕本地空间下指定轴旋转四元数
		!#en Local space around the specified axis rotation quaternion
		@param axis 旋转轴
		@param rad 旋转弧度 
		*/
		static rotateAroundLocal<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, rot: Out, axis: VecLike, rad: number);		
		/**
		!#zh 根据 xyz 分量计算 w 分量，默认已归一化
		!#en The component w xyz components calculated, normalized by default 
		*/
		static calculateW<Out extends IQuatLike> (out: Out, a: Out);		
		/**
		!#zh 四元数点积（数量积）
		!#en Quaternion dot product (scalar product) 
		*/
		static dot<Out extends IQuatLike> (a: Out, b: Out);		
		/**
		!#zh 逐元素线性插值： A + t * (B - A)
		!#en Element by element linear interpolation: A + t * (B - A) 
		*/
		static lerp<Out extends IQuatLike> (out: Out, a: Out, b: Out, t: number);		
		/**
		!#zh 带两个控制点的四元数球面插值
		!#en Quaternion with two spherical interpolation control points 
		*/
		static sqlerp<Out extends IQuatLike> (out: Out, a: Out, b: Out, c: Out, d: Out, t: number);		
		/**
		!#zh 四元数求逆
		!#en Quaternion inverse 
		*/
		static invert<Out extends IQuatLike, QuatLike extends IQuatLike> (out: Out, a: QuatLike);		
		/**
		!#zh 求共轭四元数，对单位四元数与求逆等价，但更高效
		!#en Conjugating a quaternion, and the unit quaternion equivalent to inversion, but more efficient 
		*/
		static conjugate<Out extends IQuatLike> (out: Out, a: Out);		
		/**
		!#zh 求四元数长度
		!#en Seek length quaternion 
		*/
		static len<Out extends IQuatLike> (a: Out);		
		/**
		!#zh 求四元数长度平方
		!#en Seeking quaternion square of the length 
		*/
		static lengthSqr<Out extends IQuatLike> (a: Out);		
		/**
		!#zh 归一化四元数
		!#en Normalized quaternions 
		*/
		static normalize<Out extends IQuatLike> (out: Out, a: Out);		
		/**
		!#zh 根据本地坐标轴朝向计算四元数，默认三向量都已归一化且相互垂直
		!#en Calculated according to the local orientation quaternion coordinate axis, the default three vectors are normalized and mutually perpendicular 
		*/
		static fromAxes<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, xAxis: VecLike, yAxis: VecLike, zAxis: VecLike);		
		/**
		!#zh 根据视口的前方向和上方向计算四元数
		!#en The forward direction and the direction of the viewport computing quaternion
		@param view 视口面向的前方向，必须归一化
		@param up 视口的上方向，必须归一化，默认为 (0, 1, 0) 
		*/
		static fromViewUp<Out extends IQuatLike> (out: Out, view: Vec3, up?: Vec3);		
		/**
		!#zh 根据旋转轴和旋转弧度计算四元数
		!#en The quaternion calculated and the arc of rotation of the rotary shaft 
		*/
		static fromAxisAngle<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, axis: VecLike, rad: number);		
		/**
		!#zh 根据三维矩阵信息计算四元数，默认输入矩阵不含有缩放信息
		!#en Calculating the three-dimensional quaternion matrix information, default zoom information input matrix does not contain 
		*/
		static fromMat3<Out extends IQuatLike> (out: Out, mat: Mat3);		
		/**
		!#zh 根据欧拉角信息计算四元数，旋转顺序为 YZX
		!#en The quaternion calculated Euler angle information, rotation order YZX 
		*/
		static fromEuler<Out extends IQuatLike> (out: Out, x: number, y: number, z: number);		
		/**
		!#zh 返回定义此四元数的坐标系 X 轴向量
		!#en This returns the result of the quaternion coordinate system X-axis vector 
		*/
		static toAxisX<Out extends IQuatLike, VecLike extends IVec3Like> (out: VecLike, q: Out);		
		/**
		!#zh 返回定义此四元数的坐标系 Y 轴向量
		!#en This returns the result of the quaternion coordinate system Y axis vector 
		*/
		static toAxisY<Out extends IQuatLike, VecLike extends IVec3Like> (out: VecLike, q: Out);		
		/**
		!#zh 返回定义此四元数的坐标系 Z 轴向量
		!#en This returns the result of the quaternion coordinate system the Z-axis vector 
		*/
		static toAxisZ<Out extends IQuatLike, VecLike extends IVec3Like> (out: VecLike, q: Out);		
		/**
		!#zh 根据四元数计算欧拉角，返回角度 x, y 在 [-180, 180] 区间内, z 默认在 [-90, 90] 区间内，旋转顺序为 YZX
		!#en The quaternion calculated Euler angles, return angle x, y in the [-180, 180] interval, z default the range [-90, 90] interval, the rotation order YZX
		@param outerZ z 取值范围区间改为 [-180, -90] U [90, 180] 
		*/
		static toEuler<Out extends IVec3Like> (out: Out, q: IQuatLike, outerZ?: boolean);		
		/**
		!#zh 四元数等价判断
		!#en Analyzing quaternion equivalent 
		*/
		static strictEquals<Out extends IQuatLike> (a: Out, b: Out);		
		/**
		!#zh 排除浮点数误差的四元数近似等价判断
		!#en Negative floating point error quaternion approximately equivalent Analyzing 
		*/
		static equals<Out extends IQuatLike> (a: Out, b: Out, epsilon = EPSILON);		
		/**
		!#zh 四元数转数组
		!#en Quaternion rotation array
		@param ofs 数组内的起始偏移量 
		*/
		static toArray <Out extends IWritableArrayLike<number>> (out: Out, q: IQuatLike, ofs = 0);		
		/**
		!#zh 数组转四元数
		!#en Array to a quaternion
		@param ofs 数组起始偏移量 
		*/
		static fromArray <Out extends IQuatLike> (out: Out, arr: IWritableArrayLike<number>, ofs = 0);		
		x: number;		
		y: number;		
		z: number;		
		w: number;		
		/**
		!#en clone a Quat object and return the new object
		!#zh 克隆一个四元数并返回 
		*/
		clone(): Quat;		
		/**
		!#en Set values with another quaternion
		!#zh 用另一个四元数的值设置到当前对象上。
		@param newValue !#en new value to set. !#zh 要设置的新值 
		*/
		set(newValue: Quat): Quat;		
		/**
		!#en Check whether current quaternion equals another
		!#zh 当前的四元数是否与指定的四元数相等。
		@param other other 
		*/
		equals(other: Quat): boolean;		
		/**
		!#en Convert quaternion to euler
		!#zh 转换四元数到欧拉角
		@param out out 
		*/
		toEuler(out: Vec3): Vec3;		
		/**
		!#en Convert euler to quaternion
		!#zh 转换欧拉角到四元数
		@param euler euler 
		*/
		fromEuler(euler: Vec3): Quat;		
		/**
		!#en Calculate the interpolation result between this quaternion and another one with given ratio
		!#zh 计算四元数的插值结果
		@param to to
		@param ratio ratio
		@param out out 
		*/
		lerp(to: Quat, ratio: number, out?: Quat): Quat;		
		/**
		!#en Calculate the multiply result between this quaternion and another one
		!#zh 计算四元数乘积的结果
		@param other other 
		*/
		multiply(other: Quat): Quat;		
		/**
		!#en Rotates a quaternion by the given angle (in radians) about a world space axis.
		!#zh 围绕世界空间轴按给定弧度旋转四元数
		@param rot Quaternion to rotate
		@param axis The axis around which to rotate in world space
		@param rad Angle (in radians) to rotate
		@param out Quaternion to store result 
		*/
		rotateAround(rot: Quat, axis: Vec3, rad: number, out?: Quat): Quat;	
	}	
	/** !#en A 2D rectangle defined by x, y position and width, height.
	!#zh 通过位置和宽高定义的 2D 矩形。 */
	export class Rect extends ValueType {		
		/**
		!#en
		Constructor of Rect class.
		see {{#crossLink "cc/rect:method"}} cc.rect {{/crossLink}} for convenience method.
		!#zh
		Rect类的构造函数。可以通过 {{#crossLink "cc/rect:method"}} cc.rect {{/crossLink}} 简便方法进行创建。
		@param x x
		@param y y
		@param w w
		@param h h 
		*/
		constructor(x?: number, y?: number, w?: number, h?: number);		
		/**
		!#en Creates a rectangle from two coordinate values.
		!#zh 根据指定 2 个坐标创建出一个矩形区域。
		@param v1 v1
		@param v2 v2
		
		@example 
		```js
		cc.Rect.fromMinMax(cc.v2(10, 10), cc.v2(20, 20)); // Rect {x: 10, y: 10, width: 10, height: 10};
		``` 
		*/
		static fromMinMax(v1: Vec2, v2: Vec2): Rect;		
		x: number;		
		y: number;		
		width: number;		
		height: number;		
		/**
		!#en TODO
		!#zh 克隆一个新的 Rect。
		
		@example 
		```js
		var a = new cc.Rect(0, 0, 10, 10);
		a.clone();// Rect {x: 0, y: 0, width: 10, height: 10}
		``` 
		*/
		clone(): Rect;		
		/**
		!#en TODO
		!#zh 是否等于指定的矩形。
		@param other other
		
		@example 
		```js
		var a = new cc.Rect(0, 0, 10, 10);
		var b = new cc.Rect(0, 0, 10, 10);
		a.equals(b);// true;
		``` 
		*/
		equals(other: Rect): boolean;		
		/**
		!#en TODO
		!#zh 线性插值
		@param to to
		@param ratio the interpolation coefficient.
		@param out optional, the receiving vector.
		
		@example 
		```js
		var a = new cc.Rect(0, 0, 10, 10);
		var b = new cc.Rect(50, 50, 100, 100);
		update (dt) {
		   // method 1;
		   var c = a.lerp(b, dt * 0.1);
		   // method 2;
		   a.lerp(b, dt * 0.1, c);
		}
		``` 
		*/
		lerp(to: Rect, ratio: number, out?: Rect): Rect;		
		/**
		!#en Check whether the current rectangle intersects with the given one
		!#zh 当前矩形与指定矩形是否相交。
		@param rect rect
		
		@example 
		```js
		var a = new cc.Rect(0, 0, 10, 10);
		var b = new cc.Rect(0, 0, 20, 20);
		a.intersects(b);// true
		``` 
		*/
		intersects(rect: Rect): boolean;		
		/**
		!#en Returns the overlapping portion of 2 rectangles.
		!#zh 返回 2 个矩形重叠的部分。
		@param out Stores the result
		@param rectB rectB
		
		@example 
		```js
		var a = new cc.Rect(0, 10, 20, 20);
		var b = new cc.Rect(0, 10, 10, 10);
		var intersection = new cc.Rect();
		a.intersection(intersection, b); // intersection {x: 0, y: 10, width: 10, height: 10};
		``` 
		*/
		intersection(out: Rect, rectB: Rect): Rect;		
		/**
		!#en Check whether the current rect contains the given point
		!#zh 当前矩形是否包含指定坐标点。
		Returns true if the point inside this rectangle.
		@param point point
		
		@example 
		```js
		var a = new cc.Rect(0, 0, 10, 10);
		var b = new cc.Vec2(0, 5);
		a.contains(b);// true
		``` 
		*/
		contains(point: Vec2): boolean;		
		/**
		!#en Returns true if the other rect totally inside this rectangle.
		!#zh 当前矩形是否包含指定矩形。
		@param rect rect
		
		@example 
		```js
		var a = new cc.Rect(0, 0, 20, 20);
		var b = new cc.Rect(0, 0, 10, 10);
		a.containsRect(b);// true
		``` 
		*/
		containsRect(rect: Rect): boolean;		
		/**
		!#en Returns the smallest rectangle that contains the current rect and the given rect.
		!#zh 返回一个包含当前矩形和指定矩形的最小矩形。
		@param out Stores the result
		@param rectB rectB
		
		@example 
		```js
		var a = new cc.Rect(0, 10, 20, 20);
		var b = new cc.Rect(0, 10, 10, 10);
		var union = new cc.Rect();
		a.union(union, b); // union {x: 0, y: 10, width: 20, height: 20};
		``` 
		*/
		union(out: Rect, rectB: Rect): Rect;		
		/**
		!#en Apply matrix4 to the rect.
		!#zh 使用 mat4 对矩形进行矩阵转换。
		@param out The output rect
		@param mat The matrix4 
		*/
		transformMat4(out: Rect, mat: Mat4): void;		
		/**
		!#en Output rect informations to string
		!#zh 转换为方便阅读的字符串
		
		@example 
		```js
		var a = new cc.Rect(0, 0, 10, 10);
		a.toString();// "(0.00, 0.00, 10.00, 10.00)";
		``` 
		*/
		toString(): string;		
		/** !#en The minimum x value, equals to rect.x
		!#zh 矩形 x 轴上的最小值，等价于 rect.x。 */
		xMin: number;		
		/** !#en The minimum y value, equals to rect.y
		!#zh 矩形 y 轴上的最小值。 */
		yMin: number;		
		/** !#en The maximum x value.
		!#zh 矩形 x 轴上的最大值。 */
		xMax: number;		
		/** !#en The maximum y value.
		!#zh 矩形 y 轴上的最大值。 */
		yMax: number;		
		/** !#en The position of the center of the rectangle.
		!#zh 矩形的中心点。 */
		center: Vec2;		
		/** !#en The X and Y position of the rectangle.
		!#zh 矩形的 x 和 y 坐标。 */
		origin: Vec2;		
		/** !#en Width and height of the rectangle.
		!#zh 矩形的大小。 */
		size: Size;	
	}	
	/** !#en
	cc.Size is the class for size object,<br/>
	please do not use its constructor to create sizes,<br/>
	use {{#crossLink "cc/size:method"}}{{/crossLink}} alias function instead.<br/>
	It will be deprecated soon, please use cc.Vec2 instead.
	
	!#zh
	cc.Size 是 size 对象的类。<br/>
	请不要使用它的构造函数创建的 size，<br/>
	使用 {{#crossLink "cc/size:method"}}{{/crossLink}} 别名函数。<br/>
	它不久将被取消，请使用cc.Vec2代替。 */
	export class Size {		
		/**
		
		@param width width
		@param height height 
		*/
		constructor(width: number|Size, height?: number);		
		/** !#en return a Size object with width = 0 and height = 0.
		!#zh 返回一个宽度为 0 和高度为 0 的 Size 对象。 */
		static ZERO: Size;		
		width: number;		
		height: number;		
		/**
		!#en TODO
		!#zh 克隆 size 对象。
		
		@example 
		```js
		var a = new cc.size(10, 10);
		a.clone();// return Size {width: 0, height: 0};
		``` 
		*/
		clone(): Size;		
		/**
		!#en TODO
		!#zh 当前 Size 对象是否等于指定 Size 对象。
		@param other other
		
		@example 
		```js
		var a = new cc.size(10, 10);
		a.equals(new cc.size(10, 10));// return true;
		``` 
		*/
		equals(other: Size): boolean;		
		/**
		!#en TODO
		!#zh 线性插值。
		@param to to
		@param ratio the interpolation coefficient.
		@param out optional, the receiving vector.
		
		@example 
		```js
		var a = new cc.size(10, 10);
		var b = new cc.rect(50, 50, 100, 100);
		update (dt) {
		   // method 1;
		   var c = a.lerp(b, dt * 0.1);
		   // method 2;
		   a.lerp(b, dt * 0.1, c);
		}
		``` 
		*/
		lerp(to: Rect, ratio: number, out?: Size): Size;		
		/**
		!#en TODO
		!#zh 转换为方便阅读的字符串。
		
		@example 
		```js
		var a = new cc.size(10, 10);
		a.toString();// return "(10.00, 10.00)";
		``` 
		*/
		toString(): string;	
	}	
	/** !#en The base class of all value types.
	!#zh 所有值类型的基类。 */
	export class ValueType {		
		/**
		!#en This method returns an exact copy of current value.
		!#zh 克隆当前值，该方法返回一个新对象，新对象的值和原对象相等。 
		*/
		clone(): ValueType;		
		/**
		!#en Compares this object with the other one.
		!#zh 当前对象是否等于指定对象。
		@param other other 
		*/
		equals(other: ValueType): boolean;		
		/**
		!#en
		Linearly interpolates between this value to to value by ratio which is in the range [0, 1].
		When ratio = 0 returns this. When ratio = 1 return to. When ratio = 0.5 returns the average of this and to.
		!#zh
		线性插值。<br/>
		当 ratio = 0 时返回自身，ratio = 1 时返回目标，ratio = 0.5 返回自身和目标的平均值。。
		@param to the to value
		@param ratio the interpolation coefficient 
		*/
		lerp(to: ValueType, ratio: number): ValueType;		
		/**
		!#en
		Copys all the properties from another given object to this value.
		!#zh
		从其它对象把所有属性复制到当前对象。
		@param source the source to copy 
		*/
		set(source: ValueType): void;		
		/**
		!#en Convert to a readable string.
		!#zh 转换为方便阅读的字符串。 
		*/
		toString(): string;	
	}	
	/** !#en Representation of 2D vectors and points.
	!#zh 表示 2D 向量和坐标 */
	export class Vec2 extends ValueType {		
		/**
		!#en Returns the length of this vector.
		!#zh 返回该向量的长度。
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.mag(); // return 14.142135623730951;
		``` 
		*/
		mag(): number;		
		/**
		!#en Returns the squared length of this vector.
		!#zh 返回该向量的长度平方。
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.magSqr(); // return 200;
		``` 
		*/
		magSqr(): number;		
		/**
		!#en Subtracts one vector from this. If you want to save result to another vector, use sub() instead.
		!#zh 向量减法。如果你想保存结果到另一个向量，可使用 sub() 代替。
		@param vector vector
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.subSelf(cc.v2(5, 5));// return Vec2 {x: 5, y: 5};
		``` 
		*/
		subSelf(vector: Vec2): Vec2;		
		/**
		!#en Subtracts one vector from this, and returns the new result.
		!#zh 向量减法，并返回新结果。
		@param vector vector
		@param out optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.sub(cc.v2(5, 5));      // return Vec2 {x: 5, y: 5};
		var v1;
		v.sub(cc.v2(5, 5), v1);  // return Vec2 {x: 5, y: 5};
		``` 
		*/
		sub(vector: Vec2, out?: Vec2): Vec2;		
		/**
		!#en Multiplies this by a number. If you want to save result to another vector, use mul() instead.
		!#zh 缩放当前向量。如果你想结果保存到另一个向量，可使用 mul() 代替。
		@param num num
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.mulSelf(5);// return Vec2 {x: 50, y: 50};
		``` 
		*/
		mulSelf(num: number): Vec2;		
		/**
		!#en Multiplies by a number, and returns the new result.
		!#zh 缩放向量，并返回新结果。
		@param num num
		@param out optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.mul(5);      // return Vec2 {x: 50, y: 50};
		var v1;
		v.mul(5, v1);  // return Vec2 {x: 50, y: 50};
		``` 
		*/
		mul(num: number, out?: Vec2): Vec2;		
		/**
		!#en Divides by a number. If you want to save result to another vector, use div() instead.
		!#zh 向量除法。如果你想结果保存到另一个向量，可使用 div() 代替。
		@param num num
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.divSelf(5); // return Vec2 {x: 2, y: 2};
		``` 
		*/
		divSelf(num: number): Vec2;		
		/**
		!#en Divides by a number, and returns the new result.
		!#zh 向量除法，并返回新的结果。
		@param num num
		@param out optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.div(5);      // return Vec2 {x: 2, y: 2};
		var v1;
		v.div(5, v1);  // return Vec2 {x: 2, y: 2};
		``` 
		*/
		div(num: number, out?: Vec2): Vec2;		
		/**
		!#en Multiplies two vectors.
		!#zh 分量相乘。
		@param vector vector
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.scaleSelf(cc.v2(5, 5));// return Vec2 {x: 50, y: 50};
		``` 
		*/
		scaleSelf(vector: Vec2): Vec2;		
		/**
		!#en Multiplies two vectors, and returns the new result.
		!#zh 分量相乘，并返回新的结果。
		@param vector vector
		@param out optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.scale(cc.v2(5, 5));      // return Vec2 {x: 50, y: 50};
		var v1;
		v.scale(cc.v2(5, 5), v1);  // return Vec2 {x: 50, y: 50};
		``` 
		*/
		scale(vector: Vec2, out?: Vec2): Vec2;		
		/**
		!#en Negates the components. If you want to save result to another vector, use neg() instead.
		!#zh 向量取反。如果你想结果保存到另一个向量，可使用 neg() 代替。
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.negSelf(); // return Vec2 {x: -10, y: -10};
		``` 
		*/
		negSelf(): Vec2;		
		/**
		!#en Negates the components, and returns the new result.
		!#zh 返回取反后的新向量。
		@param out optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created
		
		@example 
		```js
		var v = cc.v2(10, 10);
		var v1;
		v.neg(v1);  // return Vec2 {x: -10, y: -10};
		``` 
		*/
		neg(out?: Vec2): Vec2;		
		/** !#en return a Vec2 object with x = 1 and y = 1.
		!#zh 新 Vec2 对象。 */
		static ONE: Vec2;		
		/** !#en return a Vec2 object with x = 0 and y = 0.
		!#zh 返回 x = 0 和 y = 0 的 Vec2 对象。 */
		static ZERO: Vec2;		
		/** !#en return a readonly Vec2 object with x = 0 and y = 0.
		!#zh 返回一个 x = 0 和 y = 0 的 Vec2 只读对象。 */
		static ZERO_R: Vec2;		
		/** !#en return a Vec2 object with x = 0 and y = 1.
		!#zh 返回 x = 0 和 y = 1 的 Vec2 对象。 */
		static UP: Vec2;		
		/** !#en return a readonly Vec2 object with x = 0 and y = 1.
		!#zh 返回 x = 0 和 y = 1 的 Vec2 只读对象。 */
		static UP_R: Vec2;		
		/** !#en return a readonly Vec2 object with x = 1 and y = 0.
		!#zh 返回 x = 1 和 y = 0 的 Vec2 只读对象。 */
		static RIGHT: Vec2;		
		/** !#en return a Vec2 object with x = 1 and y = 0.
		!#zh 返回 x = 1 和 y = 0 的 Vec2 对象。 */
		static RIGHT_R: Vec2;		
		/**
		!#zh 获得指定向量的拷贝 
		*/
		static clone <Out extends IVec2Like> (a: Out);		
		/**
		!#zh 复制指定向量的值 
		*/
		static copy <Out extends IVec2Like> (out: Out, a: Out);		
		/**
		!#zh  设置向量值 
		*/
		static set <Out extends IVec2Like> (out: Out, x: number, y: number);		
		/**
		!#zh 逐元素向量加法 
		*/
		static add <Out extends IVec2Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 逐元素向量减法 
		*/
		static subtract <Out extends IVec2Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 逐元素向量乘法 
		*/
		static multiply <Out extends IVec2Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 逐元素向量除法 
		*/
		static divide <Out extends IVec2Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 逐元素向量向上取整 
		*/
		static ceil <Out extends IVec2Like> (out: Out, a: Out);		
		/**
		!#zh 逐元素向量向下取整 
		*/
		static floor <Out extends IVec2Like> (out: Out, a: Out);		
		/**
		!#zh 逐元素向量最小值 
		*/
		static min <Out extends IVec2Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 逐元素向量最大值 
		*/
		static max <Out extends IVec2Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 逐元素向量四舍五入取整 
		*/
		static round <Out extends IVec2Like> (out: Out, a: Out);		
		/**
		!#zh 向量标量乘法 
		*/
		static multiplyScalar <Out extends IVec2Like> (out: Out, a: Out, b: number);		
		/**
		!#zh 逐元素向量乘加: A + B * scale 
		*/
		static scaleAndAdd <Out extends IVec2Like> (out: Out, a: Out, b: Out, scale: number);		
		/**
		!#zh 求两向量的欧氏距离 
		*/
		static distance <Out extends IVec2Like> (a: Out, b: Out);		
		/**
		!#zh 求两向量的欧氏距离平方 
		*/
		static squaredDistance <Out extends IVec2Like> (a: Out, b: Out);		
		/**
		!#zh 求向量长度 
		*/
		static len <Out extends IVec2Like> (a: Out);		
		/**
		!#zh 求向量长度平方 
		*/
		static lengthSqr <Out extends IVec2Like> (a: Out);		
		/**
		!#zh 逐元素向量取负 
		*/
		static negate <Out extends IVec2Like> (out: Out, a: Out);		
		/**
		!#zh 逐元素向量取倒数，接近 0 时返回 Infinity 
		*/
		static inverse <Out extends IVec2Like> (out: Out, a: Out);		
		/**
		!#zh 逐元素向量取倒数，接近 0 时返回 0 
		*/
		static inverseSafe <Out extends IVec2Like> (out: Out, a: Out);		
		/**
		!#zh 归一化向量 
		*/
		static normalize <Out extends IVec2Like, Vec2Like extends IVec2Like> (out: Out, a: Vec2Like);		
		/**
		!#zh 向量点积（数量积） 
		*/
		static dot <Out extends IVec2Like> (a: Out, b: Out);		
		/**
		!#zh 向量叉积（向量积），注意二维向量的叉积为与 Z 轴平行的三维向量 
		*/
		static cross <Out extends IVec2Like> (out: Vec2, a: Out, b: Out);		
		/**
		!#zh 逐元素向量线性插值： A + t * (B - A) 
		*/
		static lerp <Out extends IVec2Like> (out: Out, a: Out, b: Out, t: number);		
		/**
		!#zh 生成一个在单位圆上均匀分布的随机向量 
		*/
		static random <Out extends IVec2Like> (out: Out, scale?: number);		
		/**
		!#zh 向量与三维矩阵乘法，默认向量第三位为 1。 
		*/
		static transformMat3 <Out extends IVec2Like, MatLike extends IMat3Like> (out: Out, a: Out, mat: IMat3Like);		
		/**
		!#zh 向量与四维矩阵乘法，默认向量第三位为 0，第四位为 1。 
		*/
		static transformMat4 <Out extends IVec2Like, MatLike extends IMat4Like> (out: Out, a: Out, mat: MatLike);		
		/**
		!#zh 向量等价判断 
		*/
		static strictEquals <Out extends IVec2Like> (a: Out, b: Out);		
		/**
		!#zh 排除浮点数误差的向量近似等价判断 
		*/
		static equals <Out extends IVec2Like> (a: Out, b: Out,  epsilon = EPSILON);		
		/**
		!#zh 排除浮点数误差的向量近似等价判断 
		*/
		static angle <Out extends IVec2Like> (a: Out, b: Out);		
		/**
		!#zh 向量转数组 
		*/
		static toArray <Out extends IWritableArrayLike<number>> (out: Out, v: IVec2Like, ofs = 0);		
		/**
		!#zh 数组转向量 
		*/
		static fromArray <Out extends IVec2Like> (out: Out, arr: IWritableArrayLike<number>, ofs = 0);		
		x: number;		
		y: number;		
		/**
		!#en
		Constructor
		see {{#crossLink "cc/vec2:method"}}cc.v2{{/crossLink}} or {{#crossLink "cc/p:method"}}cc.p{{/crossLink}}
		!#zh
		构造函数，可查看 {{#crossLink "cc/vec2:method"}}cc.v2{{/crossLink}} 或者 {{#crossLink "cc/p:method"}}cc.p{{/crossLink}}
		@param x x
		@param y y 
		*/
		constructor(x?: number, y?: number);		
		/**
		!#en clone a Vec2 object
		!#zh 克隆一个 Vec2 对象 
		*/
		clone(): Vec2;		
		/**
		!#en Sets vector with another's value
		!#zh 设置向量值。
		@param newValue !#en new value to set. !#zh 要设置的新值 
		*/
		set(newValue: Vec2): Vec2;		
		/**
		!#en Check whether two vector equal
		!#zh 当前的向量是否与指定的向量相等。
		@param other other 
		*/
		equals(other: Vec2): boolean;		
		/**
		!#en Check whether two vector equal with some degree of variance.
		!#zh
		近似判断两个点是否相等。<br/>
		判断 2 个向量是否在指定数值的范围之内，如果在则返回 true，反之则返回 false。
		@param other other
		@param variance variance 
		*/
		fuzzyEquals(other: Vec2, variance: number): boolean;		
		/**
		!#en Transform to string with vector informations
		!#zh 转换为方便阅读的字符串。 
		*/
		toString(): string;		
		/**
		!#en Calculate linear interpolation result between this vector and another one with given ratio
		!#zh 线性插值。
		@param to to
		@param ratio the interpolation coefficient
		@param out optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created 
		*/
		lerp(to: Vec2, ratio: number, out?: Vec2): Vec2;		
		/**
		!#en Clamp the vector between from float and to float.
		!#zh
		返回指定限制区域后的向量。<br/>
		向量大于 max_inclusive 则返回 max_inclusive。<br/>
		向量小于 min_inclusive 则返回 min_inclusive。<br/>
		否则返回自身。
		@param min_inclusive min_inclusive
		@param max_inclusive max_inclusive
		
		@example 
		```js
		var min_inclusive = cc.v2(0, 0);
		var max_inclusive = cc.v2(20, 20);
		var v1 = cc.v2(20, 20).clampf(min_inclusive, max_inclusive); // Vec2 {x: 20, y: 20};
		var v2 = cc.v2(0, 0).clampf(min_inclusive, max_inclusive);   // Vec2 {x: 0, y: 0};
		var v3 = cc.v2(10, 10).clampf(min_inclusive, max_inclusive); // Vec2 {x: 10, y: 10};
		``` 
		*/
		clampf(min_inclusive: Vec2, max_inclusive: Vec2): Vec2;		
		/**
		!#en Adds this vector.
		!#zh 向量加法。
		@param vector vector
		@param out out
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.add(cc.v2(5, 5));// return Vec2 {x: 15, y: 15};
		``` 
		*/
		add(vector: Vec2, out?: Vec2): Vec2;		
		/**
		!#en Adds this vector. If you want to save result to another vector, use add() instead.
		!#zh 向量加法。如果你想保存结果到另一个向量，使用 add() 代替。
		@param vector vector 
		*/
		addSelf(vector: Vec2): Vec2;		
		/**
		!#en Subtracts one vector from this.
		!#zh 向量减法。
		@param vector vector
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.subSelf(cc.v2(5, 5));// return Vec2 {x: 5, y: 5};
		``` 
		*/
		subtract(vector: Vec2): Vec2;		
		/**
		!#en Multiplies this by a number.
		!#zh 缩放当前向量。
		@param num num
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.multiply(5);// return Vec2 {x: 50, y: 50};
		``` 
		*/
		multiplyScalar(num: number): Vec2;		
		/**
		!#en Multiplies two vectors.
		!#zh 分量相乘。
		@param vector vector
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.multiply(cc.v2(5, 5));// return Vec2 {x: 50, y: 50};
		``` 
		*/
		multiply(vector: Vec2): Vec2;		
		/**
		!#en Divides by a number.
		!#zh 向量除法。
		@param num num
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.divide(5); // return Vec2 {x: 2, y: 2};
		``` 
		*/
		divide(num: number): Vec2;		
		/**
		!#en Negates the components.
		!#zh 向量取反。
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.negate(); // return Vec2 {x: -10, y: -10};
		``` 
		*/
		negate(): Vec2;		
		/**
		!#en Dot product
		!#zh 当前向量与指定向量进行点乘。
		@param vector vector
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.dot(cc.v2(5, 5)); // return 100;
		``` 
		*/
		dot(vector?: Vec2): number;		
		/**
		!#en Cross product
		!#zh 当前向量与指定向量进行叉乘。
		@param vector vector
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.cross(cc.v2(5, 5)); // return 0;
		``` 
		*/
		cross(vector?: Vec2): number;		
		/**
		!#en Returns the length of this vector.
		!#zh 返回该向量的长度。
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.len(); // return 14.142135623730951;
		``` 
		*/
		len(): number;		
		/**
		!#en Returns the squared length of this vector.
		!#zh 返回该向量的长度平方。
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.lengthSqr(); // return 200;
		``` 
		*/
		lengthSqr(): number;		
		/**
		!#en Make the length of this vector to 1.
		!#zh 向量归一化，让这个向量的长度为 1。
		
		@example 
		```js
		var v = cc.v2(10, 10);
		v.normalizeSelf(); // return Vec2 {x: 0.7071067811865475, y: 0.7071067811865475};
		``` 
		*/
		normalizeSelf(): Vec2;		
		/**
		!#en
		Returns this vector with a magnitude of 1.<br/>
		<br/>
		Note that the current vector is unchanged and a new normalized vector is returned. If you want to normalize the current vector, use normalizeSelf function.
		!#zh
		返回归一化后的向量。<br/>
		<br/>
		注意，当前向量不变，并返回一个新的归一化向量。如果你想来归一化当前向量，可使用 normalizeSelf 函数。
		@param out optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created 
		*/
		normalize(out?: Vec2): Vec2;		
		/**
		!#en Get angle in radian between this and vector.
		!#zh 夹角的弧度。
		@param vector vector 
		*/
		angle(vector: Vec2): number;		
		/**
		!#en Get angle in radian between this and vector with direction.
		!#zh 带方向的夹角的弧度。
		@param vector vector 
		*/
		signAngle(vector: Vec2): number;		
		/**
		!#en rotate
		!#zh 返回旋转给定弧度后的新向量。
		@param radians radians
		@param out optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created 
		*/
		rotate(radians: number, out?: Vec2): Vec2;		
		/**
		!#en rotate self
		!#zh 按指定弧度旋转向量。
		@param radians radians 
		*/
		rotateSelf(radians: number): Vec2;		
		/**
		!#en Calculates the projection of the current vector over the given vector.
		!#zh 返回当前向量在指定 vector 向量上的投影向量。
		@param vector vector
		
		@example 
		```js
		var v1 = cc.v2(20, 20);
		var v2 = cc.v2(5, 5);
		v1.project(v2); // Vec2 {x: 20, y: 20};
		``` 
		*/
		project(vector: Vec2): Vec2;		
		/**
		Transforms the vec2 with a mat4. 3rd vector component is implicitly '0', 4th vector component is implicitly '1'
		@param m matrix to transform with
		@param out the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created 
		*/
		transformMat4(m: Mat4, out?: Vec2): Vec2;		
		/**
		Returns the maximum value in x, y. 
		*/
		maxAxis(): number;	
	}	
	/** !#en Representation of 3D vectors and points.
	!#zh 表示 3D 向量和坐标 */
	export class Vec3 extends ValueType {		
		/**
		!#en Returns the length of this vector.
		!#zh 返回该向量的长度。
		
		@example 
		```js
		var v = cc.v3(10, 10, 10);
		v.mag(); // return 17.320508075688775;
		``` 
		*/
		mag(): number;		
		/**
		!#en Returns the squared length of this vector.
		!#zh 返回该向量的长度平方。 
		*/
		magSqr(): number;		
		/**
		!#en Subtracts one vector from this. If you want to save result to another vector, use sub() instead.
		!#zh 向量减法。如果你想保存结果到另一个向量，可使用 sub() 代替。
		@param vector vector 
		*/
		subSelf(vector: Vec3): Vec3;		
		/**
		!#en Subtracts one vector from this, and returns the new result.
		!#zh 向量减法，并返回新结果。
		@param vector vector
		@param out optional, the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created 
		*/
		sub(vector: Vec3, out?: Vec3): Vec3;		
		/**
		!#en Multiplies this by a number. If you want to save result to another vector, use mul() instead.
		!#zh 缩放当前向量。如果你想结果保存到另一个向量，可使用 mul() 代替。
		@param num num 
		*/
		mulSelf(num: number): Vec3;		
		/**
		!#en Multiplies by a number, and returns the new result.
		!#zh 缩放向量，并返回新结果。
		@param num num
		@param out optional, the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created 
		*/
		mul(num: number, out?: Vec3): Vec3;		
		/**
		!#en Divides by a number. If you want to save result to another vector, use div() instead.
		!#zh 向量除法。如果你想结果保存到另一个向量，可使用 div() 代替。
		@param num num 
		*/
		divSelf(num: number): Vec3;		
		/**
		!#en Divides by a number, and returns the new result.
		!#zh 向量除法，并返回新的结果。
		@param num num
		@param out optional, the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created 
		*/
		div(num: number, out?: Vec3): Vec3;		
		/**
		!#en Multiplies two vectors.
		!#zh 分量相乘。
		@param vector vector 
		*/
		scaleSelf(vector: Vec3): Vec3;		
		/**
		!#en Multiplies two vectors, and returns the new result.
		!#zh 分量相乘，并返回新的结果。
		@param vector vector
		@param out optional, the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created 
		*/
		scale(vector: Vec3, out?: Vec3): Vec3;		
		/**
		!#en Negates the components. If you want to save result to another vector, use neg() instead.
		!#zh 向量取反。如果你想结果保存到另一个向量，可使用 neg() 代替。 
		*/
		negSelf(): Vec3;		
		/**
		!#en Negates the components, and returns the new result.
		!#zh 返回取反后的新向量。
		@param out optional, the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created 
		*/
		neg(out?: Vec3): Vec3;		
		/** !#en return a Vec3 object with x = 1, y = 1, z = 1.
		!#zh 新 Vec3 对象。 */
		static ONE: Vec3;		
		/** !#en return a Vec3 object with x = 0, y = 0, z = 0.
		!#zh 返回 x = 0，y = 0，z = 0 的 Vec3 对象。 */
		static ZERO: Vec3;		
		/** !#en return a Vec3 object with x = 0, y = 1, z = 0.
		!#zh 返回 x = 0, y = 1, z = 0 的 Vec3 对象。 */
		static UP: Vec3;		
		/** !#en return a Vec3 object with x = 1, y = 0, z = 0.
		!#zh 返回 x = 1，y = 0，z = 0 的 Vec3 对象。 */
		static RIGHT: Vec3;		
		/** !#en return a Vec3 object with x = 0, y = 0, z = 1.
		!#zh 返回 x = 0，y = 0，z = 1 的 Vec3 对象。 */
		static FORWARD: Vec3;		
		/**
		!#zh 将目标赋值为零向量
		!#en The target of an assignment zero vector 
		*/
		static zero<Out extends IVec3Like> (out: Out);		
		/**
		!#zh 获得指定向量的拷贝
		!#en Obtaining copy vectors designated 
		*/
		static clone<Out extends IVec3Like> (a: Out);		
		/**
		!#zh 复制目标向量
		!#en Copy the target vector 
		*/
		static copy<Out extends IVec3Like, Vec3Like extends IVec3Like> (out: Out, a: Vec3Like);		
		/**
		!#zh 设置向量值
		!#en Set to value 
		*/
		static set<Out extends IVec3Like> (out: Out, x: number, y: number, z: number);		
		/**
		!#zh 逐元素向量加法
		!#en Element-wise vector addition 
		*/
		static add<Out extends IVec3Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 逐元素向量减法
		!#en Element-wise vector subtraction 
		*/
		static subtract<Out extends IVec3Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 逐元素向量乘法 (分量积)
		!#en Element-wise vector multiplication (product component) 
		*/
		static multiply<Out extends IVec3Like, Vec3Like_1 extends IVec3Like, Vec3Like_2 extends IVec3Like> (out: Out, a: Vec3Like_1, b: Vec3Like_2);		
		/**
		!#zh 逐元素向量除法
		!#en Element-wise vector division 
		*/
		static divide<Out extends IVec3Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 逐元素向量向上取整
		!#en Rounding up by elements of the vector 
		*/
		static ceil<Out extends IVec3Like> (out: Out, a: Out);		
		/**
		!#zh 逐元素向量向下取整
		!#en Element vector by rounding down 
		*/
		static floor<Out extends IVec3Like> (out: Out, a: Out);		
		/**
		!#zh 逐元素向量最小值
		!#en The minimum by-element vector 
		*/
		static min<Out extends IVec3Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 逐元素向量最大值
		!#en The maximum value of the element-wise vector 
		*/
		static max<Out extends IVec3Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 逐元素向量四舍五入取整
		!#en Element-wise vector of rounding to whole 
		*/
		static round<Out extends IVec3Like> (out: Out, a: Out);		
		/**
		!#zh 向量标量乘法
		!#en Vector scalar multiplication 
		*/
		static multiplyScalar<Out extends IVec3Like, Vec3Like extends IVec3Like> (out: Out, a: Vec3Like, b: number);		
		/**
		!#zh 逐元素向量乘加: A + B * scale
		!#en Element-wise vector multiply add: A + B * scale 
		*/
		static scaleAndAdd<Out extends IVec3Like> (out: Out, a: Out, b: Out, scale: number);		
		/**
		!#zh 求两向量的欧氏距离
		!#en Seeking two vectors Euclidean distance 
		*/
		static distance<Out extends IVec3Like> (a: Out, b: Out);		
		/**
		!#zh 求两向量的欧氏距离平方
		!#en Euclidean distance squared seeking two vectors 
		*/
		static squaredDistance<Out extends IVec3Like> (a: Out, b: Out);		
		/**
		!#zh 求向量长度
		!#en Seeking vector length 
		*/
		static len<Out extends IVec3Like> (a: Out);		
		/**
		!#zh 求向量长度平方
		!#en Seeking squared vector length 
		*/
		static lengthSqr<Out extends IVec3Like> (a: Out);		
		/**
		!#zh 逐元素向量取负
		!#en By taking the negative elements of the vector 
		*/
		static negate<Out extends IVec3Like> (out: Out, a: Out);		
		/**
		!#zh 逐元素向量取倒数，接近 0 时返回 Infinity
		!#en Element vector by taking the inverse, return near 0 Infinity 
		*/
		static inverse<Out extends IVec3Like> (out: Out, a: Out);		
		/**
		!#zh 逐元素向量取倒数，接近 0 时返回 0
		!#en Element vector by taking the inverse, return near 0 0 
		*/
		static inverseSafe<Out extends IVec3Like> (out: Out, a: Out);		
		/**
		!#zh 归一化向量
		!#en Normalized vector 
		*/
		static normalize<Out extends IVec3Like, Vec3Like extends IVec3Like> (out: Out, a: Vec3Like);		
		/**
		!#zh 向量点积（数量积）
		!#en Vector dot product (scalar product) 
		*/
		static dot<Out extends IVec3Like> (a: Out, b: Out);		
		/**
		!#zh 向量叉积（向量积）
		!#en Vector cross product (vector product) 
		*/
		static cross<Out extends IVec3Like, Vec3Like_1 extends IVec3Like, Vec3Like_2 extends IVec3Like> (out: Out, a: Vec3Like_1, b: Vec3Like_2);		
		/**
		!#zh 逐元素向量线性插值： A + t * (B - A)
		!#en Vector element by element linear interpolation: A + t * (B - A) 
		*/
		static lerp<Out extends IVec3Like> (out: Out, a: Out, b: Out, t: number);		
		/**
		!#zh 生成一个在单位球体上均匀分布的随机向量
		!#en Generates a uniformly distributed random vectors on the unit sphere
		@param scale 生成的向量长度 
		*/
		static random<Out extends IVec3Like> (out: Out, scale?: number);		
		/**
		!#zh 向量与四维矩阵乘法，默认向量第四位为 1。
		!#en Four-dimensional vector and matrix multiplication, the default vectors fourth one. 
		*/
		static transformMat4<Out extends IVec3Like, Vec3Like extends IVec3Like, MatLike extends IMat4Like> (out: Out, a: Vec3Like, mat: MatLike);		
		/**
		!#zh 向量与四维矩阵乘法，默认向量第四位为 0。
		!#en Four-dimensional vector and matrix multiplication, vector fourth default is 0. 
		*/
		static transformMat4Normal<Out extends IVec3Like, MatLike extends IMat4Like> (out: Out, a: Out, mat: MatLike);		
		/**
		!#zh 向量与三维矩阵乘法
		!#en Dimensional vector matrix multiplication 
		*/
		static transformMat3<Out extends IVec3Like, MatLike extends IMat3Like> (out: Out, a: Out, mat: MatLike);		
		/**
		!#zh 向量四元数乘法
		!#en Vector quaternion multiplication 
		*/
		static transformQuat<Out extends IVec3Like, VecLike extends IVec3Like, QuatLike extends IQuatLike> (out: Out, a: VecLike, q: QuatLike);		
		/**
		!#zh 绕 X 轴旋转向量指定弧度
		!#en Rotation vector specified angle about the X axis
		@param v 待旋转向量
		@param o 旋转中心
		@param a 旋转弧度 
		*/
		static rotateX<Out extends IVec3Like> (out: Out, v: Out, o: Out, a: number);		
		/**
		!#zh 绕 Y 轴旋转向量指定弧度
		!#en Rotation vector specified angle around the Y axis
		@param v 待旋转向量
		@param o 旋转中心
		@param a 旋转弧度 
		*/
		static rotateY<Out extends IVec3Like> (out: Out, v: Out, o: Out, a: number);		
		/**
		!#zh 绕 Z 轴旋转向量指定弧度
		!#en Around the Z axis specified angle vector
		@param v 待旋转向量
		@param o 旋转中心
		@param a 旋转弧度 
		*/
		static rotateZ<Out extends IVec3Like> (out: Out, v: Out, o: Out, a: number);		
		/**
		!#zh 向量等价判断
		!#en Equivalent vectors Analyzing 
		*/
		static strictEquals<Out extends IVec3Like> (a: Out, b: Out);		
		/**
		!#zh 排除浮点数误差的向量近似等价判断
		!#en Negative error vector floating point approximately equivalent Analyzing 
		*/
		static equals<Out extends IVec3Like> (a: Out, b: Out, epsilon = EPSILON);		
		/**
		!#zh 求两向量夹角弧度
		!#en Radian angle between two vectors seek 
		*/
		static angle<Out extends IVec3Like> (a: Out, b: Out);		
		/**
		!#zh 计算向量在指定平面上的投影
		!#en Calculating a projection vector in the specified plane
		@param a 待投影向量
		@param n 指定平面的法线 
		*/
		static projectOnPlane<Out extends IVec3Like> (out: Out, a: Out, n: Out);		
		/**
		!#zh 计算向量在指定向量上的投影
		!#en Projection vector calculated in the vector designated
		@param a 待投影向量
		@param n 目标向量 
		*/
		static project<Out extends IVec3Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 向量转数组
		!#en Vector transfer array
		@param ofs 数组起始偏移量 
		*/
		static toArray <Out extends IWritableArrayLike<number>> (out: Out, v: IVec3Like, ofs = 0);		
		/**
		!#zh 数组转向量
		!#en Array steering amount
		@param ofs 数组起始偏移量 
		*/
		static fromArray <Out extends IVec3Like> (out: Out, arr: IWritableArrayLike<number>, ofs = 0);		
		x: number;		
		y: number;		
		z: number;		
		/**
		!#en
		Constructor
		see {{#crossLink "cc/vec3:method"}}cc.v3{{/crossLink}}
		!#zh
		构造函数，可查看 {{#crossLink "cc/vec3:method"}}cc.v3{{/crossLink}}
		@param x x
		@param y y
		@param z z 
		*/
		constructor(x?: Vec3|number, y?: number, z?: number);		
		/**
		!#en clone a Vec3 value
		!#zh 克隆一个 Vec3 值 
		*/
		clone(): Vec3;		
		/**
		!#en Set the current vector value with the given vector.
		!#zh 用另一个向量设置当前的向量对象值。
		@param newValue !#en new value to set. !#zh 要设置的新值 
		*/
		set(newValue: Vec3): Vec3;		
		/**
		!#en Check whether the vector equals another one
		!#zh 当前的向量是否与指定的向量相等。
		@param other other 
		*/
		equals(other: Vec3): boolean;		
		/**
		!#en Check whether two vector equal with some degree of variance.
		!#zh
		近似判断两个点是否相等。<br/>
		判断 2 个向量是否在指定数值的范围之内，如果在则返回 true，反之则返回 false。
		@param other other
		@param variance variance 
		*/
		fuzzyEquals(other: Vec3, variance: number): boolean;		
		/**
		!#en Transform to string with vector informations
		!#zh 转换为方便阅读的字符串。 
		*/
		toString(): string;		
		/**
		!#en Calculate linear interpolation result between this vector and another one with given ratio
		!#zh 线性插值。
		@param to to
		@param ratio the interpolation coefficient
		@param out optional, the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created 
		*/
		lerp(to: Vec3, ratio: number, out?: Vec3): Vec3;		
		/**
		!#en Clamp the vector between from float and to float.
		!#zh
		返回指定限制区域后的向量。<br/>
		向量大于 max_inclusive 则返回 max_inclusive。<br/>
		向量小于 min_inclusive 则返回 min_inclusive。<br/>
		否则返回自身。
		@param min_inclusive min_inclusive
		@param max_inclusive max_inclusive 
		*/
		clampf(min_inclusive: Vec3, max_inclusive: Vec3): Vec3;		
		/**
		!#en Adds this vector. If you want to save result to another vector, use add() instead.
		!#zh 向量加法。如果你想保存结果到另一个向量，使用 add() 代替。
		@param vector vector 
		*/
		addSelf(vector: Vec3): Vec3;		
		/**
		!#en Adds two vectors, and returns the new result.
		!#zh 向量加法，并返回新结果。
		@param vector vector
		@param out optional, the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created 
		*/
		add(vector: Vec3, out?: Vec3): Vec3;		
		/**
		!#en Subtracts one vector from this.
		!#zh 向量减法。
		@param vector vector 
		*/
		subtract(vector: Vec3): Vec3;		
		/**
		!#en Multiplies this by a number.
		!#zh 缩放当前向量。
		@param num num 
		*/
		multiplyScalar(num: number): Vec3;		
		/**
		!#en Multiplies two vectors.
		!#zh 分量相乘。
		@param vector vector 
		*/
		multiply(vector: Vec3): Vec3;		
		/**
		!#en Divides by a number.
		!#zh 向量除法。
		@param num num 
		*/
		divide(num: number): Vec3;		
		/**
		!#en Negates the components.
		!#zh 向量取反。 
		*/
		negate(): Vec3;		
		/**
		!#en Dot product
		!#zh 当前向量与指定向量进行点乘。
		@param vector vector 
		*/
		dot(vector?: Vec3): number;		
		/**
		!#en Cross product
		!#zh 当前向量与指定向量进行叉乘。
		@param vector vector
		@param out out 
		*/
		cross(vector: Vec3, out?: Vec3): Vec3;		
		/**
		!#en Returns the length of this vector.
		!#zh 返回该向量的长度。
		
		@example 
		```js
		var v = cc.v3(10, 10, 10);
		v.len(); // return 17.320508075688775;
		``` 
		*/
		len(): number;		
		/**
		!#en Returns the squared length of this vector.
		!#zh 返回该向量的长度平方。 
		*/
		lengthSqr(): number;		
		/**
		!#en Make the length of this vector to 1.
		!#zh 向量归一化，让这个向量的长度为 1。 
		*/
		normalizeSelf(): Vec3;		
		/**
		!#en
		Returns this vector with a magnitude of 1.<br/>
		<br/>
		Note that the current vector is unchanged and a new normalized vector is returned. If you want to normalize the current vector, use normalizeSelf function.
		!#zh
		返回归一化后的向量。<br/>
		<br/>
		注意，当前向量不变，并返回一个新的归一化向量。如果你想来归一化当前向量，可使用 normalizeSelf 函数。
		@param out optional, the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created 
		*/
		normalize(out?: Vec3): Vec3;		
		/**
		Transforms the vec3 with a mat4. 4th vector component is implicitly '1'
		@param m matrix to transform with
		@param out the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created 
		*/
		transformMat4(m: Mat4, out?: Vec3): Vec3;		
		/**
		Returns the maximum value in x, y, and z 
		*/
		maxAxis(): number;		
		/**
		!#en Get angle in radian between this and vector.
		!#zh 夹角的弧度。
		@param vector vector 
		*/
		angle(vector: Vec3): number;		
		/**
		!#en Calculates the projection of the current vector over the given vector.
		!#zh 返回当前向量在指定 vector 向量上的投影向量。
		@param vector vector
		
		@example 
		```js
		var v1 = cc.v3(20, 20, 20);
		var v2 = cc.v3(5, 5, 5);
		v1.project(v2); // Vec3 {x: 20, y: 20, z: 20};
		``` 
		*/
		project(vector: Vec3): Vec3;		
		/**
		!#en Get angle in radian between this and vector with direction. <br/>
		In order to compatible with the vec2 API.
		!#zh 带方向的夹角的弧度。该方法仅用做兼容 2D 计算。
		@param vector vector 
		*/
		signAngle(vector: Vec3|Vec2): number;		
		/**
		!#en rotate. In order to compatible with the vec2 API.
		!#zh 返回旋转给定弧度后的新向量。该方法仅用做兼容 2D 计算。
		@param radians radians
		@param out optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created 
		*/
		rotate(radians: number, out?: Vec3): Vec2;		
		/**
		!#en rotate self. In order to compatible with the vec2 API.
		!#zh 按指定弧度旋转向量。该方法仅用做兼容 2D 计算。
		@param radians radians 
		*/
		rotateSelf(radians: number): Vec3;	
	}	
	/** !#en Representation of 3D vectors and points.
	!#zh 表示 3D 向量和坐标 */
	export class Vec4 extends ValueType {		
		/**
		!#en Subtracts one vector from this. If you want to save result to another vector, use sub() instead.
		!#zh 向量减法。如果你想保存结果到另一个向量，可使用 sub() 代替。
		@param vector vector 
		*/
		subSelf(vector: Vec4): Vec4;		
		/**
		!#en Subtracts one vector from this, and returns the new result.
		!#zh 向量减法，并返回新结果。
		@param vector vector
		@param out optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created 
		*/
		sub(vector: Vec4, out?: Vec4): Vec4;		
		/**
		!#en Multiplies this by a number. If you want to save result to another vector, use mul() instead.
		!#zh 缩放当前向量。如果你想结果保存到另一个向量，可使用 mul() 代替。
		@param num num 
		*/
		mulSelf(num: number): Vec4;		
		/**
		!#en Multiplies by a number, and returns the new result.
		!#zh 缩放向量，并返回新结果。
		@param num num
		@param out optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created 
		*/
		mul(num: number, out?: Vec4): Vec4;		
		/**
		!#en Divides by a number. If you want to save result to another vector, use div() instead.
		!#zh 向量除法。如果你想结果保存到另一个向量，可使用 div() 代替。
		@param num num 
		*/
		divSelf(num: number): Vec4;		
		/**
		!#en Divides by a number, and returns the new result.
		!#zh 向量除法，并返回新的结果。
		@param num num
		@param out optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created 
		*/
		div(num: number, out?: Vec4): Vec4;		
		/**
		!#en Multiplies two vectors.
		!#zh 分量相乘。
		@param vector vector 
		*/
		scaleSelf(vector: Vec4): Vec4;		
		/**
		!#en Multiplies two vectors, and returns the new result.
		!#zh 分量相乘，并返回新的结果。
		@param vector vector
		@param out optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created 
		*/
		scale(vector: Vec4, out?: Vec4): Vec4;		
		/**
		!#en Negates the components. If you want to save result to another vector, use neg() instead.
		!#zh 向量取反。如果你想结果保存到另一个向量，可使用 neg() 代替。 
		*/
		negSelf(): Vec4;		
		/**
		!#en Negates the components, and returns the new result.
		!#zh 返回取反后的新向量。
		@param out optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created 
		*/
		neg(out?: Vec4): Vec4;		
		/**
		!#zh 获得指定向量的拷贝
		!#en Obtaining copy vectors designated 
		*/
		static clone <Out extends IVec4Like> (a: Out);		
		/**
		!#zh 复制目标向量
		!#en Copy the target vector 
		*/
		static copy <Out extends IVec4Like> (out: Out, a: Out);		
		/**
		!#zh 设置向量值
		!#en Set to value 
		*/
		static set <Out extends IVec4Like> (out: Out, x: number, y: number, z: number, w: number);		
		/**
		!#zh 逐元素向量加法
		!#en Element-wise vector addition 
		*/
		static add <Out extends IVec4Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 逐元素向量减法
		!#en Element-wise vector subtraction 
		*/
		static subtract <Out extends IVec4Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 逐元素向量乘法
		!#en Element-wise vector multiplication 
		*/
		static multiply <Out extends IVec4Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 逐元素向量除法
		!#en Element-wise vector division 
		*/
		static divide <Out extends IVec4Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 逐元素向量向上取整
		!#en Rounding up by elements of the vector 
		*/
		static ceil <Out extends IVec4Like> (out: Out, a: Out);		
		/**
		!#zh 逐元素向量向下取整
		!#en Element vector by rounding down 
		*/
		static floor <Out extends IVec4Like> (out: Out, a: Out);		
		/**
		!#zh 逐元素向量最小值
		!#en The minimum by-element vector 
		*/
		static min <Out extends IVec4Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 逐元素向量最大值
		!#en The maximum value of the element-wise vector 
		*/
		static max <Out extends IVec4Like> (out: Out, a: Out, b: Out);		
		/**
		!#zh 逐元素向量四舍五入取整
		!#en Element-wise vector of rounding to whole 
		*/
		static round <Out extends IVec4Like> (out: Out, a: Out);		
		/**
		!#zh 向量标量乘法
		!#en Vector scalar multiplication 
		*/
		static multiplyScalar <Out extends IVec4Like> (out: Out, a: Out, b: number);		
		/**
		!#zh 逐元素向量乘加: A + B * scale
		!#en Element-wise vector multiply add: A + B * scale 
		*/
		static scaleAndAdd <Out extends IVec4Like> (out: Out, a: Out, b: Out, scale: number);		
		/**
		!#zh 求两向量的欧氏距离
		!#en Seeking two vectors Euclidean distance 
		*/
		static distance <Out extends IVec4Like> (a: Out, b: Out);		
		/**
		!#zh 求两向量的欧氏距离平方
		!#en Euclidean distance squared seeking two vectors 
		*/
		static squaredDistance <Out extends IVec4Like> (a: Out, b: Out);		
		/**
		!#zh 求向量长度
		!#en Seeking vector length 
		*/
		static len <Out extends IVec4Like> (a: Out);		
		/**
		!#zh 求向量长度平方
		!#en Seeking squared vector length 
		*/
		static lengthSqr <Out extends IVec4Like> (a: Out);		
		/**
		!#zh 逐元素向量取负
		!#en By taking the negative elements of the vector 
		*/
		static negate <Out extends IVec4Like> (out: Out, a: Out);		
		/**
		!#zh 逐元素向量取倒数，接近 0 时返回 Infinity
		!#en Element vector by taking the inverse, return near 0 Infinity 
		*/
		static inverse <Out extends IVec4Like> (out: Out, a: Out);		
		/**
		!#zh 逐元素向量取倒数，接近 0 时返回 0
		!#en Element vector by taking the inverse, return near 0 0 
		*/
		static inverseSafe <Out extends IVec4Like> (out: Out, a: Out);		
		/**
		!#zh 归一化向量
		!#en Normalized vector 
		*/
		static normalize <Out extends IVec4Like> (out: Out, a: Out);		
		/**
		!#zh 向量点积（数量积）
		!#en Vector dot product (scalar product) 
		*/
		static dot <Out extends IVec4Like> (a: Out, b: Out);		
		/**
		!#zh 逐元素向量线性插值： A + t * (B - A)
		!#en Vector element by element linear interpolation: A + t * (B - A) 
		*/
		static lerp <Out extends IVec4Like> (out: Out, a: Out, b: Out, t: number);		
		/**
		!#zh 生成一个在单位球体上均匀分布的随机向量
		!#en Generates a uniformly distributed random vectors on the unit sphere
		@param scale 生成的向量长度 
		*/
		static random <Out extends IVec4Like> (out: Out, scale?: number);		
		/**
		!#zh 向量矩阵乘法
		!#en Vector matrix multiplication 
		*/
		static transformMat4 <Out extends IVec4Like, MatLike extends IMat4Like> (out: Out, a: Out, mat: MatLike);		
		/**
		!#zh 向量四元数乘法
		!#en Vector quaternion multiplication 
		*/
		static transformQuat <Out extends IVec4Like, QuatLike extends IQuatLike> (out: Out, a: Out, q: QuatLike);		
		/**
		!#zh 向量等价判断
		!#en Equivalent vectors Analyzing 
		*/
		static strictEquals <Out extends IVec4Like> (a: Out, b: Out);		
		/**
		!#zh 排除浮点数误差的向量近似等价判断
		!#en Negative error vector floating point approximately equivalent Analyzing 
		*/
		static equals <Out extends IVec4Like> (a: Out, b: Out, epsilon = EPSILON);		
		/**
		!#zh 向量转数组
		!#en Vector transfer array
		@param ofs 数组起始偏移量 
		*/
		static toArray <Out extends IWritableArrayLike<number>> (out: Out, v: IVec4Like, ofs = 0);		
		/**
		!#zh 数组转向量
		!#en Array steering amount
		@param ofs 数组起始偏移量 
		*/
		static fromArray <Out extends IVec4Like> (out: Out, arr: IWritableArrayLike<number>, ofs = 0);		
		x: number;		
		y: number;		
		z: number;		
		w: number;		
		/**
		!#en
		Constructor
		see {{#crossLink "cc/vec4:method"}}cc.v4{{/crossLink}}
		!#zh
		构造函数，可查看 {{#crossLink "cc/vec4:method"}}cc.v4{{/crossLink}}
		@param x x
		@param y y
		@param z z
		@param w w 
		*/
		constructor(x?: number, y?: number, z?: number, w?: number);		
		/**
		!#en clone a Vec4 value
		!#zh 克隆一个 Vec4 值 
		*/
		clone(): Vec4;		
		/**
		!#en Set the current vector value with the given vector.
		!#zh 用另一个向量设置当前的向量对象值。
		@param newValue !#en new value to set. !#zh 要设置的新值 
		*/
		set(newValue: Vec4): Vec4;		
		/**
		!#en Check whether the vector equals another one
		!#zh 当前的向量是否与指定的向量相等。
		@param other other
		@param epsilon epsilon 
		*/
		equals(other: Vec4, epsilon?: number): boolean;		
		/**
		!#en Check whether the vector equals another one
		!#zh 判断当前向量是否在误差范围内与指定分量的向量相等。
		@param x 相比较的向量的 x 分量。
		@param y 相比较的向量的 y 分量。
		@param z 相比较的向量的 z 分量。
		@param w 相比较的向量的 w 分量。
		@param epsilon 允许的误差，应为非负数。 
		*/
		equals4f(x: number, y: number, z: number, w: number, epsilon?: number): boolean;		
		/**
		!#en Check whether strict equals other Vec4
		!#zh 判断当前向量是否与指定向量相等。两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
		@param other 相比较的向量。 
		*/
		strictEquals(other: Vec4): boolean;		
		/**
		!#en Check whether strict equals other Vec4
		!#zh 判断当前向量是否与指定分量的向量相等。两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
		@param x 指定向量的 x 分量。
		@param y 指定向量的 y 分量。
		@param z 指定向量的 z 分量。
		@param w 指定向量的 w 分量。 
		*/
		strictEquals4f(x: number, y: number, z: number, w: number): boolean;		
		/**
		!#en Calculate linear interpolation result between this vector and another one with given ratio
		!#zh 根据指定的插值比率，从当前向量到目标向量之间做插值。
		@param to 目标向量。
		@param ratio 插值比率，范围为 [0,1]。 
		*/
		lerp(to: Vec4, ratio: number): Vec4;		
		/**
		!#en Transform to string with vector informations
		!#zh 返回当前向量的字符串表示。 
		*/
		toString(): string;		
		/**
		!#en Clamp the vector between minInclusive and maxInclusive.
		!#zh 设置当前向量的值，使其各个分量都处于指定的范围内。
		@param minInclusive 每个分量都代表了对应分量允许的最小值。
		@param maxInclusive 每个分量都代表了对应分量允许的最大值。 
		*/
		clampf(minInclusive: Vec4, maxInclusive: Vec4): Vec4;		
		/**
		!#en Adds this vector. If you want to save result to another vector, use add() instead.
		!#zh 向量加法。如果你想保存结果到另一个向量，使用 add() 代替。
		@param vector vector 
		*/
		addSelf(vector: Vec4): Vec4;		
		/**
		!#en Adds two vectors, and returns the new result.
		!#zh 向量加法，并返回新结果。
		@param vector vector
		@param out optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created 
		*/
		add(vector: Vec4, out?: Vec4): Vec4;		
		/**
		!#en Subtracts one vector from this, and returns the new result.
		!#zh 向量减法，并返回新结果。
		@param vector vector
		@param out optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created 
		*/
		subtract(vector: Vec4, out?: Vec4): Vec4;		
		/**
		!#en Multiplies this by a number.
		!#zh 缩放当前向量。
		@param num num 
		*/
		multiplyScalar(num: number): Vec4;		
		/**
		!#en Multiplies two vectors.
		!#zh 分量相乘。
		@param vector vector 
		*/
		multiply(vector: Vec4): Vec4;		
		/**
		!#en Divides by a number.
		!#zh 向量除法。
		@param num num 
		*/
		divide(num: number): Vec4;		
		/**
		!#en Negates the components.
		!#zh 向量取反 
		*/
		negate(): Vec4;		
		/**
		!#en Dot product
		!#zh 当前向量与指定向量进行点乘。
		@param vector vector 
		*/
		dot(vector?: Vec4): number;		
		/**
		!#en Cross product
		!#zh 当前向量与指定向量进行叉乘。
		@param vector vector
		@param out out 
		*/
		cross(vector: Vec4, out?: Vec4): Vec4;		
		/**
		!#en Returns the length of this vector.
		!#zh 返回该向量的长度。
		
		@example 
		```js
		var v = cc.v4(10, 10);
		v.len(); // return 14.142135623730951;
		``` 
		*/
		len(): number;		
		/**
		!#en Returns the squared length of this vector.
		!#zh 返回该向量的长度平方。 
		*/
		lengthSqr(): number;		
		/**
		!#en Make the length of this vector to 1.
		!#zh 向量归一化，让这个向量的长度为 1。 
		*/
		normalizeSelf(): Vec4;		
		/**
		!#en
		Returns this vector with a magnitude of 1.<br/>
		<br/>
		Note that the current vector is unchanged and a new normalized vector is returned. If you want to normalize the current vector, use normalizeSelf function.
		!#zh
		返回归一化后的向量。<br/>
		<br/>
		注意，当前向量不变，并返回一个新的归一化向量。如果你想来归一化当前向量，可使用 normalizeSelf 函数。
		@param out optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created 
		*/
		normalize(out?: Vec4): Vec4;		
		/**
		Transforms the vec4 with a mat4. 4th vector component is implicitly '1'
		@param m matrix to transform with
		@param out the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created 
		*/
		transformMat4(m: Mat4, out?: Vec4): Vec4;		
		/**
		Returns the maximum value in x, y, z, w. 
		*/
		maxAxis(): number;	
	}	
	/** !#en .
	!#zh 。 */
	export class SkeletonAnimation extends Animation {	
	}	
	/** !#en SkeletonAnimationClip Asset.
	!#zh 骨骼动画剪辑。 */
	export class SkeletonAnimationClip extends AnimationClip {	
	}	
	/** !#en
	Skinned Mesh Renderer
	!#zh
	蒙皮渲染组件 */
	export class SkinnedMeshRenderer {		
		/** !#en
		Skeleton Asset
		!#zh
		骨骼资源 */
		skeleton: sp.Skeleton;		
		/** !#en
		Root Bone
		!#zh
		骨骼根节点 */
		rootBone: Node;	
	}	
	/** !#en The burst of 3d particle.
	!#zh 3D 粒子发射时的爆发个数 */
	export class Burst {		
		/** !#en Time between the start of the particle system and the trigger of this Brust
		!#zh 粒子系统开始运行到触发此次 Brust 的时间 */
		time: number;		
		/** !#en Minimum number of emitted particles
		!#zh 发射粒子的最小数量 */
		minCount: number;		
		/** !#en Maximum number of emitted particles
		!#zh 发射粒子的最大数量 */
		maxCount: number;		
		/** !#en The number of times Burst was triggered.
		!#zh Burst 的触发次数 */
		repeatCount: number;		
		/** !#en Interval of each trigger
		!#zh 每次触发的间隔时间 */
		repeatInterval: number;		
		/** !#en Number of particles emitted
		!#zh 发射的粒子的数量 */
		count: CurveRange;	
	}	
	/** !#en The animation curve of 3d particle.
	!#zh 3D 粒子动画曲线 */
	export class AnimationCurve {	
	}	
	/** !#en The ParticleSystem3D Component.
	!#zh 3D 粒子组件 */
	export class ParticleSystem3D extends RenderComponent {		
		/** !#en The run time of particle.
		!#zh 粒子系统运行时间 */
		duration: number;		
		/** !#en The maximum number of particles that a particle system can generate.
		!#zh 粒子系统能生成的最大粒子数量 */
		capacity: number;		
		/** !#en Whether the particle system loops.
		!#zh 粒子系统是否循环播放 */
		loop: boolean;		
		/** !#en Whether the particles start playing automatically after loaded.
		!#zh 粒子系统加载后是否自动开始播放 */
		playOnAwake: boolean;		
		/** !#en When selected, the particle system will start playing after one round has been played (only effective when loop is enabled).
		!#zh 选中之后，粒子系统会以已播放完一轮之后的状态开始播放（仅当循环播放启用时有效） */
		prewarm: boolean;		
		/** !#en The coordinate system in which the particle system is located.<br>
		World coordinates (does not change when the position of other objects changes)<br>
		Local coordinates (moving as the position of the parent node changes)<br>
		Custom coordinates (moving with the position of a custom node)
		!#zh 选择粒子系统所在的坐标系<br>
		世界坐标（不随其他物体位置改变而变换）<br>
		局部坐标（跟随父节点位置改变而移动）<br>
		自定坐标（跟随自定义节点的位置改变而移动） */
		simulationSpace: Space;		
		/** !#en Controlling the update speed of the entire particle system.
		!#zh 控制整个粒子系统的更新速度。 */
		simulationSpeed: number;		
		/** !#en Delay particle emission time after particle system starts running.
		!#zh 粒子系统开始运行后，延迟粒子发射的时间。 */
		startDelay: CurveRange;		
		/** !#en Particle life cycle。
		!#zh 粒子生命周期。 */
		startLifetime: CurveRange;		
		/** !#en Particle initial color
		!#zh 粒子初始颜色 */
		startColor: GradientRange;		
		/** !#en Particle scale space
		!#zh 缩放空间 */
		scaleSpace: Space;		
		/** !#en Initial particle size
		!#zh 粒子初始大小 */
		startSize: CurveRange;		
		/** !#en Initial particle speed
		!#zh 粒子初始速度 */
		startSpeed: CurveRange;		
		/** !#en Particle initial rotation angle
		!#zh 粒子初始旋转角度 */
		startRotation: CurveRange;		
		/** !#en Gravity coefficient of particles affected by gravity
		!#zh 粒子受重力影响的重力系数 */
		gravityModifier: CurveRange;		
		/** !#en Particles emitted per second
		!#zh 每秒发射的粒子数 */
		rateOverTime: CurveRange;		
		/** !#en Number of particles emitted per unit distance moved
		!#zh 每移动单位距离发射的粒子数 */
		rateOverDistance: CurveRange;		
		/** !#en The number of Brusts that emit a specified number of particles at a specified time
		!#zh 设定在指定时间发射指定数量的粒子的 Brust 的数量 */
		bursts: Burst[];		
		/** !#en Particle emitter module
		!#zh 粒子发射器模块 */
		shapeModule: ShapeModule;		
		/** !#en Color control module
		!#zh 颜色控制模块 */
		colorOverLifetimeModule: ColorOverLifetimeModule;		
		/** !#en Particle size module
		!#zh 粒子大小模块 */
		sizeOvertimeModule: SizeOvertimeModule;		
		/** !#en Particle speed module
		!#zh 粒子速度模块 */
		velocityOvertimeModule: VelocityOvertimeModule;		
		/** !#en Particle acceleration module
		!#zh 粒子加速度模块 */
		forceOvertimeModule: ForceOvertimeModule;		
		/** !#en Particle limit speed module (only CPU particles are supported)
		!#zh 粒子限制速度模块（只支持 CPU 粒子） */
		limitVelocityOvertimeModule: LimitVelocityOvertimeModule;		
		/** !#en Particle rotation module
		!#zh 粒子旋转模块 */
		rotationOvertimeModule: RotationOvertimeModule;		
		/** !#en Texture Animation Module
		!#zh 贴图动画模块 */
		textureAnimationModule: TextureAnimationModule;		
		/** !#en Particle Trajectory Module
		!#zh 粒子轨迹模块 */
		trailModule: TrailModule;		
		/** !#en Particle generation mode
		!#zh 设定粒子生成模式 */
		renderMode: ParticleSystem3DAssembler.RenderMode;		
		/** !#en When the particle generation mode is StrecthedBillboard, in the direction of movement of the particles is stretched by velocity magnitude
		!#zh 在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按速度大小进行拉伸 */
		velocityScale: number;		
		/** !#en When the particle generation method is StrecthedBillboard, the particles are stretched according to the particle size in the direction of motion
		!#zh 在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按粒子大小进行拉伸 */
		lengthScale: number;		
		/** !#en Particle model
		!#zh 粒子模型 */
		mesh: Mesh;		
		/** !#en Particle material
		!#zh 粒子材质 */
		particleMaterial: Material;		
		/** !#en Particle trail material
		!#zh 粒子轨迹材质 */
		trailMaterial: Material;		
		/**
		!#en Playing particle effects
		!#zh 播放粒子效果 
		*/
		play(): void;		
		/**
		!#en Pause particle effect
		!#zh 暂停播放粒子效果 
		*/
		pause(): void;		
		/**
		!#en Stop particle effect
		!#zh 停止播放粒子效果 
		*/
		stop(): void;		
		/**
		!#en Remove all particle effect
		!#zh 将所有粒子从粒子系统中清除 
		*/
		clear(): void;	
	}	
	/** !#en
	Helper class for ES5 Map.
	!#zh
	ES5 Map 辅助类。 */
	export class MapUtils {	
	}	
	/** !#en Effect Asset.
	!#zh Effect 资源类型。 */
	export class EffectAsset extends Asset {	
	}	
	/** !#en Material Asset.
	!#zh 材质资源类。 */
	export class Material extends Asset {		
		/**
		!#en Creates a Material with builtin Effect.
		!#zh 使用内建 Effect 创建一个材质。
		@param effectName effectName
		@param techniqueIndex techniqueIndex 
		*/
		static createWithBuiltin(effectName: string, techniqueIndex?: number): Material;		
		/**
		!#en Creates a Material.
		!#zh 创建一个材质。
		@param effectAsset effectAsset
		@param techniqueIndex techniqueIndex 
		*/
		static create(effectAsset: EffectAsset, techniqueIndex?: number): Material;		
		/**
		!#en Sets the Material property
		!#zh 是指材质的属性
		@param name name
		@param val val
		@param passIdx passIdx
		@param directly directly 
		*/
		setProperty(name: string, val: any, passIdx?: number, directly?: boolean): void;		
		/**
		!#en Gets the Material property.
		!#zh 获取材质的属性。
		@param name name
		@param passIdx passIdx 
		*/
		getProperty(name: string, passIdx: number): void;		
		/**
		!#en Sets the Material define.
		!#zh 设置材质的宏定义。
		@param name name
		@param val val
		@param passIdx passIdx
		@param force force 
		*/
		define(name: string, val: boolean|number, passIdx?: number, force?: boolean): void;		
		/**
		!#en Gets the Material define.
		!#zh 获取材质的宏定义。
		@param name name
		@param passIdx passIdx 
		*/
		getDefine(name: string, passIdx?: number): boolean;		
		/**
		!#en Sets the Material cull mode.
		!#zh 设置材质的裁减模式。
		@param cullMode cullMode
		@param passIdx passIdx 
		*/
		setCullMode(cullMode: number, passIdx: number): void;		
		/**
		!#en Sets the Material depth states.
		!#zh 设置材质的深度渲染状态。
		@param depthTest depthTest
		@param depthWrite depthWrite
		@param depthFunc depthFunc
		@param passIdx passIdx 
		*/
		setDepth(depthTest: boolean, depthWrite: boolean, depthFunc: number, passIdx: number): void;		
		/**
		!#en Sets the Material blend states.
		!#zh 设置材质的混合渲染状态。
		@param enabled enabled
		@param blendEq blendEq
		@param blendSrc blendSrc
		@param blendDst blendDst
		@param blendAlphaEq blendAlphaEq
		@param blendSrcAlpha blendSrcAlpha
		@param blendDstAlpha blendDstAlpha
		@param blendColor blendColor
		@param passIdx passIdx 
		*/
		setBlend(enabled: number, blendEq: number, blendSrc: number, blendDst: number, blendAlphaEq: number, blendSrcAlpha: number, blendDstAlpha: number, blendColor: number, passIdx: number): void;		
		/**
		!#en Sets whether enable the stencil test.
		!#zh 设置是否开启模板测试。
		@param stencilTest stencilTest
		@param passIdx passIdx 
		*/
		setStencilEnabled(stencilTest: number, passIdx: number): void;		
		/**
		!#en Sets the Material stencil render states.
		!#zh 设置材质的模板测试渲染参数。
		@param stencilTest stencilTest
		@param stencilFunc stencilFunc
		@param stencilRef stencilRef
		@param stencilMask stencilMask
		@param stencilFailOp stencilFailOp
		@param stencilZFailOp stencilZFailOp
		@param stencilZPassOp stencilZPassOp
		@param stencilWriteMask stencilWriteMask
		@param passIdx passIdx 
		*/
		setStencil(stencilTest: number, stencilFunc: number, stencilRef: number, stencilMask: number, stencilFailOp: number, stencilZFailOp: number, stencilZPassOp: number, stencilWriteMask: number, passIdx: number): void;	
	}	
	/** !#en
	Material Variant is an extension of the Material Asset.
	Changes to Material Variant do not affect other Material Variant or Material Asset,
	and changes to Material Asset are synchronized to the Material Variant.
	However, when a Material Variant had already modifies a state, the Material Asset state is not synchronized to the Material Variant.
	!#zh
	材质变体是材质资源的一个延伸。
	材质变体的修改不会影响到其他的材质变体或者材质资源，而材质资源的修改会同步体现到材质变体上，
	但是当材质变体对一个状态修改后，材质资源再对这个状态修改是不会同步到材质变体上的。 */
	export class MaterialVariant extends Material {		
		/**
		
		@param materialName materialName
		@param owner owner 
		*/
		static createWithBuiltin (materialName, owner: cc.RenderComponent): MaterialVariant | null;		
		/**
		
		@param material material
		@param owner owner 
		*/
		static create (material: Material, owner: cc.RenderComponent): MaterialVariant | null;	
	}	
	/** !#en cc.EditBox is a component for inputing text, you can use it to gather small amounts of text from users.
	!#zh EditBox 组件，用于获取用户的输入文本。 */
	export class EditBox extends Component {		
		/** !#en Input string of EditBox.
		!#zh 输入框的初始输入内容，如果为空则会显示占位符的文本。 */
		string: string;		
		/** !#en The Label component attached to the node for EditBox's input text label
		!#zh 输入框输入文本节点上挂载的 Label 组件对象 */
		textLabel: Label;		
		/** !#en The Label component attached to the node for EditBox's placeholder text label
		!#zh 输入框占位符节点上挂载的 Label 组件对象 */
		placeholderLabel: Label;		
		/** !#en The Sprite component attached to the node for EditBox's background
		!#zh 输入框背景节点上挂载的 Sprite 组件对象 */
		background: Sprite;		
		/** !#en The background image of EditBox. This property will be removed in the future, use editBox.background instead please.
		!#zh 输入框的背景图片。 该属性会在将来的版本中移除，请用 editBox.background */
		backgroundImage: SpriteFrame;		
		/** !#en
		The return key type of EditBox.
		Note: it is meaningless for web platforms and desktop platforms.
		!#zh
		指定移动设备上面回车按钮的样式。
		注意：这个选项对 web 平台与 desktop 平台无效。 */
		returnType: EditBox.KeyboardReturnType;		
		/** !#en Set the input flags that are to be applied to the EditBox.
		!#zh 指定输入标志位，可以指定输入方式为密码或者单词首字母大写。 */
		inputFlag: EditBox.InputFlag;		
		/** !#en
		Set the input mode of the edit box.
		If you pass ANY, it will create a multiline EditBox.
		!#zh
		指定输入模式: ANY表示多行输入，其它都是单行输入，移动平台上还可以指定键盘样式。 */
		inputMode: EditBox.InputMode;		
		/** !#en Font size of the input text. This property will be removed in the future, use editBox.textLabel.fontSize instead please.
		!#zh 输入框文本的字体大小。 该属性会在将来的版本中移除，请使用 editBox.textLabel.fontSize。 */
		fontSize: number;		
		/** !#en Change the lineHeight of displayed text. This property will be removed in the future, use editBox.textLabel.lineHeight instead.
		!#zh 输入框文本的行高。该属性会在将来的版本中移除，请使用 editBox.textLabel.lineHeight */
		lineHeight: number;		
		/** !#en Font color of the input text. This property will be removed in the future, use editBox.textLabel.node.color instead.
		!#zh 输入框文本的颜色。该属性会在将来的版本中移除，请使用 editBox.textLabel.node.color */
		fontColor: Color;		
		/** !#en The display text of placeholder.
		!#zh 输入框占位符的文本内容。 */
		placeholder: string;		
		/** !#en The font size of placeholder. This property will be removed in the future, use editBox.placeholderLabel.fontSize instead.
		!#zh 输入框占位符的字体大小。该属性会在将来的版本中移除，请使用 editBox.placeholderLabel.fontSize */
		placeholderFontSize: number;		
		/** !#en The font color of placeholder. This property will be removed in the future, use editBox.placeholderLabel.node.color instead.
		!#zh 输入框占位符的字体颜色。该属性会在将来的版本中移除，请使用 editBox.placeholderLabel.node.color */
		placeholderFontColor: Color;		
		/** !#en The maximize input length of EditBox.
		- If pass a value less than 0, it won't limit the input number of characters.
		- If pass 0, it doesn't allow input any characters.
		!#zh 输入框最大允许输入的字符个数。
		- 如果值为小于 0 的值，则不会限制输入字符个数。
		- 如果值为 0，则不允许用户进行任何输入。 */
		maxLength: number;		
		/** !#en The input is always visible and be on top of the game view (only useful on Web), this property will be removed on v2.1
		!zh 输入框总是可见，并且永远在游戏视图的上面（这个属性只有在 Web 上面修改有意义），该属性会在 v2.1 中移除
		Note: only available on Web at the moment. */
		stayOnTop: boolean;		
		/** !#en Set the tabIndex of the DOM input element (only useful on Web).
		!#zh 修改 DOM 输入元素的 tabIndex（这个属性只有在 Web 上面修改有意义）。 */
		tabIndex: number;		
		/** !#en The event handler to be called when EditBox began to edit text.
		!#zh 开始编辑文本输入框触发的事件回调。 */
		editingDidBegan: Component.EventHandler[];		
		/** !#en The event handler to be called when EditBox text changes.
		!#zh 编辑文本输入框时触发的事件回调。 */
		textChanged: Component.EventHandler[];		
		/** !#en The event handler to be called when EditBox edit ends.
		!#zh 结束编辑文本输入框时触发的事件回调。 */
		editingDidEnded: Component.EventHandler[];		
		/** !#en The event handler to be called when return key is pressed. Windows is not supported.
		!#zh 当用户按下回车按键时的事件回调，目前不支持 windows 平台 */
		editingReturn: Component.EventHandler[];		
		/**
		!#en Let the EditBox get focus, this method will be removed on v2.1
		!#zh 让当前 EditBox 获得焦点, 这个方法会在 v2.1 中移除 
		*/
		setFocus(): void;		
		/**
		!#en Let the EditBox get focus
		!#zh 让当前 EditBox 获得焦点 
		*/
		focus(): void;		
		/**
		!#en Let the EditBox lose focus
		!#zh 让当前 EditBox 失去焦点 
		*/
		blur(): void;		
		/**
		!#en Determine whether EditBox is getting focus or not.
		!#zh 判断 EditBox 是否获得了焦点 
		*/
		isFocused(): void;		
		/**
		!#en if you don't need the EditBox and it isn't in any running Scene, you should
		call the destroy method on this component or the associated node explicitly.
		Otherwise, the created DOM element won't be removed from web page.
		!#zh
		如果你不再使用 EditBox，并且组件未添加到场景中，那么你必须手动对组件或所在节点调用 destroy。
		这样才能移除网页上的 DOM 节点，避免 Web 平台内存泄露。
		
		@example 
		```js
		editbox.node.parent = null;  // or  editbox.node.removeFromParent(false);
		// when you don't need editbox anymore
		editbox.node.destroy();
		``` 
		*/
		destroy(): boolean;	
	}	
	/** undefined */
	export class PhysicsChainCollider extends PolygonCollider {		
		/** !#en Whether the chain is loop
		!#zh 链条是否首尾相连 */
		loop: boolean;		
		/** !#en Chain points
		!#zh 链条顶点数组 */
		points: Vec2[];	
	}	
	/** undefined */
	export class PhysicsCollider extends Collider {		
		/** !#en
		The density.
		!#zh
		密度 */
		density: number;		
		/** !#en
		A sensor collider collects contact information but never generates a collision response
		!#zh
		一个传感器类型的碰撞体会产生碰撞回调，但是不会发生物理碰撞效果。 */
		sensor: boolean;		
		/** !#en
		The friction coefficient, usually in the range [0,1].
		!#zh
		摩擦系数，取值一般在 [0, 1] 之间 */
		friction: number;		
		/** !#en
		The restitution (elasticity) usually in the range [0,1].
		!#zh
		弹性系数，取值一般在 [0, 1]之间 */
		restitution: number;		
		/** !#en
		Physics collider will find the rigidbody component on the node and set to this property.
		!#zh
		碰撞体会在初始化时查找节点上是否存在刚体，如果查找成功则赋值到这个属性上。 */
		body: RigidBody;		
		/**
		!#en
		Apply current changes to collider, this will regenerate inner box2d fixtures.
		!#zh
		应用当前 collider 中的修改，调用此函数会重新生成内部 box2d 的夹具。 
		*/
		apply(): void;		
		/**
		!#en
		Get the world aabb of the collider
		!#zh
		获取碰撞体的世界坐标系下的包围盒 
		*/
		getAABB(): void;	
	}	
	/** undefined */
	export class PhysicsBoxCollider extends PhysicsCollider implements Collider.Box {		
		/** !#en Position offset
		!#zh 位置偏移量 */
		offset: Vec2;		
		/** !#en Box size
		!#zh 包围盒大小 */
		size: Size;	
	}	
	/** undefined */
	export class PhysicsPolygonCollider extends PhysicsCollider implements Collider.Polygon {		
		/** !#en Position offset
		!#zh 位置偏移量 */
		offset: Vec2;		
		/** !#en Polygon points
		!#zh 多边形顶点数组 */
		points: Vec2[];	
	}	
	/** undefined */
	export class PhysicsCircleCollider extends PhysicsCollider implements Collider.Circle {		
		/** !#en Position offset
		!#zh 位置偏移量 */
		offset: Vec2;		
		/** !#en Circle radius
		!#zh 圆形半径 */
		radius: number;	
	}	
	/** !#en
	A distance joint constrains two points on two bodies
	to remain at a fixed distance from each other. You can view
	this as a massless, rigid rod.
	!#zh
	距离关节通过一个固定的长度来约束关节链接的两个刚体。你可以将它想象成一个无质量，坚固的木棍。 */
	export class DistanceJoint extends Joint {		
		/** !#en
		The distance separating the two ends of the joint.
		!#zh
		关节两端的距离 */
		distance: number;		
		/** !#en
		The spring frequency.
		!#zh
		弹性系数。 */
		frequency: number;		
		/** !#en
		The damping ratio.
		!#zh
		阻尼，表示关节变形后，恢复到初始状态受到的阻力。 */
		dampingRatio: number;	
	}	
	/** !#en
	Base class for joints to connect rigidbody.
	!#zh
	关节类的基类 */
	export class Joint extends Component {		
		/** !#en
		The anchor of the rigidbody.
		!#zh
		刚体的锚点。 */
		anchor: Vec2;		
		/** !#en
		The anchor of the connected rigidbody.
		!#zh
		关节另一端刚体的锚点。 */
		connectedAnchor: Vec2;		
		/** !#en
		The rigidbody to which the other end of the joint is attached.
		!#zh
		关节另一端链接的刚体 */
		connectedBody: RigidBody;		
		/** !#en
		Should the two rigid bodies connected with this joint collide with each other?
		!#zh
		链接到关节上的两个刚体是否应该相互碰撞？ */
		collideConnected: boolean;		
		/**
		!#en
		Apply current changes to joint, this will regenerate inner box2d joint.
		!#zh
		应用当前关节中的修改，调用此函数会重新生成内部 box2d 的关节。 
		*/
		apply(): void;		
		/**
		!#en
		Get the anchor point on rigidbody in world coordinates.
		!#zh
		获取刚体世界坐标系下的锚点。 
		*/
		getWorldAnchor(): Vec2;		
		/**
		!#en
		Get the anchor point on connected rigidbody in world coordinates.
		!#zh
		获取链接刚体世界坐标系下的锚点。 
		*/
		getWorldConnectedAnchor(): Vec2;		
		/**
		!#en
		Gets the reaction force of the joint.
		!#zh
		获取关节的反作用力。
		@param timeStep The time to calculate the reaction force for. 
		*/
		getReactionForce(timeStep: number): Vec2;		
		/**
		!#en
		Gets the reaction torque of the joint.
		!#zh
		获取关节的反扭矩。
		@param timeStep The time to calculate the reaction torque for. 
		*/
		getReactionTorque(timeStep: number): number;	
	}	
	/** !#en
	A motor joint is used to control the relative motion
	between two bodies. A typical usage is to control the movement
	of a dynamic body with respect to the ground.
	!#zh
	马达关节被用来控制两个刚体间的相对运动。
	一个典型的例子是用来控制一个动态刚体相对于地面的运动。 */
	export class MotorJoint extends Joint {		
		/** !#en
		The anchor of the rigidbody.
		!#zh
		刚体的锚点。 */
		anchor: Vec2;		
		/** !#en
		The anchor of the connected rigidbody.
		!#zh
		关节另一端刚体的锚点。 */
		connectedAnchor: Vec2;		
		/** !#en
		The linear offset from connected rigidbody to rigidbody.
		!#zh
		关节另一端的刚体相对于起始端刚体的位置偏移量 */
		linearOffset: Vec2;		
		/** !#en
		The angular offset from connected rigidbody to rigidbody.
		!#zh
		关节另一端的刚体相对于起始端刚体的角度偏移量 */
		angularOffset: number;		
		/** !#en
		The maximum force can be applied to rigidbody.
		!#zh
		可以应用于刚体的最大的力值 */
		maxForce: number;		
		/** !#en
		The maximum torque can be applied to rigidbody.
		!#zh
		可以应用于刚体的最大扭矩值 */
		maxTorque: number;		
		/** !#en
		The position correction factor in the range [0,1].
		!#zh
		位置矫正系数，范围为 [0, 1] */
		correctionFactor: number;	
	}	
	/** !#en
	A mouse joint is used to make a point on a body track a
	specified world point. This a soft constraint with a maximum
	force. This allows the constraint to stretch and without
	applying huge forces.
	Mouse Joint will auto register the touch event with the mouse region node,
	and move the choosed rigidbody in touch move event.
	Note : generally mouse joint only used in test bed.
	!#zh
	鼠标关节用于使刚体上的一个点追踪一个指定的世界坐标系下的位置。
	鼠标关节可以指定一个最大的里来施加一个柔和的约束。
	鼠标关节会自动使用 mouse region 节点来注册鼠标事件，并且在触摸移动事件中移动选中的刚体。
	注意：一般鼠标关节只在测试环境中使用。 */
	export class MouseJoint extends Joint {		
		/** !#en
		The anchor of the rigidbody.
		!#zh
		刚体的锚点。 */
		anchor: Vec2;		
		/** !#en
		The anchor of the connected rigidbody.
		!#zh
		关节另一端刚体的锚点。 */
		connectedAnchor: Vec2;		
		/** !#en
		The node used to register touch evnet.
		If this is null, it will be the joint's node.
		!#zh
		用于注册触摸事件的节点。
		如果没有设置这个值，那么将会使用关节的节点来注册事件。 */
		mouseRegion: Node;		
		/** !#en
		The target point.
		The mouse joint will move choosed rigidbody to target point.
		!#zh
		目标点，鼠标关节将会移动选中的刚体到指定的目标点 */
		target: Vec2;		
		/** !#en
		The spring frequency.
		!#zh
		弹簧系数。 */
		frequency: number;		
		/** !#en
		The damping ratio.
		!#zh
		阻尼，表示关节变形后，恢复到初始状态受到的阻力。 */
		0: number;		
		/** !#en
		The maximum force
		!#zh
		最大阻力值 */
		maxForce: number;	
	}	
	/** !#en
	A prismatic joint. This joint provides one degree of freedom: translation
	along an axis fixed in rigidbody. Relative rotation is prevented. You can
	use a joint limit to restrict the range of motion and a joint motor to
	drive the motion or to model joint friction.
	!#zh
	移动关节指定了只能在一个方向上移动刚体。
	你可以开启关节限制来设置刚体运行移动的间距，也可以开启马达来使用关节马达驱动刚体的运行。 */
	export class PrismaticJoint extends Joint {		
		/** !#en
		The local joint axis relative to rigidbody.
		!#zh
		指定刚体可以移动的方向。 */
		localAxisA: Vec2;		
		/** !#en
		The reference angle.
		!#zh
		相对角度 */
		referenceAngle: number;		
		/** !#en
		Enable joint distance limit?
		!#zh
		是否开启关节的距离限制？ */
		enableLimit: boolean;		
		/** !#en
		Enable joint motor?
		!#zh
		是否开启关节马达？ */
		enableMotor: boolean;		
		/** !#en
		The lower joint limit.
		!#zh
		刚体能够移动的最小值 */
		lowerLimit: number;		
		/** !#en
		The upper joint limit.
		!#zh
		刚体能够移动的最大值 */
		upperLimit: number;		
		/** !#en
		The maxium force can be applied to rigidbody to rearch the target motor speed.
		!#zh
		可以施加到刚体的最大力。 */
		maxMotorForce: number;		
		/** !#en
		The expected motor speed.
		!#zh
		期望的马达速度。 */
		motorSpeed: number;	
	}	
	/** !#en
	A revolute joint constrains two bodies to share a common point while they
	are free to rotate about the point. The relative rotation about the shared
	point is the joint angle. You can limit the relative rotation with
	a joint limit that specifies a lower and upper angle. You can use a motor
	to drive the relative rotation about the shared point. A maximum motor torque
	is provided so that infinite forces are not generated.
	!#zh
	旋转关节可以约束两个刚体围绕一个点来进行旋转。
	你可以通过开启关节限制来限制旋转的最大角度和最小角度。
	你可以通过开启马达来施加一个扭矩力来驱动这两个刚体在这一点上的相对速度。 */
	export class RevoluteJoint extends Joint {		
		/** !#en
		The reference angle.
		An angle between bodies considered to be zero for the joint angle.
		!#zh
		相对角度。
		两个物体之间角度为零时可以看作相等于关节角度 */
		referenceAngle: number;		
		/** !#en
		The lower angle.
		!#zh
		角度的最低限制。 */
		lowerAngle: number;		
		/** !#en
		The upper angle.
		!#zh
		角度的最高限制。 */
		upperAngle: number;		
		/** !#en
		The maxium torque can be applied to rigidbody to rearch the target motor speed.
		!#zh
		可以施加到刚体的最大扭矩。 */
		maxMotorTorque: number;		
		/** !#en
		The expected motor speed.
		!#zh
		期望的马达速度。 */
		motorSpeed: number;		
		/** !#en
		Enable joint limit?
		!#zh
		是否开启关节的限制？ */
		enableLimit: boolean;		
		/** !#en
		Enable joint motor?
		!#zh
		是否开启关节马达？ */
		enableMotor: boolean;		
		/**
		!#en
		Get the joint angle.
		!#zh
		获取关节角度。 
		*/
		getJointAngle(): number;	
	}	
	/** !#en
	A rope joint enforces a maximum distance between two points
	on two bodies. It has no other effect.
	Warning: if you attempt to change the maximum length during
	the simulation you will get some non-physical behavior.
	!#zh
	绳子关节只指定两个刚体间的最大距离，没有其他的效果。
	注意：如果你试图动态修改关节的长度，这有可能会得到一些意外的效果。 */
	export class RopeJoint extends Joint {		
		/** !#en
		The max length.
		!#zh
		最大长度。 */
		maxLength: number;	
	}	
	/** !#en
	A weld joint essentially glues two bodies together. A weld joint may
	distort somewhat because the island constraint solver is approximate.
	!#zh
	熔接关节相当于将两个刚体粘在了一起。
	熔接关节可能会使某些东西失真，因为约束求解器算出的都是近似值。 */
	export class WeldJoint extends Joint {		
		/** !#en
		The reference angle.
		!#zh
		相对角度。 */
		referenceAngle: number;		
		/** !#en
		The frequency.
		!#zh
		弹性系数。 */
		frequency: number;		
		/** !#en
		The damping ratio.
		!#zh
		阻尼，表示关节变形后，恢复到初始状态受到的阻力。 */
		0: number;	
	}	
	/** !#en
	A wheel joint. This joint provides two degrees of freedom: translation
	along an axis fixed in bodyA and rotation in the plane. You can use a joint motor to drive
	the rotation or to model rotational friction.
	This joint is designed for vehicle suspensions.
	!#zh
	轮子关节提供两个维度的自由度：旋转和沿着指定方向上位置的移动。
	你可以通过开启关节马达来使用马达驱动刚体的旋转。
	轮组关节是专门为机动车类型设计的。 */
	export class WheelJoint extends Joint {		
		/** !#en
		The local joint axis relative to rigidbody.
		!#zh
		指定刚体可以移动的方向。 */
		localAxisA: Vec2;		
		/** !#en
		The maxium torque can be applied to rigidbody to rearch the target motor speed.
		!#zh
		可以施加到刚体的最大扭矩。 */
		maxMotorTorque: number;		
		/** !#en
		The expected motor speed.
		!#zh
		期望的马达速度。 */
		motorSpeed: number;		
		/** !#en
		Enable joint motor?
		!#zh
		是否开启关节马达？ */
		enableMotor: boolean;		
		/** !#en
		The spring frequency.
		!#zh
		弹性系数。 */
		frequency: number;		
		/** !#en
		The damping ratio.
		!#zh
		阻尼，表示关节变形后，恢复到初始状态受到的阻力。 */
		dampingRatio: number;	
	}	
	/** Rigid body interface */
	export class IRigidBody {		
		rigidBody: RigidBody3D;		
		mass: number;		
		linearDamping: number;		
		angularDamping: number;		
		isKinematic: boolean;		
		useGravity: boolean;		
		fixedRotation: boolean;		
		linearFactor: IVec3Like;		
		angularFactor: IVec3Like;		
		allowSleep: boolean;		
		isAwake: boolean;		
		isSleepy: boolean;		
		isSleeping: boolean;		
		wakeUp(): void;		
		sleep(): void;		
		/**
		
		@param out out 
		*/
		getLinearVelocity(out: IVec3Like): void;		
		/**
		
		@param out out 
		*/
		setLinearVelocity(out: IVec3Like): void;		
		/**
		
		@param out out 
		*/
		getAngularVelocity(out: IVec3Like): void;		
		/**
		
		@param out out 
		*/
		setAngularVelocity(out: IVec3Like): void;		
		/**
		
		@param force force
		@param relativePoint relativePoint 
		*/
		applyForce(force: IVec3Like, relativePoint: IVec3Like): void;		
		/**
		
		@param force force
		@param relativePoint relativePoint 
		*/
		applyLocalForce(force: IVec3Like, relativePoint: IVec3Like): void;		
		/**
		
		@param force force
		@param relativePoint relativePoint 
		*/
		applyImpulse(force: IVec3Like, relativePoint: IVec3Like): void;		
		/**
		
		@param force force
		@param relativePoint relativePoint 
		*/
		applyLocalImpulse(force: IVec3Like, relativePoint: IVec3Like): void;		
		/**
		
		@param torque torque 
		*/
		applyTorque(torque: IVec3Like): void;		
		/**
		
		@param torque torque 
		*/
		applyLocalTorque(torque: IVec3Like): void;	
	}	
	/** Class has x y z properties */
	export class IVec3Like {		
		x: number;		
		y: number;		
		z: number;	
	}	
	/** Class has x y z w properties */
	export class IQuatLike {		
		x: number;		
		y: number;		
		z: number;		
		w: number;	
	}	
	/** !#en Base shape interface. */
	export class IBaseShape {		
		collider: Collider3D;		
		attachedRigidBody: RigidBody3D|void;		
		material: any;		
		isTrigger: boolean;		
		center: IVec3Like;	
	}	
	/** !#en box shape interface */
	export class IBoxShape {		
		size: IVec3Like;	
	}	
	/** !#en Sphere shape interface */
	export class ISphereShape {		
		radius: number;	
	}	
	/** Ray cast options */
	export class IRaycastOptions {		
		groupIndex: number;		
		queryTrigger: boolean;		
		maxDistance: number;	
	}	
	/** Collision detect */
	export class ICollisionDetect {		
		/**
		Ray cast, and return information of the closest hit.
		@param worldRay worldRay
		@param options options
		@param out out 
		*/
		raycastClosest(worldRay: geomUtils.Ray, options: IRaycastOptions, out: PhysicsRayResult): boolean;		
		/**
		Ray cast against all bodies. The provided callback will be executed for each hit with a RaycastResult as single argument.
		@param worldRay worldRay
		@param options options
		@param pool pool
		@param resultes resultes 
		*/
		raycast(worldRay: geomUtils.Ray, options: IRaycastOptions, pool: RecyclePool, resultes: PhysicsRayResult[]): boolean;	
	}	
	/** Physics world interface */
	export class IPhysicsWorld {	
	}	
	/** !#en The rigid body type
	!#zh 刚体类型 */
	export enum ERigidBodyType {		
		DYNAMIC = 0,
		STATIC = 0,
		KINEMATIC = 0,	
	}	
	/** !#en
	Trigger event
	!#zh
	触发事件。 */
	export class ITriggerEvent {		
		/** !#en
		The type of event fired
		!#zh
		触发的事件类型 */
		type: string;		
		/** !#en
		Triggers its own collider in the event
		!#zh
		触发事件中的自己的碰撞器 */
		selfCollider: Collider3D;		
		/** !#en
		Triggers another collider in the event
		!#zh
		触发事件中的另一个碰撞器 */
		otherCollider: Collider3D;	
	}	
	/** !#en
	Collision information for collision events.
	!#zh
	碰撞事件的碰撞信息。 */
	export class IContactEquation {		
		/** !#en
		The collision point A in the collision information.
		!#zh
		碰撞信息中的碰撞点A。 */
		contactA: Vec3;		
		/** !#en
		Collision point B in collision information.
		!#zh
		碰撞信息中的碰撞点B。 */
		contactB: Vec3;		
		/** !#en
		Normals in collision information.
		!#zh
		碰撞信息中的法线。 */
		normal: Vec3;	
	}	
	/** !#en
	Collision events.
	!#zh
	碰撞事件。 */
	export class ICollisionEvent {		
		/** !#en
		Event type of collision.
		!#zh
		碰撞的事件类型。 */
		type: string;		
		/** !#en
		Collider of its own in collision.
		!#zh
		碰撞中的自己的碰撞器。 */
		selfCollider: Collider3D;		
		/** !#en
		Another collider in the collision.
		!#zh
		碰撞中的另一个碰撞器。 */
		otherCollider: Collider3D;		
		/** !#en
		Information about all the points of impact in the collision.
		!#zh
		碰撞中的所有碰撞点的信息。 */
		contacts: IContactEquation[];	
	}	
	/** !#en
	Physical systems manager.
	!#zh
	物理系统管理器。 */
	export class Physics3DManager {		
		/** !#en
		Gets or sets whether to enable physical systems, which are not enabled by default.
		!#zh
		获取或设置是否启用物理系统，默认不启用。 */
		enabled: boolean;		
		/** !#en
		Gets or sets whether the physical system allows automatic sleep, which defaults to true.
		!#zh
		获取或设置物理系统是否允许自动休眠，默认为 true */
		allowSleep: boolean;		
		/** !#en
		Gets or sets the maximum number of child steps per frame simulated.
		!#zh
		获取或设置每帧模拟的最大子步数。 */
		maxSubStep: number;		
		/** !#en
		Gets or sets the fixed time consumed by each simulation step.
		!#zh
		获取或设置每步模拟消耗的固定时间。 */
		deltaTime: number;		
		/** !#en
		Gets or sets whether to use a fixed time step.
		!#zh
		获取或设置是否使用固定的时间步长。 */
		useFixedTime: boolean;		
		/** !#en
		Gets or sets the gravity value of the physical world, by default (0, -10, 0)
		!#zh
		获取或设置物理世界的重力数值，默认为 (0, -10, 0) */
		gravity: Vec3;		
		/** !#en
		Gets the global default physical material. Note that builtin is null
		!#zh
		获取全局的默认物理材质，注意：builtin 时为 null */
		defaultMaterial: PhysicsMaterial|void;		
		/**
		!#en
		A physical system simulation is performed once and will now be performed automatically once per frame.
		!#zh
		执行一次物理系统的模拟，目前将在每帧自动执行一次。
		@param deltaTime The time difference from the last execution is currently elapsed per frame 
		*/
		update(deltaTime: number): void;		
		/**
		!#en Detect all collision boxes and return all detected results, or null if none is detected. Note that the return value is taken from the object pool, so do not save the result reference or modify the result.
		!#zh 检测所有的碰撞盒，并返回所有被检测到的结果，若没有检测到，则返回空值。注意返回值是从对象池中取的，所以请不要保存结果引用或者修改结果。
		@param worldRay A ray in world space
		@param groupIndexOrName Collision group index or group name
		@param maxDistance Maximum detection distance
		@param queryTrigger Detect trigger or not 
		*/
		raycast(worldRay: geomUtils.Ray, groupIndexOrName: number|string, maxDistance: number, queryTrigger: boolean): PhysicsRayResult[];		
		/**
		!#en Detect all collision boxes and return the detection result with the shortest ray distance. If not, return null value. Note that the return value is taken from the object pool, so do not save the result reference or modify the result.
		!#zh 检测所有的碰撞盒，并返回射线距离最短的检测结果，若没有，则返回空值。注意返回值是从对象池中取的，所以请不要保存结果引用或者修改结果。
		@param worldRay A ray in world space
		@param groupIndexOrName Collision group index or group name
		@param maxDistance Maximum detection distance
		@param queryTrigger Detect trigger or not 
		*/
		raycastClosest(worldRay: geomUtils.Ray, groupIndexOrName: number|string, maxDistance: number, queryTrigger: boolean): PhysicsRayResult;	
	}	
	/** !#en
	Used to store physical ray detection results
	!#zh
	用于保存物理射线检测结果 */
	export class PhysicsRayResult {		
		/** !#en
		Hit the point
		!#zh
		击中点 */
		hitPoint: Vec3;		
		/** !#en
		Distance
		!#zh
		距离 */
		distance: number;		
		/** !#en
		Hit the collision box
		!#zh
		击中的碰撞盒 */
		collider: Collider3D;		
		/**
		!#en
		Set up ray. This method is used internally by the engine. Do not call it from an external script
		!#zh
		设置射线，此方法由引擎内部使用，请勿在外部脚本调用
		@param hitPoint hitPoint
		@param distance distance
		@param collider collider 
		*/
		_assign(hitPoint: Vec3, distance: number, collider: Collider3D): void;		
		/**
		!#en
		Clone
		!#zh
		克隆 
		*/
		clone(): void;	
	}	
	/** !#en The shape module of 3d particle.
	!#zh 3D 粒子的发射形状模块 */
	export class ShapeModule {		
		/** !#en The enable of shapeModule.
		!#zh 是否启用 */
		enable: boolean;		
		/** !#en Particle emitter type.
		!#zh 粒子发射器类型。 */
		shapeType: shapeModule.ShapeType;		
		/** !#en The emission site of the particle.
		!#zh 粒子从发射器哪个部位发射。 */
		emitFrom: shapeModule.EmitLocation;		
		/** !#en Particle emitter radius.
		!#zh 粒子发射器半径。 */
		radius: number;		
		/** !#en Particle emitter emission position (not valid for Box type emitters)：<bg>
		- 0 means emitted from the surface;
		- 1 means launch from the center;
		- 0 ~ 1 indicates emission from the center to the surface.
		!#zh 粒子发射器发射位置（对 Box 类型的发射器无效）：<bg>
		- 0 表示从表面发射；
		- 1 表示从中心发射；
		- 0 ~ 1 之间表示在中心到表面之间发射。 */
		radiusThickness: number;		
		/** !#en The angle between the axis of the cone and the generatrix<bg>
		Determines the opening and closing of the cone launcher
		!#zh 圆锥的轴与母线的夹角<bg>。
		决定圆锥发射器的开合程度。 */
		angle: number;		
		/** !#en Particle emitters emit in a fan-shaped range.
		!#zh 粒子发射器在一个扇形范围内发射。 */
		arc: number;		
		/** !#en How particles are emitted in the sector range.
		!#zh 粒子在扇形范围内的发射方式。 */
		arcMode: shapeModule.ArcMode;		
		/** !#en Controls the discrete intervals around the arcs where particles might be generated.
		!#zh 控制可能产生粒子的弧周围的离散间隔。 */
		arcSpread: number;		
		/** !#en The speed at which particles are emitted around the circumference.
		!#zh 粒子沿圆周发射的速度。 */
		arcSpeed: CurveRange;		
		/** !#en Axis length from top of cone to bottom of cone <bg>.
		Determines the height of the cone emitter.
		!#zh 圆锥顶部截面距离底部的轴长<bg>。
		决定圆锥发射器的高度。 */
		length: number;		
		/** !#en Particle emitter emission location (for box-type particle emitters).
		!#zh 粒子发射器发射位置（针对 Box 类型的粒子发射器。 */
		boxThickness: Vec3;		
		/** !#en Particle Emitter Position
		!#zh 粒子发射器位置。 */
		position: Vec3;		
		/** !#en Particle emitter rotation angle.
		!#zh 粒子发射器旋转角度。 */
		rotation: Vec3;		
		/** !#en Particle emitter scaling
		!#zh 粒子发射器缩放比例。 */
		scale: Vec3;		
		/** !#en The direction of particle movement is determined based on the initial direction of the particles.
		!#zh 根据粒子的初始方向决定粒子的移动方向。 */
		alignToDirection: boolean;		
		/** !#en Set particle generation direction randomly.
		!#zh 粒子生成方向随机设定。 */
		randomDirectionAmount: number;		
		/** !#en Interpolation between the current emission direction and the direction from the current position to the center of the node.
		!#zh 表示当前发射方向与当前位置到结点中心连线方向的插值。 */
		sphericalDirectionAmount: number;	
	}	
	/** !#en The color over time module of 3d particle.
	!#zh 3D 粒子颜色变化模块 */
	export class ColorOvertimeModule {		
		/** !#en The enable of ColorOvertimeModule.
		!#zh 是否启用 */
		enable: boolean;	
	}	
	/** !#en The curve range of target value.
	!#zh 目标值的曲线范围 */
	export class CurveRange {		
		/** !#en Curve type.
		!#zh 曲线类型。 */
		mode: debug.DebugMode;		
		/** !#en The curve to use when mode is Curve.
		!#zh 当 mode 为 Curve 时，使用的曲线。 */
		curve: AnimationCurve;		
		/** !#en The lower limit of the curve to use when mode is TwoCurves
		!#zh 当 mode 为 TwoCurves 时，使用的曲线下限。 */
		curveMin: AnimationCurve;		
		/** !#en The upper limit of the curve to use when mode is TwoCurves
		!#zh 当 mode 为 TwoCurves 时，使用的曲线上限。 */
		curveMax: AnimationCurve;		
		/** !#en When mode is Constant, the value of the curve.
		!#zh 当 mode 为 Constant 时，曲线的值。 */
		constant: number;		
		/** !#en The lower limit of the curve to use when mode is TwoConstants
		!#zh 当 mode 为 TwoConstants 时，曲线的下限。 */
		constantMin: number;		
		/** !#en The upper limit of the curve to use when mode is TwoConstants
		!#zh 当 mode 为 TwoConstants 时，曲线的上限。 */
		constantMax: number;		
		/** !#en Coefficients applied to curve interpolation.
		!#zh 应用于曲线插值的系数。 */
		multiplier: number;	
	}	
	/** !#en The force over time module of 3d particle.
	!#zh 3D 粒子的加速度模块 */
	export class ForceOvertimeModule {		
		/** !#en The enable of ColorOvertimeModule.
		!#zh 是否启用 */
		enable: boolean;		
		/** !#en Coordinate system used in acceleration calculation.
		!#zh 加速度计算时采用的坐标系。 */
		space: Space;		
		/** !#en X-axis acceleration component.
		!#zh X 轴方向上的加速度分量。 */
		x: CurveRange;		
		/** !#en Y-axis acceleration component.
		!#zh Y 轴方向上的加速度分量。 */
		y: CurveRange;		
		/** !#en Z-axis acceleration component.
		!#zh Z 轴方向上的加速度分量。 */
		z: CurveRange;	
	}	
	/** !#en The gradient range of color.
	!#zh 颜色值的渐变范围 */
	export class GradientRange {		
		/** !#en Gradient type.
		!#zh 渐变色类型。 */
		mode: debug.DebugMode;		
		/** !#en The color when mode is Color.
		!#zh 当 mode 为 Color 时的颜色。 */
		color: Color;		
		/** !#en Lower color limit when mode is TwoColors.
		!#zh 当 mode 为 TwoColors 时的颜色下限。 */
		colorMin: Color;		
		/** !#en Upper color limit when mode is TwoColors.
		!#zh 当 mode 为 TwoColors 时的颜色上限。 */
		colorMax: Color;		
		/** !#en Color gradient when mode is Gradient
		!#zh 当 mode 为 Gradient 时的颜色渐变。 */
		gradient: Gradient;		
		/** !#en Lower color gradient limit when mode is TwoGradients.
		!#zh 当 mode 为 TwoGradients 时的颜色渐变下限。 */
		gradientMin: Gradient;		
		/** !#en Upper color gradient limit when mode is TwoGradients.
		!#zh 当 mode 为 TwoGradients 时的颜色渐变上限。 */
		gradientMax: Gradient;	
	}	
	/** !#en The color key of gradient.
	!#zh color 关键帧 */
	export class ColorKey {	
	}	
	/** !#en The alpha key of gradient.
	!#zh alpha 关键帧 */
	export class AlphaKey {	
	}	
	/** !#en The gradient data of color.
	!#zh 颜色渐变数据 */
	export class Gradient {	
	}	
	/** !#en The limit velocity module of 3d particle.
	!#zh 3D 粒子的限速模块 */
	export class LimitVelocityOvertimeModule {		
		/** !#en The enable of LimitVelocityOvertimeModule.
		!#zh 是否启用 */
		enable: boolean;		
		/** !#en The coordinate system used when calculating the lower speed limit.
		!#zh 计算速度下限时采用的坐标系。 */
		space: Space;		
		/** !#en Whether to limit the three axes separately.
		!#zh 是否三个轴分开限制。 */
		separateAxes: boolean;		
		/** !#en Lower speed limit
		!#zh 速度下限。 */
		limit: CurveRange;		
		/** !#en Lower speed limit in X direction.
		!#zh X 轴方向上的速度下限。 */
		limitX: CurveRange;		
		/** !#en Lower speed limit in Y direction.
		!#zh Y 轴方向上的速度下限。 */
		limitY: CurveRange;		
		/** !#en Lower speed limit in Z direction.
		!#zh Z 轴方向上的速度下限。 */
		limitZ: CurveRange;		
		/** !#en Interpolation of current speed and lower speed limit.
		!#zh 当前速度与速度下限的插值。 */
		dampen: number;	
	}	
	/** !#en The optimized curve.
	!#zh 优化曲线 */
	export class OptimizedCurve {	
	}	
	/** !#en The rotation module of 3d particle.
	!#zh 3D 粒子的旋转模块 */
	export class RotationOvertimeModule {		
		/** !#en The enable of RotationOvertimeModule.
		!#zh 是否启用 */
		enable: boolean;		
		/** !#en Whether to set the rotation of three axes separately (not currently supported)
		!#zh 是否三个轴分开设定旋转（暂不支持）。 */
		separateAxes: boolean;		
		/** !#en Set rotation around X axis.
		!#zh 绕 X 轴设定旋转。 */
		x: CurveRange;		
		/** !#en Set rotation around Y axis.
		!#zh 绕 Y 轴设定旋转。 */
		y: CurveRange;		
		/** !#en Set rotation around Z axis.
		!#zh 绕 Z 轴设定旋转。 */
		z: CurveRange;	
	}	
	/** !#en The size module of 3d particle.
	!#zh 3D 粒子的大小模块 */
	export class SizeOvertimeModule {		
		/** !#en The enable of SizeOvertimeModule.
		!#zh 是否启用 */
		enable: boolean;		
		/** !#en Decide whether to control particle size independently on each axis.
		!#zh 决定是否在每个轴上独立控制粒子大小。 */
		separateAxes: boolean;		
		/** !#en Define a curve to determine the size change of particles during their life cycle.
		!#zh 定义一条曲线来决定粒子在其生命周期中的大小变化。 */
		size: CurveRange;		
		/** !#en Defines a curve to determine the size change of particles in the X-axis direction during their life cycle.
		!#zh 定义一条曲线来决定粒子在其生命周期中 X 轴方向上的大小变化。 */
		x: CurveRange;		
		/** !#en Defines a curve to determine the size change of particles in the Y-axis direction during their life cycle.
		!#zh 定义一条曲线来决定粒子在其生命周期中 Y 轴方向上的大小变化。 */
		y: CurveRange;		
		/** !#en Defines a curve to determine the size change of particles in the Z-axis direction during their life cycle.
		!#zh 定义一条曲线来决定粒子在其生命周期中 Z 轴方向上的大小变化。 */
		z: CurveRange;	
	}	
	/** !#en The texture animation module of 3d particle.
	!#zh 3D 粒子的贴图动画模块 */
	export class TextureAnimationModule {		
		/** !#en The enable of TextureAnimationModule.
		!#zh 是否启用 */
		enable: boolean;		
		/** !#en Set the type of particle map animation (only supports Grid mode for the time being)
		!#zh 设定粒子贴图动画的类型（暂只支持 Grid 模式。 */
		mode: debug.DebugMode;		
		/** !#en Animation frames in X direction.
		!#zh X 方向动画帧数。 */
		numTilesX: number;		
		/** !#en Animation frames in Y direction.
		!#zh Y 方向动画帧数。 */
		numTilesY: number;		
		/** !#en The way of the animation plays.
		!#zh 动画播放方式。 */
		animation: Animation;		
		/** !#en Randomly select a line from the animated map to generate the animation. <br>
		This option only takes effect when the animation playback mode is SingleRow.
		!#zh 随机从动画贴图中选择一行以生成动画。<br>
		此选项仅在动画播放方式为 SingleRow 时生效。 */
		randomRow: boolean;		
		/** !#en Select specific lines from the animation map to generate the animation. <br>
		This option is only available when the animation playback mode is SingleRow and randomRow is disabled.
		!#zh 从动画贴图中选择特定行以生成动画。<br>
		此选项仅在动画播放方式为 SingleRow 时且禁用 randomRow 时可用。 */
		rowIndex: number;		
		/** !#en Frame and time curve of animation playback in one cycle.
		!#zh 一个周期内动画播放的帧与时间变化曲线。 */
		frameOverTime: CurveRange;		
		/** !#en Play from which frames, the time is the life cycle of the entire particle system.
		!#zh 从第几帧开始播放，时间为整个粒子系统的生命周期。 */
		startFrame: CurveRange;		
		/** !#en Number of playback loops in a life cycle.
		!#zh 一个生命周期内播放循环的次数。 */
		cycleCount: number;	
	}	
	/** !#en The velocity module of 3d particle.
	!#zh 3D 粒子的速度模块 */
	export class VelocityOvertimeModule {		
		/** !#en The enable of VelocityOvertimeModule.
		!#zh 是否启用 */
		enable: boolean;		
		/** !#en Coordinate system used in speed calculation.
		!#zh 速度计算时采用的坐标系。 */
		space: Space;		
		/** !#en Velocity component in X axis direction
		!#zh X 轴方向上的速度分量。 */
		x: CurveRange;		
		/** !#en Velocity component in Y axis direction
		!#zh Y 轴方向上的速度分量。 */
		y: CurveRange;		
		/** !#en Velocity component in Z axis direction
		!#zh Z 轴方向上的速度分量。 */
		z: CurveRange;		
		/** !#en Speed correction factor (only supports CPU particles).
		!#zh 速度修正系数（只支持 CPU 粒子）。 */
		speedModifier: CurveRange;	
	}	
	/** !#en The trail module of 3d particle.
	!#zh 3D 粒子拖尾模块 */
	export class TrailModule {		
		/** !#en The enable of trailModule.
		!#zh 是否启用 */
		enable: boolean;		
		/** !#en Sets how particles generate trajectories.
		!#zh 设定粒子生成轨迹的方式。 */
		mode: trailModule.TrailMode;		
		/** !#en Life cycle of trajectory.
		!#zh 轨迹存在的生命周期。 */
		lifeTime: CurveRange;		
		/** !#en Minimum spacing between each track particle
		!#zh 每个轨迹粒子之间的最小间距。 */
		minParticleDistance: number;		
		/** !#en The coordinate system of trajectories.
		!#zh 轨迹设定时的坐标系。 */
		space: Space;		
		/** !#en Whether the particle itself exists.
		!#zh 粒子本身是否存在。 */
		existWithParticles: boolean;		
		/** !#en Set the texture fill method
		!#zh 设定纹理填充方式。 */
		textureMode: trailModule.TextureMode;		
		/** !#en Whether to use particle width
		!#zh 是否使用粒子的宽度。 */
		widthFromParticle: boolean;		
		/** !#en Curves that control track length
		!#zh 控制轨迹长度的曲线。 */
		widthRatio: CurveRange;		
		/** !#en Whether to use particle color
		!#zh 是否使用粒子的颜色。 */
		colorFromParticle: boolean;		
		/** !#en The color of trajectories.
		!#zh 轨迹的颜色。 */
		colorOverTrail: GradientRange;		
		/** !#en Trajectories color over time.
		!#zh 轨迹随时间变化的颜色。 */
		colorOvertime: GradientRange;	
	}	
	/** !#en Manage Dynamic Atlas Manager. Dynamic Atlas Manager is used for merging textures at runtime, see [Dynamic Atlas](https://docs.cocos.com/creator/manual/en/advanced-topics/dynamic-atlas.html) for details.
	!#zh 管理动态图集。动态图集用于在运行时对贴图进行合并，详见 [动态合图](https://docs.cocos.com/creator/manual/zh/advanced-topics/dynamic-atlas.html)。 */
	export class DynamicAtlasManager {		
		/** !#en Enable or disable the dynamic atlas, see [Dynamic Atlas](https://docs.cocos.com/creator/manual/en/advanced-topics/dynamic-atlas.html) for details.
		!#zh 开启或者关闭动态图集，详见 [动态合图](https://docs.cocos.com/creator/manual/zh/advanced-topics/dynamic-atlas.html)。 */
		enabled: boolean;		
		/** !#en The maximum number of atlas that can be created.
		!#zh 可以创建的最大图集数量。 */
		maxAtlasCount: number;		
		/** !#en Is enable textureBleeding.
		!#zh 是否开启 textureBleeding */
		textureBleeding: boolean;		
		/** !#en The size of the atlas that was created
		!#zh 创建的图集的宽高 */
		textureSize: number;		
		/** !#en The maximum size of the picture that can be added to the atlas.
		!#zh 可以添加进图集的图片的最大尺寸。 */
		maxFrameSize: number;		
		/** !#en The minimum size of the picture that can be added to the atlas.
		!#zh 可以添加进图集的图片的最小尺寸。 */
		minFrameSize: number;		
		/**
		!#en Append a sprite frame into the dynamic atlas.
		!#zh 添加碎图进入动态图集。
		@param spriteFrame spriteFrame 
		*/
		insertSpriteFrame(spriteFrame: SpriteFrame): void;		
		/**
		!#en Resets all dynamic atlas, and the existing ones will be destroyed.
		!#zh 重置所有动态图集，已有的动态图集会被销毁。 
		*/
		reset(): void;		
		/**
		!#en Displays all the dynamic atlas in the current scene, which you can use to view the current atlas state.
		!#zh 在当前场景中显示所有动态图集，可以用来查看当前的合图状态。
		@param show show 
		*/
		showDebug(show: boolean): void;	
	}	
	/** Physics material. */
	export class PhysicsMaterial extends Asset {		
		/** Friction for this material.
		If non-negative, it will be used instead of the friction given by ContactMaterials.
		If there's no matching ContactMaterial, the value from .defaultContactMaterial in the World will be used. */
		friction: number;		
		/** Restitution for this material.
		If non-negative, it will be used instead of the restitution given by ContactMaterials.
		If there's no matching ContactMaterial, the value from .defaultContactMaterial in the World will be used */
		restitution: number;	
	}	
	/** !#en
	Each frame applies a constant force to a rigid body, depending on the RigidBody3D
	!#zh
	在每帧对一个刚体施加持续的力，依赖 RigidBody3D 组件 */
	export class ConstantForce extends Component {		
		/** !#en
		To get and set the force that the world is facing, use this.force = otherVec3
		!#zh
		获取和设置世界朝向的力, 设置时请用 this.force = otherVec3 的方式 */
		force: Vec3;		
		/** !#en
		Get and set the force of the local orientation, using this.localforce = otherVec3
		!#zh
		获取和设置本地朝向的力, 设置时请用 this.localForce = otherVec3 的方式 */
		localForce: Vec3;		
		/** !#zh
		获取和设置世界朝向的扭转力 */
		torque: Vec3;		
		/** !#en
		Get and set the torque of the local orientation using this.localtorque = otherVec3
		!#zh
		获取和设置本地朝向的扭转力, 设置时请用 this.localTorque = otherVec3 的方式 */
		localTorque: Vec3;	
	}	
	/** !#en
	Rigid body.
	!#zh
	刚体组件。 */
	export class RigidBody3D extends Component {		
		/** !#en
		Gets or sets whether sleep is allowed
		!#zh
		获取或设置是否允许休眠 */
		allowSleep: boolean;		
		/** !#en
		Gets or sets the mass of the rigid body.
		!#zh
		获取或设置刚体的质量。 */
		mass: number;		
		/** !#en
		Gets or sets linear damping.
		!#zh
		获取或设置线性阻尼。 */
		linearDamping: number;		
		/** !#en
		Gets or sets rotational damping.
		!#zh
		获取或设置旋转阻尼。 */
		angularDamping: number;		
		/** !#en
		Gets or sets whether the rigid body is controlled by a physical system.
		!#zh
		获取或设置刚体是否由物理系统控制运动。 */
		isKinematic: boolean;		
		/** !#en
		Gets or sets whether the rigid body uses gravity.
		!#zh
		获取或设置刚体是否使用重力。 */
		useGravity: boolean;		
		/** !#en
		Gets or sets whether the rigid body is fixed for rotation.
		!#zh
		获取或设置刚体是否固定旋转。 */
		fixedRotation: boolean;		
		/** !#en
		Gets or sets a factor of linear velocity that can be used to control the scaling of velocity in each axis direction.
		!#zh
		获取或设置线性速度的因子，可以用来控制每个轴方向上的速度的缩放。 */
		linearFactor: Vec3;		
		/** !#en
		Gets or sets the rotation speed factor that can be used to control the rotation speed scaling in each axis direction.
		!#zh
		获取或设置旋转速度的因子，可以用来控制每个轴方向上的旋转速度的缩放。 */
		angularFactor: Vec3;		
		/** !#en
		Gets whether the state is awakened.
		!#zh
		获取是否是唤醒的状态。 */
		isAwake: boolean;		
		/** !#en
		Gets whether or not a dormant state can be entered.
		!#zh
		获取是否是可进入休眠的状态。 */
		isSleepy: boolean;		
		/** !#en
		Gets whether the state is dormant.
		!#zh
		获取是否是正在休眠的状态。 */
		isSleeping: boolean;		
		/** !#en
		Gets physics engine rigid body object.
		!#zh
		获得物理引擎内部刚体对象 */
		rigidBody: IRigidBody;		
		/**
		!#en
		A force is applied to a rigid body at a point in world space.
		!#zh
		在世界空间中的某点上对刚体施加一个作用力。
		@param force force
		@param relativePoint The point of action, relative to the center of the rigid body 
		*/
		applyForce(force: Vec3, relativePoint: Vec3): void;		
		/**
		!#en
		Apply a force on the rigid body at a point in local space.
		!#zh
		在本地空间中的某点上对刚体施加一个作用力。
		@param force force
		@param localPoint Point of application 
		*/
		applyLocalForce(force: Vec3, localPoint: Vec3): void;		
		/**
		!#en
		Apply an impulse to a rigid body at a point in world space.
		!#zh
		在世界空间的某点上对刚体施加一个冲量。
		@param impulse impulse
		@param relativePoint The point of action, relative to the center of the rigid body 
		*/
		applyImpulse(impulse: Vec3, relativePoint: Vec3): void;		
		/**
		!#en
		Apply an impulse to the rigid body at a point in local space.
		!#zh
		在本地空间的某点上对刚体施加一个冲量。
		@param impulse impulse
		@param localPoint Point of application 
		*/
		applyLocalImpulse(impulse: Vec3, localPoint: Vec3): void;		
		/**
		!#en
		Apply a torque to the rigid body.
		!#zh
		对刚体施加扭转力。
		@param torque torque 
		*/
		applyTorque(torque: Vec3): void;		
		/**
		!#en
		Apply a local torque to the rigid body.
		!#zh
		对刚体施加本地扭转力。
		@param torque torque 
		*/
		applyLocalTorque(torque: Vec3): void;		
		/**
		!#en
		Awaken the rigid body.
		!#zh
		唤醒刚体。 
		*/
		wakeUp(): void;		
		/**
		!#en
		Dormant rigid body.
		!#zh
		休眠刚体。 
		*/
		sleep(): void;		
		/**
		!#en
		Get linear velocity.
		!#zh
		获取线性速度。
		@param out out 
		*/
		getLinearVelocity(out: Vec3): void;		
		/**
		!#en
		Set linear speed.
		!#zh
		设置线性速度。
		@param value value 
		*/
		setLinearVelocity(value: Vec3): void;		
		/**
		!#en
		Gets the rotation speed.
		!#zh
		获取旋转速度。
		@param out out 
		*/
		getAngularVelocity(out: Vec3): void;		
		/**
		!#en
		Set rotation speed.
		!#zh
		设置旋转速度。
		@param value value 
		*/
		setAngularVelocity(value: Vec3): void;	
	}	
	/** !#en
	Physics box collider
	!#zh
	物理盒子碰撞器 */
	export class BoxCollider3D extends Collider3D {		
		/** !#en
		Get or set the size of the box, in local space.
		!#zh
		获取或设置盒的大小。 */
		size: Vec3;		
		boxShape: IBoxShape;	
	}	
	/** !#en
	The base class of the collider
	!#zh
	碰撞器的基类 */
	export class Collider3D extends Component implements EventTarget {		
		sharedMaterial: PhysicsMaterial;		
		/** !#en
		get or set the collider is trigger, this will be always trigger if using builtin.
		!#zh
		获取或设置碰撞器是否为触发器 */
		isTrigger: boolean;		
		/** !#en
		get or set the center of the collider, in local space.
		!#zh
		获取或设置碰撞器的中心点。 */
		center: Vec3;		
		/** !#en
		get the collider attached rigidbody, this may be null
		!#zh
		获取碰撞器所绑定的刚体组件，可能为 null */
		attachedRigidbody: RigidBody3D|void;		
		/** !#en
		get collider shape
		!#zh
		获取碰撞器形状 */
		shape: IBaseShape;		
		/**
		!#en
		Register an callback of a specific event type on the EventTarget.
		This type of event should be triggered via `emit`.
		!#zh
		注册事件目标的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
		@param type The type of collider event can be 'trigger-enter', 'trigger-stay', 'trigger-exit' or 'collision-enter', 'collision-stay', 'collision-exit'.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		
		@example 
		```js
		eventTarget.on('fire', function (event) {
		    // event is ITriggerEvent or ICollisionEvent
		}, node);
		``` 
		*/
		on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T;		
		/**
		!#en
		Removes the listeners previously registered with the same type, callback, target and or useCapture,
		if only type is passed as parameter, all listeners registered with that type will be removed.
		!#zh
		删除之前用同类型，回调，目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
		@param type The type of collider event can be 'trigger-enter', 'trigger-stay', 'trigger-exit' or 'collision-enter', 'collision-stay', 'collision-exit'.
		@param callback The callback to remove.
		@param target The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
		
		@example 
		```js
		// register fire eventListener
		var callback = eventTarget.on('fire', function () {
		    cc.log("fire in the hole");
		}, target);
		// remove fire event listener
		eventTarget.off('fire', callback, target);
		// remove all fire event listeners
		eventTarget.off('fire');
		``` 
		*/
		off(type: string, callback?: Function, target?: any): void;		
		/**
		!#en
		Register an callback of a specific event type on the EventTarget,
		the callback will remove itself after the first time it is triggered.
		!#zh
		注册事件目标的特定事件类型回调，回调会在第一时间被触发后删除自身。
		@param type The type of collider event can be 'trigger-enter', 'trigger-stay', 'trigger-exit' or 'collision-enter', 'collision-stay', 'collision-exit'.
		@param callback The callback that will be invoked when the event is dispatched.
		                             The callback is ignored if it is a duplicate (the callbacks are unique).
		@param target The target (this object) to invoke the callback, can be null
		
		@example 
		```js
		eventTarget.once('fire', function (event) {
		    // event is ITriggerEvent or ICollisionEvent
		}, node);
		``` 
		*/
		once(type: string, callback: (event: ITriggerEvent|ICollisionEvent) => void, target?: any): void;		
		/**
		!#en Checks whether the EventTarget object has any callback registered for a specific type of event.
		!#zh 检查事件目标对象是否有为特定类型的事件注册的回调。
		@param type The type of event. 
		*/
		hasEventListener(type: string): boolean;		
		/**
		!#en Removes all callbacks previously registered with the same target (passed as parameter).
		This is not for removing all listeners in the current event target,
		and this is not for removing all listeners the target parameter have registered.
		It's only for removing all listeners (callback and target couple) registered on the current event target by the target parameter.
		!#zh 在当前 EventTarget 上删除指定目标（target 参数）注册的所有事件监听器。
		这个函数无法删除当前 EventTarget 的所有事件监听器，也无法删除 target 参数所注册的所有事件监听器。
		这个函数只能删除 target 参数在当前 EventTarget 上注册的所有事件监听器。
		@param target The target to be searched for all related listeners 
		*/
		targetOff(target: any): void;		
		/**
		!#en
		Send an event with the event object.
		!#zh
		通过事件对象派发事件
		@param event event 
		*/
		dispatchEvent(event: Event): void;	
	}	
	/** !#en
	Physics sphere collider
	!#zh
	物理球碰撞器 */
	export class SphereCollider3D extends Collider3D {		
		/** !#en
		Get or set the radius of the sphere.
		!#zh
		获取或设置球的半径。 */
		radius: number;		
		sphereShape: ISphereShape;	
	}	
	/****************************************************
	* TiledMap
	*****************************************************/
	
	export namespace TiledMap {		
		/** !#en The orientation of tiled map.
		!#zh Tiled Map 地图方向。 */
		export enum Orientation {			
			ORTHO = 0,
			HEX = 0,
			ISO = 0,		
		}	
	}
		
	/****************************************************
	* TiledMap
	*****************************************************/
	
	export namespace TiledMap {		
		/** The property type of tiled map. */
		export enum Property {			
			NONE = 0,
			MAP = 0,
			LAYER = 0,
			OBJECTGROUP = 0,
			OBJECT = 0,
			TILE = 0,		
		}	
	}
		
	/****************************************************
	* TiledMap
	*****************************************************/
	
	export namespace TiledMap {		
		/** The tile flags of tiled map. */
		export enum TileFlag {			
			HORIZONTAL = 0,
			VERTICAL = 0,
			DIAGONAL = 0,
			FLIPPED_ALL = 0,
			FLIPPED_MASK = 0,		
		}	
	}
		
	/****************************************************
	* TiledMap
	*****************************************************/
	
	export namespace TiledMap {		
		/** !#en The stagger axis of Hex tiled map.
		!#zh 六边形地图的 stagger axis 值 */
		export enum StaggerAxis {			
			STAGGERAXIS_X = 0,
			STAGGERAXIS_Y = 0,		
		}	
	}
		
	/****************************************************
	* TiledMap
	*****************************************************/
	
	export namespace TiledMap {		
		/** !#en The render order of tiled map.
		!#zh 地图的渲染顺序 */
		export enum RenderOrder {			
			STAGGERINDEX_ODD = 0,
			STAGGERINDEX_EVEN = 0,
			RightDown = 0,
			RightUp = 0,
			LeftDown = 0,
			LeftUp = 0,		
		}	
	}
		
	/****************************************************
	* TiledMap
	*****************************************************/
	
	export namespace TiledMap {		
		/** !#en TiledMap Object Type
		!#zh 地图物体类型 */
		export enum TMXObjectType {			
			RECT = 0,
			ELLIPSE = 0,
			POLYGON = 0,
			POLYLINE = 0,
			IMAGE = 0,
			TEXT = 0,		
		}	
	}
		
	/****************************************************
	* audioEngine
	*****************************************************/
	
	export namespace audioEngine {		
		/** !#en Audio state.
		!#zh 声音播放状态 */
		export enum AudioState {			
			ERROR = 0,
			INITIALZING = 0,
			PLAYING = 0,
			PAUSED = 0,
			STOPPED = 0,		
		}	
	}
		
	/****************************************************
	* debug
	*****************************************************/
	
	export namespace debug {		
		/** !#en Enum for debug modes.
		!#zh 调试模式 */
		export enum DebugMode {			
			NONE = 0,
			INFO = 0,
			WARN = 0,
			ERROR = 0,
			INFO_FOR_WEB_PAGE = 0,
			WARN_FOR_WEB_PAGE = 0,
			ERROR_FOR_WEB_PAGE = 0,		
		}	
	}
		
	/****************************************************
	* Node
	*****************************************************/
	
	export namespace Node {		
		/** !#en Node's local dirty properties flag
		!#zh Node 的本地属性 dirty 状态位 */
		export enum _LocalDirtyFlag {			
			POSITION = 0,
			SCALE = 0,
			ROTATION = 0,
			SKEW = 0,
			TRS = 0,
			RS = 0,
			TRS = 0,
			PHYSICS_POSITION = 0,
			PHYSICS_SCALE = 0,
			PHYSICS_ROTATION = 0,
			PHYSICS_TRS = 0,
			PHYSICS_RS = 0,
			ALL_POSITION = 0,
			ALL_SCALE = 0,
			ALL_ROTATION = 0,
			ALL_TRS = 0,
			ALL = 0,		
		}	
	}
		
	/****************************************************
	* Node
	*****************************************************/
	
	export namespace Node {		
		/** !#en The event type supported by Node
		!#zh Node 支持的事件类型 */
		export class EventType {			
			/** !#en The event type for touch start event, you can use its value directly: 'touchstart'
			!#zh 当手指触摸到屏幕时。 */
			static TOUCH_START: string;			
			/** !#en The event type for touch move event, you can use its value directly: 'touchmove'
			!#zh 当手指在屏幕上移动时。 */
			static TOUCH_MOVE: string;			
			/** !#en The event type for touch end event, you can use its value directly: 'touchend'
			!#zh 当手指在目标节点区域内离开屏幕时。 */
			static TOUCH_END: string;			
			/** !#en The event type for touch end event, you can use its value directly: 'touchcancel'
			!#zh 当手指在目标节点区域外离开屏幕时。 */
			static TOUCH_CANCEL: string;			
			/** !#en The event type for mouse down events, you can use its value directly: 'mousedown'
			!#zh 当鼠标按下时触发一次。 */
			static MOUSE_DOWN: string;			
			/** !#en The event type for mouse move events, you can use its value directly: 'mousemove'
			!#zh 当鼠标在目标节点在目标节点区域中移动时，不论是否按下。 */
			static MOUSE_MOVE: string;			
			/** !#en The event type for mouse enter target events, you can use its value directly: 'mouseenter'
			!#zh 当鼠标移入目标节点区域时，不论是否按下。 */
			static MOUSE_ENTER: string;			
			/** !#en The event type for mouse leave target events, you can use its value directly: 'mouseleave'
			!#zh 当鼠标移出目标节点区域时，不论是否按下。 */
			static MOUSE_LEAVE: string;			
			/** !#en The event type for mouse up events, you can use its value directly: 'mouseup'
			!#zh 当鼠标从按下状态松开时触发一次。 */
			static MOUSE_UP: string;			
			/** !#en The event type for mouse wheel events, you can use its value directly: 'mousewheel'
			!#zh 当鼠标滚轮滚动时。 */
			static MOUSE_WHEEL: string;			
			/** !#en The event type for position change events.
			Performance note, this event will be triggered every time corresponding properties being changed,
			if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
			!#zh 当节点位置改变时触发的事件。
			性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。 */
			static POSITION_CHANGED: string;			
			/** !#en The event type for rotation change events.
			Performance note, this event will be triggered every time corresponding properties being changed,
			if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
			!#zh 当节点旋转改变时触发的事件。
			性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。 */
			static ROTATION_CHANGED: string;			
			/** !#en The event type for scale change events.
			Performance note, this event will be triggered every time corresponding properties being changed,
			if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
			!#zh 当节点缩放改变时触发的事件。
			性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。 */
			static SCALE_CHANGED: string;			
			/** !#en The event type for size change events.
			Performance note, this event will be triggered every time corresponding properties being changed,
			if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
			!#zh 当节点尺寸改变时触发的事件。
			性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。 */
			static SIZE_CHANGED: string;			
			/** !#en The event type for anchor point change events.
			Performance note, this event will be triggered every time corresponding properties being changed,
			if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
			!#zh 当节点锚点改变时触发的事件。
			性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。 */
			static ANCHOR_CHANGED: string;			
			/** !#en The event type for color change events.
			Performance note, this event will be triggered every time corresponding properties being changed,
			if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
			!#zh 当节点颜色改变时触发的事件。
			性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。 */
			static COLOR_CHANGED: string;			
			/** !#en The event type for new child added events.
			!#zh 当新的子节点被添加时触发的事件。 */
			static CHILD_ADDED: string;			
			/** !#en The event type for child removed events.
			!#zh 当子节点被移除时触发的事件。 */
			static CHILD_REMOVED: string;			
			/** !#en The event type for children reorder events.
			!#zh 当子节点顺序改变时触发的事件。 */
			static CHILD_REORDER: string;			
			/** !#en The event type for node group changed events.
			!#zh 当节点归属群组发生变化时触发的事件。 */
			static GROUP_CHANGED: string;			
			/** !#en The event type for node's sibling order changed.
			!#zh 当节点在兄弟节点中的顺序发生变化时触发的事件。 */
			static SIBLING_ORDER_CHANGED: string;		
		}	
	}
		
	/****************************************************
	* ParticleSystem
	*****************************************************/
	
	export namespace ParticleSystem {		
		/** !#en Enum for emitter modes
		!#zh 发射模式 */
		export enum EmitterMode {			
			GRAVITY = 0,
			RADIUS = 0,		
		}	
	}
		
	/****************************************************
	* ParticleSystem
	*****************************************************/
	
	export namespace ParticleSystem {		
		/** !#en Enum for particles movement type.
		!#zh 粒子位置类型 */
		export enum PositionType {			
			FREE = 0,
			RELATIVE = 0,
			GROUPED = 0,		
		}	
	}
		
	/****************************************************
	* VideoPlayer
	*****************************************************/
	
	export namespace VideoPlayer {		
		/** !#en Video event type
		!#zh 视频事件类型 */
		export enum EventType {			
			PLAYING = 0,
			PAUSED = 0,
			STOPPED = 0,
			COMPLETED = 0,
			META_LOADED = 0,
			CLICKED = 0,
			READY_TO_PLAY = 0,		
		}	
	}
		
	/****************************************************
	* VideoPlayer
	*****************************************************/
	
	export namespace VideoPlayer {		
		/** !#en Enum for video resouce type type.
		!#zh 视频来源 */
		export enum ResourceType {			
			REMOTE = 0,
			LOCAL = 0,		
		}	
	}
		
	/****************************************************
	* WebView
	*****************************************************/
	
	export namespace WebView {		
		/** !#en WebView event type
		!#zh 网页视图事件类型 */
		export enum EventType {			
			LOADED = 0,
			LOADING = 0,
			ERROR = 0,		
		}	
	}
		
	/****************************************************
	* Camera
	*****************************************************/
	
	export namespace Camera {		
		/** !#en Values for Camera.clearFlags, determining what to clear when rendering a Camera.
		!#zh 摄像机清除标记位，决定摄像机渲染时会清除哪些状态 */
		export enum ClearFlags {			
			COLOR = 0,
			DEPTH = 0,
			STENCIL = 0,		
		}	
	}
		
	/****************************************************
	* Collider
	*****************************************************/
	
	export namespace Collider {		
		/** !#en Defines a Box Collider .
		!#zh 用来定义包围盒碰撞体 */
		export class Box {			
			/** !#en Position offset
			!#zh 位置偏移量 */
			offset: Vec2;			
			/** !#en Box size
			!#zh 包围盒大小 */
			size: Size;		
		}	
	}
		
	/****************************************************
	* Collider
	*****************************************************/
	
	export namespace Collider {		
		/** !#en Defines a Circle Collider .
		!#zh 用来定义圆形碰撞体 */
		export class Circle {			
			/** !#en Position offset
			!#zh 位置偏移量 */
			offset: Vec2;			
			/** !#en Circle radius
			!#zh 圆形半径 */
			radius: number;		
		}	
	}
		
	/****************************************************
	* Collider
	*****************************************************/
	
	export namespace Collider {		
		/** !#en Defines a Polygon Collider .
		!#zh 用来定义多边形碰撞体 */
		export class Polygon {			
			/** !#en Position offset
			!#zh 位置偏移量 */
			offset: Vec2;			
			/** !#en Polygon points
			!#zh 多边形顶点数组 */
			points: Vec2[];		
		}	
	}
		
	/****************************************************
	* Light
	*****************************************************/
	
	export namespace Light {		
		/** !#en The light source type
		
		!#zh 光源类型 */
		export enum Type {			
			DIRECTIONAL = 0,
			POINT = 0,
			SPOT = 0,
			AMBIENT = 0,		
		}	
	}
		
	/****************************************************
	* Light
	*****************************************************/
	
	export namespace Light {		
		/** !#en The shadow type
		
		!#zh 阴影类型 */
		export enum ShadowType {			
			NONE = 0,
			HARD = 0,
			SOFT_PCF3X3 = 0,
			SOFT_PCF5X5 = 0,		
		}	
	}
		
	/****************************************************
	* Prefab
	*****************************************************/
	
	export namespace Prefab {		
		/** !#zh
		Prefab 创建实例所用的优化策略，配合 {{#crossLink "Prefab.optimizationPolicy"}}cc.Prefab#optimizationPolicy{{/crossLink}} 使用。
		!#en
		An enumeration used with the {{#crossLink "Prefab.optimizationPolicy"}}cc.Prefab#optimizationPolicy{{/crossLink}}
		to specify how to optimize the instantiate operation. */
		export enum OptimizationPolicy {			
			AUTO = 0,
			SINGLE_INSTANCE = 0,
			MULTI_INSTANCE = 0,		
		}	
	}
		
	/****************************************************
	* RenderTexture
	*****************************************************/
	
	export namespace RenderTexture {		
		/** !#en The depth buffer and stencil buffer format for RenderTexture.
		!#zh RenderTexture 的深度缓冲以及模板缓冲格式。 */
		export enum DepthStencilFormat {			
			RB_FMT_D24S8 = 0,
			RB_FMT_S8 = 0,
			RB_FMT_D16 = 0,		
		}	
	}
		
	/****************************************************
	* Texture2D
	*****************************************************/
	
	export namespace Texture2D {		
		/** The texture pixel format, default value is RGBA8888,
		you should note that textures loaded by normal image files (png, jpg) can only support RGBA8888 format,
		other formats are supported by compressed file types or raw data. */
		export enum PixelFormat {			
			RGB565 = 0,
			RGB5A1 = 0,
			RGBA4444 = 0,
			RGB888 = 0,
			RGBA8888 = 0,
			RGBA32F = 0,
			A8 = 0,
			I8 = 0,
			AI88 = 0,
			RGB_PVRTC_2BPPV1 = 0,
			RGBA_PVRTC_2BPPV1 = 0,
			RGB_A_PVRTC_2BPPV1 = 0,
			RGB_PVRTC_4BPPV1 = 0,
			RGBA_PVRTC_4BPPV1 = 0,
			RGB_A_PVRTC_4BPPV1 = 0,
			RGB_ETC1 = 0,
			RGBA_ETC1 = 0,
			RGB_ETC2 = 0,
			RGBA_ETC2 = 0,		
		}	
	}
		
	/****************************************************
	* Texture2D
	*****************************************************/
	
	export namespace Texture2D {		
		/** The texture wrap mode */
		export enum WrapMode {			
			REPEAT = 0,
			CLAMP_TO_EDGE = 0,
			MIRRORED_REPEAT = 0,		
		}	
	}
		
	/****************************************************
	* Texture2D
	*****************************************************/
	
	export namespace Texture2D {		
		/** The texture filter mode */
		export enum Filter {			
			LINEAR = 0,
			NEAREST = 0,		
		}	
	}
		
	/****************************************************
	* Event
	*****************************************************/
	
	export namespace Event {		
		/** !#en The Custom event
		!#zh 自定义事件 */
		export class EventCustom extends Event {			
			/**
			
			@param type The name of the event (case-sensitive), e.g. "click", "fire", or "submit"
			@param bubbles A boolean indicating whether the event bubbles up through the tree or not 
			*/
			constructor(type: string, bubbles: boolean);			
			/** !#en A reference to the detailed data of the event
			!#zh 事件的详细数据 */
			detail: any;			
			/**
			!#en Sets user data
			!#zh 设置用户数据
			@param data data 
			*/
			setUserData(data: any): void;			
			/**
			!#en Gets user data
			!#zh 获取用户数据 
			*/
			getUserData(): any;			
			/**
			!#en Gets event name
			!#zh 获取事件名称 
			*/
			getEventName(): string;		
		}	
	}
		
	/****************************************************
	* SystemEvent
	*****************************************************/
	
	export namespace SystemEvent {		
		/** !#en The event type supported by SystemEvent
		!#zh SystemEvent 支持的事件类型 */
		export class EventType {			
			/** !#en The event type for press the key down event, you can use its value directly: 'keydown'
			!#zh 当按下按键时触发的事件 */
			static KEY_DOWN: string;			
			/** !#en The event type for press the key up event, you can use its value directly: 'keyup'
			!#zh 当松开按键时触发的事件 */
			static KEY_UP: string;			
			/** !#en The event type for press the devicemotion event, you can use its value directly: 'devicemotion'
			!#zh 重力感应 */
			static DEVICEMOTION: string;		
		}	
	}
		
	/****************************************************
	* Event
	*****************************************************/
	
	export namespace Event {		
		/** !#en The mouse event
		!#zh 鼠标事件类型 */
		export class EventMouse extends Event {			
			/**
			!#en Sets scroll data.
			!#zh 设置鼠标的滚动数据。
			@param scrollX scrollX
			@param scrollY scrollY 
			*/
			setScrollData(scrollX: number, scrollY: number): void;			
			/**
			!#en Returns the x axis scroll value.
			!#zh 获取鼠标滚动的X轴距离，只有滚动时才有效。 
			*/
			getScrollX(): number;			
			/**
			!#en Returns the y axis scroll value.
			!#zh 获取滚轮滚动的 Y 轴距离，只有滚动时才有效。 
			*/
			getScrollY(): number;			
			/**
			!#en Sets cursor location.
			!#zh 设置当前鼠标位置。
			@param x x
			@param y y 
			*/
			setLocation(x: number, y: number): void;			
			/**
			!#en Returns cursor location.
			!#zh 获取鼠标位置对象，对象包含 x 和 y 属性。 
			*/
			getLocation(): Vec2;			
			/**
			!#en Returns the current cursor location in screen coordinates.
			!#zh 获取当前事件在游戏窗口内的坐标位置对象，对象包含 x 和 y 属性。 
			*/
			getLocationInView(): Vec2;			
			/**
			!#en Returns the previous touch location.
			!#zh 获取鼠标点击在上一次事件时的位置对象，对象包含 x 和 y 属性。 
			*/
			getPreviousLocation(): Vec2;			
			/**
			!#en Returns the delta distance from the previous location to current location.
			!#zh 获取鼠标距离上一次事件移动的距离对象，对象包含 x 和 y 属性。 
			*/
			getDelta(): Vec2;			
			/**
			!#en Returns the X axis delta distance from the previous location to current location.
			!#zh 获取鼠标距离上一次事件移动的 X 轴距离。 
			*/
			getDeltaX(): number;			
			/**
			!#en Returns the Y axis delta distance from the previous location to current location.
			!#zh 获取鼠标距离上一次事件移动的 Y 轴距离。 
			*/
			getDeltaY(): number;			
			/**
			!#en Sets mouse button.
			!#zh 设置鼠标按键。
			@param button button 
			*/
			setButton(button: number): void;			
			/**
			!#en Returns mouse button.
			!#zh 获取鼠标按键。 
			*/
			getButton(): number;			
			/**
			!#en Returns location X axis data.
			!#zh 获取鼠标当前位置 X 轴。 
			*/
			getLocationX(): number;			
			/**
			!#en Returns location Y axis data.
			!#zh 获取鼠标当前位置 Y 轴。 
			*/
			getLocationY(): number;			
			/** !#en The none event code of mouse event.
			!#zh 无。 */
			static NONE: number;			
			/** !#en The event type code of mouse down event.
			!#zh 鼠标按下事件。 */
			static DOWN: number;			
			/** !#en The event type code of mouse up event.
			!#zh 鼠标按下后释放事件。 */
			static UP: number;			
			/** !#en The event type code of mouse move event.
			!#zh 鼠标移动事件。 */
			static MOVE: number;			
			/** !#en The event type code of mouse scroll event.
			!#zh 鼠标滚轮事件。 */
			static SCROLL: number;			
			/** !#en The tag of Mouse left button.
			!#zh 鼠标左键的标签。 */
			static BUTTON_LEFT: number;			
			/** !#en The tag of Mouse right button  (The right button number is 2 on browser).
			!#zh 鼠标右键的标签。 */
			static BUTTON_RIGHT: number;			
			/** !#en The tag of Mouse middle button  (The right button number is 1 on browser).
			!#zh 鼠标中键的标签。 */
			static BUTTON_MIDDLE: number;			
			/** !#en The tag of Mouse button 4.
			!#zh 鼠标按键 4 的标签。 */
			static BUTTON_4: number;			
			/** !#en The tag of Mouse button 5.
			!#zh 鼠标按键 5 的标签。 */
			static BUTTON_5: number;			
			/** !#en The tag of Mouse button 6.
			!#zh 鼠标按键 6 的标签。 */
			static BUTTON_6: number;			
			/** !#en The tag of Mouse button 7.
			!#zh 鼠标按键 7 的标签。 */
			static BUTTON_7: number;			
			/** !#en The tag of Mouse button 8.
			!#zh 鼠标按键 8 的标签。 */
			static BUTTON_8: number;		
		}	
	}
		
	/****************************************************
	* Event
	*****************************************************/
	
	export namespace Event {		
		/** !#en The touch event
		!#zh 触摸事件 */
		export class EventTouch extends Event {			
			/**
			
			@param touchArr The array of the touches
			@param bubbles A boolean indicating whether the event bubbles up through the tree or not 
			*/
			constructor(touchArr: any[], bubbles: boolean);			
			/** !#en The current touch object
			!#zh 当前触点对象 */
			touch: Touch;			
			/**
			!#en Returns event code.
			!#zh 获取事件类型。 
			*/
			getEventCode(): number;			
			/**
			!#en Returns touches of event.
			!#zh 获取触摸点的列表。 
			*/
			getTouches(): any[];			
			/**
			!#en Sets touch location.
			!#zh 设置当前触点位置
			@param x x
			@param y y 
			*/
			setLocation(x: number, y: number): void;			
			/**
			!#en Returns touch location.
			!#zh 获取触点位置。 
			*/
			getLocation(): Vec2;			
			/**
			!#en Returns the current touch location in screen coordinates.
			!#zh 获取当前触点在游戏窗口中的位置。 
			*/
			getLocationInView(): Vec2;			
			/**
			!#en Returns the previous touch location.
			!#zh 获取触点在上一次事件时的位置对象，对象包含 x 和 y 属性。 
			*/
			getPreviousLocation(): Vec2;			
			/**
			!#en Returns the start touch location.
			!#zh 获取触点落下时的位置对象，对象包含 x 和 y 属性。 
			*/
			getStartLocation(): Vec2;			
			/**
			!#en Returns the id of cc.Touch.
			!#zh 触点的标识 ID，可以用来在多点触摸中跟踪触点。 
			*/
			getID(): number;			
			/**
			!#en Returns the delta distance from the previous location to current location.
			!#zh 获取触点距离上一次事件移动的距离对象，对象包含 x 和 y 属性。 
			*/
			getDelta(): Vec2;			
			/**
			!#en Returns the X axis delta distance from the previous location to current location.
			!#zh 获取触点距离上一次事件移动的 x 轴距离。 
			*/
			getDeltaX(): number;			
			/**
			!#en Returns the Y axis delta distance from the previous location to current location.
			!#zh 获取触点距离上一次事件移动的 y 轴距离。 
			*/
			getDeltaY(): number;			
			/**
			!#en Returns location X axis data.
			!#zh 获取当前触点 X 轴位置。 
			*/
			getLocationX(): number;			
			/**
			!#en Returns location Y axis data.
			!#zh 获取当前触点 Y 轴位置。 
			*/
			getLocationY(): number;		
		}	
	}
		
	/****************************************************
	* Event
	*****************************************************/
	
	export namespace Event {		
		/** !#en The acceleration event
		!#zh 加速度事件 */
		export class EventAcceleration extends Event {		
		}	
	}
		
	/****************************************************
	* Event
	*****************************************************/
	
	export namespace Event {		
		/** !#en The keyboard event
		!#zh 键盘事件 */
		export class EventKeyboard extends Event {			
			/** !#en
			The keyCode read-only property represents a system and implementation dependent numerical code identifying the unmodified value of the pressed key.
			This is usually the decimal ASCII (RFC 20) or Windows 1252 code corresponding to the key.
			If the key can't be identified, this value is 0.
			
			!#zh
			keyCode 是只读属性它表示一个系统和依赖于实现的数字代码，可以识别按键的未修改值。
			这通常是十进制 ASCII (RFC20) 或者 Windows 1252 代码，所对应的密钥。
			如果无法识别该键，则该值为 0。 */
			keyCode: number;		
		}	
	}
		
	/****************************************************
	* geomUtils
	*****************************************************/
	
	export namespace geomUtils {		
		/** Aabb */
		export class Aabb {			
			/**
			create a new aabb
			@param px X coordinates for aabb's original point
			@param py Y coordinates for aabb's original point
			@param pz Z coordinates for aabb's original point
			@param w the half of aabb width
			@param h the half of aabb height
			@param l the half of aabb length 
			*/
			create(px: number, py: number, pz: number, w: number, h: number, l: number): Aabb;			
			/**
			clone a new aabb
			@param a the source aabb 
			*/
			clone(a: Aabb): Aabb;			
			/**
			copy the values from one aabb to another
			@param out the receiving aabb
			@param a the source aabb 
			*/
			copy(out: Aabb, a: Aabb): Aabb;			
			/**
			create a new aabb from two corner points
			@param out the receiving aabb
			@param minPos lower corner position of the aabb
			@param maxPos upper corner position of the aabb 
			*/
			fromPoints(out: Aabb, minPos: Vec3, maxPos: Vec3): Aabb;			
			/**
			Set the components of a aabb to the given values
			@param out the receiving aabb
			@param px X coordinates for aabb's original point
			@param py Y coordinates for aabb's original point
			@param pz Z coordinates for aabb's original point
			@param w the half of aabb width
			@param h the half of aabb height
			@param l the half of aabb length 
			*/
			set(out: Aabb, px: number, py: number, pz: number, w: number, h: number, l: number): Aabb;			
			center: Vec3;			
			halfExtents: Vec3;			
			_type: number;			
			/**
			Get the bounding points of this shape
			@param minPos minPos
			@param maxPos maxPos 
			*/
			getBoundary(minPos: Vec3, maxPos: Vec3): void;			
			/**
			Transform this shape
			@param m the transform matrix
			@param pos the position part of the transform
			@param rot the rotation part of the transform
			@param scale the scale part of the transform
			@param out the target shape 
			*/
			transform(m: Mat4, pos: Vec3, rot: Quat, scale: Vec3, out?: Aabb): void;		
		}	
	}
		
	/****************************************************
	* geomUtils
	*****************************************************/
	
	export namespace geomUtils {		
		/** !#en Shape type. */
		export enum enums {			
			SHAPE_RAY = 0,
			SHAPE_LINE = 0,
			SHAPE_SPHERE = 0,
			SHAPE_AABB = 0,
			SHAPE_OBB = 0,
			SHAPE_PLANE = 0,
			SHAPE_TRIANGLE = 0,
			SHAPE_FRUSTUM = 0,
			SHAPE_FRUSTUM_ACCURATE = 0,		
		}	
	}
		
	/****************************************************
	* geomUtils
	*****************************************************/
	
	export namespace geomUtils {		
		/** !#en frustum
		!#zh 平截头体 */
		export class Frustum {			
			/** Set whether to use accurate intersection testing function on this frustum */
			accurate: boolean;			
			/**
			create a new frustum 
			*/
			static create(): Frustum;			
			/**
			Clone a frustum
			@param f f 
			*/
			static clone(f: Frustum): Frustum;			
			/**
			Copy the values from one frustum to another
			@param out out
			@param f f 
			*/
			copy(out: Frustum, f: Frustum): Frustum;			
			planes: geomUtils.Plane[];			
			planes: Vec3[];			
			/**
			!#en Update the frustum information according to the given transform matrix.
			Note that the resulting planes are not normalized under normal mode.
			@param m the view-projection matrix
			@param inv the inverse view-projection matrix 
			*/
			update(m: Mat4, inv: Mat4): void;			
			/**
			!#en transform by matrix
			@param mat mat 
			*/
			transform(mat: Mat4): void;		
		}	
	}
		
	/****************************************************
	* geomUtils
	*****************************************************/
	
	export namespace geomUtils {		
		/** undefined */
		export class intersect {			
			/**
			!#en
			Check whether ray intersect with nodes
			!#zh
			检测射线是否与物体有交集
			@param root If root is null, then traversal nodes from scene node
			@param worldRay worldRay
			@param handler handler
			@param filter filter 
			*/
			static ray_cast(root: Node, worldRay: geomUtils.Ray, handler: Function, filter: Function): any[];			
			/**
			!#en ray-plane intersect<br/>
			!#zh 射线与平面的相交性检测。
			@param ray ray
			@param plane plane 
			*/
			static ray_plane(ray: geomUtils.Ray, plane: geomUtils.Plane): number;			
			/**
			!#en line-plane intersect<br/>
			!#zh 线段与平面的相交性检测。
			@param line line
			@param plane plane 
			*/
			static line_plane(line: geomUtils.Line, plane: geomUtils.Plane): number;			
			/**
			!#en ray-triangle intersect<br/>
			!#zh 射线与三角形的相交性检测。
			@param ray ray
			@param triangle triangle
			@param doubleSided doubleSided 
			*/
			static ray_triangle(ray: geomUtils.Ray, triangle: geomUtils.Triangle, doubleSided: boolean): number;			
			/**
			!#en line-triangle intersect<br/>
			!#zh 线段与三角形的相交性检测。
			@param line line
			@param triangle triangle
			@param outPt optional, The intersection point 
			*/
			static line_triangle(line: geomUtils.Line, triangle: geomUtils.Triangle, outPt: Vec3): number;			
			/**
			!#en line-quad intersect<br/>
			!#zh 线段与四边形的相交性检测。
			@param p A point on a line segment
			@param q Another point on the line segment
			@param a Quadrilateral point a
			@param b Quadrilateral point b
			@param c Quadrilateral point c
			@param d Quadrilateral point d
			@param outPt optional, The intersection point 
			*/
			static line_quad(p: Vec3, q: Vec3, a: Vec3, b: Vec3, c: Vec3, d: Vec3, outPt: Vec3): number;			
			/**
			!#en ray-sphere intersect<br/>
			!#zh 射线和球的相交性检测。
			@param ray ray
			@param sphere sphere 
			*/
			static ray_sphere(ray: geomUtils.Ray, sphere: geomUtils.Sphere): number;			
			/**
			!#en ray-aabb intersect<br/>
			!#zh 射线和轴对齐包围盒的相交性检测。
			@param ray ray
			@param aabb Align the axis around the box 
			*/
			static ray_aabb(ray: geomUtils.Ray, aabb: Aabb): number;			
			/**
			!#en ray-obb intersect<br/>
			!#zh 射线和方向包围盒的相交性检测。
			@param ray ray
			@param obb Direction box 
			*/
			static ray_obb(ray: geomUtils.Ray, obb: geomUtils.Obb): number;			
			/**
			!#en aabb-aabb intersect<br/>
			!#zh 轴对齐包围盒和轴对齐包围盒的相交性检测。
			@param aabb1 Axis alignment surrounds box 1
			@param aabb2 Axis alignment surrounds box 2 
			*/
			static aabb_aabb(aabb1: Aabb, aabb2: Aabb): number;			
			/**
			!#en aabb-obb intersect<br/>
			!#zh 轴对齐包围盒和方向包围盒的相交性检测。
			@param aabb Align the axis around the box
			@param obb Direction box 
			*/
			static aabb_obb(aabb: Aabb, obb: geomUtils.Obb): number;			
			/**
			!#en aabb-plane intersect<br/>
			!#zh 轴对齐包围盒和平面的相交性检测。
			@param aabb Align the axis around the box
			@param plane plane 
			*/
			static aabb_plane(aabb: Aabb, plane: geomUtils.Plane): number;			
			/**
			!#en aabb-frustum intersect, faster but has false positive corner cases<br/>
			!#zh 轴对齐包围盒和锥台相交性检测，速度快，但有错误情况。
			@param aabb Align the axis around the box
			@param frustum frustum 
			*/
			static aabb_frustum(aabb: Aabb, frustum: Frustum): number;			
			/**
			!#en aabb-frustum intersect, handles most of the false positives correctly<br/>
			!#zh 轴对齐包围盒和锥台相交性检测，正确处理大多数错误情况。
			@param aabb Align the axis around the box
			@param frustum frustum 
			*/
			static aabb_frustum_accurate(aabb: Aabb, frustum: Frustum): number;			
			/**
			!#en obb-point intersect<br/>
			!#zh 方向包围盒和点的相交性检测。
			@param obb Direction box
			@param point point 
			*/
			static obb_point(obb: geomUtils.Obb, point: geomUtils.Vec3): boolean;			
			/**
			!#en obb-plane intersect<br/>
			!#zh 方向包围盒和平面的相交性检测。
			@param obb Direction box
			@param plane plane 
			*/
			static obb_plane(obb: geomUtils.Obb, plane: geomUtils.Plane): number;			
			/**
			!#en obb-frustum intersect, faster but has false positive corner cases<br/>
			!#zh 方向包围盒和锥台相交性检测，速度快，但有错误情况。
			@param obb Direction box
			@param frustum frustum 
			*/
			static obb_frustum(obb: geomUtils.Obb, frustum: Frustum): number;			
			/**
			!#en obb-frustum intersect, handles most of the false positives correctly<br/>
			!#zh 方向包围盒和锥台相交性检测，正确处理大多数错误情况。
			@param obb Direction box
			@param frustum frustum 
			*/
			static obb_frustum_accurate(obb: geomUtils.Obb, frustum: Frustum): number;			
			/**
			!#en obb-obb intersect<br/>
			!#zh 方向包围盒和方向包围盒的相交性检测。
			@param obb1 Direction box1
			@param obb2 Direction box2 
			*/
			static obb_obb(obb1: geomUtils.Obb, obb2: geomUtils.Obb): number;			
			/**
			!#en phere-plane intersect, not necessarily faster than obb-plane<br/>
			due to the length calculation of the plane normal to factor out<br/>
			the unnomalized plane distance<br/>
			!#zh 球与平面的相交性检测。
			@param sphere sphere
			@param plane plane 
			*/
			static sphere_plane(sphere: geomUtils.Sphere, plane: geomUtils.Plane): number;			
			/**
			!#en sphere-frustum intersect, faster but has false positive corner cases<br/>
			!#zh 球和锥台的相交性检测，速度快，但有错误情况。
			@param sphere sphere
			@param frustum frustum 
			*/
			static sphere_frustum(sphere: geomUtils.Sphere, frustum: Frustum): number;			
			/**
			!#en sphere-frustum intersect, handles the false positives correctly<br/>
			!#zh 球和锥台的相交性检测，正确处理大多数错误情况。
			@param sphere sphere
			@param frustum frustum 
			*/
			static sphere_frustum_accurate(sphere: geomUtils.Sphere, frustum: Frustum): number;			
			/**
			!#en sphere-sphere intersect<br/>
			!#zh 球和球的相交性检测。
			@param sphere0 sphere0
			@param sphere1 sphere1 
			*/
			static sphere_sphere(sphere0: geomUtils.Sphere, sphere1: geomUtils.Sphere): boolean;			
			/**
			!#en sphere-aabb intersect<br/>
			!#zh 球和轴对齐包围盒的相交性检测。
			@param sphere sphere
			@param aabb aabb 
			*/
			static sphere_aabb(sphere: geomUtils.Sphere, aabb: Aabb): boolean;			
			/**
			!#en sphere-obb intersect<br/>
			!#zh 球和方向包围盒的相交性检测。
			@param sphere sphere
			@param obb obb 
			*/
			static sphere_obb(sphere: geomUtils.Sphere, obb: geomUtils.Obb): boolean;			
			/**
			!#en
			The intersection detection of g1 and g2 can fill in the shape in the basic geometry.
			!#zh
			g1 和 g2 的相交性检测，可填入基础几何中的形状。
			@param g1 Geometry 1
			@param g2 Geometry 2
			@param outPt optional, Intersection point. (note: only partial shape detection with this return value) 
			*/
			static resolve(g1: any, g2: any, outPt: any): void;		
		}	
	}
		
	/****************************************************
	* geomUtils
	*****************************************************/
	
	export namespace geomUtils {		
		/** !#en
		line
		!#zh
		直线 */
		export class Line {			
			/**
			!#en
			create a new line
			!#zh
			创建一个新的 line。
			@param sx The x part of the starting point.
			@param sy The y part of the starting point.
			@param sz The z part of the starting point.
			@param ex The x part of the end point.
			@param ey The y part of the end point.
			@param ez The z part of the end point. 
			*/
			create(sx: number, sy: number, sz: number, ex: number, ey: number, ez: number): Line;			
			/**
			!#en
			Creates a new line initialized with values from an existing line
			!#zh
			克隆一个新的 line。
			@param a The source of cloning. 
			*/
			clone(a: Line): Line;			
			/**
			!#en
			Copy the values from one line to another
			!#zh
			复制一个线的值到另一个。
			@param out The object that accepts the action.
			@param a The source of the copy. 
			*/
			copy(out: Line, a: Line): Line;			
			/**
			!#en
			create a line from two points
			!#zh
			用两个点创建一个线。
			@param out The object that accepts the action.
			@param start The starting point.
			@param end At the end. 
			*/
			fromPoints(out: Line, start: Vec3, end: Vec3): Line;			
			/**
			!#en
			Set the components of a Vec3 to the given values
			!#zh
			将给定线的属性设置为给定值。
			@param out The object that accepts the action.
			@param sx The x part of the starting point.
			@param sy The y part of the starting point.
			@param sz The z part of the starting point.
			@param ex The x part of the end point.
			@param ey The y part of the end point.
			@param ez The z part of the end point. 
			*/
			set(out: Line, sx: number, sy: number, sz: number, ex: number, ey: number, ez: number): Line;			
			/**
			!#en
			Calculate the length of the line.
			!#zh
			计算线的长度。
			@param a The line to calculate. 
			*/
			len(a: Line): number;			
			/** !#en
			Start points.
			!#zh
			起点。 */
			s: Vec3;			
			/** !#en
			End points.
			!#zh
			终点。 */
			e: Vec3;			
			/**
			!#en
			Calculate the length of the line.
			!#zh
			计算线的长度。 
			*/
			length(): number;		
		}	
	}
		
	/****************************************************
	* geomUtils
	*****************************************************/
	
	export namespace geomUtils {		
		/** !#en obb
		!#zh
		基础几何  方向包围盒。 */
		export class Obb {			
			/** !#zh
			获取形状的类型。 */
			type: number;			
			/**
			!#en
			create a new obb
			!#zh
			创建一个新的 obb 实例。
			@param cx X coordinates of the shape relative to the origin.
			@param cy Y coordinates of the shape relative to the origin.
			@param cz Z coordinates of the shape relative to the origin.
			@param hw Obb is half the width.
			@param hh Obb is half the height.
			@param hl Obb is half the Length.
			@param ox_1 Direction matrix parameter.
			@param ox_2 Direction matrix parameter.
			@param ox_3 Direction matrix parameter.
			@param oy_1 Direction matrix parameter.
			@param oy_2 Direction matrix parameter.
			@param oy_3 Direction matrix parameter.
			@param oz_1 Direction matrix parameter.
			@param oz_2 Direction matrix parameter.
			@param oz_3 Direction matrix parameter. 
			*/
			create(cx: number, cy: number, cz: number, hw: number, hh: number, hl: number, ox_1: number, ox_2: number, ox_3: number, oy_1: number, oy_2: number, oy_3: number, oz_1: number, oz_2: number, oz_3: number): Obb;			
			/**
			!#en
			clone a new obb
			!#zh
			克隆一个 obb。
			@param a The target of cloning. 
			*/
			clone(a: Obb): Obb;			
			/**
			!#en
			copy the values from one obb to another
			!#zh
			将从一个 obb 的值复制到另一个 obb。
			@param out Obb that accepts the operation.
			@param a Obb being copied. 
			*/
			copy(out: Obb, a: Obb): Obb;			
			/**
			!#en
			create a new obb from two corner points
			!#zh
			用两个点创建一个新的 obb。
			@param out Obb that accepts the operation.
			@param minPos The smallest point of obb.
			@param maxPos Obb's maximum point. 
			*/
			fromPoints(out: Obb, minPos: Vec3, maxPos: Vec3): Obb;			
			/**
			!#en
			Set the components of a obb to the given values
			!#zh
			将给定 obb 的属性设置为给定的值。
			@param cx X coordinates of the shape relative to the origin.
			@param cy Y coordinates of the shape relative to the origin.
			@param cz Z coordinates of the shape relative to the origin.
			@param hw Obb is half the width.
			@param hh Obb is half the height.
			@param hl Obb is half the Length.
			@param ox_1 Direction matrix parameter.
			@param ox_2 Direction matrix parameter.
			@param ox_3 Direction matrix parameter.
			@param oy_1 Direction matrix parameter.
			@param oy_2 Direction matrix parameter.
			@param oy_3 Direction matrix parameter.
			@param oz_1 Direction matrix parameter.
			@param oz_2 Direction matrix parameter.
			@param oz_3 Direction matrix parameter. 
			*/
			set(cx: number, cy: number, cz: number, hw: number, hh: number, hl: number, ox_1: number, ox_2: number, ox_3: number, oy_1: number, oy_2: number, oy_3: number, oz_1: number, oz_2: number, oz_3: number): Obb;			
			/** !#en
			The center of the local coordinate.
			!#zh
			本地坐标的中心点。 */
			center: Vec3;			
			/** !#en
			Half the length, width, and height.
			!#zh
			长宽高的一半。 */
			halfExtents: Vec3;			
			/** !#en
			Direction matrix.
			!#zh
			方向矩阵。 */
			orientation: Mat3;			
			/**
			!#en
			Get the bounding points of this shape
			!#zh
			获取 obb 的最小点和最大点。
			@param minPos minPos
			@param maxPos maxPos 
			*/
			getBoundary(minPos: Vec3, maxPos: Vec3): void;			
			/**
			!#en Transform this shape
			!#zh
			将 out 根据这个 obb 的数据进行变换。
			@param m The transformation matrix.
			@param pos The position part of the transformation.
			@param rot The rotating part of the transformation.
			@param scale The scaling part of the transformation.
			@param out Target of transformation. 
			*/
			transform(m: Mat4, pos: Vec3, rot: Quat, scale: Vec3, out: Obb): void;			
			/**
			!#en
			Transform out based on this obb data.
			!#zh
			将 out 根据这个 obb 的数据进行变换。
			@param m The transformation matrix.
			@param rot The rotating part of the transformation.
			@param out Target of transformation. 
			*/
			translateAndRotate(m: Mat4, rot: Quat, out: Obb): void;			
			/**
			!#en
			Scale out based on this obb data.
			!#zh
			将 out 根据这个 obb 的数据进行缩放。
			@param scale Scale value.
			@param out Scaled target. 
			*/
			setScale(scale: Vec3, out: Obb): void;		
		}	
	}
		
	/****************************************************
	* geomUtils
	*****************************************************/
	
	export namespace geomUtils {		
		/** !#en
		plane。
		!#zh
		平面。 */
		export class Plane {			
			/**
			!#en
			create a new plane
			!#zh
			创建一个新的 plane。
			@param nx The x part of the normal component.
			@param ny The y part of the normal component.
			@param nz The z part of the normal component.
			@param d Distance from the origin. 
			*/
			create(nx: number, ny: number, nz: number, d: number): Plane;			
			/**
			!#en
			clone a new plane
			!#zh
			克隆一个新的 plane。
			@param p The source of cloning. 
			*/
			clone(p: Plane): Plane;			
			/**
			!#en
			copy the values from one plane to another
			!#zh
			复制一个平面的值到另一个。
			@param out The object that accepts the action.
			@param p The source of the copy. 
			*/
			copy(out: Plane, p: Plane): Plane;			
			/**
			!#en
			create a plane from three points
			!#zh
			用三个点创建一个平面。
			@param out The object that accepts the action.
			@param a Point a。
			@param b Point b。
			@param c Point c。 
			*/
			fromPoints(out: Plane, a: Vec3, b: Vec3, c: Vec3): Plane;			
			/**
			!#en
			Set the components of a plane to the given values
			!#zh
			将给定平面的属性设置为给定值。
			@param out The object that accepts the action.
			@param nx The x part of the normal component.
			@param ny The y part of the normal component.
			@param nz The z part of the normal component.
			@param d Distance from the origin. 
			*/
			set(out: Plane, nx: number, ny: number, nz: number, d: number): Plane;			
			/**
			!#en
			create plane from normal and point
			!#zh
			用一条法线和一个点创建平面。
			@param out The object that accepts the action.
			@param normal The normal of a plane.
			@param point A point on the plane. 
			*/
			fromNormalAndPoint(out: Plane, normal: Vec3, point: Vec3): Plane;			
			/**
			!#en
			normalize a plane
			!#zh
			归一化一个平面。
			@param out The object that accepts the action.
			@param a Source data for operations. 
			*/
			normalize(out: Plane, a: Plane): Plane;			
			/** !#en
			A normal vector.
			!#zh
			法线向量。 */
			n: Vec3;			
			/** !#en
			The distance from the origin to the plane.
			!#zh
			原点到平面的距离。 */
			d: number;			
			/**
			!#en
			Transform a plane.
			!#zh
			变换一个平面。
			@param mat mat 
			*/
			transform(mat: Mat4): void;		
		}	
	}
		
	/****************************************************
	* geomUtils
	*****************************************************/
	
	export namespace geomUtils {		
		/** !#en
		ray
		!#zh
		射线。 */
		export class Ray {			
			/**
			!#en
			create a new ray
			!#zh
			创建一条射线。
			@param ox The x part of the starting point.
			@param oy The y part of the starting point.
			@param oz The z part of the starting point.
			@param dx X in the direction.
			@param dy Y in the direction.
			@param dz Z in the direction. 
			*/
			create(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number): Ray;			
			/**
			!#en
			Creates a new ray initialized with values from an existing ray
			!#zh
			从一条射线克隆出一条新的射线。
			@param a Clone target 
			*/
			clone(a: Ray): Ray;			
			/**
			!#en
			Copy the values from one ray to another
			!#zh
			将从一个 ray 的值复制到另一个 ray。
			@param out Accept the ray of the operation.
			@param a Copied ray. 
			*/
			copy(out: Ray, a: Ray): Ray;			
			/**
			!#en
			create a ray from two points
			!#zh
			用两个点创建一条射线。
			@param out Receive the operating ray.
			@param origin Origin of ray
			@param target A point on a ray. 
			*/
			fromPoints(out: Ray, origin: Vec3, target: Vec3): Ray;			
			/**
			!#en
			Set the components of a ray to the given values
			!#zh
			将给定射线的属性设置为给定的值。
			@param out Receive the operating ray.
			@param ox The x part of the starting point.
			@param oy The y part of the starting point.
			@param oz The z part of the starting point.
			@param dx X in the direction.
			@param dy Y in the direction.
			@param dz Z in the direction. 
			*/
			set(out: Ray, ox: number, oy: number, oz: number, dx: number, dy: number, dz: number): Ray;			
			/** !#en
			Start point.
			!#zh
			起点。 */
			o: Vec3;			
			/** !#e
			Direction
			!#zh
			方向。 */
			d: Vec3;			
			/**
			!#en Compute hit.
			@param out out
			@param distance distance 
			*/
			computeHit(out: IVec3Like, distance: number): void;		
		}	
	}
		
	/****************************************************
	* geomUtils
	*****************************************************/
	
	export namespace geomUtils {		
		/** !#en
		Sphere.
		!#zh
		轴对齐球。 */
		export class Sphere {			
			/**
			!#en
			create a new sphere
			!#zh
			创建一个新的 sphere 实例。
			@param cx X coordinates of the shape relative to the origin.
			@param cy Y coordinates of the shape relative to the origin.
			@param cz Z coordinates of the shape relative to the origin.
			@param r Radius of sphere 
			*/
			create(cx: any, cy: any, cz: any, r: any): Sphere;			
			/**
			!#en
			clone a new sphere
			!#zh
			克隆一个新的 sphere 实例。
			@param p The target of cloning. 
			*/
			clone(p: Sphere): Sphere;			
			/**
			!#en
			copy the values from one sphere to another
			!#zh
			将从一个 sphere 的值复制到另一个 sphere。
			@param out Accept the sphere of operations.
			@param a Sphere being copied. 
			*/
			copy(out: Sphere, a: Sphere): Sphere;			
			/**
			!#en
			create a new bounding sphere from two corner points
			!#zh
			从两个点创建一个新的 sphere。
			@param out Accept the sphere of operations.
			@param minPos The smallest point of sphere.
			@param maxPos The maximum point of sphere. 
			*/
			fromPoints(out: any, minPos: any, maxPos: any): Sphere;			
			/**
			!#en Set the components of a sphere to the given values
			!#zh 将球体的属性设置为给定的值。
			@param out Accept the sphere of operations.
			@param cx X coordinates of the shape relative to the origin.
			@param cy Y coordinates of the shape relative to the origin.
			@param cz Z coordinates of the shape relative to the origin.
			@param r Radius. 
			*/
			set(out: Sphere, cx: any, cy: any, cz: any, r: number): Sphere;			
			/** !#en
			The center of the local coordinate.
			!#zh
			本地坐标的中心点。 */
			center: Vec3;			
			/** !#zh
			半径。 */
			radius: number;			
			/**
			!#en
			Clone.
			!#zh
			获得克隆。 
			*/
			clone(): void;			
			/**
			!#en
			Copy sphere
			!#zh
			拷贝对象。
			@param a Copy target. 
			*/
			copy(a: any): void;			
			/**
			!#en
			Get the bounding points of this shape
			!#zh
			获取此形状的边界点。
			@param minPos minPos
			@param maxPos maxPos 
			*/
			getBoundary(minPos: Vec3, maxPos: Vec3): void;			
			/**
			!#en
			Transform this shape
			!#zh
			将 out 根据这个 sphere 的数据进行变换。
			@param m The transformation matrix.
			@param pos The position part of the transformation.
			@param rot The rotating part of the transformation.
			@param scale The scaling part of the transformation.
			@param out The target of the transformation. 
			*/
			transform(m: any, pos: any, rot: any, scale: any, out: any): void;			
			/**
			!#en
			Scale out based on the sphere data.
			!#zh
			将 out 根据这个 sphere 的数据进行缩放。
			@param scale Scale value
			@param out Scale target 
			*/
			setScale(scale: any, out: any): void;		
		}	
	}
		
	/****************************************************
	* geomUtils
	*****************************************************/
	
	export namespace geomUtils {		
		/** Triangle */
		export class Triangle {			
			/**
			create a new triangle
			@param ax ax
			@param ay ay
			@param az az
			@param bx bx
			@param by by
			@param bz bz
			@param cx cx
			@param cy cy
			@param cz cz 
			*/
			create(ax: number, ay: number, az: number, bx: number, by: number, bz: number, cx: number, cy: number, cz: number): Triangle;			
			/**
			clone a new triangle
			@param t the source plane 
			*/
			clone(t: Triangle): Triangle;			
			/**
			copy the values from one triangle to another
			@param out the receiving triangle
			@param t the source triangle 
			*/
			copy(out: Triangle, t: Triangle): Triangle;			
			/**
			Create a triangle from three points
			@param out the receiving triangle
			@param a a
			@param b b
			@param c c 
			*/
			fromPoints(out: Triangle, a: Vec3, b: Vec3, c: Vec3): Triangle;			
			/**
			Set the components of a triangle to the given values
			@param out the receiving plane
			@param ax X component of a
			@param ay Y component of a
			@param az Z component of a
			@param bx X component of b
			@param by Y component of b
			@param bz Z component of b
			@param cx X component of c
			@param cy Y component of c
			@param cz Z component of c 
			*/
			set(out: Triangle, ax: number, ay: number, az: number, bx: number, by: number, bz: number, cx: number, cy: number, cz: number): Plane;			
			a: Vec3;			
			b: Vec3;			
			c: Vec3;		
		}	
	}
		
	/****************************************************
	* Graphics
	*****************************************************/
	
	export namespace Graphics {		
		/** !#en Enum for LineCap.
		!#zh 线段末端属性 */
		export enum LineCap {			
			BUTT = 0,
			ROUND = 0,
			SQUARE = 0,		
		}	
	}
		
	/****************************************************
	* Graphics
	*****************************************************/
	
	export namespace Graphics {		
		/** !#en Enum for LineJoin.
		!#zh 线段拐角属性 */
		export enum LineJoin {			
			BEVEL = 0,
			ROUND = 0,
			MITER = 0,		
		}	
	}
		
	/****************************************************
	* MeshRenderer
	*****************************************************/
	
	export namespace MeshRenderer {		
		/** !#en Shadow projection mode
		
		!#ch 阴影投射方式 */
		export enum ShadowCastingMode {			
			OFF = 0,
			ON = 0,		
		}	
	}
		
	/****************************************************
	* Animation
	*****************************************************/
	
	export namespace Animation {		
		/** !#en The event type supported by Animation
		!#zh Animation 支持的事件类型 */
		export class EventType {			
			/** !#en Emit when begin playing animation
			!#zh 开始播放时触发 */
			static PLAY: string;			
			/** !#en Emit when stop playing animation
			!#zh 停止播放时触发 */
			static STOP: string;			
			/** !#en Emit when pause animation
			!#zh 暂停播放时触发 */
			static PAUSE: string;			
			/** !#en Emit when resume animation
			!#zh 恢复播放时触发 */
			static RESUME: string;			
			/** !#en If animation repeat count is larger than 1, emit when animation play to the last frame
			!#zh 假如动画循环次数大于 1，当动画播放到最后一帧时触发 */
			static LASTFRAME: string;			
			/** !#en Emit when finish playing animation
			!#zh 动画播放完成时触发 */
			static FINISHED: string;		
		}	
	}
		
	/****************************************************
	* Button
	*****************************************************/
	
	export namespace Button {		
		/** !#en Enum for transition type.
		!#zh 过渡类型 */
		export enum Transition {			
			NONE = 0,
			COLOR = 0,
			SPRITE = 0,
			SCALE = 0,		
		}	
	}
		
	/****************************************************
	* Component
	*****************************************************/
	
	export namespace Component {		
		/** !#en
		Component will register a event to target component's handler.
		And it will trigger the handler when a certain event occurs.
		
		!@zh
		“EventHandler” 类用来设置场景中的事件回调，
		该类允许用户设置回调目标节点，目标组件名，组件方法名，
		并可通过 emit 方法调用目标函数。 */
		export class EventHandler {			
			/** !#en the node that contains target callback, such as the node example script belongs to
			!#zh 事件响应函数所在节点 ，比如例子中脚本归属的节点本身 */
			target: Node;			
			/** !#en name of the component(script) that contains target callback, such as the name 'MainMenu' of script in example
			!#zh 事件响应函数所在组件名（脚本名）, 比如例子中的脚本名 'MainMenu' */
			component: string;			
			/** !#en Event handler, such as function's name 'onClick' in example
			!#zh 响应事件函数名，比如例子中的 'onClick' */
			handler: string;			
			/** !#en Custom Event Data, such as 'eventType' in example
			!#zh 自定义事件数据，比如例子中的 eventType */
			customEventData: string;			
			/**
			
			@param events events
			@param params params 
			*/
			static emitEvents(events: EventHandler[], ...params: any[]): void;			
			/**
			!#en Emit event with params
			!#zh 触发目标组件上的指定 handler 函数，该参数是回调函数的参数值（可不填）。
			@param params params
			
			@example 
			```js
			// Call Function
			var eventHandler = new cc.Component.EventHandler();
			eventHandler.target = newTarget;
			eventHandler.component = "MainMenu";
			eventHandler.handler = "OnClick"
			eventHandler.emit(["param1", "param2", ....]);
			``` 
			*/
			emit(params: any[]): void;		
		}	
	}
		
	/****************************************************
	* Label
	*****************************************************/
	
	export namespace Label {		
		/** !#en Enum for text alignment.
		!#zh 文本横向对齐类型 */
		export enum HorizontalAlign {			
			LEFT = 0,
			CENTER = 0,
			RIGHT = 0,		
		}	
	}
		
	/****************************************************
	* Label
	*****************************************************/
	
	export namespace Label {		
		/** !#en Enum for vertical text alignment.
		!#zh 文本垂直对齐类型 */
		export enum VerticalAlign {			
			TOP = 0,
			CENTER = 0,
			BOTTOM = 0,		
		}	
	}
		
	/****************************************************
	* Label
	*****************************************************/
	
	export namespace Label {		
		/** !#en Enum for Overflow.
		!#zh Overflow 类型 */
		export enum Overflow {			
			NONE = 0,
			CLAMP = 0,
			SHRINK = 0,
			RESIZE_HEIGHT = 0,		
		}	
	}
		
	/****************************************************
	* Label
	*****************************************************/
	
	export namespace Label {		
		/** !#en Enum for font type.
		!#zh Type 类型 */
		export enum Type {			
			TTF = 0,
			BMFont = 0,
			SystemFont = 0,		
		}	
	}
		
	/****************************************************
	* Label
	*****************************************************/
	
	export namespace Label {		
		/** !#en Enum for cache mode.
		!#zh CacheMode 类型 */
		export enum CacheMode {			
			NONE = 0,
			BITMAP = 0,
			CHAR = 0,		
		}	
	}
		
	/****************************************************
	* Layout
	*****************************************************/
	
	export namespace Layout {		
		/** !#en Enum for Layout type
		!#zh 布局类型 */
		export enum Type {			
			NONE = 0,
			HORIZONTAL = 0,
			VERTICAL = 0,
			GRID = 0,		
		}	
	}
		
	/****************************************************
	* Layout
	*****************************************************/
	
	export namespace Layout {		
		/** !#en Enum for Layout Resize Mode
		!#zh 缩放模式 */
		export enum ResizeMode {			
			NONE = 0,
			CONTAINER = 0,
			CHILDREN = 0,		
		}	
	}
		
	/****************************************************
	* Layout
	*****************************************************/
	
	export namespace Layout {		
		/** !#en Enum for Grid Layout start axis direction.
		The items in grid layout will be arranged in each axis at first.;
		!#zh 布局轴向，只用于 GRID 布局。 */
		export enum AxisDirection {			
			HORIZONTAL = 0,
			VERTICAL = 0,		
		}	
	}
		
	/****************************************************
	* Layout
	*****************************************************/
	
	export namespace Layout {		
		/** !#en Enum for vertical layout direction.
		 Used in Grid Layout together with AxisDirection is VERTICAL
		!#zh 垂直方向布局方式 */
		export enum VerticalDirection {			
			BOTTOM_TO_TOP = 0,
			TOP_TO_BOTTOM = 0,		
		}	
	}
		
	/****************************************************
	* Layout
	*****************************************************/
	
	export namespace Layout {		
		/** !#en Enum for horizontal layout direction.
		 Used in Grid Layout together with AxisDirection is HORIZONTAL
		!#zh 水平方向布局方式 */
		export enum HorizontalDirection {			
			LEFT_TO_RIGHT = 0,
			RIGHT_TO_LEFT = 0,		
		}	
	}
		
	/****************************************************
	* Mask
	*****************************************************/
	
	export namespace Mask {		
		/** !#en the type for mask.
		!#zh 遮罩组件类型 */
		export enum Type {			
			RECT = 0,
			ELLIPSE = 0,
			IMAGE_STENCIL = 0,		
		}	
	}
		
	/****************************************************
	* PageView
	*****************************************************/
	
	export namespace PageView {		
		/** !#en The Page View Size Mode
		!#zh 页面视图每个页面统一的大小类型 */
		export enum SizeMode {			
			Unified = 0,
			Free = 0,		
		}	
	}
		
	/****************************************************
	* PageView
	*****************************************************/
	
	export namespace PageView {		
		/** !#en The Page View Direction
		!#zh 页面视图滚动类型 */
		export enum Direction {			
			Horizontal = 0,
			Vertical = 0,		
		}	
	}
		
	/****************************************************
	* PageView
	*****************************************************/
	
	export namespace PageView {		
		/** !#en Enum for ScrollView event type.
		!#zh 滚动视图事件类型 */
		export enum EventType {			
			PAGE_TURNING = 0,		
		}	
	}
		
	/****************************************************
	* PageViewIndicator
	*****************************************************/
	
	export namespace PageViewIndicator {		
		/** !#en Enum for PageView Indicator direction
		!#zh 页面视图指示器的摆放方向 */
		export enum Direction {			
			HORIZONTAL = 0,
			VERTICAL = 0,		
		}	
	}
		
	/****************************************************
	* ProgressBar
	*****************************************************/
	
	export namespace ProgressBar {		
		/** !#en Enum for ProgressBar mode
		!#zh 进度条模式 */
		export enum Mode {			
			HORIZONTAL = 0,
			VERTICAL = 0,
			FILLED = 0,		
		}	
	}
		
	/****************************************************
	* Scrollbar
	*****************************************************/
	
	export namespace Scrollbar {		
		/** Enum for Scrollbar direction */
		export enum Direction {			
			HORIZONTAL = 0,
			VERTICAL = 0,		
		}	
	}
		
	/****************************************************
	* ScrollView
	*****************************************************/
	
	export namespace ScrollView {		
		/** !#en Enum for ScrollView event type.
		!#zh 滚动视图事件类型 */
		export enum EventType {			
			SCROLL_TO_TOP = 0,
			SCROLL_TO_BOTTOM = 0,
			SCROLL_TO_LEFT = 0,
			SCROLL_TO_RIGHT = 0,
			SCROLLING = 0,
			BOUNCE_TOP = 0,
			BOUNCE_BOTTOM = 0,
			BOUNCE_LEFT = 0,
			BOUNCE_RIGHT = 0,
			SCROLL_ENDED = 0,
			TOUCH_UP = 0,
			AUTOSCROLL_ENDED_WITH_THRESHOLD = 0,
			SCROLL_BEGAN = 0,		
		}	
	}
		
	/****************************************************
	* Slider
	*****************************************************/
	
	export namespace Slider {		
		/** !#en The Slider Direction
		!#zh 滑动器方向 */
		export enum Direction {			
			Horizontal = 0,
			Vertical = 0,		
		}	
	}
		
	/****************************************************
	* Sprite
	*****************************************************/
	
	export namespace Sprite {		
		/** !#en Enum for sprite type.
		!#zh Sprite 类型 */
		export enum Type {			
			SIMPLE = 0,
			SLICED = 0,
			TILED = 0,
			FILLED = 0,
			MESH = 0,		
		}	
	}
		
	/****************************************************
	* Sprite
	*****************************************************/
	
	export namespace Sprite {		
		/** !#en Enum for fill type.
		!#zh 填充类型 */
		export enum FillType {			
			HORIZONTAL = 0,
			VERTICAL = 0,
			RADIAL = 0,		
		}	
	}
		
	/****************************************************
	* Sprite
	*****************************************************/
	
	export namespace Sprite {		
		/** !#en Sprite Size can track trimmed size, raw size or none.
		!#zh 精灵尺寸调整模式 */
		export enum SizeMode {			
			CUSTOM = 0,
			TRIMMED = 0,
			RAW = 0,		
		}	
	}
		
	/****************************************************
	* Sprite
	*****************************************************/
	
	export namespace Sprite {		
		/** !#en Sprite state can choice the normal or grayscale.
		!#zh 精灵颜色通道模式。 */
		export enum State {			
			NORMAL = 0,
			GRAY = 0,		
		}	
	}
		
	/****************************************************
	* Widget
	*****************************************************/
	
	export namespace Widget {		
		/** !#en Enum for Widget's alignment mode, indicating when the widget should refresh.
		!#zh Widget 的对齐模式，表示 Widget 应该何时刷新。 */
		export enum AlignMode {			
			ONCE = 0,
			ON_WINDOW_RESIZE = 0,
			ALWAYS = 0,		
		}	
	}
		
	/****************************************************
	* PhysicsManager
	*****************************************************/
	
	export namespace PhysicsManager {		
		/** !#en
		The draw bits for drawing physics debug information.<br>
		example:<br>
		```js
		cc.director.getPhysicsManager().debugDrawFlags =
		 // cc.PhysicsManager.DrawBits.e_aabbBit |
		 // cc.PhysicsManager.DrawBits.e_pairBit |
		 // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
		 cc.PhysicsManager.DrawBits.e_jointBit |
		 cc.PhysicsManager.DrawBits.e_shapeBit;
		```
		!#zh
		指定物理系统需要绘制哪些调试信息。<br>
		example:<br>
		```js
		cc.director.getPhysicsManager().debugDrawFlags =
		 // cc.PhysicsManager.DrawBits.e_aabbBit |
		 // cc.PhysicsManager.DrawBits.e_pairBit |
		 // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
		 cc.PhysicsManager.DrawBits.e_jointBit |
		 cc.PhysicsManager.DrawBits.e_shapeBit;
		``` */
		export enum DrawBits {			
			e_aabbBit = 0,
			e_jointBit = 0,
			e_shapeBit = 0,		
		}	
	}
		
	/****************************************************
	* Pipeline
	*****************************************************/
	
	export namespace Pipeline {		
		/** The downloader pipe, it can download several types of files:
		1. Text
		2. Image
		3. Script
		4. Audio
		5. Assets
		All unknown type will be downloaded as plain text.
		You can pass custom supported types in the constructor. */
		export class Downloader {			
			/**
			Constructor of Downloader, you can pass custom supported types.
			@param extMap Custom supported types with corresponded handler
			
			@example 
			```js
			var downloader = new Downloader({
			     // This will match all url with `.scene` extension or all url with `scene` type
			     'scene' : function (url, callback) {}
			 });
			``` 
			*/
			constructor(extMap: any);			
			/**
			Add custom supported types handler or modify existing type handler.
			@param extMap Custom supported types with corresponded handler 
			*/
			addHandlers(extMap: any): void;			
			/**
			!#en
			Load subpackage with name.
			!#zh
			通过子包名加载子包代码。
			@param name Subpackage name
			@param progressCallback Callback when progress changed
			@param completeCallback Callback invoked when subpackage loaded 
			*/
			loadSubpackage(name: string, progressCallback?: Function, completeCallback?: (error: Error) => void): void;		
		}	
	}
		
	/****************************************************
	* Pipeline
	*****************************************************/
	
	export namespace Pipeline {		
		/** The loader pipe, it can load several types of files:
		1. Images
		2. JSON
		3. Plist
		4. Audio
		5. Font
		6. Cocos Creator scene
		It will not interfere with items of unknown type.
		You can pass custom supported types in the constructor. */
		export class Loader {			
			/**
			Constructor of Loader, you can pass custom supported types.
			@param extMap Custom supported types with corresponded handler
			
			@example 
			```js
			var loader = new Loader({
			   // This will match all url with `.scene` extension or all url with `scene` type
			   'scene' : function (url, callback) {}
			});
			``` 
			*/
			constructor(extMap: any);			
			/**
			Add custom supported types handler or modify existing type handler.
			@param extMap Custom supported types with corresponded handler 
			*/
			addHandlers(extMap: any): void;		
		}	
	}
		
	/****************************************************
	* LoadingItems
	*****************************************************/
	
	export namespace LoadingItems {		
		/** !#en The item states of the LoadingItems, its value could be LoadingItems.ItemState.WORKING | LoadingItems.ItemState.COMPLETET | LoadingItems.ItemState.ERROR
		!#zh LoadingItems 队列中的加载项状态，状态的值可能是 LoadingItems.ItemState.WORKING | LoadingItems.ItemState.COMPLETET | LoadingItems.ItemState.ERROR */
		export enum ItemState {			
			WORKING = 0,
			COMPLETET = 0,
			ERROR = 0,		
		}	
	}
		
	/****************************************************
	* macro
	*****************************************************/
	
	export namespace macro {		
		/** !#en Key map for keyboard event
		!#zh 键盘事件的按键值 */
		export enum KEY {			
			none = 0,
			back = 0,
			menu = 0,
			backspace = 0,
			tab = 0,
			enter = 0,
			shift = 0,
			ctrl = 0,
			alt = 0,
			pause = 0,
			capslock = 0,
			escape = 0,
			space = 0,
			pageup = 0,
			pagedown = 0,
			end = 0,
			home = 0,
			left = 0,
			up = 0,
			right = 0,
			down = 0,
			select = 0,
			insert = 0,
			Delete = 0,
			a = 0,
			b = 0,
			c = 0,
			d = 0,
			e = 0,
			f = 0,
			g = 0,
			h = 0,
			i = 0,
			j = 0,
			k = 0,
			l = 0,
			m = 0,
			n = 0,
			o = 0,
			p = 0,
			q = 0,
			r = 0,
			s = 0,
			t = 0,
			u = 0,
			v = 0,
			w = 0,
			x = 0,
			y = 0,
			z = 0,
			num0 = 0,
			num1 = 0,
			num2 = 0,
			num3 = 0,
			num4 = 0,
			num5 = 0,
			num6 = 0,
			num7 = 0,
			num8 = 0,
			num9 = 0,
			'*' = 0,
			'+' = 0,
			'-' = 0,
			numdel = 0,
			'/' = 0,
			f1 = 0,
			f2 = 0,
			f3 = 0,
			f4 = 0,
			f5 = 0,
			f6 = 0,
			f7 = 0,
			f8 = 0,
			f9 = 0,
			f10 = 0,
			f11 = 0,
			f12 = 0,
			numlock = 0,
			scrolllock = 0,
			';' = 0,
			semicolon = 0,
			equal = 0,
			'=' = 0,
			',' = 0,
			comma = 0,
			dash = 0,
			'.' = 0,
			period = 0,
			forwardslash = 0,
			grave = 0,
			'[' = 0,
			openbracket = 0,
			backslash = 0,
			']' = 0,
			closebracket = 0,
			quote = 0,
			dpadLeft = 0,
			dpadRight = 0,
			dpadUp = 0,
			dpadDown = 0,
			dpadCenter = 0,		
		}	
	}
		
	/****************************************************
	* macro
	*****************************************************/
	
	export namespace macro {		
		/** Image formats */
		export enum ImageFormat {			
			JPG = 0,
			PNG = 0,
			TIFF = 0,
			WEBP = 0,
			PVR = 0,
			ETC = 0,
			S3TC = 0,
			ATITC = 0,
			TGA = 0,
			RAWDATA = 0,
			UNKNOWN = 0,		
		}	
	}
		
	/****************************************************
	* macro
	*****************************************************/
	
	export namespace macro {		
		/** !#en
		Enum for blend factor
		Refer to: http://www.andersriggelsen.dk/glblendfunc.php
		!#zh
		混合因子
		可参考: http://www.andersriggelsen.dk/glblendfunc.php */
		export enum BlendFactor {			
			ONE = 0,
			ZERO = 0,
			SRC_ALPHA = 0,
			SRC_COLOR = 0,
			DST_ALPHA = 0,
			DST_COLOR = 0,
			ONE_MINUS_SRC_ALPHA = 0,
			ONE_MINUS_SRC_COLOR = 0,
			ONE_MINUS_DST_ALPHA = 0,
			ONE_MINUS_DST_COLOR = 0,		
		}	
	}
		
	/****************************************************
	* macro
	*****************************************************/
	
	export namespace macro {		
		/** undefined */
		export enum TextAlignment {			
			LEFT = 0,
			CENTER = 0,
			RIGHT = 0,		
		}	
	}
		
	/****************************************************
	* sys
	*****************************************************/
	
	export namespace sys {		
		/** !#en
		Network type enumeration
		!#zh
		网络类型枚举 */
		export enum NetworkType {			
			NONE = 0,
			LAN = 0,
			WWAN = 0,		
		}	
	}
		
	/****************************************************
	* primitive
	*****************************************************/
	
	export namespace primitive {		
		/** undefined */
		export enum PolyhedronType {			
			Tetrahedron = 0,
			Octahedron = 0,
			Dodecahedron = 0,
			Icosahedron = 0,
			Rhombicuboctahedron = 0,
			TriangularPrism = 0,
			PentagonalPrism = 0,
			HexagonalPrism = 0,
			SquarePyramid = 0,
			PentagonalPyramid = 0,
			TriangularDipyramid = 0,
			PentagonalDipyramid = 0,
			ElongatedSquareDipyramid = 0,
			ElongatedPentagonalDipyramid = 0,
			ElongatedPentagonalCupola = 0,		
		}	
	}
		
	/****************************************************
	* primitive
	*****************************************************/
	
	export namespace primitive {		
		/** undefined */
		export class VertexData {			
			positions: number[];			
			normals: number[];			
			uvs: number[];			
			indices: number[];			
			minPos: Vec3;			
			maxPos: Vec3;			
			boundingRadius: number;		
		}	
	}
		
	/****************************************************
	* ParticleSystem3DAssembler
	*****************************************************/
	
	export namespace ParticleSystem3DAssembler {		
		/** 粒子的生成模式 */
		export enum RenderMode {					
		}	
	}
		
	/****************************************************
	* shapeModule
	*****************************************************/
	
	export namespace shapeModule {		
		/** 粒子发射器类型 */
		export enum ShapeType {			
			Box = 0,
			Circle = 0,
			Cone = 0,
			Sphere = 0,
			Hemisphere = 0,		
		}	
	}
		
	/****************************************************
	* shapeModule
	*****************************************************/
	
	export namespace shapeModule {		
		/** 粒子从发射器的哪个部位发射 */
		export enum EmitLocation {			
			Base = 0,
			Edge = 0,
			Shell = 0,
			Volume = 0,		
		}	
	}
		
	/****************************************************
	* shapeModule
	*****************************************************/
	
	export namespace shapeModule {		
		/** 粒子在扇形区域的发射方式 */
		export enum ArcMode {			
			Random = 0,
			Loop = 0,
			PingPong = 0,		
		}	
	}
		
	/****************************************************
	* trailModule
	*****************************************************/
	
	export namespace trailModule {		
		/** 选择如何为粒子系统生成轨迹 */
		export enum TrailMode {					
		}	
	}
		
	/****************************************************
	* trailModule
	*****************************************************/
	
	export namespace trailModule {		
		/** 纹理填充模式 */
		export enum TextureMode {					
		}	
	}
		
	/****************************************************
	* Material
	*****************************************************/
	
	export namespace Material {		
		/** !#en Material builtin name
		!#zh 内置材质名字 */
		export enum BUILTIN_NAME {			
			SPRITE = 0,
			GRAY_SPRITE = 0,
			UNLIT = 0,		
		}	
	}
		
	/****************************************************
	* EditBox
	*****************************************************/
	
	export namespace EditBox {		
		/** !#en Enum for keyboard return types
		!#zh 键盘的返回键类型 */
		export enum KeyboardReturnType {			
			DEFAULT = 0,
			DONE = 0,
			SEND = 0,
			SEARCH = 0,
			GO = 0,
			NEXT = 0,		
		}	
	}
		
	/****************************************************
	* EditBox
	*****************************************************/
	
	export namespace EditBox {		
		/** !#en The EditBox's InputMode defines the type of text that the user is allowed to enter.
		!#zh 输入模式 */
		export enum InputMode {			
			ANY = 0,
			EMAIL_ADDR = 0,
			NUMERIC = 0,
			PHONE_NUMBER = 0,
			URL = 0,
			DECIMAL = 0,
			SINGLE_LINE = 0,		
		}	
	}
		
	/****************************************************
	* EditBox
	*****************************************************/
	
	export namespace EditBox {		
		/** !#en Enum for the EditBox's input flags
		!#zh 定义了一些用于设置文本显示和文本格式化的标志位。 */
		export enum InputFlag {			
			PASSWORD = 0,
			SENSITIVE = 0,
			INITIAL_CAPS_WORD = 0,
			INITIAL_CAPS_SENTENCE = 0,
			INITIAL_CAPS_ALL_CHARACTERS = 0,
			DEFAULT = 0,		
		}	
	}
		
	/****************************************************
	* textureAnimationModule
	*****************************************************/
	
	export namespace textureAnimationModule {		
		/** 粒子贴图动画类型 */
		export enum Mode {					
		}	
	}
		
	/****************************************************
	* textureAnimationModule
	*****************************************************/
	
	export namespace textureAnimationModule {		
		/** 贴图动画的播放方式 */
		export enum Animation {					
		}	
	}
	
}

/** !#en
The global main namespace of DragonBones, all classes, functions,
properties and constants of DragonBones are defined in this namespace
!#zh
DragonBones 的全局的命名空间，
与 DragonBones 相关的所有的类，函数，属性，常量都在这个命名空间中定义。 */
declare namespace dragonBones {	
	/** !#en
	The Armature Display of DragonBones <br/>
	<br/>
	(Armature Display has a reference to a DragonBonesAsset and stores the state for ArmatureDisplay instance,
	which consists of the current pose's bone SRT, slot colors, and which slot attachments are visible. <br/>
	Multiple Armature Display can use the same DragonBonesAsset which includes all animations, skins, and attachments.) <br/>
	!#zh
	DragonBones 骨骼动画 <br/>
	<br/>
	(Armature Display 具有对骨骼数据的引用并且存储了骨骼实例的状态，
	它由当前的骨骼动作，slot 颜色，和可见的 slot attachments 组成。<br/>
	多个 Armature Display 可以使用相同的骨骼数据，其中包括所有的动画，皮肤和 attachments。)<br/> */
	export class ArmatureDisplay extends cc.RenderComponent {		
		/** !#en
		The DragonBones data contains the armatures information (bind pose bones, slots, draw order,
		attachments, skins, etc) and animations but does not hold any state.<br/>
		Multiple ArmatureDisplay can share the same DragonBones data.
		!#zh
		骨骼数据包含了骨骼信息（绑定骨骼动作，slots，渲染顺序，
		attachments，皮肤等等）和动画但不持有任何状态。<br/>
		多个 ArmatureDisplay 可以共用相同的骨骼数据。 */
		dragonAsset: DragonBonesAsset;		
		/** !#en
		The atlas asset for the DragonBones.
		!#zh
		骨骼数据所需的 Atlas Texture 数据。 */
		dragonAtlasAsset: DragonBonesAtlasAsset;		
		/** !#en The name of current armature.
		!#zh 当前的 Armature 名称。 */
		armatureName: string;		
		/** !#en The name of current playing animation.
		!#zh 当前播放的动画名称。 */
		animationName: string;		
		_defaultArmatureIndex: number;		
		/** !#en The time scale of this armature.
		!#zh 当前骨骼中所有动画的时间缩放率。 */
		timeScale: number;		
		/** !#en The play times of the default animation.
		     -1 means using the value of config file;
		     0 means repeat for ever
		     >0 means repeat times
		!#zh 播放默认动画的循环次数
		     -1 表示使用配置文件中的默认值;
		     0 表示无限循环
		     >0 表示循环次数 */
		playTimes: number;		
		/** !#en Indicates whether to enable premultiplied alpha.
		You should disable this option when image's transparent area appears to have opaque pixels,
		or enable this option when image's half transparent area appears to be darken.
		!#zh 是否启用贴图预乘。
		当图片的透明区域出现色块时需要关闭该选项，当图片的半透明区域颜色变黑时需要启用该选项。 */
		premultipliedAlpha: boolean;		
		/** !#en Indicates whether open debug bones.
		!#zh 是否显示 bone 的 debug 信息。 */
		debugBones: boolean;		
		/** !#en Enabled batch model, if skeleton is complex, do not enable batch, or will lower performance.
		!#zh 开启合批，如果渲染大量相同纹理，且结构简单的骨骼动画，开启合批可以降低drawcall，否则请不要开启，cpu消耗会上升。 */
		enableBatch: boolean;		
		/**
		!#en
		The key of dragonbones cache data, which is regard as 'dragonbonesName', when you want to change dragonbones cloth.
		!#zh
		缓存龙骨数据的key值，换装的时会使用到该值，作为dragonbonesName使用
		
		@example 
		```js
		let factory = dragonBones.CCFactory.getInstance();
		let needChangeSlot = needChangeArmature.armature().getSlot("changeSlotName");
		factory.replaceSlotDisplay(toChangeArmature.getArmatureKey(), "armatureName", "slotName", "displayName", needChangeSlot);
		``` 
		*/
		getArmatureKey(): string;		
		/**
		!#en
		It's best to set cache mode before set property 'dragonAsset', or will waste some cpu time.
		If set the mode in editor, then no need to worry about order problem.
		!#zh
		若想切换渲染模式，最好在设置'dragonAsset'之前，先设置好渲染模式，否则有运行时开销。
		若在编辑中设置渲染模式，则无需担心设置次序的问题。
		@param cacheMode cacheMode
		
		@example 
		```js
		armatureDisplay.setAnimationCacheMode(dragonBones.ArmatureDisplay.AnimationCacheMode.SHARED_CACHE);
		``` 
		*/
		setAnimationCacheMode(cacheMode: ArmatureDisplay.AnimationCacheMode): void;		
		/**
		!#en Whether in cached mode.
		!#zh 当前是否处于缓存模式。 
		*/
		isAnimationCached(): boolean;		
		/**
		!#en
		Play the specified animation.
		Parameter animName specify the animation name.
		Parameter playTimes specify the repeat times of the animation.
		-1 means use the value of the config file.
		0 means play the animation for ever.
		>0 means repeat times.
		!#zh
		播放指定的动画.
		animName 指定播放动画的名称。
		playTimes 指定播放动画的次数。
		-1 为使用配置文件中的次数。
		0 为无限循环播放。
		>0 为动画的重复次数。
		@param animName animName
		@param playTimes playTimes 
		*/
		playAnimation(animName: string, playTimes: number): dragonBones.AnimationState;		
		/**
		!#en
		Updating an animation cache to calculate all frame data in the animation is a cost in
		performance due to calculating all data in a single frame.
		To update the cache, use the invalidAnimationCache method with high performance.
		!#zh
		更新某个动画缓存, 预计算动画中所有帧数据，由于在单帧计算所有数据，所以较消耗性能。
		若想更新缓存，可使用 invalidAnimationCache 方法，具有较高性能。
		@param animName animName 
		*/
		updateAnimationCache(animName: string): void;		
		/**
		!#en
		Invalidates the animation cache, which is then recomputed on each frame..
		!#zh
		使动画缓存失效，之后会在每帧重新计算。 
		*/
		invalidAnimationCache(): void;		
		/**
		!#en
		Get the all armature names in the DragonBones Data.
		!#zh
		获取 DragonBones 数据中所有的 armature 名称 
		*/
		getArmatureNames(): any[];		
		/**
		!#en
		Get the all animation names of specified armature.
		!#zh
		获取指定的 armature 的所有动画名称。
		@param armatureName armatureName 
		*/
		getAnimationNames(armatureName: string): any[];		
		/**
		!#en
		Add event listener for the DragonBones Event, the same to addEventListener.
		!#zh
		添加 DragonBones 事件监听器，与 addEventListener 作用相同。
		@param type A string representing the event type to listen for.
		@param listener The callback that will be invoked when the event is dispatched.
		@param target The target (this object) to invoke the callback, can be null 
		*/
		on(type: string, listener: (event: cc.Event) => void, target?: any): void;		
		/**
		!#en
		Remove the event listener for the DragonBones Event, the same to removeEventListener.
		!#zh
		移除 DragonBones 事件监听器，与 removeEventListener 作用相同。
		@param type A string representing the event type to listen for.
		@param listener listener
		@param target target 
		*/
		off(type: string, listener?: Function, target?: any): void;		
		/**
		!#en
		Add DragonBones one-time event listener, the callback will remove itself after the first time it is triggered.
		!#zh
		添加 DragonBones 一次性事件监听器，回调会在第一时间被触发后删除自身。
		@param type A string representing the event type to listen for.
		@param listener The callback that will be invoked when the event is dispatched.
		@param target The target (this object) to invoke the callback, can be null 
		*/
		once(type: string, listener: (event: cc.Event) => void, target?: any): void;		
		/**
		!#en
		Add event listener for the DragonBones Event.
		!#zh
		添加 DragonBones 事件监听器。
		@param type A string representing the event type to listen for.
		@param listener The callback that will be invoked when the event is dispatched.
		@param target The target (this object) to invoke the callback, can be null 
		*/
		addEventListener(type: string, listener: (event: cc.Event) => void, target?: any): void;		
		/**
		!#en
		Remove the event listener for the DragonBones Event.
		!#zh
		移除 DragonBones 事件监听器。
		@param type A string representing the event type to listen for.
		@param listener listener
		@param target target 
		*/
		removeEventListener(type: string, listener?: Function, target?: any): void;		
		/**
		!#en
		Build the armature for specified name.
		!#zh
		构建指定名称的 armature 对象
		@param armatureName armatureName
		@param node node 
		*/
		buildArmature(armatureName: string, node: cc.Node): ArmatureDisplay;		
		/**
		!#en
		Get the current armature object of the ArmatureDisplay.
		!#zh
		获取 ArmatureDisplay 当前使用的 Armature 对象 
		*/
		armature(): any;	
	}	
	/** DragonBones factory */
	export class CCFactory extends BaseFactory {		
		/**
		
		
		@example 
		```js
		let factory = dragonBones.CCFactory.getInstance();
		``` 
		*/
		static getInstance(): CCFactory;	
	}	
	/** !#en The skeleton data of dragonBones.
	!#zh dragonBones 的 骨骼数据。 */
	export class DragonBonesAsset extends cc.Asset {		
		/** !#en See http://developer.egret.com/cn/github/egret-docs/DB/dbLibs/dataFormat/index.html
		!#zh 可查看 DragonBones 官方文档 http://developer.egret.com/cn/github/egret-docs/DB/dbLibs/dataFormat/index.html */
		dragonBonesJson: string;	
	}	
	/** !#en The skeleton atlas data of dragonBones.
	!#zh dragonBones 的骨骼纹理数据。 */
	export class DragonBonesAtlasAsset extends cc.Asset {		
		atlasJson: string;		
		texture: cc.Texture2D;	
	}	
	/****************************************************
	* ArmatureDisplay
	*****************************************************/
	
	export namespace ArmatureDisplay {		
		/** !#en Enum for cache mode type.
		!#zh Dragonbones渲染类型 */
		export enum AnimationCacheMode {			
			REALTIME = 0,
			SHARED_CACHE = 0,
			PRIVATE_CACHE = 0,		
		}	
	}
		
	/****************************************************
	* dragonBones
	*****************************************************/
	
	export namespace dragonBones {		
		/** !#en Attach node tool
		!#zh 挂点工具类 */
		export class AttachUtil {			
			/**
			!#en Gets attached root node.
			!#zh 获取挂接节点树的根节点 
			*/
			getAttachedRootNode(): cc.Node;			
			/**
			!#en Gets attached node which you want.
			!#zh 获得对应的挂点
			@param boneName boneName 
			*/
			getAttachedNodes(boneName: string): cc.Node[];			
			/**
			!#en Destroy attached node which you want.
			!#zh 销毁对应的挂点
			@param boneName boneName 
			*/
			destroyAttachedNodes(boneName: string): void;			
			/**
			!#en Traverse all bones to generate the minimum node tree containing the given bone names, NOTE that make sure the skeleton has initialized before calling this interface.
			!#zh 遍历所有插槽，生成包含所有给定插槽名称的最小节点树，注意，调用该接口前请确保骨骼动画已经初始化好。
			@param boneName boneName 
			*/
			generateAttachedNodes(boneName: string): cc.Node[];			
			/**
			!#en Destroy all attached node.
			!#zh 销毁所有挂点 
			*/
			destroyAllAttachedNodes(): void;			
			/**
			!#en Traverse all bones to generate a tree containing all bones nodes, NOTE that make sure the skeleton has initialized before calling this interface.
			!#zh 遍历所有插槽，生成包含所有插槽的节点树，注意，调用该接口前请确保骨骼动画已经初始化好。 
			*/
			generateAllAttachedNodes(): cc.Node;		
		}	
	}
	
}

/** !#en
The global main namespace of Spine, all classes, functions,
properties and constants of Spine are defined in this namespace
!#zh
Spine 的全局的命名空间，
与 Spine 相关的所有的类，函数，属性，常量都在这个命名空间中定义。 */
declare namespace sp {	
	/** !#en
	The skeleton of Spine <br/>
	<br/>
	(Skeleton has a reference to a SkeletonData and stores the state for skeleton instance,
	which consists of the current pose's bone SRT, slot colors, and which slot attachments are visible. <br/>
	Multiple skeletons can use the same SkeletonData which includes all animations, skins, and attachments.) <br/>
	!#zh
	Spine 骨骼动画 <br/>
	<br/>
	(Skeleton 具有对骨骼数据的引用并且存储了骨骼实例的状态，
	它由当前的骨骼动作，slot 颜色，和可见的 slot attachments 组成。<br/>
	多个 Skeleton 可以使用相同的骨骼数据，其中包括所有的动画，皮肤和 attachments。 */
	export class Skeleton extends cc.RenderComponent {		
		/** !#en The skeletal animation is paused?
		!#zh 该骨骼动画是否暂停。 */
		paused: boolean;		
		/** !#en
		The skeleton data contains the skeleton information (bind pose bones, slots, draw order,
		attachments, skins, etc) and animations but does not hold any state.<br/>
		Multiple skeletons can share the same skeleton data.
		!#zh
		骨骼数据包含了骨骼信息（绑定骨骼动作，slots，渲染顺序，
		attachments，皮肤等等）和动画但不持有任何状态。<br/>
		多个 Skeleton 可以共用相同的骨骼数据。 */
		skeletonData: SkeletonData;		
		/** !#en The name of default skin.
		!#zh 默认的皮肤名称。 */
		defaultSkin: string;		
		/** !#en The name of default animation.
		!#zh 默认的动画名称。 */
		defaultAnimation: string;		
		/** !#en The name of current playing animation.
		!#zh 当前播放的动画名称。 */
		animation: string;		
		_defaultSkinIndex: number;		
		/** !#en TODO
		!#zh 是否循环播放当前骨骼动画。 */
		loop: boolean;		
		/** !#en Indicates whether to enable premultiplied alpha.
		You should disable this option when image's transparent area appears to have opaque pixels,
		or enable this option when image's half transparent area appears to be darken.
		!#zh 是否启用贴图预乘。
		当图片的透明区域出现色块时需要关闭该选项，当图片的半透明区域颜色变黑时需要启用该选项。 */
		premultipliedAlpha: boolean;		
		/** !#en The time scale of this skeleton.
		!#zh 当前骨骼中所有动画的时间缩放率。 */
		timeScale: number;		
		/** !#en Indicates whether open debug slots.
		!#zh 是否显示 slot 的 debug 信息。 */
		debugSlots: boolean;		
		/** !#en Indicates whether open debug bones.
		!#zh 是否显示 bone 的 debug 信息。 */
		debugBones: boolean;		
		/** !#en Indicates whether open debug mesh.
		!#zh 是否显示 mesh 的 debug 信息。 */
		debugMesh: boolean;		
		/** !#en Enabled two color tint.
		!#zh 是否启用染色效果。 */
		useTint: boolean;		
		/** !#en Enabled batch model, if skeleton is complex, do not enable batch, or will lower performance.
		!#zh 开启合批，如果渲染大量相同纹理，且结构简单的骨骼动画，开启合批可以降低drawcall，否则请不要开启，cpu消耗会上升。 */
		enableBatch: boolean;		
		/**
		!#en
		Sets runtime skeleton data to sp.Skeleton.<br>
		This method is different from the `skeletonData` property. This method is passed in the raw data provided by the Spine runtime, and the skeletonData type is the asset type provided by Creator.
		!#zh
		设置底层运行时用到的 SkeletonData。<br>
		这个接口有别于 `skeletonData` 属性，这个接口传入的是 Spine runtime 提供的原始数据，而 skeletonData 的类型是 Creator 提供的资源类型。
		@param skeletonData skeletonData 
		*/
		setSkeletonData(skeletonData: sp.spine.SkeletonData): void;		
		/**
		!#en Sets slots visible range.
		!#zh 设置骨骼插槽可视范围。
		@param startSlotIndex startSlotIndex
		@param endSlotIndex endSlotIndex 
		*/
		setSlotsRange(startSlotIndex: number, endSlotIndex: number): void;		
		/**
		!#en Sets animation state data.<br>
		The parameter type is {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.AnimationStateData.
		!#zh 设置动画状态数据。<br>
		参数是 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.AnimationStateData。
		@param stateData stateData 
		*/
		setAnimationStateData(stateData: sp.spine.AnimationStateData): void;		
		/**
		!#en
		It's best to set cache mode before set property 'dragonAsset', or will waste some cpu time.
		If set the mode in editor, then no need to worry about order problem.
		!#zh
		若想切换渲染模式，最好在设置'dragonAsset'之前，先设置好渲染模式，否则有运行时开销。
		若在编辑中设置渲染模式，则无需担心设置次序的问题。
		@param cacheMode cacheMode
		
		@example 
		```js
		skeleton.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.SHARED_CACHE);
		``` 
		*/
		setAnimationCacheMode(cacheMode: Skeleton.AnimationCacheMode): void;		
		/**
		!#en Whether in cached mode.
		!#zh 当前是否处于缓存模式。 
		*/
		isAnimationCached(): boolean;		
		/**
		!#en Sets vertex effect delegate.
		!#zh 设置顶点动画代理
		@param effectDelegate effectDelegate 
		*/
		setVertexEffectDelegate(effectDelegate: VertexEffectDelegate): void;		
		/**
		!#en Computes the world SRT from the local SRT for each bone.
		!#zh 重新更新所有骨骼的世界 Transform，
		当获取 bone 的数值未更新时，即可使用该函数进行更新数值。
		
		@example 
		```js
		var bone = spine.findBone('head');
		cc.log(bone.worldX); // return 0;
		spine.updateWorldTransform();
		bone = spine.findBone('head');
		cc.log(bone.worldX); // return -23.12;
		``` 
		*/
		updateWorldTransform(): void;		
		/**
		!#en Sets the bones and slots to the setup pose.
		!#zh 还原到起始动作 
		*/
		setToSetupPose(): void;		
		/**
		!#en
		Sets the bones to the setup pose,
		using the values from the `BoneData` list in the `SkeletonData`.
		!#zh
		设置 bone 到起始动作
		使用 SkeletonData 中的 BoneData 列表中的值。 
		*/
		setBonesToSetupPose(): void;		
		/**
		!#en
		Sets the slots to the setup pose,
		using the values from the `SlotData` list in the `SkeletonData`.
		!#zh
		设置 slot 到起始动作。
		使用 SkeletonData 中的 SlotData 列表中的值。 
		*/
		setSlotsToSetupPose(): void;		
		/**
		!#en
		Updating an animation cache to calculate all frame data in the animation is a cost in
		performance due to calculating all data in a single frame.
		To update the cache, use the invalidAnimationCache method with high performance.
		!#zh
		更新某个动画缓存, 预计算动画中所有帧数据，由于在单帧计算所有数据，所以较消耗性能。
		若想更新缓存，可使用 invalidAnimationCache 方法，具有较高性能。
		@param animName animName 
		*/
		updateAnimationCache(animName: string): void;		
		/**
		!#en
		Invalidates the animation cache, which is then recomputed on each frame..
		!#zh
		使动画缓存失效，之后会在每帧重新计算。 
		*/
		invalidAnimationCache(): void;		
		/**
		!#en
		Finds a bone by name.
		This does a string comparison for every bone.<br>
		Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Bone object.
		!#zh
		通过名称查找 bone。
		这里对每个 bone 的名称进行了对比。<br>
		返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Bone 对象。
		@param boneName boneName 
		*/
		findBone(boneName: string): sp.spine.Bone;		
		/**
		!#en
		Finds a slot by name. This does a string comparison for every slot.<br>
		Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Slot object.
		!#zh
		通过名称查找 slot。这里对每个 slot 的名称进行了比较。<br>
		返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Slot 对象。
		@param slotName slotName 
		*/
		findSlot(slotName: string): sp.spine.Slot;		
		/**
		!#en
		Finds a skin by name and makes it the active skin.
		This does a string comparison for every skin.<br>
		Note that setting the skin does not change which attachments are visible.<br>
		Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Skin object.
		!#zh
		按名称查找皮肤，激活该皮肤。这里对每个皮肤的名称进行了比较。<br>
		注意：设置皮肤不会改变 attachment 的可见性。<br>
		返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Skin 对象。
		@param skinName skinName 
		*/
		setSkin(skinName: string): void;		
		/**
		!#en
		Returns the attachment for the slot and attachment name.
		The skeleton looks first in its skin, then in the skeleton data’s default skin.<br>
		Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Attachment object.
		!#zh
		通过 slot 和 attachment 的名称获取 attachment。Skeleton 优先查找它的皮肤，然后才是 Skeleton Data 中默认的皮肤。<br>
		返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Attachment 对象。
		@param slotName slotName
		@param attachmentName attachmentName 
		*/
		getAttachment(slotName: string, attachmentName: string): sp.spine.Attachment;		
		/**
		!#en
		Sets the attachment for the slot and attachment name.
		The skeleton looks first in its skin, then in the skeleton data’s default skin.
		!#zh
		通过 slot 和 attachment 的名字来设置 attachment。
		Skeleton 优先查找它的皮肤，然后才是 Skeleton Data 中默认的皮肤。
		@param slotName slotName
		@param attachmentName attachmentName 
		*/
		setAttachment(slotName: string, attachmentName: string): void;		
		/**
		Return the renderer of attachment.
		@param regionAttachment regionAttachment 
		*/
		getTextureAtlas(regionAttachment: sp.spine.RegionAttachment|spine.BoundingBoxAttachment): sp.spine.TextureAtlasRegion;		
		/**
		!#en
		Mix applies all keyframe values,
		interpolated for the specified time and mixed with the current values.
		!#zh 为所有关键帧设定混合及混合时间（从当前值开始差值）。
		@param fromAnimation fromAnimation
		@param toAnimation toAnimation
		@param duration duration 
		*/
		setMix(fromAnimation: string, toAnimation: string, duration: number): void;		
		/**
		!#en Set the current animation. Any queued animations are cleared.<br>
		Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry object.
		!#zh 设置当前动画。队列中的任何的动画将被清除。<br>
		返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry 对象。
		@param trackIndex trackIndex
		@param name name
		@param loop loop 
		*/
		setAnimation(trackIndex: number, name: string, loop: boolean): sp.spine.TrackEntry;		
		/**
		!#en Adds an animation to be played delay seconds after the current or last queued animation.<br>
		Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry object.
		!#zh 添加一个动画到动画队列尾部，还可以延迟指定的秒数。<br>
		返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry 对象。
		@param trackIndex trackIndex
		@param name name
		@param loop loop
		@param delay delay 
		*/
		addAnimation(trackIndex: number, name: string, loop: boolean, delay?: number): sp.spine.TrackEntry;		
		/**
		!#en Find animation with specified name.
		!#zh 查找指定名称的动画
		@param name name 
		*/
		findAnimation(name: string): sp.spine.Animation;		
		/**
		!#en Returns track entry by trackIndex.<br>
		Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry object.
		!#zh 通过 track 索引获取 TrackEntry。<br>
		返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry 对象。
		@param trackIndex trackIndex 
		*/
		getCurrent(trackIndex: any): sp.spine.TrackEntry;		
		/**
		!#en Clears all tracks of animation state.
		!#zh 清除所有 track 的动画状态。 
		*/
		clearTracks(): void;		
		/**
		!#en Clears track of animation state by trackIndex.
		!#zh 清除出指定 track 的动画状态。
		@param trackIndex trackIndex 
		*/
		clearTrack(trackIndex: number): void;		
		/**
		!#en Set the start event listener.
		!#zh 用来设置开始播放动画的事件监听。
		@param listener listener 
		*/
		setStartListener(listener: Function): void;		
		/**
		!#en Set the interrupt event listener.
		!#zh 用来设置动画被打断的事件监听。
		@param listener listener 
		*/
		setInterruptListener(listener: Function): void;		
		/**
		!#en Set the end event listener.
		!#zh 用来设置动画播放完后的事件监听。
		@param listener listener 
		*/
		setEndListener(listener: Function): void;		
		/**
		!#en Set the dispose event listener.
		!#zh 用来设置动画将被销毁的事件监听。
		@param listener listener 
		*/
		setDisposeListener(listener: Function): void;		
		/**
		!#en Set the complete event listener.
		!#zh 用来设置动画播放一次循环结束后的事件监听。
		@param listener listener 
		*/
		setCompleteListener(listener: Function): void;		
		/**
		!#en Set the animation event listener.
		!#zh 用来设置动画播放过程中帧事件的监听。
		@param listener listener 
		*/
		setEventListener(listener: Function): void;		
		/**
		!#en Set the start event listener for specified TrackEntry.
		!#zh 用来为指定的 TrackEntry 设置动画开始播放的事件监听。
		@param entry entry
		@param listener listener 
		*/
		setTrackStartListener(entry: sp.spine.TrackEntry, listener: Function): void;		
		/**
		!#en Set the interrupt event listener for specified TrackEntry.
		!#zh 用来为指定的 TrackEntry 设置动画被打断的事件监听。
		@param entry entry
		@param listener listener 
		*/
		setTrackInterruptListener(entry: sp.spine.TrackEntry, listener: Function): void;		
		/**
		!#en Set the end event listener for specified TrackEntry.
		!#zh 用来为指定的 TrackEntry 设置动画播放结束的事件监听。
		@param entry entry
		@param listener listener 
		*/
		setTrackEndListener(entry: sp.spine.TrackEntry, listener: Function): void;		
		/**
		!#en Set the dispose event listener for specified TrackEntry.
		!#zh 用来为指定的 TrackEntry 设置动画即将被销毁的事件监听。
		@param entry entry
		@param listener listener 
		*/
		setTrackDisposeListener(entry: sp.spine.TrackEntry, listener: Function): void;		
		/**
		!#en Set the complete event listener for specified TrackEntry.
		!#zh 用来为指定的 TrackEntry 设置动画一次循环播放结束的事件监听。
		@param entry entry
		@param listener listener 
		*/
		setTrackCompleteListener(entry: sp.spine.TrackEntry, listener: (entry: sp.spine.TrackEntry, loopCount: number) => void): void;		
		/**
		!#en Set the event listener for specified TrackEntry.
		!#zh 用来为指定的 TrackEntry 设置动画帧事件的监听。
		@param entry entry
		@param listener listener 
		*/
		setTrackEventListener(entry: sp.spine.TrackEntry, listener: Function): void;		
		/**
		!#en Get the animation state object
		!#zh 获取动画状态 
		*/
		getState(): sp.spine.AnimationState;	
	}	
	/** !#en The event type of spine skeleton animation.
	!#zh 骨骼动画事件类型。 */
	export enum AnimationEventType {		
		START = 0,
		END = 0,
		COMPLETE = 0,
		EVENT = 0,	
	}	
	/** !#en The skeleton data of spine.
	!#zh Spine 的 骨骼数据。 */
	export class SkeletonData extends cc.Asset {		
		/** !#en See http://en.esotericsoftware.com/spine-json-format
		!#zh 可查看 Spine 官方文档 http://zh.esotericsoftware.com/spine-json-format */
		skeletonJson: any;		
		atlasText: string;		
		textures: cc.Texture2D[];		
		/** !#en
		A scale can be specified on the JSON or binary loader which will scale the bone positions,
		image sizes, and animation translations.
		This can be useful when using different sized images than were used when designing the skeleton
		in Spine. For example, if using images that are half the size than were used in Spine,
		a scale of 0.5 can be used. This is commonly used for games that can run with either low or high
		resolution texture atlases.
		see http://en.esotericsoftware.com/spine-using-runtimes#Scaling
		!#zh 可查看 Spine 官方文档： http://zh.esotericsoftware.com/spine-using-runtimes#Scaling */
		scale: number;		
		/**
		!#en Get the included SkeletonData used in spine runtime.<br>
		Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.SkeletonData object.
		!#zh 获取 Spine Runtime 使用的 SkeletonData。<br>
		返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.SkeletonData 对象。
		@param quiet quiet 
		*/
		getRuntimeData(quiet?: boolean): sp.spine.SkeletonData;	
	}	
	/** !#en
	The delegate of spine vertex effect
	!#zh
	Spine 顶点动画代理 */
	export class VertexEffectDelegate {		
		/**
		!#en Clears vertex effect.
		!#zh 清空顶点效果 
		*/
		clear(): void;		
		/**
		!#en Inits delegate with jitter effect
		!#zh 设置顶点抖动效果
		@param jitterX jitterX
		@param jitterY jitterY 
		*/
		initJitter(jitterX: number, jitterY: number): void;		
		/**
		!#en Inits delegate with swirl effect
		!#zh 设置顶点漩涡效果
		@param radius radius
		@param power power 
		*/
		initSwirlWithPow(radius: number, power: number): sp.spine.JitterEffect;		
		/**
		!#en Inits delegate with swirl effect
		!#zh 设置顶点漩涡效果
		@param radius radius
		@param power power 
		*/
		initSwirlWithPowOut(radius: number, power: number): sp.spine.SwirlEffect;		
		/**
		!#en Gets jitter vertex effect
		!#zh 获取顶点抖动效果 
		*/
		getJitterVertexEffect(): sp.spine.JitterEffect;		
		/**
		!#en Gets swirl vertex effect
		!#zh 获取顶点漩涡效果 
		*/
		getSwirlVertexEffect(): sp.spine.SwirlEffect;		
		/**
		!#en Gets vertex effect
		!#zh 获取顶点效果 
		*/
		getVertexEffect(): sp.spine.JitterEffect;		
		/**
		!#en Gets effect type
		!#zh 获取效果类型 
		*/
		getEffectType(): string;	
	}	
	/****************************************************
	* sp
	*****************************************************/
	
	export namespace sp {		
		/** !#en Attach node tool
		!#zh 挂点工具类 */
		export class AttachUtil {			
			/**
			!#en Gets attached root node.
			!#zh 获取挂接节点树的根节点 
			*/
			getAttachedRootNode(): cc.Node;			
			/**
			!#en Gets attached node which you want.
			!#zh 获得对应的挂点
			@param boneName boneName 
			*/
			getAttachedNodes(boneName: string): cc.Node[];			
			/**
			!#en Destroy attached node which you want.
			!#zh 销毁对应的挂点
			@param boneName boneName 
			*/
			destroyAttachedNodes(boneName: string): void;			
			/**
			!#en Traverse all bones to generate the minimum node tree containing the given bone names, NOTE that make sure the skeleton has initialized before calling this interface.
			!#zh 遍历所有插槽，生成包含所有给定插槽名称的最小节点树，注意，调用该接口前请确保骨骼动画已经初始化好。
			@param boneName boneName 
			*/
			generateAttachedNodes(boneName: string): cc.Node[];			
			/**
			!#en Destroy all attached node.
			!#zh 销毁所有挂点 
			*/
			destroyAllAttachedNodes(): void;			
			/**
			!#en Traverse all bones to generate a tree containing all bones nodes, NOTE that make sure the skeleton has initialized before calling this interface.
			!#zh 遍历所有插槽，生成包含所有插槽的节点树，注意，调用该接口前请确保骨骼动画已经初始化好。 
			*/
			generateAllAttachedNodes(): cc.Node;		
		}	
	}
		
	/****************************************************
	* Skeleton
	*****************************************************/
	
	export namespace Skeleton {		
		/** !#en Enum for animation cache mode type.
		!#zh Spine动画缓存类型 */
		export enum AnimationCacheMode {			
			REALTIME = 0,
			SHARED_CACHE = 0,
			PRIVATE_CACHE = 0,		
		}	
	}
	
}

/** !#en
`sp.spine` is the namespace for official Spine Runtime, which officially implemented and maintained by Spine.<br>
Please refer to the official documentation for its detailed usage: [http://en.esotericsoftware.com/spine-using-runtimes](http://en.esotericsoftware.com/spine-using-runtimes)
!#zh
sp.spine 模块是 Spine 官方运行库的 API 入口，由 Spine 官方统一实现和维护，具体用法请参考：[http://zh.esotericsoftware.com/spine-using-runtimes](http://zh.esotericsoftware.com/spine-using-runtimes) */
declare namespace sp.spine {
}

/** Some helpful utilities */
declare namespace cc.geomUtils {	
	/**
	!#en
	the distance between a point and a plane
	!#zh
	计算点和平面之间的距离。
	@param point point
	@param plane plane 
	*/
	export function point_plane(point: cc.Vec3, plane: cc.Plane): number;	
	/**
	!#en
	the closest point on plane to a given point
	!#zh
	计算平面上最接近给定点的点。
	@param out Closest point
	@param point Given point
	@param plane plane 
	*/
	export function pt_point_plane(out: cc.Vec3, point: cc.Vec3, plane: cc.Plane): cc.Vec3;	
	/**
	!#en
	the closest point on aabb to a given point
	!#zh
	计算 aabb 上最接近给定点的点。
	@param out Closest point.
	@param point Given point.
	@param aabb Align the axis around the box. 
	*/
	export function pt_point_aabb(out: cc.Vec3, point: cc.Vec3, aabb: cc.Aabb): cc.Vec3;	
	/**
	!#en
	the closest point on obb to a given point
	!#zh
	计算 obb 上最接近给定点的点。
	@param out Closest point
	@param point Given point
	@param obb Direction box 
	*/
	export function pt_point_obb(out: cc.Vec3, point: cc.Vec3, obb: cc.Obb): cc.Vec3;
}

/** !#en Some JavaScript decorators which can be accessed with "cc._decorator".
!#zh 一些 JavaScript 装饰器，目前可以通过 "cc._decorator" 来访问。
（这些 API 仍不完全稳定，有可能随着 JavaScript 装饰器的标准实现而调整） */
declare namespace cc._decorator {	
	/**
	!#en
	Declare the standard [ES6 Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
	as CCClass, please see [Class](../../../manual/en/scripting/class.html) for details.
	!#zh
	将标准写法的 [ES6 Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) 声明为 CCClass，具体用法请参阅[类型定义](../../../manual/zh/scripting/class.html)。
	@param name The class name used for serialization.
	
	@example 
	```js
	const {ccclass} = cc._decorator;
	
	// define a CCClass, omit the name
	&#64;ccclass
	class NewScript extends cc.Component {
	    // ...
	}
	
	// define a CCClass with a name
	&#64;ccclass('LoginData')
	class LoginData {
	    // ...
	}
	``` 
	*/
	export function ccclass(name?: string): Function;
	export function ccclass(_class?: Function): void;	
	/**
	!#en
	Declare property for [CCClass](../../../manual/en/scripting/reference/attributes.html).
	!#zh
	定义 [CCClass](../../../manual/zh/scripting/reference/attributes.html) 所用的属性。
	@param options an object with some property attributes
	
	@example 
	```js
	const {ccclass, property} = cc._decorator;
	
	&#64;ccclass
	class NewScript extends cc.Component {
	    &#64;property({
	        type: cc.Node
	    })
	    targetNode1 = null;
	
	    &#64;property(cc.Node)
	    targetNode2 = null;
	
	    &#64;property(cc.Button)
	    targetButton = null;
	
	    &#64;property
	    _width = 100;
	
	    &#64;property
	    get width () {
	        return this._width;
	    }
	
	    &#64;property
	    set width (value) {
	        this._width = value;
	    }
	
	    &#64;property
	    offset = new cc.Vec2(100, 100);
	
	    &#64;property(cc.Vec2)
	    offsets = [];
	
	    &#64;property(cc.SpriteFrame)
	    frame = null;
	}
	
	// above is equivalent to (上面的代码相当于):
	
	var NewScript = cc.Class({
	    properties: {
	        targetNode1: {
	            default: null,
	            type: cc.Node
	        },
	
	        targetNode2: {
	            default: null,
	            type: cc.Node
	        },
	
	        targetButton: {
	            default: null,
	            type: cc.Button
	        },
	
	        _width: 100,
	
	        width: {
	            get () {
	                return this._width;
	            },
	            set (value) {
	                this._width = value;
	            }
	        },
	
	        offset: new cc.Vec2(100, 100)
	
	        offsets: {
	            default: [],
	            type: cc.Vec2
	        }
	
	        frame: {
	            default: null,
	            type: cc.SpriteFrame
	        },
	    }
	});
	``` 
	*/
	export function property(options?: {type?: any; visible?: boolean|(() => boolean); displayName?: string; tooltip?: string; multiline?: boolean; readonly?: boolean; min?: number; max?: number; step?: number; range?: number[]; slide?: boolean; serializable?: boolean; formerlySerializedAs?: string; editorOnly?: boolean; override?: boolean; animatable?: boolean} | any[]|Function|cc.ValueType|number|string|boolean): Function;
	export function property(_target: Object, _key: any, _desc?: any): void;	
	/**
	!#en
	Makes a CCClass that inherit from component execute in edit mode.<br>
	By default, all components are only executed in play mode,
	which means they will not have their callback functions executed while the Editor is in edit mode.
	!#zh
	允许继承自 Component 的 CCClass 在编辑器里执行。<br>
	默认情况下，所有 Component 都只会在运行时才会执行，也就是说它们的生命周期回调不会在编辑器里触发。
	
	@example 
	```js
	const {ccclass, executeInEditMode} = cc._decorator;
	
	&#64;ccclass
	&#64;executeInEditMode
	class NewScript extends cc.Component {
	    // ...
	}
	``` 
	*/
	export function executeInEditMode(): Function;
	export function executeInEditMode(_class: Function): void;	
	/**
	!#en
	Automatically add required component as a dependency for the CCClass that inherit from component.
	!#zh
	为声明为 CCClass 的组件添加依赖的其它组件。当组件添加到节点上时，如果依赖的组件不存在，引擎将会自动将依赖组件添加到同一个节点，防止脚本出错。该设置在运行时同样有效。
	@param requiredComponent requiredComponent
	
	@example 
	```js
	const {ccclass, requireComponent} = cc._decorator;
	
	&#64;ccclass
	&#64;requireComponent(cc.Sprite)
	class SpriteCtrl extends cc.Component {
	    // ...
	}
	``` 
	*/
	export function requireComponent(requiredComponent: typeof cc.Component): Function;	
	/**
	!#en
	The menu path to register a component to the editors "Component" menu. Eg. "Rendering/CameraCtrl".
	!#zh
	将当前组件添加到组件菜单中，方便用户查找。例如 "Rendering/CameraCtrl"。
	@param path The path is the menu represented like a pathname.
	                       For example the menu could be "Rendering/CameraCtrl".
	
	@example 
	```js
	const {ccclass, menu} = cc._decorator;
	
	&#64;ccclass
	&#64;menu("Rendering/CameraCtrl")
	class NewScript extends cc.Component {
	    // ...
	}
	``` 
	*/
	export function menu(path: string): Function;	
	/**
	!#en
	The execution order of lifecycle methods for Component.
	Those less than 0 will execute before while those greater than 0 will execute after.
	The order will only affect onLoad, onEnable, start, update and lateUpdate while onDisable and onDestroy will not be affected.
	!#zh
	设置脚本生命周期方法调用的优先级。优先级小于 0 的组件将会优先执行，优先级大于 0 的组件将会延后执行。优先级仅会影响 onLoad, onEnable, start, update 和 lateUpdate，而 onDisable 和 onDestroy 不受影响。
	@param order The execution order of lifecycle methods for Component. Those less than 0 will execute before while those greater than 0 will execute after.
	
	@example 
	```js
	const {ccclass, executionOrder} = cc._decorator;
	
	&#64;ccclass
	&#64;executionOrder(1)
	class CameraCtrl extends cc.Component {
	    // ...
	}
	``` 
	*/
	export function executionOrder(order: number): Function;	
	/**
	!#en
	Prevents Component of the same type (or subtype) to be added more than once to a Node.
	!#zh
	防止多个相同类型（或子类型）的组件被添加到同一个节点。
	
	@example 
	```js
	const {ccclass, disallowMultiple} = cc._decorator;
	
	&#64;ccclass
	&#64;disallowMultiple
	class CameraCtrl extends cc.Component {
	    // ...
	}
	``` 
	*/
	export function disallowMultiple(): Function;
	export function disallowMultiple(_class: Function): void;	
	/**
	!#en
	If specified, the editor's scene view will keep updating this node in 60 fps when it is selected, otherwise, it will update only if necessary.<br>
	This property is only available if executeInEditMode is true.
	!#zh
	当指定了 "executeInEditMode" 以后，playOnFocus 可以在选中当前组件所在的节点时，提高编辑器的场景刷新频率到 60 FPS，否则场景就只会在必要的时候进行重绘。
	
	@example 
	```js
	const {ccclass, playOnFocus, executeInEditMode} = cc._decorator;
	
	&#64;ccclass
	&#64;executeInEditMode
	&#64;playOnFocus
	class CameraCtrl extends cc.Component {
	    // ...
	}
	``` 
	*/
	export function playOnFocus(): Function;
	export function playOnFocus(_class: Function): void;	
	/**
	!#en
	Specifying the url of the custom html to draw the component in **Properties**.
	!#zh
	自定义当前组件在 **属性检查器** 中渲染时所用的网页 url。
	@param url url
	
	@example 
	```js
	const {ccclass, inspector} = cc._decorator;
	
	&#64;ccclass
	&#64;inspector("packages://inspector/inspectors/comps/camera-ctrl.js")
	class NewScript extends cc.Component {
	    // ...
	}
	``` 
	*/
	export function inspector(path: string): Function;	
	/**
	!#en
	The custom documentation URL.
	!#zh
	指定当前组件的帮助文档的 url，设置过后，在 **属性检查器** 中就会出现一个帮助图标，用户点击将打开指定的网页。
	@param url url
	
	@example 
	```js
	const {ccclass, help} = cc._decorator;
	
	&#64;ccclass
	&#64;help("app://docs/html/components/spine.html")
	class NewScript extends cc.Component {
	    // ...
	}
	``` 
	*/
	export function help(path: string): Function;	
	/**
	NOTE:<br>
	The old mixins implemented in cc.Class(ES5) behaves exact the same as multiple inheritance.
	But since ES6, class constructor can't be function-called and class methods become non-enumerable,
	so we can not mix in ES6 Classes.<br>
	See:<br>
	[https://esdiscuss.org/topic/traits-are-now-impossible-in-es6-until-es7-since-rev32](https://esdiscuss.org/topic/traits-are-now-impossible-in-es6-until-es7-since-rev32)<br>
	One possible solution (but IDE unfriendly):<br>
	[http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/)<br>
	<br>
	NOTE:<br>
	You must manually call mixins constructor, this is different from cc.Class(ES5).
	@param ctor constructors to mix, only support ES5 constructors or classes defined by using `cc.Class`,
	                            not support ES6 Classes.
	
	@example 
	```js
	const {ccclass, mixins} = cc._decorator;
	
	class Animal { ... }
	
	const Fly = cc.Class({
	    constructor () { ... }
	});
	
	&#64;ccclass
	&#64;mixins(cc.EventTarget, Fly)
	class Bird extends Animal {
	    constructor () {
	        super();
	
	        // You must manually call mixins constructor, this is different from cc.Class(ES5)
	        cc.EventTarget.call(this);
	        Fly.call(this);
	    }
	    // ...
	}
	``` 
	*/
	export function mixins(ctor: Function, ...rest: Function[]): Function;
}

/** !#en This module provides some JavaScript utilities. All members can be accessed with `cc.js`.
!#zh 这个模块封装了 JavaScript 相关的一些实用函数，你可以通过 `cc.js` 来访问这个模块。 */
declare namespace cc.js {	
	/**
	Check the obj whether is number or not
	If a number is created by using 'new Number(10086)', the typeof it will be "object"...
	Then you can use this function if you care about this case.
	@param obj obj 
	*/
	export function isNumber(obj: any): boolean;	
	/**
	Check the obj whether is string or not.
	If a string is created by using 'new String("blabla")', the typeof it will be "object"...
	Then you can use this function if you care about this case.
	@param obj obj 
	*/
	export function isString(obj: any): boolean;	
	/**
	Copy all properties not defined in obj from arguments[1...n]
	@param obj object to extend its properties
	@param sourceObj source object to copy properties from 
	*/
	export function addon(obj: any, ...sourceObj: any[]): any;	
	/**
	copy all properties from arguments[1...n] to obj
	@param obj obj
	@param sourceObj sourceObj 
	*/
	export function mixin(obj: any, ...sourceObj: any[]): any;	
	/**
	Derive the class from the supplied base class.
	Both classes are just native javascript constructors, not created by cc.Class, so
	usually you will want to inherit using {{#crossLink "cc/Class:method"}}cc.Class {{/crossLink}} instead.
	@param cls cls
	@param base the baseclass to inherit 
	*/
	export function extend(cls: Function, base: Function): Function;	
	/**
	Get super class
	@param ctor the constructor of subclass 
	*/
	export function getSuper(ctor: Function): Function;	
	/**
	Checks whether subclass is child of superclass or equals to superclass
	@param subclass subclass
	@param superclass superclass 
	*/
	export function isChildClassOf(subclass: Function, superclass: Function): boolean;	
	/**
	Removes all enumerable properties from object
	@param obj obj 
	*/
	export function clear(obj: any): void;	
	/**
	Checks whether obj is an empty object
	@param obj obj 
	*/
	export function isEmptyObject(obj: any): boolean;	
	/**
	Get property descriptor in object and all its ancestors
	@param obj obj
	@param name name 
	*/
	export function getPropertyDescriptor(obj: any, name: string): any;	
	/**
	Define value, just help to call Object.defineProperty.<br>
	The configurable will be true.
	@param obj obj
	@param prop prop
	@param value value
	@param writable writable
	@param enumerable enumerable 
	*/
	export function value(obj: any, prop: string, value: any, writable?: boolean, enumerable?: boolean): void;	
	/**
	Define get set accessor, just help to call Object.defineProperty(...)
	@param obj obj
	@param prop prop
	@param getter getter
	@param setter setter
	@param enumerable enumerable
	@param configurable configurable 
	*/
	export function getset(obj: any, prop: string, getter: Function, setter?: Function, enumerable?: boolean, configurable?: boolean): void;	
	/**
	Define get accessor, just help to call Object.defineProperty(...)
	@param obj obj
	@param prop prop
	@param getter getter
	@param enumerable enumerable
	@param configurable configurable 
	*/
	export function get(obj: any, prop: string, getter: Function, enumerable?: boolean, configurable?: boolean): void;	
	/**
	Define set accessor, just help to call Object.defineProperty(...)
	@param obj obj
	@param prop prop
	@param setter setter
	@param enumerable enumerable
	@param configurable configurable 
	*/
	export function set(obj: any, prop: string, setter: Function, enumerable?: boolean, configurable?: boolean): void;	
	/**
	Get class name of the object, if object is just a {} (and which class named 'Object'), it will return "".
	(modified from <a href="http://stackoverflow.com/questions/1249531/how-to-get-a-javascript-objects-class">the code from this stackoverflow post</a>)
	@param objOrCtor instance or constructor 
	*/
	export function getClassName(objOrCtor: any|Function): string;	
	/** !#en All classes registered in the engine, indexed by ID.
	!#zh 引擎中已注册的所有类型，通过 ID 进行索引。 */
	export var _registeredClassIds: any;	
	/** !#en All classes registered in the engine, indexed by name.
	!#zh 引擎中已注册的所有类型，通过名称进行索引。 */
	export var _registeredClassNames: any;	
	/**
	Register the class by specified name manually
	@param className className
	@param constructor constructor 
	*/
	export function setClassName(className: string, constructor: Function): void;	
	/**
	Unregister a class from fireball.
	
	If you dont need a registered class anymore, you should unregister the class so that Fireball will not keep its reference anymore.
	Please note that its still your responsibility to free other references to the class.
	@param constructor the class you will want to unregister, any number of classes can be added 
	*/
	export function unregisterClass(...constructor: Function[]): void;	
	/**
	Get the registered class by name
	@param classname classname 
	*/
	export function getClassByName(classname: string): Function;	
	/**
	Defines a polyfill field for deprecated codes.
	@param obj YourObject or YourClass.prototype
	@param obsoleted "OldParam" or "YourClass.OldParam"
	@param newExpr "NewParam" or "YourClass.NewParam"
	@param writable writable 
	*/
	export function obsolete(obj: any, obsoleted: string, newExpr: string, writable?: boolean): void;	
	/**
	Defines all polyfill fields for obsoleted codes corresponding to the enumerable properties of props.
	@param obj YourObject or YourClass.prototype
	@param objName "YourObject" or "YourClass"
	@param props props
	@param writable writable 
	*/
	export function obsoletes(obj: any, objName: any, props: any, writable?: boolean): void;	
	/**
	A string tool to construct a string with format string.
	@param msg A JavaScript string containing zero or more substitution strings (%s).
	@param subst JavaScript objects with which to replace substitution strings within msg. This gives you additional control over the format of the output.
	
	@example 
	```js
	cc.js.formatStr("a: %s, b: %s", a, b);
	cc.js.formatStr(a, b, c);
	``` 
	*/
	export function formatStr(msg: string|any, ...subst: any[]): string;	
	/**
	!#en
	A simple wrapper of `Object.create(null)` which ensures the return object have no prototype (and thus no inherited members). So we can skip `hasOwnProperty` calls on property lookups. It is a worthwhile optimization than the `{}` literal when `hasOwnProperty` calls are necessary.
	!#zh
	该方法是对 `Object.create(null)` 的简单封装。`Object.create(null)` 用于创建无 prototype （也就无继承）的空对象。这样我们在该对象上查找属性时，就不用进行 `hasOwnProperty` 判断。在需要频繁判断 `hasOwnProperty` 时，使用这个方法性能会比 `{}` 更高。
	@param forceDictMode Apply the delete operator to newly created map object. This causes V8 to put the object in "dictionary mode" and disables creation of hidden classes which are very expensive for objects that are constantly changing shape. 
	*/
	export function createMap(forceDictMode?: boolean): any;	
	/** undefined */
	export class array {		
		/**
		Removes the array item at the specified index.
		@param array array
		@param index index 
		*/
		static removeAt(array: any[], index: number): void;		
		/**
		Removes the array item at the specified index.
		It's faster but the order of the array will be changed.
		@param array array
		@param index index 
		*/
		static fastRemoveAt(array: any[], index: number): void;		
		/**
		Removes the first occurrence of a specific object from the array.
		@param array array
		@param value value 
		*/
		static remove(array: any[], value: any): boolean;		
		/**
		Removes the first occurrence of a specific object from the array.
		It's faster but the order of the array will be changed.
		@param array array
		@param value value 
		*/
		static fastRemove(array: any[], value: number): void;		
		/**
		Verify array's Type
		@param array array
		@param type type 
		*/
		static verifyType(array: any[], type: Function): boolean;		
		/**
		Removes from array all values in minusArr. For each Value in minusArr, the first matching instance in array will be removed.
		@param array Source Array
		@param minusArr minus Array 
		*/
		static removeArray(array: any[], minusArr: any[]): void;		
		/**
		Inserts some objects at index
		@param array array
		@param addObjs addObjs
		@param index index 
		*/
		static appendObjectsAt(array: any[], addObjs: any[], index: number): any[];		
		/**
		Exact same function as Array.prototype.indexOf.<br>
		HACK: ugliy hack for Baidu mobile browser compatibility, stupid Baidu guys modify Array.prototype.indexOf for all pages loaded, their version changes strict comparison to non-strict comparison, it also ignores the second parameter of the original API, and this will cause event handler enter infinite loop.<br>
		Baidu developers, if you ever see this documentation, here is the standard: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf, Seriously!
		@param searchElement Element to locate in the array.
		@param fromIndex The index to start the search at 
		*/
		static indexOf(searchElement: any, fromIndex?: number): number;		
		/**
		Determines whether the array contains a specific value.
		@param array array
		@param value value 
		*/
		static contains(array: any[], value: any): boolean;		
		/**
		Copy an array's item to a new array (its performance is better than Array.slice)
		@param array array 
		*/
		static copy(array: any[]): any[];	
	}	
	/** !#en
	A fixed-length object pool designed for general type.<br>
	The implementation of this object pool is very simple,
	it can helps you to improve your game performance for objects which need frequent release and recreate operations<br/>
	!#zh
	长度固定的对象缓存池，可以用来缓存各种对象类型。<br/>
	这个对象池的实现非常精简，它可以帮助您提高游戏性能，适用于优化对象的反复创建和销毁。 */
	export class Pool {		
		/**
		!#en
		Constructor for creating an object pool for the specific object type.
		You can pass a callback argument for process the cleanup logic when the object is recycled.
		!#zh
		使用构造函数来创建一个指定对象类型的对象池，您可以传递一个回调函数，用于处理对象回收时的清理逻辑。
		@param cleanupFunc the callback method used to process the cleanup logic when the object is recycled.
		@param size initializes the length of the array 
		*/
		constructor(cleanupFunc: (obj: any) => void, size: number);
		constructor(size: number);		
		/**
		!#en
		Get and initialize an object from pool. This method defaults to null and requires the user to implement it.
		!#zh
		获取并初始化对象池中的对象。这个方法默认为空，需要用户自己实现。
		@param params parameters to used to initialize the object 
		*/
		get(...params: any[]): any;		
		/** !#en
		The current number of available objects, the default is 0, it will gradually increase with the recycle of the object,
		the maximum will not exceed the size specified when the constructor is called.
		!#zh
		当前可用对象数量，一开始默认是 0，随着对象的回收会逐渐增大，最大不会超过调用构造函数时指定的 size。 */
		count: number;		
		/**
		!#en
		Get an object from pool, if no available object in the pool, null will be returned.
		!#zh
		获取对象池中的对象，如果对象池没有可用对象，则返回空。 
		*/
		_get(): any;		
		/**
		!#en Put an object into the pool.
		!#zh 向对象池返还一个不再需要的对象。 
		*/
		put(): void;		
		/**
		!#en Resize the pool.
		!#zh 设置对象池容量。 
		*/
		resize(): void;	
	}
}

/** !#en A basic module for creating vertex data for 3D objects. You can access this module by `cc.primitive`.
!#zh 一个创建 3D 物体顶点数据的基础模块，你可以通过 `cc.primitive` 来访问这个模块。 */
declare namespace cc.primitive {	
	/**
	!#en Create box vertex data
	!#zh 创建长方体顶点数据
	@param width width
	@param height height
	@param length length
	@param opts opts 
	*/
	export function box(width: number, height: number, length: number, opts: {widthSegments: number; heightSegments: number; lengthSegments: number; }): cc.VertexData;	
	/**
	!#en Create cone vertex data
	!#zh 创建圆锥体顶点数据
	@param radius radius
	@param height height
	@param opts opts 
	*/
	export function cone(radius: number, height: number, opts: {radialSegments: number; heightSegments: number; capped: boolean; arc: number; }): cc.VertexData;	
	/**
	!#en Create cylinder vertex data
	!#zh 创建圆柱体顶点数据
	@param radiusTop radiusTop
	@param radiusBottom radiusBottom
	@param height height
	@param opts opts 
	*/
	export function cylinder(radiusTop: number, radiusBottom: number, height: number, opts: {radialSegments: number; heightSegments: number; capped: boolean; arc: number; }): cc.VertexData;	
	/**
	!#en Create plane vertex data
	!#zh 创建平台顶点数据
	@param width width
	@param length length
	@param opts opts 
	*/
	export function plane(width: number, length: number, opts: {widthSegments: number; lengthSegments: number; }): cc.VertexData;	
	/**
	!#en Create quad vertex data
	!#zh 创建面片顶点数据 
	*/
	export function quad(): cc.VertexData;	
	/**
	!#en Create sphere vertex data
	!#zh 创建球体顶点数据
	@param radius radius
	@param opts opts 
	*/
	export function sphere(radius: number, opts: {segments: number; }): cc.VertexData;	
	/**
	!#en Create torus vertex data
	!#zh 创建圆环顶点数据
	@param radius radius
	@param tube tube
	@param opts opts 
	*/
	export function torus(radius: number, tube: number, opts: {radialSegments: number; tubularSegments: number; arc: number; }): cc.VertexData;	
	/**
	!#en Create capsule vertex data
	!#zh 创建胶囊体顶点数据
	@param radiusTop radiusTop
	@param radiusBottom radiusBottom
	@param height height
	@param opts opts 
	*/
	export function capsule(radiusTop: number, radiusBottom: number, height: number, opts: {sides: number; heightSegments: number; capped: boolean; arc: number; }): cc.VertexData;	
	/**
	!#en Create polyhedron vertex data
	!#zh 创建多面体顶点数据
	@param type type
	@param Size Size
	@param opts opts 
	*/
	export function polyhedron(type: cc.primitive.PolyhedronType, Size: number, opts: {sizeX: number; sizeY: number; sizeZ: number; }): cc.VertexData;
}

declare let CC_JSB: boolean
declare let CC_NATIVERENDERER: boolean
declare let CC_EDITOR: boolean

declare let cc: {
    // polyfills: {
    //     destroyObject? (object: any): void;
    // };
    [x: string]: any;
}

// https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
type FlagExcludedType<Base, Type> = { [Key in keyof Base]: Base[Key] extends Type ? never : Key };
type AllowedNames<Base, Type> = FlagExcludedType<Base, Type>[keyof Base];
type KeyPartial<T, K extends keyof T> = { [P in K]?: T[P] };
type OmitType<Base, Type> = KeyPartial<Base, AllowedNames<Base, Type>>;
type ConstructorType<T> = OmitType<T, Function>;

declare interface IWritableArrayLike<T> {
    readonly length: number;
    [index: number]: T;
}

declare let module: {
    exports: object
}


declare interface Math { 
    sign(v: number); 
}

declare interface Object {
    assign(target: {}, source: {});
}


type FloatArray = Float64Array | Float32Array;

interface IColorLike {
    r: number;
    g: number;
    b: number;
    a: number;
    _val: number;

}

interface IMat3Like {
    m: FloatArray
}

interface IMat4Like {
    m: FloatArray
}

interface IQuatLike {
    x: number;
    y: number;
    z: number;
    w: number;
}

interface IRectLike {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface ISizeLike {
    width: number;
    height: number;
}

interface IVec2Like {
    x: number;
    y: number;
}

interface IVec3Like {
    x: number;
    y: number;
    z: number;
}

interface IVec4Like {
    x: number;
    y: number;
    z: number;
    w: number;
}
declare namespace dragonBones {
    /**
     * @internal
     * @private
     */
    const webAssemblyModule: {
        HEAP16: Int16Array;
        _malloc(byteSize: number): number;
        _free(pointer: number): void;
        setDataBinary(data: DragonBonesData, binaryPointer: number, intBytesLength: number, floatBytesLength: number, frameIntBytesLength: number, frameFloatBytesLength: number, frameBytesLength: number, timelineBytesLength: number): void;
    };
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * @internal
     * @private
     */
    const enum BinaryOffset {
        WeigthBoneCount = 0,
        WeigthFloatOffset = 1,
        WeigthBoneIndices = 2,
        MeshVertexCount = 0,
        MeshTriangleCount = 1,
        MeshFloatOffset = 2,
        MeshWeightOffset = 3,
        MeshVertexIndices = 4,
        TimelineScale = 0,
        TimelineOffset = 1,
        TimelineKeyFrameCount = 2,
        TimelineFrameValueCount = 3,
        TimelineFrameValueOffset = 4,
        TimelineFrameOffset = 5,
        FramePosition = 0,
        FrameTweenType = 1,
        FrameTweenEasingOrCurveSampleCount = 2,
        FrameCurveSamples = 3,
        DeformMeshOffset = 0,
        DeformCount = 1,
        DeformValueCount = 2,
        DeformValueOffset = 3,
        DeformFloatOffset = 4,
    }
    /**
     * @internal
     * @private
     */
    const enum ArmatureType {
        Armature = 0,
        MovieClip = 1,
        Stage = 2,
    }
    /**
     * @internal
     * @private
     */
    const enum BoneType {
        Bone = 0,
        Surface = 1,
    }
    /**
     * @private
     */
    const enum DisplayType {
        Image = 0,
        Armature = 1,
        Mesh = 2,
        BoundingBox = 3,
    }
    /**
     * - Bounding box type.
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 边界框类型。
     * @version DragonBones 5.0
     * @language zh_CN
     */
    const enum BoundingBoxType {
        Rectangle = 0,
        Ellipse = 1,
        Polygon = 2,
    }
    /**
     * @internal
     * @private
     */
    const enum ActionType {
        Play = 0,
        Frame = 10,
        Sound = 11,
    }
    /**
     * @internal
     * @private
     */
    const enum BlendMode {
        Normal = 0,
        Add = 1,
        Alpha = 2,
        Darken = 3,
        Difference = 4,
        Erase = 5,
        HardLight = 6,
        Invert = 7,
        Layer = 8,
        Lighten = 9,
        Multiply = 10,
        Overlay = 11,
        Screen = 12,
        Subtract = 13,
    }
    /**
     * @internal
     * @private
     */
    const enum TweenType {
        None = 0,
        Line = 1,
        Curve = 2,
        QuadIn = 3,
        QuadOut = 4,
        QuadInOut = 5,
    }
    /**
     * @internal
     * @private
     */
    const enum TimelineType {
        Action = 0,
        ZOrder = 1,
        BoneAll = 10,
        BoneTranslate = 11,
        BoneRotate = 12,
        BoneScale = 13,
        Surface = 50,
        SlotDisplay = 20,
        SlotColor = 21,
        SlotFFD = 22,
        IKConstraint = 30,
        AnimationTime = 40,
        AnimationWeight = 41,
    }
    /**
     * - Offset mode.
     * @version DragonBones 5.5
     * @language en_US
     */
    /**
     * - 偏移模式。
     * @version DragonBones 5.5
     * @language zh_CN
     */
    const enum OffsetMode {
        None = 0,
        Additive = 1,
        Override = 2,
    }
    /**
     * - Animation fade out mode.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 动画淡出模式。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    const enum AnimationFadeOutMode {
        /**
         * - Do not fade out of any animation states.
         * @language en_US
         */
        /**
         * - 不淡出任何的动画状态。
         * @language zh_CN
         */
        None = 0,
        /**
         * - Fade out the animation states of the same layer.
         * @language en_US
         */
        /**
         * - 淡出同层的动画状态。
         * @language zh_CN
         */
        SameLayer = 1,
        /**
         * - Fade out the animation states of the same group.
         * @language en_US
         */
        /**
         * - 淡出同组的动画状态。
         * @language zh_CN
         */
        SameGroup = 2,
        /**
         * - Fade out the animation states of the same layer and group.
         * @language en_US
         */
        /**
         * - 淡出同层并且同组的动画状态。
         * @language zh_CN
         */
        SameLayerAndGroup = 3,
        /**
         * - Fade out of all animation states.
         * @language en_US
         */
        /**
         * - 淡出所有的动画状态。
         * @language zh_CN
         */
        All = 4,
        /**
         * - Does not replace the animation state with the same name.
         * @language en_US
         */
        /**
         * - 不替换同名的动画状态。
         * @language zh_CN
         */
        Single = 5,
    }
    /**
     * @private
     */
    interface Map<T> {
        [key: string]: T;
    }
    /**
     * @private
     */
    class DragonBones {
        static readonly VERSION: string;
        static yDown: boolean;
        static debug: boolean;
        static debugDraw: boolean;
        static webAssembly: boolean;
        private readonly _clock;
        private readonly _events;
        private readonly _objects;
        private _eventManager;
        constructor(eventManager: IEventDispatcher);
        advanceTime(passedTime: number): void;
        bufferEvent(value: EventObject): void;
        bufferObject(object: BaseObject): void;
        readonly clock: WorldClock;
        readonly eventManager: IEventDispatcher;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - The BaseObject is the base class for all objects in the DragonBones framework.
     * All BaseObject instances are cached to the object pool to reduce the performance consumption of frequent requests for memory or memory recovery.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 基础对象，通常 DragonBones 的对象都继承自该类。
     * 所有基础对象的实例都会缓存到对象池，以减少频繁申请内存或内存回收的性能消耗。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    abstract class BaseObject {
        private static _hashCode;
        private static _defaultMaxCount;
        private static readonly _maxCountMap;
        private static readonly _poolsMap;
        private static _returnObject(object);
        static toString(): string;
        /**
         * - Set the maximum cache count of the specify object pool.
         * @param objectConstructor - The specify class. (Set all object pools max cache count if not set)
         * @param maxCount - Max count.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 设置特定对象池的最大缓存数量。
         * @param objectConstructor - 特定的类。 (不设置则设置所有对象池的最大缓存数量)
         * @param maxCount - 最大缓存数量。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static setMaxCount(objectConstructor: (typeof BaseObject) | null, maxCount: number): void;
        /**
         * - Clear the cached instances of a specify object pool.
         * @param objectConstructor - Specify class. (Clear all cached instances if not set)
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 清除特定对象池的缓存实例。
         * @param objectConstructor - 特定的类。 (不设置则清除所有缓存的实例)
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static clearPool(objectConstructor?: (typeof BaseObject) | null): void;
        /**
         * - Get an instance of the specify class from object pool.
         * @param objectConstructor - The specify class.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 从对象池中获取特定类的实例。
         * @param objectConstructor - 特定的类。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static borrowObject<T extends BaseObject>(objectConstructor: {
            new (): T;
        }): T;
        /**
         * - A unique identification number assigned to the object.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 分配给此实例的唯一标识号。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        readonly hashCode: number;
        private _isInPool;
        /**
         * @private
         */
        protected abstract _onClear(): void;
        /**
         * - Clear the object and return it back to object pool。
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 清除该实例的所有数据并将其返还对象池。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        returnToPool(): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - 2D Transform matrix.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 2D 转换矩阵。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class Matrix {
        /**
         * - The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
         * @default 1.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 缩放或旋转图像时影响像素沿 x 轴定位的值。
         * @default 1.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        a: number;
        /**
         * - The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
         * @default 0.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 旋转或倾斜图像时影响像素沿 y 轴定位的值。
         * @default 0.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        b: number;
        /**
         * - The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
         * @default 0.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 旋转或倾斜图像时影响像素沿 x 轴定位的值。
         * @default 0.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        c: number;
        /**
         * - The value that affects the positioning of pixels along the y axis when scaling or rotating an image.
         * @default 1.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 缩放或旋转图像时影响像素沿 y 轴定位的值。
         * @default 1.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        d: number;
        /**
         * - The distance by which to translate each point along the x axis.
         * @default 0.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 沿 x 轴平移每个点的距离。
         * @default 0.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        tx: number;
        /**
         * - The distance by which to translate each point along the y axis.
         * @default 0.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 沿 y 轴平移每个点的距离。
         * @default 0.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        ty: number;
        /**
         * @private
         */
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        toString(): string;
        /**
         * @private
         */
        copyFrom(value: Matrix): Matrix;
        /**
         * @private
         */
        copyFromArray(value: Array<number>, offset?: number): Matrix;
        /**
         * - Convert to unit matrix.
         * The resulting matrix has the following properties: a=1, b=0, c=0, d=1, tx=0, ty=0.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 转换为单位矩阵。
         * 该矩阵具有以下属性：a=1、b=0、c=0、d=1、tx=0、ty=0。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        identity(): Matrix;
        /**
         * - Multiplies the current matrix with another matrix.
         * @param value - The matrix that needs to be multiplied.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 将当前矩阵与另一个矩阵相乘。
         * @param value - 需要相乘的矩阵。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        concat(value: Matrix): Matrix;
        /**
         * - Convert to inverse matrix.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 转换为逆矩阵。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        invert(): Matrix;
        /**
         * - Apply a matrix transformation to a specific point.
         * @param x - X coordinate.
         * @param y - Y coordinate.
         * @param result - The point after the transformation is applied.
         * @param delta - Whether to ignore tx, ty's conversion to point.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 将矩阵转换应用于特定点。
         * @param x - 横坐标。
         * @param y - 纵坐标。
         * @param result - 应用转换之后的点。
         * @param delta - 是否忽略 tx，ty 对点的转换。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        transformPoint(x: number, y: number, result: {
            x: number;
            y: number;
        }, delta?: boolean): void;
        /**
         * @private
         */
        transformRectangle(rectangle: {
            x: number;
            y: number;
            width: number;
            height: number;
        }, delta?: boolean): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - 2D Transform.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 2D 变换。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class Transform {
        /**
         * @private
         */
        static readonly PI: number;
        /**
         * @private
         */
        static readonly PI_D: number;
        /**
         * @private
         */
        static readonly PI_H: number;
        /**
         * @private
         */
        static readonly PI_Q: number;
        /**
         * @private
         */
        static readonly RAD_DEG: number;
        /**
         * @private
         */
        static readonly DEG_RAD: number;
        /**
         * @private
         */
        static normalizeRadian(value: number): number;
        /**
         * - Horizontal translate.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 水平位移。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        x: number;
        /**
         * - Vertical translate.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 垂直位移。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        y: number;
        /**
         * - Skew. (In radians)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 倾斜。 （以弧度为单位）
         * @version DragonBones 3.0
         * @language zh_CN
         */
        skew: number;
        /**
         * - rotation. (In radians)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 旋转。 （以弧度为单位）
         * @version DragonBones 3.0
         * @language zh_CN
         */
        rotation: number;
        /**
         * - Horizontal Scaling.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 水平缩放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        scaleX: number;
        /**
         * - Vertical scaling.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 垂直缩放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        scaleY: number;
        /**
         * @private
         */
        constructor(x?: number, y?: number, skew?: number, rotation?: number, scaleX?: number, scaleY?: number);
        toString(): string;
        /**
         * @private
         */
        copyFrom(value: Transform): Transform;
        /**
         * @private
         */
        identity(): Transform;
        /**
         * @private
         */
        add(value: Transform): Transform;
        /**
         * @private
         */
        minus(value: Transform): Transform;
        /**
         * @private
         */
        fromMatrix(matrix: Matrix): Transform;
        /**
         * @private
         */
        toMatrix(matrix: Matrix): Transform;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * @internal
     * @private
     */
    class ColorTransform {
        alphaMultiplier: number;
        redMultiplier: number;
        greenMultiplier: number;
        blueMultiplier: number;
        alphaOffset: number;
        redOffset: number;
        greenOffset: number;
        blueOffset: number;
        constructor(alphaMultiplier?: number, redMultiplier?: number, greenMultiplier?: number, blueMultiplier?: number, alphaOffset?: number, redOffset?: number, greenOffset?: number, blueOffset?: number);
        copyFrom(value: ColorTransform): void;
        identity(): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - The Point object represents a location in a two-dimensional coordinate system.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - Point 对象表示二维坐标系统中的某个位置。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class Point {
        /**
         * - The horizontal coordinate.
         * @default 0.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 该点的水平坐标。
         * @default 0.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        x: number;
        /**
         * - The vertical coordinate.
         * @default 0.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 该点的垂直坐标。
         * @default 0.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        y: number;
        /**
         * - Creates a new point. If you pass no parameters to this method, a point is created at (0,0).
         * @param x - The horizontal coordinate.
         * @param y - The vertical coordinate.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 创建一个 egret.Point 对象.若不传入任何参数，将会创建一个位于（0，0）位置的点。
         * @param x - 该对象的x属性值，默认为 0.0。
         * @param y - 该对象的y属性值，默认为 0.0。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        constructor(x?: number, y?: number);
        /**
         * @private
         */
        copyFrom(value: Point): void;
        /**
         * @private
         */
        clear(): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - A Rectangle object is an area defined by its position, as indicated by its top-left corner point (x, y) and by its
     * width and its height.<br/>
     * The x, y, width, and height properties of the Rectangle class are independent of each other; changing the value of
     * one property has no effect on the others. However, the right and bottom properties are integrally related to those
     * four properties. For example, if you change the value of the right property, the value of the width property changes;
     * if you change the bottom property, the value of the height property changes.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - Rectangle 对象是按其位置（由它左上角的点 (x, y) 确定）以及宽度和高度定义的区域。<br/>
     * Rectangle 类的 x、y、width 和 height 属性相互独立；更改一个属性的值不会影响其他属性。
     * 但是，right 和 bottom 属性与这四个属性是整体相关的。例如，如果更改 right 属性的值，则 width
     * 属性的值将发生变化；如果更改 bottom 属性，则 height 属性的值将发生变化。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class Rectangle {
        /**
         * - The x coordinate of the top-left corner of the rectangle.
         * @default 0.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 矩形左上角的 x 坐标。
         * @default 0.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        x: number;
        /**
         * - The y coordinate of the top-left corner of the rectangle.
         * @default 0.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 矩形左上角的 y 坐标。
         * @default 0.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        y: number;
        /**
         * - The width of the rectangle, in pixels.
         * @default 0.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 矩形的宽度（以像素为单位）。
         * @default 0.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        width: number;
        /**
         * - 矩形的高度（以像素为单位）。
         * @default 0.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - The height of the rectangle, in pixels.
         * @default 0.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        height: number;
        /**
         * @private
         */
        constructor(x?: number, y?: number, width?: number, height?: number);
        /**
         * @private
         */
        copyFrom(value: Rectangle): void;
        /**
         * @private
         */
        clear(): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - The user custom data.
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 用户自定义数据。
     * @version DragonBones 5.0
     * @language zh_CN
     */
    class UserData extends BaseObject {
        static toString(): string;
        /**
         * - The custom int numbers.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 自定义整数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        readonly ints: Array<number>;
        /**
         * - The custom float numbers.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 自定义浮点数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        readonly floats: Array<number>;
        /**
         * - The custom strings.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 自定义字符串。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        readonly strings: Array<string>;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        /**
         * @internal
         * @private
         */
        addInt(value: number): void;
        /**
         * @internal
         * @private
         */
        addFloat(value: number): void;
        /**
         * @internal
         * @private
         */
        addString(value: string): void;
        /**
         * - Get the custom int number.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 获取自定义整数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        getInt(index?: number): number;
        /**
         * - Get the custom float number.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 获取自定义浮点数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        getFloat(index?: number): number;
        /**
         * - Get the custom string.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 获取自定义字符串。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        getString(index?: number): string;
    }
    /**
     * @internal
     * @private
     */
    class ActionData extends BaseObject {
        static toString(): string;
        type: ActionType;
        name: string;
        bone: BoneData | null;
        slot: SlotData | null;
        data: UserData | null;
        protected _onClear(): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - The DragonBones data.
     * A DragonBones data contains multiple armature data.
     * @see dragonBones.ArmatureData
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 龙骨数据。
     * 一个龙骨数据包含多个骨架数据。
     * @see dragonBones.ArmatureData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class DragonBonesData extends BaseObject {
        static toString(): string;
        /**
         * @private
         */
        autoSearch: boolean;
        /**
         * - The animation frame rate.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 动画帧频。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        frameRate: number;
        /**
         * - The data version.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 数据版本。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        version: string;
        /**
         * - The DragonBones data name.
         * The name is consistent with the DragonBones project name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 龙骨数据名称。
         * 该名称与龙骨项目名保持一致。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        name: string;
        /**
         * @private
         */
        stage: ArmatureData | null;
        /**
         * @internal
         * @private
         */
        readonly frameIndices: Array<number>;
        /**
         * @internal
         * @private
         */
        readonly cachedFrames: Array<number>;
        /**
         * - All armature data names.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 所有的骨架数据名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly armatureNames: Array<string>;
        /**
         * @private
         */
        readonly armatures: Map<ArmatureData>;
        /**
         * @internal
         * @private
         */
        binary: ArrayBuffer;
        /**
         * @internal
         * @private
         */
        intArray: Int16Array;
        /**
         * @internal
         * @private
         */
        floatArray: Float32Array;
        /**
         * @internal
         * @private
         */
        frameIntArray: Int16Array;
        /**
         * @internal
         * @private
         */
        frameFloatArray: Float32Array;
        /**
         * @internal
         * @private
         */
        frameArray: Int16Array;
        /**
         * @internal
         * @private
         */
        timelineArray: Uint16Array;
        /**
         * @private
         */
        userData: UserData | null;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        /**
         * @internal
         * @private
         */
        addArmature(value: ArmatureData): void;
        /**
         * - Get a specific armature data.
         * @param name - The armature data name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定的骨架数据。
         * @param name - 骨架数据名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getArmature(name: string): ArmatureData | null;
        /**
         * - Deprecated, please refer to {@link #dragonBones.BaseFactory#removeDragonBonesData()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #dragonBones.BaseFactory#removeDragonBonesData()}。
         * @deprecated
         * @language zh_CN
         */
        dispose(): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - The armature data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 骨架数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class ArmatureData extends BaseObject {
        static toString(): string;
        /**
         * @private
         */
        type: ArmatureType;
        /**
         * - The animation frame rate.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 动画帧率。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        frameRate: number;
        /**
         * @private
         */
        cacheFrameRate: number;
        /**
         * @private
         */
        scale: number;
        /**
         * - The armature name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 骨架名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        name: string;
        /**
         * @private
         */
        readonly aabb: Rectangle;
        /**
         * - The names of all the animation data.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 所有的动画数据名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly animationNames: Array<string>;
        /**
         * @private
         */
        readonly sortedBones: Array<BoneData>;
        /**
         * @private
         */
        readonly sortedSlots: Array<SlotData>;
        /**
         * @private
         */
        readonly defaultActions: Array<ActionData>;
        /**
         * @private
         */
        readonly actions: Array<ActionData>;
        /**
         * @private
         */
        readonly bones: Map<BoneData>;
        /**
         * @private
         */
        readonly slots: Map<SlotData>;
        /**
         * @private
         */
        readonly constraints: Map<ConstraintData>;
        /**
         * @private
         */
        readonly skins: Map<SkinData>;
        /**
         * @private
         */
        readonly animations: Map<AnimationData>;
        /**
         * - The default skin data.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 默认插槽数据。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        defaultSkin: SkinData | null;
        /**
         * - The default animation data.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 默认动画数据。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        defaultAnimation: AnimationData | null;
        /**
         * @private
         */
        canvas: CanvasData | null;
        /**
         * @private
         */
        userData: UserData | null;
        /**
         * @private
         */
        parent: DragonBonesData;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        /**
         * @internal
         * @private
         */
        sortBones(): void;
        /**
         * @internal
         * @private
         */
        cacheFrames(frameRate: number): void;
        /**
         * @internal
         * @private
         */
        setCacheFrame(globalTransformMatrix: Matrix, transform: Transform): number;
        /**
         * @internal
         * @private
         */
        getCacheFrame(globalTransformMatrix: Matrix, transform: Transform, arrayOffset: number): void;
        /**
         * @internal
         * @private
         */
        addBone(value: BoneData): void;
        /**
         * @internal
         * @private
         */
        addSlot(value: SlotData): void;
        /**
         * @internal
         * @private
         */
        addConstraint(value: ConstraintData): void;
        /**
         * @internal
         * @private
         */
        addSkin(value: SkinData): void;
        /**
         * @internal
         * @private
         */
        addAnimation(value: AnimationData): void;
        /**
         * @internal
         * @private
         */
        addAction(value: ActionData, isDefault: boolean): void;
        /**
         * - Get a specific done data.
         * @param name - The bone name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定的骨骼数据。
         * @param name - 骨骼名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getBone(name: string): BoneData | null;
        /**
         * - Get a specific slot data.
         * @param name - The slot name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定的插槽数据。
         * @param name - 插槽名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getSlot(name: string): SlotData | null;
        /**
         * @private
         */
        getConstraint(name: string): ConstraintData | null;
        /**
         * - Get a specific skin data.
         * @param name - The skin name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定皮肤数据。
         * @param name - 皮肤名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getSkin(name: string): SkinData | null;
        /**
         * @internal
         * @private
         */
        getMesh(skinName: string, slotName: string, meshName: string): MeshDisplayData | null;
        /**
         * - Get a specific animation data.
         * @param name - The animation name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定的动画数据。
         * @param name - 动画名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getAnimation(name: string): AnimationData | null;
    }
    /**
     * - The bone data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 骨骼数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class BoneData extends BaseObject {
        static toString(): string;
        /**
         * @private
         */
        inheritTranslation: boolean;
        /**
         * @private
         */
        inheritRotation: boolean;
        /**
         * @private
         */
        inheritScale: boolean;
        /**
         * @private
         */
        inheritReflection: boolean;
        /**
         * @private
         */
        type: BoneType;
        /**
         * - The bone length.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 骨骼长度。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        length: number;
        /**
         * - The bone name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 骨骼名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        name: string;
        /**
         * @private
         */
        readonly transform: Transform;
        /**
         * @private
         */
        userData: UserData | null;
        /**
         * - The parent bone data.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 父骨骼数据。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        parent: BoneData | null;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
    /**
     * @internal
     * @private
     */
    class SurfaceData extends BoneData {
        static toString(): string;
        segmentX: number;
        segmentY: number;
        readonly vertices: Array<number>;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
    /**
     * - The slot data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 插槽数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class SlotData extends BaseObject {
        /**
         * @internal
         * @private
         */
        static readonly DEFAULT_COLOR: ColorTransform;
        /**
         * @internal
         * @private
         */
        static createColor(): ColorTransform;
        static toString(): string;
        /**
         * @private
         */
        blendMode: BlendMode;
        /**
         * @private
         */
        displayIndex: number;
        /**
         * @private
         */
        zOrder: number;
        /**
         * - The slot name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 插槽名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        name: string;
        /**
         * @private
         */
        color: ColorTransform;
        /**
         * @private
         */
        userData: UserData | null;
        /**
         * - The parent bone data.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 父骨骼数据。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        parent: BoneData;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * @internal
     * @private
     */
    abstract class ConstraintData extends BaseObject {
        order: number;
        name: string;
        target: BoneData;
        root: BoneData;
        bone: BoneData | null;
        protected _onClear(): void;
    }
    /**
     * @internal
     * @private
     */
    class IKConstraintData extends ConstraintData {
        static toString(): string;
        scaleEnabled: boolean;
        bendPositive: boolean;
        weight: number;
        protected _onClear(): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * @internal
     * @private
     */
    class CanvasData extends BaseObject {
        static toString(): string;
        hasBackground: boolean;
        color: number;
        x: number;
        y: number;
        width: number;
        height: number;
        protected _onClear(): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - The skin data, typically a armature data instance contains at least one skinData.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 皮肤数据，通常一个骨架数据至少包含一个皮肤数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class SkinData extends BaseObject {
        static toString(): string;
        /**
         * - The skin name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 皮肤名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        name: string;
        /**
         * @private
         */
        readonly displays: Map<Array<DisplayData | null>>;
        /**
         * @private
         */
        parent: ArmatureData;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        /**
         * @internal
         * @private
         */
        addDisplay(slotName: string, value: DisplayData | null): void;
        /**
         * @private
         */
        getDisplay(slotName: string, displayName: string): DisplayData | null;
        /**
         * @private
         */
        getDisplays(slotName: string): Array<DisplayData | null> | null;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * @internal
     * @private
     */
    abstract class DisplayData extends BaseObject {
        type: DisplayType;
        name: string;
        path: string;
        parent: SkinData;
        readonly transform: Transform;
        protected _onClear(): void;
    }
    /**
     * @internal
     * @private
     */
    class ImageDisplayData extends DisplayData {
        static toString(): string;
        readonly pivot: Point;
        texture: TextureData | null;
        protected _onClear(): void;
    }
    /**
     * @internal
     * @private
     */
    class ArmatureDisplayData extends DisplayData {
        static toString(): string;
        inheritAnimation: boolean;
        readonly actions: Array<ActionData>;
        armature: ArmatureData | null;
        protected _onClear(): void;
        /**
         * @private
         */
        addAction(value: ActionData): void;
    }
    /**
     * @internal
     * @private
     */
    class MeshDisplayData extends DisplayData {
        static toString(): string;
        inheritDeform: boolean;
        offset: number;
        weight: WeightData | null;
        glue: GlueData | null;
        texture: TextureData | null;
        protected _onClear(): void;
    }
    /**
     * @internal
     * @private
     */
    class BoundingBoxDisplayData extends DisplayData {
        static toString(): string;
        boundingBox: BoundingBoxData | null;
        protected _onClear(): void;
    }
    /**
     * @internal
     * @private
     */
    class WeightData extends BaseObject {
        static toString(): string;
        count: number;
        offset: number;
        readonly bones: Array<BoneData>;
        protected _onClear(): void;
        addBone(value: BoneData): void;
    }
    /**
     * @internal
     * @private
     */
    class GlueData extends BaseObject {
        static toString(): string;
        readonly weights: Array<number>;
        readonly meshes: Array<MeshDisplayData | null>;
        protected _onClear(): void;
        addMesh(value: MeshDisplayData | null): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - The base class of bounding box data.
     * @see dragonBones.RectangleData
     * @see dragonBones.EllipseData
     * @see dragonBones.PolygonData
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 边界框数据基类。
     * @see dragonBones.RectangleData
     * @see dragonBones.EllipseData
     * @see dragonBones.PolygonData
     * @version DragonBones 5.0
     * @language zh_CN
     */
    abstract class BoundingBoxData extends BaseObject {
        /**
         * - The bounding box type.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 边界框类型。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        type: BoundingBoxType;
        /**
         * @private
         */
        color: number;
        /**
         * @private
         */
        width: number;
        /**
         * @private
         */
        height: number;
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * - Check whether the bounding box contains a specific point. (Local coordinate system)
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 检查边界框是否包含特定点。（本地坐标系）
         * @version DragonBones 5.0
         * @language zh_CN
         */
        abstract containsPoint(pX: number, pY: number): boolean;
        /**
         * - Check whether the bounding box intersects a specific segment. (Local coordinate system)
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 检查边界框是否与特定线段相交。（本地坐标系）
         * @version DragonBones 5.0
         * @language zh_CN
         */
        abstract intersectsSegment(xA: number, yA: number, xB: number, yB: number, intersectionPointA: {
            x: number;
            y: number;
        } | null, intersectionPointB: {
            x: number;
            y: number;
        } | null, normalRadians: {
            x: number;
            y: number;
        } | null): number;
    }
    /**
     * - The rectangle bounding box data.
     * @version DragonBones 5.1
     * @language en_US
     */
    /**
     * - 矩形边界框数据。
     * @version DragonBones 5.1
     * @language zh_CN
     */
    class RectangleBoundingBoxData extends BoundingBoxData {
        static toString(): string;
        /**
         * - Compute the bit code for a point (x, y) using the clip rectangle
         */
        private static _computeOutCode(x, y, xMin, yMin, xMax, yMax);
        /**
         * @private
         */
        static rectangleIntersectsSegment(xA: number, yA: number, xB: number, yB: number, xMin: number, yMin: number, xMax: number, yMax: number, intersectionPointA?: {
            x: number;
            y: number;
        } | null, intersectionPointB?: {
            x: number;
            y: number;
        } | null, normalRadians?: {
            x: number;
            y: number;
        } | null): number;
        /**
         * @inheritDoc
         * @private
         */
        protected _onClear(): void;
        /**
         * @inheritDoc
         */
        containsPoint(pX: number, pY: number): boolean;
        /**
         * @inheritDoc
         */
        intersectsSegment(xA: number, yA: number, xB: number, yB: number, intersectionPointA?: {
            x: number;
            y: number;
        } | null, intersectionPointB?: {
            x: number;
            y: number;
        } | null, normalRadians?: {
            x: number;
            y: number;
        } | null): number;
    }
    /**
     * - The ellipse bounding box data.
     * @version DragonBones 5.1
     * @language en_US
     */
    /**
     * - 椭圆边界框数据。
     * @version DragonBones 5.1
     * @language zh_CN
     */
    class EllipseBoundingBoxData extends BoundingBoxData {
        static toString(): string;
        /**
         * @private
         */
        static ellipseIntersectsSegment(xA: number, yA: number, xB: number, yB: number, xC: number, yC: number, widthH: number, heightH: number, intersectionPointA?: {
            x: number;
            y: number;
        } | null, intersectionPointB?: {
            x: number;
            y: number;
        } | null, normalRadians?: {
            x: number;
            y: number;
        } | null): number;
        /**
         * @inheritDoc
         * @private
         */
        protected _onClear(): void;
        /**
         * @inheritDoc
         */
        containsPoint(pX: number, pY: number): boolean;
        /**
         * @inheritDoc
         */
        intersectsSegment(xA: number, yA: number, xB: number, yB: number, intersectionPointA?: {
            x: number;
            y: number;
        } | null, intersectionPointB?: {
            x: number;
            y: number;
        } | null, normalRadians?: {
            x: number;
            y: number;
        } | null): number;
    }
    /**
     * - The polygon bounding box data.
     * @version DragonBones 5.1
     * @language en_US
     */
    /**
     * - 多边形边界框数据。
     * @version DragonBones 5.1
     * @language zh_CN
     */
    class PolygonBoundingBoxData extends BoundingBoxData {
        static toString(): string;
        /**
         * @private
         */
        static polygonIntersectsSegment(xA: number, yA: number, xB: number, yB: number, vertices: Array<number>, intersectionPointA?: {
            x: number;
            y: number;
        } | null, intersectionPointB?: {
            x: number;
            y: number;
        } | null, normalRadians?: {
            x: number;
            y: number;
        } | null): number;
        /**
         * @private
         */
        x: number;
        /**
         * @private
         */
        y: number;
        /**
         * - The polygon vertices.
         * @version DragonBones 5.1
         * @language en_US
         */
        /**
         * - 多边形顶点。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        readonly vertices: Array<number>;
        /**
         * @private
         */
        weight: WeightData | null;
        /**
         * @inheritDoc
         * @private
         */
        protected _onClear(): void;
        /**
         * @inheritDoc
         */
        containsPoint(pX: number, pY: number): boolean;
        /**
         * @inheritDoc
         */
        intersectsSegment(xA: number, yA: number, xB: number, yB: number, intersectionPointA?: {
            x: number;
            y: number;
        } | null, intersectionPointB?: {
            x: number;
            y: number;
        } | null, normalRadians?: {
            x: number;
            y: number;
        } | null): number;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - The animation data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 动画数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class AnimationData extends BaseObject {
        static toString(): string;
        /**
         * - FrameIntArray.
         * @internal
         * @private
         */
        frameIntOffset: number;
        /**
         * - FrameFloatArray.
         * @internal
         * @private
         */
        frameFloatOffset: number;
        /**
         * - FrameArray.
         * @internal
         * @private
         */
        frameOffset: number;
        /**
         * - The frame count of the animation.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 动画的帧数。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        frameCount: number;
        /**
         * - The play times of the animation. [0: Loop play, [1~N]: Play N times]
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 动画的播放次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 3.0
         * @language zh_CN
         */
        playTimes: number;
        /**
         * - The duration of the animation. (In seconds)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 动画的持续时间。 （以秒为单位）
         * @version DragonBones 3.0
         * @language zh_CN
         */
        duration: number;
        /**
         * @private
         */
        scale: number;
        /**
         * - The fade in time of the animation. (In seconds)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 动画的淡入时间。 （以秒为单位）
         * @version DragonBones 3.0
         * @language zh_CN
         */
        fadeInTime: number;
        /**
         * @private
         */
        cacheFrameRate: number;
        /**
         * - The animation name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 动画名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        name: string;
        /**
         * @private
         */
        readonly cachedFrames: Array<boolean>;
        /**
         * @private
         */
        readonly boneTimelines: Map<Array<TimelineData>>;
        /**
         * @private
         */
        readonly surfaceTimelines: Map<Array<TimelineData>>;
        /**
         * @private
         */
        readonly slotTimelines: Map<Array<TimelineData>>;
        /**
         * @private
         */
        readonly constraintTimelines: Map<Array<TimelineData>>;
        /**
         * @private
         */
        readonly animationTimelines: Map<Array<TimelineData>>;
        /**
         * @private
         */
        readonly boneCachedFrameIndices: Map<Array<number>>;
        /**
         * @private
         */
        readonly slotCachedFrameIndices: Map<Array<number>>;
        /**
         * @private
         */
        actionTimeline: TimelineData | null;
        /**
         * @private
         */
        zOrderTimeline: TimelineData | null;
        /**
         * @private
         */
        parent: ArmatureData;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        /**
         * @internal
         * @private
         */
        cacheFrames(frameRate: number): void;
        /**
         * @private
         */
        addBoneTimeline(bone: BoneData, timeline: TimelineData): void;
        /**
         * @private
         */
        addSurfaceTimeline(surface: SurfaceData, timeline: TimelineData): void;
        /**
         * @private
         */
        addSlotTimeline(slot: SlotData, timeline: TimelineData): void;
        /**
         * @private
         */
        addConstraintTimeline(constraint: ConstraintData, timeline: TimelineData): void;
        /**
         * @private
         */
        addAnimationTimeline(name: string, timeline: TimelineData): void;
        /**
         * @private
         */
        getBoneTimelines(name: string): Array<TimelineData> | null;
        /**
         * @private
         */
        getSurfaceTimelines(name: string): Array<TimelineData> | null;
        /**
         * @private
         */
        getSlotTimelines(name: string): Array<TimelineData> | null;
        /**
         * @private
         */
        getConstraintTimelines(name: string): Array<TimelineData> | null;
        /**
         * @private
         */
        getAnimationTimelines(name: string): Array<TimelineData> | null;
        /**
         * @private
         */
        getBoneCachedFrameIndices(name: string): Array<number> | null;
        /**
         * @private
         */
        getSlotCachedFrameIndices(name: string): Array<number> | null;
    }
    /**
     * @internal
     * @private
     */
    class TimelineData extends BaseObject {
        static toString(): string;
        type: TimelineType;
        offset: number;
        frameIndicesOffset: number;
        protected _onClear(): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - The animation config is used to describe all the information needed to play an animation state.
     * The API is still in the experimental phase and may encounter bugs or stability or compatibility issues when used.
     * @see dragonBones.AnimationState
     * @beta
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 动画配置用来描述播放一个动画状态所需要的全部信息。
     * 该 API 仍在实验阶段，使用时可能遭遇 bug 或稳定性或兼容性问题。
     * @see dragonBones.AnimationState
     * @beta
     * @version DragonBones 5.0
     * @language zh_CN
     */
    class AnimationConfig extends BaseObject {
        static toString(): string;
        /**
         * @private
         */
        pauseFadeOut: boolean;
        /**
         * - Fade out the pattern of other animation states when the animation state is fade in.
         * This property is typically used to specify the substitution of multiple animation states blend.
         * @default dragonBones.AnimationFadeOutMode.All
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 淡入动画状态时淡出其他动画状态的模式。
         * 该属性通常用来指定多个动画状态混合时的相互替换关系。
         * @default dragonBones.AnimationFadeOutMode.All
         * @version DragonBones 5.0
         * @language zh_CN
         */
        fadeOutMode: AnimationFadeOutMode;
        /**
         * @private
         */
        fadeOutTweenType: TweenType;
        /**
         * @private
         */
        fadeOutTime: number;
        /**
         * @private
         */
        pauseFadeIn: boolean;
        /**
         * @private
         */
        actionEnabled: boolean;
        /**
         * @private
         */
        additiveBlending: boolean;
        /**
         * - Whether the animation state has control over the display property of the slots.
         * Sometimes blend a animation state does not want it to control the display properties of the slots,
         * especially if other animation state are controlling the display properties of the slots.
         * @default true
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 动画状态是否对插槽的显示对象属性有控制权。
         * 有时混合一个动画状态并不希望其控制插槽的显示对象属性，
         * 尤其是其他动画状态正在控制这些插槽的显示对象属性时。
         * @default true
         * @version DragonBones 5.0
         * @language zh_CN
         */
        displayControl: boolean;
        /**
         * - Whether to reset the objects without animation to the armature pose when the animation state is start to play.
         * This property should usually be set to false when blend multiple animation states.
         * @default true
         * @version DragonBones 5.1
         * @language en_US
         */
        /**
         * - 开始播放动画状态时是否将没有动画的对象重置为骨架初始值。
         * 通常在混合多个动画状态时应该将该属性设置为 false。
         * @default true
         * @version DragonBones 5.1
         * @language zh_CN
         */
        resetToPose: boolean;
        /**
         * @private
         */
        fadeInTweenType: TweenType;
        /**
         * - The play times. [0: Loop play, [1~N]: Play N times]
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 播放次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 3.0
         * @language zh_CN
         */
        playTimes: number;
        /**
         * - The blend layer.
         * High layer animation state will get the blend weight first.
         * When the blend weight is assigned more than 1, the remaining animation states will no longer get the weight assigned.
         * @readonly
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 混合图层。
         * 图层高的动画状态会优先获取混合权重。
         * 当混合权重分配超过 1 时，剩余的动画状态将不再获得权重分配。
         * @readonly
         * @version DragonBones 5.0
         * @language zh_CN
         */
        layer: number;
        /**
         * - The start time of play. (In seconds)
         * @default 0.0
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 播放的开始时间。 （以秒为单位）
         * @default 0.0
         * @version DragonBones 5.0
         * @language zh_CN
         */
        position: number;
        /**
         * - The duration of play.
         * [-1: Use the default value of the animation data, 0: Stop play, (0~N]: The duration] (In seconds)
         * @default -1.0
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 播放的持续时间。
         * [-1: 使用动画数据默认值, 0: 动画停止, (0~N]: 持续时间] （以秒为单位）
         * @default -1.0
         * @version DragonBones 5.0
         * @language zh_CN
         */
        duration: number;
        /**
         * - The play speed.
         * The value is an overlay relationship with {@link dragonBones.Animation#timeScale}.
         * [(-N~0): Reverse play, 0: Stop play, (0~1): Slow play, 1: Normal play, (1~N): Fast play]
         * @default 1.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 播放速度。
         * 该值与 {@link dragonBones.Animation#timeScale} 是叠加关系。
         * [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        timeScale: number;
        /**
         * - The blend weight.
         * @default 1.0
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 混合权重。
         * @default 1.0
         * @version DragonBones 5.0
         * @language zh_CN
         */
        weight: number;
        /**
         * - The fade in time.
         * [-1: Use the default value of the animation data, [0~N]: The fade in time] (In seconds)
         * @default -1.0
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 淡入时间。
         * [-1: 使用动画数据默认值, [0~N]: 淡入时间] （以秒为单位）
         * @default -1.0
         * @version DragonBones 5.0
         * @language zh_CN
         */
        fadeInTime: number;
        /**
         * - The auto fade out time when the animation state play completed.
         * [-1: Do not fade out automatically, [0~N]: The fade out time] (In seconds)
         * @default -1.0
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 动画状态播放完成后的自动淡出时间。
         * [-1: 不自动淡出, [0~N]: 淡出时间] （以秒为单位）
         * @default -1.0
         * @version DragonBones 5.0
         * @language zh_CN
         */
        autoFadeOutTime: number;
        /**
         * - The name of the animation state. (Can be different from the name of the animation data)
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 动画状态名称。 （可以不同于动画数据）
         * @version DragonBones 5.0
         * @language zh_CN
         */
        name: string;
        /**
         * - The animation data name.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 动画数据名称。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        animation: string;
        /**
         * - The blend group name of the animation state.
         * This property is typically used to specify the substitution of multiple animation states blend.
         * @readonly
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 混合组名称。
         * 该属性通常用来指定多个动画状态混合时的相互替换关系。
         * @readonly
         * @version DragonBones 5.0
         * @language zh_CN
         */
        group: string;
        /**
         * @private
         */
        readonly boneMask: Array<string>;
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @private
         */
        clear(): void;
        /**
         * @private
         */
        copyFrom(value: AnimationConfig): void;
        /**
         * @private
         */
        containsBoneMask(name: string): boolean;
        /**
         * @private
         */
        addBoneMask(armature: Armature, name: string, recursive?: boolean): void;
        /**
         * @private
         */
        removeBoneMask(armature: Armature, name: string, recursive?: boolean): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - The texture atlas data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 贴图集数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    abstract class TextureAtlasData extends BaseObject {
        /**
         * @private
         */
        autoSearch: boolean;
        /**
         * @private
         */
        width: number;
        /**
         * @private
         */
        height: number;
        /**
         * @private
         */
        scale: number;
        /**
         * - The texture atlas name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 贴图集名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        name: string;
        /**
         * - The image path of the texture atlas.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 贴图集图片路径。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        imagePath: string;
        /**
         * @private
         */
        readonly textures: Map<TextureData>;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        /**
         * @private
         */
        copyFrom(value: TextureAtlasData): void;
        /**
         * @internal
         * @private
         */
        abstract createTexture(): TextureData;
        /**
         * @internal
         * @private
         */
        addTexture(value: TextureData): void;
        /**
         * @private
         */
        getTexture(name: string): TextureData | null;
    }
    /**
     * @internal
     * @private
     */
    abstract class TextureData extends BaseObject {
        static createRectangle(): Rectangle;
        rotated: boolean;
        name: string;
        readonly region: Rectangle;
        parent: TextureAtlasData;
        frame: Rectangle | null;
        protected _onClear(): void;
        copyFrom(value: TextureData): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - The armature proxy interface, the docking engine needs to implement it concretely.
     * @see dragonBones.Armature
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 骨架代理接口，对接的引擎需要对其进行具体实现。
     * @see dragonBones.Armature
     * @version DragonBones 5.0
     * @language zh_CN
     */
    interface IArmatureProxy extends IEventDispatcher {
        /**
         * @internal
         * @private
         */
        dbInit(armature: Armature): void;
        /**
         * @internal
         * @private
         */
        dbClear(): void;
        /**
         * @internal
         * @private
         */
        dbUpdate(): void;
        /**
         * - Dispose the instance and the Armature instance. (The Armature instance will return to the object pool)
         * @example
         * <pre>
         *     removeChild(armatureDisplay);
         *     armatureDisplay.dispose();
         * </pre>
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 释放该实例和骨架。 （骨架会回收到对象池）
         * @example
         * <pre>
         *     removeChild(armatureDisplay);
         *     armatureDisplay.dispose();
         * </pre>
         * @version DragonBones 4.5
         * @language zh_CN
         */
        dispose(disposeProxy: boolean): void;
        /**
         * - The armature.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 骨架。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        readonly armature: Armature;
        /**
         * - The animation player.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 动画播放器。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly animation: Animation;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - Armature is the core of the skeleton animation system.
     * @see dragonBones.ArmatureData
     * @see dragonBones.Bone
     * @see dragonBones.Slot
     * @see dragonBones.Animation
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 骨架是骨骼动画系统的核心。
     * @see dragonBones.ArmatureData
     * @see dragonBones.Bone
     * @see dragonBones.Slot
     * @see dragonBones.Animation
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class Armature extends BaseObject implements IAnimatable {
        static toString(): string;
        private static _onSortSlots(a, b);
        /**
         * - Whether to inherit the animation control of the parent armature.
         * True to try to have the child armature play an animation with the same name when the parent armature play the animation.
         * @default true
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 是否继承父骨架的动画控制。
         * 如果该值为 true，当父骨架播放动画时，会尝试让子骨架播放同名动画。
         * @default true
         * @version DragonBones 4.5
         * @language zh_CN
         */
        inheritAnimation: boolean;
        /**
         * @private
         */
        userData: any;
        private _lockUpdate;
        private _bonesDirty;
        private _slotsDirty;
        private _zOrderDirty;
        private _flipX;
        private _flipY;
        /**
         * @internal
         * @private
         */
        _cacheFrameIndex: number;
        private readonly _bones;
        private readonly _slots;
        /**
         * @internal
         * @private
         */
        readonly _glueSlots: Array<Slot>;
        /**
         * @internal
         * @private
         */
        readonly _constraints: Array<Constraint>;
        private readonly _actions;
        /**
         * @internal
         * @private
         */
        _armatureData: ArmatureData;
        private _animation;
        private _proxy;
        private _display;
        /**
         * @internal
         * @private
         */
        _replaceTextureAtlasData: TextureAtlasData | null;
        private _replacedTexture;
        /**
         * @internal
         * @private
         */
        _dragonBones: DragonBones;
        private _clock;
        /**
         * @internal
         * @private
         */
        _parent: Slot | null;
        /**
         * @private
         */
        protected _onClear(): void;
        private _sortBones();
        private _sortSlots();
        /**
         * @internal
         * @private
         */
        _sortZOrder(slotIndices: Array<number> | Int16Array | null, offset: number): void;
        /**
         * @internal
         * @private
         */
        _addBoneToBoneList(value: Bone): void;
        /**
         * @internal
         * @private
         */
        _removeBoneFromBoneList(value: Bone): void;
        /**
         * @internal
         * @private
         */
        _addSlotToSlotList(value: Slot): void;
        /**
         * @internal
         * @private
         */
        _removeSlotFromSlotList(value: Slot): void;
        /**
         * @internal
         * @private
         */
        _bufferAction(action: ActionData, append: boolean): void;
        /**
         * - Dispose the armature. (Return to the object pool)
         * @example
         * <pre>
         *     removeChild(armature.display);
         *     armature.dispose();
         * </pre>
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 释放骨架。 （回收到对象池）
         * @example
         * <pre>
         *     removeChild(armature.display);
         *     armature.dispose();
         * </pre>
         * @version DragonBones 3.0
         * @language zh_CN
         */
        dispose(): void;
        /**
         * @internal
         * @private
         */
        init(armatureData: ArmatureData, proxy: IArmatureProxy, display: any, dragonBones: DragonBones): void;
        /**
         * @inheritDoc
         */
        advanceTime(passedTime: number): void;
        /**
         * - Forces a specific bone or its owning slot to update the transform or display property in the next frame.
         * @param boneName - The bone name. (If not set, all bones will be update)
         * @param updateSlot - Whether to update the bone's slots. (Default: false)
         * @see dragonBones.Bone#invalidUpdate()
         * @see dragonBones.Slot#invalidUpdate()
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 强制特定骨骼或其拥有的插槽在下一帧更新变换或显示属性。
         * @param boneName - 骨骼名称。 （如果未设置，将更新所有骨骼）
         * @param updateSlot - 是否更新骨骼的插槽。 （默认: false）
         * @see dragonBones.Bone#invalidUpdate()
         * @see dragonBones.Slot#invalidUpdate()
         * @version DragonBones 3.0
         * @language zh_CN
         */
        invalidUpdate(boneName?: string | null, updateSlot?: boolean): void;
        /**
         * - Check whether a specific point is inside a custom bounding box in a slot.
         * The coordinate system of the point is the inner coordinate system of the armature.
         * Custom bounding boxes need to be customized in Dragonbones Pro.
         * @param x - The horizontal coordinate of the point.
         * @param y - The vertical coordinate of the point.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 检查特定点是否在某个插槽的自定义边界框内。
         * 点的坐标系为骨架内坐标系。
         * 自定义边界框需要在 DragonBones Pro 中自定义。
         * @param x - 点的水平坐标。
         * @param y - 点的垂直坐标。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        containsPoint(x: number, y: number): Slot | null;
        /**
         * - Check whether a specific segment intersects a custom bounding box for a slot in the armature.
         * The coordinate system of the segment and intersection is the inner coordinate system of the armature.
         * Custom bounding boxes need to be customized in Dragonbones Pro.
         * @param xA - The horizontal coordinate of the beginning of the segment.
         * @param yA - The vertical coordinate of the beginning of the segment.
         * @param xB - The horizontal coordinate of the end point of the segment.
         * @param yB - The vertical coordinate of the end point of the segment.
         * @param intersectionPointA - The first intersection at which a line segment intersects the bounding box from the beginning to the end. (If not set, the intersection point will not calculated)
         * @param intersectionPointB - The first intersection at which a line segment intersects the bounding box from the end to the beginning. (If not set, the intersection point will not calculated)
         * @param normalRadians - The normal radians of the tangent of the intersection boundary box. [x: Normal radian of the first intersection tangent, y: Normal radian of the second intersection tangent] (If not set, the normal will not calculated)
         * @returns The slot of the first custom bounding box where the segment intersects from the start point to the end point.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 检查特定线段是否与骨架的某个插槽的自定义边界框相交。
         * 线段和交点的坐标系均为骨架内坐标系。
         * 自定义边界框需要在 DragonBones Pro 中自定义。
         * @param xA - 线段起点的水平坐标。
         * @param yA - 线段起点的垂直坐标。
         * @param xB - 线段终点的水平坐标。
         * @param yB - 线段终点的垂直坐标。
         * @param intersectionPointA - 线段从起点到终点与边界框相交的第一个交点。 （如果未设置，则不计算交点）
         * @param intersectionPointB - 线段从终点到起点与边界框相交的第一个交点。 （如果未设置，则不计算交点）
         * @param normalRadians - 交点边界框切线的法线弧度。 [x: 第一个交点切线的法线弧度, y: 第二个交点切线的法线弧度] （如果未设置，则不计算法线）
         * @returns 线段从起点到终点相交的第一个自定义边界框的插槽。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        intersectsSegment(xA: number, yA: number, xB: number, yB: number, intersectionPointA?: {
            x: number;
            y: number;
        } | null, intersectionPointB?: {
            x: number;
            y: number;
        } | null, normalRadians?: {
            x: number;
            y: number;
        } | null): Slot | null;
        /**
         * - Get a specific bone.
         * @param name - The bone name.
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定的骨骼。
         * @param name - 骨骼名称。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getBone(name: string): Bone | null;
        /**
         * - Get a specific bone by the display.
         * @param display - The display object.
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 通过显示对象获取特定的骨骼。
         * @param display - 显示对象。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getBoneByDisplay(display: any): Bone | null;
        /**
         * - Get a specific slot.
         * @param name - The slot name.
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定的插槽。
         * @param name - 插槽名称。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getSlot(name: string): Slot | null;
        /**
         * - Get a specific slot by the display.
         * @param display - The display object.
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 通过显示对象获取特定的插槽。
         * @param display - 显示对象。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getSlotByDisplay(display: any): Slot | null;
        /**
         * @deprecated
         */
        addBone(value: Bone, parentName: string): void;
        /**
         * @deprecated
         */
        addSlot(value: Slot, parentName: string): void;
        /**
         * @private
         */
        addConstraint(value: Constraint): void;
        /**
         * @deprecated
         */
        removeBone(value: Bone): void;
        /**
         * @deprecated
         */
        removeSlot(value: Slot): void;
        /**
         * - Get all bones.
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取所有的骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getBones(): Array<Bone>;
        /**
         * - Get all slots.
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取所有的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getSlots(): Array<Slot>;
        /**
         * - Whether to flip the armature horizontally.
         * @version DragonBones 5.5
         * @language en_US
         */
        /**
         * - 是否将骨架水平翻转。
         * @version DragonBones 5.5
         * @language zh_CN
         */
        flipX: boolean;
        /**
         * - Whether to flip the armature vertically.
         * @version DragonBones 5.5
         * @language en_US
         */
        /**
         * - 是否将骨架垂直翻转。
         * @version DragonBones 5.5
         * @language zh_CN
         */
        flipY: boolean;
        /**
         * - The animation cache frame rate, which turns on the animation cache when the set value is greater than 0.
         * There is a certain amount of memory overhead to improve performance by caching animation data in memory.
         * The frame rate should not be set too high, usually with the frame rate of the animation is similar and lower than the program running frame rate.
         * When the animation cache is turned on, some features will fail, such as the offset property of bone.
         * @example
         * <pre>
         *     armature.cacheFrameRate = 24;
         * </pre>
         * @see dragonBones.DragonBonesData#frameRate
         * @see dragonBones.ArmatureData#frameRate
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 动画缓存帧率，当设置的值大于 0 的时，将会开启动画缓存。
         * 通过将动画数据缓存在内存中来提高运行性能，会有一定的内存开销。
         * 帧率不宜设置的过高，通常跟动画的帧率相当且低于程序运行的帧率。
         * 开启动画缓存后，某些功能将会失效，比如骨骼的 offset 属性等。
         * @example
         * <pre>
         *     armature.cacheFrameRate = 24;
         * </pre>
         * @see dragonBones.DragonBonesData#frameRate
         * @see dragonBones.ArmatureData#frameRate
         * @version DragonBones 4.5
         * @language zh_CN
         */
        cacheFrameRate: number;
        /**
         * - The armature name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 骨架名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly name: string;
        /**
         * - The armature data.
         * @see dragonBones.ArmatureData
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 骨架数据。
         * @see dragonBones.ArmatureData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        readonly armatureData: ArmatureData;
        /**
         * - The animation player.
         * @see dragonBones.Animation
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 动画播放器。
         * @see dragonBones.Animation
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly animation: Animation;
        /**
         * @pivate
         */
        readonly proxy: IArmatureProxy;
        /**
         * - The EventDispatcher instance of the armature.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 该骨架的 EventDispatcher 实例。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        readonly eventDispatcher: IEventDispatcher;
        /**
         * - The display container.
         * The display of the slot is displayed as the parent.
         * Depending on the rendering engine, the type will be different, usually the DisplayObjectContainer type.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 显示容器实例。
         * 插槽的显示对象都会以此显示容器为父级。
         * 根据渲染引擎的不同，类型会不同，通常是 DisplayObjectContainer 类型。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly display: any;
        /**
         * @private
         */
        replacedTexture: any;
        /**
         * @inheritDoc
         */
        clock: WorldClock | null;
        /**
         * - Get the parent slot which the armature belongs to.
         * @see dragonBones.Slot
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 该骨架所属的父插槽。
         * @see dragonBones.Slot
         * @version DragonBones 4.5
         * @language zh_CN
         */
        readonly parent: Slot | null;
        /**
         * @deprecated
         * @private
         */
        replaceTexture(texture: any): void;
        /**
         * - Deprecated, please refer to {@link #eventDispatcher}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #eventDispatcher}。
         * @deprecated
         * @language zh_CN
         */
        hasEventListener(type: EventStringType): boolean;
        /**
         * - Deprecated, please refer to {@link #eventDispatcher}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #eventDispatcher}。
         * @deprecated
         * @language zh_CN
         */
        addEventListener(type: EventStringType, listener: Function, target: any): void;
        /**
         * - Deprecated, please refer to {@link #eventDispatcher}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #eventDispatcher}。
         * @deprecated
         * @language zh_CN
         */
        removeEventListener(type: EventStringType, listener: Function, target: any): void;
        /**
         * - Deprecated, please refer to {@link #cacheFrameRate}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #cacheFrameRate}。
         * @deprecated
         * @language zh_CN
         */
        enableAnimationCache(frameRate: number): void;
        /**
         * - Deprecated, please refer to {@link #display}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #display}。
         * @deprecated
         * @language zh_CN
         */
        getDisplay(): any;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - The base class of the transform object.
     * @see dragonBones.Transform
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 变换对象的基类。
     * @see dragonBones.Transform
     * @version DragonBones 4.5
     * @language zh_CN
     */
    abstract class TransformObject extends BaseObject {
        /**
         * @private
         */
        protected static readonly _helpMatrix: Matrix;
        /**
         * @private
         */
        protected static readonly _helpTransform: Transform;
        /**
         * @private
         */
        protected static readonly _helpPoint: Point;
        /**
         * - A matrix relative to the armature coordinate system.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 相对于骨架坐标系的矩阵。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly globalTransformMatrix: Matrix;
        /**
         * - A transform relative to the armature coordinate system.
         * @see #updateGlobalTransform()
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 相对于骨架坐标系的变换。
         * @see #updateGlobalTransform()
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly global: Transform;
        /**
         * - The offset transform relative to the armature or the parent bone coordinate system.
         * @see #dragonBones.Bone#invalidUpdate()
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 相对于骨架或父骨骼坐标系的偏移变换。
         * @see #dragonBones.Bone#invalidUpdate()
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly offset: Transform;
        /**
         * @private
         */
        origin: Transform | null;
        /**
         * @private
         */
        userData: any;
        /**
         * @private
         */
        protected _globalDirty: boolean;
        /**
         * @internal
         * @private
         */
        _armature: Armature;
        /**
         * @internal
         * @private
         */
        _parent: Bone;
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @internal
         * @private
         */
        _setArmature(value: Armature | null): void;
        /**
         * @internal
         * @private
         */
        _setParent(value: Bone | null): void;
        /**
         * - For performance considerations, rotation or scale in the {@link #global} attribute of the bone or slot is not always properly accessible,
         * some engines do not rely on these attributes to update rendering, such as Egret.
         * The use of this method ensures that the access to the {@link #global} property is correctly rotation or scale.
         * @example
         * <pre>
         *     bone.updateGlobalTransform();
         *     let rotation = bone.global.rotation;
         * </pre>
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 出于性能的考虑，骨骼或插槽的 {@link #global} 属性中的旋转或缩放并不总是正确可访问的，有些引擎并不依赖这些属性更新渲染，比如 Egret。
         * 使用此方法可以保证访问到 {@link #global} 属性中正确的旋转或缩放。
         * @example
         * <pre>
         *     bone.updateGlobalTransform();
         *     let rotation = bone.global.rotation;
         * </pre>
         * @version DragonBones 3.0
         * @language zh_CN
         */
        updateGlobalTransform(): void;
        /**
         * - The armature to which it belongs.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 所属的骨架。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly armature: Armature;
        /**
         * - The parent bone to which it belongs.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 所属的父骨骼。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly parent: Bone;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - Bone is one of the most important logical units in the armature animation system,
     * and is responsible for the realization of translate, rotation, scaling in the animations.
     * A armature can contain multiple bones.
     * @see dragonBones.BoneData
     * @see dragonBones.Armature
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 骨骼在骨骼动画体系中是最重要的逻辑单元之一，负责动画中的平移、旋转、缩放的实现。
     * 一个骨架中可以包含多个骨骼。
     * @see dragonBones.BoneData
     * @see dragonBones.Armature
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class Bone extends TransformObject {
        static toString(): string;
        /**
         * - The offset mode.
         * @see #offset
         * @version DragonBones 5.5
         * @language en_US
         */
        /**
         * - 偏移模式。
         * @see #offset
         * @version DragonBones 5.5
         * @language zh_CN
         */
        offsetMode: OffsetMode;
        /**
         * @internal
         * @private
         */
        readonly animationPose: Transform;
        /**
         * @internal
         * @private
         */
        _transformDirty: boolean;
        /**
         * @internal
         * @private
         */
        _childrenTransformDirty: boolean;
        protected _localDirty: boolean;
        /**
         * @internal
         * @private
         */
        _hasConstraint: boolean;
        private _visible;
        protected _cachedFrameIndex: number;
        /**
         * @internal
         * @private
         */
        readonly _blendState: BlendState;
        /**
         * @internal
         * @private
         */
        _boneData: BoneData;
        /**
         * @internal
         * @private
         */
        _cachedFrameIndices: Array<number> | null;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        /**
         * @private
         */
        protected _updateGlobalTransformMatrix(isCache: boolean): void;
        /**
         * @inheritDoc
         */
        _setArmature(value: Armature | null): void;
        /**
         * @internal
         * @private
         */
        init(boneData: BoneData): void;
        /**
         * @internal
         * @private
         */
        update(cacheFrameIndex: number): void;
        /**
         * @internal
         * @private
         */
        updateByConstraint(): void;
        /**
         * - Forces the bone to update the transform in the next frame.
         * When the bone is not animated or its animation state is finished, the bone will not continue to update,
         * and when the skeleton must be updated for some reason, the method needs to be called explicitly.
         * @example
         * <pre>
         *     let bone = armature.getBone("arm");
         *     bone.offset.scaleX = 2.0;
         *     bone.invalidUpdate();
         * </pre>
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 强制骨骼在下一帧更新变换。
         * 当该骨骼没有动画状态或其动画状态播放完成时，骨骼将不在继续更新，而此时由于某些原因必须更新骨骼时，则需要显式调用该方法。
         * @example
         * <pre>
         *     let bone = armature.getBone("arm");
         *     bone.offset.scaleX = 2.0;
         *     bone.invalidUpdate();
         * </pre>
         * @version DragonBones 3.0
         * @language zh_CN
         */
        invalidUpdate(): void;
        /**
         * - Check whether the bone contains a specific bone or slot.
         * @see dragonBones.Bone
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 检查该骨骼是否包含特定的骨骼或插槽。
         * @see dragonBones.Bone
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language zh_CN
         */
        contains(value: TransformObject): boolean;
        /**
         * - The bone data.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 骨骼数据。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        readonly boneData: BoneData;
        /**
         * - The visible of all slots in the bone.
         * @default true
         * @see dragonBones.Slot#visible
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 此骨骼所有插槽的可见。
         * @default true
         * @see dragonBones.Slot#visible
         * @version DragonBones 3.0
         * @language zh_CN
         */
        visible: boolean;
        /**
         * - The bone name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 骨骼名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly name: string;
        /**
         * - Deprecated, please refer to {@link dragonBones.Armature#getBones()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link dragonBones.Armature#getBones()}。
         * @deprecated
         * @language zh_CN
         */
        getBones(): Array<Bone>;
        /**
         * - Deprecated, please refer to {@link dragonBones.Armature#getSlots()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link dragonBones.Armature#getSlots()}。
         * @deprecated
         * @language zh_CN
         */
        getSlots(): Array<Slot>;
        /**
         * - Deprecated, please refer to {@link dragonBones.Armature#getSlot()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link dragonBones.Armature#getSlot()}。
         * @deprecated
         * @language zh_CN
         */
        readonly slot: Slot | null;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * @internal
     * @private
     */
    class Surface extends Bone {
        static toString(): string;
        private _dX;
        private _dY;
        private _k;
        private _kX;
        private _kY;
        /**
         * For debug draw.
         * @internal
         * @private
         */
        readonly _vertices: Array<number>;
        /**
         * For timeline state.
         * @internal
         * @private
         */
        readonly _deformVertices: Array<number>;
        /**
         * x1, y1, x2, y2, x3, y3, x4, y4, d1X, d1Y, d2X, d2Y
         */
        private readonly _hullCache;
        /**
         * Inside [flag, a, b, c, d, tx, ty], Outside [flag, a, b, c, d, tx, ty]
         */
        private readonly _matrixCahce;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        private _getAffineTransform(x, y, lX, lY, aX, aY, bX, bY, cX, cY, transform, matrix, isDown);
        private _updateVertices();
        /**
         * @private
         */
        protected _updateGlobalTransformMatrix(isCache: boolean): void;
        _getGlobalTransformMatrix(x: number, y: number): Matrix;
        init(surfaceData: SurfaceData): void;
        /**
         * @internal
         * @private
         */
        update(cacheFrameIndex: number): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - The slot attached to the armature, controls the display status and properties of the display object.
     * A bone can contain multiple slots.
     * A slot can contain multiple display objects, displaying only one of the display objects at a time,
     * but you can toggle the display object into frame animation while the animation is playing.
     * The display object can be a normal texture, or it can be a display of a child armature, a grid display object,
     * and a custom other display object.
     * @see dragonBones.Armature
     * @see dragonBones.Bone
     * @see dragonBones.SlotData
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 插槽附着在骨骼上，控制显示对象的显示状态和属性。
     * 一个骨骼上可以包含多个插槽。
     * 一个插槽中可以包含多个显示对象，同一时间只能显示其中的一个显示对象，但可以在动画播放的过程中切换显示对象实现帧动画。
     * 显示对象可以是普通的图片纹理，也可以是子骨架的显示容器，网格显示对象，还可以是自定义的其他显示对象。
     * @see dragonBones.Armature
     * @see dragonBones.Bone
     * @see dragonBones.SlotData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    abstract class Slot extends TransformObject {
        /**
         * - Displays the animated state or mixed group name controlled by the object, set to null to be controlled by all animation states.
         * @default null
         * @see dragonBones.AnimationState#displayControl
         * @see dragonBones.AnimationState#name
         * @see dragonBones.AnimationState#group
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 显示对象受到控制的动画状态或混合组名称，设置为 null 则表示受所有的动画状态控制。
         * @default null
         * @see dragonBones.AnimationState#displayControl
         * @see dragonBones.AnimationState#name
         * @see dragonBones.AnimationState#group
         * @version DragonBones 4.5
         * @language zh_CN
         */
        displayController: string | null;
        /**
         * @private
         */
        protected _displayDirty: boolean;
        /**
         * @private
         */
        protected _zOrderDirty: boolean;
        /**
         * @private
         */
        protected _visibleDirty: boolean;
        /**
         * @private
         */
        protected _blendModeDirty: boolean;
        /**
         * @internal
         * @private
         */
        _colorDirty: boolean;
        /**
         * @internal
         * @private
         */
        _meshDirty: boolean;
        /**
         * @private
         */
        protected _transformDirty: boolean;
        /**
         * @private
         */
        protected _visible: boolean;
        /**
         * @private
         */
        protected _blendMode: BlendMode;
        /**
         * @private
         */
        protected _displayIndex: number;
        /**
         * @private
         */
        protected _animationDisplayIndex: number;
        /**
         * @internal
         * @private
         */
        _zOrder: number;
        /**
         * @private
         */
        protected _cachedFrameIndex: number;
        /**
         * @internal
         * @private
         */
        _pivotX: number;
        /**
         * @internal
         * @private
         */
        _pivotY: number;
        /**
         * @private
         */
        protected readonly _localMatrix: Matrix;
        /**
         * @internal
         * @private
         */
        readonly _colorTransform: ColorTransform;
        /**
         * @internal
         * @private
         */
        readonly _deformVertices: Array<number>;
        /**
         * @private
         */
        readonly _displayDatas: Array<DisplayData | null>;
        /**
         * @private
         */
        protected readonly _displayList: Array<any | Armature>;
        /**
         * @private
         */
        protected readonly _meshBones: Array<Bone | null>;
        /**
         * @private
         */
        protected readonly _meshSlots: Array<Slot | null>;
        /**
         * @internal
         * @private
         */
        _slotData: SlotData;
        /**
         * @private
         */
        protected _rawDisplayDatas: Array<DisplayData | null> | null;
        /**
         * @private
         */
        protected _displayData: DisplayData | null;
        /**
         * @private
         */
        protected _textureData: TextureData | null;
        /**
         * @internal
         * @private
         */
        _meshData: MeshDisplayData | null;
        /**
         * @private
         */
        protected _boundingBoxData: BoundingBoxData | null;
        /**
         * @private
         */
        protected _rawDisplay: any;
        /**
         * @private
         */
        protected _meshDisplay: any;
        /**
         * @private
         */
        protected _display: any;
        /**
         * @private
         */
        protected _childArmature: Armature | null;
        /**
         * @internal
         * @private
         */
        _cachedFrameIndices: Array<number> | null;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        /**
         * @private
         */
        protected abstract _initDisplay(value: any, isRetain: boolean): void;
        /**
         * @private
         */
        protected abstract _disposeDisplay(value: any, isRelease: boolean): void;
        /**
         * @private
         */
        protected abstract _onUpdateDisplay(): void;
        /**
         * @private
         */
        protected abstract _addDisplay(): void;
        /**
         * @private
         */
        protected abstract _replaceDisplay(value: any): void;
        /**
         * @private
         */
        protected abstract _removeDisplay(): void;
        /**
         * @private
         */
        protected abstract _updateZOrder(): void;
        /**
         * @private
         */
        abstract _updateVisible(): void;
        /**
         * @private
         */
        protected abstract _updateBlendMode(): void;
        /**
         * @private
         */
        protected abstract _updateColor(): void;
        /**
         * @private
         */
        protected abstract _updateFrame(): void;
        /**
         * @private
         */
        protected abstract _updateMesh(): void;
        /**
         * @internal
         * @private
         */
        abstract _updateGlueMesh(): void;
        /**
         * @private
         */
        protected abstract _updateTransform(): void;
        /**
         * @private
         */
        protected abstract _identityTransform(): void;
        /**
         * @private
         */
        protected _getDefaultRawDisplayData(): DisplayData | null;
        /**
         * @private
         */
        protected _updateDisplayData(): void;
        /**
         * @private
         */
        protected _updateDisplay(): void;
        /**
         * @private
         */
        protected _updateGlobalTransformMatrix(isCache: boolean): void;
        /**
         * @private
         */
        protected _isMeshBonesUpdate(): boolean;
        /**
         * @inheritDoc
         */
        _setArmature(value: Armature | null): void;
        /**
         * @internal
         * @private
         */
        _setDisplayIndex(value: number, isAnimation?: boolean): boolean;
        /**
         * @internal
         * @private
         */
        _setZorder(value: number): boolean;
        /**
         * @internal
         * @private
         */
        _setColor(value: ColorTransform): boolean;
        /**
         * @internal
         * @private
         */
        _setDisplayList(value: Array<any> | null): boolean;
        /**
         * @internal
         * @private
         */
        init(slotData: SlotData, displayDatas: Array<DisplayData | null> | null, rawDisplay: any, meshDisplay: any): void;
        /**
         * @internal
         * @private
         */
        update(cacheFrameIndex: number): void;
        /**
         * @private
         */
        updateTransformAndMatrix(): void;
        /**
         * @private
         */
        replaceDisplayData(value: DisplayData | null, displayIndex?: number): void;
        /**
         * - Check whether a specific point is inside a custom bounding box in the slot.
         * The coordinate system of the point is the inner coordinate system of the armature.
         * Custom bounding boxes need to be customized in Dragonbones Pro.
         * @param x - The horizontal coordinate of the point.
         * @param y - The vertical coordinate of the point.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 检查特定点是否在插槽的自定义边界框内。
         * 点的坐标系为骨架内坐标系。
         * 自定义边界框需要在 DragonBones Pro 中自定义。
         * @param x - 点的水平坐标。
         * @param y - 点的垂直坐标。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        containsPoint(x: number, y: number): boolean;
        /**
         * - Check whether a specific segment intersects a custom bounding box for the slot.
         * The coordinate system of the segment and intersection is the inner coordinate system of the armature.
         * Custom bounding boxes need to be customized in Dragonbones Pro.
         * @param xA - The horizontal coordinate of the beginning of the segment.
         * @param yA - The vertical coordinate of the beginning of the segment.
         * @param xB - The horizontal coordinate of the end point of the segment.
         * @param yB - The vertical coordinate of the end point of the segment.
         * @param intersectionPointA - The first intersection at which a line segment intersects the bounding box from the beginning to the end. (If not set, the intersection point will not calculated)
         * @param intersectionPointB - The first intersection at which a line segment intersects the bounding box from the end to the beginning. (If not set, the intersection point will not calculated)
         * @param normalRadians - The normal radians of the tangent of the intersection boundary box. [x: Normal radian of the first intersection tangent, y: Normal radian of the second intersection tangent] (If not set, the normal will not calculated)
         * @returns Intersection situation. [1: Disjoint and segments within the bounding box, 0: Disjoint, 1: Intersecting and having a nodal point and ending in the bounding box, 2: Intersecting and having a nodal point and starting at the bounding box, 3: Intersecting and having two intersections, N: Intersecting and having N intersections]
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 检查特定线段是否与插槽的自定义边界框相交。
         * 线段和交点的坐标系均为骨架内坐标系。
         * 自定义边界框需要在 DragonBones Pro 中自定义。
         * @param xA - 线段起点的水平坐标。
         * @param yA - 线段起点的垂直坐标。
         * @param xB - 线段终点的水平坐标。
         * @param yB - 线段终点的垂直坐标。
         * @param intersectionPointA - 线段从起点到终点与边界框相交的第一个交点。 （如果未设置，则不计算交点）
         * @param intersectionPointB - 线段从终点到起点与边界框相交的第一个交点。 （如果未设置，则不计算交点）
         * @param normalRadians - 交点边界框切线的法线弧度。 [x: 第一个交点切线的法线弧度, y: 第二个交点切线的法线弧度] （如果未设置，则不计算法线）
         * @returns 相交的情况。 [-1: 不相交且线段在包围盒内, 0: 不相交, 1: 相交且有一个交点且终点在包围盒内, 2: 相交且有一个交点且起点在包围盒内, 3: 相交且有两个交点, N: 相交且有 N 个交点]
         * @version DragonBones 5.0
         * @language zh_CN
         */
        intersectsSegment(xA: number, yA: number, xB: number, yB: number, intersectionPointA?: {
            x: number;
            y: number;
        } | null, intersectionPointB?: {
            x: number;
            y: number;
        } | null, normalRadians?: {
            x: number;
            y: number;
        } | null): number;
        /**
         * - Forces the slot to update the state of the display object in the next frame.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 强制插槽在下一帧更新显示对象的状态。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        invalidUpdate(): void;
        /**
         * - The visible of slot's display object.
         * @default true
         * @version DragonBones 5.6
         * @language en_US
         */
        /**
         * - 插槽的显示对象的可见。
         * @default true
         * @version DragonBones 5.6
         * @language zh_CN
         */
        visible: boolean;
        /**
         * - The index of the display object displayed in the display list.
         * @example
         * <pre>
         *     let slot = armature.getSlot("weapon");
         *     slot.displayIndex = 3;
         *     slot.displayController = "none";
         * </pre>
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 此时显示的显示对象在显示列表中的索引。
         * @example
         * <pre>
         *     let slot = armature.getSlot("weapon");
         *     slot.displayIndex = 3;
         *     slot.displayController = "none";
         * </pre>
         * @version DragonBones 4.5
         * @language zh_CN
         */
        displayIndex: number;
        /**
         * - The slot name.
         * @see dragonBones.SlotData#name
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 插槽名称。
         * @see dragonBones.SlotData#name
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly name: string;
        /**
         * - Contains a display list of display objects or child armatures.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 包含显示对象或子骨架的显示列表。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        displayList: Array<any>;
        /**
         * - The slot data.
         * @see dragonBones.SlotData
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 插槽数据。
         * @see dragonBones.SlotData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        readonly slotData: SlotData;
        /**
         * @private
         */
        rawDisplayDatas: Array<DisplayData | null> | null;
        /**
         * - The custom bounding box data for the slot at current time.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 插槽此时的自定义包围盒数据。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        readonly boundingBoxData: BoundingBoxData | null;
        /**
         * @private
         */
        readonly rawDisplay: any;
        /**
         * @private
         */
        readonly meshDisplay: any;
        /**
         * - The display object that the slot displays at this time.
         * @example
         * <pre>
         *     let slot = armature.getSlot("text");
         *     slot.display = new yourEngine.TextField();
         * </pre>
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 插槽此时显示的显示对象。
         * @example
         * <pre>
         *     let slot = armature.getSlot("text");
         *     slot.display = new yourEngine.TextField();
         * </pre>
         * @version DragonBones 3.0
         * @language zh_CN
         */
        display: any;
        /**
         * - The child armature that the slot displayed at current time.
         * @example
         * <pre>
         *     let slot = armature.getSlot("weapon");
         *     slot.childArmature = factory.buildArmature("weapon_blabla", "weapon_blabla_project");
         * </pre>
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 插槽此时显示的子骨架。
         * @example
         * <pre>
         *     let slot = armature.getSlot("weapon");
         *     slot.childArmature = factory.buildArmature("weapon_blabla", "weapon_blabla_project");
         * </pre>
         * @version DragonBones 3.0
         * @language zh_CN
         */
        childArmature: Armature | null;
        /**
         * - Deprecated, please refer to {@link #display}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #display}。
         * @deprecated
         * @language zh_CN
         */
        getDisplay(): any;
        /**
         * - Deprecated, please refer to {@link #display}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #display}。
         * @deprecated
         * @language zh_CN
         */
        setDisplay(value: any): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * @internal
     * @private
     */
    abstract class Constraint extends BaseObject {
        protected static readonly _helpMatrix: Matrix;
        protected static readonly _helpTransform: Transform;
        protected static readonly _helpPoint: Point;
        /**
         * - For timeline state.
         * @internal
         */
        _constraintData: ConstraintData;
        protected _armature: Armature;
        /**
         * - For sort bones.
         * @internal
         */
        _target: Bone;
        /**
         * - For sort bones.
         * @internal
         */
        _root: Bone;
        protected _bone: Bone | null;
        protected _onClear(): void;
        abstract init(constraintData: ConstraintData, armature: Armature): void;
        abstract update(): void;
        abstract invalidUpdate(): void;
        readonly name: string;
    }
    /**
     * @internal
     * @private
     */
    class IKConstraint extends Constraint {
        static toString(): string;
        private _scaleEnabled;
        /**
         * - For timeline state.
         * @internal
         */
        _bendPositive: boolean;
        /**
         * - For timeline state.
         * @internal
         */
        _weight: number;
        protected _onClear(): void;
        private _computeA();
        private _computeB();
        init(constraintData: ConstraintData, armature: Armature): void;
        update(): void;
        invalidUpdate(): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - Play animation interface. (Both Armature and Wordclock implement the interface)
     * Any instance that implements the interface can be added to the Worldclock instance and advance time by Worldclock instance uniformly.
     * @see dragonBones.WorldClock
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 播放动画接口。 (Armature 和 WordClock 都实现了该接口)
     * 任何实现了此接口的实例都可以添加到 WorldClock 实例中，由 WorldClock 实例统一更新时间。
     * @see dragonBones.WorldClock
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     * @language zh_CN
     */
    interface IAnimatable {
        /**
         * - Advance time.
         * @param passedTime - Passed time. (In seconds)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 更新时间。
         * @param passedTime - 前进的时间。 （以秒为单位）
         * @version DragonBones 3.0
         * @language zh_CN
         */
        advanceTime(passedTime: number): void;
        /**
         * - The Wordclock instance to which the current belongs.
         * @example
         * <pre>
         *     armature.clock = factory.clock; // Add armature to clock.
         *     armature.clock = null; // Remove armature from clock.
         * </pre>
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 当前所属的 WordClock 实例。
         * @example
         * <pre>
         *     armature.clock = factory.clock; // 将骨架添加到时钟。
         *     armature.clock = null; // 将骨架从时钟移除。
         * </pre>
         * @version DragonBones 5.0
         * @language zh_CN
         */
        clock: WorldClock | null;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - Worldclock provides clock support for animations, advance time for each IAnimatable object added to the instance.
     * @see dragonBones.IAnimateble
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - WorldClock 对动画提供时钟支持，为每个加入到该实例的 IAnimatable 对象更新时间。
     * @see dragonBones.IAnimateble
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class WorldClock implements IAnimatable {
        /**
         * - Current time. (In seconds)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 当前的时间。 (以秒为单位)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        time: number;
        /**
         * - The play speed, used to control animation speed-shift play.
         * [0: Stop play, (0~1): Slow play, 1: Normal play, (1~N): Fast play]
         * @default 1.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 播放速度，用于控制动画变速播放。
         * [0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        timeScale: number;
        private readonly _animatebles;
        private _clock;
        /**
         * - Creating a Worldclock instance. Typically, you do not need to create Worldclock instance.
         * When multiple Worldclock instances are running at different speeds, can achieving some specific animation effects, such as bullet time.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 创建一个 WorldClock 实例。通常并不需要创建 WorldClock 实例。
         * 当多个 WorldClock 实例使用不同的速度运行时，可以实现一些特殊的动画效果，比如子弹时间等。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        constructor(time?: number);
        /**
         * - Advance time for all IAnimatable instances.
         * @param passedTime - Passed time. [-1: Automatically calculates the time difference between the current frame and the previous frame, [0~N): Passed time] (In seconds)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 为所有的 IAnimatable 实例更新时间。
         * @param passedTime - 前进的时间。 [-1: 自动计算当前帧与上一帧的时间差, [0~N): 前进的时间] (以秒为单位)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        advanceTime(passedTime: number): void;
        /**
         * - Check whether contains a specific instance of IAnimatable.
         * @param value - The IAnimatable instance.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 检查是否包含特定的 IAnimatable 实例。
         * @param value - IAnimatable 实例。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        contains(value: IAnimatable): boolean;
        /**
         * - Add IAnimatable instance.
         * @param value - The IAnimatable instance.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 添加 IAnimatable 实例。
         * @param value - IAnimatable 实例。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        add(value: IAnimatable): void;
        /**
         * - Removes a specified IAnimatable instance.
         * @param value - The IAnimatable instance.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 移除特定的 IAnimatable 实例。
         * @param value - IAnimatable 实例。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        remove(value: IAnimatable): void;
        /**
         * - Clear all IAnimatable instances.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 清除所有的 IAnimatable 实例。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        clear(): void;
        /**
         * @inheritDoc
         */
        clock: WorldClock | null;
        /**
         * - Deprecated, please refer to {@link dragonBones.BaseFactory#clock}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link dragonBones.BaseFactory#clock}。
         * @deprecated
         * @language zh_CN
         */
        static readonly clock: WorldClock;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - The animation player is used to play the animation data and manage the animation states.
     * @see dragonBones.AnimationData
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 动画播放器用来播放动画数据和管理动画状态。
     * @see dragonBones.AnimationData
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class Animation extends BaseObject {
        static toString(): string;
        /**
         * - The play speed of all animations. [0: Stop, (0~1): Slow, 1: Normal, (1~N): Fast]
         * @default 1.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 所有动画的播放速度。 [0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        timeScale: number;
        private _lockUpdate;
        private _animationDirty;
        private _inheritTimeScale;
        private readonly _animationNames;
        private readonly _animationStates;
        private readonly _animations;
        private _armature;
        private _animationConfig;
        private _lastAnimationState;
        /**
         * @private
         */
        protected _onClear(): void;
        private _fadeOut(animationConfig);
        /**
         * @internal
         * @private
         */
        init(armature: Armature): void;
        /**
         * @internal
         * @private
         */
        advanceTime(passedTime: number): void;
        /**
         * - Clear all animations states.
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 清除所有的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         * @language zh_CN
         */
        reset(): void;
        /**
         * - Pause a specific animation state.
         * @param animationName - The name of animation state. (If not set, it will pause all animations)
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 暂停指定动画状态的播放。
         * @param animationName - 动画状态名称。 （如果未设置，则暂停所有动画）
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        stop(animationName?: string | null): void;
        /**
         * - Play animation with a specific animation config.
         * The API is still in the experimental phase and may encounter bugs or stability or compatibility issues when used.
         * @param animationConfig - The animation config.
         * @returns The playing animation state.
         * @see dragonBones.AnimationConfig
         * @beta
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 通过指定的动画配置来播放动画。
         * 该 API 仍在实验阶段，使用时可能遭遇 bug 或稳定性或兼容性问题。
         * @param animationConfig - 动画配置。
         * @returns 播放的动画状态。
         * @see dragonBones.AnimationConfig
         * @beta
         * @version DragonBones 5.0
         * @language zh_CN
         */
        playConfig(animationConfig: AnimationConfig): AnimationState | null;
        /**
         * - Play a specific animation.
         * @param animationName - The name of animation data. (If not set, The default animation will be played, or resume the animation playing from pause status, or replay the last playing animation)
         * @param playTimes - Playing repeat times. [-1: Use default value of the animation data, 0: No end loop playing, [1~N]: Repeat N times] (default: -1)
         * @returns The playing animation state.
         * @example
         * <pre>
         *     armature.animation.play("walk");
         * </pre>
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 播放指定动画。
         * @param animationName - 动画数据名称。 （如果未设置，则播放默认动画，或将暂停状态切换为播放状态，或重新播放之前播放的动画）
         * @param playTimes - 循环播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）
         * @returns 播放的动画状态。
         * @example
         * <pre>
         *     armature.animation.play("walk");
         * </pre>
         * @version DragonBones 3.0
         * @language zh_CN
         */
        play(animationName?: string | null, playTimes?: number): AnimationState | null;
        /**
         * - Fade in a specific animation.
         * @param animationName - The name of animation data.
         * @param fadeInTime - The fade in time. [-1: Use the default value of animation data, [0~N]: The fade in time (In seconds)] (Default: -1)
         * @param playTimes - playing repeat times. [-1: Use the default value of animation data, 0: No end loop playing, [1~N]: Repeat N times] (Default: -1)
         * @param layer - The blending layer, the animation states in high level layer will get the blending weights with high priority, when the total blending weights are more than 1.0, there will be no more weights can be allocated to the other animation states. (Default: 0)
         * @param group - The blending group name, it is typically used to specify the substitution of multiple animation states blending. (Default: null)
         * @param fadeOutMode - The fade out mode, which is typically used to specify alternate mode of multiple animation states blending. (Default: AnimationFadeOutMode.SameLayerAndGroup)
         * @returns The playing animation state.
         * @example
         * <pre>
         *     armature.animation.fadeIn("walk", 0.3, 0, 0, "normalGroup").resetToPose = false;
         *     armature.animation.fadeIn("attack", 0.3, 1, 0, "attackGroup").resetToPose = false;
         * </pre>
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 淡入播放指定的动画。
         * @param animationName - 动画数据名称。
         * @param fadeInTime - 淡入时间。 [-1: 使用动画数据默认值, [0~N]: 淡入时间 (以秒为单位)] （默认: -1）
         * @param playTimes - 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）
         * @param layer - 混合图层，图层高的动画状态会优先获取混合权重，当混合权重分配总和超过 1.0 时，剩余的动画状态将不能再获得权重分配。 （默认: 0）
         * @param group - 混合组名称，该属性通常用来指定多个动画状态混合时的相互替换关系。 （默认: null）
         * @param fadeOutMode - 淡出模式，该属性通常用来指定多个动画状态混合时的相互替换模式。 （默认: AnimationFadeOutMode.SameLayerAndGroup）
         * @returns 播放的动画状态。
         * @example
         * <pre>
         *     armature.animation.fadeIn("walk", 0.3, 0, 0, "normalGroup").resetToPose = false;
         *     armature.animation.fadeIn("attack", 0.3, 1, 0, "attackGroup").resetToPose = false;
         * </pre>
         * @version DragonBones 4.5
         * @language zh_CN
         */
        fadeIn(animationName: string, fadeInTime?: number, playTimes?: number, layer?: number, group?: string | null, fadeOutMode?: AnimationFadeOutMode): AnimationState | null;
        /**
         * - Play a specific animation from the specific time.
         * @param animationName - The name of animation data.
         * @param time - The start time point of playing. (In seconds)
         * @param playTimes - Playing repeat times. [-1: Use the default value of animation data, 0: No end loop playing, [1~N]: Repeat N times] (Default: -1)
         * @returns The played animation state.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 从指定时间开始播放指定的动画。
         * @param animationName - 动画数据名称。
         * @param time - 播放开始的时间。 (以秒为单位)
         * @param playTimes - 循环播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）
         * @returns 播放的动画状态。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        gotoAndPlayByTime(animationName: string, time?: number, playTimes?: number): AnimationState | null;
        /**
         * - Play a specific animation from the specific frame.
         * @param animationName - The name of animation data.
         * @param frame - The start frame of playing.
         * @param playTimes - Playing repeat times. [-1: Use the default value of animation data, 0: No end loop playing, [1~N]: Repeat N times] (Default: -1)
         * @returns The played animation state.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 从指定帧开始播放指定的动画。
         * @param animationName - 动画数据名称。
         * @param frame - 播放开始的帧数。
         * @param playTimes - 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）
         * @returns 播放的动画状态。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        gotoAndPlayByFrame(animationName: string, frame?: number, playTimes?: number): AnimationState | null;
        /**
         * - Play a specific animation from the specific progress.
         * @param animationName - The name of animation data.
         * @param progress - The start progress value of playing.
         * @param playTimes - Playing repeat times. [-1: Use the default value of animation data, 0: No end loop playing, [1~N]: Repeat N times] (Default: -1)
         * @returns The played animation state.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 从指定进度开始播放指定的动画。
         * @param animationName - 动画数据名称。
         * @param progress - 开始播放的进度。
         * @param playTimes - 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）
         * @returns 播放的动画状态。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        gotoAndPlayByProgress(animationName: string, progress?: number, playTimes?: number): AnimationState | null;
        /**
         * - Stop a specific animation at the specific time.
         * @param animationName - The name of animation data.
         * @param time - The stop time. (In seconds)
         * @returns The played animation state.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 在指定时间停止指定动画播放
         * @param animationName - 动画数据名称。
         * @param time - 停止的时间。 (以秒为单位)
         * @returns 播放的动画状态。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        gotoAndStopByTime(animationName: string, time?: number): AnimationState | null;
        /**
         * - Stop a specific animation at the specific frame.
         * @param animationName - The name of animation data.
         * @param frame - The stop frame.
         * @returns The played animation state.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 在指定帧停止指定动画的播放
         * @param animationName - 动画数据名称。
         * @param frame - 停止的帧数。
         * @returns 播放的动画状态。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        gotoAndStopByFrame(animationName: string, frame?: number): AnimationState | null;
        /**
         * - Stop a specific animation at the specific progress.
         * @param animationName - The name of animation data.
         * @param progress - The stop progress value.
         * @returns The played animation state.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 在指定的进度停止指定的动画播放。
         * @param animationName - 动画数据名称。
         * @param progress - 停止进度。
         * @returns 播放的动画状态。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        gotoAndStopByProgress(animationName: string, progress?: number): AnimationState | null;
        /**
         * - Get a specific animation state.
         * @param animationName - The name of animation state.
         * @example
         * <pre>
         *     armature.animation.play("walk");
         *     let walkState = armature.animation.getState("walk");
         *     walkState.timeScale = 0.5;
         * </pre>
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取指定的动画状态
         * @param animationName - 动画状态名称。
         * @example
         * <pre>
         *     armature.animation.play("walk");
         *     let walkState = armature.animation.getState("walk");
         *     walkState.timeScale = 0.5;
         * </pre>
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getState(animationName: string): AnimationState | null;
        /**
         * - Check whether a specific animation data is included.
         * @param animationName - The name of animation data.
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 检查是否包含指定的动画数据
         * @param animationName - 动画数据名称。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        hasAnimation(animationName: string): boolean;
        /**
         * - Get all the animation states.
         * @version DragonBones 5.1
         * @language en_US
         */
        /**
         * - 获取所有的动画状态
         * @version DragonBones 5.1
         * @language zh_CN
         */
        getStates(): Array<AnimationState>;
        /**
         * - Check whether there is an animation state is playing
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 检查是否有动画状态正在播放
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly isPlaying: boolean;
        /**
         * - Check whether all the animation states' playing were finished.
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 检查是否所有的动画状态均已播放完毕。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly isCompleted: boolean;
        /**
         * - The name of the last playing animation state.
         * @see #lastAnimationState
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 上一个播放的动画状态名称
         * @see #lastAnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly lastAnimationName: string;
        /**
         * - The name of all animation data
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 所有动画数据的名称
         * @version DragonBones 4.5
         * @language zh_CN
         */
        readonly animationNames: Array<string>;
        /**
         * - All animation data.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 所有的动画数据。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        animations: Map<AnimationData>;
        /**
         * - An AnimationConfig instance that can be used quickly.
         * @see dragonBones.AnimationConfig
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 一个可以快速使用的动画配置实例。
         * @see dragonBones.AnimationConfig
         * @version DragonBones 5.0
         * @language zh_CN
         */
        readonly animationConfig: AnimationConfig;
        /**
         * - The last playing animation state
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 上一个播放的动画状态
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly lastAnimationState: AnimationState | null;
        /**
         * - Deprecated, please refer to {@link #play()} {@link #fadeIn()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #play()} {@link #fadeIn()}。
         * @deprecated
         * @language zh_CN
         */
        gotoAndPlay(animationName: string, fadeInTime?: number, duration?: number, playTimes?: number, layer?: number, group?: string | null, fadeOutMode?: AnimationFadeOutMode, pauseFadeOut?: boolean, pauseFadeIn?: boolean): AnimationState | null;
        /**
         * - Deprecated, please refer to {@link #gotoAndStopByTime()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #gotoAndStopByTime()}。
         * @deprecated
         * @language zh_CN
         */
        gotoAndStop(animationName: string, time?: number): AnimationState | null;
        /**
         * - Deprecated, please refer to {@link #animationNames}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #animationNames}。
         * @deprecated
         * @language zh_CN
         */
        readonly animationList: Array<string>;
        /**
         * - Deprecated, please refer to {@link #animationNames}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #animationNames}。
         * @deprecated
         * @language zh_CN
         */
        readonly animationDataList: Array<AnimationData>;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - The animation state is generated when the animation data is played.
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 动画状态由播放动画数据时产生。
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class AnimationState extends BaseObject {
        static toString(): string;
        /**
         * @private
         */
        actionEnabled: boolean;
        /**
         * @private
         */
        additiveBlending: boolean;
        /**
         * - Whether the animation state has control over the display object properties of the slots.
         * Sometimes blend a animation state does not want it to control the display object properties of the slots,
         * especially if other animation state are controlling the display object properties of the slots.
         * @default true
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 动画状态是否对插槽的显示对象属性有控制权。
         * 有时混合一个动画状态并不希望其控制插槽的显示对象属性，
         * 尤其是其他动画状态正在控制这些插槽的显示对象属性时。
         * @default true
         * @version DragonBones 5.0
         * @language zh_CN
         */
        displayControl: boolean;
        /**
         * - Whether to reset the objects without animation to the armature pose when the animation state is start to play.
         * This property should usually be set to false when blend multiple animation states.
         * @default true
         * @version DragonBones 5.1
         * @language en_US
         */
        /**
         * - 开始播放动画状态时是否将没有动画的对象重置为骨架初始值。
         * 通常在混合多个动画状态时应该将该属性设置为 false。
         * @default true
         * @version DragonBones 5.1
         * @language zh_CN
         */
        resetToPose: boolean;
        /**
         * - The play times. [0: Loop play, [1~N]: Play N times]
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 播放次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 3.0
         * @language zh_CN
         */
        playTimes: number;
        /**
         * - The blend layer.
         * High layer animation state will get the blend weight first.
         * When the blend weight is assigned more than 1, the remaining animation states will no longer get the weight assigned.
         * @readonly
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 混合图层。
         * 图层高的动画状态会优先获取混合权重。
         * 当混合权重分配超过 1 时，剩余的动画状态将不再获得权重分配。
         * @readonly
         * @version DragonBones 5.0
         * @language zh_CN
         */
        layer: number;
        /**
         * - The play speed.
         * The value is an overlay relationship with {@link dragonBones.Animation#timeScale}.
         * [(-N~0): Reverse play, 0: Stop play, (0~1): Slow play, 1: Normal play, (1~N): Fast play]
         * @default 1.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 播放速度。
         * 该值与 {@link dragonBones.Animation#timeScale} 是叠加关系。
         * [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        timeScale: number;
        /**
         * - The blend weight.
         * @default 1.0
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 混合权重。
         * @default 1.0
         * @version DragonBones 5.0
         * @language zh_CN
         */
        weight: number;
        /**
         * - The auto fade out time when the animation state play completed.
         * [-1: Do not fade out automatically, [0~N]: The fade out time] (In seconds)
         * @default -1.0
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 动画状态播放完成后的自动淡出时间。
         * [-1: 不自动淡出, [0~N]: 淡出时间] （以秒为单位）
         * @default -1.0
         * @version DragonBones 5.0
         * @language zh_CN
         */
        autoFadeOutTime: number;
        /**
         * @private
         */
        fadeTotalTime: number;
        /**
         * - The name of the animation state. (Can be different from the name of the animation data)
         * @readonly
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 动画状态名称。 （可以不同于动画数据）
         * @readonly
         * @version DragonBones 5.0
         * @language zh_CN
         */
        name: string;
        /**
         * - The blend group name of the animation state.
         * This property is typically used to specify the substitution of multiple animation states blend.
         * @readonly
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 混合组名称。
         * 该属性通常用来指定多个动画状态混合时的相互替换关系。
         * @readonly
         * @version DragonBones 5.0
         * @language zh_CN
         */
        group: string;
        private _timelineDirty;
        /**
         * - xx: Play Enabled, Fade Play Enabled
         * @internal
         * @private
         */
        _playheadState: number;
        /**
         * -1: Fade in, 0: Fade complete, 1: Fade out;
         * @internal
         * @private
         */
        _fadeState: number;
        /**
         * -1: Fade start, 0: Fading, 1: Fade complete;
         * @internal
         * @private
         */
        _subFadeState: number;
        /**
         * @internal
         * @private
         */
        _position: number;
        /**
         * @internal
         * @private
         */
        _duration: number;
        private _fadeTime;
        private _time;
        /**
         * @internal
         * @private
         */
        _fadeProgress: number;
        /**
         * @internal
         * @private
         */
        _weightResult: number;
        /**
         * @internal
         * @private
         */
        readonly _blendState: BlendState;
        private readonly _boneMask;
        private readonly _boneTimelines;
        private readonly _surfaceTimelines;
        private readonly _slotTimelines;
        private readonly _constraintTimelines;
        private readonly _animationTimelines;
        private readonly _poseTimelines;
        private readonly _bonePoses;
        /**
         * @internal
         * @private
         */
        _animationData: AnimationData;
        private _armature;
        /**
         * @internal
         * @private
         */
        _actionTimeline: ActionTimelineState;
        private _zOrderTimeline;
        /**
         * @internal
         * @private
         */
        _parent: AnimationState;
        /**
         * @private
         */
        protected _onClear(): void;
        private _updateTimelines();
        private _updateBoneAndSlotTimelines();
        private _advanceFadeTime(passedTime);
        /**
         * @internal
         * @private
         */
        init(armature: Armature, animationData: AnimationData, animationConfig: AnimationConfig): void;
        /**
         * @internal
         * @private
         */
        advanceTime(passedTime: number, cacheFrameRate: number): void;
        /**
         * - Continue play.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 继续播放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        play(): void;
        /**
         * - Stop play.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 暂停播放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        stop(): void;
        /**
         * - Fade out the animation state.
         * @param fadeOutTime - The fade out time. (In seconds)
         * @param pausePlayhead - Whether to pause the animation playing when fade out.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 淡出动画状态。
         * @param fadeOutTime - 淡出时间。 （以秒为单位）
         * @param pausePlayhead - 淡出时是否暂停播放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        fadeOut(fadeOutTime: number, pausePlayhead?: boolean): void;
        /**
         * - Check if a specific bone mask is included.
         * @param name - The bone name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 检查是否包含特定骨骼遮罩。
         * @param name - 骨骼名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        containsBoneMask(name: string): boolean;
        /**
         * - Add a specific bone mask.
         * @param name - The bone name.
         * @param recursive - Whether or not to add a mask to the bone's sub-bone.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 添加特定的骨骼遮罩。
         * @param name - 骨骼名称。
         * @param recursive - 是否为该骨骼的子骨骼添加遮罩。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        addBoneMask(name: string, recursive?: boolean): void;
        /**
         * - Remove the mask of a specific bone.
         * @param name - The bone name.
         * @param recursive - Whether to remove the bone's sub-bone mask.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 删除特定骨骼的遮罩。
         * @param name - 骨骼名称。
         * @param recursive - 是否删除该骨骼的子骨骼遮罩。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        removeBoneMask(name: string, recursive?: boolean): void;
        /**
         * - Remove all bone masks.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 删除所有骨骼遮罩。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        removeAllBoneMask(): void;
        /**
         * - Whether the animation state is fading in.
         * @version DragonBones 5.1
         * @language en_US
         */
        /**
         * - 是否正在淡入。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        readonly isFadeIn: boolean;
        /**
         * - Whether the animation state is fading out.
         * @version DragonBones 5.1
         * @language en_US
         */
        /**
         * - 是否正在淡出。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        readonly isFadeOut: boolean;
        /**
         * - Whether the animation state is fade completed.
         * @version DragonBones 5.1
         * @language en_US
         */
        /**
         * - 是否淡入或淡出完毕。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        readonly isFadeComplete: boolean;
        /**
         * - Whether the animation state is playing.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 是否正在播放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly isPlaying: boolean;
        /**
         * - Whether the animation state is play completed.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 是否播放完毕。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly isCompleted: boolean;
        /**
         * - The times has been played.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 已经循环播放的次数。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly currentPlayTimes: number;
        /**
         * - The total time. (In seconds)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 总播放时间。 （以秒为单位）
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly totalTime: number;
        /**
         * - The time is currently playing. (In seconds)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 当前播放的时间。 （以秒为单位）
         * @version DragonBones 3.0
         * @language zh_CN
         */
        currentTime: number;
        /**
         * - The animation data.
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly animationData: AnimationData;
    }
    /**
     * @internal
     * @private
     */
    class BonePose extends BaseObject {
        static toString(): string;
        readonly current: Transform;
        readonly delta: Transform;
        readonly result: Transform;
        protected _onClear(): void;
    }
    /**
     * @internal
     * @private
     */
    class BlendState {
        dirty: boolean;
        layer: number;
        leftWeight: number;
        layerWeight: number;
        blendWeight: number;
        update(weight: number, layer: number): number;
        clear(): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * @internal
     * @private
     */
    const enum TweenState {
        None = 0,
        Once = 1,
        Always = 2,
    }
    /**
     * @internal
     * @private
     */
    abstract class TimelineState extends BaseObject {
        playState: number;
        currentPlayTimes: number;
        currentTime: number;
        protected _tweenState: TweenState;
        protected _frameRate: number;
        protected _frameValueOffset: number;
        protected _frameCount: number;
        protected _frameOffset: number;
        protected _frameIndex: number;
        protected _frameRateR: number;
        protected _position: number;
        protected _duration: number;
        protected _timeScale: number;
        protected _timeOffset: number;
        protected _dragonBonesData: DragonBonesData;
        protected _animationData: AnimationData;
        protected _timelineData: TimelineData | null;
        protected _armature: Armature;
        protected _animationState: AnimationState;
        protected _actionTimeline: TimelineState;
        protected _frameArray: Array<number> | Int16Array;
        protected _frameIntArray: Array<number> | Int16Array;
        protected _frameFloatArray: Array<number> | Int16Array;
        protected _timelineArray: Array<number> | Uint16Array;
        protected _frameIndices: Array<number>;
        protected _onClear(): void;
        protected abstract _onArriveAtFrame(): void;
        protected abstract _onUpdateFrame(): void;
        protected _setCurrentTime(passedTime: number): boolean;
        init(armature: Armature, animationState: AnimationState, timelineData: TimelineData | null): void;
        fadeOut(): void;
        update(passedTime: number): void;
    }
    /**
     * @internal
     * @private
     */
    abstract class TweenTimelineState extends TimelineState {
        private static _getEasingValue(tweenType, progress, easing);
        private static _getEasingCurveValue(progress, samples, count, offset);
        protected _tweenType: TweenType;
        protected _curveCount: number;
        protected _framePosition: number;
        protected _frameDurationR: number;
        protected _tweenProgress: number;
        protected _tweenEasing: number;
        protected _onClear(): void;
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
    }
    /**
     * @internal
     * @private
     */
    abstract class BoneTimelineState extends TweenTimelineState {
        bone: Bone;
        bonePose: BonePose;
        protected _onClear(): void;
        blend(state: number): void;
    }
    /**
     * @internal
     * @private
     */
    abstract class SlotTimelineState extends TweenTimelineState {
        slot: Slot;
        protected _onClear(): void;
    }
    /**
     * @internal
     * @private
     */
    abstract class ConstraintTimelineState extends TweenTimelineState {
        constraint: Constraint;
        protected _onClear(): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * @internal
     * @private
     */
    class ActionTimelineState extends TimelineState {
        static toString(): string;
        private _onCrossFrame(frameIndex);
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
        update(passedTime: number): void;
        setCurrentTime(value: number): void;
    }
    /**
     * @internal
     * @private
     */
    class ZOrderTimelineState extends TimelineState {
        static toString(): string;
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
    }
    /**
     * @internal
     * @private
     */
    class BoneAllTimelineState extends BoneTimelineState {
        static toString(): string;
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
        fadeOut(): void;
    }
    /**
     * @internal
     * @private
     */
    class BoneTranslateTimelineState extends BoneTimelineState {
        static toString(): string;
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
    }
    /**
     * @internal
     * @private
     */
    class BoneRotateTimelineState extends BoneTimelineState {
        static toString(): string;
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
        fadeOut(): void;
    }
    /**
     * @internal
     * @private
     */
    class BoneScaleTimelineState extends BoneTimelineState {
        static toString(): string;
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
    }
    /**
     * @internal
     * @private
     */
    class SurfaceTimelineState extends TweenTimelineState {
        static toString(): string;
        surface: Surface;
        private _frameFloatOffset;
        private _valueCount;
        private _deformCount;
        private _valueOffset;
        private readonly _current;
        private readonly _delta;
        private readonly _result;
        protected _onClear(): void;
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
        init(armature: Armature, animationState: AnimationState, timelineData: TimelineData | null): void;
        blend(state: number): void;
    }
    /**
     * @internal
     * @private
     */
    class SlotDislayTimelineState extends SlotTimelineState {
        static toString(): string;
        protected _onArriveAtFrame(): void;
    }
    /**
     * @internal
     * @private
     */
    class SlotColorTimelineState extends SlotTimelineState {
        static toString(): string;
        private _dirty;
        private readonly _current;
        private readonly _delta;
        private readonly _result;
        protected _onClear(): void;
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
        fadeOut(): void;
        update(passedTime: number): void;
    }
    /**
     * @internal
     * @private
     */
    class SlotFFDTimelineState extends SlotTimelineState {
        static toString(): string;
        meshOffset: number;
        private _dirty;
        private _frameFloatOffset;
        private _valueCount;
        private _deformCount;
        private _valueOffset;
        private readonly _current;
        private readonly _delta;
        private readonly _result;
        protected _onClear(): void;
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
        init(armature: Armature, animationState: AnimationState, timelineData: TimelineData | null): void;
        fadeOut(): void;
        update(passedTime: number): void;
    }
    /**
     * @internal
     * @private
     */
    class IKConstraintTimelineState extends ConstraintTimelineState {
        static toString(): string;
        private _current;
        private _delta;
        protected _onClear(): void;
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
    }
    /**
     * @internal
     * @private
     */
    class AnimationTimelineState extends TweenTimelineState {
        static toString(): string;
        animationState: AnimationState;
        private readonly _floats;
        protected _onClear(): void;
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
        blend(state: number): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - The properties of the object carry basic information about an event,
     * which are passed as parameter or parameter's parameter to event listeners when an event occurs.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 事件对象，包含有关事件的基本信息，当发生事件时，该实例将作为参数或参数的参数传递给事件侦听器。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    class EventObject extends BaseObject {
        /**
         * - Animation start play.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 动画开始播放。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static readonly START: string;
        /**
         * - Animation loop play complete once.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 动画循环播放完成一次。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static readonly LOOP_COMPLETE: string;
        /**
         * - Animation play complete.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 动画播放完成。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static readonly COMPLETE: string;
        /**
         * - Animation fade in start.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 动画淡入开始。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static readonly FADE_IN: string;
        /**
         * - Animation fade in complete.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 动画淡入完成。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static readonly FADE_IN_COMPLETE: string;
        /**
         * - Animation fade out start.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 动画淡出开始。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static readonly FADE_OUT: string;
        /**
         * - Animation fade out complete.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 动画淡出完成。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static readonly FADE_OUT_COMPLETE: string;
        /**
         * - Animation frame event.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 动画帧事件。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static readonly FRAME_EVENT: string;
        /**
         * - Animation frame sound event.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 动画帧声音事件。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static readonly SOUND_EVENT: string;
        static toString(): string;
        /**
         * - If is a frame event, the value is used to describe the time that the event was in the animation timeline. (In seconds)
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 如果是帧事件，此值用来描述该事件在动画时间轴中所处的时间。（以秒为单位）
         * @version DragonBones 4.5
         * @language zh_CN
         */
        time: number;
        /**
         * - The event type。
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 事件类型。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        type: EventStringType;
        /**
         * - The event name. (The frame event name or the frame sound name)
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 事件名称。 (帧事件的名称或帧声音的名称)
         * @version DragonBones 4.5
         * @language zh_CN
         */
        name: string;
        /**
         * - The armature that dispatch the event.
         * @see dragonBones.Armature
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 发出该事件的骨架。
         * @see dragonBones.Armature
         * @version DragonBones 4.5
         * @language zh_CN
         */
        armature: Armature;
        /**
         * - The bone that dispatch the event.
         * @see dragonBones.Bone
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 发出该事件的骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 4.5
         * @language zh_CN
         */
        bone: Bone | null;
        /**
         * - The slot that dispatch the event.
         * @see dragonBones.Slot
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 发出该事件的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 4.5
         * @language zh_CN
         */
        slot: Slot | null;
        /**
         * - The animation state that dispatch the event.
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 发出该事件的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         * @language zh_CN
         */
        animationState: AnimationState;
        /**
         * - The custom data.
         * @see dragonBones.CustomData
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 自定义数据。
         * @see dragonBones.CustomData
         * @version DragonBones 5.0
         * @language zh_CN
         */
        data: UserData | null;
        /**
         * @private
         */
        protected _onClear(): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * @private
     */
    type EventStringType = string | "start" | "loopComplete" | "complete" | "fadeIn" | "fadeInComplete" | "fadeOut" | "fadeOutComplete" | "frameEvent" | "soundEvent";
    /**
     * - The event dispatcher interface.
     * Dragonbones event dispatch usually relies on docking engine to implement, which defines the event method to be implemented when docking the engine.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 事件派发接口。
     * DragonBones 的事件派发通常依赖于对接的引擎来实现，该接口定义了对接引擎时需要实现的事件方法。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    interface IEventDispatcher {
        /**
         * - Checks whether the object has any listeners registered for a specific type of event。
         * @param type - Event type.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 检查是否为特定的事件类型注册了任何侦听器。
         * @param type - 事件类型。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        hasDBEventListener(type: EventStringType): boolean;
        /**
         * - Dispatches an event into the event flow.
         * @param type - Event type.
         * @param eventObject - Event object.
         * @see dragonBones.EventObject
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 分派特定的事件到事件流中。
         * @param type - 事件类型。
         * @param eventObject - 事件数据。
         * @see dragonBones.EventObject
         * @version DragonBones 4.5
         * @language zh_CN
         */
        dispatchDBEvent(type: EventStringType, eventObject: EventObject): void;
        /**
         * - Add an event listener object so that the listener receives notification of an event.
         * @param type - Event type.
         * @param listener - Event listener.
         * @param thisObject - The listener function's "this".
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 添加特定事件类型的事件侦听器，以使侦听器能够接收事件通知。
         * @param type - 事件类型。
         * @param listener - 事件侦听器。
         * @param thisObject - 侦听函数绑定的 this 对象。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        addDBEventListener(type: EventStringType, listener: Function, thisObject: any): void;
        /**
         * - Removes a listener from the object.
         * @param type - Event type.
         * @param listener - Event listener.
         * @param thisObject - The listener function's "this".
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 删除特定事件类型的侦听器。
         * @param type - 事件类型。
         * @param listener - 事件侦听器。
         * @param thisObject - 侦听函数绑定的 this 对象。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        removeDBEventListener(type: EventStringType, listener: Function, thisObject: any): void;
        /**
         * - Deprecated, please refer to {@link #hasDBEventListener()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #hasDBEventListener()}。
         * @deprecated
         * @language zh_CN
         */
        hasEvent(type: EventStringType): boolean;
        /**
         * - Deprecated, please refer to {@link #addDBEventListener()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #addDBEventListener()}。
         * @deprecated
         * @language zh_CN
         */
        addEvent(type: EventStringType, listener: Function, thisObject: any): void;
        /**
         * - Deprecated, please refer to {@link #removeDBEventListener()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #removeDBEventListener()}。
         * @deprecated
         * @language zh_CN
         */
        removeEvent(type: EventStringType, listener: Function, thisObject: any): void;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * @internal
     * @private
     */
    abstract class DataParser {
        protected static readonly DATA_VERSION_2_3: string;
        protected static readonly DATA_VERSION_3_0: string;
        protected static readonly DATA_VERSION_4_0: string;
        protected static readonly DATA_VERSION_4_5: string;
        protected static readonly DATA_VERSION_5_0: string;
        protected static readonly DATA_VERSION_5_5: string;
        protected static readonly DATA_VERSION: string;
        protected static readonly DATA_VERSIONS: Array<string>;
        protected static readonly TEXTURE_ATLAS: string;
        protected static readonly SUB_TEXTURE: string;
        protected static readonly FORMAT: string;
        protected static readonly IMAGE_PATH: string;
        protected static readonly WIDTH: string;
        protected static readonly HEIGHT: string;
        protected static readonly ROTATED: string;
        protected static readonly FRAME_X: string;
        protected static readonly FRAME_Y: string;
        protected static readonly FRAME_WIDTH: string;
        protected static readonly FRAME_HEIGHT: string;
        protected static readonly DRADON_BONES: string;
        protected static readonly USER_DATA: string;
        protected static readonly ARMATURE: string;
        protected static readonly BONE: string;
        protected static readonly SURFACE: string;
        protected static readonly SLOT: string;
        protected static readonly CONSTRAINT: string;
        protected static readonly IK: string;
        protected static readonly SKIN: string;
        protected static readonly DISPLAY: string;
        protected static readonly ANIMATION: string;
        protected static readonly Z_ORDER: string;
        protected static readonly FFD: string;
        protected static readonly FRAME: string;
        protected static readonly TRANSLATE_FRAME: string;
        protected static readonly ROTATE_FRAME: string;
        protected static readonly SCALE_FRAME: string;
        protected static readonly DISPLAY_FRAME: string;
        protected static readonly COLOR_FRAME: string;
        protected static readonly DEFAULT_ACTIONS: string;
        protected static readonly ACTIONS: string;
        protected static readonly EVENTS: string;
        protected static readonly INTS: string;
        protected static readonly FLOATS: string;
        protected static readonly STRINGS: string;
        protected static readonly CANVAS: string;
        protected static readonly TRANSFORM: string;
        protected static readonly PIVOT: string;
        protected static readonly AABB: string;
        protected static readonly COLOR: string;
        protected static readonly VERSION: string;
        protected static readonly COMPATIBLE_VERSION: string;
        protected static readonly FRAME_RATE: string;
        protected static readonly TYPE: string;
        protected static readonly SUB_TYPE: string;
        protected static readonly NAME: string;
        protected static readonly PARENT: string;
        protected static readonly TARGET: string;
        protected static readonly STAGE: string;
        protected static readonly SHARE: string;
        protected static readonly PATH: string;
        protected static readonly LENGTH: string;
        protected static readonly DISPLAY_INDEX: string;
        protected static readonly BLEND_MODE: string;
        protected static readonly INHERIT_TRANSLATION: string;
        protected static readonly INHERIT_ROTATION: string;
        protected static readonly INHERIT_SCALE: string;
        protected static readonly INHERIT_REFLECTION: string;
        protected static readonly INHERIT_ANIMATION: string;
        protected static readonly INHERIT_DEFORM: string;
        protected static readonly SEGMENT_X: string;
        protected static readonly SEGMENT_Y: string;
        protected static readonly BEND_POSITIVE: string;
        protected static readonly CHAIN: string;
        protected static readonly WEIGHT: string;
        protected static readonly FADE_IN_TIME: string;
        protected static readonly PLAY_TIMES: string;
        protected static readonly SCALE: string;
        protected static readonly OFFSET: string;
        protected static readonly POSITION: string;
        protected static readonly DURATION: string;
        protected static readonly TWEEN_EASING: string;
        protected static readonly TWEEN_ROTATE: string;
        protected static readonly TWEEN_SCALE: string;
        protected static readonly CLOCK_WISE: string;
        protected static readonly CURVE: string;
        protected static readonly SOUND: string;
        protected static readonly EVENT: string;
        protected static readonly ACTION: string;
        protected static readonly X: string;
        protected static readonly Y: string;
        protected static readonly SKEW_X: string;
        protected static readonly SKEW_Y: string;
        protected static readonly SCALE_X: string;
        protected static readonly SCALE_Y: string;
        protected static readonly VALUE: string;
        protected static readonly ROTATE: string;
        protected static readonly SKEW: string;
        protected static readonly ALPHA_OFFSET: string;
        protected static readonly RED_OFFSET: string;
        protected static readonly GREEN_OFFSET: string;
        protected static readonly BLUE_OFFSET: string;
        protected static readonly ALPHA_MULTIPLIER: string;
        protected static readonly RED_MULTIPLIER: string;
        protected static readonly GREEN_MULTIPLIER: string;
        protected static readonly BLUE_MULTIPLIER: string;
        protected static readonly UVS: string;
        protected static readonly VERTICES: string;
        protected static readonly TRIANGLES: string;
        protected static readonly WEIGHTS: string;
        protected static readonly SLOT_POSE: string;
        protected static readonly BONE_POSE: string;
        protected static readonly GLUE_WEIGHTS: string;
        protected static readonly GLUE_MESHES: string;
        protected static readonly GOTO_AND_PLAY: string;
        protected static readonly DEFAULT_NAME: string;
        protected static _getArmatureType(value: string): ArmatureType;
        protected static _getBoneType(value: string): BoneType;
        protected static _getDisplayType(value: string): DisplayType;
        protected static _getBoundingBoxType(value: string): BoundingBoxType;
        protected static _getActionType(value: string): ActionType;
        protected static _getBlendMode(value: string): BlendMode;
        abstract parseDragonBonesData(rawData: any, scale: number): DragonBonesData | null;
        abstract parseTextureAtlasData(rawData: any, textureAtlasData: TextureAtlasData, scale: number): boolean;
        /**
         * - Deprecated, please refer to {@link dragonBones.BaseFactory#parsetTextureAtlasData()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link dragonBones.BaseFactory#parsetTextureAtlasData()}。
         * @deprecated
         * @language zh_CN
         */
        static parseDragonBonesData(rawData: any): DragonBonesData | null;
        /**
         * - Deprecated, please refer to {@link dragonBones.BaseFactory#parsetTextureAtlasData()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link dragonBones.BaseFactory#parsetTextureAtlasData()}。
         * @deprecated
         * @language zh_CN
         */
        static parseTextureAtlasData(rawData: any, scale?: number): any;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * @internal
     * @private
     */
    class ObjectDataParser extends DataParser {
        protected static _getBoolean(rawData: any, key: string, defaultValue: boolean): boolean;
        protected static _getNumber(rawData: any, key: string, defaultValue: number): number;
        protected static _getString(rawData: any, key: string, defaultValue: string): string;
        protected _rawTextureAtlasIndex: number;
        protected readonly _rawBones: Array<BoneData>;
        protected _data: DragonBonesData;
        protected _armature: ArmatureData;
        protected _bone: BoneData;
        protected _surface: SurfaceData;
        protected _slot: SlotData;
        protected _skin: SkinData;
        protected _mesh: MeshDisplayData;
        protected _animation: AnimationData;
        protected _timeline: TimelineData;
        protected _rawTextureAtlases: Array<any> | null;
        private _defaultColorOffset;
        private _prevClockwise;
        private _prevRotation;
        private readonly _helpMatrixA;
        private readonly _helpMatrixB;
        private readonly _helpTransform;
        private readonly _helpColorTransform;
        private readonly _helpPoint;
        private readonly _helpArray;
        private readonly _intArray;
        private readonly _floatArray;
        private readonly _frameIntArray;
        private readonly _frameFloatArray;
        private readonly _frameArray;
        private readonly _timelineArray;
        private readonly _cacheRawMeshes;
        private readonly _cacheMeshes;
        private readonly _actionFrames;
        private readonly _weightSlotPose;
        private readonly _weightBonePoses;
        private readonly _cacheBones;
        private readonly _slotChildActions;
        private _getCurvePoint(x1, y1, x2, y2, x3, y3, x4, y4, t, result);
        private _samplingEasingCurve(curve, samples);
        private _parseActionDataInFrame(rawData, frameStart, bone, slot);
        private _mergeActionFrame(rawData, frameStart, type, bone, slot);
        protected _parseArmature(rawData: any, scale: number): ArmatureData;
        protected _parseBone(rawData: any): BoneData;
        protected _parseIKConstraint(rawData: any): ConstraintData | null;
        protected _parseSlot(rawData: any, zOrder: number): SlotData;
        protected _parseSkin(rawData: any): SkinData;
        protected _parseDisplay(rawData: any): DisplayData | null;
        protected _parsePivot(rawData: any, display: ImageDisplayData): void;
        protected _parseMesh(rawData: any, mesh: MeshDisplayData): void;
        protected _parseMeshGlue(rawData: any, mesh: MeshDisplayData): void;
        protected _parseBoundingBox(rawData: any): BoundingBoxData | null;
        protected _parsePolygonBoundingBox(rawData: any): PolygonBoundingBoxData;
        protected _parseAnimation(rawData: any): AnimationData;
        protected _parseTimeline(rawData: any, rawFrames: Array<any> | null, framesKey: string, type: TimelineType, addIntOffset: boolean, addFloatOffset: boolean, frameValueCount: number, frameParser: (rawData: any, frameStart: number, frameCount: number) => number): TimelineData | null;
        protected _parseBoneTimeline(rawData: any): void;
        protected _parseSlotTimeline(rawData: any): void;
        protected _parseFrame(rawData: any, frameStart: number, frameCount: number): number;
        protected _parseTweenFrame(rawData: any, frameStart: number, frameCount: number): number;
        protected _parseActionFrame(frame: ActionFrame, frameStart: number, frameCount: number): number;
        protected _parseZOrderFrame(rawData: any, frameStart: number, frameCount: number): number;
        protected _parseBoneAllFrame(rawData: any, frameStart: number, frameCount: number): number;
        protected _parseBoneTranslateFrame(rawData: any, frameStart: number, frameCount: number): number;
        protected _parseBoneRotateFrame(rawData: any, frameStart: number, frameCount: number): number;
        protected _parseBoneScaleFrame(rawData: any, frameStart: number, frameCount: number): number;
        protected _parseSurfaceFrame(rawData: any, frameStart: number, frameCount: number): number;
        protected _parseSlotDisplayFrame(rawData: any, frameStart: number, frameCount: number): number;
        protected _parseSlotColorFrame(rawData: any, frameStart: number, frameCount: number): number;
        protected _parseSlotFFDFrame(rawData: any, frameStart: number, frameCount: number): number;
        protected _parseIKConstraintFrame(rawData: any, frameStart: number, frameCount: number): number;
        protected _parseAnimationFrame(rawData: any, frameStart: number, frameCount: number): number;
        protected _parseActionData(rawData: any, type: ActionType, bone: BoneData | null, slot: SlotData | null): Array<ActionData>;
        protected _parseTransform(rawData: any, transform: Transform, scale: number): void;
        protected _parseColorTransform(rawData: any, color: ColorTransform): void;
        protected _parseArray(rawData: any): void;
        protected _modifyArray(): void;
        parseDragonBonesData(rawData: any, scale?: number): DragonBonesData | null;
        parseTextureAtlasData(rawData: any, textureAtlasData: TextureAtlasData, scale?: number): boolean;
        private static _objectDataParserInstance;
        /**
         * - Deprecated, please refer to {@link dragonBones.BaseFactory#parseDragonBonesData()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link dragonBones.BaseFactory#parseDragonBonesData()}。
         * @deprecated
         * @language zh_CN
         */
        static getInstance(): ObjectDataParser;
    }
    /**
     * @internal
     * @private
     */
    class ActionFrame {
        frameStart: number;
        readonly actions: Array<number>;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * @internal
     * @private
     */
    class BinaryDataParser extends ObjectDataParser {
        private _binaryOffset;
        private _binary;
        private _intArrayBuffer;
        private _floatArrayBuffer;
        private _frameIntArrayBuffer;
        private _frameFloatArrayBuffer;
        private _frameArrayBuffer;
        private _timelineArrayBuffer;
        private _inRange(a, min, max);
        private _decodeUTF8(data);
        private _getUTF16Key(value);
        private _parseBinaryTimeline(type, offset, timelineData?);
        protected _parseMesh(rawData: any, mesh: MeshDisplayData): void;
        protected _parseAnimation(rawData: any): AnimationData;
        protected _parseArray(rawData: any): void;
        parseDragonBonesData(rawData: any, scale?: number): DragonBonesData | null;
        private static _binaryDataParserInstance;
        /**
         * - Deprecated, please refer to {@link dragonBones.BaseFactory#parseDragonBonesData()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link dragonBones.BaseFactory#parseDragonBonesData()}。
         * @deprecated
         * @language zh_CN
         */
        static getInstance(): BinaryDataParser;
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare namespace dragonBones {
    /**
     * - Base class for the factory that create the armatures. (Typically only one global factory instance is required)
     * The factory instance create armatures by parsed and added DragonBonesData instances and TextureAtlasData instances.
     * Once the data has been parsed, it has been cached in the factory instance and does not need to be parsed again until it is cleared by the factory instance.
     * @see dragonBones.DragonBonesData
     * @see dragonBones.TextureAtlasData
     * @see dragonBones.ArmatureData
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 创建骨架的工厂基类。 （通常只需要一个全局工厂实例）
     * 工厂通过解析并添加的 DragonBonesData 实例和 TextureAtlasData 实例来创建骨架。
     * 当数据被解析过之后，已经添加到工厂中，在没有被工厂清理之前，不需要再次解析。
     * @see dragonBones.DragonBonesData
     * @see dragonBones.TextureAtlasData
     * @see dragonBones.ArmatureData
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     * @language zh_CN
     */
    abstract class BaseFactory {
        /**
         * @private
         */
        protected static _objectParser: ObjectDataParser;
        /**
         * @private
         */
        protected static _binaryParser: BinaryDataParser;
        /**
         * @private
         */
        autoSearch: boolean;
        /**
         * @private
         */
        protected readonly _dragonBonesDataMap: Map<DragonBonesData>;
        /**
         * @private
         */
        protected readonly _textureAtlasDataMap: Map<Array<TextureAtlasData>>;
        /**
         * @private
         */
        protected _dragonBones: DragonBones;
        /**
         * @private
         */
        protected _dataParser: DataParser;
        /**
         * - Create a factory instance. (typically only one global factory instance is required)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 创建一个工厂实例。 （通常只需要一个全局工厂实例）
         * @version DragonBones 3.0
         * @language zh_CN
         */
        constructor(dataParser?: DataParser | null);
        /**
         * @private
         */
        protected _isSupportMesh(): boolean;
        /**
         * @private
         */
        protected _getTextureData(textureAtlasName: string, textureName: string): TextureData | null;
        /**
         * @private
         */
        protected _fillBuildArmaturePackage(dataPackage: BuildArmaturePackage, dragonBonesName: string, armatureName: string, skinName: string, textureAtlasName: string): boolean;
        /**
         * @private
         */
        protected _buildBones(dataPackage: BuildArmaturePackage, armature: Armature): void;
        /**
         * @private
         */
        protected _buildSlots(dataPackage: BuildArmaturePackage, armature: Armature): void;
        /**
         * @private
         */
        protected _buildChildArmature(dataPackage: BuildArmaturePackage | null, slot: Slot, displayData: DisplayData): Armature | null;
        /**
         * @private
         */
        protected _getSlotDisplay(dataPackage: BuildArmaturePackage | null, displayData: DisplayData, rawDisplayData: DisplayData | null, slot: Slot): any;
        /**
         * @private
         */
        protected abstract _buildTextureAtlasData(textureAtlasData: TextureAtlasData | null, textureAtlas: any): TextureAtlasData;
        /**
         * @private
         */
        protected abstract _buildArmature(dataPackage: BuildArmaturePackage): Armature;
        /**
         * @private
         */
        protected abstract _buildSlot(dataPackage: BuildArmaturePackage, slotData: SlotData, displays: Array<DisplayData | null> | null, armature: Armature): Slot;
        /**
         * - Parse the raw data to a DragonBonesData instance and cache it to the factory.
         * @param rawData - The raw data.
         * @param name - Specify a cache name for the instance so that the instance can be obtained through this name. (If not set, use the instance name instead)
         * @param scale - Specify a scaling value for all armatures. (Default: 1.0)
         * @returns DragonBonesData instance
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 将原始数据解析为 DragonBonesData 实例，并缓存到工厂中。
         * @param rawData - 原始数据。
         * @param name - 为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
         * @param scale - 为所有的骨架指定一个缩放值。 （默认: 1.0）
         * @returns DragonBonesData 实例
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        parseDragonBonesData(rawData: any, name?: string | null, scale?: number): DragonBonesData | null;
        /**
         * - Parse the raw texture atlas data and the texture atlas object to a TextureAtlasData instance and cache it to the factory.
         * @param rawData - The raw texture atlas data.
         * @param textureAtlas - The texture atlas object.
         * @param name - Specify a cache name for the instance so that the instance can be obtained through this name. (If not set, use the instance name instead)
         * @param scale - Specify a scaling value for the map set. (Default: 1.0)
         * @returns TextureAtlasData instance
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 将原始贴图集数据和贴图集对象解析为 TextureAtlasData 实例，并缓存到工厂中。
         * @param rawData - 原始贴图集数据。
         * @param textureAtlas - 贴图集对象。
         * @param name - 为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
         * @param scale - 为贴图集指定一个缩放值。 （默认: 1.0）
         * @returns TextureAtlasData 实例
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        parseTextureAtlasData(rawData: any, textureAtlas: any, name?: string | null, scale?: number): TextureAtlasData;
        /**
         * @private
         */
        updateTextureAtlasData(name: string, textureAtlases: Array<any>): void;
        /**
         * - Get a specific DragonBonesData instance.
         * @param name - The DragonBonesData instance cache name.
         * @returns DragonBonesData instance
         * @see #parseDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定的 DragonBonesData 实例。
         * @param name - DragonBonesData 实例的缓存名称。
         * @returns DragonBonesData 实例
         * @see #parseDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getDragonBonesData(name: string): DragonBonesData | null;
        /**
         * - Cache a DragonBonesData instance to the factory.
         * @param data - The DragonBonesData instance.
         * @param name - Specify a cache name for the instance so that the instance can be obtained through this name. (if not set, use the instance name instead)
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 将 DragonBonesData 实例缓存到工厂中。
         * @param data - DragonBonesData 实例。
         * @param name - 为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        addDragonBonesData(data: DragonBonesData, name?: string | null): void;
        /**
         * - Remove a DragonBonesData instance.
         * @param name - The DragonBonesData instance cache name.
         * @param disposeData - Whether to dispose data. (Default: true)
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 移除 DragonBonesData 实例。
         * @param name - DragonBonesData 实例缓存名称。
         * @param disposeData - 是否释放数据。 （默认: true）
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        removeDragonBonesData(name: string, disposeData?: boolean): void;
        /**
         * - Get a list of specific TextureAtlasData instances.
         * @param name - The TextureAtlasData cahce name.
         * @see #parseTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定的 TextureAtlasData 实例列表。
         * @param name - TextureAtlasData 实例缓存名称。
         * @see #parseTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getTextureAtlasData(name: string): Array<TextureAtlasData> | null;
        /**
         * - Cache a TextureAtlasData instance to the factory.
         * @param data - The TextureAtlasData instance.
         * @param name - Specify a cache name for the instance so that the instance can be obtained through this name. (if not set, use the instance name instead)
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 将 TextureAtlasData 实例缓存到工厂中。
         * @param data - TextureAtlasData 实例。
         * @param name - 为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        addTextureAtlasData(data: TextureAtlasData, name?: string | null): void;
        /**
         * - Remove a TextureAtlasData instance.
         * @param name - The TextureAtlasData instance cache name.
         * @param disposeData - Whether to dispose data.
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 移除 TextureAtlasData 实例。
         * @param name - TextureAtlasData 实例的缓存名称。
         * @param disposeData - 是否释放数据。
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        removeTextureAtlasData(name: string, disposeData?: boolean): void;
        /**
         * - Get a specific armature data.
         * @param name - The armature data name.
         * @param dragonBonesName - The cached name for DragonbonesData instance.
         * @see dragonBones.ArmatureData
         * @version DragonBones 5.1
         * @language en_US
         */
        /**
         * - 获取特定的骨架数据。
         * @param name - 骨架数据名称。
         * @param dragonBonesName - DragonBonesData 实例的缓存名称。
         * @see dragonBones.ArmatureData
         * @version DragonBones 5.1
         * @language zh_CN
         */
        getArmatureData(name: string, dragonBonesName?: string): ArmatureData | null;
        /**
         * - Clear all cached DragonBonesData instances and TextureAtlasData instances.
         * @param disposeData - Whether to dispose data.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 清除缓存的所有 DragonBonesData 实例和 TextureAtlasData 实例。
         * @param disposeData - 是否释放数据。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        clear(disposeData?: boolean): void;
        /**
         * - Create a armature from cached DragonBonesData instances and TextureAtlasData instances.
         * @param armatureName - The armature data name.
         * @param dragonBonesName - The cached name of the DragonBonesData instance. (If not set, all DragonBonesData instances are retrieved, and when multiple DragonBonesData instances contain a the same name armature data, it may not be possible to accurately create a specific armature)
         * @param skinName - The skin name, you can set a different ArmatureData name to share it's skin data. (If not set, use the default skin data)
         * @returns The armature.
         * @example
         * <pre>
         *     let armature = factory.buildArmature("armatureName", "dragonBonesName");
         *     armature.clock = factory.clock;
         * </pre>
         * @see dragonBones.DragonBonesData
         * @see dragonBones.ArmatureData
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 通过缓存的 DragonBonesData 实例和 TextureAtlasData 实例创建一个骨架。
         * @param armatureName - 骨架数据名称。
         * @param dragonBonesName - DragonBonesData 实例的缓存名称。 （如果未设置，将检索所有的 DragonBonesData 实例，当多个 DragonBonesData 实例中包含同名的骨架数据时，可能无法准确的创建出特定的骨架）
         * @param skinName - 皮肤名称，可以设置一个其他骨架数据名称来共享其皮肤数据（如果未设置，则使用默认的皮肤数据）。
         * @returns 骨架。
         * @example
         * <pre>
         *     let armature = factory.buildArmature("armatureName", "dragonBonesName");
         *     armature.clock = factory.clock;
         * </pre>
         * @see dragonBones.DragonBonesData
         * @see dragonBones.ArmatureData
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         * @language zh_CN
         */
        buildArmature(armatureName: string, dragonBonesName?: string, skinName?: string, textureAtlasName?: string): Armature | null;
        /**
         * @private
         */
        replaceDisplay(slot: Slot, displayData: DisplayData, displayIndex?: number): void;
        /**
         * - Replaces the current display data for a particular slot with a specific display data.
         * Specify display data with "dragonBonesName/armatureName/slotName/displayName".
         * @param dragonBonesName - The DragonBonesData instance cache name.
         * @param armatureName - The armature data name.
         * @param slotName - The slot data name.
         * @param displayName - The display data name.
         * @param slot - The slot.
         * @param displayIndex - The index of the display data that is replaced. (If it is not set, replaces the current display data)
         * @example
         * <pre>
         *     let slot = armature.getSlot("weapon");
         *     factory.replaceSlotDisplay("dragonBonesName", "armatureName", "slotName", "displayName", slot);
         * </pre>
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 用特定的显示对象数据替换特定插槽当前的显示对象数据。
         * 用 "dragonBonesName/armatureName/slotName/displayName" 指定显示对象数据。
         * @param dragonBonesName - DragonBonesData 实例的缓存名称。
         * @param armatureName - 骨架数据名称。
         * @param slotName - 插槽数据名称。
         * @param displayName - 显示对象数据名称。
         * @param slot - 插槽。
         * @param displayIndex - 被替换的显示对象数据的索引。 （如果未设置，则替换当前的显示对象数据）
         * @example
         * <pre>
         *     let slot = armature.getSlot("weapon");
         *     factory.replaceSlotDisplay("dragonBonesName", "armatureName", "slotName", "displayName", slot);
         * </pre>
         * @version DragonBones 4.5
         * @language zh_CN
         */
        replaceSlotDisplay(dragonBonesName: string, armatureName: string, slotName: string, displayName: string, slot: Slot, displayIndex?: number): boolean;
        /**
         * @private
         */
        replaceSlotDisplayList(dragonBonesName: string | null, armatureName: string, slotName: string, slot: Slot): boolean;
        /**
         * - Share specific skin data with specific armature.
         * @param armature - The armature.
         * @param skin - The skin data.
         * @param isOverride - Whether it completely override the original skin. (Default: false)
         * @param exclude - A list of slot names that do not need to be replace.
         * @example
         * <pre>
         *     let armatureA = factory.buildArmature("armatureA", "dragonBonesA");
         *     let armatureDataB = factory.getArmatureData("armatureB", "dragonBonesB");
         *     if (armatureDataB && armatureDataB.defaultSkin) {
         *     factory.replaceSkin(armatureA, armatureDataB.defaultSkin, false, ["arm_l", "weapon_l"]);
         *     }
         * </pre>
         * @see dragonBones.Armature
         * @see dragonBones.SkinData
         * @version DragonBones 5.6
         * @language en_US
         */
        /**
         * - 将特定的皮肤数据共享给特定的骨架使用。
         * @param armature - 骨架。
         * @param skin - 皮肤数据。
         * @param isOverride - 是否完全覆盖原来的皮肤。 （默认: false）
         * @param exclude - 不需要被替换的插槽名称列表。
         * @example
         * <pre>
         *     let armatureA = factory.buildArmature("armatureA", "dragonBonesA");
         *     let armatureDataB = factory.getArmatureData("armatureB", "dragonBonesB");
         *     if (armatureDataB && armatureDataB.defaultSkin) {
         *     factory.replaceSkin(armatureA, armatureDataB.defaultSkin, false, ["arm_l", "weapon_l"]);
         *     }
         * </pre>
         * @see dragonBones.Armature
         * @see dragonBones.SkinData
         * @version DragonBones 5.6
         * @language zh_CN
         */
        replaceSkin(armature: Armature, skin: SkinData, isOverride?: boolean, exclude?: Array<string> | null): boolean;
        /**
         * - Replaces the existing animation data for a specific armature with the animation data for the specific armature data.
         * This enables you to make a armature template so that other armature without animations can share it's animations.
         * @param armature - The armtaure.
         * @param armatureData - The armature data.
         * @param isOverride - Whether to completely overwrite the original animation. (Default: false)
         * @example
         * <pre>
         *     let armatureA = factory.buildArmature("armatureA", "dragonBonesA");
         *     let armatureDataB = factory.getArmatureData("armatureB", "dragonBonesB");
         *     if (armatureDataB) {
         *     factory.replaceAnimation(armatureA, armatureDataB);
         *     }
         * </pre>
         * @see dragonBones.Armature
         * @see dragonBones.ArmatureData
         * @version DragonBones 5.6
         * @language en_US
         */
        /**
         * - 用特定骨架数据的动画数据替换特定骨架现有的动画数据。
         * 这样就能实现制作一个骨架动画模板，让其他没有制作动画的骨架共享该动画。
         * @param armature - 骨架。
         * @param armatureData - 骨架数据。
         * @param isOverride - 是否完全覆盖原来的动画。（默认: false）。
         * @example
         * <pre>
         *     let armatureA = factory.buildArmature("armatureA", "dragonBonesA");
         *     let armatureDataB = factory.getArmatureData("armatureB", "dragonBonesB");
         *     if (armatureDataB) {
         *     factory.replaceAnimation(armatureA, armatureDataB);
         *     }
         * </pre>
         * @see dragonBones.Armature
         * @see dragonBones.ArmatureData
         * @version DragonBones 5.6
         * @language zh_CN
         */
        replaceAnimation(armature: Armature, armatureData: ArmatureData, isOverride?: boolean): boolean;
        /**
         * @private
         */
        getAllDragonBonesData(): Map<DragonBonesData>;
        /**
         * @private
         */
        getAllTextureAtlasData(): Map<Array<TextureAtlasData>>;
        /**
         * - An Worldclock instance updated by engine.
         * @version DragonBones 5.7
         * @language en_US
         */
        /**
         * - 由引擎驱动的 WorldClock 实例。
         * @version DragonBones 5.7
         * @language zh_CN
         */
        readonly clock: WorldClock;
        /**
         * @private
         */
        readonly dragonBones: DragonBones;
        /**
         * - Deprecated, please refer to {@link #replaceSkin}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #replaceSkin}。
         * @deprecated
         * @language zh_CN
         */
        changeSkin(armature: Armature, skin: SkinData, exclude?: Array<string> | null): boolean;
        /**
         * - Deprecated, please refer to {@link #replaceAnimation}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #replaceAnimation}。
         * @deprecated
         * @language zh_CN
         */
        copyAnimationsToArmature(toArmature: Armature, fromArmatreName: string, fromSkinName?: string, fromDragonBonesDataName?: string, replaceOriginalAnimation?: boolean): boolean;
    }
    /**
     * @internal
     * @private
     */
    class BuildArmaturePackage {
        dataName: string;
        textureAtlasName: string;
        data: DragonBonesData;
        armature: ArmatureData;
        skin: SkinData | null;
    }
}

declare namespace sp.spine {
	class Animation {
		name: string;
		timelines: Array<Timeline>;
		timelineIds: Array<boolean>;
		duration: number;
		constructor(name: string, timelines: Array<Timeline>, duration: number);
		hasTimeline(id: number): boolean;
		apply(skeleton: Skeleton, lastTime: number, time: number, loop: boolean, events: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
		static binarySearch(values: ArrayLike<number>, target: number, step?: number): number;
		static linearSearch(values: ArrayLike<number>, target: number, step: number): number;
	}
	interface Timeline {
		apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
		getPropertyId(): number;
	}
	enum MixBlend {
		setup = 0,
		first = 1,
		replace = 2,
		add = 3
	}
	enum MixDirection {
		mixIn = 0,
		mixOut = 1
	}
	enum TimelineType {
		rotate = 0,
		translate = 1,
		scale = 2,
		shear = 3,
		attachment = 4,
		color = 5,
		deform = 6,
		event = 7,
		drawOrder = 8,
		ikConstraint = 9,
		transformConstraint = 10,
		pathConstraintPosition = 11,
		pathConstraintSpacing = 12,
		pathConstraintMix = 13,
		twoColor = 14
	}
	abstract class CurveTimeline implements Timeline {
		static LINEAR: number;
		static STEPPED: number;
		static BEZIER: number;
		static BEZIER_SIZE: number;
		private curves;
		abstract getPropertyId(): number;
		constructor(frameCount: number);
		getFrameCount(): number;
		setLinear(frameIndex: number): void;
		setStepped(frameIndex: number): void;
		getCurveType(frameIndex: number): number;
		setCurve(frameIndex: number, cx1: number, cy1: number, cx2: number, cy2: number): void;
		getCurvePercent(frameIndex: number, percent: number): number;
		abstract apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
	}
	class RotateTimeline extends CurveTimeline {
		static ENTRIES: number;
		static PREV_TIME: number;
		static PREV_ROTATION: number;
		static ROTATION: number;
		boneIndex: number;
		frames: ArrayLike<number>;
		constructor(frameCount: number);
		getPropertyId(): number;
		setFrame(frameIndex: number, time: number, degrees: number): void;
		apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
	}
	class TranslateTimeline extends CurveTimeline {
		static ENTRIES: number;
		static PREV_TIME: number;
		static PREV_X: number;
		static PREV_Y: number;
		static X: number;
		static Y: number;
		boneIndex: number;
		frames: ArrayLike<number>;
		constructor(frameCount: number);
		getPropertyId(): number;
		setFrame(frameIndex: number, time: number, x: number, y: number): void;
		apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
	}
	class ScaleTimeline extends TranslateTimeline {
		constructor(frameCount: number);
		getPropertyId(): number;
		apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
	}
	class ShearTimeline extends TranslateTimeline {
		constructor(frameCount: number);
		getPropertyId(): number;
		apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
	}
	class ColorTimeline extends CurveTimeline {
		static ENTRIES: number;
		static PREV_TIME: number;
		static PREV_R: number;
		static PREV_G: number;
		static PREV_B: number;
		static PREV_A: number;
		static R: number;
		static G: number;
		static B: number;
		static A: number;
		slotIndex: number;
		frames: ArrayLike<number>;
		constructor(frameCount: number);
		getPropertyId(): number;
		setFrame(frameIndex: number, time: number, r: number, g: number, b: number, a: number): void;
		apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
	}
	class TwoColorTimeline extends CurveTimeline {
		static ENTRIES: number;
		static PREV_TIME: number;
		static PREV_R: number;
		static PREV_G: number;
		static PREV_B: number;
		static PREV_A: number;
		static PREV_R2: number;
		static PREV_G2: number;
		static PREV_B2: number;
		static R: number;
		static G: number;
		static B: number;
		static A: number;
		static R2: number;
		static G2: number;
		static B2: number;
		slotIndex: number;
		frames: ArrayLike<number>;
		constructor(frameCount: number);
		getPropertyId(): number;
		setFrame(frameIndex: number, time: number, r: number, g: number, b: number, a: number, r2: number, g2: number, b2: number): void;
		apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
	}
	class AttachmentTimeline implements Timeline {
		slotIndex: number;
		frames: ArrayLike<number>;
		attachmentNames: Array<string>;
		constructor(frameCount: number);
		getPropertyId(): number;
		getFrameCount(): number;
		setFrame(frameIndex: number, time: number, attachmentName: string): void;
		apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
	}
	class DeformTimeline extends CurveTimeline {
		slotIndex: number;
		attachment: VertexAttachment;
		frames: ArrayLike<number>;
		frameVertices: Array<ArrayLike<number>>;
		constructor(frameCount: number);
		getPropertyId(): number;
		setFrame(frameIndex: number, time: number, vertices: ArrayLike<number>): void;
		apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
	}
	class EventTimeline implements Timeline {
		frames: ArrayLike<number>;
		events: Array<Event>;
		constructor(frameCount: number);
		getPropertyId(): number;
		getFrameCount(): number;
		setFrame(frameIndex: number, event: Event): void;
		apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
	}
	class DrawOrderTimeline implements Timeline {
		frames: ArrayLike<number>;
		drawOrders: Array<Array<number>>;
		constructor(frameCount: number);
		getPropertyId(): number;
		getFrameCount(): number;
		setFrame(frameIndex: number, time: number, drawOrder: Array<number>): void;
		apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
	}
	class IkConstraintTimeline extends CurveTimeline {
		static ENTRIES: number;
		static PREV_TIME: number;
		static PREV_MIX: number;
		static PREV_SOFTNESS: number;
		static PREV_BEND_DIRECTION: number;
		static PREV_COMPRESS: number;
		static PREV_STRETCH: number;
		static MIX: number;
		static SOFTNESS: number;
		static BEND_DIRECTION: number;
		static COMPRESS: number;
		static STRETCH: number;
		ikConstraintIndex: number;
		frames: ArrayLike<number>;
		constructor(frameCount: number);
		getPropertyId(): number;
		setFrame(frameIndex: number, time: number, mix: number, softness: number, bendDirection: number, compress: boolean, stretch: boolean): void;
		apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
	}
	class TransformConstraintTimeline extends CurveTimeline {
		static ENTRIES: number;
		static PREV_TIME: number;
		static PREV_ROTATE: number;
		static PREV_TRANSLATE: number;
		static PREV_SCALE: number;
		static PREV_SHEAR: number;
		static ROTATE: number;
		static TRANSLATE: number;
		static SCALE: number;
		static SHEAR: number;
		transformConstraintIndex: number;
		frames: ArrayLike<number>;
		constructor(frameCount: number);
		getPropertyId(): number;
		setFrame(frameIndex: number, time: number, rotateMix: number, translateMix: number, scaleMix: number, shearMix: number): void;
		apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
	}
	class PathConstraintPositionTimeline extends CurveTimeline {
		static ENTRIES: number;
		static PREV_TIME: number;
		static PREV_VALUE: number;
		static VALUE: number;
		pathConstraintIndex: number;
		frames: ArrayLike<number>;
		constructor(frameCount: number);
		getPropertyId(): number;
		setFrame(frameIndex: number, time: number, value: number): void;
		apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
	}
	class PathConstraintSpacingTimeline extends PathConstraintPositionTimeline {
		constructor(frameCount: number);
		getPropertyId(): number;
		apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
	}
	class PathConstraintMixTimeline extends CurveTimeline {
		static ENTRIES: number;
		static PREV_TIME: number;
		static PREV_ROTATE: number;
		static PREV_TRANSLATE: number;
		static ROTATE: number;
		static TRANSLATE: number;
		pathConstraintIndex: number;
		frames: ArrayLike<number>;
		constructor(frameCount: number);
		getPropertyId(): number;
		setFrame(frameIndex: number, time: number, rotateMix: number, translateMix: number): void;
		apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number, blend: MixBlend, direction: MixDirection): void;
	}
}
declare namespace sp.spine {
	class AnimationState {
		static emptyAnimation: Animation;
		static SUBSEQUENT: number;
		static FIRST: number;
		static HOLD: number;
		static HOLD_MIX: number;
		static NOT_LAST: number;
		data: AnimationStateData;
		tracks: TrackEntry[];
		timeScale: number;
		events: Event[];
		listeners: AnimationStateListener[];
		queue: EventQueue;
		propertyIDs: IntSet;
		animationsChanged: boolean;
		trackEntryPool: Pool<TrackEntry>;
		constructor(data: AnimationStateData);
		update(delta: number): void;
		updateMixingFrom(to: TrackEntry, delta: number): boolean;
		apply(skeleton: Skeleton): boolean;
		applyMixingFrom(to: TrackEntry, skeleton: Skeleton, blend: MixBlend): number;
		applyRotateTimeline(timeline: Timeline, skeleton: Skeleton, time: number, alpha: number, blend: MixBlend, timelinesRotation: Array<number>, i: number, firstFrame: boolean): void;
		queueEvents(entry: TrackEntry, animationTime: number): void;
		clearTracks(): void;
		clearTrack(trackIndex: number): void;
		setCurrent(index: number, current: TrackEntry, interrupt: boolean): void;
		setAnimation(trackIndex: number, animationName: string, loop: boolean): TrackEntry;
		setAnimationWith(trackIndex: number, animation: Animation, loop: boolean): TrackEntry;
		addAnimation(trackIndex: number, animationName: string, loop: boolean, delay: number): TrackEntry;
		addAnimationWith(trackIndex: number, animation: Animation, loop: boolean, delay: number): TrackEntry;
		setEmptyAnimation(trackIndex: number, mixDuration: number): TrackEntry;
		addEmptyAnimation(trackIndex: number, mixDuration: number, delay: number): TrackEntry;
		setEmptyAnimations(mixDuration: number): void;
		expandToIndex(index: number): TrackEntry;
		trackEntry(trackIndex: number, animation: Animation, loop: boolean, last: TrackEntry): TrackEntry;
		disposeNext(entry: TrackEntry): void;
		_animationsChanged(): void;
		computeHold(entry: TrackEntry): void;
		computeNotLast(entry: TrackEntry): void;
		getCurrent(trackIndex: number): TrackEntry;
		addListener(listener: AnimationStateListener): void;
		removeListener(listener: AnimationStateListener): void;
		clearListeners(): void;
		clearListenerNotifications(): void;
	}
	class TrackEntry {
		animation: Animation;
		next: TrackEntry;
		mixingFrom: TrackEntry;
		mixingTo: TrackEntry;
		listener: AnimationStateListener;
		trackIndex: number;
		loop: boolean;
		holdPrevious: boolean;
		eventThreshold: number;
		attachmentThreshold: number;
		drawOrderThreshold: number;
		animationStart: number;
		animationEnd: number;
		animationLast: number;
		nextAnimationLast: number;
		delay: number;
		trackTime: number;
		trackLast: number;
		nextTrackLast: number;
		trackEnd: number;
		timeScale: number;
		alpha: number;
		mixTime: number;
		mixDuration: number;
		interruptAlpha: number;
		totalAlpha: number;
		mixBlend: MixBlend;
		timelineMode: number[];
		timelineHoldMix: TrackEntry[];
		timelinesRotation: number[];
		reset(): void;
		getAnimationTime(): number;
		setAnimationLast(animationLast: number): void;
		isComplete(): boolean;
		resetRotationDirections(): void;
	}
	class EventQueue {
		objects: Array<any>;
		drainDisabled: boolean;
		animState: AnimationState;
		constructor(animState: AnimationState);
		start(entry: TrackEntry): void;
		interrupt(entry: TrackEntry): void;
		end(entry: TrackEntry): void;
		dispose(entry: TrackEntry): void;
		complete(entry: TrackEntry): void;
		event(entry: TrackEntry, event: Event): void;
		drain(): void;
		clear(): void;
	}
	enum EventType {
		start = 0,
		interrupt = 1,
		end = 2,
		dispose = 3,
		complete = 4,
		event = 5
	}
	interface AnimationStateListener {
		start(entry: TrackEntry): void;
		interrupt(entry: TrackEntry): void;
		end(entry: TrackEntry): void;
		dispose(entry: TrackEntry): void;
		complete(entry: TrackEntry): void;
		event(entry: TrackEntry, event: Event): void;
	}
	abstract class AnimationStateAdapter implements AnimationStateListener {
		start(entry: TrackEntry): void;
		interrupt(entry: TrackEntry): void;
		end(entry: TrackEntry): void;
		dispose(entry: TrackEntry): void;
		complete(entry: TrackEntry): void;
		event(entry: TrackEntry, event: Event): void;
	}
}
declare namespace sp.spine {
	class AnimationStateData {
		skeletonData: SkeletonData;
		animationToMixTime: Map<number>;
		defaultMix: number;
		constructor(skeletonData: SkeletonData);
		setMix(fromName: string, toName: string, duration: number): void;
		setMixWith(from: Animation, to: Animation, duration: number): void;
		getMix(from: Animation, to: Animation): number;
	}
}
declare namespace sp.spine {
	class AssetManager implements Disposable {
		private pathPrefix;
		private textureLoader;
		private assets;
		private errors;
		private toLoad;
		private loaded;
		constructor(textureLoader: (image: HTMLImageElement) => any, pathPrefix?: string);
		private static downloadText;
		private static downloadBinary;
		loadBinary(path: string, success?: (path: string, binary: Uint8Array) => void, error?: (path: string, error: string) => void): void;
		loadText(path: string, success?: (path: string, text: string) => void, error?: (path: string, error: string) => void): void;
		loadTexture(path: string, success?: (path: string, image: HTMLImageElement) => void, error?: (path: string, error: string) => void): void;
		loadTextureData(path: string, data: string, success?: (path: string, image: HTMLImageElement) => void, error?: (path: string, error: string) => void): void;
		loadTextureAtlas(path: string, success?: (path: string, atlas: TextureAtlas) => void, error?: (path: string, error: string) => void): void;
		get(path: string): any;
		remove(path: string): void;
		removeAll(): void;
		isLoadingComplete(): boolean;
		getToLoad(): number;
		getLoaded(): number;
		dispose(): void;
		hasErrors(): boolean;
		getErrors(): Map<string>;
	}
}
declare namespace sp.spine {
	class AtlasAttachmentLoader implements AttachmentLoader {
		atlas: TextureAtlas;
		constructor(atlas: TextureAtlas);
		newRegionAttachment(skin: Skin, name: string, path: string): RegionAttachment;
		newMeshAttachment(skin: Skin, name: string, path: string): MeshAttachment;
		newBoundingBoxAttachment(skin: Skin, name: string): BoundingBoxAttachment;
		newPathAttachment(skin: Skin, name: string): PathAttachment;
		newPointAttachment(skin: Skin, name: string): PointAttachment;
		newClippingAttachment(skin: Skin, name: string): ClippingAttachment;
	}
}
declare namespace sp.spine {
	enum BlendMode {
		Normal = 0,
		Additive = 1,
		Multiply = 2,
		Screen = 3
	}
}
declare namespace sp.spine {
	class Bone implements Updatable {
		data: BoneData;
		skeleton: Skeleton;
		parent: Bone;
		children: Bone[];
		x: number;
		y: number;
		rotation: number;
		scaleX: number;
		scaleY: number;
		shearX: number;
		shearY: number;
		ax: number;
		ay: number;
		arotation: number;
		ascaleX: number;
		ascaleY: number;
		ashearX: number;
		ashearY: number;
		appliedValid: boolean;
		a: number;
		b: number;
		c: number;
		d: number;
		worldY: number;
		worldX: number;
		sorted: boolean;
		active: boolean;
		constructor(data: BoneData, skeleton: Skeleton, parent: Bone);
		isActive(): boolean;
		update(): void;
		updateWorldTransform(): void;
		updateWorldTransformWith(x: number, y: number, rotation: number, scaleX: number, scaleY: number, shearX: number, shearY: number): void;
		setToSetupPose(): void;
		getWorldRotationX(): number;
		getWorldRotationY(): number;
		getWorldScaleX(): number;
		getWorldScaleY(): number;
		updateAppliedTransform(): void;
		worldToLocal(world: Vector2): Vector2;
		localToWorld(local: Vector2): Vector2;
		worldToLocalRotation(worldRotation: number): number;
		localToWorldRotation(localRotation: number): number;
		rotateWorld(degrees: number): void;
	}
}
declare namespace sp.spine {
	class BoneData {
		index: number;
		name: string;
		parent: BoneData;
		length: number;
		x: number;
		y: number;
		rotation: number;
		scaleX: number;
		scaleY: number;
		shearX: number;
		shearY: number;
		transformMode: TransformMode;
		skinRequired: boolean;
		color: Color;
		constructor(index: number, name: string, parent: BoneData);
	}
	enum TransformMode {
		Normal = 0,
		OnlyTranslation = 1,
		NoRotationOrReflection = 2,
		NoScale = 3,
		NoScaleOrReflection = 4
	}
}
declare namespace sp.spine {
	abstract class ConstraintData {
		name: string;
		order: number;
		skinRequired: boolean;
		constructor(name: string, order: number, skinRequired: boolean);
	}
}
declare namespace sp.spine {
	class Event {
		data: EventData;
		intValue: number;
		floatValue: number;
		stringValue: string;
		time: number;
		volume: number;
		balance: number;
		constructor(time: number, data: EventData);
	}
}
declare namespace sp.spine {
	class EventData {
		name: string;
		intValue: number;
		floatValue: number;
		stringValue: string;
		audioPath: string;
		volume: number;
		balance: number;
		constructor(name: string);
	}
}
declare namespace sp.spine {
	class IkConstraint implements Updatable {
		data: IkConstraintData;
		bones: Array<Bone>;
		target: Bone;
		bendDirection: number;
		compress: boolean;
		stretch: boolean;
		mix: number;
		softness: number;
		active: boolean;
		constructor(data: IkConstraintData, skeleton: Skeleton);
		isActive(): boolean;
		apply(): void;
		update(): void;
		apply1(bone: Bone, targetX: number, targetY: number, compress: boolean, stretch: boolean, uniform: boolean, alpha: number): void;
		apply2(parent: Bone, child: Bone, targetX: number, targetY: number, bendDir: number, stretch: boolean, softness: number, alpha: number): void;
	}
}
declare namespace sp.spine {
	class IkConstraintData extends ConstraintData {
		bones: BoneData[];
		target: BoneData;
		bendDirection: number;
		compress: boolean;
		stretch: boolean;
		uniform: boolean;
		mix: number;
		softness: number;
		constructor(name: string);
	}
}
declare namespace sp.spine {
	class PathConstraint implements Updatable {
		static NONE: number;
		static BEFORE: number;
		static AFTER: number;
		static epsilon: number;
		data: PathConstraintData;
		bones: Array<Bone>;
		target: Slot;
		position: number;
		spacing: number;
		rotateMix: number;
		translateMix: number;
		spaces: number[];
		positions: number[];
		world: number[];
		curves: number[];
		lengths: number[];
		segments: number[];
		active: boolean;
		constructor(data: PathConstraintData, skeleton: Skeleton);
		isActive(): boolean;
		apply(): void;
		update(): void;
		computeWorldPositions(path: PathAttachment, spacesCount: number, tangents: boolean, percentPosition: boolean, percentSpacing: boolean): number[];
		addBeforePosition(p: number, temp: Array<number>, i: number, out: Array<number>, o: number): void;
		addAfterPosition(p: number, temp: Array<number>, i: number, out: Array<number>, o: number): void;
		addCurvePosition(p: number, x1: number, y1: number, cx1: number, cy1: number, cx2: number, cy2: number, x2: number, y2: number, out: Array<number>, o: number, tangents: boolean): void;
	}
}
declare namespace sp.spine {
	class PathConstraintData extends ConstraintData {
		bones: BoneData[];
		target: SlotData;
		positionMode: PositionMode;
		spacingMode: SpacingMode;
		rotateMode: RotateMode;
		offsetRotation: number;
		position: number;
		spacing: number;
		rotateMix: number;
		translateMix: number;
		constructor(name: string);
	}
	enum PositionMode {
		Fixed = 0,
		Percent = 1
	}
	enum SpacingMode {
		Length = 0,
		Fixed = 1,
		Percent = 2
	}
	enum RotateMode {
		Tangent = 0,
		Chain = 1,
		ChainScale = 2
	}
}
declare namespace sp.spine {
	class SharedAssetManager implements Disposable {
		private pathPrefix;
		private clientAssets;
		private queuedAssets;
		private rawAssets;
		private errors;
		constructor(pathPrefix?: string);
		private queueAsset;
		loadText(clientId: string, path: string): void;
		loadJson(clientId: string, path: string): void;
		loadTexture(clientId: string, textureLoader: (image: HTMLImageElement) => any, path: string): void;
		get(clientId: string, path: string): any;
		private updateClientAssets;
		isLoadingComplete(clientId: string): boolean;
		dispose(): void;
		hasErrors(): boolean;
		getErrors(): Map<string>;
	}
}
declare namespace sp.spine {
	class Skeleton {
		data: SkeletonData;
		bones: Array<Bone>;
		slots: Array<Slot>;
		drawOrder: Array<Slot>;
		ikConstraints: Array<IkConstraint>;
		transformConstraints: Array<TransformConstraint>;
		pathConstraints: Array<PathConstraint>;
		_updateCache: Updatable[];
		updateCacheReset: Updatable[];
		skin: Skin;
		color: Color;
		time: number;
		scaleX: number;
		scaleY: number;
		x: number;
		y: number;
		constructor(data: SkeletonData);
		updateCache(): void;
		sortIkConstraint(constraint: IkConstraint): void;
		sortPathConstraint(constraint: PathConstraint): void;
		sortTransformConstraint(constraint: TransformConstraint): void;
		sortPathConstraintAttachment(skin: Skin, slotIndex: number, slotBone: Bone): void;
		sortPathConstraintAttachmentWith(attachment: Attachment, slotBone: Bone): void;
		sortBone(bone: Bone): void;
		sortReset(bones: Array<Bone>): void;
		updateWorldTransform(): void;
		setToSetupPose(): void;
		setBonesToSetupPose(): void;
		setSlotsToSetupPose(): void;
		getRootBone(): Bone;
		findBone(boneName: string): Bone;
		findBoneIndex(boneName: string): number;
		findSlot(slotName: string): Slot;
		findSlotIndex(slotName: string): number;
		setSkinByName(skinName: string): void;
		setSkin(newSkin: Skin): void;
		getAttachmentByName(slotName: string, attachmentName: string): Attachment;
		getAttachment(slotIndex: number, attachmentName: string): Attachment;
		setAttachment(slotName: string, attachmentName: string): void;
		findIkConstraint(constraintName: string): IkConstraint;
		findTransformConstraint(constraintName: string): TransformConstraint;
		findPathConstraint(constraintName: string): PathConstraint;
		getBounds(offset: Vector2, size: Vector2, temp?: Array<number>): void;
		update(delta: number): void;
	}
}
declare namespace sp.spine {
	class SkeletonBinary {
		static AttachmentTypeValues: number[];
		static TransformModeValues: TransformMode[];
		static PositionModeValues: PositionMode[];
		static SpacingModeValues: SpacingMode[];
		static RotateModeValues: RotateMode[];
		static BlendModeValues: BlendMode[];
		static BONE_ROTATE: number;
		static BONE_TRANSLATE: number;
		static BONE_SCALE: number;
		static BONE_SHEAR: number;
		static SLOT_ATTACHMENT: number;
		static SLOT_COLOR: number;
		static SLOT_TWO_COLOR: number;
		static PATH_POSITION: number;
		static PATH_SPACING: number;
		static PATH_MIX: number;
		static CURVE_LINEAR: number;
		static CURVE_STEPPED: number;
		static CURVE_BEZIER: number;
		scale: number;
		attachmentLoader: AttachmentLoader;
		private linkedMeshes;
		constructor(attachmentLoader: AttachmentLoader);
		readSkeletonData(binary: Uint8Array): SkeletonData;
		private readSkin;
		private readAttachment;
		private readVertices;
		private readFloatArray;
		private readShortArray;
		private readAnimation;
		private readCurve;
		setCurve(timeline: CurveTimeline, frameIndex: number, cx1: number, cy1: number, cx2: number, cy2: number): void;
	}
}
declare namespace sp.spine {
	class SkeletonBounds {
		minX: number;
		minY: number;
		maxX: number;
		maxY: number;
		boundingBoxes: BoundingBoxAttachment[];
		polygons: ArrayLike<number>[];
		private polygonPool;
		update(skeleton: Skeleton, updateAabb: boolean): void;
		aabbCompute(): void;
		aabbContainsPoint(x: number, y: number): boolean;
		aabbIntersectsSegment(x1: number, y1: number, x2: number, y2: number): boolean;
		aabbIntersectsSkeleton(bounds: SkeletonBounds): boolean;
		containsPoint(x: number, y: number): BoundingBoxAttachment;
		containsPointPolygon(polygon: ArrayLike<number>, x: number, y: number): boolean;
		intersectsSegment(x1: number, y1: number, x2: number, y2: number): BoundingBoxAttachment;
		intersectsSegmentPolygon(polygon: ArrayLike<number>, x1: number, y1: number, x2: number, y2: number): boolean;
		getPolygon(boundingBox: BoundingBoxAttachment): ArrayLike<number>;
		getWidth(): number;
		getHeight(): number;
	}
}
declare namespace sp.spine {
	class SkeletonClipping {
		private triangulator;
		private clippingPolygon;
		private clipOutput;
		clippedVertices: number[];
		clippedTriangles: number[];
		private scratch;
		private clipAttachment;
		private clippingPolygons;
		clipStart(slot: Slot, clip: ClippingAttachment): number;
		clipEndWithSlot(slot: Slot): void;
		clipEnd(): void;
		isClipping(): boolean;
		clipTriangles(vertices: ArrayLike<number>, verticesLength: number, triangles: ArrayLike<number>, trianglesLength: number, uvs: ArrayLike<number>, light: Color, dark: Color, twoColor: boolean): void;
		clip(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, clippingArea: Array<number>, output: Array<number>): boolean;
		static makeClockwise(polygon: ArrayLike<number>): void;
	}
}
declare namespace sp.spine {
	class SkeletonData {
		name: string;
		bones: BoneData[];
		slots: SlotData[];
		skins: Skin[];
		defaultSkin: Skin;
		events: EventData[];
		animations: Animation[];
		ikConstraints: IkConstraintData[];
		transformConstraints: TransformConstraintData[];
		pathConstraints: PathConstraintData[];
		x: number;
		y: number;
		width: number;
		height: number;
		version: string;
		hash: string;
		fps: number;
		imagesPath: string;
		audioPath: string;
		findBone(boneName: string): BoneData;
		findBoneIndex(boneName: string): number;
		findSlot(slotName: string): SlotData;
		findSlotIndex(slotName: string): number;
		findSkin(skinName: string): Skin;
		findEvent(eventDataName: string): EventData;
		findAnimation(animationName: string): Animation;
		findIkConstraint(constraintName: string): IkConstraintData;
		findTransformConstraint(constraintName: string): TransformConstraintData;
		findPathConstraint(constraintName: string): PathConstraintData;
		findPathConstraintIndex(pathConstraintName: string): number;
	}
}
declare namespace sp.spine {
	class SkeletonJson {
		attachmentLoader: AttachmentLoader;
		scale: number;
		private linkedMeshes;
		constructor(attachmentLoader: AttachmentLoader);
		readSkeletonData(json: string | any): SkeletonData;
		readAttachment(map: any, skin: Skin, slotIndex: number, name: string, skeletonData: SkeletonData): Attachment;
		readVertices(map: any, attachment: VertexAttachment, verticesLength: number): void;
		readAnimation(map: any, name: string, skeletonData: SkeletonData): void;
		readCurve(map: any, timeline: CurveTimeline, frameIndex: number): void;
		getValue(map: any, prop: string, defaultValue: any): any;
		static blendModeFromString(str: string): BlendMode;
		static positionModeFromString(str: string): PositionMode;
		static spacingModeFromString(str: string): SpacingMode;
		static rotateModeFromString(str: string): RotateMode;
		static transformModeFromString(str: string): TransformMode;
	}
}
declare namespace sp.spine {
	class SkinEntry {
		slotIndex: number;
		name: string;
		attachment: Attachment;
		constructor(slotIndex: number, name: string, attachment: Attachment);
	}
	class Skin {
		name: string;
		attachments: Map<Attachment>[];
		bones: BoneData[];
		constraints: ConstraintData[];
		constructor(name: string);
		setAttachment(slotIndex: number, name: string, attachment: Attachment): void;
		addSkin(skin: Skin): void;
		copySkin(skin: Skin): void;
		getAttachment(slotIndex: number, name: string): Attachment;
		removeAttachment(slotIndex: number, name: string): void;
		getAttachments(): Array<SkinEntry>;
		getAttachmentsForSlot(slotIndex: number, attachments: Array<SkinEntry>): void;
		clear(): void;
		attachAll(skeleton: Skeleton, oldSkin: Skin): void;
	}
}
declare namespace sp.spine {
	class Slot {
		data: SlotData;
		bone: Bone;
		color: Color;
		darkColor: Color;
		private attachment;
		private attachmentTime;
		deform: number[];
		constructor(data: SlotData, bone: Bone);
		getSkeleton(): Skeleton;
		getAttachment(): Attachment;
		setAttachment(attachment: Attachment): void;
		setAttachmentTime(time: number): void;
		getAttachmentTime(): number;
		setToSetupPose(): void;
	}
}
declare namespace sp.spine {
	class SlotData {
		index: number;
		name: string;
		boneData: BoneData;
		color: Color;
		darkColor: Color;
		attachmentName: string;
		blendMode: BlendMode;
		constructor(index: number, name: string, boneData: BoneData);
	}
}
declare namespace sp.spine {
	abstract class Texture {
		protected _image: HTMLImageElement;
		constructor(image: HTMLImageElement);
		getImage(): HTMLImageElement;
		abstract setFilters(minFilter: TextureFilter, magFilter: TextureFilter): void;
		abstract setWraps(uWrap: TextureWrap, vWrap: TextureWrap): void;
		abstract dispose(): void;
		static filterFromString(text: string): TextureFilter;
		static wrapFromString(text: string): TextureWrap;
	}
	enum TextureFilter {
		Nearest = 9728,
		Linear = 9729,
		MipMap = 9987,
		MipMapNearestNearest = 9984,
		MipMapLinearNearest = 9985,
		MipMapNearestLinear = 9986,
		MipMapLinearLinear = 9987
	}
	enum TextureWrap {
		MirroredRepeat = 33648,
		ClampToEdge = 33071,
		Repeat = 10497
	}
	class TextureRegion {
		renderObject: any;
		u: number;
		v: number;
		u2: number;
		v2: number;
		width: number;
		height: number;
		rotate: boolean;
		offsetX: number;
		offsetY: number;
		originalWidth: number;
		originalHeight: number;
	}
	class FakeTexture extends Texture {
		setFilters(minFilter: TextureFilter, magFilter: TextureFilter): void;
		setWraps(uWrap: TextureWrap, vWrap: TextureWrap): void;
		dispose(): void;
	}
}
declare namespace sp.spine {
	class TextureAtlas implements Disposable {
		pages: TextureAtlasPage[];
		regions: TextureAtlasRegion[];
		constructor(atlasText: string, textureLoader: (path: string) => any);
		private load;
		findRegion(name: string): TextureAtlasRegion;
		dispose(): void;
	}
	class TextureAtlasPage {
		name: string;
		minFilter: TextureFilter;
		magFilter: TextureFilter;
		uWrap: TextureWrap;
		vWrap: TextureWrap;
		texture: Texture;
		width: number;
		height: number;
	}
	class TextureAtlasRegion extends TextureRegion {
		page: TextureAtlasPage;
		name: string;
		x: number;
		y: number;
		index: number;
		rotate: boolean;
		degrees: number;
		texture: Texture;
	}
}
declare namespace sp.spine {
	class TransformConstraint implements Updatable {
		data: TransformConstraintData;
		bones: Array<Bone>;
		target: Bone;
		rotateMix: number;
		translateMix: number;
		scaleMix: number;
		shearMix: number;
		temp: Vector2;
		active: boolean;
		constructor(data: TransformConstraintData, skeleton: Skeleton);
		isActive(): boolean;
		apply(): void;
		update(): void;
		applyAbsoluteWorld(): void;
		applyRelativeWorld(): void;
		applyAbsoluteLocal(): void;
		applyRelativeLocal(): void;
	}
}
declare namespace sp.spine {
	class TransformConstraintData extends ConstraintData {
		bones: BoneData[];
		target: BoneData;
		rotateMix: number;
		translateMix: number;
		scaleMix: number;
		shearMix: number;
		offsetRotation: number;
		offsetX: number;
		offsetY: number;
		offsetScaleX: number;
		offsetScaleY: number;
		offsetShearY: number;
		relative: boolean;
		local: boolean;
		constructor(name: string);
	}
}
declare namespace sp.spine {
	class Triangulator {
		private convexPolygons;
		private convexPolygonsIndices;
		private indicesArray;
		private isConcaveArray;
		private triangles;
		private polygonPool;
		private polygonIndicesPool;
		triangulate(verticesArray: ArrayLike<number>): Array<number>;
		decompose(verticesArray: Array<number>, triangles: Array<number>): Array<Array<number>>;
		private static isConcave;
		private static positiveArea;
		private static winding;
	}
}
declare namespace sp.spine {
	interface Updatable {
		update(): void;
		isActive(): boolean;
	}
}
declare namespace sp.spine {
	interface Map<T> {
		[key: string]: T;
	}
	class IntSet {
		array: number[];
		add(value: number): boolean;
		contains(value: number): boolean;
		remove(value: number): void;
		clear(): void;
	}
	interface Disposable {
		dispose(): void;
	}
	interface Restorable {
		restore(): void;
	}
	class Color {
		r: number;
		g: number;
		b: number;
		a: number;
		static WHITE: Color;
		static RED: Color;
		static GREEN: Color;
		static BLUE: Color;
		static MAGENTA: Color;
		constructor(r?: number, g?: number, b?: number, a?: number);
		set(r: number, g: number, b: number, a: number): this;
		setFromColor(c: Color): this;
		setFromString(hex: string): this;
		add(r: number, g: number, b: number, a: number): this;
		clamp(): this;
		static rgba8888ToColor(color: Color, value: number): void;
		static rgb888ToColor(color: Color, value: number): void;
	}
	class MathUtils {
		static PI: number;
		static PI2: number;
		static radiansToDegrees: number;
		static radDeg: number;
		static degreesToRadians: number;
		static degRad: number;
		static clamp(value: number, min: number, max: number): number;
		static cosDeg(degrees: number): number;
		static sinDeg(degrees: number): number;
		static signum(value: number): number;
		static toInt(x: number): number;
		static cbrt(x: number): number;
		static randomTriangular(min: number, max: number): number;
		static randomTriangularWith(min: number, max: number, mode: number): number;
	}
	abstract class Interpolation {
		protected abstract applyInternal(a: number): number;
		apply(start: number, end: number, a: number): number;
	}
	class Pow extends Interpolation {
		protected power: number;
		constructor(power: number);
		applyInternal(a: number): number;
	}
	class PowOut extends Pow {
		constructor(power: number);
		applyInternal(a: number): number;
	}
	class Utils {
		static SUPPORTS_TYPED_ARRAYS: boolean;
		static arrayCopy<T>(source: ArrayLike<T>, sourceStart: number, dest: ArrayLike<T>, destStart: number, numElements: number): void;
		static setArraySize<T>(array: Array<T>, size: number, value?: any): Array<T>;
		static ensureArrayCapacity<T>(array: Array<T>, size: number, value?: any): Array<T>;
		static newArray<T>(size: number, defaultValue: T): Array<T>;
		static newFloatArray(size: number): ArrayLike<number>;
		static newShortArray(size: number): ArrayLike<number>;
		static toFloatArray(array: Array<number>): number[] | Float32Array;
		static toSinglePrecision(value: number): number;
		static webkit602BugfixHelper(alpha: number, blend: MixBlend): void;
		static contains<T>(array: Array<T>, element: T, identity?: boolean): boolean;
	}
	class DebugUtils {
		static logBones(skeleton: Skeleton): void;
	}
	class Pool<T> {
		private items;
		private instantiator;
		constructor(instantiator: () => T);
		obtain(): T;
		free(item: T): void;
		freeAll(items: ArrayLike<T>): void;
		clear(): void;
	}
	class Vector2 {
		x: number;
		y: number;
		constructor(x?: number, y?: number);
		set(x: number, y: number): Vector2;
		length(): number;
		normalize(): this;
	}
	class TimeKeeper {
		maxDelta: number;
		framesPerSecond: number;
		delta: number;
		totalTime: number;
		private lastTime;
		private frameCount;
		private frameTime;
		update(): void;
	}
	interface ArrayLike<T> {
		length: number;
		[n: number]: T;
	}
	class WindowedMean {
		values: Array<number>;
		addedValues: number;
		lastValue: number;
		mean: number;
		dirty: boolean;
		constructor(windowSize?: number);
		hasEnoughData(): boolean;
		addValue(value: number): void;
		getMean(): number;
	}
}
declare namespace sp.spine {
	interface VertexEffect {
		begin(skeleton: Skeleton): void;
		transform(position: Vector2, uv: Vector2, light: Color, dark: Color): void;
		end(): void;
	}
}
interface Math {
	fround(n: number): number;
}
declare namespace sp.spine {
	abstract class Attachment {
		name: string;
		constructor(name: string);
		abstract copy(): Attachment;
	}
	abstract class VertexAttachment extends Attachment {
		private static nextID;
		id: number;
		bones: Array<number>;
		vertices: ArrayLike<number>;
		worldVerticesLength: number;
		deformAttachment: VertexAttachment;
		constructor(name: string);
		computeWorldVertices(slot: Slot, start: number, count: number, worldVertices: ArrayLike<number>, offset: number, stride: number): void;
		copyTo(attachment: VertexAttachment): void;
	}
}
declare namespace sp.spine {
	interface AttachmentLoader {
		newRegionAttachment(skin: Skin, name: string, path: string): RegionAttachment;
		newMeshAttachment(skin: Skin, name: string, path: string): MeshAttachment;
		newBoundingBoxAttachment(skin: Skin, name: string): BoundingBoxAttachment;
		newPathAttachment(skin: Skin, name: string): PathAttachment;
		newPointAttachment(skin: Skin, name: string): PointAttachment;
		newClippingAttachment(skin: Skin, name: string): ClippingAttachment;
	}
}
declare namespace sp.spine {
	enum AttachmentType {
		Region = 0,
		BoundingBox = 1,
		Mesh = 2,
		LinkedMesh = 3,
		Path = 4,
		Point = 5,
		Clipping = 6
	}
}
declare namespace sp.spine {
	class BoundingBoxAttachment extends VertexAttachment {
		color: Color;
		constructor(name: string);
		copy(): Attachment;
	}
}
declare namespace sp.spine {
	class ClippingAttachment extends VertexAttachment {
		endSlot: SlotData;
		color: Color;
		constructor(name: string);
		copy(): Attachment;
	}
}
declare namespace sp.spine {
	class MeshAttachment extends VertexAttachment {
		region: TextureRegion;
		path: string;
		regionUVs: ArrayLike<number>;
		uvs: ArrayLike<number>;
		triangles: Array<number>;
		color: Color;
		width: number;
		height: number;
		hullLength: number;
		edges: Array<number>;
		private parentMesh;
		tempColor: Color;
		constructor(name: string);
		updateUVs(): void;
		getParentMesh(): MeshAttachment;
		setParentMesh(parentMesh: MeshAttachment): void;
		copy(): Attachment;
		newLinkedMesh(): MeshAttachment;
	}
}
declare namespace sp.spine {
	class PathAttachment extends VertexAttachment {
		lengths: Array<number>;
		closed: boolean;
		constantSpeed: boolean;
		color: Color;
		constructor(name: string);
		copy(): Attachment;
	}
}
declare namespace sp.spine {
	class PointAttachment extends VertexAttachment {
		x: number;
		y: number;
		rotation: number;
		color: Color;
		constructor(name: string);
		computeWorldPosition(bone: Bone, point: Vector2): Vector2;
		computeWorldRotation(bone: Bone): number;
		copy(): Attachment;
	}
}
declare namespace sp.spine {
	class RegionAttachment extends Attachment {
		static OX1: number;
		static OY1: number;
		static OX2: number;
		static OY2: number;
		static OX3: number;
		static OY3: number;
		static OX4: number;
		static OY4: number;
		static X1: number;
		static Y1: number;
		static C1R: number;
		static C1G: number;
		static C1B: number;
		static C1A: number;
		static U1: number;
		static V1: number;
		static X2: number;
		static Y2: number;
		static C2R: number;
		static C2G: number;
		static C2B: number;
		static C2A: number;
		static U2: number;
		static V2: number;
		static X3: number;
		static Y3: number;
		static C3R: number;
		static C3G: number;
		static C3B: number;
		static C3A: number;
		static U3: number;
		static V3: number;
		static X4: number;
		static Y4: number;
		static C4R: number;
		static C4G: number;
		static C4B: number;
		static C4A: number;
		static U4: number;
		static V4: number;
		x: number;
		y: number;
		scaleX: number;
		scaleY: number;
		rotation: number;
		width: number;
		height: number;
		color: Color;
		path: string;
		rendererObject: any;
		region: TextureRegion;
		offset: ArrayLike<number>;
		uvs: ArrayLike<number>;
		tempColor: Color;
		constructor(name: string);
		updateOffset(): void;
		setRegion(region: TextureRegion): void;
		computeWorldVertices(bone: Bone, worldVertices: ArrayLike<number>, offset: number, stride: number): void;
		copy(): Attachment;
	}
}
declare namespace sp.spine {
	class JitterEffect implements VertexEffect {
		jitterX: number;
		jitterY: number;
		constructor(jitterX: number, jitterY: number);
		begin(skeleton: Skeleton): void;
		transform(position: Vector2, uv: Vector2, light: Color, dark: Color): void;
		end(): void;
	}
}
declare namespace sp.spine {
	class SwirlEffect implements VertexEffect {
		static interpolation: PowOut;
		centerX: number;
		centerY: number;
		radius: number;
		angle: number;
		private worldX;
		private worldY;
		constructor(radius: number);
		begin(skeleton: Skeleton): void;
		transform(position: Vector2, uv: Vector2, light: Color, dark: Color): void;
		end(): void;
	}
}

/**
 * API for jsb module
 * Author: haroel
 * Homepage: https://github.com/haroel/creatorexDTS
 */
declare namespace jsb{
    export module reflection{
        /**
         * https://docs.cocos.com/creator/manual/zh/advanced-topics/java-reflection.html
         * call OBJC/Java static methods
         * 
         * @param className 
         * @param methodName 
         * @param methodSignature 
         * @param parameters 
         */
        export function callStaticMethod(className: string, methodName: string, methodSignature: string, ...parameters:any): any;
    }
    /**
     * 下载任务对象
     */
    export type DownloaderTask = { requestURL: string, storagePath: string, identifier: string };

    /**
     * Http file downloader for jsb！
     */
    export class Downloader{
        /**
         * create a download task
         * @param requestURL 
         * @param storagePath 
         * @param identifier 
         */
        createDownloadFileTask(requestURL:string, storagePath:string, identifier?:string): DownloaderTask;

        setOnFileTaskSuccess(onSucceed: (task: DownloaderTask) => void): void;

        setOnTaskProgress(onProgress: (task: DownloaderTask, bytesReceived: number, totalBytesReceived: number, totalBytesExpected: number) => void): void;

        setOnTaskError(onError: (task: DownloaderTask, errorCode: number, errorCodeInternal: number, errorStr: string) => void): void;

    }

    /**
     * FileUtils  Helper class to handle file operations.
     */
    export module fileUtils{
        /**
         *  Checks whether the path is an absolute path.
         *
         *  @note On Android, if the parameter passed in is relative to "@assets/", this method will treat it as an absolute path.
         *        Also on Blackberry, path starts with "app/native/Resources/" is treated as an absolute path.
         *
         *  @param path The path that needs to be checked.
         *  @return True if it's an absolute path, false if not.
         */
        export function isAbsolutePath(path:string):boolean;
        /** Returns the fullpath for a given filename.

        First it will try to get a new filename from the "filenameLookup" dictionary.
        If a new filename can't be found on the dictionary, it will use the original filename.
        Then it will try to obtain the full path of the filename using the FileUtils search rules: resolutions, and search paths.
        The file search is based on the array element order of search paths and resolution directories.

        For instance:

            We set two elements("/mnt/sdcard/", "internal_dir/") to search paths vector by setSearchPaths,
            and set three elements("resources-ipadhd/", "resources-ipad/", "resources-iphonehd")
            to resolutions vector by setSearchResolutionsOrder. The "internal_dir" is relative to "Resources/".

            If we have a file named 'sprite.png', the mapping in fileLookup dictionary contains `key: sprite.png -> value: sprite.pvr.gz`.
            Firstly, it will replace 'sprite.png' with 'sprite.pvr.gz', then searching the file sprite.pvr.gz as follows:

                /mnt/sdcard/resources-ipadhd/sprite.pvr.gz      (if not found, search next)
                /mnt/sdcard/resources-ipad/sprite.pvr.gz        (if not found, search next)
                /mnt/sdcard/resources-iphonehd/sprite.pvr.gz    (if not found, search next)
                /mnt/sdcard/sprite.pvr.gz                       (if not found, search next)
                internal_dir/resources-ipadhd/sprite.pvr.gz     (if not found, search next)
                internal_dir/resources-ipad/sprite.pvr.gz       (if not found, search next)
                internal_dir/resources-iphonehd/sprite.pvr.gz   (if not found, search next)
                internal_dir/sprite.pvr.gz                      (if not found, return "sprite.png")

            If the filename contains relative path like "gamescene/uilayer/sprite.png",
            and the mapping in fileLookup dictionary contains `key: gamescene/uilayer/sprite.png -> value: gamescene/uilayer/sprite.pvr.gz`.
            The file search order will be:

                /mnt/sdcard/gamescene/uilayer/resources-ipadhd/sprite.pvr.gz      (if not found, search next)
                /mnt/sdcard/gamescene/uilayer/resources-ipad/sprite.pvr.gz        (if not found, search next)
                /mnt/sdcard/gamescene/uilayer/resources-iphonehd/sprite.pvr.gz    (if not found, search next)
                /mnt/sdcard/gamescene/uilayer/sprite.pvr.gz                       (if not found, search next)
                internal_dir/gamescene/uilayer/resources-ipadhd/sprite.pvr.gz     (if not found, search next)
                internal_dir/gamescene/uilayer/resources-ipad/sprite.pvr.gz       (if not found, search next)
                internal_dir/gamescene/uilayer/resources-iphonehd/sprite.pvr.gz   (if not found, search next)
                internal_dir/gamescene/uilayer/sprite.pvr.gz                      (if not found, return "gamescene/uilayer/sprite.png")

        If the new file can't be found on the file system, it will return the parameter filename directly.

        This method was added to simplify multiplatform support. Whether you are using cocos2d-js or any cross-compilation toolchain like StellaSDK or Apportable,
        you might need to load different resources for a given file in the different platforms.

        @since v2.1
        */
        export function fullPathForFilename(filename:string):string;
        /**
         *  Gets string from a file.
        */
        export function getStringFromFile(filename:string):string;
        /**
         *  Removes a file.
         *
         *  @param filepath The full path of the file, it must be an absolute path.
         *  @return True if the file have been removed successfully, false if not.
         */
        export function removeFile(filepath:string):boolean;
        /**
         *  Checks whether the path is a directory.
         *
         *  @param dirPath The path of the directory, it could be a relative or an absolute path.
         *  @return True if the directory exists, false if not.
         */
        export function isDirectoryExist(dirPath:string):boolean;
        /**
         * Normalize: remove . and ..
         * @param filepath 
         */
        export function normalizePath(filepath:string):string;
        /**
         * Get default resource root path.
         */
        export function getDefaultResourceRootPath():string;
        /**
         * Loads the filenameLookup dictionary from the contents of a filename.
         *
         * @note The plist file name should follow the format below:
         *
         * @code
         * <?xml version="1.0" encoding="UTF-8"?>
         * <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
         * <plist version="1.0">
         * <dict>
         *     <key>filenames</key>
         *     <dict>
         *         <key>sounds/click.wav</key>
         *         <string>sounds/click.caf</string>
         *         <key>sounds/endgame.wav</key>
         *         <string>sounds/endgame.caf</string>
         *         <key>sounds/gem-0.wav</key>
         *         <string>sounds/gem-0.caf</string>
         *     </dict>
         *     <key>metadata</key>
         *     <dict>
         *         <key>version</key>
         *         <integer>1</integer>
         *     </dict>
         * </dict>
         * </plist>
         * @endcode
         * @param filename The plist file name.
         *
         @since v2.1
        * @js loadFilenameLookup
        * @lua loadFilenameLookup
        */
        export function loadFilenameLookup(filepath:string):void;
        /** Checks whether to pop up a message box when failed to load an image.
         *  @return True if pop up a message box when failed to load an image, false if not.
         */
        export function isPopupNotify():boolean;
        /**
         *  Sets whether to pop-up a message box when failed to load an image.
         */
        export function setPopupNotify(notify:boolean):void;

        // Converts the contents of a file to a ValueVector.
        // This method is used internally.
        export function getValueVectorFromFile(filepath:string):Array<any>;
        /**
         *  Gets the array of search paths.
         *
         *  @return The array of search paths which may contain the prefix of default resource root path. 
         *  @note In best practise, getter function should return the value of setter function passes in.
         *        But since we should not break the compatibility, we keep using the old logic. 
         *        Therefore, If you want to get the original search paths, please call 'getOriginalSearchPaths()' instead.
         *  @see fullPathForFilename(const char*).
         *  @lua NA
         */
        export function getSearchPaths(filepath:string):Array<string>;
        /**
         * 
         * @param filepath 
         */
        export function getFileDir(filepath:string):string;
        /**
        * write a ValueMap into a plist file
        *
        *@param dict the ValueMap want to save (key,value)
        *@param fullPath The full path to the file you want to save a string
        *@return bool
        */
        export function writeToFile( valueMap:any ):boolean;
        /**
         *  Gets the original search path array set by 'setSearchPaths' or 'addSearchPath'.
         *  @return The array of the original search paths
         */
        export function getOriginalSearchPaths():Array<string>;
        /**
         *  List all files in a directory.
         *
         *  @param dirPath The path of the directory, it could be a relative or an absolute path.
         *  @return File paths in a string vector
         */
        export function listFiles(filepath:string):Array<string>;
        /**
         *  Converts the contents of a file to a ValueMap.
         *  @param filename The filename of the file to gets content.
         *  @return ValueMap of the file contents.
         *  @note This method is used internally.
         */
        export function getValueMapFromFile(filepath:string):any;
        /**
         *  Retrieve the file size.
         *
         *  @note If a relative path was passed in, it will be inserted a default root path at the beginning.
         *  @param filepath The path of the file, it could be a relative or absolute path.
         *  @return The file size.
         */
        export function getFileSize(filepath:string):number;

        /** Converts the contents of a file to a ValueMap.
         *  This method is used internally.
         */
        export function getValueMapFromData(filedata:string,filesize:number):any;
        /**
         *  Removes a directory.
         *
         *  @param dirPath  The full path of the directory, it must be an absolute path.
         *  @return True if the directory have been removed successfully, false if not.
         */
        export function removeDirectory(dirPath:string):boolean;
        /**
         *  Sets the array of search paths.
         *
         *  You can use this array to modify the search path of the resources.
         *  If you want to use "themes" or search resources in the "cache", you can do it easily by adding new entries in this array.
         *
         *  @note This method could access relative path and absolute path.
         *        If the relative path was passed to the vector, FileUtils will add the default resource directory before the relative path.
         *        For instance:
         *            On Android, the default resource root path is "@assets/".
         *            If "/mnt/sdcard/" and "resources-large" were set to the search paths vector,
         *            "resources-large" will be converted to "@assets/resources-large" since it was a relative path.
         *
         *  @param searchPaths The array contains search paths.
         *  @see fullPathForFilename(const char*)
         *  @since v2.1
         *  In js:var setSearchPaths(var jsval);
         *  @lua NA
         */
        export function setSearchPaths( searchPath:Array<string>):void;
        /**
         *  write a string into a file
         *
         * @param dataStr the string want to save
         * @param fullPath The full path to the file you want to save a string
         * @return bool True if write success
         */
        export function writeStringToFile(dataStr:string,fullPath:string):boolean;
        /**
         *  Sets the array that contains the search order of the resources.
         *
         *  @param searchResolutionsOrder The source array that contains the search order of the resources.
         *  @see getSearchResolutionsOrder(), fullPathForFilename(const char*).
         *  @since v2.1
         *  In js:var setSearchResolutionsOrder(var jsval)
         *  @lua NA
         */
        export function setSearchResolutionsOrder(searchResolutionsOrder:Array<string>):void;
        /**
         * Append search order of the resources.
         *
         * @see setSearchResolutionsOrder(), fullPathForFilename().
         * @since v2.1
         */
        export function addSearchResolutionsOrder(order:string,front:boolean):void;
        /**
         * Add search path.
         *
         * @since v2.1
         */
        export function addSearchPath(path:string,front:boolean):void;
        /**
        * write ValueVector into a plist file
        *
        *@param vecData the ValueVector want to save
        *@param fullPath The full path to the file you want to save a string
        *@return bool
        */
        export function writeValueVectorToFile(vecData:Array<any>,fullPath:string):boolean;
        /**
         *  Checks whether a file exists.
         *
         *  @note If a relative path was passed in, it will be inserted a default root path at the beginning.
         *  @param filename The path of the file, it could be a relative or absolute path.
         *  @return True if the file exists, false if not.
         */
        export function isFileExist(filename:string):boolean;
        /**©∫
         *  Purges full path caches.
         */
        export function purgeCachedEntries():void;
            /**
         *  Gets full path from a file name and the path of the relative file.
         *  @param filename The file name.
         *  @param relativeFile The path of the relative file.
         *  @return The full path.
         *          e.g. filename: hello.png, pszRelativeFile: /User/path1/path2/hello.plist
         *               Return: /User/path1/path2/hello.pvr (If there a a key(hello.png)-value(hello.pvr) in FilenameLookup dictionary. )
         *
         */
        export function fullPathFromRelativeFile(filename:string,relativeFile:string):string;
        /**
        * Windows fopen can't support UTF-8 filename
        * Need convert all parameters fopen and other 3rd-party libs
        *
        * @param filenameUtf8 std::string name file for conversion from utf-8
        * @return std::string ansi filename in current locale
        */
        export function getSuitableFOpen(filenameUtf8:string):string;
        /**
        * write ValueMap into a plist file
        *
        *@param dict the ValueMap want to save
        *@param fullPath The full path to the file you want to save a string
        *@return bool
        */
        export function writeValueMapToFile(dict:any,fullPath:string):string;
        /**
        *  Gets filename extension is a suffix (separated from the base filename by a dot) in lower case.
        *  Examples of filename extensions are .png, .jpeg, .exe, .dmg and .txt.
        *  @param filePath The path of the file, it could be a relative or absolute path.
        *  @return suffix for filename in lower case or empty if a dot not found.
        */
        export function getFileExtension(filePath:string):string;
        /**
         *  Sets writable path.
         */
        export function setWritablePath(writablePath:string):void;
        /**
         * Set default resource root path.
         */
        export function setDefaultResourceRootPath(filepath:string):void;

        /**
         *  Gets the array that contains the search order of the resources.
         *
         *  @see setSearchResolutionsOrder(const std::vector<std::string>&), fullPathForFilename(const char*).
         *  @since v2.1
         *  @lua NA
         */
        export function getSearchResolutionsOrder():Array<string>;
        /**
         *  Creates a directory.
         *
         *  @param dirPath The path of the directory, it must be an absolute path.
         *  @return True if the directory have been created successfully, false if not.
         */
        export function createDirectory(dirPath:string):string;
        /**
         *  List all files recursively in a directory.
         *
         *  @param dirPath The path of the directory, it could be a relative or an absolute path.
         *  @return File paths in a string vector
         */
        export function listFilesRecursively(dirPath:string, files:Array<string>):void;
        /**
         *  Gets the writable path.
         *  @return  The path that can be write/read a file in
         */
        export function getWritablePath():string;
    }
}

/** Running in the editor. */
declare const CC_EDITOR: boolean;
/** Preview in browser or simulator. */
declare const CC_PREVIEW: boolean;
/** Running in the editor or preview. */
declare const CC_DEV: boolean;
/** Running in the editor or preview, or build in debug mode. */
declare const CC_DEBUG: boolean;
/** Running in published project. */
declare const CC_BUILD: boolean;
/** Running in native platforms (mobile app, desktop app, or simulator). */
declare const CC_JSB: boolean;
/** Running in runtime environments. */
declare const CC_RUNTIME: boolean;
/** Running in the engine's unit test. */
declare const CC_TEST: boolean;
/** Running in the WeChat Mini Game. */
declare const CC_WECHATGAME: boolean;
