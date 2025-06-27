import {HomeHero} from 'rspress/theme'
import sm from './index.module.scss'
export interface Hero {
  name: string
  text: string
  tagline: string
  image?: {
    src: string
    alt: string
  }
  actions: {
    text: string
    link: string
    theme: 'brand' | 'alt'
  }[]
}

const heroList: Hero[] = [
  {
    name: 'Ken Xu',
    text: 'ckken',
    tagline: 'EMP Maintain',
    image: {src: 'https://avatars.githubusercontent.com/u/3890513?v=4', alt: 'ckken'},
    actions: [{text: 'Follow', link: 'https://github.com/ckken', theme: 'brand'}],
  },
  {
    name: 'Lin',
    text: 'linjunjain',
    tagline: 'EMP Admin',
    image: {src: 'https://avatars.githubusercontent.com/u/49704046?v=4', alt: 'linjunjain'},
    actions: [{text: 'Follow', link: 'https://github.com/linjunjain', theme: 'brand'}],
  },
  {
    name: 'xiaoming',
    text: 'doerme',
    tagline: 'EMP Admin',
    image: {src: 'https://avatars.githubusercontent.com/u/2680224?v=4', alt: 'doerme'},
    actions: [{text: 'Follow', link: 'https://github.com/doerme', theme: 'brand'}],
  },
  {
    name: 'Ron0115',
    text: 'ron0115',
    tagline: 'EMP Admin',
    image: {src: 'https://avatars.githubusercontent.com/u/20643950?v=4', alt: 'ron0115'},
    actions: [{text: 'Follow', link: 'https://github.com/ron0115', theme: 'brand'}],
  },
  {
    name: 'CWH0908',
    text: 'CWH0908',
    tagline: 'EMP Admin',
    image: {src: 'https://avatars.githubusercontent.com/u/48054560?v=4', alt: 'CWH0908'},
    actions: [{text: 'Follow', link: 'https://github.com/CWH0908', theme: 'brand'}],
  },
  {
    name: 'Abel',
    text: 'Really-Abel',
    tagline: 'EMP Admin',
    image: {src: 'https://avatars.githubusercontent.com/u/13212561?v=4', alt: 'Really-Abel'},
    actions: [{text: 'Follow', link: 'https://github.com/Really-Abel', theme: 'brand'}],
  },
  {
    name: 'chunyang',
    text: 'wangcylive',
    tagline: 'EMP Admin',
    image: {src: 'https://avatars.githubusercontent.com/u/13819349?v=4', alt: 'Really-Abel'},
    actions: [{text: 'Follow', link: 'https://github.com/wangcylive', theme: 'brand'}],
  },
]

const Hero = ({hero}: {hero: Hero}) => {
  return (
    <div>
      <div className={sm.avatar}>
        <img src={hero.image?.src} />
      </div>
      <div className={sm.name}>{hero.name}</div>
      <div className={sm.subname}>{hero.text}</div>
      <div className={sm.desc}>{hero.tagline}</div>
      <div
        onClick={() => {
          window.open(hero.actions[0].link)
        }}
        className={sm.button}
      >
        {hero.actions[0].text}
      </div>
    </div>
  )
}

const ShowHomeHero = () => {
  return (
    <div className={sm.wrap}>
      {heroList.map(item => (
        <div className={sm.item_wrap} key={item.name}>
          <Hero hero={item} />
        </div>
      ))}
      <div key={'qq'} className={sm.item_wrap}>
        <div className={sm.qq}></div>
        <div className={sm.name}>官方交流群</div>
        <div className={sm.subname}></div>
        <div className={sm.desc}>qq群:951804807</div>
      </div>
    </div>
  )
}

export default ShowHomeHero
