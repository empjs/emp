import { Link } from "rspress/theme";
import { useUrl } from "../utils";
import styles from "./Overview.module.scss";

export interface GroupItem {
	text: string;
	link: string;
	npm?: string;
}

export interface Group {
	name: string;
	items: GroupItem[];
}

// declare const OVERVIEW_GROUPS: Group[];

export default function Overview({ list }: { list: Group[] }) {
	const Nodes = list.map((group) => (
		<div key={group.name} className={styles.overviewGroups}>
			<div className={styles.group}>
				<h2>{group.name}</h2>
				<ul>
					{group.items.map((item) => (
						<li className={styles.list} key={item.text}>
							<Link href={useUrl(item.link)}>{item.text}</Link>
							{item.npm && (
								<a
									className={styles.npm}
									href={"https://www.npmjs.com/package/" + item.npm}
									target="_blank"
									rel="noreferrer"
								>
									<img
										src={
											"https://img.shields.io/npm/v/" +
											item.npm +
											".svg?label=%20"
										}
									/>
								</a>
							)}
						</li>
					))}
				</ul>
			</div>
		</div>
	));

	return <div className={styles.root}>{Nodes}</div>;
}
