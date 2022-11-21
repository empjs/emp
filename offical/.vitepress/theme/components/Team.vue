<script setup>
import { VPTeamMembers, VPTeamPageSection, VPHomeSponsors } from 'vitepress/theme'
import {members,links} from '../../config/index'
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
