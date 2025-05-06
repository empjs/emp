import type { Lang, NavConfig } from '../utils';
import { LinkGroup } from './LinkGroup';
import style from './PopoverContent.module.scss';

export const PopoverContent = ({
  lang,
  config,
}: {
  config: NavConfig;
  lang: Lang;
}) => (
  <div>
    {/* <div className={style.header}>
      <a
        href="https://github.com/web-infra-dev"
        target="_blank"
        rel="noreferrer"
        className={style.title}
      >
        <img
          src="https://lf3-static.bytednsdoc.com/obj/eden-cn/rjhwzy/ljhwZthlaukjlkulzlp/web-infra-logo.jpg"
          className={style.logo}
        />
        <div className={style.titleText}>Web Infra</div>
      </a>
    </div> */}
    {config.map(item => (
      <LinkGroup {...item} lang={lang} key={item.title} />
    ))}
  </div>
);
