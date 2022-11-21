<script setup>
import { VPTeamMembers, VPTeamPageSection, VPHomeSponsors } from 'vitepress/theme'

const members = [
	{
		avatar: 'https://avatars.githubusercontent.com/u/3890513?v=4',
		name: 'Ken Xu',
		title: 'Creator',
		links: [
			{ icon: 'github', link: 'https://github.com/ckken' },
			{icon:'twitter',link:'https://juejin.cn/column/7019658827918213157'}

		]
	},
	{
		avatar: 'https://avatars.githubusercontent.com/u/2680224?v=4',
		name: 'JeremyLiang',
		title: 'Developer',
		links: [
			{ icon: 'github', link: 'https://github.com/doerme' },

		]
	},
	{
		avatar: 'https://avatars.githubusercontent.com/u/19996552?v=4',
		name: 'Benny Shi',
		title: 'Developer',
		links: [
			{ icon: 'github', link: 'https://github.com/flyyuan' },

		]
	},
	{
		avatar: 'https://avatars.githubusercontent.com/u/20643950?v=4',
		name: 'Ron0115',
		title: 'Developer',
		links: [
			{ icon: 'github', link: 'https://github.com/ron0115' },

		]
	},
]
const links = [
{ name: 'bdgamelive', img: '/img/logo/bdgamelive.png' },
{ name: 'yy', img: '/img/logo/yylive.png' },
{ name: 'joyy', img: '/img/logo/joyy.png' },
{ name: 'shopline', img: '/img/logo/shopline.png' },
{ name: 'wanke', img: '/img/logo/wanke.png' },
{ name: 'zuoyebang', img: '/img/logo/zuoyebang.jpeg' },
{ name: 'yomi', img: '/img/logo/yomi.png' },
{ name: 'yokaihei', img: '/img/logo/yokaihei.png' },
{ name: 'zhuiwan', img: '/img/logo/zhuiwan.png' },
]
</script>

<template>
	<div class="team-members">
		<VPTeamPageSection>
			<template #title>Teams</template>
			<template #members>
				<VPTeamMembers size="small" :members="members" />
			</template>
		</VPTeamPageSection>
	</div>
	<VPTeamPageSection>
		<template #title>Users</template>
		<template #members>

			<div class="logos">
				<div class="item" v-for="(item,index) in links">
					<div class="box"><img class="logo" :class="item.name" :src="item.img" /></div>
				</div>
			</div>

		</template>
	</VPTeamPageSection>
</template>

<style>
.team-members {
	padding: 40px 0;
}

.logos {
	max-width: 1152px;
	display: flex;
	gap: 4px;
	flex-wrap: wrap;
	margin: 0 auto;

}

.logos .item {
	width: calc((100% - 16px)/5);
	flex-shrink: 0;
	background-color: var(--vp-c-bg-soft);
	transition: background-color .25s;
}

.logos .box {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 112px;
	cursor: pointer;
}

.logos img {
	max-width: 120px;
	max-height: 36px;
	filter: grayscale(1);
	transition: filter .25s;
}

.logos .box:hover img {
	filter: grayscale(0);
	transition: filter .25s;
}

@media only screen and (max-width: 400px) {
	.logos .item {
		width: 100%;
	}
}

@media only screen and (min-width: 400px) and (max-width: 600px) {
	.logos .item {
		width: calc((100% - 16px)/2);
	}
}

@media only screen and (min-width: 600px) and (max-width: 800px) {
	.logos .item {
		width: calc((100% - 16px)/4);
	}
}
</style>
