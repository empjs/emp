/** @format */
const {ccclass, property, executeInEditMode, requireComponent, menu} = cc._decorator

@ccclass
@executeInEditMode
@requireComponent(cc.RenderComponent)
@menu('i18n:MAIN_MENU.component.renderers/ColorAssembler2D-lamyoung.com')
export default class ColorGrad extends cc.Component {
  @property
  public _colors: cc.Color[] = []
  @property({type: [cc.Color]})
  public get colors(): cc.Color[] {
    return this._colors
  }
  public set colors(colors: cc.Color[]) {
    this._colors = colors
    this._updateColors()
  }

  onEnable(): void {
    cc.director.once(cc.Director.EVENT_AFTER_DRAW, this._updateColors, this)
  }

  onDisable(): void {
    cc.director.off(cc.Director.EVENT_AFTER_DRAW, this._updateColors, this)
    ;(this.node as any)['_renderFlag'] |= (cc as any)['RenderFlow'].FLAG_COLOR
  }

  private _updateColors() {
    const cmp = this.getComponent(cc.RenderComponent)
    if (!cmp) return
    const _assembler = (cmp as any)['_assembler']
    if (!(_assembler instanceof (cc as any)['Assembler2D'])) return
    const uintVerts = _assembler._renderData.uintVDatas[0]
    if (!uintVerts) return
    const color = this.node.color
    const floatsPerVert = _assembler.floatsPerVert
    const colorOffset = _assembler.colorOffset
    let count = 0
    const origin = new Uint32Array([
      1124198649,
      1132920832,
      994050048,
      989855744,
      4294967295,
      1130752249,
      1132920832,
      998244352,
      989855744,
      4294967295,
      1124198649,
      1136197632,
      994050048,
      981467136,
      4294967295,
      1130752249,
      1136197632,
      998244352,
      981467136,
      4294967295,
    ])
    uintVerts.forEach((item: any, key: number) => {
      uintVerts[key] = origin[key]
    })
    for (let i = colorOffset, l = uintVerts.length; i < l; i += floatsPerVert) {
      const value = ((this.colors[count++] || color) as any)['_val']
      uintVerts[i] = value
      origin[i] = value
    }

    _assembler._renderData.uintVDatas[0] = origin
  }
}
