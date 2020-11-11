const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label!: cc.Label;

    @property
    text: string = 'hello';

    onLoad() {
        const { colorGrad } = cc.EMP.Components
        const labelNode = cc.find('labelNode',this.node)
        const label = cc.find('label', labelNode)
        labelNode.addComponent(colorGrad)._colors = [
            cc.Color.WHITE.fromHEX('#ffffff'),
            cc.Color.WHITE.fromHEX('#5A51FF'),
            cc.Color.WHITE.fromHEX('#8668FF'),
            cc.Color.WHITE.fromHEX('#5A51FF'),
        ]
        setTimeout(() => {
            labelNode.setContentSize(label.width, label.height)
        })
        // init logic
        // this.label.string = this.text;
    }
}
