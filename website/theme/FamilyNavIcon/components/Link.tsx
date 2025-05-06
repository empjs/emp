import { Lang } from '../utils';
import style from './Link.module.scss';

export type LinkInfo = {
  name: string;
  desc: string;
  descEn?: string;
  url: string;
  urlEn?: string;
  logo: string;
  logoScale?: number;
};

export type LinkProps = LinkInfo & {
  lang: Lang;
};

const IMAGE_PLACEHOLDER =
  'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';

export const Link = (props: LinkProps) => {
  const desc = props.lang === 'en' && props.descEn ? props.descEn : props.desc;
  const url = props.lang === 'en' && props.urlEn ? props.urlEn : props.url;

  return (
    <a className={style.root} href={url} target="_blank" rel="noreferrer">
      <img
        className={style.logo}
        src={props.logo || IMAGE_PLACEHOLDER}
        style={{
          transform: props.logoScale ? `scale(${props.logoScale})` : '',
        }}
      />
      <div className={style.content}>
        <div className={style.name}>{props.name}</div>
        <div className={style.desc}>{desc}</div>
      </div>
    </a>
  );
};
