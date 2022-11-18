<script setup>
import { VPTeamMembers, VPTeamPageSection, VPHomeSponsors } from 'vitepress/theme'

const members = [
	{
		avatar: 'https://avatars.githubusercontent.com/u/2680224?v=4',
		name: 'JeremyLiang',
		title: 'Developer',
		links: [
			{ icon: 'github', link: 'https://github.com/doerme' },

		]
	},
	{
		avatar: 'https://avatars.githubusercontent.com/u/3890513?v=4',
		name: 'Ken Xu',
		title: 'Creator',
		links: [
			{ icon: 'github', link: 'https://github.com/ckken' },

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
		avatar: 'https://avatars.githubusercontent.com/u/38980823?v=4',
		name: 'movins',
		title: 'Developer',
		links: [
			{ icon: 'github', link: 'https://github.com/movins' },

		]
	},
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
				<div class="item"><div class="box"><img class="logo bdgamelive" src="/img/logo/bdgamelive.png" /></div></div>
				<div class="item"><div class="box"><img class="logo yy" src="/img/logo/yylive.png" /></div></div>
				<div class="item"><div class="box"><img class="logo joyy" src="/img/logo/joyy.png" /></div></div>
				<div class="item"><div class="box"><img class="logo shopline" src="/img/logo/shopline.png" /></div></div>
				<div class="item"><div class="box"><img class="logo wanke" src="/img/logo/wanke.png" /></div></div>
				<div class="item"><div class="box"><img class="logo" src="/img/logo/zuoyebang.jpeg" /></div></div>
				<div class="item"><div class="box"><img class="logo zhuiwan" src="/img/logo/zhuiwan.png" /></div></div>
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
.logos .box{
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
.logos .box:hover img{
	filter: grayscale(0);
	transition: filter .25s;
}
@media only screen and (max-width: 400px) {
  .logos .item{ width: 100%;}
}
@media only screen and (min-width: 400px) and (max-width: 600px) {
  .logos .item{ width: calc((100% - 16px)/2);}
}
@media only screen and (min-width: 600px) and (max-width: 800px) {
  .logos .item{ width: calc((100% - 16px)/4);}
}
</style>
